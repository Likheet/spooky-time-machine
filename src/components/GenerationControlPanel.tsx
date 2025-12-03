import { useState, useEffect } from 'react';
import type { Coordinates, TimeSelection, GeneratedImage, ApiError } from '../types';
import { promptBuilderService } from '../services/PromptBuilderService';
import { imageGeneratorService } from '../services/ImageGeneratorService';
import { textGeneratorService } from '../services/TextGeneratorService';
import { useApiKey } from '../contexts/ApiKeyContext';
import './GenerationControlPanel.css';

interface GenerationControlPanelProps {
  selectedLocation: Coordinates | undefined;
  selectedTime: TimeSelection | undefined;
  onImageGenerated: (image: GeneratedImage) => void;
  onStoryGenerated: (data: { title: string; story: string }) => void;
  onError: (error: string) => void;
}

export function GenerationControlPanel({
  selectedLocation,
  selectedTime,
  onImageGenerated,
  onStoryGenerated,
  onError,
}: GenerationControlPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { apiKey, geminiKey, isConfigured } = useApiKey();

  // Update the services with the current API keys
  useEffect(() => {
    if (apiKey) {
      imageGeneratorService.setApiKey(apiKey);
    }
    if (geminiKey) {
      textGeneratorService.setApiKey(geminiKey);
    }
  }, [apiKey, geminiKey]);

  // Button is enabled only when both location and time are selected AND HF API key is configured
  const isEnabled = !isGenerating && selectedLocation !== undefined && selectedTime !== undefined && isConfigured;

  const handleGenerate = async () => {
    if (!selectedLocation || !selectedTime) {
      return;
    }

    setIsGenerating(true);
    onError(''); // Clear any previous errors
    onStoryGenerated({ title: '', story: '' }); // Clear previous story

    try {
      // Build the prompt
      const prompt = await promptBuilderService.buildPrompt(selectedLocation, selectedTime);

      // Start image generation
      const imagePromise = imageGeneratorService.generateImage(prompt);

      // Start story generation if Gemini key is available
      let storyPromise: Promise<{ title: string; story: string }> | null = null;
      if (geminiKey) {
        storyPromise = textGeneratorService.generateSpookyStory(selectedLocation, selectedTime);
      }

      // Wait for image generation (critical)
      const generatedImage = await imagePromise;
      onImageGenerated(generatedImage);

      // Handle story generation (optional/parallel)
      if (storyPromise) {
        try {
          const storyData = await storyPromise;
          onStoryGenerated(storyData);
        } catch (storyError) {
          console.warn('Story generation failed:', storyError);
          // We don't fail the whole process if story fails, just log it
        }
      }

    } catch (error) {
      // Handle errors (mainly image generation errors)
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
          {!isConfigured
            ? 'Configure your Hugging Face token using the 🔑 button...'
            : !selectedLocation && !selectedTime
              ? 'Select a location and time to begin...'
              : !selectedLocation
                ? 'Select a location on the globe...'
                : 'Choose a time period...'}
        </p>
      )}
    </div>
  );
}
