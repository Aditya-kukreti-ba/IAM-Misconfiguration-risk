import { useState } from "react";
import RoleDrawer from "./RoleDrawer";
import { theme, RISK_META, CLOUD_META } from "../../styles/theme";

const RISK_ORDER = { Critical: 0, Medium: 1, Low: 2 };

function RiskBadge({ level }) {
  const rm = RISK_META[level];
  return (
    <span style={{
      padding: "2px 10px", borderRadius: 20,
      background: rm.bg, color: rm.color, border: `1px solid ${rm.border}`,
      fontSize: 11, fontWeight: 600,
    }}>{level}</span>
  );
}

export default function RolesTab({ allRoles, onAnalyze }) {
  const [cloudFilter, setCloudFilter] = useState("All");
  const [riskFilter,  setRiskFilter]  = useState("All");
  const [search,      setSearch]      = useState("");
  const [sortKey,     setSortKey]     = useState("risk");
  const [sortDir,     setSortDir]     = useState("asc");
  const [drawerRole,  setDrawerRole]  = useState(null);

  const filtered = allRoles
    .filter(r => cloudFilter === "All" || r.cloud === cloudFilter)
    .filter(r => riskFilter  === "All" || r.risk.label === riskFilter)
    .filter(r => r.role.toLowerCase().includes(search.toLowerCase()) || r.service.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let av, bv;
      if (sortKey === "risk")     { av = RISK_ORDER[a.risk.label]; bv = RISK_ORDER[b.risk.label]; }
      else if (sortKey === "score") { av = a.risk.score; bv = b.risk.score; }
      else if (sortKey === "role")  { av = a.role; bv = b.role; }
      else                         { av = a[sortKey]; bv = b[sortKey]; }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span style={{ opacity: 0.3 }}>⇅</span>;
    return <span style={{ color: theme.accent.teal }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const COLS = [
    { key: "role",    label: "Role",     sortable: true  },
    { key: "cloud",   label: "Cloud",    sortable: false },
    { key: "service", label: "Service",  sortable: false },
    { key: "risk",    label: "Risk",     sortable: true  },
    { key: "lastUsed",label: "Last Used",sortable: false },
    { key: "score",   label: "Score",    sortable: true  },
    { key: "action",  label: "",         sortable: false },
  ];

  return (
    <div className="fade-in">
      {/* Filters row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: theme.text.muted, fontSize: 14 }}>⌕</span>
          <input
            type="text"
            placeholder="Search roles or services..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "7px 12px 7px 30px",
              border: `1px solid ${theme.border}`, borderRadius: 8,
              background: "#FFFFFF", color: theme.text.primary,
              fontSize: 13, outline: "none",
            }}
          />
        </div>

        {[
          { label: "Cloud", value: cloudFilter, onChange: setCloudFilter, options: ["All", "AWS", "Azure", "GCP"] },
          { label: "Risk",  value: riskFilter,  onChange: setRiskFilter,  options: ["All", "Critical", "Medium", "Low"] },
        ].map(f => (
          <select key={f.label} value={f.value} onChange={e => f.onChange(e.target.value)} style={{
            padding: "7px 10px", border: `1px solid ${theme.border}`,
            borderRadius: 8, background: "#FFFFFF", color: theme.text.primary, fontSize: 13, outline: "none", cursor: "pointer",
          }}>
            {f.options.map(o => <option key={o} value={o}>{o === "All" ? `All ${f.label}s` : o}</option>)}
          </select>
        ))}

        <span style={{ fontSize: 12, color: theme.text.muted, marginLeft: "auto" }}>
          {filtered.length} of {allRoles.length} roles
        </span>
      </div>

      {/* Table */}
      <div style={{ background: theme.bg.card, border: `1px solid ${theme.border}`, borderRadius: theme.radius.md, boxShadow: theme.shadowMd, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {COLS.map(col => (
                <th key={col.key}
                  onClick={() => col.sortable && toggleSort(col.key)}
                  style={{
                    textAlign: "left", padding: "11px 16px",
                    fontSize: 11, fontWeight: 600, color: theme.text.muted,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    borderBottom: `1px solid ${theme.border}`,
                    cursor: col.sortable ? "pointer" : "default",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}>
                  {col.label} {col.sortable && <SortIcon col={col.key} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(role => {
              const cm = CLOUD_META[role.cloud];
              const isStale = role.lastUsed === "Never" || role.lastUsed.includes("days");
              return (
                <tr key={role.id}
                  onClick={() => setDrawerRole(role)}
                  style={{ cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = theme.bg.hover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.borderLight}` }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: theme.text.primary }}>{role.role}</span>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.borderLight}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: cm.color }}>{cm.icon}</span>
                      <span style={{ fontSize: 12, color: theme.text.secondary }}>{role.cloud}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.borderLight}` }}>
                    <span style={{ fontSize: 12, color: theme.text.secondary }}>{role.service}</span>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.borderLight}` }}>
                    <RiskBadge level={role.risk.label} />
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.borderLight}` }}>
                    <span style={{ fontSize: 12, color: isStale ? RISK_META.Critical.color : theme.text.secondary, fontWeight: isStale ? 500 : 400 }}>
                      {role.lastUsed}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.borderLight}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 48, height: 4, background: "#F3F4F6", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${role.risk.score}%`, background: RISK_META[role.risk.label].color, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: RISK_META[role.risk.label].color }}>{role.risk.score}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.borderLight}` }}>
                    <button
                      onClick={e => { e.stopPropagation(); onAnalyze(role); }}
                      style={{
                        padding: "4px 12px", borderRadius: 6,
                        border: `1px solid ${theme.accent.teal}`,
                        color: theme.accent.teal, fontSize: 11, fontWeight: 600,
                        background: theme.accent.tealLight,
                      }}>
                      Analyze
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: "40px 0", textAlign: "center", color: theme.text.muted, fontSize: 13 }}>
            No roles match your filters.
          </div>
        )}
      </div>

      {/* Role detail drawer */}
      {drawerRole && (
        <RoleDrawer
          role={drawerRole}
          onClose={() => setDrawerRole(null)}
          onAnalyze={(role) => { setDrawerRole(null); onAnalyze(role); }}
        />
      )}
    </div>
  );
}
