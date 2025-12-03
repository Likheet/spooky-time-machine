import type { Coordinates, TimeSelection } from '../types';
import { GeocodingService } from './GeocodingService';

/**
 * Service for building AI prompts for image generation
 * Constructs prompts from location and time data with historical context
 */
export class PromptBuilderService {
  private geocodingService: GeocodingService;

  constructor(geocodingService: GeocodingService) {
    this.geocodingService = geocodingService;
  }

  /**
   * Build a complete prompt for image generation
   * @param location - Geographic coordinates
   * @param time - Time period selection
   * @returns Promise resolving to formatted prompt string
   */
  async buildPrompt(location: Coordinates, time: TimeSelection): Promise<string> {
    // Get location name (use provided name or reverse geocode)
    const locationName = location.name || await this.geocodingService.reverseGeocode(location);
    
    // Generate historical context
    const historicalContext = this.getHistoricalContext(time, locationName);
    
    // Format the prompt for image generation
    const prompt = `A photorealistic historical scene of ${locationName} in ${time.displayName}. ${historicalContext}. Atmospheric lighting with dramatic shadows, moody twilight sky, cinematic composition. Historically accurate architecture, clothing, and technology of the era. High detail, professional photography style.`;

    return prompt;
  }

  /**
   * Generate historical context based on time period and location
   * @param time - Time period selection
   * @param location - Location name
   * @returns Historical context description
   */
  getHistoricalContext(time: TimeSelection, location: string): string {
    const year = time.era === 'BCE' ? -time.year : time.year;
    const contexts: string[] = [];

    // Ancient history (before 500 CE)
    if (year < 500) {
      contexts.push('Ancient civilizations, early settlements, primitive architecture');
      if (location.toLowerCase().includes('rome') || location.toLowerCase().includes('italy')) {
        contexts.push('Roman Empire influence, classical architecture, forums and temples');
      }
      if (location.toLowerCase().includes('egypt')) {
        contexts.push('Pharaonic era, pyramids, hieroglyphics, Nile civilization');
      }
      if (location.toLowerCase().includes('greece')) {
        contexts.push('Classical Greek period, philosophy, democracy, marble temples');
      }
      if (location.toLowerCase().includes('china')) {
        contexts.push('Ancient dynasties, Great Wall construction, silk road trade');
      }
    }
    // Medieval period (500-1500 CE)
    else if (year >= 500 && year < 1500) {
      contexts.push('Medieval era, castles and fortifications, feudal society');
      if (location.toLowerCase().includes('europe')) {
        contexts.push('Gothic architecture, knights, monasteries, walled cities');
      }
      if (location.toLowerCase().includes('england') || location.toLowerCase().includes('britain')) {
        contexts.push('Norman conquest influence, medieval villages, stone churches');
      }
      if (location.toLowerCase().includes('middle east') || location.toLowerCase().includes('jerusalem')) {
        contexts.push('Crusades era, Islamic golden age, ancient trade routes');
      }
    }
    // Renaissance and Early Modern (1500-1800)
    else if (year >= 1500 && year < 1800) {
      contexts.push('Renaissance and early modern period, exploration and discovery');
      if (location.toLowerCase().includes('italy')) {
        contexts.push('Renaissance art and architecture, merchant republics, baroque style');
      }
      if (location.toLowerCase().includes('america')) {
        contexts.push('Colonial settlements, indigenous peoples, early European influence');
      }
      if (location.toLowerCase().includes('england') || location.toLowerCase().includes('london')) {
        contexts.push('Tudor and Stuart periods, Shakespeare era, early industrialization');
      }
    }
    // Industrial Revolution (1800-1900)
    else if (year >= 1800 && year < 1900) {
      contexts.push('Industrial revolution, steam power, rapid urbanization');
      if (location.toLowerCase().includes('england') || location.toLowerCase().includes('london')) {
        contexts.push('Victorian era, factories, gas lighting, cobblestone streets');
      }
      if (location.toLowerCase().includes('america') || location.toLowerCase().includes('united states')) {
        contexts.push('Westward expansion, Civil War era, railroad construction');
      }
    }
    // Modern era (1900-present)
    else if (year >= 1900) {
      contexts.push('Modern era, technological advancement, contemporary architecture');
      if (year >= 1900 && year < 1950) {
        contexts.push('Early 20th century, World Wars impact, art deco style');
      }
      if (year >= 1950 && year < 2000) {
        contexts.push('Post-war reconstruction, modernist architecture, automobile culture');
      }
      if (year >= 2000) {
        contexts.push('Contemporary period, digital age, sustainable design');
      }
    }

    // Add general context if no specific matches
    if (contexts.length === 0) {
      contexts.push('Historical period with period-appropriate architecture and daily life');
    }

    return contexts.join('. ');
  }
}

// Export singleton instance with default geocoding service
import { geocodingService } from './GeocodingService';
export const promptBuilderService = new PromptBuilderService(geocodingService);
