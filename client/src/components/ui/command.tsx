import { Command as CommandPrimitive } from "cmdk";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Command = forwardRef<
  ElementRef<typeof CommandPrimitive>,
  ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    className={cn("flex h-full w-full flex-col overflow-hidden rounded-xl bg-surface text-text-primary", className)}
    ref={ref}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

export const CommandInput = forwardRef<
  ElementRef<typeof CommandPrimitive.Input>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b border-border px-3">
    <CommandPrimitive.Input
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-text-secondary disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

export const CommandList = forwardRef<
  ElementRef<typeof CommandPrimitive.List>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    className={cn("max-h-64 overflow-y-auto overflow-x-hidden p-1", className)}
    ref={ref}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

export const CommandEmpty = forwardRef<
  ElementRef<typeof CommandPrimitive.Empty>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    className={cn("py-5 text-center text-sm text-text-secondary", className)}
    ref={ref}
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

export const CommandGroup = forwardRef<
  ElementRef<typeof CommandPrimitive.Group>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    className={cn("overflow-hidden p-1 text-text-primary", className)}
    ref={ref}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

export const CommandItem = forwardRef<
  ElementRef<typeof CommandPrimitive.Item>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    className={cn(
      "relative flex min-h-9 cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none transition duration-150 data-[disabled=true]:pointer-events-none data-[selected=true]:bg-primary-soft data-[selected=true]:text-primary data-[disabled=true]:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;
