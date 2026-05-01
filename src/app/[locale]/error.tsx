"use client";

import { useTranslations } from "next-intl";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center h-screen w-screen">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-7xl font-bold text-primary tracking-widest drop-shadow-[0_0_30px_rgba(80,140,204,0.5)]">
          {t("title")}
        </h1>
        <div className="mx-auto my-6 h-px w-48 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <p className="text-foreground/70 text-sm uppercase tracking-wider">
          {t("subtitle")}
        </p>
        <p className="mt-2 text-foreground/70 text-xs max-w-md mx-auto">
          {t("description")}
        </p>
        <button
          onClick={reset}
          className="mt-8 inline-block border border-primary/30 px-6 py-2 text-xs uppercase tracking-wider text-primary hover:bg-primary/10 hover:border-primary/60 transition-colors cursor-pointer"
          style={{
            clipPath:
              "polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))",
          }}
        >
          {t("retry")}
        </button>
      </div>
    </div>
  );
}
