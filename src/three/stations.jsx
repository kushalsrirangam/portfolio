import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import projects from "../data/projects";
import skills from "../data/skills";
import achievements from "../data/achievements";

const CYAN = "#00ffe7";
const BLUE = "#3b82f6";
const PURPLE = "#a855f7";
const GOLD = "#facc15";

export const SPACING = 36;

const reduceMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const SPIN = reduceMotion ? 0.15 : 1;

// One entry per page section, in order. `side` puts the object beside the
// section's text on wide screens (-1 left, 1 right, 0 centred).
export const STATIONS = [
  { y: 0, side: 0 },
  { y: 1.5, side: 1 },
  { y: -1, side: -1 },
  { y: 1, side: 1 },
  { y: -1.5, side: -1 },
  { y: 0.5, side: 0 },
  { y: 0, side: 0 },
].map((s, i) => ({ ...s, z: -i * SPACING }));

// Places its children at a station, pushed to the side on wide screens and
// centred (behind the glass panels) on narrow ones.
function Station({ index, children }) {
  const { size } = useThree();
  const { y, z, side } = STATIONS[index];
  const aspect = size.width / size.height;
  const offset = side * THREE.MathUtils.clamp((aspect - 0.7) * 5, 0, 6.5);
  const scale = aspect < 0.8 ? 0.7 : 1;
  return (
    <group position={[offset, y, z]} scale={scale}>
      {children}
    </group>
  );
}

function useSpin(ref, x, y) {
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += x * dt * SPIN;
    ref.current.rotation.y += y * dt * SPIN;
  });
}

/* 0 · Hero: an energy core inside a wireframe shell with orbiting rings */
function HeroCore() {
  const shell = useRef();
  const rings = useRef();
  useSpin(shell, 0.08, 0.12);
  useSpin(rings, 0.05, -0.1);
  return (
    <Station index={0}>
      {/* Pushed back so it frames the headline instead of covering it. */}
      <group position={[0, -0.3, -5]}>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.6, 20]} />
          <MeshDistortMaterial
            color={BLUE}
            emissive={CYAN}
            emissiveIntensity={0.35}
            roughness={0.15}
            metalness={0.6}
            distort={reduceMotion ? 0.15 : 0.4}
            speed={reduceMotion ? 0.5 : 2}
          />
        </mesh>
        <mesh ref={shell}>
          <icosahedronGeometry args={[2.6, 1]} />
          <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.35} />
        </mesh>
        <group ref={rings}>
          {[3.3, 3.9, 4.5].map((r, i) => (
            <mesh key={r} rotation={[Math.PI / 2 + i * 0.5, i * 0.7, 0]}>
              <torusGeometry args={[r, 0.02, 8, 160]} />
              <meshBasicMaterial color={i === 1 ? PURPLE : CYAN} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </Float>
      </group>
    </Station>
  );
}

/* 1 · About: a glowing knot, the "how I think" piece */
function AboutKnot() {
  const ref = useRef();
  useSpin(ref, 0.1, 0.25);
  return (
    <Station index={1}>
      <Float speed={2} floatIntensity={1}>
        <mesh ref={ref} scale={0.75}>
          <torusKnotGeometry args={[1.5, 0.42, 220, 24, 2, 3]} />
          <meshStandardMaterial
            color="#0e7490"
            emissive={CYAN}
            emissiveIntensity={0.25}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>
    </Station>
  );
}

/* 2 · Timeline: a rising helix with one glowing node per milestone */
function TimelineHelix() {
  const ref = useRef();
  useSpin(ref, 0, 0.2);
  const { tube, nodes } = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      const a = t * Math.PI * 4;
      pts.push(new THREE.Vector3(Math.cos(a) * 2, (t - 0.5) * 6, Math.sin(a) * 2));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const count = 6;
    return {
      tube: new THREE.TubeGeometry(curve, 200, 0.05, 8, false),
      nodes: Array.from({ length: count }, (_, i) => curve.getPoint((i + 0.5) / count)),
    };
  }, []);
  return (
    <Station index={2}>
      <group ref={ref}>
        <mesh geometry={tube}>
          <meshBasicMaterial color={CYAN} transparent opacity={0.6} toneMapped={false} />
        </mesh>
        {nodes.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshBasicMaterial color={i === nodes.length - 1 ? PURPLE : CYAN} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </Station>
  );
}

/* 3 · Projects: a slowly turning carousel of project screenshots */
function ProjectCarousel() {
  const ref = useRef();
  useSpin(ref, 0, 0.15);
  const textures = useTexture(projects.map((p) => p.img || "/images/aegisops.svg"));
  textures.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
  });
  const radius = 3.6;
  return (
    <Station index={3}>
      <group ref={ref}>
        {textures.map((tex, i) => {
          const a = (i / textures.length) * Math.PI * 2;
          return (
            <group
              key={projects[i].slug}
              position={[Math.sin(a) * radius, 0, Math.cos(a) * radius]}
              rotation={[0, a, 0]}
            >
              <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[2.9, 1.75]} />
                <meshBasicMaterial color={CYAN} toneMapped={false} />
              </mesh>
              <mesh>
                <planeGeometry args={[2.8, 1.65]} />
                <meshBasicMaterial map={tex} side={THREE.DoubleSide} toneMapped={false} />
              </mesh>
            </group>
          );
        })}
      </group>
    </Station>
  );
}

/* 4 · Skills: a point-cloud globe with one glowing node per skill */
function SkillsGlobe() {
  const ref = useRef();
  useSpin(ref, 0.03, 0.12);
  const { cloud, nodes } = useMemo(() => {
    const fib = (n, r) =>
      Array.from({ length: n }, (_, i) => {
        const y = 1 - (i / (n - 1)) * 2;
        const rad = Math.sqrt(1 - y * y);
        const th = Math.PI * (3 - Math.sqrt(5)) * i;
        return new THREE.Vector3(Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r);
      });
    const geo = new THREE.BufferGeometry().setFromPoints(fib(700, 3));
    return { cloud: geo, nodes: fib(skills.length, 3.05) };
  }, []);
  return (
    <Station index={4}>
      <group ref={ref}>
        <points geometry={cloud}>
          <pointsMaterial color={CYAN} size={0.045} sizeAttenuation transparent opacity={0.7} />
        </points>
        {nodes.map((p, i) => (
          <mesh key={skills[i].name} position={p}>
            <icosahedronGeometry args={[0.16, 1]} />
            <meshBasicMaterial color={i % 3 === 0 ? PURPLE : i % 3 === 1 ? CYAN : BLUE} toneMapped={false} />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry args={[2.2, 32, 32]} />
          <meshBasicMaterial color={BLUE} transparent opacity={0.08} />
        </mesh>
      </group>
    </Station>
  );
}

/* 5 · Achievements: gold trophies, one per achievement */
function Trophies() {
  const group = useRef();
  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((c, i) => {
      c.rotation.y = state.clock.elapsedTime * 0.6 * SPIN + i;
    });
  });
  const n = achievements.length;
  return (
    <Station index={5}>
      {/* Raised so the trophies float above the achievement cards. */}
      <pointLight color={GOLD} intensity={30} distance={12} position={[0, 3.6, 2]} />
      <group ref={group} position={[0, 3.6, 0]}>
        {achievements.map((a, i) => (
          <Float key={a.title} speed={2} floatIntensity={0.8}>
            <mesh position={[(i - (n - 1) / 2) * 2.6, i % 2 ? 0.4 : -0.2, 0]}>
              <octahedronGeometry args={[a.rare ? 0.6 : 0.45, 0]} />
              <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.3} emissive="#f59e0b" emissiveIntensity={0.7} flatShading />
            </mesh>
          </Float>
        ))}
      </group>
    </Station>
  );
}

/* 6 · Contact: a portal the camera arrives at */
function Portal() {
  const ring = useRef();
  const swirl = useRef();
  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.z += dt * 0.3 * SPIN;
    if (swirl.current) swirl.current.rotation.z -= dt * 0.6 * SPIN;
  });
  const swirlGeo = useMemo(() => {
    const pts = Array.from({ length: 600 }, (_, i) => {
      const r = 0.3 + Math.random() * 2.6;
      const a = i * 0.35 + r * 1.5;
      return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 0.4);
    });
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);
  return (
    <Station index={6}>
      <group position={[0, 0, -4]}>
        <mesh ref={ring}>
          <torusGeometry args={[3.2, 0.12, 24, 200]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
        <points ref={swirl} geometry={swirlGeo}>
          <pointsMaterial color={PURPLE} size={0.06} transparent opacity={0.8} />
        </points>
      </group>
    </Station>
  );
}

export default function Stations() {
  return (
    <>
      <HeroCore />
      <AboutKnot />
      <TimelineHelix />
      <ProjectCarousel />
      <SkillsGlobe />
      <Trophies />
      <Portal />
    </>
  );
}
