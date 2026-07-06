"use client";

import { motion } from "framer-motion";
import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1], // Smooth cinematic easing
      }}
      className="w-full relative"
    >
      {children}
    </motion.div>
  );
}
