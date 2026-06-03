import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

interface ResultCardProps {
  icon: LucideIcon;
  title: string;
  tag?: string;
  tagColor?: string;
  children: ReactNode;
}

export function ResultCard({ icon: Icon, title, tag, tagColor = "#6366f1", children }: ResultCardProps) {
  return (
    <div
      className="rounded-xl border border-border bg-card"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)" }}
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ backgroundColor: `${tagColor}20`, border: `1px solid ${tagColor}30` }}
          >
            <Icon className="h-3.5 w-3.5" style={{ color: tagColor }} />
          </div>
          <span
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500, color: "var(--foreground)" }}
          >
            {title}
          </span>
        </div>
        {tag && (
          <span
            className="rounded px-2 py-0.5"
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "10px",
              fontWeight: 500,
              color: tagColor,
              backgroundColor: `${tagColor}15`,
              border: `1px solid ${tagColor}25`,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {tag}
          </span>
        )}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}
