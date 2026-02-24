import { RISK_META, FEATURE_LABELS } from "../../constants/config";

// ─── ROLE DETAIL PANEL ─────────────────────────────────────────────────────────
// Left column in the Analysis tab.
// Shows role metadata, all feature flags, and the raw IAM policy JSON.

export default function RoleDetailPanel({ role }) {
  const rm = RISK_META[role.risk.label];

  const metaRows = [
    ["Cloud",      role.cloud],
    ["Service",    role.service],
    ["Role",       role.role],
    ["Last Used",  role.lastUsed],
    ["Risk Score", `${role.risk.score}/100`],
    ["Risk Level", role.risk.label],
  ];

  return (
    <div>
      {/* Metadata table */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          padding: 18,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontFamily: "'Share Tech Mono'",
            fontSize: 11,
            color: "#00FFB2",
            marginBottom: 12,
            letterSpacing: "0.1em",
          }}
        >
          // ROLE DETAILS
        </div>

        {metaRows.map(([key, value]) => (
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
              paddingBottom: 8,
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <span style={{ fontSize: 11, color: "#4A7080" }}>{key}</span>
            <span
              style={{
                fontSize: 11,
                fontFamily: "'Share Tech Mono'",
                color: key === "Risk Level" ? rm.color : "#C0D0E0",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Feature flags */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          padding: 18,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontFamily: "'Share Tech Mono'",
            fontSize: 11,
            color: "#00FFB2",
            marginBottom: 12,
          }}
        >
          // FEATURE FLAGS
        </div>

        {Object.entries(role.features).map(([key, active]) => (
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 11, color: "#6A8090" }}>
              {FEATURE_LABELS[key].label}
            </span>
            <span
              style={{
                fontFamily: "'Share Tech Mono'",
                fontSize: 11,
                color: active ? "#FF3D3D" : "#00E676",
              }}
            >
              {active ? "TRUE" : "false"}
            </span>
          </div>
        ))}
      </div>

      {/* Raw policy JSON */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          padding: 18,
        }}
      >
        <div
          style={{
            fontFamily: "'Share Tech Mono'",
            fontSize: 11,
            color: "#00FFB2",
            marginBottom: 10,
          }}
        >
          // POLICY JSON
        </div>
        <pre
          style={{
            fontFamily: "'Share Tech Mono'",
            fontSize: 9,
            color: "#5A8090",
            lineHeight: 1.6,
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
            margin: 0,
          }}
        >
          {JSON.stringify(JSON.parse(role.policy), null, 2)}
        </pre>
      </div>
    </div>
  );
}
