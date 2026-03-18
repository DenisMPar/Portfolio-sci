"use client";

import { motion } from "framer-motion";
import { InterfacePanel, type InterfacePanelProps } from "./index";
import { useBackgroundReady } from "@/components/background/BackgroundReadyContext";

const panelVariants = {
  hidden: { y: -30},
  visible: {
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 200,
      mass: 0.8,
    },
  },
};

export function AnimatedPanel({
  delay = 0,
  ...props
}: InterfacePanelProps & { delay?: number }) {
  const ready = useBackgroundReady();

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate={ready ? "visible" : "hidden"}
      transition={{ delay }}
      className="h-full"
    >
      <InterfacePanel {...props} />
    </motion.div>
  );
}
