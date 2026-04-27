interface ProjectBase {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  year: number;
  role: "Solo Dev" | "Team Dev";
  status: "Live" | "In Progress" | "Archived";
  liveUrl?: string;
  repoUrl?: string;
}

export interface ShowcaseProject extends ProjectBase {
  type: "showcase";
  images: string[];
}

export interface CaseStudySection {
  title: string;
  content: string;
}

export interface CaseStudyProject extends ProjectBase {
  type: "case-study";
  sections: CaseStudySection[];
}

export type Project = ShowcaseProject | CaseStudyProject;
