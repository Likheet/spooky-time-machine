import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import type { Coordinates } from '../types';
import { pointToCoordinates } from '../utils/coordinateUtils';

interface GlobeSphereProps {
  onLocationSelect?: (coords: Coordinates) => void;
  isLocked?: boolean;
}

export function GlobeSphere({ onLocationSelect, isLocked = false }: GlobeSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Load Earth textures - using NASA Blue Marble imagery
  const earthDayTexture = useLoader(
    TextureLoader,
    'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg'
  );

  const earthBumpTexture = useLoader(
    TextureLoader,
    'https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png'
  );

  // Set texture properties for better quality
  useEffect(() => {
    if (earthDayTexture) {
      earthDayTexture.colorSpace = THREE.SRGBColorSpace;
      earthDayTexture.anisotropy = 16;
    }
  }, [earthDayTexture]);

  // Slow rotation when not locked
  useFrame(() => {
    if (!isLocked && meshRef.current) {
      meshRef.current.rotation.y += 0.0015;
    }
    if (!isLocked && cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.002;
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (onLocationSelect && event.point) {
      // Account for globe rotation when calculating coordinates
      const localPoint = event.point.clone();
      if (meshRef.current) {
        // Transform point to local space considering rotation
        const inverseMatrix = new THREE.Matrix4().copy(meshRef.current.matrixWorld).invert();
        localPoint.applyMatrix4(inverseMatrix);
      }
      const coords = pointToCoordinates(localPoint);
      onLocationSelect(coords);
    }
  };

  return (
    <group>
      {/* Main Earth sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={earthDayTexture}
          bumpMap={earthBumpTexture}
          bumpScale={0.03}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* Atmospheric glow - inner */}
      <mesh scale={1.01}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#88ccff"
          transparent
          opacity={hovered ? 0.12 : 0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Atmospheric glow - outer */}
      <mesh scale={1.08}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          uniforms={{
            glowColor: { value: new THREE.Color('#4da6ff') },
            intensity: { value: hovered ? 0.8 : 0.5 },
          }}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 glowColor;
            uniform float intensity;
            varying vec3 vNormal;
            void main() {
              float glow = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
              gl_FragColor = vec4(glowColor, glow * intensity * 0.4);
            }
          `}
        />
      </mesh>
    </group>
  );
}
