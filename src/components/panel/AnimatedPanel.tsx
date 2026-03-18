"use client";

import { m } from "framer-motion";
import { InterfacePanel, type InterfacePanelProps } from "./index";
import { useBackgroundReady } from "@/components/background/BackgroundReadyContext";
import { useHasHover } from "@/hooks/useHasHover";

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
  const hasHover = useHasHover();

  if (!hasHover) {
    return (
      <div className="h-full" style={{ opacity: ready ? 1 : 0 }}>
        <InterfacePanel {...props} />
      </div>
    );
  }

  return (
    <m.div
      variants={panelVariants}
      initial="hidden"
      animate={ready ? "visible" : "hidden"}
      transition={{ delay }}
      className="h-full"
    >
      <InterfacePanel {...props} />
    </m.div>
  );
}
