import { useLayoutEffect, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { bakeRole } from "./shared";
import bakeInfo from "./bake-info.json";

// How strongly the baked light shows, and how much live light remains.
// The lightmap already holds the ceiling lights, lamps and city glow, so the
// live lights are kept low (they mainly light the furniture models, plants
// and screens, which are not baked).
const LIGHTMAP_GAIN = 1.0;
const LIVE_LIGHT_SCALE = 0.3;
const FILL_LIGHT_SCALE = 0.35; // ambient + hemisphere: flat light would wash out the bake
const DEBUG = typeof window !== "undefined" && window.location.search.includes("bake-debug");

// The office with Blender-baked lighting (tools/bake). Swaps itself in for
// the live-lit "receiver" surfaces under `root`.
export default function BakedOffice({ root }) {
  const { scene } = useGLTF("/baked/office.glb");
  const lightmap = useTexture("/baked/office_lightmap.webp");

  const baked = useMemo(() => {
    lightmap.flipY = false;
    lightmap.channel = 1; // the "lightmap" UV set (TEXCOORD_1)
    lightmap.colorSpace = THREE.SRGBColorSpace;
    lightmap.anisotropy = 8;
    scene.traverse((o) => {
      if (!o.isMesh) return;
      o.material = o.material.clone();
      o.material.lightMap = lightmap;
      o.material.lightMapIntensity = bakeInfo.scale * LIGHTMAP_GAIN;
      // Baked light already includes bounce, so tone down image-based fill.
      o.material.envMapIntensity = 0.35;
      o.receiveShadow = false;
      o.castShadow = false;
      if (DEBUG) {
        // ?bake-debug: plain white surfaces, so only the baked light shows.
        o.material.map = null;
        o.material.normalMap = null;
        o.material.color.set("#ffffff");
        o.material.metalness = 0;
        o.material.envMapIntensity = 0;
      }
    });
    return scene;
  }, [scene, lightmap]);

  useLayoutEffect(() => {
    const hidden = [];
    const dimmed = [];
    root.current?.traverse((o) => {
      if (bakeRole(o) === "receiver" && o.visible) {
        o.visible = false;
        hidden.push(o);
      } else if (o.isLight) {
        dimmed.push([o, o.intensity]);
        const fill = o.isAmbientLight || o.isHemisphereLight;
        o.intensity *= DEBUG ? 0 : fill ? FILL_LIGHT_SCALE : LIVE_LIGHT_SCALE;
      }
    });
    return () => {
      hidden.forEach((o) => (o.visible = true));
      dimmed.forEach(([o, i]) => (o.intensity = i));
    };
  }, [root, baked]);

  return <primitive object={baked} />;
}

useGLTF.preload("/baked/office.glb");
