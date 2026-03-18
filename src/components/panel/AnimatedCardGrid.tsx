"use client";

import { motion } from "framer-motion";
import { useBackgroundReady } from "@/components/background/BackgroundReadyContext";

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

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={ready ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  return <motion.div className="h-full" variants={itemVariants}>{children}</motion.div>;
}
