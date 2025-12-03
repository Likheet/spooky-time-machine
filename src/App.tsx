import { useState, useEffect } from 'react';
import './App.css';
import { CandlelightEffect } from './components/CandlelightEffect';
import { GhostlyCursorTrail } from './components/GhostlyCursorTrail';
import { JackOLanternGlow } from './components/JackOLanternGlow';
import { AudioSettings } from './components/AudioSettings';
import { AccessibilitySettings } from './components/AccessibilitySettings';
import { Globe } from './components/Globe';
import { ImageDisplay } from './components/ImageDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';
import { LocationSearch } from './components/LocationSearch';
import { ControlsTabs } from './components/ControlsTabs';
import { geocodingService } from './services/GeocodingService';
import { LightningFlash } from './utils/lightningFlash';
import type { Coordinates, TimeSelection, GeneratedImage, NotableEvent } from './types';

function App() {
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | undefined>();
  const [selectedTime, setSelectedTime] = useState<TimeSelection | undefined>();
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string>('');
  
  // Initialize lightning flash on mount
  useEffect(() => {
    LightningFlash.initialize();
    return () => {
      LightningFlash.cleanup();
    };
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to dismiss error
      if (e.key === 'Escape' && error) {
        handleDismissError();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [error]);
  
  const handleLocationSelect = (coords: Coordinates) => {
    console.log('Location selected:', coords);
    LightningFlash.trigger(); // Lightning flash on location change
    setSelectedLocation(coords);
    setError(''); // Clear any search-related errors
  };

  const handleTimeChange = (time: TimeSelection) => {
    console.log('Time selected:', time);
    LightningFlash.trigger(); // Lightning flash on time change
    setSelectedTime(time);
  };

  const handleImageGenerated = (image: GeneratedImage) => {
    console.log('Image generated:', image);
    LightningFlash.trigger(); // Lightning flash on image generation
    setGeneratedImage(image);
    setError(''); // Clear any previous errors
  };

  const handleError = (errorMessage: string) => {
    console.error('Generation error:', errorMessage);
    setError(errorMessage);
  };

  const handleRetry = () => {
    setError('');
    // The user can click the generate button again
  };

  const handleDismissError = () => {
    setError('');
  };

  const handleEventSelect = (event: NotableEvent) => {
    console.log('Event selected:', event);
    LightningFlash.trigger(); // Lightning flash on event selection
    setSelectedLocation(event.location);
    setSelectedTime(event.time);
    setError(''); // Clear any errors
  };
  
  return (
    <div className="app-container">
      {/* Skip to main content for screen readers */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      
      {/* Settings */}
      <AudioSettings />
      <AccessibilitySettings />
      
      {/* Animated effects */}
      <CandlelightEffect />
      <GhostlyCursorTrail />
      <JackOLanternGlow />
      
      {/* Cracked stone texture overlay */}
      <div className="texture-overlay"></div>
      
      {/* Fog/mist effect layers */}
      <div className="fog-layer fog-layer-1"></div>
      <div className="fog-layer fog-layer-2"></div>
      <div className="fog-layer fog-layer-3"></div>
      
      {/* Main content */}
      <div className="app-content">
        <header className="app-header" role="banner">
          <h1 className="app-title">Spooky Time Machine!</h1>
          <p className="app-subtitle">Journey through the shadows of history...</p>
        </header>
        
        <main className="app-main" id="main-content" role="main" aria-label="Main application content">
          {/* Location Search */}
          <div className="search-container">
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              geocodingService={geocodingService}
            />
          </div>

          {/* Main content grid */}
          <div className="main-grid">
            {/* Left panel - Globe */}
            <div className="globe-panel">
              <Globe
                onLocationSelect={handleLocationSelect}
                selectedLocation={selectedLocation}
              />
              
              {/* Display selected coordinates */}
              {selectedLocation && (
                <div className="coordinates-display" role="status" aria-live="polite">
                  <p>
                    📍 {selectedLocation.latitude.toFixed(4)}°{' '}
                    {selectedLocation.latitude >= 0 ? 'N' : 'S'},{' '}
                    {Math.abs(selectedLocation.longitude).toFixed(4)}°{' '}
                    {selectedLocation.longitude >= 0 ? 'E' : 'W'}
                  </p>
                </div>
              )}
            </div>

            {/* Right panel - Tabbed Controls */}
            <div className="controls-panel">
              <ControlsTabs
                selectedLocation={selectedLocation}
                selectedTime={selectedTime}
                onTimeChange={handleTimeChange}
                onEventSelect={handleEventSelect}
                onImageGenerated={handleImageGenerated}
                onError={handleError}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <ErrorDisplay
              error={error}
              onRetry={handleRetry}
              onDismiss={handleDismissError}
            />
          )}

          {/* Image Display */}
          {generatedImage && !error && (
            <ImageDisplay
              image={generatedImage}
              location={selectedLocation}
              time={selectedTime}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
