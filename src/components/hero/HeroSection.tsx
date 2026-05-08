import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AnimatedPanel } from "../panel/AnimatedPanel";

export async function HeroSection() {
  const t = await getTranslations("hero");

  return (
    <section
      id="hero"
      className="relative z-10 h-screen w-full flex flex-col items-center justify-center pointer-events-none"
      style={{ paddingTop: "var(--section-pt)", paddingBottom: "var(--section-pb)" }}
    >
      <AnimatedPanel className="w-[90vw] max-w-[1500px] h-full min-[1920px]:h-[70vh]">
        <div className="flex flex-col items-center justify-center h-full text-center pointer-events-auto select-text">
          <h1
            className="text-5xl font-bold sm:text-7xl font-display text-foreground glitch"
            style={{ letterSpacing: "-0.04em" }}
            data-text="DENIS"
            aria-label="DENIS"
          >
            DENIS
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-medium tracking-tight text-accent typing-cursor">
            {t("subtitle")}
          </p>
          <div className="mt-8 max-w-2xl text-base sm:text-[17px] leading-relaxed space-y-4 text-foreground/80 font-light">
            <p>
              {t.rich("bio1", {
                mark: (chunks) => (
                  <span className="text-foreground font-medium">{chunks}</span>
                ),
              })}
            </p>
            <p>
              {t.rich("bio2", {
                mark: (chunks) => (
                  <span className="text-foreground font-medium">{chunks}</span>
                ),
              })}
            </p>
          </div>
          <div
            className="mt-10 [background:rgb(61_214_132_/_0.4)] hover:[background:rgb(61_214_132_/_0.7)] transition-[background-color,transform] duration-200 active:scale-[0.97]"
            style={{
              clipPath: "polygon(12px 0, calc(100% + 1px) 0, calc(100% + 1px) calc(100% - 12px), calc(100% - 12px) calc(100% + 1px), 0 calc(100% + 1px), 0 12px)",
              padding: "1px",
            }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-mono text-accent/80 tracking-wider uppercase hover:bg-accent/10 hover:text-accent transition-[background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                clipPath: "polygon(11px 0, 100% 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 0 100%, 0 11px)",
                background: "rgb(30 30 54 / 0.75)",
              }}
            >
              {t("cta")}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </AnimatedPanel>
    </section>
  );
}
