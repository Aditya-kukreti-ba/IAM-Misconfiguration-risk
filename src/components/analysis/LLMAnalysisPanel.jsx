import { RISK_META } from "../../constants/config";

// ─── LLM ANALYSIS PANEL ────────────────────────────────────────────────────────
// Right column in the Analysis tab.
// Renders the structured JSON response from Claude as a visual security report.

function LoadingState() {
  return (
    <div style={{ padding: "40px 0", textAlign: "center" }}>
      <div className="blink" style={{ fontFamily: "'Share Tech Mono'", fontSize: 12, color: "#00FFB2", marginBottom: 16 }}>
        ANALYZING IAM CONFIGURATION...
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: 20,
              background: "#00FFB2",
              borderRadius: 2,
              animation: `blink 1s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ error }) {
  return (
    <div
      style={{
        padding: 20,
        background: "rgba(255,61,61,0.08)",
        border: "1px solid rgba(255,61,61,0.2)",
        borderRadius: 10,
        fontFamily: "'Share Tech Mono'",
        fontSize: 12,
        color: "#FF6B6B",
      }}
    >
      ⚠ {error.error}
      <br />
      <span style={{ color: "#4A6070", fontSize: 10 }}>{error.detail}</span>
    </div>
  );
}

function AnalysisResult({ result }) {
  const rm = RISK_META[result.verdict] || RISK_META.Low;
  const verdictEmoji = result.verdict === "Critical" ? "🔴" : result.verdict === "Medium" ? "🟡" : "🟢";

  const ztColor =
    result.zero_trust_score < 40 ? "#FF3D3D"
    : result.zero_trust_score < 70 ? "#FFB300"
    : "#00E676";

  const ztGradient =
    result.zero_trust_score < 40 ? "linear-gradient(90deg,#FF3D3D,#FF6B00)"
    : result.zero_trust_score < 70 ? "linear-gradient(90deg,#FFB300,#FFD700)"
    : "linear-gradient(90deg,#00E676,#00BFFF)";

  return (
    <div className="fade-up">
      {/* Verdict Banner */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          padding: 16,
          background: rm.bg,
          border: `1px solid ${rm.color}33`,
          borderRadius: 10,
        }}
      >
        <div style={{ fontSize: 28 }}>{verdictEmoji}</div>
        <div>
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 13, color: rm.color, marginBottom: 4 }}>
            VERDICT: {result.verdict?.toUpperCase()}
          </div>
          <div style={{ fontSize: 13, color: "#B0C0D0", lineHeight: 1.5 }}>{result.summary}</div>
        </div>
      </div>

      {/* Zero Trust Score */}
      {result.zero_trust_score !== undefined && (
        <div
          style={{
            marginBottom: 16,
            padding: 14,
            background: "rgba(255,255,255,0.03)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: "#4A7080", letterSpacing: "0.1em", marginBottom: 2 }}>
              ZERO TRUST SCORE
            </div>
            <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 28, color: ztColor }}>
              {result.zero_trust_score}
              <span style={{ fontSize: 14, opacity: 0.5 }}>/100</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${result.zero_trust_score}%`, background: ztGradient, borderRadius: 4 }} />
            </div>
          </div>
        </div>
      )}

      {/* Attack Vectors + Remediation (2-col) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        {result.attack_vectors?.length > 0 && (
          <div
            style={{
              background: "rgba(255,61,61,0.06)",
              border: "1px solid rgba(255,61,61,0.15)",
              borderRadius: 10,
              padding: 14,
            }}
          >
            <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 10, color: "#FF3D3D", marginBottom: 10, letterSpacing: "0.1em" }}>
              ⚡ ATTACK VECTORS
            </div>
            {result.attack_vectors.map((v, i) => (
              <div key={i} style={{ fontSize: 12, color: "#C0D0E0", marginBottom: 6, paddingLeft: 10, borderLeft: "2px solid #FF3D3D44" }}>
                → {v}
              </div>
            ))}
          </div>
        )}

        {result.remediation?.length > 0 && (
          <div
            style={{
              background: "rgba(0,230,118,0.05)",
              border: "1px solid rgba(0,230,118,0.15)",
              borderRadius: 10,
              padding: 14,
            }}
          >
            <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 10, color: "#00E676", marginBottom: 10, letterSpacing: "0.1em" }}>
              ✓ REMEDIATION STEPS
            </div>
            {result.remediation.map((step, i) => (
              <div key={i} style={{ fontSize: 12, color: "#C0D0E0", marginBottom: 6, paddingLeft: 10, borderLeft: "2px solid #00E67644" }}>
                {i + 1}. {step}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Findings */}
      {result.findings?.length > 0 && (
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10,
            padding: 14,
            marginBottom: 12,
          }}
        >
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 10, color: "#00BFFF", marginBottom: 10, letterSpacing: "0.1em" }}>
            🔍 DETAILED FINDINGS
          </div>
          {result.findings.map((f, i) => {
            const normalizedSeverity = f.severity === "High" ? "Critical" : f.severity;
            const fm = RISK_META[normalizedSeverity] || { bg: "rgba(255,255,255,0.05)", color: "#888" };
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 10,
                  paddingBottom: 10,
                  borderBottom: i < result.findings.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Share Tech Mono'",
                    fontSize: 9,
                    padding: "2px 7px",
                    background: fm.bg,
                    color: fm.color,
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                    alignSelf: "flex-start",
                    marginTop: 2,
                  }}
                >
                  {f.severity}
                </span>
                <div>
                  <div style={{ fontSize: 12, color: "#D0E0F0", fontWeight: 600, marginBottom: 2 }}>{f.issue}</div>
                  <div style={{ fontSize: 11, color: "#7A9BAB", lineHeight: 1.5 }}>{f.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Blast Radius */}
      {result.blast_radius && (
        <div
          style={{
            background: "rgba(200,0,255,0.06)",
            border: "1px solid rgba(200,0,255,0.2)",
            borderRadius: 10,
            padding: 14,
          }}
        >
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 10, color: "#C800FF", marginBottom: 8, letterSpacing: "0.1em" }}>
            💥 BLAST RADIUS
          </div>
          <div style={{ fontSize: 12, color: "#C0D0E0", lineHeight: 1.6 }}>{result.blast_radius}</div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function LLMAnalysisPanel({ role, result, loading, onReanalyze }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(0,255,178,0.12)",
        borderRadius: 12,
        padding: 24,
      }}
    >
      {/* Panel header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div className="shimmer-text" style={{ fontFamily: "'Share Tech Mono'", fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
            AI SECURITY ANALYSIS
          </div>
          <div style={{ fontSize: 11, color: "#4A7080" }}>Powered by Claude — {role.role}</div>
        </div>
        <button
          onClick={onReanalyze}
          style={{
            padding: "6px 14px",
            background: "rgba(0,255,178,0.1)",
            border: "1px solid #00FFB2",
            borderRadius: 6,
            color: "#00FFB2",
            fontFamily: "'Share Tech Mono'",
            fontSize: 10,
            cursor: "pointer",
          }}
        >
          ↺ RE-ANALYZE
        </button>
      </div>

      {/* States */}
      {loading && <LoadingState />}
      {!loading && result?.error && <ErrorState error={result} />}
      {!loading && result && !result.error && <AnalysisResult result={result} />}
      {!loading && !result && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 12, color: "#4A7080" }}>
            Analysis queued for: {role.role}
          </div>
        </div>
      )}
    </div>
  );
}
