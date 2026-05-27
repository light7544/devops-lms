import React from "react";
import { AlertCircle, Info, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "note" | "tip" | "warning" | "danger" | "success";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const CALLOUT_CONFIG: Record<
  CalloutType,
  { icon: React.ElementType; color: string; bg: string; border: string; label: string }
> = {
  note: {
    icon: Info,
    color: "text-blue-400",
    bg: "bg-blue-500/8",
    border: "border-blue-500/20",
    label: "Note",
  },
  tip: {
    icon: Lightbulb,
    color: "text-amber-400",
    bg: "bg-amber-500/8",
    border: "border-amber-500/20",
    label: "Tip",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/8",
    border: "border-amber-500/20",
    label: "Warning",
  },
  danger: {
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-500/8",
    border: "border-red-500/20",
    label: "Danger",
  },
  success: {
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-500/8",
    border: "border-green-500/20",
    label: "Success",
  },
};

export function Callout({ type = "note", title, children, className }: CalloutProps) {
  const config = CALLOUT_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "my-4 rounded-lg border p-4",
        config.bg,
        config.border,
        className
      )}
    >
      <div className="flex gap-3">
        <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", config.color)} />
        <div className="flex-1 text-sm">
          {title && (
            <p className={cn("font-semibold mb-1", config.color)}>{title}</p>
          )}
          {!title && (
            <span className={cn("font-semibold mr-1", config.color)}>{config.label}:</span>
          )}
          <span className="text-zinc-300">{children}</span>
        </div>
      </div>
    </div>
  );
}
