"use client";

import { m } from "framer-motion";
import { useBackgroundReady } from "@/components/background/BackgroundReadyContext";
import { useHasHover } from "@/hooks/useHasHover";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 250,
    },
  },
};

export function AnimatedCardGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ready = useBackgroundReady();
  const hasHover = useHasHover();

  if (!hasHover) {
    return (
      <div className={className} style={{ opacity: ready ? 1 : 0 }}>
        {children}
      </div>
    );
  }

  return (
    <m.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={ready ? "visible" : "hidden"}
    >
      {children}
    </m.div>
  );
}

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  const hasHover = useHasHover();
  if (!hasHover) {
    return <div className="h-full">{children}</div>;
  }
  return <m.div className="h-full" variants={itemVariants}>{children}</m.div>;
}
