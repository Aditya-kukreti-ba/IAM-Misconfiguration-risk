import { useState } from "react";
import { theme, RISK_META, CLOUD_META } from "../../styles/theme";
import ZeroTrustPanel from "./ZeroTrustPanel";

// ─── RISK SCORE CIRCLE ─────────────────────────────────────────────────────────
function RiskCircle({ score, label }) {
  const rm = RISK_META[label];
  const r = 42, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 16px" }}>
      <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#F3F4F6" strokeWidth="7" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={rm.color} strokeWidth="7"
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 24, fontWeight: 700, color: rm.color }}>{score}</span>
        <span style={{ fontSize: 10, color: theme.text.muted }}>/ 100</span>
      </div>
    </div>
  );
}

// ─── FEATURE FLAGS ─────────────────────────────────────────────────────────────
const FEATURE_LABELS = {
  has_wildcard_permission:    "Wildcard Permission (*)",
  public_access_enabled:      "Public Access Enabled",
  admin_privileges:           "Admin Privileges",
  cross_account_access:       "Cross-Account Access",
  unused_high_privilege_role: "Unused High Privilege",
  ai_model_full_access:       "AI Model Full Access",
};

// ─── AI OUTPUT ─────────────────────────────────────────────────────────────────
function Section({ title, color = theme.text.primary, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 16 }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${theme.border}`, borderTopColor: theme.accent.teal, borderRadius: "50%" }} className="spin" />
      <span style={{ fontSize: 13, color: theme.text.secondary }}>Analyzing IAM configuration with AI...</span>
    </div>
  );
}

export default function AnalysisTab({ selectedRole, llmResult, llmLoading, onReanalyze }) {
  const [policyOpen, setPolicyOpen] = useState(false);

  if (!selectedRole) {
    return (
      <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 12 }}>
        <div style={{ fontSize: 40 }}>🔍</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: theme.text.primary }}>No role selected</div>
        <div style={{ fontSize: 13, color: theme.text.secondary }}>Go to Roles and click "Analyze" on any role to get started.</div>
      </div>
    );
  }

  const cm = CLOUD_META[selectedRole.cloud];
  const rm = RISK_META[selectedRole.risk.label];

  return (
    <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>

      {/* ── LEFT PANEL (30%) ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Role identity */}
        <div style={{ background: theme.bg.card, border: `1px solid ${theme.border}`, borderRadius: theme.radius.md, padding: 20, boxShadow: theme.shadowMd, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ color: cm.color }}>{cm.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: cm.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{selectedRole.cloud} · {selectedRole.service}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.text.primary, marginBottom: 16, wordBreak: "break-all" }}>{selectedRole.role}</div>
          <RiskCircle score={selectedRole.risk.score} label={selectedRole.risk.label} />
          <span style={{ display: "inline-block", padding: "3px 14px", borderRadius: 20, background: rm.bg, border: `1px solid ${rm.border}`, color: rm.color, fontSize: 12, fontWeight: 600 }}>
            {selectedRole.risk.label} Risk
          </span>
        </div>

        {/* Metadata */}
        <div style={{ background: theme.bg.card, border: `1px solid ${theme.border}`, borderRadius: theme.radius.md, padding: 16, boxShadow: theme.shadowMd }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.text.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>Metadata</div>
          {[
            ["Last Used",   selectedRole.lastUsed],
            ["Policies",    selectedRole.attachedPolicies.join(", ")],
            ["Trust",       selectedRole.trustedEntities.join(", ")],
          ].map(([k, v]) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: theme.text.muted, marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 12, color: theme.text.primary, fontWeight: 500, wordBreak: "break-all" }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Feature Flags */}
        <div style={{ background: theme.bg.card, border: `1px solid ${theme.border}`, borderRadius: theme.radius.md, padding: 16, boxShadow: theme.shadowMd }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.text.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>Policy Flags</div>
          {Object.entries(selectedRole.features).map(([key, val]) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: val ? theme.text.primary : theme.text.muted, fontWeight: val ? 500 : 400 }}>{FEATURE_LABELS[key]}</span>
              <span style={{
                fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 10,
                background: val ? "#FEE2E2" : "#F3F4F6",
                color: val ? "#EF4444" : theme.text.muted,
              }}>{val ? "ON" : "off"}</span>
            </div>
          ))}
        </div>

        {/* Policy JSON collapsible */}
        <div style={{ background: theme.bg.card, border: `1px solid ${theme.border}`, borderRadius: theme.radius.md, overflow: "hidden", boxShadow: theme.shadowMd }}>
          <button onClick={() => setPolicyOpen(o => !o)} style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "transparent", cursor: "pointer" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: theme.text.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>Policy JSON</span>
            <span style={{ color: theme.text.muted, transition: "transform 0.15s", display: "inline-block", transform: policyOpen ? "rotate(90deg)" : "none" }}>›</span>
          </button>
          {policyOpen && (
            <pre style={{ margin: 0, padding: "0 16px 14px", fontFamily: "'Menlo','Monaco',monospace", fontSize: 11, color: "#374151", background: "#F9FAFB", lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {JSON.stringify(JSON.parse(selectedRole.policy), null, 2)}
            </pre>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL (70%) ── */}
      <div style={{ background: theme.bg.card, border: `1px solid ${theme.border}`, borderRadius: theme.radius.md, padding: 24, boxShadow: theme.shadowMd }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${theme.borderLight}` }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text.primary }}>AI Security Analysis</div>
            <div style={{ fontSize: 12, color: theme.text.secondary, marginTop: 2 }}>Powered by Groq AI — {selectedRole.role}</div>
          </div>
          <button onClick={onReanalyze} style={{
            padding: "6px 14px", borderRadius: 8,
            border: `1px solid ${theme.border}`,
            color: theme.text.secondary, fontSize: 12, fontWeight: 500,
            background: theme.bg.page,
          }}>↺ Re-analyze</button>
        </div>

        {llmLoading && <LoadingSpinner />}

        {!llmLoading && llmResult?.error && (
          <div style={{ padding: 20, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: theme.radius.md }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#991B1B", marginBottom: 4 }}>⚠ Analysis Error</div>
            <div style={{ fontSize: 12, color: "#B91C1C" }}>{llmResult.error}</div>
            {llmResult.detail && <div style={{ fontSize: 11, color: "#6B7280", marginTop: 6 }}>{llmResult.detail}</div>}
          </div>
        )}

        {!llmLoading && llmResult && !llmResult.error && (
          <div className="fade-in">
            {/* Verdict */}
            <div style={{ padding: 16, background: rm.bg, border: `1px solid ${rm.border}`, borderRadius: theme.radius.md, marginBottom: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontSize: 24 }}>{llmResult.verdict === "Critical" ? "🔴" : llmResult.verdict === "Medium" ? "🟡" : "🟢"}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: rm.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Verdict: {llmResult.verdict}</div>
                <div style={{ fontSize: 13, color: theme.text.primary, lineHeight: 1.6 }}>{llmResult.summary}</div>
              </div>
            </div>

            {/* Zero Trust Score — computed deterministically, not by AI */}
            <ZeroTrustPanel role={selectedRole} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              {/* Attack Vectors */}
              {llmResult.attack_vectors?.length > 0 && (
                <div style={{ padding: 16, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: theme.radius.md }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#991B1B", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>⚡ Attack Vectors</div>
                  {llmResult.attack_vectors.map((v, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#7F1D1D", marginBottom: 6, paddingLeft: 10, borderLeft: "2px solid #FCA5A5", lineHeight: 1.5 }}>→ {v}</div>
                  ))}
                </div>
              )}

              {/* Remediation */}
              {llmResult.remediation?.length > 0 && (
                <div style={{ padding: 16, background: "#F0FDF4", border: "1px solid #A7F3D0", borderRadius: theme.radius.md }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#065F46", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>✓ Remediation Steps</div>
                  {llmResult.remediation.map((s, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#064E3B", marginBottom: 6, paddingLeft: 10, borderLeft: "2px solid #6EE7B7", lineHeight: 1.5 }}>{i + 1}. {s}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Findings */}
            {llmResult.findings?.length > 0 && (
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: theme.radius.md, overflow: "hidden", marginBottom: 14 }}>
                <div style={{ padding: "12px 16px", background: "#F9FAFB", borderBottom: `1px solid ${theme.border}`, fontSize: 11, fontWeight: 700, color: theme.text.secondary, letterSpacing: "0.06em", textTransform: "uppercase" }}>🔍 Detailed Findings</div>
                {llmResult.findings.map((f, i) => {
                  const sev = f.severity === "High" ? "Critical" : f.severity;
                  const srm = RISK_META[sev] || { color: "#6B7280", bg: "#F3F4F6", border: "#E5E7EB" };
                  return (
                    <div key={i} style={{ padding: "14px 16px", borderBottom: i < llmResult.findings.length - 1 ? `1px solid ${theme.borderLight}` : "none", display: "flex", gap: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", background: srm.bg, color: srm.color, border: `1px solid ${srm.border}`, borderRadius: 20, whiteSpace: "nowrap", alignSelf: "flex-start", marginTop: 1 }}>{f.severity}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: theme.text.primary, marginBottom: 3 }}>{f.issue}</div>
                        <div style={{ fontSize: 12, color: theme.text.secondary, lineHeight: 1.6 }}>{f.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Blast Radius */}
            {llmResult.blast_radius && (
              <div style={{ padding: 16, background: "#FAF5FF", border: "1px solid #DDD6FE", borderRadius: theme.radius.md }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6D28D9", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>💥 Blast Radius</div>
                <div style={{ fontSize: 13, color: "#4C1D95", lineHeight: 1.7 }}>{llmResult.blast_radius}</div>
              </div>
            )}
          </div>
        )}

        {!llmLoading && !llmResult && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
            <div style={{ fontSize: 13, color: theme.text.secondary }}>Click "Re-analyze" to run the AI security scan on this role.</div>
          </div>
        )}
      </div>
    </div>
  );
}
