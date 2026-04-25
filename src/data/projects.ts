export interface Project {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  imgMovil?: string;
  imgMedium?: string;
  tags: string[];
  year: number;
  role: "Solo Dev" | "Team Dev";
  status: "Live" | "In Progress" | "Archived";
  liveUrl?: string;
  repoUrl?: string;
}
