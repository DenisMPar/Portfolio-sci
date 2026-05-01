"use client";

import { m } from "framer-motion";

const contacts = [
  { label: "GitHub", href: "https://github.com/DenisMPar", prefix: "gh:" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/denismpar/", prefix: "in:" },
  { label: "Email", href: "mailto:denispar.dev@gmail.com", prefix: "mail:" },
] as const;

export function Footer() {
  return (
    <m.footer
      className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-4 px-4 py-2.5 bg-background border-t border-primary/10 font-mono text-sm"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {contacts.map((contact) => (
        <span key={contact.label}>
          <span className="text-foreground/70">{contact.prefix} </span>
          <a
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 transition-colors"
          >
            {contact.label}
          </a>
        </span>
      ))}
    </m.footer>
  );
}
