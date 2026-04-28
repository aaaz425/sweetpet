import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "border border-primary bg-primary text-surface shadow-[0_8px_18px_rgba(25,23,20,0.12)] hover:border-accent hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "border border-border bg-surface text-text-primary shadow-[0_1px_2px_rgba(25,23,20,0.04)] hover:border-border-strong hover:bg-surface-muted",
  ghost: "text-text-secondary hover:bg-surface-muted hover:text-primary"
};

export function Button({ className, variant = "secondary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold leading-5 transition duration-150 active:scale-[0.99] enabled:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      type={type}
      {...props}
    />
  );
}
