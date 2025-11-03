import { cn } from "@/lib/utils";
import React from "react";

const Star = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-4 w-4 text-yellow-300", className)}
    style={{ filter: "drop-shadow(0 0 5px #fde047)" }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function ShimmerButton({
  children,
  className,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full p-px font-semibold text-white",
        "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
        "animate-glow",
        className
      )}
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-shimmer bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.4)_50%,transparent_80%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950/80 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-slate-950">
        <Star className="mr-2 animate-pulse" />
        {children}
      </span>
    </button>
  );
}
