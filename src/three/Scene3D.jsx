import { Component, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import Stations, { STATIONS } from "./stations";
import { scrollStore, startTracking } from "./scrollStore";

const BG = "#07070f";
const LAST = STATIONS.length - 1;

// Flies the camera along a curve through every station, following scroll.
function CameraRig() {
  const current = useRef(0);
  const look = useRef(new THREE.Vector3());
  const { camPath, lookPath } = useMemo(() => {
    const cam = STATIONS.map((s) => new THREE.Vector3(0, s.y + 0.6, s.z + 13));
    const target = STATIONS.map((s) => new THREE.Vector3(0, s.y, s.z));
    return {
      camPath: new THREE.CatmullRomCurve3(cam),
      lookPath: new THREE.CatmullRomCurve3(target),
    };
  }, []);

  useFrame((state, dt) => {
    // Ease toward the scroll position so the flight feels smooth.
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * 4);
    current.current += (scrollStore.station - current.current) * k;
    const t = current.current / LAST;

    // Swing out sideways between stations, so moving feels like flying.
    const between = current.current % 1;
    const swing = Math.sin(between * Math.PI) * (Math.floor(current.current) % 2 ? -2.5 : 2.5);

    const p = camPath.getPoint(t);
    const { x: px, y: py } = scrollStore.pointer;
    state.camera.position.set(p.x + swing + px * 0.8, p.y + py * 0.5, p.z);

    look.current.lerp(lookPath.getPoint(Math.min(t + 0.02, 1)), 0.2);
    state.camera.lookAt(look.current);
    state.camera.rotation.z += swing * -0.02;
  });
  return null;
}

// If WebGL is unavailable or the scene crashes, keep the page usable: the
// sections still render over the plain dark background.
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Scene3D() {
  useEffect(() => startTracking(), []);
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <SceneBoundary>
        <Canvas
          dpr={[1, mobile ? 1.25 : 1.75]}
          camera={{ fov: 50, near: 0.1, far: 320, position: [0, 0.6, 13] }}
          gl={{ antialias: !mobile, powerPreference: "high-performance" }}
        >
          <color attach="background" args={[BG]} />
          <fog attach="fog" args={[BG, 18, 60]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={1.4} />
          <pointLight position={[-6, -2, -20]} color="#00ffe7" intensity={40} distance={40} />
          <pointLight position={[6, 2, -110]} color="#a855f7" intensity={40} distance={40} />

          {/* A star field stretched along the flight path, so the camera
              stays inside it from the hero to the contact portal. */}
          <group position={[0, 0, (STATIONS[LAST].z + 13) / 2]} scale={[1, 1, 2]}>
            <Stars radius={60} depth={60} count={mobile ? 1500 : 4000} factor={4} fade speed={0.6} />
          </group>

          <Suspense fallback={null}>
            <Stations />
          </Suspense>
          <CameraRig />
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
