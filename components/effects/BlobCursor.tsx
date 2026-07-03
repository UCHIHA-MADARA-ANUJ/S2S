"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * BlobCursor — React Bits-quality trailing blob cursor with gooey filter
 */
export interface BlobCursorProps {
  blobType?: "circle" | "square";
  fillColor?: string;
  trailCount?: number;
  sizes?: number[];
  innerSizes?: number[];
  innerColor?: string;
  opacities?: number[];
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  filterId?: string;
  filterStdDeviation?: number;
  useFilter?: boolean;
  fastDuration?: number;
  slowDuration?: number;
  fastEase?: string;
  slowEase?: string;
  zIndex?: number;
}

export function BlobCursor({
  blobType = "circle",
  fillColor = "#6366F1",
  trailCount = 3,
  sizes = [60, 125, 75],
  innerSizes = [20, 35, 25],
  innerColor = "rgba(255,255,255,0.8)",
  opacities = [0.6, 0.6, 0.6],
  shadowColor = "rgba(0,0,0,0.75)",
  shadowBlur = 5,
  shadowOffsetX = 10,
  shadowOffsetY = 10,
  filterId = "blob",
  filterStdDeviation = 30,
  useFilter = true,
  fastDuration = 0.1,
  slowDuration = 0.5,
  fastEase = "power3.out",
  slowEase = "power1.out",
  zIndex = 100,
}: BlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // hide native cursor
    document.documentElement.style.cursor = "none";
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `*, *::hover, *:active, *:focus, a, button, input, textarea, [role="button"] { cursor: none !important; }`;
    document.head.appendChild(styleEl);

    const blobs = blobsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!blobs.length) return;

    const setX = gsap.quickTo(blobs[0], "x", { duration: fastDuration, ease: fastEase });
    const setY = gsap.quickTo(blobs[0], "y", { duration: fastDuration, ease: fastEase });
    const slowXArr = blobs.slice(1).map((b) => gsap.quickTo(b, "x", { duration: slowDuration, ease: slowEase }));
    const slowYArr = blobs.slice(1).map((b) => gsap.quickTo(b, "y", { duration: slowDuration, ease: slowEase }));

    const handleMove = (e: MouseEvent) => {
      setX(e.clientX);
      setY(e.clientY);
      blobs.slice(1).forEach((b, i) => {
        slowXArr[i]?.(e.clientX);
        slowYArr[i]?.(e.clientY);
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.style.cursor = "";
      styleEl.remove();
    };
  }, [fastDuration, slowDuration, fastEase, slowEase]);

  const borderRadius = blobType === "circle" ? "50%" : "20%";
  const filterValue = useFilter ? `url(#${filterId})` : undefined;

  return (
    <>
      {useFilter && (
        <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden>
          <defs>
            <filter id={filterId}>
              <feGaussianBlur in="SourceGraphic" stdDeviation={filterStdDeviation} result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
      )}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex,
          filter: filterValue,
        }}
        aria-hidden
      >
        {Array.from({ length: trailCount }).map((_, i) => {
          const size = sizes[i] ?? sizes[sizes.length - 1];
          const innerSize = innerSizes[i] ?? innerSizes[innerSizes.length - 1];
          const opacity = opacities[i] ?? opacities[opacities.length - 1];
          return (
            <div
              key={i}
              ref={(el) => { blobsRef.current[i] = el; }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                backgroundColor: fillColor,
                borderRadius,
                opacity,
                boxShadow: `0px ${shadowOffsetY}px ${shadowBlur}px ${shadowOffsetX}px ${shadowColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                willChange: "transform",
              }}
            >
              <div
                style={{
                  width: innerSize,
                  height: innerSize,
                  backgroundColor: innerColor,
                  borderRadius: "50%",
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default BlobCursor;
