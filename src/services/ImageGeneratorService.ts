import type { GeneratedImage, ApiError } from '../types';

/**
 * Service for generating images using Hugging Face Inference API
 * Handles API authentication, request/response lifecycle, and error handling
 */
export class ImageGeneratorService {
  private apiKey: string;
  private apiEndpoint: string;
  private model: string;

  constructor(apiKey?: string) {
    // Get API key from parameter or environment variable
    // In browser: import.meta.env.VITE_HUGGINGFACE_API_TOKEN
    this.apiKey = apiKey || (import.meta.env?.VITE_HUGGINGFACE_API_TOKEN as string) || '';
    // Using Stable Diffusion XL Base 1.0 for high quality free generation
    this.model = 'stabilityai/stable-diffusion-xl-base-1.0';
    this.apiEndpoint = `https://api-inference.huggingface.co/models/${this.model}`;
  }

  /**
   * Set the API key dynamically
   * @param apiKey - The Hugging Face API token
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Check if the API is properly configured
   * @returns true if API key is available
   */
  checkApiStatus(): boolean {
    return this.apiKey.length > 0;
  }

  /**
   * Generate an image based on the provided prompt
   * @param prompt - The text prompt for image generation
   * @returns Promise resolving to GeneratedImage
   * @throws ApiError for various failure scenarios
   */
  async generateImage(prompt: string): Promise<GeneratedImage> {
    // Validate API configuration
    if (!this.checkApiStatus()) {
      const error: ApiError = {
        message: 'Hugging Face API token is not configured. Please set your access token.',
        code: 401,
        status: 'UNAUTHENTICATED',
      };
      this.logError('API Configuration Error', error);
      throw error;
    }

    // Validate prompt
    if (!prompt || prompt.trim().length === 0) {
      const error: ApiError = {
        message: 'Prompt cannot be empty',
        code: 400,
        status: 'INVALID_ARGUMENT',
      };
      this.logError('Invalid Prompt', error);
      throw error;
    }

    try {
      // Make API request to Hugging Face Inference API
      const response = await this.makeRequest(this.apiEndpoint, prompt);

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

      // Parse response
      return this.parseHuggingFaceResponse(arrayBuffer, prompt, response.headers.get('content-type') || '');
    } catch (error) {
      // Handle different error types
      throw this.handleError(error);
    }
  }

  /**
   * Make request with fallback to proxy
   */
  private async makeRequest(url: string, prompt: string): Promise<Response> {
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'x-use-cache': 'false',
    };
    const body = JSON.stringify({ inputs: prompt });

    try {
      // Try direct request first
      return await fetch(url, {
        method: 'POST',
        headers,
        body,
      });
    } catch (error) {
      // If network error (likely CORS), try with proxy
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn('Direct request failed, retrying with CORS proxy...');
        // Using corsproxy.io as a fallback for GitHub Pages
        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
        return await fetch(proxyUrl, {
          method: 'POST',
          headers,
          body,
        });
      }
      throw error;
    }
  }

  /**
   * Parse Hugging Face API response
   */
  private parseHuggingFaceResponse(
    data: ArrayBuffer,
    prompt: string,
    contentType: string
  ): GeneratedImage {
    if (!data || data.byteLength === 0) {
      const error: ApiError = {
        message: 'No image generated. The API returned an empty response.',
        code: 500,
        status: 'INTERNAL',
      };
      this.logError('Empty Response', error);
      throw error;
    }

    // Convert ArrayBuffer to Base64
    const base64 = btoa(
      new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    const mimeType = contentType || 'image/jpeg';
    const imageUrl = `data:${mimeType};base64,${base64}`;

    return {
      url: imageUrl,
      prompt,
      timestamp: new Date(),
      metadata: {
        model: this.model,
        mimeType: mimeType,
      },
    };
  }

  /**
   * Handle HTTP errors from fetch
   */
  private async handleHttpError(response: Response): Promise<never> {
    let errorMessage = `API request failed with status ${response.status}`;
    let errorDetails: any = null;

    try {
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        errorMessage = json.error || errorMessage;
        errorDetails = json;
      } catch {
        errorMessage = text || errorMessage;
      }
    } catch (e) {
      // Ignore body parsing error
    }

    // Rate limit errors
    if (response.status === 429) {
      const apiError: ApiError = {
        message: 'Rate limit exceeded. Please wait a few moments before trying again.',
        code: 429,
        status: 'RESOURCE_EXHAUSTED',
        details: errorMessage,
      };
      this.logError('Rate Limit Error', apiError);
      throw apiError;
    }

    // Authentication errors
    if (response.status === 401 || response.status === 403) {
      const apiError: ApiError = {
        message: 'Authentication failed. Please check your Hugging Face API token.',
        code: response.status,
        status: 'UNAUTHENTICATED',
        details: errorMessage,
      };
      this.logError('Authentication Error', apiError);
      throw apiError;
    }

    // Model loading error
    if (response.status === 503) {
      const apiError: ApiError = {
        message: 'The model is currently loading. Please try again in a few seconds.',
        code: 503,
        status: 'UNAVAILABLE',
        details: errorMessage,
      };
      this.logError('Model Loading', apiError);
      throw apiError;
    }

    const apiError: ApiError = {
      message: errorMessage,
      code: response.status,
      status: 'UNKNOWN',
      details: errorDetails,
    };
    this.logError('API Error', apiError);
    throw apiError;
  }

  /**
   * Handle errors from API calls
   * @param error - Error object
   * @returns ApiError with appropriate message and details
   */
  private handleError(error: unknown): ApiError {
    // If it's already an ApiError (thrown by handleHttpError), rethrow it
    if ((error as ApiError).status) {
      return error as ApiError;
    }

    // Network errors (fetch throws TypeError for network issues)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const apiError: ApiError = {
        message: 'Network error. Please check your internet connection and try again. If this persists, it might be a CORS issue.',
        code: 0,
        status: 'NETWORK_ERROR',
        details: error.message,
      };
      this.logError('Network Error', apiError);
      return apiError;
    }

    // Unknown errors
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      code: 500,
      status: 'INTERNAL',
      details: error,
    };
    this.logError('Unknown Error', apiError);
    return apiError;
  }

  /**
   * Log errors for debugging purposes
   * @param context - Context description
   * @param error - Error object
   */
  private logError(context: string, error: ApiError): void {
    console.error(`[ImageGeneratorService] ${context}:`, {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details,
      timestamp: new Date().toISOString(),
    });
  }
}

// Export singleton instance
export const imageGeneratorService = new ImageGeneratorService();
