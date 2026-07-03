"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const a = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      a[i * 3] = (Math.random() - 0.5) * 30;
      a[i * 3 + 1] = (Math.random() - 0.5) * 20;
      a[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return a;
  }, []);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = s.clock.elapsedTime * 0.04;
      ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.1) * 0.05;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#FF3D2E" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export function ThreeCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#FF3D2E" />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#00E1FF" />
      <Particles />
    </Canvas>
  );
}
