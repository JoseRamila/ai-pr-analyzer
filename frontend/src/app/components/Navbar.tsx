import { GitPullRequest, Zap } from "lucide-react";
import { Badge } from "./ui/badge";

type View = "analyzer" | "history" | "detail" | "docs";

interface NavbarProps {
  activeView: View;
  onChangeView: (view: View) => void;
}

export function Navbar({ activeView, onChangeView }: NavbarProps) {
  const navItems: { label: string; view: View }[] = [
    { label: "Analyzer", view: "analyzer" },
    { label: "History", view: "history" },
    { label: "Docs", view: "docs" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-6">
        <button
          onClick={() => onChangeView("analyzer")}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <GitPullRequest className="h-3.5 w-3.5 text-primary-foreground" />
          </div>

          <span
            className="text-foreground"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "-0.01em",
            }}
          >
            PRAnalyzer
          </span>

          <Badge
            className="ml-1 h-4 px-1.5 text-[10px] font-medium"
            style={{
              backgroundColor: "rgba(99,102,241,0.15)",
              color: "#818cf8",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: "4px",
            }}
          >
            AI
          </Badge>
        </button>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeView === item.view;

            return (
              <button
                key={item.view}
                onClick={() => onChangeView(item.view)}
                className="rounded-md px-3 py-1.5 transition-colors hover:bg-secondary"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  color: isActive
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                  fontWeight: isActive ? 600 : 400,
                  backgroundColor: isActive
                    ? "var(--secondary)"
                    : "transparent",
                }}
              >
                {item.label}
              </button>
            );
          })}

          <button
            onClick={() => window.open("https://github.com", "_blank")}
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-secondary"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: "var(--muted-foreground)",
              fontWeight: 400,
            }}
          >
            GitHub
          </button>

          <div className="ml-2 flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1.5">
            <Zap className="h-3 w-3" style={{ color: "#f59e0b" }} />
            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "11px",
                color: "var(--muted-foreground)",
                fontWeight: 500,
              }}
            >
              v1.0
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}