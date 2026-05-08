import { getTranslations } from "next-intl/server";
import { RocketCursor } from "@/components/explore/RocketCursor";
import { ExploreMobileGuard } from "@/components/explore/ExploreMobileGuard";

export default async function ExplorePage() {
  const t = await getTranslations("hero");

  return (
    <>
      <ExploreMobileGuard />
      <RocketCursor />
      <div
        className="relative z-10 h-screen w-full hidden sm:flex flex-col items-end justify-end pointer-events-none"
        style={{ paddingTop: "var(--nav-h)", paddingBottom: "calc(var(--footer-h) + 24px)", paddingRight: "2rem" }}
      >
        <div className="flex flex-col items-start text-left">
          <h1
            className="text-2xl font-bold sm:text-3xl font-display text-foreground glitch"
            style={{ letterSpacing: "-0.04em" }}
            data-text="DENIS"
            aria-label="DENIS"
          >
            DENIS
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-medium tracking-tight text-accent typing-cursor">
            {t("subtitle")}
          </p>
        </div>
      </div>
    </>
  );
}
