import { theme, RISK_META, CLOUD_META } from "../../styles/theme";

function RiskBadge({ level }) {
  const rm = RISK_META[level];
  return (
    <span style={{
      padding: "2px 10px",
      borderRadius: 20,
      background: rm.bg,
      color: rm.color,
      border: `1px solid ${rm.border}`,
      fontSize: 11,
      fontWeight: 600,
    }}>
      {level}
    </span>
  );
}

export default function TopRiskyRoles({ allRoles, onRoleClick }) {
  const top5 = [...allRoles]
    .sort((a, b) => b.risk.score - a.risk.score)
    .slice(0, 5);

  const cols = ["Role", "Cloud", "Service", "Risk", "Last Used", "Score"];

  return (
    <div style={{
      background: theme.bg.card,
      border: `1px solid ${theme.border}`,
      borderRadius: theme.radius.md,
      boxShadow: theme.shadowMd,
      overflow: "hidden",
    }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text.primary }}>Top Risky Roles</div>
          <div style={{ fontSize: 12, color: theme.text.secondary, marginTop: 2 }}>Highest risk IAM configurations requiring attention</div>
        </div>
        <span style={{ fontSize: 11, color: theme.accent.teal, fontWeight: 500 }}>View all →</span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F9FAFB" }}>
            {cols.map(col => (
              <th key={col} style={{
                textAlign: "left",
                padding: "10px 20px",
                fontSize: 11,
                fontWeight: 600,
                color: theme.text.muted,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderBottom: `1px solid ${theme.border}`,
              }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {top5.map((role, i) => {
            const cm = CLOUD_META[role.cloud];
            const isStale = role.lastUsed === "Never" || role.lastUsed.includes("days");
            return (
              <tr key={role.id}
                onClick={() => onRoleClick(role)}
                style={{ cursor: "pointer", transition: "background 0.12s" }}
                onMouseEnter={e => e.currentTarget.style.background = theme.bg.hover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "12px 20px", borderBottom: `1px solid ${theme.borderLight}` }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: theme.text.primary }}>{role.role}</div>
                </td>
                <td style={{ padding: "12px 20px", borderBottom: `1px solid ${theme.borderLight}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14, color: cm.color }}>{cm.icon}</span>
                    <span style={{ fontSize: 12, color: theme.text.secondary }}>{role.cloud}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 20px", borderBottom: `1px solid ${theme.borderLight}` }}>
                  <span style={{ fontSize: 12, color: theme.text.secondary }}>{role.service}</span>
                </td>
                <td style={{ padding: "12px 20px", borderBottom: `1px solid ${theme.borderLight}` }}>
                  <RiskBadge level={role.risk.label} />
                </td>
                <td style={{ padding: "12px 20px", borderBottom: `1px solid ${theme.borderLight}` }}>
                  <span style={{ fontSize: 12, color: isStale ? RISK_META.Critical.color : theme.text.secondary, fontWeight: isStale ? 500 : 400 }}>
                    {role.lastUsed}
                  </span>
                </td>
                <td style={{ padding: "12px 20px", borderBottom: `1px solid ${theme.borderLight}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 48, height: 4, background: "#F3F4F6", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${role.risk.score}%`, background: RISK_META[role.risk.label].color, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: RISK_META[role.risk.label].color }}>{role.risk.score}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
