const contacts = [
  { label: "GitHub", href: "https://github.com/DenisMPar", prefix: "gh:" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/denismpar/", prefix: "in:" },
  { label: "Email", href: "mailto:denispar.dev@gmail.com", prefix: "mail:" },
] as const;

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-4 px-4 bg-card backdrop-blur-md border-t border-primary/10 font-mono text-xs" style={{ paddingTop: 13, paddingBottom: 13 }}>
      {contacts.map((contact) => (
        <span key={contact.label}>
          <span className="text-foreground/40">{contact.prefix} </span>
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
    </footer>
  );
}
