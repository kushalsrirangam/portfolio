import { Component, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import Room from "./room/Room";
import Setup from "./room/Setup";
import { LevelWall, TrophyShelf, Arcade } from "./room/Props";
import { scrollStore, startTracking } from "./scrollStore";

const BG = "#05050c";

// One camera shot per page section, in page order.
// `frame` slides the shot sideways on wide screens so the subject sits beside
// the section's text panel: +1 = subject on the right, -1 = on the left.
const SHOTS = [
  { pos: [3.3, 2.25, 2.1], target: [-0.1, 1.15, -2.7], frame: 0.5 }, // hero: the whole setup
  { pos: [-0.55, 1.7, -1.5], target: [-1.15, 1.25, -3.05], frame: -0.9 }, // about: profile screen
  { pos: [-1.3, 2.45, -1.0], target: [-6.47, 2.4, -1.0], frame: -0.85 }, // timeline: level wall
  { pos: [0.8, 1.7, -1.3], target: [0, 1.3, -3.25], frame: 0.9 }, // projects: main monitor
  { pos: [4.2, 1.7, -1.65], target: [5.17, 1.45, -3.06], frame: 0.9 }, // skills: arcade
  { pos: [3.4, 2.25, 0.5], target: [6.25, 2.15, 0.5], frame: 0.9 }, // achievements: trophies
  { pos: [-1.6, 3.1, 6.4], target: [1.4, 2.2, -3.6], frame: 0.95 }, // contact: pull back
];
const LAST = SHOTS.length - 1;

const smooth = (x) => x * x * (3 - 2 * x);

// Moves the camera between shots as the page scrolls.
function CameraRig() {
  const current = useRef(0);
  const target = useRef(new THREE.Vector3());
  const tmp = useRef(new THREE.Vector3());
  const path = useMemo(
    () => new THREE.CatmullRomCurve3(SHOTS.map((s) => new THREE.Vector3(...s.pos)), false, "centripetal"),
    []
  );
  const targets = useMemo(() => SHOTS.map((s) => new THREE.Vector3(...s.target)), []);

  useFrame((state, dt) => {
    const cam = state.camera;
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * 3.5);
    current.current += (scrollStore.station - current.current) * k;
    const s = THREE.MathUtils.clamp(current.current, 0, LAST);
    const i = Math.min(Math.floor(s), LAST - 1);
    const f = smooth(s - i);

    // Position follows a smooth curve; aim blends between subjects.
    path.getPoint(s / LAST, cam.position);
    tmp.current.lerpVectors(targets[i], targets[i + 1], f);

    // Portrait screens see less of the room, so back the camera away from
    // its subject to keep the same things in shot.
    const { width, height } = state.size;
    const aspect = width / height;
    if (aspect < 1) {
      const pull = 1 + (1 - aspect) * 0.9;
      cam.position.sub(tmp.current).multiplyScalar(pull).add(tmp.current);
    }

    const { x: px, y: py } = scrollStore.pointer;
    cam.position.x += px * 0.12;
    cam.position.y += py * 0.08;
    target.current.lerp(tmp.current, 0.25);
    cam.lookAt(target.current);

    // Slide the framing so the subject sits beside the text panel.
    const frame = THREE.MathUtils.lerp(SHOTS[i].frame, SHOTS[i + 1].frame, f);
    const wide = aspect > 1.15;
    const shift = wide ? -frame * width * 0.22 : 0;
    cam.setViewOffset(width, height, shift, 0, width, height);
    cam.updateProjectionMatrix();
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
          camera={{ fov: 50, near: 0.05, far: 60, position: SHOTS[0].pos }}
          gl={{ antialias: !mobile, powerPreference: "high-performance" }}
        >
          <color attach="background" args={[BG]} />
          <fog attach="fog" args={[BG, 9, 24]} />
          <Suspense fallback={null}>
            <Room />
            <Setup />
            <LevelWall />
            <TrophyShelf />
            <Arcade />
          </Suspense>
          <CameraRig />
          {/* Neon glow. Skipped on phones to keep them smooth. */}
          {!mobile && (
            <EffectComposer multisampling={0}>
              <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.6} luminanceSmoothing={0.25} />
              <Vignette offset={0.3} darkness={0.6} />
            </EffectComposer>
          )}
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
