# Design Document

## Overview

The Time Travel Explorer is a web-based application that combines an interactive 3D globe interface with AI-powered image generation to create immersive historical visualizations. The application uses React for the UI framework, Three.js with React Three Fiber for 3D globe rendering, and the Google Gemini API for image generation. The architecture follows a component-based design with clear separation between the globe interface, time selection controls, event management, and AI integration.

## Architecture

### Technology Stack

- **Frontend Framework**: React with TypeScript
- **3D Rendering**: Three.js via React Three Fiber (@react-three/fiber)
- **Globe Component**: React Globe.gl or custom Three.js sphere with texture mapping
- **Geocoding**: OpenStreetMap Nominatim API (free, no API key required)
- **AI Image Generation**: Google Gemini API (gemini-3-pro-image-preview model)
- **Styling**: CSS Modules or Styled Components for Halloween theme with animations
- **Audio**: Web Audio API for atmospheric sound effects
- **Animations**: Framer Motion or CSS animations for spooky effects
- **State Management**: React Context API or Zustand for global state
- **HTTP Client**: Fetch API or Axios for API calls

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Application                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Globe      │  │    Time      │  │   Control    │  │
│  │  Component   │  │   Selector   │  │    Panel     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
│         └──────────────────┼──────────────────┘          │
│                            │                             │
│                   ┌────────▼────────┐                    │
│                   │  State Manager  │                    │
│                   │  (Location,     │                    │
│                   │   Time, Events) │                    │
│                   └────────┬────────┘                    │
│                            │                             │
│         ┌──────────────────┼──────────────────┐         │
│         │                  │                  │         │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐ │
│  │   Geocoding  │  │    Prompt    │  │    Image     │ │
│  │   Service    │  │   Builder    │  │   Display    │ │
│  └──────────────┘  └──────┬───────┘  └──────────────┘ │
│                            │                             │
│                   ┌────────▼────────┐                    │
│                   │  Gemini API     │                    │
│                   │  Integration    │                    │
│                   └─────────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Globe Component

**Responsibilities:**
- Render interactive 3D globe using Three.js
- Handle user interactions (click, drag, zoom)
- Display location markers and highlights
- Animate camera movements for location transitions

**Interface:**
```typescript
interface GlobeComponentProps {
  onLocationSelect: (coords: Coordinates) => void;
  selectedLocation?: Coordinates;
  highlightedLocations?: Coordinates[];
}

interface Coordinates {
  latitude: number;
  longitude: number;
  name?: string;
}
```

### 2. Time Selector Component

**Responsibilities:**
- Provide UI controls for date/time selection
- Support range from ancient history to present
- Display selected time in human-readable format
- Emit time change events

**Interface:**
```typescript
interface TimeSelectorProps {
  onTimeChange: (time: TimeSelection) => void;
  selectedTime?: TimeSelection;
}

interface TimeSelection {
  year: number;
  month?: number;
  day?: number;
  era?: string; // BCE/CE
  displayName: string;
}
```

### 3. Event Randomizer Component

**Responsibilities:**
- Store curated list of notable events
- Randomly select events
- Display event information
- Trigger location and time updates

**Interface:**
```typescript
interface EventRandomizerProps {
  onEventSelect: (event: NotableEvent) => void;
}

interface NotableEvent {
  id: string;
  name: string;
  description: string;
  location: Coordinates;
  time: TimeSelection;
  tags: string[];
}
```

### 4. Prompt Builder Service

**Responsibilities:**
- Construct AI prompts from location and time data
- Include historical context
- Format prompts for Gemini API
- Handle location name resolution

**Interface:**
```typescript
interface PromptBuilderService {
  buildPrompt(location: Coordinates, time: TimeSelection): Promise<string>;
  getLocationContext(coords: Coordinates): Promise<string>;
  getHistoricalContext(time: TimeSelection, location: string): string;
}
```

### 5. Image Generator Service

**Responsibilities:**
- Interface with Gemini API
- Handle API authentication
- Manage request/response lifecycle
- Handle errors and retries

**Interface:**
```typescript
interface ImageGeneratorService {
  generateImage(prompt: string): Promise<GeneratedImage>;
  checkApiStatus(): Promise<boolean>;
}

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
```

### 6. Geocoding Service

**Responsibilities:**
- Convert coordinates to location names
- Search locations by name
- Provide location suggestions

**Interface:**
```typescript
interface GeocodingService {
  reverseGeocode(coords: Coordinates): Promise<string>;
  searchLocation(query: string): Promise<Coordinates[]>;
  getSuggestions(partial: string): Promise<string[]>;
}
```

### 7. Audio Manager Service

**Responsibilities:**
- Load and cache audio files
- Play sound effects on user interactions
- Manage volume and muting
- Respect user preferences for reduced motion/audio

**Interface:**
```typescript
interface AudioManagerService {
  playSound(soundId: SoundEffect, volume?: number): void;
  setMasterVolume(volume: number): void;
  toggleMute(): void;
  preloadSounds(): Promise<void>;
}

enum SoundEffect {
  THUNDER = 'thunder',
  WIND = 'wind',
  CREAK = 'creak',
  WHOOSH = 'whoosh',
  AMBIENT = 'ambient'
}
```

## Data Models

### Application State

```typescript
interface AppState {
  selectedLocation: Coordinates | null;
  selectedTime: TimeSelection | null;
  currentEvent: NotableEvent | null;
  generatedImages: GeneratedImage[];
  isGenerating: boolean;
  error: string | null;
}
```

### Notable Events Database

```typescript
const NOTABLE_EVENTS: NotableEvent[] = [
  {
    id: "rome-colosseum-80ce",
    name: "Colosseum Opening",
    description: "The grand opening of the Flavian Amphitheatre in Rome",
    location: { latitude: 41.8902, longitude: 12.4922, name: "Rome, Italy" },
    time: { year: 80, era: "CE", displayName: "80 CE" },
    tags: ["ancient", "rome", "architecture"]
  },
  // ... 19+ more events
];
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Coordinate selection validity

*For any* click event on the globe surface, the captured coordinates should have latitude between -90 and 90 degrees and longitude between -180 and 180 degrees.

**Validates: Requirements 1.2, 8.4**

### Property 2: Time selection range validity

*For any* time selection, the stored date value should be within the supported historical range and properly formatted with era designation.

**Validates: Requirements 2.2, 2.3**

### Property 3: Prompt construction completeness

*For any* valid location and time combination, the constructed system prompt should include the location identifier (name or coordinates), the time period or date, contextual historical information, and proper formatting for the Gemini 3 Pro model with the correct model identifier "gemini-3-pro-image-preview".

**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

### Property 4: Event randomizer selection validity

*For any* randomization action, the selected event should be a member of the notable events list and should update both the globe location and time selector to match the event's specific location and time values.

**Validates: Requirements 4.2, 4.3**

### Property 5: State synchronization consistency

*For any* sequence of user interactions (location selection, time selection, or event randomization), the application state should remain consistent with the UI display, coordinate display should match selected location, time display should match selected time, and all dependent components should reflect the current selections immediately.

**Validates: Requirements 1.4, 1.5, 2.4**

### Property 6: Generation button enablement

*For any* application state, the image generation button should be enabled if and only if both a valid location and a valid time are selected.

**Validates: Requirements 2.5, 3.1**

### Property 7: Event metadata display

*For any* selected notable event, the displayed information should include the event's name and description, and when generating an image from that event, the prompt should use the event-specific location and time values.

**Validates: Requirements 4.4, 4.5**

### Property 8: Image metadata association

*For any* successfully generated image, the displayed image should be accompanied by its associated location and time information.

**Validates: Requirements 7.2**

### Property 9: Error state preservation

*For any* API error, network failure, or generation failure, the application state should remain valid, user selections (location and time) should be preserved, an appropriate error message should be displayed, and error details should be logged.

**Validates: Requirements 7.3, 8.1, 8.2, 8.3, 8.5**

### Property 10: Search functionality correctness

*For any* location search query, the Globe Interface should provide relevant suggestions, and when a search result is selected, the globe should animate to that location and highlight or mark the selected point.

**Validates: Requirements 9.1, 9.2, 9.4**

### Property 11: Responsive layout preservation

*For any* viewport size within the supported range, all UI controls should remain accessible and functional, maintaining visual coherence.

**Validates: Requirements 5.5**

## Error Handling

### API Errors

1. **Gemini API Failures**
   - Catch and display user-friendly error messages
   - Implement exponential backoff for retries
   - Log errors for debugging
   - Preserve user selections for retry

2. **Geocoding Failures**
   - Fall back to coordinate display if name resolution fails
   - Cache successful geocoding results
   - Provide manual location name input option

3. **Network Errors**
   - Detect offline status
   - Queue requests when offline
   - Display connectivity status indicator

### Input Validation

1. **Coordinate Validation**
   - Validate latitude: -90 to 90
   - Validate longitude: -180 to 180
   - Sanitize user input for search queries

2. **Time Validation**
   - Ensure dates are within supported range
   - Handle BCE/CE transitions correctly
   - Validate date component combinations

### UI Error States

1. **Loading States**
   - Show spinners during API calls
   - Disable controls during generation
   - Provide cancel option for long operations

2. **Error Display**
   - Toast notifications for transient errors
   - Modal dialogs for critical errors
   - Inline validation messages for input errors

## Testing Strategy

### Unit Testing

**Framework**: Jest with React Testing Library

**Unit Test Coverage:**
- Prompt builder logic with various location/time combinations
- Coordinate validation functions
- Time selection parsing and formatting
- Event randomizer selection logic
- Geocoding service response parsing
- Error handling utilities

**Example Unit Tests:**
- Test prompt builder with specific location "Rome" and time "80 CE"
- Test coordinate validation rejects latitude 95
- Test time formatter displays "1066 CE" correctly
- Test event randomizer with list of 3 events
- Test error handler preserves state on API failure

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run a minimum of 100 iterations

**Property Test Coverage:**
- Generate random coordinates and verify validity (Property 1)
- Generate random time selections and verify range (Property 2)
- Generate random location/time pairs and verify prompt completeness (Property 3)
- Generate random indices and verify event selection (Property 4)
- Generate random interaction sequences and verify state consistency (Property 5)
- Generate random API responses and verify error handling (Property 7)

**Test Annotations:**
Each property-based test must include a comment in this format:
```javascript
// **Feature: time-travel-explorer, Property 1: Coordinate selection validity**
```

### Integration Testing

- Test full flow: location selection → time selection → image generation
- Test event randomizer → auto-populate → image generation
- Test search → location selection → generation
- Test error recovery flows

### Visual Testing

- Verify globe renders correctly
- Verify time machine aesthetic is consistent
- Test responsive design on multiple screen sizes
- Verify image display and gallery functionality

## Implementation Notes

### Globe Implementation Options

**Option 1: React Globe.gl**
- Pros: Pre-built, feature-rich, easy integration
- Cons: Less customization, larger bundle size

**Option 2: Custom Three.js with React Three Fiber**
- Pros: Full control, optimized bundle, custom styling
- Cons: More implementation work, need to handle interactions manually

**Recommendation**: Start with React Globe.gl for faster MVP, migrate to custom Three.js if performance or customization becomes critical.

### Notable Events Curation

The application should include at least 20 diverse notable events covering:
- Ancient civilizations (Egypt, Rome, Greece, China)
- Medieval period (Castles, Viking era, Silk Road)
- Renaissance (Florence, Venice, Constantinople)
- Age of Exploration (New World discoveries)
- Industrial Revolution (London, New York)
- Modern history (World Wars, Space Race)
- Diverse geographic coverage (all continents)

**Halloween-Themed Event Suggestions:**
- Salem Witch Trials (1692, Salem, Massachusetts)
- Jack the Ripper era (1888, Whitechapel, London)
- Dracula's Castle (Medieval, Bran Castle, Romania)
- Day of the Dead origins (Ancient, Mexico)
- Edinburgh's haunted vaults (1700s, Edinburgh, Scotland)
- Catacombs of Paris (1700s-1800s, Paris, France)
- Plague doctor era (1348, Various European cities)
- Ancient Egyptian mummification (Various periods, Egypt)

### Prompt Engineering

The system prompt template should follow this structure:

```
Generate a photorealistic image of [LOCATION_NAME] as it appeared in [TIME_PERIOD].

Location: [COORDINATES] - [DETAILED_LOCATION_DESCRIPTION]
Time Period: [YEAR] [ERA]
Historical Context: [RELEVANT_HISTORICAL_EVENTS_AND_DETAILS]

Style: Historically accurate, photorealistic, atmospheric and moody lighting appropriate for the time period. 
Add a subtle eerie, haunting quality to the atmosphere - overcast skies, dramatic shadows, or twilight ambiance.
Perspective: Ground-level view showing architecture, landscape, and daily life of the era.
Details: Include period-appropriate clothing, architecture, technology, and environmental conditions.
Mood: Mysterious and atmospheric, as if viewing through a portal in time.
```

**Note**: The Halloween aesthetic is applied to the UI/UX, not the historical images themselves. Images should remain historically accurate but with atmospheric lighting that complements the spooky interface.

### Performance Considerations

1. **Globe Rendering**
   - Use texture LOD for globe surface
   - Implement frustum culling
   - Optimize marker rendering for many points

2. **API Calls**
   - Debounce search input
   - Cache geocoding results
   - Implement request cancellation

3. **Image Loading**
   - Progressive image loading
   - Thumbnail generation
   - Lazy loading for image gallery

### Visual Theme Implementation

**Color Palette:**
- Primary: Shadowy blacks (#0a0a0a, #1a1a1a)
- Accent: Blood-red (#8b0000, #dc143c)
- Highlight: Phosphorescent green (#39ff14, #00ff41)
- Secondary: Deep purples (#2d1b3d, #4a2c5e)
- Texture: Aged stone gray (#3a3a3a)

**Atmospheric Effects:**
1. **Flickering Candlelight**: CSS keyframe animations with random flicker patterns on UI borders and glows
2. **Ghostly Cursor Trail**: Canvas-based particle system following cursor with fade-out effect
3. **Jack-o'-lantern Glow**: Pulsing radial gradients behind translucent overlays using CSS animations
4. **Cracked Stone Texture**: SVG or image overlays on panels with subtle parallax
5. **Fog/Mist Effects**: Animated SVG or CSS gradients creating drifting fog layers

**Audio Effects:**
- Thunder rumbles on hover (low volume, ~200-300ms)
- Wind whispers on click (subtle, ~100-150ms)
- Distant creaking on page transitions
- Optional: Ambient background track (very subtle, user-controllable)

**Interactive Animations:**
- Buttons: Glow intensifies on hover with red/green pulse
- Globe: Eerie green ambient light, shadows cast by "moonlight"
- Time selector: Ghostly wisps drift across the control
- Loading states: Spinning pentagram or swirling mist
- Transitions: Fade through darkness with brief lightning flash

### Accessibility

- Keyboard navigation for all controls
- ARIA labels for interactive elements
- Screen reader support for coordinate display
- High contrast mode support (maintains spooky aesthetic)
- Focus indicators with glowing effects
- Audio effects can be disabled via settings
- Reduced motion mode for users sensitive to animations

## Future Enhancements

- Save favorite locations and times in a "haunted grimoire"
- Share generated images on social media with spooky frames
- Timeline view showing multiple events as a "scroll of shadows"
- Comparison mode (same location, different times) with split-screen effect
- User-submitted notable events with community voting
- Historical facts presented as "ancient whispers" or "ghostly tales"
- VR mode for immersive exploration with 360° spooky atmosphere
- Animated transitions between time periods with lightning strikes
- Seasonal theme variations (keep Halloween as default, add others)
- Achievement system for exploring cursed locations
- Easter eggs: hidden spooky events at specific coordinates
