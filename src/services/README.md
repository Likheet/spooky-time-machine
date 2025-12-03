# Services Documentation

## ImageGeneratorService

The `ImageGeneratorService` handles AI-powered image generation using the Google Gemini API. It provides comprehensive error handling and state preservation for a robust user experience.

### Features

- ✅ Gemini API integration with `gemini-3-pro-image-preview` model
- ✅ Comprehensive error handling for all failure scenarios
- ✅ API authentication and configuration management
- ✅ Request/response lifecycle management
- ✅ Error logging for debugging
- ✅ State preservation on errors (errors are thrown, not swallowed)

### Usage

```typescript
import { ImageGeneratorService } from './services/ImageGeneratorService';
import { PromptBuilderService } from './services/PromptBuilderService';

// Initialize services
const imageGenerator = new ImageGeneratorService();
const promptBuilder = new PromptBuilderService(geocodingService);

// Check API status
if (!imageGenerator.checkApiStatus()) {
  console.error('API key not configured');
  return;
}

// Build prompt and generate image
try {
  const prompt = await promptBuilder.buildPrompt(location, time);
  const image = await imageGenerator.generateImage(prompt);
  
  // Use the generated image
  console.log('Image URL:', image.url);
  console.log('Generated at:', image.timestamp);
} catch (error) {
  // Handle errors appropriately
  console.error('Generation failed:', error.message);
  
  // User state is preserved - can retry with same selections
}
```

### Configuration

Set the Gemini API key as an environment variable:

```bash
# .env file
VITE_GEMINI_API_KEY=your_api_key_here
```

Or pass it directly to the constructor:

```typescript
const imageGenerator = new ImageGeneratorService('your_api_key_here');
```

### Error Handling

The service handles all error scenarios as specified in Requirements 8.1-8.5:

#### API Unavailable (503)
```typescript
{
  message: 'The Gemini API is temporarily unavailable. Please try again later.',
  code: 503,
  status: 'UNAVAILABLE'
}
```

#### Rate Limit Exceeded (429)
```typescript
{
  message: 'Rate limit exceeded. Please wait a few moments before trying again.',
  code: 429,
  status: 'RESOURCE_EXHAUSTED'
}
```

#### Network Errors
```typescript
{
  message: 'Network error. Please check your internet connection and try again.',
  code: 0,
  status: 'NETWORK_ERROR'
}
```

#### Authentication Errors (401, 403)
```typescript
{
  message: 'Authentication failed. Please check your API key configuration.',
  code: 401,
  status: 'UNAUTHENTICATED'
}
```

#### Timeout Errors
```typescript
{
  message: 'Request timeout. The image generation took too long. Please try again.',
  code: 408,
  status: 'TIMEOUT'
}
```

### API Response Format

The service returns a `GeneratedImage` object:

```typescript
interface GeneratedImage {
  url: string;           // Data URL with base64-encoded image
  prompt: string;        // Original prompt used
  timestamp: Date;       // Generation timestamp
  metadata?: {
    model: string;       // 'gemini-3-pro-image-preview'
    mimeType: string;    // Image MIME type (e.g., 'image/png')
  };
}
```

### Testing

Run the test suite:

```bash
npx tsx src/services/ImageGeneratorService.test.ts
```

Run the integration example:

```bash
npx tsx src/services/ImageGenerationExample.ts
```

### Requirements Coverage

This implementation satisfies the following requirements:

- **Requirement 3.3**: Sends prompts to Gemini 3 Pro image preview model
- **Requirement 3.4**: Displays generated images to users
- **Requirement 6.5**: Uses model identifier "gemini-3-pro-image-preview"
- **Requirement 8.1**: Handles API unavailable errors
- **Requirement 8.2**: Handles rate limit errors with retry suggestions
- **Requirement 8.3**: Handles network errors
- **Requirement 8.5**: Logs errors for debugging
- **State Preservation**: All errors are thrown (not swallowed), allowing UI to preserve user selections

## PromptBuilderService

Constructs AI prompts from location and time data with historical context. See `PromptBuilderService.ts` for details.

## GeocodingService

Provides location search and reverse geocoding using OpenStreetMap Nominatim API. See `GeocodingService.ts` for details.

## AudioManager

Manages sound effects and atmospheric audio for the Halloween theme. See `AudioManager.ts` for details.
