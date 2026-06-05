import type { HTMLAttributes } from "react"

type PanelProps = HTMLAttributes<HTMLDivElement>

export function Panel({ className = "", ...props }: PanelProps) {
  return (
    <section
      className={[
        "border border-[var(--color-border)] bg-[var(--color-panel)] p-8 shadow-[var(--shadow-panel)] backdrop-blur-xl",
        className,
      ].join(" ")}
      style={{
        clipPath:
          "polygon(7% 0%, 93% 0%, 100% 8%, 100% 92%, 93% 100%, 7% 100%, 0% 92%, 0% 8%)",
      }}
      {...props}
    />
  )
}
