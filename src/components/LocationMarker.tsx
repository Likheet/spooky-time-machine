import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Coordinates } from '../types';
import { coordinatesToPoint } from '../utils/coordinateUtils';

interface LocationMarkerProps {
  location: Coordinates;
  color?: string;
  pulseSpeed?: number;
  radius?: number;
}

export function LocationMarker({
  location,
  color = '#39ff14',
  pulseSpeed = 2,
  radius = 1,
}: LocationMarkerProps) {
  const markerRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0);
  
  // Convert coordinates to 3D position
  const position = coordinatesToPoint(location, radius * 1.01);
  
  // Animate marker appearance
  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 300; // 300ms animation
      const newScale = Math.min(elapsed, 1);
      setScale(newScale);
      
      if (newScale < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animate();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [location]);
  
  // Pulsing glow animation
  useFrame(({ clock }) => {
    if (glowRef.current) {
      const pulse = Math.sin(clock.getElapsedTime() * pulseSpeed) * 0.3 + 0.7;
      glowRef.current.scale.setScalar(pulse);
      
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = pulse * 0.6;
    }
  });
  
  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Main marker pin */}
      <mesh ref={markerRef} scale={scale}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Pulsing glow effect */}
      <mesh ref={glowRef} scale={1}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Vertical pin line */}
      <mesh scale={[1, 1, scale]}>
        <cylinderGeometry args={[0.005, 0.005, 0.05, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}
