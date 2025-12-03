/**
 * Example usage of ImageGeneratorService with PromptBuilderService
 * This demonstrates the complete flow from location/time selection to image generation
 */

import { ImageGeneratorService } from './ImageGeneratorService';
import { PromptBuilderService } from './PromptBuilderService';
import { GeocodingService } from './GeocodingService';
import type { Coordinates, TimeSelection, GeneratedImage } from '../types';

async function generateHistoricalImage() {
  console.log('=== Historical Image Generation Example ===\n');

  // Initialize services
  const geocodingService = new GeocodingService();
  const promptBuilder = new PromptBuilderService(geocodingService);
  const imageGenerator = new ImageGeneratorService();

  // Check API status
  if (!imageGenerator.checkApiStatus()) {
    console.error('❌ Gemini API key is not configured.');
    console.log('Please set VITE_GEMINI_API_KEY environment variable.\n');
    return;
  }

  // Example 1: Ancient Rome
  console.log('Example 1: Colosseum Opening (80 CE, Rome)');
  const romeLocation: Coordinates = {
    latitude: 41.8902,
    longitude: 12.4922,
    name: 'Rome, Italy',
  };
  const romeTime: TimeSelection = {
    year: 80,
    era: 'CE',
    displayName: '80 CE',
  };

  try {
    // Build prompt
    console.log('Building prompt...');
    const prompt = await promptBuilder.buildPrompt(romeLocation, romeTime);
    console.log('✓ Prompt created');
    console.log(`  Length: ${prompt.length} characters`);
    console.log(`  Contains location: ${prompt.includes('Rome')}`);
    console.log(`  Contains time: ${prompt.includes('80')}`);
    console.log(`  Contains model: ${prompt.includes('gemini-3-pro-image-preview')}`);

    // Generate image
    console.log('\nGenerating image...');
    const image: GeneratedImage = await imageGenerator.generateImage(prompt);
    console.log('✓ Image generated successfully!');
    console.log(`  URL: ${image.url.substring(0, 50)}...`);
    console.log(`  Timestamp: ${image.timestamp.toISOString()}`);
    console.log(`  Model: ${image.metadata?.model}`);
    console.log(`  MIME Type: ${image.metadata?.mimeType}`);
  } catch (error: any) {
    console.error('❌ Error generating image:');
    console.error(`  Message: ${error.message}`);
    console.error(`  Code: ${error.code}`);
    console.error(`  Status: ${error.status}`);
    
    // Demonstrate error handling
    if (error.code === 429) {
      console.log('\n💡 Rate limit exceeded. Please wait before retrying.');
    } else if (error.code === 503) {
      console.log('\n💡 API temporarily unavailable. Please try again later.');
    } else if (error.code === 401 || error.code === 403) {
      console.log('\n💡 Authentication failed. Check your API key.');
    } else if (error.status === 'NETWORK_ERROR') {
      console.log('\n💡 Network error. Check your internet connection.');
    }
  }

  console.log('\n=== End of Example ===');
}

// Run example
generateHistoricalImage().catch(console.error);
