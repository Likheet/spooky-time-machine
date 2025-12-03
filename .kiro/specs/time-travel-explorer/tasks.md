# Implementation Plan

- [x] 1. Set up project structure and dependencies





  - Initialize React + TypeScript project with Vite
  - Install core dependencies: @react-three/fiber, @react-three/drei, three, axios
  - Install styling dependencies: framer-motion for animations
  - Set up project folder structure: components, services, hooks, types, assets
  - Configure TypeScript with strict mode
  - Set up ESLint and Prettier
  - _Requirements: All_

- [x] 2. Implement core data models and types





  - Create TypeScript interfaces for Coordinates, TimeSelection, NotableEvent
  - Create TypeScript interfaces for AppState, GeneratedImage
  - Define SoundEffect enum and audio-related types
  - Create type definitions for API responses
  - _Requirements: 1.2, 2.3, 4.1_

- [x] 3. Create Halloween theme system





  - [x] 3.1 Define color palette and CSS variables


    - Create CSS custom properties for Halloween colors (blacks, reds, greens)
    - Set up theme configuration object
    - _Requirements: 5.1_
  
  - [x] 3.2 Implement base layout with spooky styling


    - Create main App component with dark background
    - Add cracked stone texture overlays
    - Implement fog/mist effect layers using CSS gradients
    - _Requirements: 5.1, 5.3_
  
  - [x] 3.3 Create animated effects components


    - Implement flickering candlelight animation with CSS keyframes
    - Create ghostly cursor trail using canvas and particle system
    - Add pulsing jack-o'-lantern glow effects
    - _Requirements: 5.2_
  
  - [ ]* 3.4 Write property test for theme consistency
    - **Property 11: Responsive layout preservation**
    - **Validates: Requirements 5.5**

- [x] 4. Implement audio system






  - [x] 4.1 Create AudioManager service

    - Implement sound loading and caching
    - Add play, stop, and volume control methods
    - Implement mute/unmute functionality
    - Add user preference detection for reduced motion/audio
    - _Requirements: 5.4_
  

  - [x] 4.2 Add audio assets and integration

    - Source or create audio files (thunder, wind, creak, whoosh)
    - Integrate audio triggers with UI interactions
    - Add audio settings toggle in UI
    - _Requirements: 5.4_
  
  - [ ]* 4.3 Write unit tests for AudioManager
    - Test sound loading and playback
    - Test volume controls and muting
    - Test preference handling
    - _Requirements: 5.4_

- [x] 5. Build geocoding service




  - [x] 5.1 Implement GeocodingService class


    - Create reverse geocoding function using Nominatim API
    - Implement location search with query string
    - Add suggestion/autocomplete functionality
    - Implement response caching to reduce API calls
    - Add error handling for API failures
    - _Requirements: 9.1, 9.2_
  
  - [ ]* 5.2 Write property test for search functionality
    - **Property 10: Search functionality correctness**
    - **Validates: Requirements 9.1, 9.2, 9.4**
  
  - [ ]* 5.3 Write unit tests for geocoding
    - Test reverse geocoding with known coordinates
    - Test search with various queries
    - Test caching behavior
    - Test error handling
    - _Requirements: 9.1, 9.2_

- [x] 6. Create 3D globe component



  - [x] 6.1 Set up Three.js scene with React Three Fiber


    - Initialize Canvas component
    - Set up camera, lighting, and controls
    - Add OrbitControls for interaction
    - _Requirements: 1.1, 1.3_
  
  - [x] 6.2 Implement globe sphere with texture


    - Create sphere geometry with Earth texture
    - Add eerie lighting (green ambient, dramatic shadows)
    - Apply cracked/aged texture overlay for Halloween effect
    - _Requirements: 1.1, 5.3_
  
  - [x] 6.3 Add click interaction and coordinate capture


    - Implement raycasting for click detection on globe
    - Calculate latitude/longitude from 3D intersection point
    - Emit coordinate selection events
    - _Requirements: 1.2_
  
  - [ ]* 6.4 Write property test for coordinate validity
    - **Property 1: Coordinate selection validity**
    - **Validates: Requirements 1.2, 8.4**
  
  - [x] 6.5 Add location markers and highlighting


    - Create marker component for selected location
    - Implement pulsing glow effect for markers
    - Add animation for marker appearance
    - _Requirements: 9.4_
  
  - [x] 6.6 Implement camera animation for location transitions


    - Add smooth camera movement to selected coordinates
    - Implement easing functions for natural motion
    - _Requirements: 9.2_
  
  - [ ]* 6.7 Write unit tests for globe interactions
    - Test coordinate calculation from click position
    - Test marker placement
    - Test camera animation triggers
    - _Requirements: 1.2, 9.2, 9.4_

- [x] 7. Build time selector component





  - [x] 7.1 Create TimeSelector UI component

    - Design spooky time control interface (vintage/gothic style)
    - Add year input/slider with wide range support
    - Add month and day selectors
    - Add BCE/CE era toggle
    - Style with Halloween theme (ghostly wisps, glowing effects)
    - _Requirements: 2.1, 2.2_
  

  - [x] 7.2 Implement time selection logic

    - Handle time input validation
    - Format time display in human-readable format
    - Emit time change events
    - Store selected time in state
    - _Requirements: 2.2, 2.3, 2.4_
  
  - [ ]* 7.3 Write property test for time selection validity
    - **Property 2: Time selection range validity**
    - **Validates: Requirements 2.2, 2.3**
  
  - [ ]* 7.4 Write unit tests for time selector
    - Test time validation with various inputs
    - Test BCE/CE handling
    - Test display formatting
    - _Requirements: 2.2, 2.3, 2.4_
-

- [ ] 8. Implement state management

  - [x] 8.1 Create global state with Context API or Zustand


    - Define AppState interface
    - Create state provider/store
    - Add actions for updating location, time, events, images
    - _Requirements: 1.4, 1.5, 2.3, 2.4_
  
  - [ ] 8.2 Implement state synchronization logic
    - Ensure UI updates when state changes
    - Sync coordinate display with selected location
    - Sync time display with selected time
    - Update generation button enabled state
    - _Requirements: 1.4, 1.5, 2.4, 2.5_
  
  - [ ]* 8.3 Write property test for state synchronization
    - **Property 5: State synchronization consistency**
    - **Validates: Requirements 1.4, 1.5, 2.4**
  
  - [ ]* 8.4 Write property test for button enablement
    - **Property 6: Generation button enablement**
    - **Validates: Requirements 2.5, 3.1**

- [x] 9. Create notable events system



  - [x] 9.1 Define notable events data


    - Create array of at least 20 NotableEvent objects
    - Include diverse historical periods and locations
    - Add Halloween-themed events (Salem, Jack the Ripper, etc.)
    - Include event descriptions and tags
    - _Requirements: 4.1_
  
  - [x] 9.2 Build EventRandomizer component


    - Create UI button with spooky styling
    - Implement random selection from events list
    - Display selected event name and description
    - Trigger location and time updates
    - _Requirements: 4.2, 4.3, 4.4_
  
  - [ ]* 9.3 Write property test for event randomizer
    - **Property 4: Event randomizer selection validity**
    - **Validates: Requirements 4.2, 4.3**
  
  - [ ]* 9.4 Write property test for event metadata display
    - **Property 7: Event metadata display**
    - **Validates: Requirements 4.4, 4.5**
  
  - [ ]* 9.5 Write unit tests for event randomizer
    - Test random selection is from list
    - Test state updates on selection
    - Test UI display of event info
    - _Requirements: 4.2, 4.3, 4.4_
- [x] 10. Build prompt builder service



- [ ] 10. Build prompt builder service

  - [x] 10.1 Implement PromptBuilderService class


    - Create buildPrompt method accepting location and time
    - Integrate with GeocodingService for location names
    - Add historical context generation logic
    - Format prompt according to template with Halloween atmosphere
    - Include model identifier "gemini-3-pro-image-preview"
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 10.2 Write property test for prompt completeness
    - **Property 3: Prompt construction completeness**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
  
  - [ ]* 10.3 Write unit tests for prompt builder
    - Test prompt includes location
    - Test prompt includes time
    - Test prompt includes historical context
    - Test prompt formatting
    - Test model identifier inclusion
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 11. Implement Gemini API integration



  - [x] 11.1 Create ImageGeneratorService class


    - Set up Gemini API client configuration
    - Implement generateImage method
    - Handle API authentication
    - Parse and return image response
    - _Requirements: 3.3, 3.4, 6.5_
  
  - [x] 11.2 Add error handling for API calls


    - Handle API unavailable errors
    - Handle rate limit errors with retry suggestions
    - Handle network errors
    - Log errors for debugging
    - Preserve user state on errors
    - _Requirements: 8.1, 8.2, 8.3, 8.5_
  
  - [ ]* 11.3 Write property test for error state preservation
    - **Property 9: Error state preservation**
    - **Validates: Requirements 7.3, 8.1, 8.2, 8.3, 8.5**
  
  - [ ]* 11.4 Write unit tests for image generator
    - Test API call with valid prompt
    - Test error handling for various failure modes
    - Test response parsing
    - Test state preservation on error
    - _Requirements: 3.3, 3.4, 8.1, 8.2, 8.3_
- [x] 12. Create image generation UI



- [ ] 12. Create image generation UI

  - [x] 12.1 Build generation control panel


    - Create generate button with spooky styling
    - Implement button enabled/disabled logic based on state
    - Add loading indicator (spinning pentagram or swirling mist)
    - Integrate with PromptBuilder and ImageGenerator services
    - _Requirements: 2.5, 3.1, 3.2, 3.5_
  
  - [x] 12.2 Implement image display component


    - Create image viewer with Halloween-themed frame
    - Display generated image at appropriate size
    - Show associated location and time metadata
    - Add download and share buttons
    - Handle image loading states
    - _Requirements: 7.1, 7.2, 7.5_
  
  - [x] 12.3 Add error display for generation failures


    - Create error message component with spooky styling
    - Display clear error messages
    - Provide retry option
    - _Requirements: 7.3_
  
  - [ ]* 12.4 Write property test for image metadata association
    - **Property 8: Image metadata association**
    - **Validates: Requirements 7.2**
  
  - [ ]* 12.5 Write unit tests for image display
    - Test image rendering
    - Test metadata display
    - Test error message display
    - Test download/share functionality
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [x] 13. Integrate search functionality with globe




  - [x] 13.1 Create search input component


    - Build search bar with spooky styling
    - Implement autocomplete/suggestions dropdown
    - Style dropdown with Halloween theme
    - _Requirements: 9.1_
  
  - [x] 13.2 Connect search to globe and geocoding


    - Integrate GeocodingService with search input
    - Trigger globe animation on search result selection
    - Update selected location state
    - Add location marker on globe
    - Handle "no results" case with error message
    - _Requirements: 9.1, 9.2, 9.4, 9.5_
  
  - [ ]* 13.3 Write unit tests for search integration
    - Test search triggers geocoding
    - Test result selection updates globe
    - Test no results handling
    - _Requirements: 9.1, 9.2, 9.5_
- [x] 14. Polish UI and add final touches




- [ ] 14. Polish UI and add final touches

  - [x] 14.1 Refine Halloween aesthetic across all components


    - Ensure consistent color palette usage
    - Fine-tune animations and transitions
    - Add lightning flash transitions between major state changes
    - Verify all interactive elements have hover effects
    - _Requirements: 5.1, 5.2_
  
  - [x] 14.2 Implement accessibility features


    - Add keyboard navigation support
    - Add ARIA labels to all interactive elements
    - Implement focus indicators with glowing effects
    - Add settings for disabling audio
    - Add settings for reduced motion
    - Test with screen readers
    - _Requirements: 5.5_
  
  - [x] 14.3 Optimize performance


    - Implement lazy loading for images
    - Optimize globe rendering (LOD, frustum culling)
    - Debounce search input
    - Cache API responses
    - Minimize bundle size
    - _Requirements: All_
- [x] 15. Testing and quality assurance



- [ ] 15. Testing and quality assurance

  - [x] 15.1 Run all property-based tests


    - Execute all property tests with 100+ iterations
    - Verify all properties pass
    - Fix any failing properties
    - _Requirements: All_
  
  - [ ]* 15.2 Run full test suite
    - Execute all unit tests
    - Execute all property tests
    - Verify code coverage
    - _Requirements: All_
  
  - [x] 15.3 Manual testing and bug fixes


    - Test full user flows (location → time → generate)
    - Test event randomizer flow
    - Test search flow
    - Test error scenarios
    - Test on multiple browsers
    - Test responsive design on various screen sizes
    - Fix any discovered bugs
    - _Requirements: All_

- [ ] 16. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise
