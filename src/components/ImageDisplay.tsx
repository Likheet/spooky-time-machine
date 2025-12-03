import { useState } from 'react';
import type { GeneratedImage, Coordinates, TimeSelection } from '../types';
import { LazyImage } from './LazyImage';
import './ImageDisplay.css';

interface ImageDisplayProps {
  image: GeneratedImage | null;
  location: Coordinates | undefined;
  time: TimeSelection | undefined;
}

export function ImageDisplay({ image, location, time }: ImageDisplayProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (!image) {
    return null;
  }

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `time-travel-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(image.url);
        const blob = await response.blob();
        const file = new File([blob], 'time-travel-image.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'Time Travel Explorer',
          text: `${location?.name || 'A location'} in ${time?.displayName || 'the past'}`,
          files: [file],
        });
      } catch (error) {
        // User cancelled or share failed
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: copy image URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  return (
    <div className="image-display-container">
      <div className="image-frame">
        {/* Halloween-themed decorative corners */}
        <div className="frame-corner frame-corner-tl"></div>
        <div className="frame-corner frame-corner-tr"></div>
        <div className="frame-corner frame-corner-bl"></div>
        <div className="frame-corner frame-corner-br"></div>
        
        {/* Image loading state */}
        {isImageLoading && !imageError && (
          <div className="image-loading">
            <div className="loading-spinner">
              <span className="spinner-symbol">✦</span>
            </div>
            <p>Materializing vision...</p>
          </div>
        )}
        
        {/* Image error state */}
        {imageError && (
          <div className="image-error">
            <p>Failed to load image</p>
          </div>
        )}
        
        {/* The actual image */}
        <LazyImage
          src={image.url}
          alt={`${location?.name || 'Location'} in ${time?.displayName || 'the past'}`}
          className={`generated-image ${isImageLoading ? 'loading' : 'loaded'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      
      {/* Description (if available) */}
      {image.metadata?.description && (
        <div className="image-description">
          <h3 className="description-title">Historical Vision</h3>
          <p className="description-text">{image.metadata.description}</p>
        </div>
      )}

      {/* Metadata display */}
      <div className="image-metadata">
        <div className="metadata-section">
          <span className="metadata-label">Location:</span>
          <span className="metadata-value">
            {location?.name || `${location?.latitude.toFixed(4)}°, ${location?.longitude.toFixed(4)}°`}
          </span>
        </div>
        
        <div className="metadata-section">
          <span className="metadata-label">Time Period:</span>
          <span className="metadata-value">{time?.displayName || 'Unknown'}</span>
        </div>
        
        <div className="metadata-section">
          <span className="metadata-label">Generated:</span>
          <span className="metadata-value">
            {image.timestamp.toLocaleString()}
          </span>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="image-actions">
        <button
          className="action-button download-button"
          onClick={handleDownload}
          aria-label="Download image"
        >
          <span className="button-icon">⬇</span>
          <span className="button-label">Download</span>
        </button>
        
        <button
          className="action-button share-button"
          onClick={handleShare}
          aria-label="Share image"
        >
          <span className="button-icon">🔗</span>
          <span className="button-label">Share</span>
        </button>
      </div>
    </div>
  );
}
