import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Coordinates } from '../types';
import { coordinatesToPoint } from '../utils/coordinateUtils';

interface CameraAnimationOptions {
  duration?: number;
  distance?: number;
  onComplete?: () => void;
}

/**
 * Easing function for smooth camera movement (ease-in-out cubic)
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function useCameraAnimation(
  targetLocation: Coordinates | undefined,
  options: CameraAnimationOptions = {}
) {
  const { camera } = useThree();
  const animationRef = useRef<{
    startPosition: THREE.Vector3;
    endPosition: THREE.Vector3;
    startTime: number;
    duration: number;
    isAnimating: boolean;
    onComplete?: () => void;
  } | null>(null);
  
  const { duration = 1500, distance = 3, onComplete } = options;
  
  useEffect(() => {
    if (!targetLocation) return;
    
    // Calculate target camera position
    const targetPoint = coordinatesToPoint(targetLocation, 1);
    const cameraOffset = targetPoint.clone().normalize().multiplyScalar(distance);
    
    // Start animation
    animationRef.current = {
      startPosition: camera.position.clone(),
      endPosition: cameraOffset,
      startTime: Date.now(),
      duration,
      isAnimating: true,
      onComplete,
    };
  }, [targetLocation, camera, distance, duration, onComplete]);
  
  useFrame(() => {
    if (!animationRef.current?.isAnimating) return;
    
    const elapsed = Date.now() - animationRef.current.startTime;
    const progress = Math.min(elapsed / animationRef.current.duration, 1);
    const easedProgress = easeInOutCubic(progress);
    
    // Interpolate camera position
    camera.position.lerpVectors(
      animationRef.current.startPosition,
      animationRef.current.endPosition,
      easedProgress
    );
    
    // Always look at the center of the globe
    camera.lookAt(0, 0, 0);
    
    // Complete animation
    if (progress >= 1) {
      animationRef.current.isAnimating = false;
      if (animationRef.current.onComplete) {
        animationRef.current.onComplete();
      }
    }
  });
}
