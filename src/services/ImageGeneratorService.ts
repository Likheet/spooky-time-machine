import axios, { AxiosError } from 'axios';
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
      const response = await axios.post(
        this.apiEndpoint,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer', // Important for receiving binary image data
          timeout: 120000, // 120 second timeout
        }
      );

      // Parse response
      return this.parseHuggingFaceResponse(response.data, prompt, response.headers['content-type']);
    } catch (error) {
      // Handle different error types
      throw this.handleError(error);
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
   * Handle errors from API calls
   * @param error - Error object from axios or other sources
   * @returns ApiError with appropriate message and details
   */
  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error?: string }>;

      // Network errors
      if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
        const apiError: ApiError = {
          message: 'Request timeout. The image generation took too long. Please try again.',
          code: 408,
          status: 'TIMEOUT',
          details: axiosError.message,
        };
        this.logError('Network Timeout', apiError);
        return apiError;
      }

      if (!axiosError.response) {
        const apiError: ApiError = {
          message: 'Network error. Please check your internet connection and try again.',
          code: 0,
          status: 'NETWORK_ERROR',
          details: axiosError.message,
        };
        this.logError('Network Error', apiError);
        return apiError;
      }

      // HTTP status errors
      const status = axiosError.response.status;

      // Try to parse error message from response body (which might be JSON even if responseType was arraybuffer)
      let errorMessage = axiosError.message;
      try {
        if (axiosError.response.data instanceof ArrayBuffer) {
          const decoder = new TextDecoder('utf-8');
          const text = decoder.decode(axiosError.response.data);
          const json = JSON.parse(text);
          errorMessage = json.error || errorMessage;
        }
      } catch (e) {
        // Ignore parsing error
      }

      // Rate limit errors
      if (status === 429) {
        const apiError: ApiError = {
          message: 'Rate limit exceeded. Please wait a few moments before trying again.',
          code: 429,
          status: 'RESOURCE_EXHAUSTED',
          details: errorMessage,
        };
        this.logError('Rate Limit Error', apiError);
        return apiError;
      }

      // Authentication errors
      if (status === 401 || status === 403) {
        const apiError: ApiError = {
          message: 'Authentication failed. Please check your Hugging Face API token.',
          code: status,
          status: 'UNAUTHENTICATED',
          details: errorMessage,
        };
        this.logError('Authentication Error', apiError);
        return apiError;
      }

      // Model loading error (503 is common for HF inference when model is loading)
      if (status === 503) {
        const apiError: ApiError = {
          message: 'The model is currently loading. Please try again in a few seconds.',
          code: 503,
          status: 'UNAVAILABLE',
          details: errorMessage,
        };
        this.logError('Model Loading', apiError);
        return apiError;
      }

      // Other API errors
      const apiError: ApiError = {
        message: errorMessage || `API request failed with status ${status}`,
        code: status,
        status: 'UNKNOWN',
        details: axiosError.response.data,
      };
      this.logError('API Error', apiError);
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
