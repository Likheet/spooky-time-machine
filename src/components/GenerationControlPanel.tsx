import { useState } from 'react';
import type { Coordinates, TimeSelection, GeneratedImage, ApiError } from '../types';
import { promptBuilderService } from '../services/PromptBuilderService';
import { imageGeneratorService } from '../services/ImageGeneratorService';
import './GenerationControlPanel.css';

interface GenerationControlPanelProps {
  selectedLocation: Coordinates | undefined;
  selectedTime: TimeSelection | undefined;
  onImageGenerated: (image: GeneratedImage) => void;
  onError: (error: string) => void;
}

export function GenerationControlPanel({
  selectedLocation,
  selectedTime,
  onImageGenerated,
  onError,
}: GenerationControlPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Button is enabled only when both location and time are selected
  const isEnabled = !isGenerating && selectedLocation !== undefined && selectedTime !== undefined;

  const handleGenerate = async () => {
    if (!selectedLocation || !selectedTime) {
      return;
    }

    setIsGenerating(true);
    onError(''); // Clear any previous errors

    try {
      // Build the prompt
      const prompt = await promptBuilderService.buildPrompt(selectedLocation, selectedTime);
      
      // Generate the image
      const generatedImage = await imageGeneratorService.generateImage(prompt);
      
      // Notify parent component
      onImageGenerated(generatedImage);
    } catch (error) {
      // Handle errors
      const apiError = error as ApiError;
      onError(apiError.message || 'An unexpected error occurred during image generation');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="generation-control-panel">
      <button
        className={`generate-button ${isEnabled ? 'enabled' : 'disabled'}`}
        onClick={handleGenerate}
        disabled={!isEnabled}
        aria-label="Generate historical image"
      >
        {isGenerating ? (
          <span className="button-content">
            <span className="loading-indicator">
              <span className="pentagram">✦</span>
            </span>
            <span className="button-text">Summoning Vision...</span>
          </span>
        ) : (
          <span className="button-content">
            <span className="button-icon">🔮</span>
            <span className="button-text">Generate Image</span>
          </span>
        )}
      </button>
      
      {!isEnabled && !isGenerating && (
        <p className="hint-text">
          {!selectedLocation && !selectedTime
            ? 'Select a location and time to begin...'
            : !selectedLocation
            ? 'Select a location on the globe...'
            : 'Choose a time period...'}
        </p>
      )}
    </div>
  );
}
