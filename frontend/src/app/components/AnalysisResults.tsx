import {
  FileText,
  GitMerge,
  AlertTriangle,
  FlaskConical,
  CheckSquare,
  Zap,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import { ResultCard } from "./ResultCard";

export interface AnalysisData {
  summary: string;
  mainChanges: { file: string; description: string; additions: number; deletions: number }[];
  risks: { level: "high" | "medium" | "low"; title: string; description: string }[];
  suggestedTests: { category: string; test: string }[];
  checklist: { item: string; passed: boolean }[];
  impactLevel: "critical" | "high" | "medium" | "low";
  impactReason: string;
  stats: { files: number; additions: number; deletions: number; commits: number };
}

interface AnalysisResultsProps {
  data: AnalysisData;
}

const riskColors = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
};

const impactConfig = {
  critical: { color: "#ef4444", bg: "#ef444415", label: "CRITICAL" },
  high: { color: "#f97316", bg: "#f9731615", label: "HIGH" },
  medium: { color: "#f59e0b", bg: "#f59e0b15", label: "MEDIUM" },
  low: { color: "#10b981", bg: "#10b98115", label: "LOW" },
};

export function AnalysisResults({ data }: AnalysisResultsProps) {
  const impact = impactConfig[data.impactLevel];

  return (
    <div className="flex flex-col gap-3">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Files Changed", value: data.stats.files },
          { label: "Additions", value: `+${data.stats.additions}`, color: "#10b981" },
          { label: "Deletions", value: `-${data.stats.deletions}`, color: "#ef4444" },
          { label: "Commits", value: data.stats.commits },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card px-4 py-3"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
          >
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "18px",
                fontWeight: 500,
                color: stat.color ?? "var(--foreground)",
                lineHeight: 1.2,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "var(--muted-foreground)", marginTop: "3px" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <ResultCard icon={FileText} title="Summary" tag="AI-generated" tagColor="#6366f1">
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: "1.65", color: "var(--foreground)", opacity: 0.85 }}>
          {data.summary}
        </p>
      </ResultCard>

      {/* Main Changes */}
      <ResultCard icon={GitMerge} title="Main Changes" tagColor="#22d3ee">
        <div className="flex flex-col gap-2">
          {data.mainChanges.map((change, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary"
              style={{ border: "1px solid var(--border)" }}
            >
              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#22d3ee" }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="truncate"
                    style={{ fontFamily: "'Geist Mono', monospace", fontSize: "11px", color: "#22d3ee", fontWeight: 500 }}
                  >
                    {change.file}
                  </span>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", color: "#10b981" }}>
                    +{change.additions}
                  </span>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", color: "#ef4444" }}>
                    -{change.deletions}
                  </span>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px" }}>
                  {change.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ResultCard>

      {/* Risks */}
      <ResultCard icon={AlertTriangle} title="Risks" tagColor="#ef4444">
        <div className="flex flex-col gap-2">
          {data.risks.map((risk, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5"
              style={{ border: `1px solid ${riskColors[risk.level]}20`, backgroundColor: `${riskColors[risk.level]}08` }}
            >
              <div
                className="mt-0.5 rounded px-1.5 py-0.5 shrink-0"
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: riskColors[risk.level],
                  backgroundColor: `${riskColors[risk.level]}20`,
                  border: `1px solid ${riskColors[risk.level]}30`,
                }}
              >
                {risk.level}
              </div>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 500, color: "var(--foreground)" }}>
                  {risk.title}
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px" }}>
                  {risk.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ResultCard>

      {/* Suggested Tests */}
      <ResultCard icon={FlaskConical} title="Suggested Tests" tag="recommendations" tagColor="#a78bfa">
        <div className="flex flex-col gap-1.5">
          {data.suggestedTests.map((t, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div
                className="mt-0.5 shrink-0 rounded px-1.5 py-0.5"
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "9px",
                  fontWeight: 500,
                  color: "#a78bfa",
                  backgroundColor: "#a78bfa15",
                  border: "1px solid #a78bfa25",
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {t.category}
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--foreground)", opacity: 0.85, lineHeight: "1.5" }}>
                {t.test}
              </span>
            </div>
          ))}
        </div>
      </ResultCard>

      {/* Review Checklist */}
      <ResultCard icon={CheckSquare} title="Review Checklist" tagColor="#10b981">
        <div className="grid grid-cols-2 gap-1.5">
          {data.checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded"
                style={{
                  backgroundColor: item.passed ? "#10b98120" : "#ef444415",
                  border: `1px solid ${item.passed ? "#10b98140" : "#ef444430"}`,
                }}
              >
                {item.passed ? (
                  <Check className="h-2.5 w-2.5" style={{ color: "#10b981" }} />
                ) : (
                  <X className="h-2.5 w-2.5" style={{ color: "#ef4444" }} />
                )}
              </div>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  color: item.passed ? "var(--foreground)" : "var(--muted-foreground)",
                  opacity: item.passed ? 0.85 : 0.6,
                }}
              >
                {item.item}
              </span>
            </div>
          ))}
        </div>
      </ResultCard>

      {/* Impact Level */}
      <ResultCard icon={Zap} title="Impact Level" tagColor={impact.color}>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2.5 rounded-lg px-4 py-3"
            style={{ backgroundColor: impact.bg, border: `1px solid ${impact.color}25` }}
          >
            <Zap className="h-5 w-5" style={{ color: impact.color }} />
            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "20px",
                fontWeight: 600,
                color: impact.color,
                letterSpacing: "-0.01em",
              }}
            >
              {impact.label}
            </span>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "var(--muted-foreground)", lineHeight: "1.6", flex: 1 }}>
            {data.impactReason}
          </p>
        </div>
      </ResultCard>
    </div>
  );
}
