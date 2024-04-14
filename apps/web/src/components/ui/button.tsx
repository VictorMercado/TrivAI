// type Button = React.ReactElement<

import { cva } from "class-variance-authority";
import React from "react";
import { cn } from "@trivai/lib/utils";

export const buttonVariants = cva(
  "relative inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none focus:ring-primary focus-visible:outline-none   focus-visible:ring-primary lg:focus-visible:ring-offset-2 lg:focus-visible:ring-offset-background lg:focus-visible:ring-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary/20 border border-primary text-primary lg:hover:bg-primary lg:hover:text-black lg:hover:shadow-primary lg:focus-visible:ring-primary ",
        special: "coolBorder group",
        danger:
          "bg-danger/20 border border-danger text-danger lg:hover:bg-danger lg:hover:text-black lg:hover:text-black lg:hover:shadow-danger lg:focus-visible:ring-danger ",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary/20 border border-secondary text-secondary lg:hover:bg-secondary lg:hover:text-black lg:hover:shadow-secondary lg:focus-visible:shadow-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        delete:
          "border border-danger text-danger lg:hover:bg-danger lg:hover:text-black lg:hover:text-black lg:hover:shadow-danger lg:focus-visible:ring-danger",
      },
      size: {
        default: "p-2 text-md",
        sm: "px-3 py-1 text-sm lg:text-md",
        lg: "p-4 text-lg",
      },
      active: {
        true: "bg-primary text-black",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  color?: string;
  variant:
    | "default"
    | "special"
    | "danger"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "delete";
  size?: "default" | "sm" | "lg";
  active?: boolean;
  children?: React.ReactNode;
};

// {`border border-blue-500 text-blue-500 lg:hover:bg-blue-500 lg:hover:text-black lg:hover:shadow-[0px_0px_0px_.5px_#3b82f6] lg:focus:shadow-[0px_0px_30px_.5px_#3b82f6] `}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, active, children, ...props }, ref) => {
    return variant === "delete" ? (
      <button
        className={cn(buttonVariants({ variant, size, className, active }))}
        ref={ref}
        {...props}
      >
        <div className="absolute inset-0 z-0 bg-warning-gradient opacity-50"></div>
        <span className="z-10">{children}</span>
      </button>
    ) : variant === "special" ? (
      <button
        className={cn(buttonVariants({ variant, size, className, active }))}
        ref={ref}
        {...props}
      >
        <span className="coolText group-hover:text-black">{children}</span>
      </button>
    ) : (
      <button
        className={cn(buttonVariants({ variant, size, className, active }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };
