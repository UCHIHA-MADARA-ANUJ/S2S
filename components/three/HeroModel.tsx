"use client";
import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

interface ModelJSON {
  name: string;
  color?: string;
  vertices: number[];
  indices: number[];
}

/** Loads one of our 22 procedural 3D models and renders it as a rotating mesh. */
function LoadedModel({ url, color, mouse, wireframe = false }: { url: string; color: string; mouse: { x: number; y: number }; wireframe?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const [data, setData] = useState<ModelJSON | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(url)
      .then((r) => r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`))
      .then((j) => alive && setData(j))
      .catch((e) => alive && setErr(String(e)));
    return () => { alive = false; };
  }, [url]);

  const geometry = useMemo(() => {
    if (!data) return null;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(data.vertices, 3));
    geo.setIndex(data.indices);
    geo.computeVertexNormals();
    return geo;
  }, [data]);

  useFrame((s, dt) => {
    if (!groupRef.current) return;
    // Subtle continuous rotation
    groupRef.current.rotation.y += dt * 0.25;
    groupRef.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.4) * 0.1;
    // Mouse parallax
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouse.x * 0.5, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouse.y * -0.5, 0.05);
  });

  if (err) return null;
  if (!data || !geometry) {
    // Placeholder sphere while loading
    return (
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color={color} wireframe opacity={0.5} transparent />
      </mesh>
    );
  }

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>
      {/* Subtle outer glow shell */}
      <mesh scale={1.05}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.04} />
      </mesh>
    </group>
  );
}

/** Particle field for visual depth. */
function Particles({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 20;
      a[i * 3 + 1] = (Math.random() - 0.5) * 14;
      a[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return a;
  }, [count]);
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

export interface HeroModelProps {
  /** Path to /public/3d/[name].json */
  modelUrl?: string;
  color?: string;
  wireframe?: boolean;
  className?: string;
}

export function HeroModel({
  modelUrl = "/3d/torus-knot-1.json",
  color = "#FF3D2E",
  wireframe = false,
  className = ""
}: HeroModelProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className={`w-full h-full ${className}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#FF3D2E" />
        <directionalLight position={[-5, -3, 4]} intensity={0.4} color="#00E1FF" />
        <pointLight position={[0, 0, 5]} intensity={0.3} color="#FFFFFF" />
        <Suspense fallback={null}>
          <LoadedModel url={modelUrl} color={color} mouse={mouse} wireframe={wireframe} />
          <Particles count={600} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroModel;
