import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Coordinates } from '../types';
import { coordinatesToPoint } from '../utils/coordinateUtils';

interface CameraControllerProps {
  targetLocation?: Coordinates;
  animationDuration?: number;
  cameraDistance?: number;
}

// Smooth easing function
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function CameraController({
  targetLocation,
  animationDuration = 1200,
  cameraDistance = 2.2,
}: CameraControllerProps) {
  const { camera } = useThree();
  const animationRef = useRef<{
    startPosition: THREE.Vector3;
    endPosition: THREE.Vector3;
    startTime: number;
    duration: number;
    isAnimating: boolean;
  } | null>(null);

  const prevLocationRef = useRef<Coordinates | undefined>();

  useEffect(() => {
    // Only animate if location actually changed
    if (
      !targetLocation ||
      (prevLocationRef.current?.latitude === targetLocation.latitude &&
        prevLocationRef.current?.longitude === targetLocation.longitude)
    ) {
      return;
    }

    prevLocationRef.current = targetLocation;

    // Calculate target camera position - position camera to look at the selected point
    const targetPoint = coordinatesToPoint(targetLocation, 1);
    const cameraOffset = targetPoint.clone().normalize().multiplyScalar(cameraDistance);

    animationRef.current = {
      startPosition: camera.position.clone(),
      endPosition: cameraOffset,
      startTime: performance.now(),
      duration: animationDuration,
      isAnimating: true,
    };
  }, [targetLocation, camera, cameraDistance, animationDuration]);

  useFrame(() => {
    if (!animationRef.current?.isAnimating) return;

    const elapsed = performance.now() - animationRef.current.startTime;
    const progress = Math.min(elapsed / animationRef.current.duration, 1);
    const easedProgress = easeOutCubic(progress);

    // Smoothly interpolate camera position
    camera.position.lerpVectors(
      animationRef.current.startPosition,
      animationRef.current.endPosition,
      easedProgress
    );

    // Always look at globe center
    camera.lookAt(0, 0, 0);

    if (progress >= 1) {
      animationRef.current.isAnimating = false;
    }
  });

  return null;
}
