"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SummaryCardProps {
  icon: ReactNode
  label: string
  value: string | number
  description: string
  className?: string
  labelColor?: string
}

export function SummaryCard({
  icon,
  label,
  value,
  description,
  className,
  labelColor
}: SummaryCardProps) {
  return (
    <div className={cn(
      "flex flex-col items-start gap-2 rounded-xl p-4 text-left shadow-xl bg-card border",
      className
    )}>
      <div className="flex items-center gap-2">
        {icon}
        <div className={cn(
          "text-sm font-medium",
          labelColor || "text-foreground"
        )}>{label}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-foreground text-2xl font-semibold drop-shadow-[1px_1px_12px_var(--brand-foreground)] transition-all duration-300 sm:text-3xl">
          {value}
        </div>
      </div>
      <div className="text-muted-foreground text-xs font-medium text-pretty">{description}</div>
    </div>
  )
}
