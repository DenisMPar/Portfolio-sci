"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { RiRocketLine } from "react-icons/ri";

const NAV_LINKS = [
  { key: "home" as const, href: "/" },
  { key: "projects" as const, href: "/projects" },
  { key: "skills" as const, href: "/skills" },
];

const LOCALES = ["en", "es"] as const;

function LocaleSwitcher({ onSwitch }: { onSwitch?: () => void }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center font-mono text-xs tracking-widest select-none">
      <span className="text-foreground/30" aria-hidden="true">[</span>
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span className="text-foreground/20 mx-px" aria-hidden="true">
              |
            </span>
          )}
          <button
            onClick={() => {
              if (locale !== l) {
                router.replace(pathname, { locale: l });
                onSwitch?.();
              }
            }}
            disabled={locale === l}
            aria-label={l === "en" ? "Switch to English" : "Cambiar a Español"}
            className={`px-1.5 py-2 uppercase transition-[color,transform] duration-200 active:scale-[0.97] ${
              locale === l
                ? "text-accent cursor-default drop-shadow-[0_0_8px_var(--primary-vivid)]"
                : "text-foreground/55 pointer-hover:text-foreground/80 cursor-pointer"
            }`}
          >
            {l}
          </button>
        </span>
      ))}
      <span className="text-foreground/30" aria-hidden="true">]</span>
    </div>
  );
}

export function NavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-20 bg-background border-b border-primary/10 animate-[page-enter_0.4s_ease-out_forwards] motion-reduce:animate-none"
        aria-label="Main navigation"
      >
        {/* Desktop */}
        <div className="hidden sm:flex items-center justify-center gap-4 px-4 py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`font-mono text-sm px-3 py-2 transition-[color,transform] active:scale-[0.97] ${
                pathname === link.href
                  ? "text-state-active"
                  : "text-foreground/70 pointer-hover:text-foreground/90"
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
          <LocaleSwitcher />
          <Link
            href="/explore"
            aria-label="Explore background"
            className={`p-2 transition-[color,transform] active:scale-[0.97] ${
              pathname === "/explore"
                ? "text-accent"
                : "text-foreground/40 pointer-hover:text-foreground/80"
            }`}
          >
            <RiRocketLine className="size-4" />
          </Link>
        </div>

        {/* Mobile bar */}
        <div className="flex sm:hidden items-center justify-between px-4 py-3">
          <span className="font-mono text-xs text-foreground/55 tracking-widest">
            DENIS<span className="text-accent motion-reduce:opacity-100" style={{ animation: 'blink 1s steps(1) infinite' }}>_</span>
          </span>
          <button
            onClick={() => setOpen((o) => !o)}
            className="font-mono text-xs tracking-widest text-foreground/60 pointer-hover:text-foreground/90 transition-[color,transform] active:scale-[0.97] cursor-pointer"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? "×" : "≡"}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {open && (
            <m.div
              id="mobile-menu"
              initial={prefersReduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
              animate={prefersReduced ? { opacity: 1, transition: { duration: 0.15 } } : { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
              exit={prefersReduced ? { opacity: 0, transition: { duration: 0.1 } } : { clipPath: "inset(0 0 100% 0)", transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
              className="sm:hidden border-t border-primary/10"
            >
              <div className="px-6 py-3 flex flex-col">
                {NAV_LINKS.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={`flex items-center gap-3 font-mono text-sm py-3.5 border-b border-primary/5 transition-[color,transform] active:scale-[0.98] ${
                      pathname === link.href
                        ? "text-state-active"
                        : "text-foreground/55 pointer-hover:text-foreground/90"
                    }`}
                  >
                    <span className="text-primary/35 text-xs tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {t(link.key)}
                    {pathname === link.href && (
                      <span className="ml-auto text-accent text-xs" aria-hidden="true">
                        ▸
                      </span>
                    )}
                  </Link>
                ))}
                <div className="pt-3.5">
                  <LocaleSwitcher onSwitch={() => setOpen(false)} />
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[15] sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}
