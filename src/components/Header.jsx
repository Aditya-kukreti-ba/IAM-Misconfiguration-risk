// ─── HEADER ───────────────────────────────────────────────────────────────────
// Sticky top bar: logo, tab navigation, and the scan trigger button.

const TABS = ["dashboard", "roles", "analysis"];

export default function Header({ activeTab, setActiveTab, scanning, onScan }) {
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(0,255,180,0.15)",
        padding: "16px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ position: "relative", width: 36, height: 36 }}>
          <div
            className="critical-glow"
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid #00FFB2",
              borderRadius: "50%",
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 4,
              background: "linear-gradient(135deg,#00FFB2,#0066FF)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            🛡
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Share Tech Mono'",
              fontSize: 15,
              color: "#00FFB2",
              letterSpacing: "0.15em",
            }}
          >
            IAM·RISK·AI
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#4A7080",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Cloud Misconfiguration Intelligence
          </div>
        </div>
      </div>

      {/* Tabs + Scan Button */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "6px 16px",
              background: activeTab === tab ? "rgba(0,255,178,0.12)" : "transparent",
              border: `1px solid ${activeTab === tab ? "#00FFB2" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 6,
              color: activeTab === tab ? "#00FFB2" : "#5A7080",
              fontFamily: "'Share Tech Mono'",
              fontSize: 11,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              transition: "all 0.2s",
            }}
          >
            {tab}
          </button>
        ))}

        <button
          onClick={onScan}
          disabled={scanning}
          style={{
            padding: "6px 18px",
            background: scanning
              ? "rgba(0,255,178,0.06)"
              : "linear-gradient(135deg,rgba(0,255,178,0.2),rgba(0,100,255,0.2))",
            border: "1px solid #00FFB2",
            borderRadius: 6,
            color: "#00FFB2",
            fontFamily: "'Share Tech Mono'",
            fontSize: 11,
            cursor: scanning ? "not-allowed" : "pointer",
            letterSpacing: "0.1em",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {scanning ? (
            <>
              <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>
                ↻
              </span>{" "}
              SCANNING
            </>
          ) : (
            "▶ RUN SCAN"
          )}
        </button>
      </div>
    </div>
  );
}
