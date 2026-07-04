"use client";
import { useEffect, useState } from "react";
import { announce } from "@/lib/a11y";

/**
 * Mounts a polite + assertive live region. Pages can call
 * announce("message") from lib/a11y to push updates to screen readers.
 */
export function LiveAnnouncer() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    // Force a re-render after mount so the live region nodes are in the DOM
    setTick((t) => t + 1);
  }, []);
  return (
    <>
      <div
        id="sv-announce-polite"
        aria-live="polite"
        aria-atomic="true"
        role="status"
        className="sr-only"
      />
      <div
        id="sv-announce-assertive"
        aria-live="assertive"
        aria-atomic="true"
        role="alert"
        className="sr-only"
      />
    </>
  );
}
