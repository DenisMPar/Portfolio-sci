import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center h-screen w-screen">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-8xl font-bold text-primary tracking-widest drop-shadow-[0_0_30px_var(--primary-dim)]">
          404
        </h1>
        <div className="mx-auto my-6 h-px w-48 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <p className="text-foreground/70 text-sm uppercase tracking-wider">
          Page not found
        </p>
        <p className="mt-2 text-foreground/70 text-xs">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block border border-primary/30 px-6 py-2 text-xs uppercase tracking-wider text-primary pointer-hover:bg-primary/10 pointer-hover:border-primary/60 transition-[color,background-color,border-color,transform] active:scale-[0.97]"
          style={{
            clipPath:
              "polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))",
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
