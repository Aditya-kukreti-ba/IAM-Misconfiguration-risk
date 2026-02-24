import { theme, RISK_META, CLOUD_META } from "../../styles/theme";
import { useState } from "react"; 

const FEATURE_LABELS = {
  has_wildcard_permission:    { label: "Wildcard Permission (*)", weight: 40 },
  public_access_enabled:      { label: "Public Access Enabled",   weight: 30 },
  admin_privileges:           { label: "Admin Privileges",        weight: 20 },
  cross_account_access:       { label: "Cross-Account Access",    weight: 0  },
  unused_high_privilege_role: { label: "Unused High Privilege",   weight: 10 },
  ai_model_full_access:       { label: "AI Model Full Access",    weight: 0  },
};

function RiskScoreCircle({ score, label }) {
  const rm = RISK_META[label];
  const r = 36, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
      <div style={{ position: "relative", width: 88, height: 88 }}>
        <svg width="88" height="88" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="44" cy="44" r={r} fill="none" stroke="#F3F4F6" strokeWidth="6" />
          <circle cx="44" cy="44" r={r} fill="none" stroke={rm.color} strokeWidth="6"
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: rm.color }}>{score}</span>
          <span style={{ fontSize: 9, color: theme.text.muted, fontWeight: 500 }}>/ 100</span>
        </div>
      </div>
      <div>
        <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: 20, background: rm.bg, border: `1px solid ${rm.border}`, color: rm.color, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
          {label}
        </span>
        <div style={{ fontSize: 12, color: theme.text.secondary }}>Calculated risk score<br />based on policy flags</div>
      </div>
    </div>
  );
}

export default function RoleDrawer({ role, onClose, onAnalyze }) {
  if (!role) return null;
  const cm = CLOUD_META[role.cloud];
  const rm = RISK_META[role.risk.label];
  const activeFlags = Object.entries(role.features).filter(([, v]) => v);
  const inactiveFlags = Object.entries(role.features).filter(([, v]) => !v);

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 200 }} />

      {/* Drawer */}
      <div className="slide-in" style={{
        position: "fixed",
        top: 0, right: 0, bottom: 0,
        width: 440,
        background: "#FFFFFF",
        zIndex: 201,
        display: "flex",
        flexDirection: "column",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.1)",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 16, color: cm.color }}>{cm.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: cm.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{role.cloud} · {role.service}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text.primary }}>{role.role}</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 6, background: theme.bg.page, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: theme.text.secondary, cursor: "pointer" }}>×</button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {/* Risk score circle */}
          <RiskScoreCircle score={role.risk.score} label={role.risk.label} />

          {/* Metadata */}
          <div style={{ background: theme.bg.page, borderRadius: theme.radius.md, padding: 16, marginBottom: 16 }}>
            {[
              ["Last Used",        role.lastUsed],
              ["Attached Policies", role.attachedPolicies.join(", ")],
              ["Trusted Entities",  role.trustedEntities.join(", ")],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: theme.text.muted, minWidth: 130 }}>{k}</span>
                <span style={{ fontSize: 12, color: theme.text.primary, fontWeight: 500, wordBreak: "break-all" }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Feature Flags */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.text.primary, marginBottom: 10 }}>Policy Flags</div>
            {activeFlags.map(([key]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#991B1B" }}>{FEATURE_LABELS[key].label}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#EF4444", background: "#FEE2E2", padding: "2px 7px", borderRadius: 10 }}>ACTIVE</span>
              </div>
            ))}
            {inactiveFlags.map(([key]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: theme.bg.page, border: `1px solid ${theme.border}`, borderRadius: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: theme.text.secondary }}>{FEATURE_LABELS[key].label}</span>
                <span style={{ fontSize: 10, fontWeight: 500, color: theme.text.muted, background: "#F3F4F6", padding: "2px 7px", borderRadius: 10 }}>OFF</span>
              </div>
            ))}
          </div>

          {/* Policy JSON (collapsed) */}
          <PolicyJSON policy={role.policy} />
        </div>

        {/* Footer actions */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${theme.border}`, display: "flex", gap: 10 }}>
          <button onClick={() => onAnalyze(role)} style={{
            flex: 1,
            padding: "10px 0",
            background: theme.accent.teal,
            color: "#FFFFFF",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 1px 3px rgba(0,191,166,0.3)",
          }}>
            🤖 Run AI Analysis
          </button>
          <button onClick={onClose} style={{
            padding: "10px 16px",
            background: theme.bg.page,
            border: `1px solid ${theme.border}`,
            color: theme.text.secondary,
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
          }}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}

function PolicyJSON({ policy }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: theme.radius.md, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 16px", background: theme.bg.page, cursor: "pointer",
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: theme.text.primary }}>Policy JSON</span>
        <span style={{ fontSize: 13, color: theme.text.muted, display: "inline-block", transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</span>
      </button>
      {open && (
        <pre style={{ margin: 0, padding: "14px 16px", fontFamily: "'Menlo', 'Monaco', monospace", fontSize: 11, color: "#374151", background: "#F9FAFB", lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
          {JSON.stringify(JSON.parse(policy), null, 2)}
        </pre>
      )}
    </div>
  );
}
