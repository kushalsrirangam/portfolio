import { Component, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, N8AO, Vignette } from "@react-three/postprocessing";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Office from "./office/Office";
import Workstation from "./office/Workstation";
import { JourneyWall, MeetingArea, AwardsShelf } from "./office/Areas";
import { MODELS } from "./office/shared";
import { scrollStore, startTracking } from "./scrollStore";

const BG = "#0b0d12";

// Start fetching the furniture as soon as this file loads.
MODELS.forEach((m) => useGLTF.preload(`/models/${m}.glb`));

// One camera shot per page section, in page order.
// `frame` slides the shot sideways on wide screens so the subject sits beside
// the section's text panel: +1 = subject on the right, -1 = on the left.
const SHOTS = [
  { pos: [3.4, 1.75, 2.6], target: [-0.4, 1.05, -3.0], frame: 0.5 }, // hero: the office and the desk
  { pos: [0.2, 1.32, -2.2], target: [-0.62, 1.1, -3.42], frame: -0.9 }, // about: profile on the side screen
  { pos: [-2.6, 1.6, -1.0], target: [-6, 1.6, -1.0], frame: -0.85 }, // timeline: journey wall
  { pos: [0.5, 1.3, -2.55], target: [0.12, 1.1, -3.5], frame: 0.9 }, // projects: main monitor
  { pos: [2.3, 1.55, -2.2], target: [6, 1.4, -2.2], frame: 0.9 }, // skills: meeting room TV
  { pos: [3.0, 1.5, 1.0], target: [6, 1.3, 1.0], frame: 0.9 }, // achievements: awards shelf
  { pos: [1.4, 1.75, 5.6], target: [-4.0, 0.8, 2.4], frame: -0.85 }, // contact: the whole office
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
          camera={{ fov: 45, near: 0.03, far: 200, position: SHOTS[0].pos }}
          gl={{ antialias: !mobile, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        >
          <Suspense fallback={null}>
            <Office />
            <Workstation />
            <JourneyWall />
            <MeetingArea />
            <AwardsShelf />
          </Suspense>
          <CameraRig />
          {/* Ambient occlusion (soft contact darkening) and a gentle glow on
              light sources. Skipped on phones to keep them smooth. */}
          {!mobile && (
            <EffectComposer multisampling={0}>
              <N8AO aoRadius={0.6} intensity={2.2} distanceFalloff={0.6} halfRes />
              <Bloom mipmapBlur intensity={0.35} luminanceThreshold={1.0} luminanceSmoothing={0.2} />
              <Vignette offset={0.35} darkness={0.45} />
            </EffectComposer>
          )}
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
