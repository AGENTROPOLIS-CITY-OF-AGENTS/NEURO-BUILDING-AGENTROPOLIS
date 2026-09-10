import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

type ElevatorProps = {
  active: boolean;
  glow: string;
  onEnter: () => void;
  facadeZ: number;
  width?: number;
  height?: number;
};

export function Elevator({ active, glow, onEnter, facadeZ, width = 0.92, height = 1.95 }: ElevatorProps) {
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);
  const well = useRef<THREE.MeshBasicMaterial>(null);
  const reduce = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const leaf = width * 0.46;
  const z = facadeZ + 0.05;

  useFrame((_, dt) => {
    const open = active ? 0.34 : 0.045;
    const k = reduce ? 1 : 1 - Math.pow(0.0008, dt);
    if (left.current) left.current.position.x = THREE.MathUtils.lerp(left.current.position.x, -open, k);
    if (right.current) right.current.position.x = THREE.MathUtils.lerp(right.current.position.x, open, k);
    if (well.current) well.current.opacity = THREE.MathUtils.lerp(well.current.opacity, active ? 0.72 : 0.18, k);
  });

  const tap = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (active) onEnter();
  };

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, height * 0.52, z - 0.08]} onClick={tap} onDoubleClick={tap}>
        <planeGeometry args={[width * 0.72, height * 0.88]} />
        <meshBasicMaterial ref={well} color={glow} transparent opacity={0.2} toneMapped={false} />
      </mesh>
      <mesh position={[0, height + 0.08, z]}>
        <boxGeometry args={[width + 0.18, 0.1, 0.12]} />
        <meshStandardMaterial color="#0a1016" metalness={0.85} roughness={0.22} emissive={glow} emissiveIntensity={active ? 0.55 : 0.18} />
      </mesh>
      <mesh position={[-(width / 2 + 0.06), height * 0.52, z]}>
        <boxGeometry args={[0.1, height, 0.14]} />
        <meshStandardMaterial color="#121820" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[width / 2 + 0.06, height * 0.52, z]}>
        <boxGeometry args={[0.1, height, 0.14]} />
        <meshStandardMaterial color="#121820" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh ref={left} position={[-0.05, height * 0.52, z + 0.01]} onClick={tap}>
        <boxGeometry args={[leaf, height * 0.92, 0.04]} />
        <meshStandardMaterial color="#070b10" metalness={0.55} roughness={0.18} emissive={glow} emissiveIntensity={0.12} />
      </mesh>
      <mesh ref={right} position={[0.05, height * 0.52, z + 0.01]} onClick={tap}>
        <boxGeometry args={[leaf, height * 0.92, 0.04]} />
        <meshStandardMaterial color="#070b10" metalness={0.55} roughness={0.18} emissive={glow} emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[0, 0.04, z + 0.16]} rotation={[-Math.PI / 2, 0, 0]} onClick={tap}>
        <planeGeometry args={[width * 1.15, 0.7]} />
        <meshBasicMaterial color={glow} transparent opacity={active ? 0.28 : 0.06} />
      </mesh>
      <mesh position={[0, height * 0.52, z + 0.42]} onClick={tap} onDoubleClick={tap} visible={false}>
        <boxGeometry args={[Math.max(width, 1.4), Math.max(height, 2.2), 0.8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {active ? (
        <Html position={[0, height + 0.28, z + 0.2]} center distanceFactor={20} zIndexRange={[28, 0]} style={{ pointerEvents: "none" }}>
          <p className="threshold-sign">Step through</p>
        </Html>
      ) : null}
    </group>
  );
}
