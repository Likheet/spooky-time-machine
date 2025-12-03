import { useEffect, useRef, useState, useCallback } from 'react';
import { geoOrthographic, geoPath, geoGraticule10, type GeoPermissibleObjects } from 'd3-geo';
import { select } from 'd3-selection';
import 'd3-transition'; // Side-effect import to extend d3-selection with transition
import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Coordinates } from '../types';
import './Globe.css';

interface GlobeProps {
  onLocationSelect: (coords: Coordinates) => void;
  selectedLocation?: Coordinates;
  highlightedLocations?: Coordinates[];
}

export function Globe({ onLocationSelect, selectedLocation }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [worldData, setWorldData] = useState<GeoPermissibleObjects | null>(null);
  const [rotation, setRotation] = useState<[number, number]>([0, -20]);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; rotation: [number, number] } | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Load world map data
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((response) => response.json())
      .then((data: Topology<{ countries: GeometryCollection }>) => {
        // Convert TopoJSON to GeoJSON using topojson-client
        const countries = topojson.feature(data, data.objects.countries);
        setWorldData(countries);
      })
      .catch((error) => console.error('Failed to load world data:', error));
  }, []);

  // Render the globe
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !worldData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = Math.min(width, height) / 2.2;

    // Create projection
    const projection = geoOrthographic()
      .scale(scale)
      .translate([width / 2, height / 2])
      .rotate(rotation);

    const path = geoPath(projection, ctx);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw ocean (background circle)
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    // Draw atmosphere glow
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      scale * 0.9,
      width / 2,
      height / 2,
      scale * 1.05
    );
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0)');
    gradient.addColorStop(0.8, 'rgba(56, 189, 248, 0.2)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0.4)');
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, scale * 1.05, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw graticule (grid lines)
    ctx.beginPath();
    path(geoGraticule10());
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Draw landmasses
    ctx.beginPath();
    path(worldData);
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Draw selected location marker
    if (selectedLocation) {
      const coords = projection([selectedLocation.longitude, selectedLocation.latitude]);
      if (coords) {
        const [x, y] = coords;
        // Check if point is visible (on front of globe)
        const distance = Math.sqrt(
          Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2)
        );
        if (distance < scale) {
          // Draw pulsing marker
          const time = Date.now() / 1000;
          const pulse = Math.sin(time * 3) * 0.3 + 0.7;

          // Outer glow
          ctx.beginPath();
          ctx.arc(x, y, 12 * pulse, 0, 2 * Math.PI);
          const markerGradient = ctx.createRadialGradient(x, y, 0, x, y, 12 * pulse);
          markerGradient.addColorStop(0, 'rgba(255, 107, 53, 0.8)');
          markerGradient.addColorStop(1, 'rgba(255, 107, 53, 0)');
          ctx.fillStyle = markerGradient;
          ctx.fill();

          // Inner marker
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = '#ff6b35';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }
  }, [worldData, rotation, selectedLocation]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      render();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [render]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Smooth rotation to selected location
  useEffect(() => {
    if (selectedLocation) {
      const targetRotation: [number, number] = [
        -selectedLocation.longitude,
        -selectedLocation.latitude,
      ];

      // Use D3 transition for smooth animation
      const canvas = canvasRef.current;
      if (!canvas) return;

      select(canvas)
        .transition()
        .duration(1200)
        .tween('rotate', () => {
          const interpolateX = (t: number) =>
            rotation[0] + (targetRotation[0] - rotation[0]) * t;
          const interpolateY = (t: number) =>
            rotation[1] + (targetRotation[1] - rotation[1]) * t;

          return (t: number) => {
            setRotation([interpolateX(t), interpolateY(t)]);
          };
        });
    }
  }, [selectedLocation]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotation: [...rotation],
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragStartRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const sensitivity = 0.5;
    const newRotation: [number, number] = [
      dragStartRef.current.rotation[0] + dx * sensitivity,
      Math.max(-90, Math.min(90, dragStartRef.current.rotation[1] - dy * sensitivity)),
    ];

    setRotation(newRotation);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Click to select location
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * canvas.width) / rect.width;
    const y = ((e.clientY - rect.top) * canvas.height) / rect.height;

    const width = canvas.width;
    const height = canvas.height;
    const scale = Math.min(width, height) / 2.2;

    const projection = geoOrthographic()
      .scale(scale)
      .translate([width / 2, height / 2])
      .rotate(rotation);

    const coords = projection.invert?.([x, y]);
    if (coords) {
      const [longitude, latitude] = coords;
      // Check if click is within globe bounds
      const distance = Math.sqrt(Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2));
      if (distance < scale) {
        onLocationSelect({
          latitude,
          longitude,
        });
      }
    }
  };

  return (
    <div className="globe-container" role="img" aria-label="Interactive 3D globe">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      {selectedLocation && (
        <div className="globe-lock-indicator">
          <span className="lock-icon">📍</span>
          <span className="lock-text">Location selected</span>
        </div>
      )}
    </div>
  );
}
