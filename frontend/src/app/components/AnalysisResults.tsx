import { useState } from "react";

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
  ExternalLink,
  User,
  Calendar,
} from "lucide-react";

import { ResultCard } from "./ResultCard";

export interface AnalysisData {
  prUrl?: string;
  repository?: string;
  prNumber?: number;
  prTitle?: string;
  prAuthor?: string;
  createdAt?: string;

  summary: string;

  mainChanges: {
    file: string;
    description: string;
    additions: number;
    deletions: number;
    patch?: string;
  }[];

  risks: {
    level: "high" | "medium" | "low";
    title: string;
    description: string;
  }[];

  suggestedTests: {
    category: string;
    test: string;
  }[];

  checklist: {
    item: string;
    passed: boolean;
  }[];

  impactLevel: "critical" | "high" | "medium" | "low";
  impactReason: string;

  stats: {
    files: number;
    additions: number;
    deletions: number;
    commits: number;
  };
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
  critical: {
    color: "#ef4444",
    bg: "#ef444415",
    label: "CRITICAL",
  },
  high: {
    color: "#f97316",
    bg: "#f9731615",
    label: "HIGH",
  },
  medium: {
    color: "#f59e0b",
    bg: "#f59e0b15",
    label: "MEDIUM",
  },
  low: {
    color: "#10b981",
    bg: "#10b98115",
    label: "LOW",
  },
};

function formatDate(value?: string) {
  if (!value) return "Not available";

  return new Date(value).toLocaleString();
}

export function AnalysisResults({
  data,
}: AnalysisResultsProps) {
  const impact = impactConfig[data.impactLevel];

  const [openDiffs, setOpenDiffs] = useState<
    Record<number, boolean>
  >({});

  function toggleDiff(index: number) {
    setOpenDiffs((current) => ({
      ...current,
      [index]: !current[index],
    }));
  }

  return (
    <div className="flex flex-col gap-3">
      {/* PR Metadata */}
      <div
        className="rounded-xl border border-border bg-card p-5"
        style={{
          boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--foreground)",
                lineHeight: "1.4",
              }}
            >
              {data.prTitle || "Pull Request Analysis"}
            </h2>

            <p
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "11px",
                color: "var(--muted-foreground)",
                marginTop: "5px",
              }}
            >
              {data.repository || "unknown/repository"} #
              {data.prNumber || "-"}
            </p>
          </div>

          <div
            className="shrink-0 rounded-md px-2.5 py-1"
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: impact.color,
              backgroundColor: impact.bg,
              border: `1px solid ${impact.color}25`,
            }}
          >
            {impact.label}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-lg border border-border px-3 py-2"
            style={{
              backgroundColor: "var(--secondary)",
            }}
          >
            <div className="mb-1 flex items-center gap-1.5">
              <User
                className="h-3 w-3"
                style={{ color: "#818cf8" }}
              />

              <p
                style={{
                  fontSize: "11px",
                  color: "var(--muted-foreground)",
                }}
              >
                Author
              </p>
            </div>

            <p
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
            >
              {data.prAuthor || "Unknown"}
            </p>
          </div>

          <div
            className="rounded-lg border border-border px-3 py-2"
            style={{
              backgroundColor: "var(--secondary)",
            }}
          >
            <div className="mb-1 flex items-center gap-1.5">
              <Calendar
                className="h-3 w-3"
                style={{ color: "#818cf8" }}
              />

              <p
                style={{
                  fontSize: "11px",
                  color: "var(--muted-foreground)",
                }}
              >
                Saved at
              </p>
            </div>

            <p
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
            >
              {formatDate(data.createdAt)}
            </p>
          </div>

          <div
            className="col-span-2 rounded-lg border border-border px-3 py-2"
            style={{
              backgroundColor: "var(--secondary)",
            }}
          >
            <div className="mb-1 flex items-center gap-1.5">
              <ExternalLink
                className="h-3 w-3"
                style={{ color: "#818cf8" }}
              />

              <p
                style={{
                  fontSize: "11px",
                  color: "var(--muted-foreground)",
                }}
              >
                Pull Request URL
              </p>
            </div>

            <a
              href={data.prUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "12px",
                color: "#818cf8",
                wordBreak: "break-all",
              }}
            >
              {data.prUrl || "Not available"}
            </a>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "Files Changed",
            value: data.stats.files,
          },
          {
            label: "Additions",
            value: `+${data.stats.additions}`,
            color: "#10b981",
          },
          {
            label: "Deletions",
            value: `-${data.stats.deletions}`,
            color: "#ef4444",
          },
          {
            label: "Commits",
            value: data.stats.commits,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card px-4 py-3"
            style={{
              boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
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

            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                color: "var(--muted-foreground)",
                marginTop: "3px",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <ResultCard
        icon={FileText}
        title="Summary"
        tag="AI-generated"
        tagColor="#6366f1"
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            lineHeight: "1.65",
            color: "var(--foreground)",
            opacity: 0.85,
          }}
        >
          {data.summary}
        </p>
      </ResultCard>

      {/* Main Changes */}
      <ResultCard
        icon={GitMerge}
        title="Main Changes"
        tagColor="#22d3ee"
      >
        <div className="flex flex-col gap-2">
          {data.mainChanges.map((change, i) => (
            <div
              key={i}
              onClick={() =>
                change.patch && toggleDiff(i)
              }
              className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary"
              style={{
                border: "1px solid var(--border)",
              }}
            >
              <ChevronRight
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                style={{
                  color: "#22d3ee",
                }}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="truncate"
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "11px",
                      color: "#22d3ee",
                      fontWeight: 500,
                    }}
                  >
                    {change.file}
                  </span>

                  <span
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "10px",
                      color: "#10b981",
                    }}
                  >
                    +{change.additions}
                  </span>

                  <span
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "10px",
                      color: "#ef4444",
                    }}
                  >
                    -{change.deletions}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                    marginTop: "2px",
                  }}
                >
                  {change.description}
                </p>

                {change.patch &&
                  openDiffs[i] && (
                    <div
                      className="mt-3 max-h-64 overflow-auto rounded-md border border-border"
                      style={{
                        backgroundColor:
                          "rgba(0,0,0,0.25)",
                      }}
                    >
                      {change.patch
                        .slice(0, 2000)
                        .split("\n")
                        .map((line, lineIndex) => {
                          let background =
                            "transparent";

                          let color =
                            "var(--muted-foreground)";

                          if (line.startsWith("+")) {
                            background =
                              "rgba(16,185,129,0.12)";
                            color = "#34d399";
                          } else if (
                            line.startsWith("-")
                          ) {
                            background =
                              "rgba(239,68,68,0.12)";
                            color = "#f87171";
                          } else if (
                            line.startsWith("@@")
                          ) {
                            background =
                              "rgba(99,102,241,0.12)";
                            color = "#818cf8";
                          }

                          return (
                            <div
                              key={lineIndex}
                              style={{
                                fontFamily:
                                  "'Geist Mono', monospace",
                                fontSize: "11px",
                                lineHeight: "1.6",
                                whiteSpace:
                                  "pre-wrap",
                                padding: "2px 12px",
                                backgroundColor:
                                  background,
                                color,
                              }}
                            >
                              {line || " "}
                            </div>
                          );
                        })}
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </ResultCard>

      {/* Risks */}
      <ResultCard
        icon={AlertTriangle}
        title="Risks"
        tagColor="#ef4444"
      >
        <div className="flex flex-col gap-2">
          {data.risks.map((risk, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5"
              style={{
                border: `1px solid ${riskColors[risk.level]}20`,
                backgroundColor: `${riskColors[risk.level]}08`,
              }}
            >
              <div
                className="mt-0.5 shrink-0 rounded px-1.5 py-0.5"
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
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--foreground)",
                  }}
                >
                  {risk.title}
                </div>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                    marginTop: "2px",
                  }}
                >
                  {risk.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ResultCard>
    </div>
  );
}