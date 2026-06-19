import { InterfacePanel, type InterfacePanelProps } from "./index";

// Entrance is a pure CSS animation (see `.panel-enter` in globals.css), so the
// panel and its content are visible without JavaScript — no opacity:0 SSR state
// that depends on hydration to reveal. Reduced motion disables the animation.
export function AnimatedPanel({
  delay = 0,
  ...props
}: InterfacePanelProps & { delay?: number }) {
  return (
    <div
      className="h-full min-[1920px]:h-auto panel-enter"
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      <InterfacePanel {...props} />
    </div>
  );
}
