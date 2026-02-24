import { theme } from "../../styles/theme";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  roles:     "IAM Roles",
  analysis:  "Risk Analysis",
  reports:   "Reports",
  settings:  "Settings",
};

export default function TopNavbar({
  activeTab, cloudFilter, setCloudFilter,
  viewMode, setViewMode, scanning, onScan, scanned,
}) {
  return (
    <div style={{
      height: theme.navbarHeight,
      background: "#FFFFFF",
      borderBottom: `1px solid ${theme.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      position: "fixed",
      top: 0,
      left: theme.sidebarWidth,
      right: 0,
      zIndex: 50,
      boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
    }}>
      {/* Left: Page title */}
      <div>
        <h1 style={{ fontSize: 15, fontWeight: 600, color: theme.text.primary, letterSpacing: "-0.01em" }}>
          {PAGE_TITLES[activeTab] || "Dashboard"}
        </h1>
        {scanned && (
          <div style={{ fontSize: 11, color: theme.text.muted, marginTop: 1 }}>
            Last scan: just now · {10} roles analyzed
          </div>
        )}
      </div>

      {/* Right: Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* View Mode Toggle */}
        <div style={{
          display: "flex",
          background: theme.bg.page,
          borderRadius: 8,
          padding: 3,
          border: `1px solid ${theme.border}`,
        }}>
          {["executive", "technical"].map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)} style={{
              padding: "4px 12px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              background: viewMode === mode ? "#FFFFFF" : "transparent",
              color: viewMode === mode ? theme.text.primary : theme.text.secondary,
              boxShadow: viewMode === mode ? theme.shadow : "none",
              transition: "all 0.15s",
              textTransform: "capitalize",
            }}>
              {mode === "executive" ? "Executive" : "Technical"}
            </button>
          ))}
        </div>

        {/* Cloud Filter */}
        <select
          value={cloudFilter}
          onChange={e => setCloudFilter(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: `1px solid ${theme.border}`,
            background: "#FFFFFF",
            color: theme.text.primary,
            fontSize: 13,
            fontWeight: 500,
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="All">All Clouds</option>
          <option value="AWS">⬡ AWS</option>
          <option value="Azure">◈ Azure</option>
          <option value="GCP">◆ GCP</option>
        </select>

        {/* Run Scan */}
        <button
          onClick={onScan}
          disabled={scanning}
          style={{
            padding: "7px 16px",
            background: scanning ? "#9CA3AF" : theme.accent.teal,
            color: "#FFFFFF",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.15s",
            opacity: scanning ? 0.7 : 1,
            boxShadow: scanning ? "none" : "0 1px 3px rgba(0,191,166,0.3)",
          }}
        >
          {scanning
            ? <><span className="spin" style={{ display: "inline-block" }}>↻</span> Scanning...</>
            : "▶ Run Scan"
          }
        </button>
      </div>
    </div>
  );
}
