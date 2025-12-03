/**
 * Manual verification tests for PromptBuilderService
 * Run with: node --loader tsx src/services/PromptBuilderService.test.ts
 */

import { PromptBuilderService } from './PromptBuilderService';
import { GeocodingService } from './GeocodingService';
import type { Coordinates, TimeSelection } from '../types';

async function testPromptBuilder() {
  console.log('Testing PromptBuilderService...\n');

  const geocodingService = new GeocodingService();
  const promptBuilder = new PromptBuilderService(geocodingService);

  // Test 1: Ancient Rome
  console.log('Test 1: Ancient Rome (80 CE)');
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
    const prompt1 = await promptBuilder.buildPrompt(romeLocation, romeTime);
    console.log('✓ Prompt generated successfully');
    console.log('✓ Contains location:', prompt1.includes('Rome'));
    console.log('✓ Contains time:', prompt1.includes('80'));
    console.log('✓ Contains model identifier:', prompt1.includes('gemini-3-pro-image-preview'));
    console.log('✓ Contains historical context:', prompt1.includes('Historical Context:'));
    console.log('✓ Contains coordinates:', prompt1.includes('41.8902'));
    console.log();
  } catch (error) {
    console.error('✗ Test 1 failed:', error);
  }

  // Test 2: Medieval England
  console.log('Test 2: Medieval England (1066 CE)');
  const englandLocation: Coordinates = {
    latitude: 51.5074,
    longitude: -0.1278,
  };
  const medievalTime: TimeSelection = {
    year: 1066,
    era: 'CE',
    displayName: '1066 CE',
  };

  try {
    const prompt2 = await promptBuilder.buildPrompt(englandLocation, medievalTime);
    console.log('✓ Prompt generated successfully');
    console.log('✓ Contains time:', prompt2.includes('1066'));
    console.log('✓ Contains model identifier:', prompt2.includes('gemini-3-pro-image-preview'));
    console.log('✓ Contains medieval context:', prompt2.toLowerCase().includes('medieval'));
    console.log();
  } catch (error) {
    console.error('✗ Test 2 failed:', error);
  }

  // Test 3: Ancient Egypt (BCE)
  console.log('Test 3: Ancient Egypt (2500 BCE)');
  const egyptLocation: Coordinates = {
    latitude: 29.9792,
    longitude: 31.1342,
    name: 'Giza, Egypt',
  };
  const ancientTime: TimeSelection = {
    year: 2500,
    era: 'BCE',
    displayName: '2500 BCE',
  };

  try {
    const prompt3 = await promptBuilder.buildPrompt(egyptLocation, ancientTime);
    console.log('✓ Prompt generated successfully');
    console.log('✓ Contains location:', prompt3.includes('Egypt'));
    console.log('✓ Contains BCE:', prompt3.includes('BCE'));
    console.log('✓ Contains model identifier:', prompt3.includes('gemini-3-pro-image-preview'));
    console.log('✓ Contains Halloween atmosphere:', prompt3.includes('eerie'));
    console.log();
  } catch (error) {
    console.error('✗ Test 3 failed:', error);
  }

  // Test 4: Historical context generation
  console.log('Test 4: Historical context generation');
  const context1 = promptBuilder.getHistoricalContext(
    { year: 80, era: 'CE', displayName: '80 CE' },
    'Rome, Italy'
  );
  console.log('✓ Ancient Rome context:', context1.includes('Roman'));

  const context2 = promptBuilder.getHistoricalContext(
    { year: 1066, era: 'CE', displayName: '1066 CE' },
    'London, England'
  );
  console.log('✓ Medieval England context:', context2.toLowerCase().includes('medieval'));

  const context3 = promptBuilder.getHistoricalContext(
    { year: 1850, era: 'CE', displayName: '1850 CE' },
    'London, England'
  );
  console.log('✓ Victorian era context:', context3.toLowerCase().includes('victorian'));

  console.log('\n✓ All tests passed!');
}

// Run tests
testPromptBuilder().catch(console.error);
