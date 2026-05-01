"use client";

import { m, useReducedMotion } from "framer-motion";
import { InterfacePanel, type InterfacePanelProps } from "./index";
import { useHasHover } from "@/hooks/useHasHover";

const panelVariants = {
  hidden: { y: -30 },
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

const reducedVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function AnimatedPanel({
  delay = 0,
  ...props
}: InterfacePanelProps & { delay?: number }) {
  const hasHover = useHasHover();
  const prefersReduced = useReducedMotion();

  if (!hasHover) {
    return (
      <div className="h-full min-[1920px]:h-auto">
        <InterfacePanel {...props} />
      </div>
    );
  }

  return (
    <m.div
      className="h-full min-[1920px]:h-auto"
      variants={prefersReduced ? reducedVariants : panelVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
    >
      <InterfacePanel {...props} />
    </m.div>
  );
}
