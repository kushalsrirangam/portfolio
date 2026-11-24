import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import achievements from "../../data/achievements";
import { ROOM, MAT, Model, lightMat, canvasTexture } from "./shared";

/* ---------- Timeline: a gallery wall of framed art prints ---------- */

const GALLERY = { x: ROOM.left + 0.02, y: 1.6, z: -1.0 };

// Six quiet abstract prints in a gallery palette, painted on a canvas.
const PALETTES = [
  ["#efe8dc", "#c2703d", "#2f3e46"],
  ["#e9edf0", "#3d5a80", "#98c1d9"],
  ["#f2efe9", "#283618", "#bc6c25"],
  ["#ebe6df", "#6d597a", "#e56b6f"],
  ["#eef0ea", "#1d3557", "#a8dadc"],
  ["#f1ece4", "#8a5a44", "#d4a373"],
];

function paintPrint(i) {
  const [bg, a, b] = PALETTES[i % PALETTES.length];
  return canvasTexture(780, 560, (g, W, H) => {
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    g.globalAlpha = 0.92;
    switch (i % 6) {
      case 0: // sun over horizon
        g.fillStyle = a; g.beginPath(); g.arc(W * 0.55, H * 0.45, 120, 0, Math.PI * 2); g.fill();
        g.fillStyle = b; g.fillRect(0, H * 0.62, W, H * 0.38);
        break;
      case 1: // stacked arches
        for (let k = 0; k < 4; k++) {
          g.strokeStyle = k % 2 ? a : b; g.lineWidth = 26;
          g.beginPath(); g.arc(W / 2, H, 90 + k * 55, Math.PI, 0); g.stroke();
        }
        break;
      case 2: // offset blocks
        g.fillStyle = a; g.fillRect(W * 0.18, H * 0.2, W * 0.34, H * 0.6);
        g.fillStyle = b; g.fillRect(W * 0.44, H * 0.34, W * 0.36, H * 0.42);
        break;
      case 3: // two circles
        g.fillStyle = a; g.beginPath(); g.arc(W * 0.4, H * 0.5, 150, 0, Math.PI * 2); g.fill();
        g.globalAlpha = 0.75; g.fillStyle = b; g.beginPath(); g.arc(W * 0.6, H * 0.5, 150, 0, Math.PI * 2); g.fill();
        break;
      case 4: // diagonal bands
        for (let k = -4; k < 8; k++) {
          g.fillStyle = k % 2 ? a : b; g.beginPath();
          g.moveTo(k * 110, H); g.lineTo(k * 110 + 55, H); g.lineTo(k * 110 + 55 + H * 0.6, 0); g.lineTo(k * 110 + H * 0.6, 0); g.fill();
        }
        break;
      default: // contour lines
        g.strokeStyle = a; g.lineWidth = 5;
        for (let k = 0; k < 14; k++) {
          g.beginPath();
          for (let x = 0; x <= W; x += 10) {
            const y = H * 0.2 + k * 26 + Math.sin(x / 70 + k * 0.5) * 22;
            x ? g.lineTo(x, y) : g.moveTo(x, y);
          }
          g.stroke();
        }
        g.fillStyle = b; g.beginPath(); g.arc(W * 0.72, H * 0.3, 50, 0, Math.PI * 2); g.fill();
    }
  });
}

function Print({ index, position }) {
  const art = useMemo(() => paintPrint(index), [index]);
  return (
    <group position={position}>
      {/* Thin black frame, white mat, art print */}
      <RoundedBox args={[0.82, 0.6, 0.03]} radius={0.004} position={[0, 0, 0.015]} material={MAT.blackMetal} castShadow />
      <mesh position={[0, 0, 0.031]}>
        <planeGeometry args={[0.78, 0.56]} />
        <meshStandardMaterial color="#fbfaf7" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[0.6, 0.42]} />
        <meshStandardMaterial map={art} roughness={0.85} />
      </mesh>
    </group>
  );
}

export function JourneyWall() {
  const { x, y, z } = GALLERY;
  return (
    <group position={[x, y, z]} rotation={[0, Math.PI / 2, 0]}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Print key={i} index={i} position={[((i % 3) - 1) * 0.98, i < 3 ? 0.36 : -0.36, 0]} />
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

// TV: a dark brand splash with a monogram (scenery, no portfolio text).
function LogoSplash({ w, h }) {
  const tex = useMemo(
    () =>
      canvasTexture(1600, 900, (g, W, H) => {
        const bg = g.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W * 0.7);
        bg.addColorStop(0, "#13233b");
        bg.addColorStop(1, "#05080f");
        g.fillStyle = bg;
        g.fillRect(0, 0, W, H);
        g.strokeStyle = "rgba(34,211,238,0.9)";
        g.lineWidth = 6;
        g.beginPath();
        g.arc(W / 2, H / 2, 150, 0, Math.PI * 2);
        g.stroke();
        g.fillStyle = "#e2f6fb";
        g.font = "bold 120px \"Space Grotesk\", Arial, sans-serif";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText("KSR", W / 2, H / 2 + 6);
      }),
    []
  );
  return (
    <mesh>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
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
          <LogoSplash w={tv.w} h={tv.h} />
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
          </group>
        ))}
        <Model name="potted_plant_04" position={[-0.4, shelfY[1], 0]} />
        <Model name="ceramic_vase_01" position={[0.35, shelfY[1], 0]} scale={0.55} />
      </group>
      <Model name="wall_clock" position={[x - 0.01, 2.45, z - 1.6]} rotation={[0, -Math.PI / 2, 0]} />
      <pointLight position={[x - 0.8, 2.2, z]} intensity={1.6} distance={2.5} color="#ffe7c4" />
    </group>
  );
}
