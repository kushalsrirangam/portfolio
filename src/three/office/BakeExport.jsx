import { useEffect } from "react";
import * as THREE from "three";
import { bakeRole } from "./shared";

// Only used by tools/bake/export-office.mjs, which opens the site with
// ?bake-export. Collects every receiver and occluder mesh in world space,
// named recv_N / occl_N, and exposes the
// scene as a binary glTF (base64) on window.__bakeGlb for the script to save.
export default function BakeExport({ root }) {
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js");
      if (cancelled || !root.current) return;
      root.current.updateMatrixWorld(true);
      const out = new THREE.Scene();
      let n = 0;
      root.current.traverse((o) => {
        const role = bakeRole(o);
        if (!role) return;
        const copy = new THREE.Mesh(o.geometry, o.material);
        copy.name = `${role === "receiver" ? "recv" : "occl"}_${n++}`;
        o.matrixWorld.decompose(copy.position, copy.quaternion, copy.scale);
        out.add(copy);
      });
      const glb = await new GLTFExporter().parseAsync(out, { binary: true, maxTextureSize: 2048 });
      const bytes = new Uint8Array(glb);
      let bin = "";
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      window.__bakeGlb = btoa(bin);
      window.__bakeCount = n;
    }, 3000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [root]);
  return null;
}
