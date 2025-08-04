import * as React from "react"

import { cn } from "@/lib/utils"

const Toaster = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-50 flex flex-col gap-2",
      className
    )}
    {...props}
  />
))
Toaster.displayName = "Toaster"

export { Toaster } 