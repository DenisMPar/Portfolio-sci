import { InterfacePanel } from "@/components/panel";

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-[skeleton-shimmer_2s_linear_infinite] motion-reduce:animate-none rounded-sm ${className}`}
      style={{
        background:
          "linear-gradient(90deg, var(--background) 30%, var(--background-elevated) 50%, var(--background) 70%)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}

const NAV_ITEM_WIDTHS = ["w-5/6", "w-2/3", "w-3/4", "w-1/2", "w-4/6"];

// Text-free skeleton: `aria-busy` conveys the loading state to assistive tech
// without any translatable string, so the route stays statically generated
// (localizing a label would force the whole segment into dynamic rendering).
export default function ProjectsLoading() {
  return (
    <main>
      <section
        className="relative z-10 h-screen w-full flex items-center justify-center pointer-events-none pb-[env(safe-area-inset-bottom)]"
        style={{
          paddingTop: "var(--section-pt)",
          paddingBottom: "var(--section-pb)",
        }}
      >
        <InterfacePanel className="w-[90vw] max-w-[1500px] h-full min-[1920px]:h-[70vh]">
          <div
            role="status"
            aria-busy="true"
            className="flex flex-col sm:grid sm:grid-cols-[12rem_1fr] w-full sm:h-full sm:min-h-0"
          >
            {/* Sidebar nav skeleton */}
            <div className="border-b sm:border-b-0 sm:border-r border-primary/15 py-3 px-2 flex flex-col gap-3 overflow-hidden">
              {NAV_ITEM_WIDTHS.map((w, i) => (
                <Shimmer key={i} className={`h-5 ${w} opacity-70`} />
              ))}
            </div>

            {/* Preview skeleton — height-constrained like the real layout: the
                image grows to fill available space (lg:flex-1 + lg:aspect-auto)
                instead of a fixed aspect-video that overflows into a page
                scroll on large screens. */}
            <div className="flex flex-col gap-4 pt-3 sm:pt-0 sm:pl-4 sm:min-h-0 sm:overflow-hidden">
              <Shimmer className="w-full aspect-video lg:aspect-auto lg:flex-1 lg:min-h-0" />
              <div className="flex flex-col gap-2.5 shrink-0">
                <Shimmer className="h-5 w-2/5" />
                <Shimmer className="h-3.5 w-11/12 opacity-60" />
                <Shimmer className="h-3.5 w-4/6 opacity-60" />
              </div>
            </div>
          </div>
        </InterfacePanel>
      </section>
    </main>
  );
}
