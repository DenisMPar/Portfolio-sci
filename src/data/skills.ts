export interface SkillCategory {
  name: string;
  skills: string[];
}

export const skills: SkillCategory[] = [
  {
    name: "Frontend",
    skills: [
      "React.js", "Next.js", "JavaScript", "TypeScript", "CMS (Contentful)",
      "HTML5", "CSS3", "Styled Components", "Tailwind CSS", "Material UI",
      "React-Admin", "Three.js", "React Three Fiber", "React Hooks",
    ],
  },
  {
    name: "Backend",
    skills: ["Node.js", "Express.js", "APIs REST", "PostgreSQL", "JWT Authentication", "Firebase"],
  },
  {
    name: "State & Testing",
    skills: ["Recoil", "Zustand", "React Context API", "Jest", "Vitest", "React Testing Library", "Unit Testing"],
  },
  {
    name: "Tools",
    skills: ["Git", "GitHub", "Agile methodologies (Scrum)", "CI/CD basics"],
  },
];
