"use client";
import { useEffect } from "react";
import { announce } from "@/lib/a11y";

/**
 * Lightweight client-side web-vitals reporter. Logs to console + reports slow metrics
 * via the live region (for screen-reader users on slow connections).
 */
export function WebVitalsReporter() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    type Metric = { name: string; value: number; id: string };

    const report = (m: Metric) => {
      // eslint-disable-next-line no-console
      console.log(`[WebVitals] ${m.name}: ${m.value.toFixed(0)}ms (id=${m.id})`);
      if (m.name === "LCP" && m.value > 4000) {
        announce("Page is loading slowly. Please be patient.", "polite");
      }
    };

    // Use PerformanceObserver for paint + LCP
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          report({ name: "LCP", value: entry.startTime, id: "lcp" });
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const ev = entry as any;
          report({ name: "FID", value: ev.processingStart - ev.startTime, id: "fid" });
        }
      });
      fidObserver.observe({ type: "first-input", buffered: true });

      const clsObserver = new PerformanceObserver((entryList) => {
        let cls = 0;
        for (const entry of entryList.getEntries()) {
          const ev = entry as any;
          if (!ev.hadRecentInput) cls += ev.value;
        }
        if (cls > 0) report({ name: "CLS", value: cls * 1000, id: "cls" });
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    } catch (e) {
      // PerformanceObserver not available — silently skip
    }
  }, []);

  return null;
}
