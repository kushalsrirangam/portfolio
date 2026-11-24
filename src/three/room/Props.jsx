import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import milestones from "../../data/timeline";
import skills from "../../data/skills";
import achievements from "../../data/achievements";
import { FONT, NEON, MAT, SPEED, rgbA, rgbB, glow } from "./shared";

function Label({ children, size, color = "#ffffff", position, anchorX = "center", maxWidth, lineHeight }) {
  return (
    <Text
      font={FONT}
      fontSize={size}
      color={color}
      position={position}
      anchorX={anchorX}
      anchorY="middle"
      maxWidth={maxWidth}
      lineHeight={lineHeight}
      textAlign={anchorX === "left" ? "left" : "center"}
      material-toneMapped={false}
    >
      {children}
    </Text>
  );
}

/* ---------- Timeline: a "level up" wall of framed milestones ---------- */

const LEVEL_WALL = { x: -6.47, y: 2.45, z: -1.0 };

function LevelFrame({ item, level, position }) {
  const accent = level % 2 ? NEON.cyan : NEON.pink;
  return (
    <group position={position}>
      <mesh position={[0, 0, -0.005]} material={glow(accent)}>
        <planeGeometry args={[1.2, 0.86]} />
      </mesh>
      <mesh>
        <planeGeometry args={[1.16, 0.82]} />
        <meshStandardMaterial color="#0a0a1c" roughness={0.8} />
      </mesh>
      <Label size={0.06} color={accent} anchorX="left" position={[-0.5, 0.3, 0.005]}>
        {`LVL ${level}`}
      </Label>
      <Label size={0.05} color="#cbd5e1" anchorX="left" position={[0.12, 0.3, 0.005]}>
        {item.date}
      </Label>
      <Label size={0.062} anchorX="left" position={[-0.5, 0.06, 0.005]} maxWidth={1.0} lineHeight={1.2}>
        {item.title.split(" (")[0]}
      </Label>
      <Label size={0.042} color={NEON.cyan} anchorX="left" position={[-0.5, -0.24, 0.005]} maxWidth={1.0}>
        {item.org}
      </Label>
    </group>
  );
}

export function LevelWall() {
  const { x, y, z } = LEVEL_WALL;
  return (
    <group position={[x, y, z]} rotation={[0, Math.PI / 2, 0]}>
      <Label size={0.2} color={NEON.purple} position={[0, 1.15, 0.01]}>
        LEVEL PROGRESSION
      </Label>
      {milestones.map((m, i) => (
        <LevelFrame
          key={m.title}
          item={m}
          level={i + 1}
          position={[(i % 3 - 1) * 1.35, i < 3 ? 0.5 : -0.5, 0.01]}
        />
      ))}
      {/* XP bar under the frames */}
      <mesh position={[0, -1.08, 0.01]}>
        <planeGeometry args={[3.9, 0.08]} />
        <meshBasicMaterial color="#1e1b4b" />
      </mesh>
      <mesh position={[-0.35, -1.08, 0.015]} material={rgbA}>
        <planeGeometry args={[3.2, 0.05]} />
      </mesh>
    </group>
  );
}

/* ---------- Achievements: trophy shelf ---------- */

const TROPHY_SHELF = { x: 6.25, y: 1.85, z: 0.5 };

function Trophy({ rare, position }) {
  const cup = useMemo(() => {
    const pts = [
      [0.0, 0.0], [0.05, 0.0], [0.06, 0.02], [0.075, 0.1], [0.08, 0.17], [0.0, 0.17],
    ].map(([px, py]) => new THREE.Vector2(px, py));
    return new THREE.LatheGeometry(pts, 32);
  }, []);
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.5 * SPEED;
  });
  const s = rare ? 1.25 : 1;
  return (
    <group position={position} scale={s}>
      <mesh position={[0, 0.03, 0]} material={MAT.black}>
        <boxGeometry args={[0.14, 0.06, 0.14]} />
      </mesh>
      <group ref={ref}>
        <mesh position={[0, 0.1, 0]} material={MAT.gold}>
          <cylinderGeometry args={[0.015, 0.03, 0.08, 16]} />
        </mesh>
        <mesh position={[0, 0.14, 0]} geometry={cup} material={MAT.gold} />
        {[-1, 1].map((sd) => (
          <mesh key={sd} position={[sd * 0.085, 0.24, 0]} rotation={[0, 0, Math.PI / 2]} material={MAT.gold}>
            <torusGeometry args={[0.035, 0.008, 8, 16, Math.PI]} />
          </mesh>
        ))}
        {rare && (
          <mesh position={[0, 0.36, 0]} material={glow(NEON.gold)}>
            <octahedronGeometry args={[0.035, 0]} />
          </mesh>
        )}
      </group>
    </group>
  );
}

export function TrophyShelf() {
  const { x, y, z } = TROPHY_SHELF;
  const n = achievements.length;
  return (
    <group position={[x, y, z]}>
      <mesh material={MAT.dark}>
        <boxGeometry args={[0.4, 0.04, 2.5]} />
      </mesh>
      <mesh position={[0.05, -0.03, 0]} material={rgbB}>
        <boxGeometry args={[0.01, 0.01, 2.4]} />
      </mesh>
      <group rotation={[0, -Math.PI / 2, 0]}>
        <Label size={0.17} color={NEON.gold} position={[0, 0.95, -0.2]}>
          HALL OF FAME
        </Label>
        {achievements.map((a, i) => {
          const along = (i - (n - 1) / 2) * 0.8;
          return (
            <Label key={a.title} size={0.05} color="#fde68a" position={[along, 0.62, -0.2]} maxWidth={0.7}>
              {a.short || a.title}
            </Label>
          );
        })}
      </group>
      {achievements.map((a, i) => (
        <Trophy key={a.title} rare={a.rare} position={[-0.02, 0.02, (i - (n - 1) / 2) * 0.8]} />
      ))}
    </group>
  );
}

/* ---------- Skills: arcade cabinet in the corner ---------- */

const ARCADE = { pos: [5.45, 0, -3.35], rotY: -0.6 };

function ArcadeScreen() {
  const blink = useRef();
  useFrame(({ clock }) => {
    if (blink.current) blink.current.visible = Math.floor(clock.elapsedTime * 1.5) % 2 === 0 || SPEED < 1;
  });
  const half = Math.ceil(skills.length / 2);
  const colA = skills.slice(0, half).map((s) => `▸ ${s.name}`).join("\n");
  const colB = skills.slice(half).map((s) => `▸ ${s.name}`).join("\n");
  return (
    <group>
      <mesh>
        <planeGeometry args={[0.62, 0.5]} />
        <meshBasicMaterial color="#050318" toneMapped={false} />
      </mesh>
      <Label size={0.032} color={NEON.pink} position={[0, 0.215, 0.002]}>
        SKILL TREE
      </Label>
      <group ref={blink}>
        <Label size={0.018} color="#facc15" position={[0, -0.225, 0.002]}>
          INSERT COIN
        </Label>
      </group>
      <Text font={FONT} fontSize={0.019} lineHeight={1.45} color={NEON.cyan} anchorX="left" anchorY="top"
        position={[-0.28, 0.18, 0.002]} material-toneMapped={false}>
        {colA}
      </Text>
      <Text font={FONT} fontSize={0.019} lineHeight={1.45} color={NEON.cyan} anchorX="left" anchorY="top"
        position={[0.02, 0.18, 0.002]} material-toneMapped={false}>
        {colB}
      </Text>
    </group>
  );
}

export function Arcade() {
  return (
    <group position={ARCADE.pos} rotation={[0, ARCADE.rotY, 0]}>
      {[-0.37, 0.37].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.95, 0]} material={MAT.black}>
            <boxGeometry args={[0.06, 1.9, 0.75]} />
          </mesh>
          <mesh position={[x + Math.sign(x) * 0.032, 0.95, 0.1]} material={x < 0 ? rgbA : rgbB}>
            <boxGeometry args={[0.004, 1.6, 0.04]} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.95, -0.35]} material={MAT.black}>
        <boxGeometry args={[0.74, 1.9, 0.06]} />
      </mesh>
      <mesh position={[0, 0.47, 0.34]}>
        <boxGeometry args={[0.74, 0.94, 0.06]} />
        <meshStandardMaterial color="#251046" roughness={0.6} />
      </mesh>
      {/* Coin slot glow */}
      <mesh position={[0, 0.6, 0.372]} material={glow("#ef4444")}>
        <boxGeometry args={[0.05, 0.08, 0.004]} />
      </mesh>
      {/* Control panel: joystick and buttons */}
      <group position={[0, 1.0, 0.33]} rotation={[-0.25, 0, 0]}>
        <mesh material={MAT.dark}>
          <boxGeometry args={[0.74, 0.06, 0.3]} />
        </mesh>
        <mesh position={[-0.17, 0.07, 0]} material={MAT.black}>
          <cylinderGeometry args={[0.008, 0.008, 0.1, 8]} />
        </mesh>
        <mesh position={[-0.17, 0.13, 0]} material={glow("#ef4444")}>
          <sphereGeometry args={[0.025, 12, 10]} />
        </mesh>
        {[NEON.cyan, NEON.pink, "#facc15"].map((c, i) => (
          <mesh key={c} position={[0.05 + i * 0.09, 0.035, i === 1 ? -0.03 : 0.02]} material={glow(c)}>
            <cylinderGeometry args={[0.025, 0.025, 0.015, 16]} />
          </mesh>
        ))}
      </group>
      {/* Screen */}
      <group position={[0, 1.45, 0.22]} rotation={[-0.12, 0, 0]}>
        <mesh position={[0, 0, -0.01]} material={MAT.black}>
          <boxGeometry args={[0.7, 0.58, 0.02]} />
        </mesh>
        <ArcadeScreen />
      </group>
      {/* Marquee */}
      <group position={[0, 1.83, 0.24]}>
        <mesh material={glow("#3b0a5e")}>
          <boxGeometry args={[0.74, 0.2, 0.1]} />
        </mesh>
        <Label size={0.07} color={NEON.pink} position={[0, 0, 0.052]}>
          ARCADE
        </Label>
      </group>
    </group>
  );
}
