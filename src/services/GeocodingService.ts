import type { Coordinates, GeocodingResponse } from '../types';
import { validateCoordinates } from '../utils/coordinateUtils';

/**
 * Service for geocoding operations using OpenStreetMap Nominatim API
 * Provides reverse geocoding, location search, and autocomplete functionality
 */
export class GeocodingService {
  private static readonly BASE_URL = 'https://nominatim.openstreetmap.org';
  private static readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();

  /**
   * Reverse geocode coordinates to get location name
   * @param coords - Latitude and longitude coordinates
   * @returns Promise resolving to location name
   */
  async reverseGeocode(coords: Coordinates): Promise<string> {
    // Validate coordinates before making API call
    if (!validateCoordinates(coords)) {
      console.error('Invalid coordinates:', coords);
      return `Invalid coordinates: ${coords.latitude.toFixed(4)}°, ${coords.longitude.toFixed(4)}°`;
    }

    const cacheKey = `reverse:${coords.latitude},${coords.longitude}`;
    const cached = this.getFromCache<string>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const url = new URL(`${GeocodingService.BASE_URL}/reverse`);
      url.searchParams.append('lat', coords.latitude.toString());
      url.searchParams.append('lon', coords.longitude.toString());
      url.searchParams.append('format', 'json');
      url.searchParams.append('addressdetails', '1');

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'TimeTravelExplorer/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as GeocodingResponse;

      if (!data.display_name) {
        throw new Error('No location name found for coordinates');
      }

      const locationName = this.formatLocationName(data);
      this.setCache(cacheKey, locationName);

      return locationName;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      // Fallback to coordinate display
      return `${coords.latitude.toFixed(4)}°, ${coords.longitude.toFixed(4)}°`;
    }
  }

  /**
   * Search for locations by query string
   * @param query - Location search query
   * @returns Promise resolving to array of matching coordinates
   */
  async searchLocation(query: string): Promise<Coordinates[]> {
    if (!query.trim()) {
      return [];
    }

    const cacheKey = `search:${query.toLowerCase()}`;
    const cached = this.getFromCache<Coordinates[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const url = new URL(`${GeocodingService.BASE_URL}/search`);
      url.searchParams.append('q', query);
      url.searchParams.append('format', 'json');
      url.searchParams.append('addressdetails', '1');
      url.searchParams.append('limit', '10');

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'TimeTravelExplorer/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as GeocodingResponse[];

      const results: Coordinates[] = data.map((item) => ({
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        name: this.formatLocationName(item),
      }));

      this.setCache(cacheKey, results);

      return results;
    } catch (error) {
      console.error('Location search failed:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to search location'
      );
    }
  }

  /**
   * Get location suggestions for autocomplete
   * @param partial - Partial location query
   * @returns Promise resolving to array of location name suggestions
   */
  async getSuggestions(partial: string): Promise<string[]> {
    if (!partial.trim() || partial.length < 2) {
      return [];
    }

    try {
      const results = await this.searchLocation(partial);
      return results.map((coord) => coord.name || '').filter((name) => name !== '');
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }

  /**
   * Format location name from geocoding response
   * @param data - Geocoding API response
   * @returns Formatted location name
   */
  private formatLocationName(data: GeocodingResponse): string {
    const address = data.address;
    const parts: string[] = [];

    // Add city/town/village
    if (address.city) {
      parts.push(address.city);
    } else if (address.town) {
      parts.push(address.town);
    } else if (address.village) {
      parts.push(address.village);
    }

    // Add state if available
    if (address.state) {
      parts.push(address.state);
    }

    // Add country
    if (address.country) {
      parts.push(address.country);
    }

    // If we have parts, join them; otherwise use display_name
    return parts.length > 0 ? parts.join(', ') : data.display_name;
  }

  /**
   * Get data from cache if not expired
   * @param key - Cache key
   * @returns Cached data or null if expired/not found
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    const now = Date.now();
    if (now - cached.timestamp > GeocodingService.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * Store data in cache with timestamp
   * @param key - Cache key
   * @param data - Data to cache
   */
  private setCache(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const geocodingService = new GeocodingService();
