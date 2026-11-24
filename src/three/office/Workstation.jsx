import { useEffect, useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { MAT, Model, canvasTexture } from "./shared";

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

// Main screen: an analytics dashboard (scenery, no portfolio text).
function DashboardScreen({ w, h }) {
  const tex = useMemo(
    () =>
      canvasTexture(1400, 800, (g, W, H) => {
        g.fillStyle = "#0b1020";
        g.fillRect(0, 0, W, H);
        // Sidebar and top bar
        g.fillStyle = "#111831";
        g.fillRect(0, 0, 70, H);
        g.fillRect(70, 0, W - 70, 56);
        for (let i = 0; i < 6; i++) {
          g.fillStyle = i === 1 ? "#22d3ee" : "#2a3352";
          g.fillRect(22, 90 + i * 60, 26, 26);
        }
        // KPI cards with sparklines
        const kpi = ["#22d3ee", "#a78bfa", "#34d399", "#f59e0b"];
        kpi.forEach((c, i) => {
          const x = 100 + i * 322;
          g.fillStyle = "#141c36";
          g.fillRect(x, 80, 300, 130);
          g.fillStyle = "#3b4566";
          g.fillRect(x + 20, 100, 120, 12);
          g.fillStyle = "#e2e8f0";
          g.fillRect(x + 20, 125, 90 + i * 15, 30);
          g.strokeStyle = c;
          g.lineWidth = 4;
          g.beginPath();
          for (let k = 0; k <= 12; k++) {
            const px = x + 160 + k * 10;
            const py = 180 - Math.abs(Math.sin(k * 0.9 + i)) * 40 - k * 2;
            k ? g.lineTo(px, py) : g.moveTo(px, py);
          }
          g.stroke();
        });
        // Area chart
        g.fillStyle = "#141c36";
        g.fillRect(100, 235, 820, 520);
        const grad = g.createLinearGradient(0, 300, 0, 740);
        grad.addColorStop(0, "rgba(34,211,238,0.55)");
        grad.addColorStop(1, "rgba(34,211,238,0.02)");
        g.fillStyle = grad;
        g.beginPath();
        g.moveTo(130, 730);
        for (let k = 0; k <= 40; k++) {
          const px = 130 + k * 19;
          const py = 600 - k * 6 - Math.sin(k * 0.6) * 45 - Math.sin(k * 0.17) * 30;
          g.lineTo(px, py);
        }
        g.lineTo(890, 730);
        g.fill();
        g.strokeStyle = "#1e2a4a";
        g.lineWidth = 1;
        for (let k = 0; k < 6; k++) {
          g.beginPath();
          g.moveTo(130, 300 + k * 86);
          g.lineTo(890, 300 + k * 86);
          g.stroke();
        }
        // Bar chart
        g.fillStyle = "#141c36";
        g.fillRect(940, 235, 360, 520);
        for (let k = 0; k < 8; k++) {
          const bh = 80 + ((k * 53) % 300);
          g.fillStyle = k % 2 ? "#a78bfa" : "#6366f1";
          g.fillRect(965 + k * 41, 730 - bh, 26, bh);
        }
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

// Side screen: a code editor (scenery, no portfolio text).
function CodeScreen({ w, h }) {
  const tex = useMemo(
    () =>
      canvasTexture(1200, 680, (g, W, H) => {
        g.fillStyle = "#1e1e2e";
        g.fillRect(0, 0, W, H);
        g.fillStyle = "#181825";
        g.fillRect(0, 0, 220, H);
        g.fillRect(220, 0, W - 220, 40);
        g.fillStyle = "#313244";
        g.fillRect(220, 0, 180, 40);
        for (let i = 0; i < 14; i++) {
          g.fillStyle = i === 3 ? "#45475a" : "#2a2b3d";
          g.fillRect(20 + (i % 3 ? 16 : 0), 60 + i * 30, 120 + ((i * 37) % 60), 12);
        }
        g.font = "20px Consolas, 'Courier New', monospace";
        const lines = [
          [["#cba6f7", "from "], ["#cdd6f4", "langgraph.graph "], ["#cba6f7", "import "], ["#cdd6f4", "StateGraph"]],
          [["#cba6f7", "from "], ["#cdd6f4", "fastapi "], ["#cba6f7", "import "], ["#cdd6f4", "FastAPI"]],
          [],
          [["#cdd6f4", "app = "], ["#89b4fa", "FastAPI"], ["#cdd6f4", "()"]],
          [["#cdd6f4", "graph = "], ["#89b4fa", "StateGraph"], ["#cdd6f4", "(IncidentState)"]],
          [],
          [["#cba6f7", "def "], ["#89b4fa", "triage"], ["#cdd6f4", "(state):"]],
          [["#6c7086", "    # classify severity and route"]],
          [["#cdd6f4", "    score = model."], ["#89b4fa", "predict"], ["#cdd6f4", "(state.logs)"]],
          [["#cba6f7", "    return "], ["#cdd6f4", "{"], ["#a6e3a1", "\"severity\""], ["#cdd6f4", ": score}"]],
          [],
          [["#cdd6f4", "graph."], ["#89b4fa", "add_node"], ["#cdd6f4", "("], ["#a6e3a1", "\"triage\""], ["#cdd6f4", ", triage)"]],
          [["#cdd6f4", "graph."], ["#89b4fa", "add_edge"], ["#cdd6f4", "("], ["#a6e3a1", "\"triage\""], ["#cdd6f4", ", "], ["#a6e3a1", "\"investigate\""], ["#cdd6f4", ")"]],
          [],
          [["#f9e2af", "@app.post"], ["#cdd6f4", "("], ["#a6e3a1", "\"/incidents\""], ["#cdd6f4", ")"]],
          [["#cba6f7", "async def "], ["#89b4fa", "create"], ["#cdd6f4", "(body: Incident):"]],
          [["#cba6f7", "    return await "], ["#cdd6f4", "graph."], ["#89b4fa", "ainvoke"], ["#cdd6f4", "(body)"]],
        ];
        lines.forEach((parts, i) => {
          const y = 80 + i * 32;
          g.fillStyle = "#585b70";
          g.fillText(String(i + 1).padStart(2, " "), 240, y);
          let x = 290;
          parts.forEach(([c, t]) => {
            g.fillStyle = c;
            g.fillText(t, x, y);
            x += g.measureText(t).width;
          });
        });
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
        <DashboardScreen w={MAIN_SCREEN.w} h={MAIN_SCREEN.h} />
      </Monitor>
      <Monitor {...SIDE_SCREEN}>
        <CodeScreen w={SIDE_SCREEN.w} h={SIDE_SCREEN.h} />
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
