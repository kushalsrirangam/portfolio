import { useMemo } from "react";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import milestones from "../../data/timeline";
import skills from "../../data/skills";
import achievements from "../../data/achievements";
import { FONT, ACCENT, ROOM, MAT, Model, lightMat } from "./shared";

/* ---------- Timeline: framed prints on the left wall ---------- */

const JOURNEY = { x: ROOM.left + 0.02, y: 1.6, z: -1.0 };

function Print({ item, index, position }) {
  return (
    <group position={position}>
      {/* Thin black frame with a white mat and print */}
      <RoundedBox args={[0.82, 0.6, 0.03]} radius={0.004} position={[0, 0, 0.015]} material={MAT.blackMetal} castShadow />
      <mesh position={[0, 0, 0.031]}>
        <planeGeometry args={[0.78, 0.56]} />
        <meshStandardMaterial color="#fbfaf7" roughness={0.9} />
      </mesh>
      <Text font={FONT} fontSize={0.07} color="#0f172a" anchorX="left" anchorY="middle" position={[-0.33, 0.18, 0.033]}>
        {item.date}
      </Text>
      <Text font={FONT} fontSize={0.025} color="#94a3b8" anchorX="right" anchorY="middle" position={[0.33, 0.19, 0.033]}>
        {String(index + 1).padStart(2, "0")}
      </Text>
      <mesh position={[-0.27, 0.115, 0.033]}>
        <planeGeometry args={[0.12, 0.006]} />
        <meshBasicMaterial color="#0e7490" />
      </mesh>
      <Text font={FONT} fontSize={0.036} color="#111827" anchorX="left" anchorY="top" position={[-0.33, 0.08, 0.033]}
        maxWidth={0.66} lineHeight={1.2}>
        {item.title.split(" (")[0]}
      </Text>
      <Text font={FONT} fontSize={0.024} color="#0e7490" anchorX="left" anchorY="bottom" position={[-0.33, -0.2, 0.033]}
        maxWidth={0.66}>
        {item.org}
      </Text>
    </group>
  );
}

export function JourneyWall() {
  const { x, y, z } = JOURNEY;
  return (
    <group position={[x, y, z]} rotation={[0, Math.PI / 2, 0]}>
      <Text font={FONT} fontSize={0.13} letterSpacing={0.2} color="#1f2937" position={[0, 0.98, 0]} anchorX="center">
        MY JOURNEY
      </Text>
      {milestones.map((m, i) => (
        <Print
          key={m.title}
          item={m}
          index={i}
          position={[((i % 3) - 1) * 0.98, i < 3 ? 0.36 : -0.36, 0]}
        />
      ))}
      {/* Picture lights above the prints */}
      {[-0.98, 0, 0.98].map((px) => (
        <group key={px} position={[px, 0.78, 0.08]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={MAT.blackMetal}>
            <cylinderGeometry args={[0.018, 0.018, 0.32, 16]} />
          </mesh>
          <pointLight position={[0, -0.25, 0.35]} intensity={0.25} distance={1.2} decay={2} color="#ffe7c4" />
        </group>
      ))}
    </group>
  );
}

/* ---------- Skills: meeting area with a wall-mounted TV ---------- */

const MEETING = { x: ROOM.right, z: -2.2 };

function TechStackSlide({ w, h }) {
  const cols = 5;
  return (
    <group>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color="#0b1220" toneMapped={false} />
      </mesh>
      <Text font={FONT} fontSize={0.06} color="#f8fafc" anchorX="left" anchorY="middle"
        position={[-w / 2 + 0.08, h / 2 - 0.09, 0.001]} material-toneMapped={false}>
        Tech Stack
      </Text>
      <Text font={FONT} fontSize={0.024} color="#94a3b8" anchorX="right" anchorY="middle"
        position={[w / 2 - 0.08, h / 2 - 0.09, 0.001]} material-toneMapped={false}>
        Kushal Sri Rangam · Q4 review
      </Text>
      {skills.map((s, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const x = -w / 2 + 0.08 + c * ((w - 0.16) / cols) + 0.12;
        const y = h / 2 - 0.22 - r * 0.13;
        return (
          <group key={s.name} position={[x, y, 0.001]}>
            <mesh>
              <planeGeometry args={[0.24, 0.085]} />
              <meshBasicMaterial color="#172033" toneMapped={false} />
            </mesh>
            <mesh position={[-0.115, 0, 0.0005]}>
              <planeGeometry args={[0.006, 0.085]} />
              <meshBasicMaterial color={ACCENT} toneMapped={false} />
            </mesh>
            <Text font={FONT} fontSize={0.024} color="#e2e8f0" anchorX="left" anchorY="middle"
              position={[-0.095, 0.012, 0.001]} material-toneMapped={false}>
              {s.name}
            </Text>
            <Text font={FONT} fontSize={0.014} color="#64748b" anchorX="left" anchorY="middle"
              position={[-0.095, -0.02, 0.001]} material-toneMapped={false}>
              {s.type}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export function MeetingArea() {
  const { x, z } = MEETING;
  const tv = { w: 1.44, h: 0.81 };
  const pendants = useMemo(() => lightMat("#ffe9c9", 3), []);
  return (
    <group>
      {/* 65" TV on the right wall */}
      <group position={[x - 0.04, 1.45, z]} rotation={[0, -Math.PI / 2, 0]}>
        <RoundedBox args={[tv.w + 0.02, tv.h + 0.02, 0.03]} radius={0.004} material={MAT.blackMetal} />
        <group position={[0, 0, 0.0155]}>
          <TechStackSlide w={tv.w} h={tv.h} />
        </group>
      </group>
      {/* Meeting table and chairs */}
      <group position={[x - 1.55, 0, z]}>
        <RoundedBox args={[1.0, 0.04, 2.0]} radius={0.015} position={[0, 0.74, 0]} material={MAT.whiteTop} castShadow receiveShadow />
        {[-0.7, 0.7].map((dz) => (
          <mesh key={dz} position={[0, 0.36, dz]} material={MAT.blackMetal} castShadow>
            <boxGeometry args={[0.7, 0.72, 0.04]} />
          </mesh>
        ))}
        {[-0.5, 0.5].map((dz) => (
          <group key={dz}>
            <Model name="modern_arm_chair_01" position={[-0.72, 0, dz]} rotation={[0, Math.PI / 2, 0]} />
            <Model name="modern_arm_chair_01" position={[0.72, 0, dz]} rotation={[0, -Math.PI / 2, 0]} />
          </group>
        ))}
        {/* Pendant lights over the table */}
        {[-0.5, 0.5].map((dz) => (
          <group key={dz} position={[0, ROOM.height - 1.17, dz]}>
            <Model name="modern_ceiling_lamp_01" />
            <mesh position={[0, 0.25, 0]} material={pendants}>
              <sphereGeometry args={[0.035, 16, 12]} />
            </mesh>
            <pointLight position={[0, 0.15, 0]} intensity={2.2} distance={3} color="#ffe2b8" />
          </group>
        ))}
      </group>
    </group>
  );
}

/* ---------- Achievements: awards shelf on the right wall ---------- */

const AWARDS = { x: ROOM.right, z: 1.0 };

function Trophy({ rare, position }) {
  const cup = useMemo(() => {
    const pts = [
      [0.0, 0.0], [0.035, 0.0], [0.042, 0.012], [0.05, 0.06], [0.058, 0.11], [0.06, 0.125], [0.0, 0.125],
    ].map(([px, py]) => new THREE.Vector2(px, py));
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  const s = rare ? 1.2 : 1;
  return (
    <group position={position} scale={s}>
      <RoundedBox args={[0.09, 0.05, 0.09]} radius={0.006} position={[0, 0.025, 0]} material={MAT.walnut} castShadow />
      <mesh position={[0, 0.08, 0]} material={MAT.gold} castShadow>
        <cylinderGeometry args={[0.008, 0.02, 0.06, 24]} />
      </mesh>
      <mesh position={[0, 0.105, 0]} geometry={cup} material={MAT.gold} castShadow />
      {[-1, 1].map((sd) => (
        <mesh key={sd} position={[sd * 0.06, 0.18, 0]} rotation={[0, 0, sd * Math.PI / 2]} material={MAT.gold}>
          <torusGeometry args={[0.025, 0.005, 10, 24, Math.PI]} />
        </mesh>
      ))}
    </group>
  );
}

export function AwardsShelf() {
  const { x, z } = AWARDS;
  const n = achievements.length;
  // Shelf_01 is 1 m wide, 2.08 m tall and 0.26 m deep.
  const shelfY = [0.98, 1.4];
  return (
    <group>
      <group position={[x - 0.17, 0, z]} rotation={[0, -Math.PI / 2, 0]}>
        {[-0.68, 0.68].map((sx) => (
          <mesh key={sx} position={[sx, 0.95, 0]} material={MAT.blackMetal} castShadow>
            <boxGeometry args={[0.025, 1.9, 0.3]} />
          </mesh>
        ))}
        {[0.12, ...shelfY, 1.86].map((sy) => (
          <RoundedBox key={sy} args={[1.36, 0.03, 0.3]} radius={0.006} position={[0, sy - 0.015, 0]} material={MAT.walnut} castShadow receiveShadow />
        ))}
        {/* LED strips under the shelves */}
        {shelfY.map((sy) => (
          <mesh key={sy} position={[0, sy + 0.385, 0.06]} material={lightMat("#ffe9c9", 1.2)}>
            <boxGeometry args={[1.3, 0.006, 0.01]} />
          </mesh>
        ))}
      </group>
      <group position={[x - 0.15, 0, z]} rotation={[0, -Math.PI / 2, 0]}>
        {achievements.map((a, i) => (
          <group key={a.title} position={[(i - (n - 1) / 2) * 0.42, shelfY[0], 0]}>
            <Trophy rare={a.rare} position={[0, 0, 0]} />
            <Text font={FONT} fontSize={0.017} color="#f3e7d3" anchorX="center" anchorY="middle"
              position={[0, -0.015, 0.19]} maxWidth={0.38}>
              {a.short || a.title}
            </Text>
          </group>
        ))}
        <Model name="potted_plant_04" position={[-0.4, shelfY[1], 0]} />
        <Model name="ceramic_vase_01" position={[0.35, shelfY[1], 0]} scale={0.55} />
        <Text font={FONT} fontSize={0.1} letterSpacing={0.18} color="#1f2937" anchorX="center"
          position={[0, 2.12, -0.12]}>
          AWARDS & RECOGNITION
        </Text>
      </group>
      <Model name="wall_clock" position={[x - 0.01, 2.45, z - 1.6]} rotation={[0, -Math.PI / 2, 0]} />
      <pointLight position={[x - 0.8, 2.2, z]} intensity={1.6} distance={2.5} color="#ffe7c4" />
    </group>
  );
}
