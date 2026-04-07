"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
] as const;

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 flex items-center justify-center gap-1 px-4 py-3 bg-card backdrop-blur-md border-b border-primary/10">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`font-mono text-xs px-3 py-1.5 transition-colors ${
            pathname === link.href
              ? "text-accent"
              : "text-foreground/50 hover:text-foreground/80"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
