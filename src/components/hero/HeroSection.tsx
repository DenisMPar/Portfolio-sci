import { InterfacePanel } from "../panel";

export function HeroSection() {
  return (
    <section className="relative z-10 h-screen w-full flex flex-col items-center justify-center pointer-events-none select-none">
      <InterfacePanel title="Main" className="w-[90vw] h-[85vh]">
        <h1
        className="text-5xl font-bold tracking-tight sm:text-7xl"
        style={{ color: '#eaeaea' }}
      >
        Denis
      </h1>
      <p
        className="mt-4 text-lg sm:text-2xl font-mono"
        style={{ color: '#00ff88' }}
      >
        Full-Stack Developer
      </p>
      </InterfacePanel>
    </section>
  );
}
