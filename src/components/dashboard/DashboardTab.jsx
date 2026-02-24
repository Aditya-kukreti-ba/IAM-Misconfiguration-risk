import StatCards     from "./StatCards";
import RiskCharts    from "./RiskCharts";
import TopRiskyRoles from "./TopRiskyRoles";
import { theme }     from "../../styles/theme";

export default function DashboardTab({ allRoles, viewMode, onRoleClick }) {
  return (
    <div className="fade-in">
      <StatCards allRoles={allRoles} />
      {viewMode === "executive"
        ? <ExecutiveView allRoles={allRoles} onRoleClick={onRoleClick} />
        : <TechnicalView allRoles={allRoles} onRoleClick={onRoleClick} />
      }
    </div>
  );
}

function ExecutiveView({ allRoles, onRoleClick }) {
  return (
    <>
      <RiskCharts allRoles={allRoles} />
      <TopRiskyRoles allRoles={allRoles} onRoleClick={onRoleClick} />
    </>
  );
}

function TechnicalView({ allRoles, onRoleClick }) {
  const FEATURE_LABELS = {
    has_wildcard_permission:    "Wildcard *",
    public_access_enabled:      "Public Access",
    admin_privileges:           "Admin Priv",
    cross_account_access:       "Cross-Account",
    unused_high_privilege_role: "Unused High Priv",
    ai_model_full_access:       "AI Full Access",
  };

  const FEATURE_COLORS = {
    has_wildcard_permission:    "#EF4444",
    public_access_enabled:      "#F97316",
    admin_privileges:           "#F59E0B",
    cross_account_access:       "#8B5CF6",
    unused_high_privilege_role: "#3B82F6",
    ai_model_full_access:       "#06B6D4",
  };

  const featureKeys = Object.keys(FEATURE_LABELS);

  return (
    <>
      <RiskCharts allRoles={allRoles} />

      {/* Heatmap */}
      <div style={{ background: theme.bg.card, border: `1px solid ${theme.border}`, borderRadius: theme.radius.md, padding: 20, boxShadow: theme.shadowMd, marginBottom: 24, overflow: "auto" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: theme.text.primary, marginBottom: 4 }}>Misconfiguration Heatmap</div>
        <div style={{ fontSize: 12, color: theme.text.secondary, marginBottom: 16 }}>Feature flags across all roles — click a row to analyze</div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: theme.text.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Role</th>
              {featureKeys.map(f => (
                <th key={f} style={{ padding: "8px 8px", fontSize: 10, fontWeight: 600, color: theme.text.muted, textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "center", whiteSpace: "nowrap" }}>
                  {FEATURE_LABELS[f].split(" ")[0]}
                </th>
              ))}
              <th style={{ textAlign: "right", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: theme.text.muted, textTransform: "uppercase" }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {allRoles.map(role => (
              <tr key={role.id} onClick={() => onRoleClick(role)} style={{ cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = theme.bg.hover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 12px", fontSize: 12, fontWeight: 500, color: theme.text.primary, borderBottom: `1px solid ${theme.borderLight}`, whiteSpace: "nowrap" }}>
                  {role.role}
                </td>
                {featureKeys.map(f => (
                  <td key={f} style={{ padding: "10px 8px", textAlign: "center", borderBottom: `1px solid ${theme.borderLight}` }}>
                    {role.features[f]
                      ? <span style={{ display: "inline-block", width: 18, height: 18, borderRadius: 4, background: FEATURE_COLORS[f], opacity: 0.85 }} />
                      : <span style={{ display: "inline-block", width: 18, height: 18, borderRadius: 4, background: "#F3F4F6" }} />
                    }
                  </td>
                ))}
                <td style={{ padding: "10px 12px", textAlign: "right", borderBottom: `1px solid ${theme.borderLight}` }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: role.risk.label === "Critical" ? "#EF4444" : role.risk.label === "Medium" ? "#F59E0B" : "#10B981" }}>{role.risk.score}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${theme.borderLight}` }}>
          {featureKeys.map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: FEATURE_COLORS[f] }} />
              <span style={{ fontSize: 11, color: theme.text.secondary }}>{FEATURE_LABELS[f]}</span>
            </div>
          ))}
        </div>
      </div>

      <TopRiskyRoles allRoles={allRoles} onRoleClick={onRoleClick} />
    </>
  );
}
