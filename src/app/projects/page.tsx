import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { getProjects } from "@/lib/contentful";

export const metadata: Metadata = {
  title: "Projects — Denis Parada",
  description:
    "Showcase and case studies: portfolio projects built with React, Next.js, TypeScript, Three.js, and more.",
  openGraph: {
    title: "Projects — Denis Parada",
    description:
      "Showcase and case studies: portfolio projects built with React, Next.js, TypeScript, Three.js, and more.",
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main>
      <Suspense>
        <ProjectsSection projects={projects} />
      </Suspense>
    </main>
  );
}
