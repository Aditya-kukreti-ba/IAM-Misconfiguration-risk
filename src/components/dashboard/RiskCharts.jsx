import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import { theme, RISK_META, CLOUD_META } from "../../styles/theme";

// ─── DONUT CHART ───────────────────────────────────────────────────────────────
function DonutChart({ allRoles }) {
  const critical = allRoles.filter(r => r.risk.label === "Critical").length;
  const medium   = allRoles.filter(r => r.risk.label === "Medium").length;
  const low      = allRoles.filter(r => r.risk.label === "Low").length;

  const data = [
    { name: "Critical", value: critical, color: RISK_META.Critical.color },
    { name: "Medium",   value: medium,   color: RISK_META.Medium.color   },
    { name: "Low",      value: low,      color: RISK_META.Low.color      },
  ];

  return (
    <div style={{ background: theme.bg.card, border: `1px solid ${theme.border}`, borderRadius: theme.radius.md, padding: 20, boxShadow: theme.shadowMd }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: theme.text.primary, marginBottom: 4 }}>Risk Distribution</div>
      <div style={{ fontSize: 12, color: theme.text.secondary, marginBottom: 16 }}>Across all cloud providers</div>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={52} outerRadius={78}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#fff", border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12 }}
              formatter={(v, n) => [v + " roles", n]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div style={{ flex: 1 }}>
          {data.map(d => (
            <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color }} />
                <span style={{ fontSize: 13, color: theme.text.secondary }}>{d.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 80, height: 4, background: "#F3F4F6", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(d.value / allRoles.length) * 100}%`, background: d.color, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: theme.text.primary, minWidth: 16 }}>{d.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CLOUD BAR CHART ───────────────────────────────────────────────────────────
function CloudBarChart({ allRoles }) {
  const clouds = ["AWS", "Azure", "GCP"];
  const data = clouds.map(cloud => {
    const roles = allRoles.filter(r => r.cloud === cloud);
    return {
      cloud,
      Critical: roles.filter(r => r.risk.label === "Critical").length,
      Medium:   roles.filter(r => r.risk.label === "Medium").length,
      Low:      roles.filter(r => r.risk.label === "Low").length,
    };
  });

  return (
    <div style={{ background: theme.bg.card, border: `1px solid ${theme.border}`, borderRadius: theme.radius.md, padding: 20, boxShadow: theme.shadowMd }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: theme.text.primary, marginBottom: 4 }}>Risk by Cloud Provider</div>
      <div style={{ fontSize: 12, color: theme.text.secondary, marginBottom: 16 }}>Stacked risk breakdown</div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={28}>
          <XAxis dataKey="cloud" tick={{ fontSize: 12, fill: theme.text.secondary }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: theme.text.muted }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#fff", border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12 }}
            cursor={{ fill: "#F4F6F8" }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: theme.text.secondary }} />
          <Bar dataKey="Critical" stackId="a" fill={RISK_META.Critical.color} radius={[0,0,0,0]} />
          <Bar dataKey="Medium"   stackId="a" fill={RISK_META.Medium.color}   radius={[0,0,0,0]} />
          <Bar dataKey="Low"      stackId="a" fill={RISK_META.Low.color}      radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── EXPORT BOTH ───────────────────────────────────────────────────────────────
export default function RiskCharts({ allRoles }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
      <DonutChart allRoles={allRoles} />
      <CloudBarChart allRoles={allRoles} />
    </div>
  );
}
