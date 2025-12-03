import { useState, useEffect } from 'react';
import './App.css';
import { CandlelightEffect } from './components/CandlelightEffect';
import { JackOLanternGlow } from './components/JackOLanternGlow';

import { ApiKeySettings } from './components/ApiKeySettings';
import { Globe } from './components/Globe';
import { ImageDisplay } from './components/ImageDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';
import { LocationSearch } from './components/LocationSearch';
import { ControlsTabs } from './components/ControlsTabs';
import { geocodingService } from './services/GeocodingService';
import type { Coordinates, TimeSelection, GeneratedImage, NotableEvent } from './types';
import { CustomCursor } from './components/CustomCursor';

function App() {
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | undefined>();
  const [selectedTime, setSelectedTime] = useState<TimeSelection | undefined>();
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [spookyStory, setSpookyStory] = useState<string>('');
  const [spookyTitle, setSpookyTitle] = useState<string>('');
  const [error, setError] = useState<string>('');

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
    setSelectedLocation(coords);
    setError(''); // Clear any search-related errors
  };

  const handleTimeChange = (time: TimeSelection) => {
    console.log('Time selected:', time);
    setSelectedTime(time);
  };

  const handleImageGenerated = (image: GeneratedImage) => {
    console.log('Image generated:', image);
    setGeneratedImage(image);
    setError(''); // Clear any previous errors
  };

  const handleStoryGenerated = (data: { title: string; story: string }) => {
    console.log('Story generated:', data);
    setSpookyStory(data.story);
    setSpookyTitle(data.title);
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

      <CustomCursor />

      {/* Settings */}
      <ApiKeySettings />

      {/* Animated effects */}
      <CandlelightEffect />
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
                onStoryGenerated={handleStoryGenerated}
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
              story={spookyStory}
              title={spookyTitle}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
