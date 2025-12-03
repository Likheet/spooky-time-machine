import axios, { AxiosError } from 'axios';
import type { GeneratedImage, GeminiImageResponse, ApiError } from '../types';

/**
 * Service for generating images using Google Gemini API
 * Handles API authentication, request/response lifecycle, and error handling
 */
export class ImageGeneratorService {
  private apiKey: string;
  private apiEndpoint: string;
  private model: string;

  constructor(apiKey?: string) {
    // Get API key from parameter or environment variable
    // In browser: import.meta.env.VITE_GEMINI_API_KEY
    // In Node.js tests: pass apiKey directly to constructor
    this.apiKey = apiKey || (import.meta.env?.VITE_GEMINI_API_KEY as string) || '';
    this.model = 'gemini-3-pro-image-preview';
    this.apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
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
        message: 'Gemini API key is not configured. Please set VITE_GEMINI_API_KEY environment variable.',
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
      // Make API request
      const response = await axios.post<GeminiImageResponse>(
        `${this.apiEndpoint}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 60 second timeout
        }
      );

      // Parse response
      return this.parseResponse(response.data, prompt);
    } catch (error) {
      // Handle different error types
      throw this.handleError(error);
    }
  }

  /**
   * Parse the Gemini API response and extract image data
   * @param response - Raw API response
   * @param prompt - Original prompt used
   * @returns GeneratedImage object
   */
  private parseResponse(response: GeminiImageResponse, prompt: string): GeneratedImage {
    // Check for API error in response
    if (response.error) {
      const error: ApiError = {
        message: response.error.message,
        code: response.error.code,
        status: response.error.status,
      };
      this.logError('API Response Error', error);
      throw error;
    }

    // Extract image data from response
    if (!response.candidates || response.candidates.length === 0) {
      const error: ApiError = {
        message: 'No image generated. The API returned an empty response.',
        code: 500,
        status: 'INTERNAL',
      };
      this.logError('Empty Response', error);
      throw error;
    }

    const candidate = response.candidates[0];
    const parts = candidate.content.parts;

    // Find inline image data
    const imagePart = parts.find((part) => part.inlineData);

    if (!imagePart || !imagePart.inlineData) {
      const error: ApiError = {
        message: 'No image data found in API response',
        code: 500,
        status: 'INTERNAL',
      };
      this.logError('Missing Image Data', error);
      throw error;
    }

    // Convert base64 image data to data URL
    const { mimeType, data } = imagePart.inlineData;
    const imageUrl = `data:${mimeType};base64,${data}`;

    return {
      url: imageUrl,
      prompt,
      timestamp: new Date(),
      metadata: {
        model: this.model,
        mimeType,
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
      const axiosError = error as AxiosError<GeminiImageResponse>;

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
      const responseData = axiosError.response.data;

      // Rate limit errors
      if (status === 429) {
        const apiError: ApiError = {
          message: 'Rate limit exceeded. Please wait a few moments before trying again.',
          code: 429,
          status: 'RESOURCE_EXHAUSTED',
          details: responseData?.error?.message,
        };
        this.logError('Rate Limit Error', apiError);
        return apiError;
      }

      // Authentication errors
      if (status === 401 || status === 403) {
        const apiError: ApiError = {
          message: 'Authentication failed. Please check your API key configuration.',
          code: status,
          status: 'UNAUTHENTICATED',
          details: responseData?.error?.message,
        };
        this.logError('Authentication Error', apiError);
        return apiError;
      }

      // API unavailable
      if (status === 503) {
        const apiError: ApiError = {
          message: 'The Gemini API is temporarily unavailable. Please try again later.',
          code: 503,
          status: 'UNAVAILABLE',
          details: responseData?.error?.message,
        };
        this.logError('Service Unavailable', apiError);
        return apiError;
      }

      // Other API errors
      const apiError: ApiError = {
        message: responseData?.error?.message || `API request failed with status ${status}`,
        code: status,
        status: responseData?.error?.status || 'UNKNOWN',
        details: responseData,
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
