import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import projects from "../../data/projects";
import { FONT, ACCENT, MAT, Model, fitCover } from "./shared";

// Desk in front of the walnut feature wall, facing the room's back.
const DESK = { x: 0, z: -3.3, w: 1.8, d: 0.8, h: 0.75 };
const MAIN_SCREEN = { pos: [0.12, 1.13, -3.5], rotY: 0, w: 0.7, h: 0.4 };
const SIDE_SCREEN = { pos: [-0.62, 1.13, -3.42], rotY: 0.38, w: 0.6, h: 0.34 };

function Desk() {
  const { x, z, w, d, h } = DESK;
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[w, 0.035, d]} radius={0.012} position={[0, h - 0.018, 0]} material={MAT.oak} castShadow receiveShadow />
      {/* Slim black steel frame */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (w / 2 - 0.08), 0, 0]}>
          <mesh position={[0, (h - 0.04) / 2, 0]} material={MAT.blackMetal} castShadow>
            <boxGeometry args={[0.05, h - 0.04, 0.05]} />
          </mesh>
          <mesh position={[0, 0.015, 0]} material={MAT.blackMetal}>
            <boxGeometry args={[0.06, 0.03, d - 0.06]} />
          </mesh>
          <mesh position={[0, h - 0.055, 0]} material={MAT.blackMetal}>
            <boxGeometry args={[0.05, 0.03, d - 0.1]} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, h - 0.06, -d / 2 + 0.1]} material={MAT.blackMetal}>
        <boxGeometry args={[w - 0.2, 0.04, 0.03]} />
      </mesh>
      {/* Felt desk mat */}
      <RoundedBox args={[0.9, 0.004, 0.38]} radius={0.002} position={[0.05, h + 0.002, 0.15]} castShadow={false} receiveShadow>
        <meshStandardMaterial color="#3d3d42" roughness={1} />
      </RoundedBox>
    </group>
  );
}

function Monitor({ pos, rotY, w, h, children }) {
  const deskTop = DESK.h;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <RoundedBox args={[w + 0.016, h + 0.016, 0.02]} radius={0.006} material={MAT.blackMetal} castShadow />
      <group position={[0, 0, 0.0105]}>{children}</group>
      {/* Aluminium stand */}
      <mesh position={[0, (deskTop - pos[1]) / 2 - 0.02, -0.06]} rotation={[0.12, 0, 0]} material={MAT.aluminium} castShadow>
        <boxGeometry args={[0.05, pos[1] - deskTop + 0.02, 0.012]} />
      </mesh>
      <RoundedBox args={[0.22, 0.008, 0.16]} radius={0.003} position={[0, deskTop - pos[1] + 0.004, -0.05]} material={MAT.aluminium} castShadow />
    </group>
  );
}

// Main screen: cycles through the project screenshots.
function ProjectScreen({ w, h }) {
  const textures = useTexture(projects.map((p) => p.img || "/images/aegisops.svg"));
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false, color: "#d9d9d9" }), []);
  const label = useRef();
  const shown = useRef(-1);
  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      fitCover(t, w, h);
    });
  }, [textures, w, h]);
  useFrame(({ clock }) => {
    const i = Math.floor(clock.elapsedTime / 4) % textures.length;
    if (i === shown.current) return;
    shown.current = i;
    mat.map = textures[i];
    mat.needsUpdate = true;
    if (label.current) label.current.text = projects[i].title.split(" (")[0];
  });
  return (
    <group>
      <mesh material={mat}>
        <planeGeometry args={[w, h]} />
      </mesh>
      <mesh position={[0, -h / 2 + 0.018, 0.0005]}>
        <planeGeometry args={[w, 0.036]} />
        <meshBasicMaterial color="#0b0f17" transparent opacity={0.8} toneMapped={false} />
      </mesh>
      <Text ref={label} font={FONT} fontSize={0.017} color="#e2e8f0" anchorX="left" anchorY="middle"
        position={[-w / 2 + 0.02, -h / 2 + 0.018, 0.001]} material-toneMapped={false}>
        {" "}
      </Text>
    </group>
  );
}

// Side screen: a clean professional profile card.
function ProfileScreen({ w, h }) {
  const photo = useTexture("/images/my.JPG");
  useEffect(() => {
    photo.colorSpace = THREE.SRGBColorSpace;
    fitCover(photo, 0.13, 0.13);
  }, [photo]);
  const line = (text, y, size, color) => (
    <Text font={FONT} fontSize={size} color={color} anchorX="left" anchorY="middle"
      position={[-0.07, y, 0.001]} maxWidth={0.34} material-toneMapped={false}>
      {text}
    </Text>
  );
  return (
    <group>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color="#e9edf2" toneMapped={false} />
      </mesh>
      <mesh position={[0, h / 2 - 0.035, 0.0005]}>
        <planeGeometry args={[w, 0.07]} />
        <meshBasicMaterial color="#0f172a" toneMapped={false} />
      </mesh>
      <mesh position={[-0.19, 0.035, 0.001]}>
        <circleGeometry args={[0.068, 48]} />
        <meshBasicMaterial map={photo} toneMapped={false} />
      </mesh>
      {line("Kushal Sri Rangam", 0.075, 0.026, "#0f172a")}
      {line("AI & Data Engineer", 0.04, 0.016, "#0e7490")}
      {line("M.S. Computer Science · University of the Pacific", 0.008, 0.011, "#475569")}
      {line("● Open to opportunities", -0.03, 0.013, "#15803d")}
      <Text font={FONT} fontSize={0.012} color="#334155" anchorX="left" anchorY="top"
        position={[-0.27, -0.075, 0.001]} maxWidth={0.54} lineHeight={1.4} material-toneMapped={false}>
        {"Multi-agent AI · RAG · Computer vision · IoT · Cloud\nIEEE AIIoT 2025 author · MIT RAISE hackathon winner"}
      </Text>
    </group>
  );
}

// Low-profile aluminium keyboard and mouse.
function Peripherals() {
  const keys = useRef();
  const cols = 15;
  const rows = 5;
  useEffect(() => {
    const m = new THREE.Matrix4();
    let i = 0;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        m.setPosition((c - (cols - 1) / 2) * 0.0185, 0, (r - (rows - 1) / 2) * 0.0185);
        keys.current.setMatrixAt(i++, m);
      }
    keys.current.instanceMatrix.needsUpdate = true;
  }, []);
  const y = DESK.h;
  return (
    <group>
      <group position={[0.02, y + 0.006, -3.08]}>
        <RoundedBox args={[0.29, 0.008, 0.105]} radius={0.003} material={MAT.aluminium} castShadow />
        <instancedMesh ref={keys} args={[null, null, cols * rows]} position={[0, 0.006, 0]}>
          <boxGeometry args={[0.0155, 0.004, 0.0155]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.6} />
        </instancedMesh>
      </group>
      <mesh position={[0.32, y + 0.012, -3.06]} scale={[0.55, 0.28, 1]} material={MAT.whiteTop} castShadow>
        <sphereGeometry args={[0.055, 32, 16]} />
      </mesh>
      {/* Coffee mug */}
      <group position={[-0.5, y, -3.0]}>
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.037, 0.1, 32]} />
          <meshStandardMaterial color="#f1efe9" roughness={0.3} />
        </mesh>
        <mesh position={[0.045, 0.055, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.022, 0.006, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#f1efe9" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.093, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.035, 24]} />
          <meshStandardMaterial color="#3b2416" roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

export default function Workstation() {
  return (
    <group>
      <Desk />
      <Monitor {...MAIN_SCREEN}>
        <ProjectScreen w={MAIN_SCREEN.w} h={MAIN_SCREEN.h} />
      </Monitor>
      <Monitor {...SIDE_SCREEN}>
        <ProfileScreen w={SIDE_SCREEN.w} h={SIDE_SCREEN.h} />
      </Monitor>
      <Model name="classic_laptop" position={[0.66, DESK.h, -3.3]} rotation={[0, -0.45, 0]} scale={0.55} />
      <Model name="office_notepads" position={[0.62, DESK.h, -2.98]} rotation={[0, 0.25, 0]} scale={0.25} />
      <Model name="potted_plant_04" position={[-0.8, DESK.h, -3.55]} scale={1.2} />
      <Peripherals />
      {/* Chair pushed back from the desk, as if someone just stepped away */}
      <Model name="modern_arm_chair_01" position={[0.12, 0, -2.45]} rotation={[0, Math.PI - 0.25, 0]} />
      {/* Screen glow on the desk */}
      <pointLight position={[0.1, 1.1, -3.1]} intensity={0.8} distance={1.6} color="#cfe0ff" />
    </group>
  );
}
