"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "ghost" | "solid" | "danger";

const base =
  "inline-flex items-center justify-center rounded-[var(--radius-md)] transition-[background-color,color,transform,opacity] duration-[var(--dur-fast)] ease-[var(--ease-out)] disabled:opacity-40 disabled:pointer-events-none active:translate-y-px focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  ghost: "text-text-muted hover:text-text hover:bg-surface-3",
  solid:
    "bg-accent text-accent-contrast hover:bg-accent-strong shadow-[0_2px_12px_-2px_oklch(0.74_0.12_240_/_0.5)]",
  danger: "text-text-muted hover:text-[var(--color-danger)] hover:bg-surface-3",
};

export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: number }
>(function IconButton(
  { variant = "ghost", size = 36, className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], className)}
      style={{ width: size, height: size, ...props.style }}
      {...props}
    />
  );
});
