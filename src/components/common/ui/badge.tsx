import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-pink-600 text-pink-600-foreground [a&]:hover:bg-pink-600/90",
        secondary:
          "border-transparent bg-indigo-600 text-indigo-600-foreground [a&]:hover:bg-indigo-600/90",
        destructive:
          "border-transparent bg-red-500 text-white [a&]:hover:bg-red-500/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-red-500/60",
        outline:
          "text-gray-900 [a&]:hover:bg-purple-600 [a&]:hover:text-purple-600-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
