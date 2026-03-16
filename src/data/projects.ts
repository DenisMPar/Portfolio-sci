export interface Project {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "portfolio",
    title: "Portfolio",
    description:
      "Personal portfolio site built with Next.js, Three.js, and Tailwind CSS featuring a 3D particle background and analog post-processing effects.",
    thumbnail: "/projects/portfolio.png",
    tags: ["Next.js", "Three.js", "Tailwind CSS", "TypeScript"],
    repoUrl: "https://github.com/denis/portfolio",
  },
  {
    slug: "task-manager",
    title: "Task Manager",
    description:
      "A full-stack task management app with real-time updates, drag-and-drop boards, and team collaboration features.",
    thumbnail: "/projects/task-manager.png",
    tags: ["React", "Node.js", "PostgreSQL", "WebSocket"],
    liveUrl: "https://tasks.example.com",
    repoUrl: "https://github.com/denis/task-manager",
  },
  {
    slug: "cli-tool",
    title: "CLI Tool",
    description:
      "A developer CLI utility for scaffolding projects, managing configs, and automating repetitive workflows.",
    thumbnail: "/projects/cli-tool.png",
    tags: ["Node.js", "TypeScript", "CLI"],
    repoUrl: "https://github.com/denis/cli-tool",
  },
  {
    slug: "api-gateway",
    title: "API Gateway",
    description:
      "Lightweight API gateway with rate limiting, authentication middleware, and request logging.",
    thumbnail: "/projects/api-gateway.png",
    tags: ["Express", "Redis", "Docker", "REST"],
    repoUrl: "https://github.com/denis/api-gateway",
  },
];
