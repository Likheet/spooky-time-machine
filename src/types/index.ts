// Type definitions for Time Travel Explorer
export interface Coordinates {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface TimeSelection {
  year: number;
  month?: number;
  day?: number;
  era?: string; // BCE/CE
  displayName: string;
}

export interface NotableEvent {
  id: string;
  name: string;
  description: string;
  location: Coordinates;
  time: TimeSelection;
  tags: string[];
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    mimeType?: string;
    description?: string;
    [key: string]: unknown;
  };
}

export interface AppState {
  selectedLocation: Coordinates | null;
  selectedTime: TimeSelection | null;
  currentEvent: NotableEvent | null;
  generatedImages: GeneratedImage[];
  isGenerating: boolean;
  error: string | null;
}

export const SoundEffect = {
  THUNDER: 'thunder',
  WIND: 'wind',
  CREAK: 'creak',
  WHOOSH: 'whoosh',
  AMBIENT: 'ambient',
} as const;

export type SoundEffect = (typeof SoundEffect)[keyof typeof SoundEffect];

// API Response Types

export interface GeocodingResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox: string[];
}

export interface GeminiImageResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }>;
    };
  }>;
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

export interface ApiError {
  message: string;
  code?: number;
  status?: string;
  details?: unknown;
}
