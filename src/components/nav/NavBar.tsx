"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBackgroundReady } from "@/components/background/BackgroundReadyContext";

const links = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
] as const;

export function NavBar() {
  const pathname = usePathname();
  const ready = useBackgroundReady();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-20 flex items-center justify-center gap-1 px-4 py-3 bg-background border-b border-primary/10 transition-transform duration-500 ease-out"
      style={{
        transform: ready ? "translateY(0)" : "translateY(-100%)",
        transitionDelay: ready ? "300ms" : "0ms",
      }}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`font-mono text-sm px-3 py-2 transition-colors ${
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
