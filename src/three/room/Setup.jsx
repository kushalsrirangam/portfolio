import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import projects from "../../data/projects";
import { FONT, NEON, MAT, SPEED, rgbA, rgbB, glow } from "./shared";

// Where things sit. Desk against the back wall, gamer facing it (-z).
const DESK = { y: 0.78, z: -3.0 };
const MONITORS = {
  center: { pos: [0, 1.3, -3.25], rotY: 0, w: 1.28, h: 0.72 },
  left: { pos: [-1.15, 1.22, -3.05], rotY: 0.45, w: 0.9, h: 0.52 },
  right: { pos: [1.15, 1.22, -3.05], rotY: -0.45, w: 0.9, h: 0.52 },
};

const SKIN = "#c68a5e";
const HOODIE = new THREE.MeshStandardMaterial({ color: "#2b1d52", roughness: 0.8 });
const PANTS = new THREE.MeshStandardMaterial({ color: "#1a1a2c", roughness: 0.8 });
const SKIN_MAT = new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.6 });
const HAIR = new THREE.MeshStandardMaterial({ color: "#17110e", roughness: 0.9 });
const SHOE = new THREE.MeshStandardMaterial({ color: "#e5e7eb", roughness: 0.6 });
const CHAIR = new THREE.MeshStandardMaterial({ color: "#121218", roughness: 0.6 });
const CHAIR_ACCENT = glow(NEON.pink);

function fitCover(tex, w, h) {
  // Crop a texture to fill a w×h screen without stretching.
  const img = tex.image;
  if (!img || !img.width) return;
  const imgAspect = img.width / img.height;
  const aspect = w / h;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  if (imgAspect > aspect) {
    tex.repeat.set(aspect / imgAspect, 1);
    tex.offset.set((1 - aspect / imgAspect) / 2, 0);
  } else {
    tex.repeat.set(1, imgAspect / aspect);
    tex.offset.set(0, (1 - imgAspect / aspect) / 2);
  }
}

/* ---------- Desk ---------- */

function Desk() {
  return (
    <group>
      <mesh position={[0, DESK.y - 0.025, DESK.z]} material={MAT.dark}>
        <boxGeometry args={[3.4, 0.05, 0.9]} />
      </mesh>
      {[-1.6, 1.6].map((x) => (
        <mesh key={x} position={[x, (DESK.y - 0.05) / 2, DESK.z]} material={MAT.black}>
          <boxGeometry args={[0.05, DESK.y - 0.05, 0.8]} />
        </mesh>
      ))}
      {/* RGB strip along the front edge */}
      <mesh position={[0, DESK.y - 0.055, DESK.z + 0.44]} material={rgbA}>
        <boxGeometry args={[3.3, 0.015, 0.015]} />
      </mesh>
      {/* Desk mat */}
      <mesh position={[0.1, DESK.y + 0.003, -2.8]}>
        <boxGeometry args={[1.7, 0.006, 0.5]} />
        <meshStandardMaterial color="#0d0d18" roughness={0.9} />
      </mesh>
      {/* Mug */}
      <mesh position={[-0.95, DESK.y + 0.06, -2.75]}>
        <cylinderGeometry args={[0.045, 0.04, 0.12, 20]} />
        <meshStandardMaterial color={NEON.purple} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ---------- Monitors ---------- */

function Monitor({ pos, rotY, w, h, children }) {
  const baseY = DESK.y - pos[1] + 0.01;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <mesh material={MAT.black}>
        <boxGeometry args={[w + 0.04, h + 0.04, 0.04]} />
      </mesh>
      <group position={[0, 0, 0.021]}>{children}</group>
      <mesh position={[0, (baseY - h / 2) / 2, -0.05]} material={MAT.black}>
        <boxGeometry args={[0.06, -baseY - h / 2, 0.04]} />
      </mesh>
      <mesh position={[0, baseY, -0.04]} material={MAT.black}>
        <boxGeometry args={[0.32, 0.02, 0.2]} />
      </mesh>
      {/* Back glow on the wall */}
      <mesh position={[0, 0, -0.03]} rotation={[0, Math.PI, 0]} material={rgbB}>
        <planeGeometry args={[w * 0.7, h * 0.5]} />
      </mesh>
    </group>
  );
}

// Centre screen: cycles through project screenshots.
function ProjectScreen({ w, h }) {
  const textures = useTexture(projects.map((p) => p.img || "/images/aegisops.svg"));
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);
  const label = useRef();
  const shown = useRef(-1);
  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      fitCover(t, w, h);
    });
  }, [textures, w, h]);
  useFrame(({ clock }) => {
    const i = Math.floor(clock.elapsedTime / 3.5) % textures.length;
    if (i === shown.current) return;
    shown.current = i;
    mat.map = textures[i];
    mat.needsUpdate = true;
    if (label.current) label.current.text = projects[i].title.split(" (")[0].toUpperCase();
  });
  return (
    <group>
      <mesh material={mat}>
        <planeGeometry args={[w, h]} />
      </mesh>
      <mesh position={[0, -h / 2 + 0.045, 0.001]}>
        <planeGeometry args={[w, 0.09]} />
        <meshBasicMaterial color="#05050c" transparent opacity={0.75} />
      </mesh>
      <Text
        ref={label}
        font={FONT}
        fontSize={0.04}
        color={NEON.cyan}
        anchorX="left"
        anchorY="middle"
        position={[-w / 2 + 0.04, -h / 2 + 0.045, 0.002]}
        material-toneMapped={false}
      >
        LOADING
      </Text>
    </group>
  );
}

// Left screen: player profile with the photo.
function ProfileScreen({ w, h }) {
  const photo = useTexture("/images/my.JPG");
  useEffect(() => {
    photo.colorSpace = THREE.SRGBColorSpace;
    fitCover(photo, 0.3, 0.36);
  }, [photo]);
  const line = (text, y, size, color) => (
    <Text
      font={FONT}
      fontSize={size}
      color={color}
      anchorX="left"
      anchorY="middle"
      position={[-0.04, y, 0.002]}
      maxWidth={0.47}
      material-toneMapped={false}
    >
      {text}
    </Text>
  );
  return (
    <group>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color="#0a0f2a" toneMapped={false} />
      </mesh>
      <mesh position={[-0.24, 0, 0.001]}>
        <planeGeometry args={[0.3, 0.36]} />
        <meshBasicMaterial map={photo} toneMapped={false} />
      </mesh>
      {line("PLAYER 1", 0.17, 0.035, NEON.pink)}
      {line("KUSHAL SRI RANGAM", 0.1, 0.04, "#ffffff")}
      {line("CLASS: AI / DATA ENGINEER", 0.03, 0.025, NEON.cyan)}
      {line("GUILD: UNIV. OF THE PACIFIC", -0.02, 0.025, NEON.cyan)}
      {line("XP ████████████░░", -0.09, 0.028, NEON.purple)}
      {line("STATUS: ONLINE", -0.16, 0.026, "#4ade80")}
    </group>
  );
}

// Right screen: a terminal drawn once onto a canvas.
function TerminalScreen({ w, h }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 640;
    c.height = 370;
    const g = c.getContext("2d");
    g.fillStyle = "#03060d";
    g.fillRect(0, 0, c.width, c.height);
    g.font = "bold 22px Consolas, 'Courier New', monospace";
    const lines = [
      ["#64748b", "kushal@battlestation:~$ ./aegisops --agents 7"],
      ["#4ade80", "[ok] triage · investigate · knowledge"],
      ["#4ade80", "[ok] supervisor · remediate · security"],
      ["#22d3ee", "> rag.retrieve(runbooks) -> 3 citations"],
      ["#facc15", "> awaiting human approval..."],
      ["#4ade80", "[ok] approved. incident resolved."],
      ["#64748b", "kushal@battlestation:~$ python smart_hat.py"],
      ["#22d3ee", "> detected: person 0.97 | car 0.91"],
      ["#f472b6", "> GG. next quest loading_"],
    ];
    lines.forEach(([color, text], i) => {
      g.fillStyle = color;
      g.fillText(text, 18, 40 + i * 38);
    });
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <mesh>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

/* ---------- Keyboard, mouse ---------- */

function Keyboard() {
  const ref = useRef();
  const cols = 15;
  const rows = 5;
  const color = useMemo(() => new THREE.Color(), []);
  useEffect(() => {
    const m = new THREE.Matrix4();
    let i = 0;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        m.setPosition((c - (cols - 1) / 2) * 0.047, 0, (r - (rows - 1) / 2) * 0.045);
        ref.current.setMatrixAt(i++, m);
      }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  // A rainbow wave travelling across the keys.
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.25 * SPEED;
    let i = 0;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        color.setHSL((t + c * 0.04 + r * 0.02) % 1, 1, 0.55);
        ref.current.setColorAt(i++, color);
      }
    ref.current.instanceColor.needsUpdate = true;
  });
  return (
    <group position={[-0.12, DESK.y + 0.012, -2.8]}>
      <mesh material={MAT.black}>
        <boxGeometry args={[0.74, 0.024, 0.26]} />
      </mesh>
      <instancedMesh ref={ref} args={[null, null, cols * rows]} position={[0, 0.018, 0]}>
        <boxGeometry args={[0.04, 0.014, 0.038]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function Mouse() {
  return (
    <group position={[0.5, DESK.y + 0.02, -2.76]}>
      <mesh scale={[0.6, 0.35, 1]} material={MAT.black}>
        <sphereGeometry args={[0.06, 20, 16]} />
      </mesh>
      <mesh position={[0, 0.012, -0.02]} material={rgbA}>
        <boxGeometry args={[0.006, 0.012, 0.03]} />
      </mesh>
    </group>
  );
}

/* ---------- PC tower ---------- */

function Fan({ position, rotation, material }) {
  const blades = useRef();
  useFrame((_, dt) => {
    if (blades.current) blades.current.rotation.z += dt * 6 * SPEED;
  });
  return (
    <group position={position} rotation={rotation}>
      <mesh material={material}>
        <torusGeometry args={[0.12, 0.012, 8, 40]} />
      </mesh>
      <group ref={blades}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]} position={[0, 0, 0]}>
            <boxGeometry args={[0.2, 0.035, 0.005]} />
            <meshStandardMaterial color="#1f1f2e" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function PC() {
  const w = 0.45;
  const h = 1.0;
  const d = 0.95;
  return (
    <group position={[2.25, h / 2 + 0.02, -3.15]}>
      <mesh material={MAT.black}>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      {/* Front fans */}
      {[0.3, 0, -0.3].map((y) => (
        <Fan key={y} position={[0, y, d / 2 + 0.01]} rotation={[0, 0, 0]} material={rgbA} />
      ))}
      {/* Glass side window showing glowing parts */}
      <group position={[w / 2 + 0.006, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[d - 0.08, h - 0.08]} />
          <meshStandardMaterial color="#05050a" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0.05, -0.08, 0.004]} material={rgbB}>
          <boxGeometry args={[0.6, 0.06, 0.006]} />
        </mesh>
        {[-0.05, 0.0, 0.05].map((x) => (
          <mesh key={x} position={[x + 0.15, 0.22, 0.004]} material={glow(NEON.pink)}>
            <boxGeometry args={[0.02, 0.18, 0.006]} />
          </mesh>
        ))}
        <Fan position={[-0.25, 0.25, 0.006]} rotation={[0, 0, 0]} material={rgbB} />
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[d - 0.06, h - 0.06]} />
          <meshStandardMaterial color="#9aa8ff" transparent opacity={0.08} metalness={1} roughness={0} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- Gaming chair ---------- */

function Chair() {
  return (
    <group position={[0, 0, -1.8]}>
      <mesh position={[0, 0.52, -0.02]} material={CHAIR}>
        <boxGeometry args={[0.62, 0.12, 0.6]} />
      </mesh>
      <group position={[0, 1.02, 0.24]} rotation={[0.12, 0, 0]}>
        <mesh material={CHAIR}>
          <boxGeometry args={[0.6, 1.0, 0.12]} />
        </mesh>
        {[-0.27, 0.27].map((x) => (
          <mesh key={x} position={[x, -0.05, -0.05]} material={CHAIR}>
            <boxGeometry args={[0.08, 0.7, 0.16]} />
          </mesh>
        ))}
        {/* Pink racing stripes */}
        {[-0.14, 0.14].map((x) => (
          <mesh key={x} position={[x, 0, 0.062]} material={CHAIR_ACCENT}>
            <boxGeometry args={[0.03, 0.95, 0.004]} />
          </mesh>
        ))}
        <mesh position={[0, 0.58, 0]} material={CHAIR}>
          <boxGeometry args={[0.36, 0.2, 0.12]} />
        </mesh>
      </group>
      {/* Armrests */}
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} position={[x, 0.75, -0.05]} material={CHAIR}>
          <boxGeometry args={[0.06, 0.04, 0.36]} />
        </mesh>
      ))}
      {/* Gas lift and star base */}
      <mesh position={[0, 0.27, 0]} material={MAT.black}>
        <cylinderGeometry args={[0.035, 0.035, 0.42, 12]} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0.16, 0.07, 0]} material={MAT.black}>
              <boxGeometry args={[0.32, 0.04, 0.05]} />
            </mesh>
            <mesh position={[0.31, 0.03, 0]} material={MAT.black}>
              <sphereGeometry args={[0.035, 10, 8]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ---------- The gamer ---------- */

const UP = new THREE.Vector3(0, 1, 0);

// A capsule stretched between two points: arms, legs.
function Limb({ from, to, r, material }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    return {
      position: a.clone().add(b).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize()),
      length: Math.max(dir.length() - r * 2, 0.01),
    };
  }, [from, to, r]);
  return (
    <mesh position={position} quaternion={quaternion} material={material}>
      <capsuleGeometry args={[r, length, 6, 12]} />
    </mesh>
  );
}

function Gamer() {
  const head = useRef();
  const body = useRef();
  const mouseArm = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * SPEED;
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.7) * 0.12;
      head.current.rotation.x = Math.sin(t * 1.3) * 0.03;
    }
    if (body.current) body.current.scale.y = 1 + Math.sin(t * 2) * 0.008;
    // Quick mouse flicks.
    if (mouseArm.current) mouseArm.current.position.x = Math.sin(t * 3.1) * Math.sin(t * 1.7) * 0.02;
  });

  const HEAD = [0, 1.43, -1.98];
  return (
    <group>
      {/* Torso, leaning in toward the screens */}
      <group ref={body} position={[0, 0.66, -1.86]}>
        <mesh position={[0, 0.33, -0.03]} rotation={[-0.14, 0, 0]} material={HOODIE}>
          <capsuleGeometry args={[0.2, 0.36, 8, 16]} />
        </mesh>
        {/* Hood bunched behind the neck */}
        <mesh position={[0, 0.66, 0.08]} scale={[1.1, 0.6, 0.8]} material={HOODIE}>
          <sphereGeometry args={[0.16, 16, 12]} />
        </mesh>
        {/* Neon hoodie logo stripe */}
        <mesh position={[0, 0.42, 0.195]} rotation={[-0.14, 0, 0]} material={rgbA}>
          <boxGeometry args={[0.22, 0.02, 0.004]} />
        </mesh>
      </group>

      {/* Head with hair and an RGB headset */}
      <group ref={head} position={HEAD}>
        <mesh position={[0, -0.13, 0.02]} material={SKIN_MAT}>
          <cylinderGeometry args={[0.05, 0.055, 0.1, 12]} />
        </mesh>
        <mesh material={SKIN_MAT}>
          <sphereGeometry args={[0.13, 24, 20]} />
        </mesh>
        <mesh rotation={[0.5, 0, 0]} material={HAIR}>
          <sphereGeometry args={[0.138, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
        <mesh material={MAT.black}>
          <torusGeometry args={[0.152, 0.018, 8, 32, Math.PI]} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.145, -0.01, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} material={MAT.black}>
              <cylinderGeometry args={[0.065, 0.065, 0.05, 24]} />
            </mesh>
            <mesh position={[s * 0.027, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={rgbB}>
              <torusGeometry args={[0.05, 0.009, 8, 24]} />
            </mesh>
          </group>
        ))}
        {/* Mic boom */}
        <Limb from={[-0.15, -0.03, -0.02]} to={[-0.06, -0.08, -0.15]} r={0.008} material={MAT.black} />
        <mesh position={[-0.055, -0.08, -0.155]} material={glow("#ef4444")}>
          <sphereGeometry args={[0.012, 10, 8]} />
        </mesh>
      </group>

      {/* Left arm to the keyboard */}
      <Limb from={[-0.25, 1.2, -1.92]} to={[-0.33, 0.96, -2.2]} r={0.075} material={HOODIE} />
      <Limb from={[-0.33, 0.96, -2.2]} to={[-0.24, 0.85, -2.66]} r={0.065} material={HOODIE} />
      <mesh position={[-0.23, 0.83, -2.72]} scale={[1, 0.6, 1.3]} material={SKIN_MAT}>
        <sphereGeometry args={[0.05, 14, 10]} />
      </mesh>

      {/* Right arm on the mouse */}
      <group ref={mouseArm}>
        <Limb from={[0.25, 1.2, -1.92]} to={[0.36, 0.96, -2.2]} r={0.075} material={HOODIE} />
        <Limb from={[0.36, 0.96, -2.2]} to={[0.47, 0.85, -2.64]} r={0.065} material={HOODIE} />
        <mesh position={[0.49, 0.83, -2.7]} scale={[1, 0.6, 1.3]} material={SKIN_MAT}>
          <sphereGeometry args={[0.05, 14, 10]} />
        </mesh>
      </group>

      {/* Legs and sneakers */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Limb from={[s * 0.11, 0.64, -1.86]} to={[s * 0.14, 0.62, -2.32]} r={0.09} material={PANTS} />
          <Limb from={[s * 0.14, 0.62, -2.32]} to={[s * 0.15, 0.12, -2.38]} r={0.075} material={PANTS} />
          <mesh position={[s * 0.15, 0.05, -2.45]} material={SHOE}>
            <boxGeometry args={[0.11, 0.08, 0.25]} />
          </mesh>
          <mesh position={[s * 0.15, 0.008, -2.45]} material={rgbA}>
            <boxGeometry args={[0.115, 0.012, 0.255]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function Setup() {
  const { center, left, right } = MONITORS;
  return (
    <group>
      <Desk />
      <Monitor {...center}>
        <ProjectScreen w={center.w} h={center.h} />
      </Monitor>
      <Monitor {...left}>
        <ProfileScreen w={left.w} h={left.h} />
      </Monitor>
      <Monitor {...right}>
        <TerminalScreen w={right.w} h={right.h} />
      </Monitor>
      {/* Screen light spilling onto the gamer */}
      <pointLight position={[0, 1.35, -2.75]} color="#93c5fd" intensity={3} distance={3} />
      <Keyboard />
      <Mouse />
      <PC />
      <Chair />
      <Gamer />
    </group>
  );
}
