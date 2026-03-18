"use client";

import { motion } from "framer-motion";
import { useBackgroundReady } from "@/components/background/BackgroundReadyContext";

export default function Template({ children }: { children: React.ReactNode }) {
  const ready = useBackgroundReady();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
