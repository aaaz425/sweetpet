import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-surface hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "border border-border bg-surface text-text-primary hover:border-primary hover:bg-primary-soft",
  ghost: "text-text-secondary hover:bg-primary-soft hover:text-primary"
};

export function Button({ className, variant = "secondary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition duration-150 active:scale-[0.99] enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      type={type}
      {...props}
    />
  );
}
