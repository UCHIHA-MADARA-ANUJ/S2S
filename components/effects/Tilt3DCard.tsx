"use client";
import { useRef, useState } from "react";
import Link from "next/link";

export function Tilt3DCard({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(`perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.03, 1.03, 1.03)`);
  };
  const onLeave = () => setTransform("perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)");

  return (
    <Link href={href} className="block">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={`transition-transform duration-300 ${className}`}
        style={{ transform, transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </Link>
  );
}
