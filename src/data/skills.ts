import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiContentful,
  SiHtml5,
  SiCss,
  SiStyledcomponents,
  SiTailwindcss,
  SiMui,
  SiThreedotjs,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiJsonwebtokens,
  SiFirebase,
  SiRecoil,
  SiJest,
  SiVitest,
  SiTestinglibrary,
  SiGit,
  SiGithub,
} from "react-icons/si";
import {
  TbLayoutDashboard,
  TbRoute,
  TbDatabase,
  TbTestPipe,
  TbLayoutKanban,
  TbCloud,
} from "react-icons/tb";

export interface Skill {
  name: string;
  icon?: IconType;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export const skills: SkillCategory[] = [
  {
    name: "Frontend",
    skills: [
      { name: "React.js", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "JavaScript", icon: SiJavascript },
      { name: "TypeScript", icon: SiTypescript },
      { name: "CMS (Contentful)", icon: SiContentful },
      { name: "HTML5", icon: SiHtml5 },
      { name: "CSS3", icon: SiCss },
      { name: "Styled Components", icon: SiStyledcomponents },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "Material UI", icon: SiMui },
      { name: "React-Admin", icon: TbLayoutDashboard },
      { name: "Three.js", icon: SiThreedotjs },
      { name: "React Three Fiber", icon: SiReact },
      { name: "React Hooks", icon: SiReact },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express.js", icon: SiExpress },
      { name: "APIs REST", icon: TbRoute },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "JWT Authentication", icon: SiJsonwebtokens },
      { name: "Firebase", icon: SiFirebase },
    ],
  },
  {
    name: "State & Testing",
    skills: [
      { name: "Recoil", icon: SiRecoil },
      { name: "Zustand", icon: TbDatabase },
      { name: "React Context API", icon: SiReact },
      { name: "Jest", icon: SiJest },
      { name: "Vitest", icon: SiVitest },
      { name: "React Testing Library", icon: SiTestinglibrary },
      { name: "Unit Testing", icon: TbTestPipe },
    ],
  },
  {
    name: "Tools",
    skills: [
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
      { name: "Agile methodologies (Scrum)", icon: TbLayoutKanban },
      { name: "CI/CD basics", icon: TbCloud },
    ],
  },
];
