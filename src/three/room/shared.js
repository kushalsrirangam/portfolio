import * as THREE from "three";

export const FONT = "/fonts/orbitron-700.woff";

export const NEON = {
  pink: "#ff2bd6",
  purple: "#8b5cf6",
  cyan: "#00ffe7",
  blue: "#3b82f6",
  gold: "#f5c542",
};

export const reduceMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Animation speed multiplier: near-still for reduced-motion visitors.
export const SPEED = reduceMotion ? 0.15 : 1;

// Two shared RGB materials whose colour cycles through the rainbow, half a
// turn apart. Every LED strip, fan ring and headset light uses one of them,
// so one update per frame animates the whole room.
export const rgbA = new THREE.MeshBasicMaterial({ toneMapped: false });
export const rgbB = new THREE.MeshBasicMaterial({ toneMapped: false });

export function updateRgb(time) {
  const t = time * 0.06 * SPEED;
  rgbA.color.setHSL(t % 1, 1, 0.55);
  rgbB.color.setHSL((t + 0.5) % 1, 1, 0.55);
}

// Plain materials reused across the room.
export const MAT = {
  wall: new THREE.MeshStandardMaterial({ color: "#121226", roughness: 0.95 }),
  floor: new THREE.MeshStandardMaterial({ color: "#0b0b16", roughness: 0.35, metalness: 0.4 }),
  dark: new THREE.MeshStandardMaterial({ color: "#16161f", roughness: 0.5, metalness: 0.3 }),
  black: new THREE.MeshStandardMaterial({ color: "#07070b", roughness: 0.4, metalness: 0.5 }),
  gold: new THREE.MeshStandardMaterial({
    color: NEON.gold,
    metalness: 0.85,
    roughness: 0.25,
    emissive: "#7a5200",
    emissiveIntensity: 0.6,
  }),
};

// A glowing material of a fixed colour (blooms in the post-processing pass).
export function glow(color) {
  return new THREE.MeshBasicMaterial({ color, toneMapped: false });
}
