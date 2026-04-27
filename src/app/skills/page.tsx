import type { Metadata } from "next";
import { SkillsSection } from "@/components/skills/SkillsSection";

export const metadata: Metadata = {
  title: "Skills — Denis Parada",
  description:
    "Technical skills and tools: React, Next.js, TypeScript, Three.js, testing, clean architecture, and more.",
  openGraph: {
    title: "Skills — Denis Parada",
    description:
      "Technical skills and tools: React, Next.js, TypeScript, Three.js, testing, clean architecture, and more.",
  },
};

export default function SkillsPage() {
  return (
    <main>
      <SkillsSection />
    </main>
  );
}
