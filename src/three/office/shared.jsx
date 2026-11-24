import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export const FONT = "/fonts/space-grotesk-700.woff";

// Room layout in metres. The back wall is glass onto the city.
export const ROOM = {
  left: -6,
  right: 6,
  back: -4.2,
  front: 5.5,
  height: 3.2,
};

export const ACCENT = "#22d3ee";

export const MAT = {
  wall: new THREE.MeshStandardMaterial({ color: "#e7e3dc", roughness: 0.92 }),
  ceiling: new THREE.MeshStandardMaterial({ color: "#f3f1ec", roughness: 0.95 }),
  walnut: new THREE.MeshStandardMaterial({ color: "#5a3a24", roughness: 0.55 }),
  oak: new THREE.MeshStandardMaterial({ color: "#c9a57b", roughness: 0.45 }),
  whiteTop: new THREE.MeshStandardMaterial({ color: "#f4f4f2", roughness: 0.35 }),
  blackMetal: new THREE.MeshStandardMaterial({ color: "#1b1b1d", roughness: 0.35, metalness: 0.8 }),
  aluminium: new THREE.MeshStandardMaterial({ color: "#b9bcc2", roughness: 0.3, metalness: 1 }),
  screenOff: new THREE.MeshStandardMaterial({ color: "#050506", roughness: 0.15, metalness: 0.2 }),
  gold: new THREE.MeshStandardMaterial({ color: "#d4af37", roughness: 0.2, metalness: 1 }),
  steelLetters: new THREE.MeshStandardMaterial({ color: "#d9dde3", roughness: 0.25, metalness: 1 }),
  glass: new THREE.MeshStandardMaterial({
    color: "#cfe3ff",
    roughness: 0.05,
    metalness: 0.9,
    transparent: true,
    opacity: 0.08,
  }),
};

// A light source you can see (ceiling strips, lamp bulbs): bright enough
// to pick up a soft glow from the bloom pass.
export function lightMat(color = "#fff4e0", strength = 3) {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color).multiplyScalar(strength),
    toneMapped: false,
  });
}

// Loads a CC0 model from /models and returns a fresh copy, so the same
// model can be placed several times.
export function useModel(name) {
  const { scene } = useGLTF(`/models/${name}.glb`);
  return useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return copy;
  }, [scene]);
}

export function Model({ name, ...props }) {
  const object = useModel(name);
  return <primitive object={object} {...props} />;
}

// Crop a texture to fill a w×h surface without stretching.
export function fitCover(tex, w, h) {
  const img = tex.image;
  if (!img || !img.width) return;
  const imgAspect = img.width / img.height;
  const aspect = w / h;
  if (imgAspect > aspect) {
    tex.repeat.set(aspect / imgAspect, 1);
    tex.offset.set((1 - aspect / imgAspect) / 2, 0);
  } else {
    tex.repeat.set(1, imgAspect / aspect);
    tex.offset.set(0, (1 - imgAspect / aspect) / 2);
  }
}

export const MODELS = [
  "modern_arm_chair_01", "modern_coffee_table_01", "side_table_01",
  "mid_century_lounge_chair", "potted_plant_02", "potted_plant_04",
  "modern_ceiling_lamp_01", "wall_clock", "classic_laptop",
  "office_notepads", "ceramic_vase_01",
];
