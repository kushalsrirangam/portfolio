import { useMemo } from "react";
import { Environment, RoundedBox, Text, useTexture, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { FONT, ROOM, MAT, Model, lightMat, BAKE_EXPORT } from "./shared";

const { left: L, right: R, back: B, front: F, height: H } = ROOM;
const WIDTH = R - L;
const DEPTH = F - B;
const FEATURE = 1.7; // half-width of the solid wall behind the desk

function Floor() {
  const maps = useTexture({
    map: "/textures/herringbone_parquet_diff_1k.jpg",
    normalMap: "/textures/herringbone_parquet_nor_1k.jpg",
    roughnessMap: "/textures/herringbone_parquet_rough_1k.jpg",
  });
  useMemo(() => {
    Object.values(maps).forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(WIDTH / 1.6, DEPTH / 1.6);
      t.anisotropy = 8;
    });
    maps.map.colorSpace = THREE.SRGBColorSpace;
  }, [maps]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, (B + F) / 2]} receiveShadow>
      <planeGeometry args={[WIDTH, DEPTH]} />
      <meshStandardMaterial {...maps} roughness={0.85} normalScale={[0.5, 0.5]} envMapIntensity={0.3} />
    </mesh>
  );
}

// Floor-to-ceiling glazing with slim black mullions.
function WindowBank({ from, to }) {
  const w = to - from;
  const panes = Math.round(w / 1.1);
  const mullions = [];
  for (let i = 0; i <= panes; i++) mullions.push(from + (w * i) / panes);
  return (
    <group position={[0, 0, B]}>
      <mesh position={[(from + to) / 2, H / 2, 0.01]} material={MAT.glass}>
        <planeGeometry args={[w, H]} />
      </mesh>
      {mullions.map((x) => (
        <mesh key={x} position={[x, H / 2, 0.02]} material={MAT.blackMetal}>
          <boxGeometry args={[0.05, H, 0.08]} />
        </mesh>
      ))}
      {[0.03, H - 0.03, 1.05].map((y) => (
        <mesh key={y} position={[(from + to) / 2, y, 0.02]} material={MAT.blackMetal}>
          <boxGeometry args={[w, y === 1.05 ? 0.03 : 0.06, 0.08]} />
        </mesh>
      ))}
    </group>
  );
}

// Walnut slat wall behind the desk carrying the company sign.
function FeatureWall() {
  const slats = useMemo(() => {
    const out = [];
    for (let x = -FEATURE + 0.04; x < FEATURE; x += 0.08) out.push(x);
    return out;
  }, []);
  return (
    <group position={[0, 0, B]}>
      <mesh position={[0, H / 2, 0.05]}>
        <boxGeometry args={[FEATURE * 2, H, 0.1]} />
        <meshStandardMaterial color="#2a1d14" roughness={0.8} />
      </mesh>
      {slats.map((x) => (
        <mesh key={x} position={[x, H / 2, 0.115]} material={MAT.walnut} castShadow>
          <boxGeometry args={[0.045, H, 0.03]} />
        </mesh>
      ))}
      {/* Brushed-steel lettering, lit from below */}
      <Text font={FONT} fontSize={0.2} letterSpacing={0.12} position={[0, 2.42, 0.14]}
        material={MAT.steelLetters} anchorX="center" anchorY="middle">
        KUSHAL SRI RANGAM
      </Text>
      <Text font={FONT} fontSize={0.075} letterSpacing={0.35} position={[0, 2.18, 0.14]}
        color="#e5d3b3" anchorX="center" anchorY="middle">
        AI · DATA · CLOUD ENGINEERING
      </Text>
      <pointLight position={[0, 2.0, 0.7]} intensity={2.5} distance={3} color="#ffe2b8" />
    </group>
  );
}

// Recessed linear ceiling lights plus the warm light they cast.
function CeilingLights() {
  const strips = [
    [-3, -1.6], [0, -1.6], [3, -1.6],
    [-3, 1.4], [0, 1.4], [3, 1.4],
  ];
  const glow = useMemo(() => lightMat("#fff1dc", 2.2), []);
  return (
    <group>
      {strips.map(([x, z]) => (
        <group key={`${x},${z}`}>
          <mesh position={[x, H - 0.005, z]} rotation={[Math.PI / 2, 0, 0]} material={glow}>
            <planeGeometry args={[1.6, 0.08]} />
          </mesh>
          <pointLight position={[x, H - 1.0, z]} intensity={3.6} distance={6.5} decay={1.5} color="#ffe6c7" />
        </group>
      ))}
    </group>
  );
}

// Low modern three-seat sofa in grey fabric. Its back faces -z.
const FABRIC = new THREE.MeshStandardMaterial({ color: "#6f6a64", roughness: 1 });
function Sofa(props) {
  return (
    <group {...props}>
      <RoundedBox args={[2.1, 0.22, 0.86]} radius={0.04} position={[0, 0.2, 0]} material={FABRIC} castShadow receiveShadow />
      {[-0.67, 0, 0.67].map((x) => (
        <group key={x}>
          <RoundedBox args={[0.66, 0.14, 0.66]} radius={0.05} smoothness={6} position={[x, 0.38, 0.08]} material={FABRIC} castShadow />
          <RoundedBox args={[0.66, 0.44, 0.2]} radius={0.07} smoothness={6} position={[x, 0.6, -0.31]} rotation={[-0.12, 0, 0]} material={FABRIC} castShadow />
        </group>
      ))}
      {[-1.0, 1.0].map((x) => (
        <RoundedBox key={x} args={[0.14, 0.5, 0.86]} radius={0.05} position={[x, 0.36, 0]} material={FABRIC} castShadow />
      ))}
      {[[-0.95, -0.36], [0.95, -0.36], [-0.95, 0.36], [0.95, 0.36]].map(([x, z]) => (
        <mesh key={x + "," + z} position={[x, 0.04, z]} material={MAT.blackMetal}>
          <cylinderGeometry args={[0.018, 0.012, 0.08, 12]} />
        </mesh>
      ))}
    </group>
  );
}

function Lounge() {
  return (
    <group>
      <Sofa position={[L + 0.5, 0, 2.7]} rotation={[0, Math.PI / 2, 0]} />
      <Model name="modern_coffee_table_01" position={[L + 1.75, 0, 2.7]} />
      <Model name="mid_century_lounge_chair" position={[L + 3.0, 0, 3.4]} rotation={[0, -2.2, 0]} />
      <Model name="side_table_01" position={[L + 0.45, 0, 4.05]} />
      <Model name="ceramic_vase_01" position={[L + 1.75, 0.39, 2.45]} scale={0.6} />
      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[L + 1.9, 0.004, 2.9]} receiveShadow>
        <planeGeometry args={[2.6, 2.0]} />
        <meshStandardMaterial color="#8d8478" roughness={1} />
      </mesh>
      <Text font={FONT} fontSize={0.16} letterSpacing={0.18} position={[L + 0.01, 2.25, 2.7]}
        rotation={[0, Math.PI / 2, 0]} color="#3f3a34" anchorX="center">
        {"LET'S BUILD SOMETHING TOGETHER"}
      </Text>
    </group>
  );
}

export default function Office() {
  return (
    <group>
      {/* Real night-city panorama: seen through the windows and used for
          reflections, so glass, metal and screens pick up city light. */}
      <Environment
        files="/hdri/shanghai_bund_2k.hdr"
        background
        backgroundRotation={[0, Math.PI * 0.62, 0]}
        environmentRotation={[0, Math.PI * 0.62, 0]}
        environmentIntensity={0.4}
        backgroundIntensity={0.6}
      />

      <Floor />
      {/* Live mode only: the baked lighting already has real shadows. */}
      {BAKE_EXPORT && (
        <ContactShadows position={[0, 0.005, (B + F) / 2]} scale={[WIDTH, DEPTH]} resolution={1024}
          far={2.5} blur={2.4} opacity={0.55} frames={1} />
      )}

      {/* Ceiling and side walls */}
      <mesh position={[0, H, (B + F) / 2]} rotation={[Math.PI / 2, 0, 0]} material={MAT.ceiling}>
        <planeGeometry args={[WIDTH, DEPTH]} />
      </mesh>
      <mesh position={[L, H / 2, (B + F) / 2]} rotation={[0, Math.PI / 2, 0]} material={MAT.wall} receiveShadow>
        <planeGeometry args={[DEPTH, H]} />
      </mesh>
      <mesh position={[R, H / 2, (B + F) / 2]} rotation={[0, -Math.PI / 2, 0]} material={MAT.wall} receiveShadow>
        <planeGeometry args={[DEPTH, H]} />
      </mesh>
      {/* Skirting boards */}
      {[L + 0.01, R - 0.01].map((x) => (
        <mesh key={x} position={[x, 0.05, (B + F) / 2]} material={MAT.whiteTop}>
          <boxGeometry args={[0.02, 0.1, DEPTH]} />
        </mesh>
      ))}

      <WindowBank from={L} to={-FEATURE} />
      <WindowBank from={FEATURE} to={R} />
      <FeatureWall />
      <CeilingLights />
      <Lounge />

      {/* Plants */}
      <Model name="potted_plant_02" position={[-FEATURE - 0.45, 0, B + 0.4]} scale={1.25} />
      <Model name="potted_plant_02" position={[R - 0.5, 0, 2.6]} rotation={[0, 1.3, 0]} scale={1.2} />
      <Model name="potted_plant_02" position={[L + 0.5, 0, B + 0.45]} rotation={[0, 2.4, 0]} scale={1.1} />

      {/* Gentle fill so corners are never pitch black */}
      <ambientLight intensity={0.35} color="#fff6ea" />
      <hemisphereLight args={["#ffe9cf", "#3a2c22", 0.35]} />
    </group>
  );
}
