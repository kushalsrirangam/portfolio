import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { FONT, NEON, MAT, SPEED, rgbA, rgbB, updateRgb, glow } from "./shared";

// Room bounds: walls at x = ±6.5 and z = -4.2; the front is open to the camera.
const W = 13;
const H = 5.4;
const BACK = -4.2;
const SIDE = 6.5;
const ZMID = 1.8;

function LedStrip({ position, size, material }) {
  return (
    <mesh position={position} material={material}>
      <boxGeometry args={size} />
    </mesh>
  );
}

// Glowing honeycomb light panels on the back wall, each cycling colour.
function HexPanels() {
  const cells = useMemo(() => {
    const out = [];
    const r = 0.26;
    const layout = [
      [0, 0], [1, 0], [2, 0],
      [0.5, 1], [1.5, 1],
      [1, 2], [-0.5, 1],
    ];
    layout.forEach(([c, row]) => {
      out.push([-4.9 + c * r * 1.8, 2.3 + row * r * 1.56]);
    });
    return out;
  }, []);
  const mats = useMemo(() => cells.map(() => glow("#ffffff")), [cells]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.08 * SPEED;
    mats.forEach((m, i) => m.color.setHSL((t + i * 0.09) % 1, 1, 0.5));
  });
  return (
    <group>
      {cells.map(([x, y], i) => (
        <group key={i} position={[x, y, BACK + 0.03]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={MAT.black}>
            <cylinderGeometry args={[0.25, 0.25, 0.04, 6]} />
          </mesh>
          <mesh
            position={[0, 0, 0.025]}
            rotation={[Math.PI / 2, 0, 0]}
            material={mats[i]}
          >
            <cylinderGeometry args={[0.21, 0.21, 0.01, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Acoustic foam tiles behind the PC.
function Foam() {
  const tiles = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 4; c++) tiles.push([2.95 + c * 0.46, 1.45 + r * 0.46]);
  return (
    <group>
      {tiles.map(([x, y], i) => (
        <mesh key={i} position={[x, y, BACK + 0.05]} rotation={[0, 0, (i % 2) * Math.PI / 2]}>
          <boxGeometry args={[0.42, 0.42, 0.08]} />
          <meshStandardMaterial color="#1d1433" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function NeonText({ children, color, size, position, rotation, spacing = 0.08 }) {
  return (
    <Text
      font={FONT}
      fontSize={size}
      letterSpacing={spacing}
      position={position}
      rotation={rotation}
      anchorX="center"
      anchorY="middle"
      color={color}
      outlineWidth={size * 0.06}
      outlineColor={color}
      outlineBlur={size * 0.25}
      outlineOpacity={0.6}
      material-toneMapped={false}
    >
      {children}
    </Text>
  );
}

// Neon signs that blink like real tubes now and then.
function ContactSign() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const flicker = SPEED === 1 && t % 6 > 5.6 && Math.sin(t * 60) > 0;
    ref.current.visible = !flicker;
  });
  return (
    <group position={[3.85, 3.75, BACK + 0.04]}>
      <group ref={ref}>
        <NeonText color={NEON.pink} size={0.2} position={[0, 0.32, 0]}>
          PLAYER 2?
        </NeonText>
      </group>
      <NeonText color={NEON.cyan} size={0.26} position={[0, 0, 0]}>
        {"LET'S CONNECT"}
      </NeonText>
    </group>
  );
}

export default function Room() {
  useFrame(({ clock }) => updateRgb(clock.elapsedTime));

  return (
    <group>
      {/* Floor, walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, ZMID]} material={MAT.floor}>
        <planeGeometry args={[W, W]} />
      </mesh>
      <mesh position={[0, H / 2, BACK]} material={MAT.wall}>
        <planeGeometry args={[W, H]} />
      </mesh>
      <mesh position={[-SIDE, H / 2, ZMID]} rotation={[0, Math.PI / 2, 0]} material={MAT.wall}>
        <planeGeometry args={[W, H]} />
      </mesh>
      <mesh position={[SIDE, H / 2, ZMID]} rotation={[0, -Math.PI / 2, 0]} material={MAT.wall}>
        <planeGeometry args={[W, H]} />
      </mesh>

      {/* RGB LED strips along the ceiling line, floor line and corners */}
      <LedStrip position={[0, H - 0.05, BACK + 0.03]} size={[W, 0.04, 0.04]} material={rgbA} />
      <LedStrip position={[0, 0.03, BACK + 0.03]} size={[W, 0.04, 0.04]} material={rgbB} />
      <LedStrip position={[-SIDE + 0.03, 0.03, ZMID]} size={[0.04, 0.04, W]} material={rgbB} />
      <LedStrip position={[SIDE - 0.03, 0.03, ZMID]} size={[0.04, 0.04, W]} material={rgbA} />
      <LedStrip position={[-SIDE + 0.03, H - 0.05, ZMID]} size={[0.04, 0.04, W]} material={rgbA} />
      <LedStrip position={[SIDE - 0.03, H - 0.05, ZMID]} size={[0.04, 0.04, W]} material={rgbB} />
      <LedStrip position={[-SIDE + 0.04, H / 2, BACK + 0.04]} size={[0.04, H, 0.04]} material={rgbB} />
      <LedStrip position={[SIDE - 0.04, H / 2, BACK + 0.04]} size={[0.04, H, 0.04]} material={rgbA} />

      <HexPanels />
      <Foam />

      {/* Name sign above the monitors */}
      <NeonText color={NEON.pink} size={0.56} spacing={0.14} position={[0, 2.95, BACK + 0.04]}>
        KUSHAL
      </NeonText>
      <NeonText color={NEON.cyan} size={0.15} spacing={0.35} position={[0, 2.42, BACK + 0.04]}>
        AI · DATA · CLOUD
      </NeonText>
      <ContactSign />

      {/* Rug with a glowing rim under the chair */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, -2.1]}>
        <circleGeometry args={[1.6, 48]} />
        <meshStandardMaterial color="#1a1030" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, -2.1]} material={rgbA}>
        <ringGeometry args={[1.56, 1.62, 64]} />
      </mesh>

      {/* Lighting: dim purple base with coloured neon fills */}
      <ambientLight intensity={0.35} color="#7c6bff" />
      <hemisphereLight args={["#6d5dfc", "#05050c", 0.35]} />
      <pointLight position={[-4, 3.6, -2.8]} color={NEON.pink} intensity={22} distance={11} />
      <pointLight position={[4.2, 3.2, -2.4]} color={NEON.cyan} intensity={18} distance={10} />
      <pointLight position={[0, 4.6, 1.5]} color={NEON.purple} intensity={26} distance={14} />
      <pointLight position={[-5.2, 3, 0]} color={NEON.cyan} intensity={10} distance={6} />
      <pointLight position={[5.4, 2.8, 0.6]} color={NEON.gold} intensity={8} distance={5} />
    </group>
  );
}
