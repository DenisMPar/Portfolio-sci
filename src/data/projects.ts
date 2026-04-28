export interface ProjectSection {
  title: string;
  content: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  year: number;
  role: "Solo Dev" | "Team Dev";
  status: "Live" | "In Progress" | "Archived";
  liveUrl?: string;
  repoUrl?: string;
  images: string[];
  sections: ProjectSection[];
}
