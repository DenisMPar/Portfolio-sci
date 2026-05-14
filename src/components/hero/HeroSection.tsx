import { getTranslations } from "next-intl/server";
import { AnimatedPanel } from "../panel/AnimatedPanel";
import { HeroCtaButton } from "./HeroCtaButton";

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
          <HeroCtaButton label={t("cta")} />
        </div>
      </AnimatedPanel>
    </section>
  );
}
