import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export function NoiseTexture() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  )
}

export function CrtScanlines() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none opacity-[0.04]"
      style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, var(--panel-scanlines-color) 2px, var(--panel-scanlines-color) 4px)",
      }}
    />
  )
}

export function VignetteEdge() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at center, transparent 50%, var(--panel-vignette-color) 100%)",
      }}
    />
  )
}

export function ColorAberration() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none opacity-30"
      style={{
        boxShadow: "inset 0 0 60px var(--panel-aberration-inner), inset 0 0 20px var(--panel-aberration-outer)",
      }}
    />
  )
}

function GlowLine({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute left-8 right-8 h-px bg-gradient-to-r from-transparent to-transparent",
        position === "top" ? "top-0 via-primary/40" : "bottom-0 via-primary/20"
      )}
    />
  )
}

function PanelContent({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="relative z-10 h-full flex flex-col">
      {title && (
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-2 h-2 bg-primary rotate-45 shadow-[0_0_8px_var(--primary-strong)]" aria-hidden="true" />
          <h1 className="text-base font-medium uppercase tracking-wider text-foreground text-wrap-balance font-display">
            {title}
          </h1>
          <div
            className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent origin-left motion-reduce:!animate-none"
            style={{ transform: 'scaleX(0)', animation: 'line-expand 0.5s ease-out 0.2s forwards' }}
            aria-hidden="true"
          />
        </div>
      )}
      <div className="p-4 mb-3 flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}

export interface InterfacePanelProps {
  children: ReactNode
  title?: string
  className?: string
  variant?: "default" | "glow" | "minimal" | "card"
}

export function InterfacePanel({ children, title, className, variant = "default" }: InterfacePanelProps) {
  const isCard = variant === "card"

  return (
    <div
      className={cn(
        "relative",
        variant === "glow" && "drop-shadow-[0_0_25px_var(--primary-dim)]",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden h-full",
          isCard
            ? "bg-[rgb(40_40_70_/_0.25)] before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/5 before:to-transparent before:pointer-events-none"
            : "bg-card before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/8 before:to-transparent before:pointer-events-none"
        )}
        style={{
          clipPath: isCard
            ? "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))"
            : "polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))",
        }}
      >
        <NoiseTexture />
        <CrtScanlines />
        {!isCard && <VignetteEdge />}
        {!isCard && <ColorAberration />}
        <PanelContent title={title}>{children}</PanelContent>
        <GlowLine position="top" />
        {!isCard && <GlowLine position="bottom" />}
      </div>
    </div>
  )
}
