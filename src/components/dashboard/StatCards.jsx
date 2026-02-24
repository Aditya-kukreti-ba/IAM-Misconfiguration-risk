import { theme, RISK_META } from "../../styles/theme";

export default function StatCards({ allRoles }) {
  const total    = allRoles.length;
  const critical = allRoles.filter(r => r.risk.label === "Critical").length;
  const medium   = allRoles.filter(r => r.risk.label === "Medium").length;
  const avgScore = Math.round(allRoles.reduce((s, r) => s + r.risk.score, 0) / total);

  const cards = [
    { label: "Total Roles",   value: total,    trend: "+2",  trendUp: true,  color: theme.text.primary, dot: null },
    { label: "Critical Risk", value: critical, trend: "+1",  trendUp: false, color: RISK_META.Critical.color, dot: RISK_META.Critical.color },
    { label: "Medium Risk",   value: medium,   trend: "0",   trendUp: null,  color: RISK_META.Medium.color,   dot: RISK_META.Medium.color   },
    { label: "Avg Risk Score",value: avgScore, trend: "↑5%", trendUp: false, color: avgScore > 60 ? RISK_META.Critical.color : avgScore > 30 ? RISK_META.Medium.color : RISK_META.Low.color, dot: null, suffix: "/100" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
      {cards.map((c, i) => (
        <div key={i} style={{
          background: theme.bg.card,
          border: `1px solid ${theme.border}`,
          borderRadius: theme.radius.md,
          padding: "18px 20px",
          boxShadow: theme.shadowMd,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: theme.text.secondary }}>{c.label}</span>
            {c.dot && (
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, display: "inline-block", marginTop: 4 }} />
            )}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: c.color, lineHeight: 1 }}>
              {c.value}
              {c.suffix && <span style={{ fontSize: 13, fontWeight: 400, color: theme.text.muted }}>{c.suffix}</span>}
            </span>
            {c.trend && (
              <span style={{
                fontSize: 11,
                fontWeight: 500,
                color: c.trendUp === null ? theme.text.muted : c.trendUp ? "#10B981" : "#EF4444",
                marginBottom: 3,
              }}>
                {c.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
