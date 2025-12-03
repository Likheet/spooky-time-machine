import { HfInference } from '@huggingface/inference';
import type { GeneratedImage, ApiError } from '../types';

/**
 * Service for generating images using Hugging Face Inference API
 * Uses the official @huggingface/inference library for best compatibility
 */
export class ImageGeneratorService {
  private apiKey: string;
  private model: string;
  private client: HfInference;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || (import.meta.env?.VITE_HUGGINGFACE_API_TOKEN as string) || '';
    // Using Stable Diffusion XL Base 1.0 as v1.5 is no longer available on the router
    this.model = 'stabilityai/stable-diffusion-xl-base-1.0';

    // Initialize client with custom fetch for proxy support
    this.client = new HfInference(this.apiKey, {
      fetch: this.customFetch.bind(this)
    });
  }

  /**
   * Custom fetch implementation to handle proxies and CORS
   */
  private async customFetch(url: string | Request | URL, init?: RequestInit): Promise<Response> {
    const urlStr = url.toString();

    // 1. Try direct request (or local proxy in dev)
    try {
      let targetUrl = urlStr;

      // In development, if we want to use the local proxy, we might need to rewrite
      // But since we installed the library, let's try to let it handle it first.
      // If CORS blocks it locally, we might need the proxy.
      // For now, let's try direct.

      console.log(`[ImageGenerator] Fetching: ${targetUrl}`);
      const response = await fetch(targetUrl, init);

      // If successful or a valid API error (not network/CORS), return it
      if (response.ok || response.status !== 404) { // 404 might be wrong URL, but 410 is Gone
        return response;
      }

      // If 410 (Gone), it means the URL is deprecated, but the library should have used the right one?
      // If the library is old, it might use the old one. We just installed it, so it should be new.
      // But just in case, if it fails, we fall through to proxy.
      throw new Error(`Direct request failed: ${response.status} ${response.statusText}`);

    } catch (error) {
      console.warn('[ImageGenerator] Direct request failed, retrying with proxy...', error);

      // 2. Try with CORS Anywhere proxy
      // We need to ensure we are proxying the FULL url
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/' + urlStr;

      try {
        const proxyResponse = await fetch(proxyUrl, init);
        return proxyResponse;
      } catch (proxyError) {
        console.error('[ImageGenerator] Proxy request also failed:', proxyError);
        throw error;
      }
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    // Re-initialize client
    this.client = new HfInference(this.apiKey, {
      fetch: this.customFetch.bind(this)
    });
  }

  checkApiStatus(): boolean {
    return this.apiKey.length > 0;
  }

  async generateImage(prompt: string): Promise<GeneratedImage> {
    if (!this.checkApiStatus()) {
      const error: ApiError = {
        message: 'Hugging Face API token is not configured.',
        code: 401,
        status: 'UNAUTHENTICATED',
      };
      throw error;
    }

    try {
      console.log(`[ImageGenerator] Generating with model: ${this.model}`);

      // Use the library's textToImage method
      const result = await this.client.textToImage({
        model: this.model,
        inputs: prompt,
        parameters: {
          negative_prompt: 'blurry, bad quality, distorted',
        }
      });

      const blob = result as unknown as Blob;

      // Convert Blob to Base64
      const buffer = await blob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      const imageUrl = `data:${blob.type};base64,${base64}`;

      return {
        url: imageUrl,
        prompt,
        timestamp: new Date(),
        metadata: {
          model: this.model,
          mimeType: blob.type,
        },
      };

    } catch (error: any) {
      console.error('[ImageGenerator] Error:', error);

      // Parse error message
      let message = error.message || 'An unexpected error occurred';
      if (message.includes('cors-anywhere')) {
        message = 'CORS Proxy requires activation. Visit https://cors-anywhere.herokuapp.com/corsdemo';
      }

      const apiError: ApiError = {
        message,
        code: error.status || 500,
        status: 'INTERNAL',
        details: error,
      };
      throw apiError;
    }
  }
}

export const imageGeneratorService = new ImageGeneratorService();
