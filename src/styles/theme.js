// ─── MODERN SAAS THEME ─────────────────────────────────────────────────────────

export const theme = {
  // Backgrounds
  bg: {
    page:    "#F4F6F8",
    card:    "#FAFBFC",
    sidebar: "#1C2430",
    input:   "#FFFFFF",
    hover:   "#F0F2F5",
  },

  // Text
  text: {
    primary:   "#1F2933",
    secondary: "#6B7280",
    muted:     "#9CA3AF",
    inverse:   "#FFFFFF",
    sidebarActive: "#FFFFFF",
    sidebarInactive: "#8A9BB0",
  },

  // Accent
  accent: {
    teal:       "#00BFA6",
    tealLight:  "rgba(0,191,166,0.1)",
    tealBorder: "rgba(0,191,166,0.25)",
  },

  // Risk levels
  risk: {
    critical: { color: "#EF4444", bg: "#FEF2F2", border: "#FECACA", dot: "#EF4444" },
    medium:   { color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", dot: "#F59E0B" },
    low:      { color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0", dot: "#10B981" },
  },

  // Borders & shadows
  border:    "#E5E7EB",
  borderLight: "#F3F4F6",
  shadow:    "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:  "0 4px 12px rgba(0,0,0,0.05)",
  shadowLg:  "0 8px 24px rgba(0,0,0,0.08)",

  // Layout
  sidebarWidth: "240px",
  navbarHeight: "60px",
  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
  },
};

export const RISK_META = {
  Critical: theme.risk.critical,
  Medium:   theme.risk.medium,
  Low:      theme.risk.low,
};

export const CLOUD_META = {
  AWS:   { color: "#FF9900", bg: "rgba(255,153,0,0.08)",   icon: "⬡", label: "AWS"   },
  Azure: { color: "#0078D4", bg: "rgba(0,120,212,0.08)",   icon: "◈", label: "Azure" },
  GCP:   { color: "#34A853", bg: "rgba(52,168,83,0.08)",   icon: "◆", label: "GCP"   },
};
