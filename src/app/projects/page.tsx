import { Suspense } from "react";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { getProjects } from "@/lib/contentful";
import { projects as fallbackProjects } from "@/data/projects";

export default async function ProjectsPage() {
  let projects;
  try {
    projects = await getProjects();
  } catch(error) {
    console.error(error);
    projects = fallbackProjects;
  }

  return (
    <main>
      <Suspense>
        <ProjectsSection projects={projects} />
      </Suspense>
    </main>
  );
}
