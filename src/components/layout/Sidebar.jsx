import { theme } from "../../styles/theme";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",  icon: "▦" },
  { id: "roles",     label: "Roles",      icon: "⊟" },
  { id: "analysis",  label: "Analysis",   icon: "⊕" },
  { id: "reports",   label: "Reports",    icon: "≡"  },
  { id: "settings",  label: "Settings",   icon: "⊙" },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div style={{
      width: theme.sidebarWidth,
      height: "100vh",
      background: theme.bg.sidebar,
      position: "fixed",
      left: 0, top: 0,
      display: "flex",
      flexDirection: "column",
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: "linear-gradient(135deg, #00BFA6, #0066FF)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14,
          }}>🛡</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF", letterSpacing: "0.02em" }}>IAM Risk AI</div>
            <div style={{ fontSize: 10, color: "#8A9BB0", marginTop: 1 }}>Security Intelligence</div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#4A5568", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 10px 8px" }}>
          MAIN
        </div>
        {NAV_ITEMS.slice(0, 3).map(item => (
          <NavItem key={item.id} item={item} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
        ))}

        <div style={{ fontSize: 10, fontWeight: 600, color: "#4A5568", letterSpacing: "0.08em", textTransform: "uppercase", padding: "16px 10px 8px" }}>
          SYSTEM
        </div>
        {NAV_ITEMS.slice(3).map(item => (
          <NavItem key={item.id} item={item} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Workspace */}
        <div style={{
          padding: "8px 10px",
          borderRadius: 8,
          background: "rgba(255,255,255,0.04)",
          marginBottom: 6,
        }}>
          <div style={{ fontSize: 10, color: "#4A5568", marginBottom: 2 }}>WORKSPACE</div>
          <div style={{ fontSize: 12, color: "#8A9BB0", fontWeight: 500 }}>Security Ops Team</div>
        </div>
        {/* User */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 10px",
          borderRadius: 8,
          cursor: "pointer",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#00BFA6,#0066FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 600 }}>U</div>
          <div>
            <div style={{ fontSize: 12, color: "#C8D0DA", fontWeight: 500 }}>User</div>
            <div style={{ fontSize: 10, color: "#4A5568" }}>Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 8,
        marginBottom: 2,
        background: active ? "rgba(0,191,166,0.12)" : "transparent",
        color: active ? "#00BFA6" : "#8A9BB0",
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        transition: "all 0.15s",
        textAlign: "left",
        borderLeft: active ? "2px solid #00BFA6" : "2px solid transparent",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#C8D0DA"; }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8A9BB0"; } }}
    >
      <span style={{ fontSize: 16, width: 18, textAlign: "center" }}>{item.icon}</span>
      <span>{item.label}</span>
    </button>
  );
}
