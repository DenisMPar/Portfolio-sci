"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "Home", href: "#hero" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
] as const;

export function NavBar() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 flex items-center justify-center gap-1 px-4 py-3 bg-card backdrop-blur-md border-b border-primary/10">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`font-mono text-xs px-3 py-1.5 transition-colors ${
            active === link.href.slice(1)
              ? "text-accent"
              : "text-foreground/50 hover:text-foreground/80"
          }`}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
