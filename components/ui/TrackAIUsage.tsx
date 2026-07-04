"use client";
import { useEffect } from "react";
import { trackEvent } from "@/components/ui/Celebration";

/**
 * Client component that fires an `aiFeaturesUsed` achievement tracking event
 * with a given feature id. Use inside AI feature pages to count them.
 */
export function TrackAIUsage({ featureId }: { featureId: string }) {
  useEffect(() => {
    trackEvent("aiFeaturesUsed", featureId);
  }, [featureId]);
  return null;
}
