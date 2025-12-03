import { memo, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Coordinates } from '../types';
import { GlobeSphere } from './GlobeSphere';
import { LocationMarker } from './LocationMarker';
import { CameraController } from './CameraController';
import './Globe.css';

interface GlobeProps {
  onLocationSelect: (coords: Coordinates) => void;
  selectedLocation?: Coordinates;
  highlightedLocations?: Coordinates[];
}

function GlobeComponent({
  onLocationSelect,
  selectedLocation,
  highlightedLocations,
}: GlobeProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isLocked, setIsLocked] = useState(false);

  // When a location is selected, lock the globe and disable auto-rotate
  useEffect(() => {
    if (selectedLocation) {
      setIsLocked(true);
      // Re-enable manual controls after camera animation completes
      const timer = setTimeout(() => {
        if (controlsRef.current) {
          controlsRef.current.enabled = true;
        }
      }, 1600);
      return () => clearTimeout(timer);
    } else {
      setIsLocked(false);
    }
  }, [selectedLocation]);

  const handleLocationSelect = (coords: Coordinates) => {
    // Temporarily disable controls during animation
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
    onLocationSelect(coords);
  };

  return (
    <div className="globe-container" role="img" aria-label="Interactive 3D globe">
      <Canvas
        camera={{
          position: [0, 0, 2.8],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight position={[5, 3, 5]} intensity={1.5} color="#fff8f0" />
        <directionalLight position={[-5, -2, -5]} intensity={0.3} color="#a0c4ff" />
        <pointLight position={[0, 0, 3]} intensity={0.2} color="#ffffff" />

        {/* Camera animation controller */}
        <CameraController
          targetLocation={selectedLocation}
          animationDuration={1200}
          cameraDistance={2.2}
        />

        {/* OrbitControls for manual interaction */}
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={1.5}
          maxDistance={4}
          rotateSpeed={0.4}
          zoomSpeed={0.6}
          enableDamping={true}
          dampingFactor={0.05}
        />

        {/* Globe sphere */}
        <GlobeSphere onLocationSelect={handleLocationSelect} isLocked={isLocked} />

        {/* Selected location marker */}
        {selectedLocation && (
          <LocationMarker location={selectedLocation} color="#ff6b35" pulseSpeed={2} />
        )}

        {/* Highlighted locations */}
        {highlightedLocations?.map((location, index) => (
          <LocationMarker
            key={`${location.latitude}-${location.longitude}-${index}`}
            location={location}
            color="#9d4edd"
            pulseSpeed={1.5}
          />
        ))}
      </Canvas>

      {/* Lock indicator */}
      {isLocked && (
        <div className="globe-lock-indicator">
          <span className="lock-icon">📍</span>
          <span className="lock-text">Location locked</span>
        </div>
      )}
    </div>
  );
}

export const Globe = memo(GlobeComponent, (prevProps, nextProps) => {
  return (
    prevProps.selectedLocation?.latitude === nextProps.selectedLocation?.latitude &&
    prevProps.selectedLocation?.longitude === nextProps.selectedLocation?.longitude &&
    prevProps.highlightedLocations?.length === nextProps.highlightedLocations?.length
  );
});
