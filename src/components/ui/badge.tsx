import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-border/100 dark:border-border/20 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 gap-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground dark:shadow-md dark:border-transparent",
        brand:
          "border-transparent bg-brand text-primary-foreground dark:shadow-md dark:border-transparent",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground dark:shadow-md dark:border-transparent",
        destructive:
          "border-transparent bg-destructive/30 text-destructive-foreground dark:shadow-md dark:border-transparent",
        outline: "text-foreground shadow-sm",
      },
      size: {
        default: "px-2.5 py-1",
        sm: "px-1",
        table: "px-2.5 py-1 min-w-[80px] justify-center",
        status: "px-2.5 py-1 min-w-[90px] justify-center",
        large_status: "px-2.5 py-1 min-w-[110px] justify-center",
        xl_status: "px-2.5 py-1 min-w-[130px] justify-center",
        xxl_status: "px-2.5 py-1 min-w-[150px] justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
