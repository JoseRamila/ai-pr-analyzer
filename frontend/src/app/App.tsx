import { useState, useEffect } from "react";
import {
  GitPullRequest,
  Search,
  Loader2,
  Sparkles,
  ArrowRight,
  Command,
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { AnalysisResults, type AnalysisData } from "./components/AnalysisResults";

const EXAMPLE_PRS = [
  "https://github.com/fastapi/fastapi/pull/15613",
  "https://github.com/vercel/next.js/pull/72841",
  "https://github.com/facebook/react/pull/31074",
];

type State = "idle" | "loading" | "result" | "error";

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const [prUrl, setPrUrl] = useState("");
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAnalyze() {
    if (!prUrl.trim()) return;

    setState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/analyses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pr_url: prUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Failed to analyze Pull Request"
        );
      }

      const data = await response.json();

      const mappedResult: AnalysisData = {
        summary: data.summary,
        mainChanges: data.changed_files.map((file: any) => ({
          file: file.filename,
          description: file.status,
          additions: file.additions,
          deletions: file.deletions,
        })),
        risks: data.risks.map((risk: string) => ({
          level: data.impact_level,
          title: "Risk",
          description: risk,
        })),
        suggestedTests: data.suggested_tests.map((test: string) => ({
          category: "suggested",
          test,
        })),
        checklist: data.review_checklist.map((item: string) => ({
          item,
          passed: false,
        })),
        impactLevel: data.impact_level,
        impactReason: `Estimated impact level: ${data.impact_level}`,
        stats: {
          files: data.files_changed || 0,
          additions: data.additions || 0,
          deletions: data.deletions || 0,
          commits: data.commits || 0,
        },
      };

      setResult(mappedResult);
      setState("result");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while analyzing the Pull Request"
      );
      setState("error");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleAnalyze();
  }

  function handleReset() {
    setState("idle");
    setResult(null);
    setPrUrl("");
    setErrorMessage("");
  }

  const isValidUrl = prUrl.includes("github.com") && prUrl.includes("/pull/");

  return (
    <div
      className="min-h-screen bg-background"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-28">
        <div className="mb-8 text-center">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{
              backgroundColor: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <Sparkles className="h-3 w-3" style={{ color: "#818cf8" }} />
            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "11px",
                color: "#818cf8",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              AI-Powered Code Review
            </span>
          </div>

          <h1
            className="mb-2"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "28px",
              fontWeight: 600,
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
              lineHeight: "1.3",
            }}
          >
            Analyze any GitHub Pull Request
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: "var(--muted-foreground)",
              lineHeight: "1.6",
            }}
          >
            Instant AI analysis — summary, risk assessment, test suggestions,
            and review checklist.
          </p>
        </div>

        <div
          className="mb-8 overflow-hidden rounded-xl border border-border bg-card"
          style={{
            boxShadow:
              "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <GitPullRequest
                className="h-4 w-4"
                style={{ color: "#6366f1" }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--foreground)",
                }}
              >
                Pull Request URL
              </span>

              <div
                className="ml-auto flex items-center gap-1 rounded px-2 py-0.5"
                style={{
                  backgroundColor: "var(--secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <Command
                  className="h-2.5 w-2.5"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "10px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  Enter
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: "var(--muted-foreground)" }}
                />

                <input
                  type="text"
                  value={prUrl}
                  onChange={(e) => setPrUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://github.com/owner/repo/pull/123"
                  disabled={state === "loading"}
                  className="w-full rounded-lg py-2.5 pl-9 pr-4 outline-none transition-all disabled:opacity-50"
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "12.5px",
                    backgroundColor: "var(--secondary)",
                    border: `1px solid ${
                      isValidUrl
                        ? "rgba(99,102,241,0.4)"
                        : "var(--border)"
                    }`,
                    color: "var(--foreground)",
                    boxShadow: isValidUrl
                      ? "0 0 0 3px rgba(99,102,241,0.08)"
                      : "none",
                  }}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!isValidUrl || state === "loading"}
                className="flex items-center gap-2 rounded-lg px-5 py-2.5 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  backgroundColor:
                    isValidUrl && state !== "loading"
                      ? "#6366f1"
                      : "var(--secondary)",
                  color:
                    isValidUrl && state !== "loading"
                      ? "#ffffff"
                      : "var(--muted-foreground)",
                  border: "1px solid transparent",
                  fontSize: "13px",
                  fontWeight: 500,
                  boxShadow:
                    isValidUrl && state !== "loading"
                      ? "0 2px 12px rgba(99,102,241,0.35)"
                      : "none",
                  transition: "all 0.15s ease",
                }}
              >
                {state === "loading" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Analyzing</span>
                  </>
                ) : (
                  <>
                    <span>Analyze</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>

            {state === "idle" && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  Try an example:
                </span>

                {EXAMPLE_PRS.map((url) => {
                  const match = url.match(
                    /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
                  );
                  const label = match
                    ? `${match[1]}/${match[2]} #${match[3]}`
                    : url;

                  return (
                    <button
                      key={url}
                      onClick={() => setPrUrl(url)}
                      className="rounded-md px-2.5 py-1 transition-colors hover:bg-secondary"
                      style={{
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: "10.5px",
                        color: "#818cf8",
                        backgroundColor: "rgba(99,102,241,0.08)",
                        border: "1px solid rgba(99,102,241,0.18)",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {state === "loading" && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-5">
              <Loader2
                className="h-4 w-4 animate-spin"
                style={{ color: "#6366f1" }}
              />
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--muted-foreground)",
                }}
              >
                Fetching PR data from GitHub…
              </span>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
            <p style={{ color: "#fca5a5", fontSize: "13px" }}>
              {errorMessage}
            </p>
          </div>
        )}

        {state === "result" && result && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "11px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  Analysis complete
                </span>
              </div>

              <button
                onClick={handleReset}
                className="rounded-md px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
                style={{
                  color: "var(--muted-foreground)",
                  border: "1px solid var(--border)",
                  fontSize: "12px",
                }}
              >
                New analysis
              </button>
            </div>

            <AnalysisResults data={result} />
          </div>
        )}

        {state === "idle" && (
          <div className="flex flex-col items-center gap-6 py-12">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
            >
              <GitPullRequest
                className="h-7 w-7"
                style={{ color: "#6366f1" }}
              />
            </div>

            <div className="text-center">
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--foreground)",
                  marginBottom: "6px",
                }}
              >
                Paste a GitHub PR link to get started
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                }}
              >
                Works with public repositories. Analysis takes a few seconds.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}