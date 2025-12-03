import * as THREE from 'three';
import type { Coordinates } from '../types';

/**
 * Convert a 3D point on a sphere to latitude/longitude coordinates
 * @param point - The 3D intersection point on the sphere
 * @param radius - The radius of the sphere (default: 1)
 * @returns Coordinates object with latitude and longitude
 */
export function pointToCoordinates(point: THREE.Vector3, radius: number = 1): Coordinates {
  // Normalize the point to the sphere surface
  const normalized = point.clone().normalize().multiplyScalar(radius);
  
  // Calculate latitude (phi) - angle from the equator
  // Range: -90 to 90 degrees
  const latitude = (Math.asin(normalized.y / radius) * 180) / Math.PI;
  
  // Calculate longitude (theta) - angle around the y-axis
  // Range: -180 to 180 degrees
  const longitude = (Math.atan2(normalized.x, normalized.z) * 180) / Math.PI;
  
  return {
    latitude: Number(latitude.toFixed(6)),
    longitude: Number(longitude.toFixed(6)),
  };
}

/**
 * Convert latitude/longitude coordinates to a 3D point on a sphere
 * @param coords - The coordinates object
 * @param radius - The radius of the sphere (default: 1)
 * @returns A 3D vector representing the point on the sphere
 */
export function coordinatesToPoint(coords: Coordinates, radius: number = 1): THREE.Vector3 {
  const phi = (90 - coords.latitude) * (Math.PI / 180);
  const theta = (coords.longitude + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  
  return new THREE.Vector3(x, y, z);
}

/**
 * Validate that coordinates are within valid ranges
 * @param coords - The coordinates to validate
 * @returns true if valid, false otherwise
 */
export function validateCoordinates(coords: Coordinates): boolean {
  return (
    coords.latitude >= -90 &&
    coords.latitude <= 90 &&
    coords.longitude >= -180 &&
    coords.longitude <= 180
  );
}
