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
    <nav className="fixed top-0 left-0 right-0 z-20 flex items-center justify-center gap-4 px-4 py-3 bg-background border-b border-primary/10 animate-[page-enter_0.4s_ease-out_forwards]">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={pathname === link.href ? "page" : undefined}
className={`font-mono text-sm px-3 py-2 transition-colors ${
            pathname === link.href
              ? "text-state-active"
              : "text-foreground/70 hover:text-foreground/90"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
