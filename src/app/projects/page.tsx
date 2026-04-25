import { Suspense } from "react";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { getProjects } from "@/lib/contentful";

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
