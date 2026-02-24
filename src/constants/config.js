// ─── CLOUD PROVIDER VISUAL CONFIG ──────────────────────────────────────────────
export const CLOUD_META = {
  AWS: {
    color: "#FF9900",
    bg: "rgba(255,153,0,0.12)",
    icon: "⬡",
  },
  Azure: {
    color: "#0078D4",
    bg: "rgba(0,120,212,0.12)",
    icon: "◈",
  },
  GCP: {
    color: "#34A853",
    bg: "rgba(52,168,83,0.12)",
    icon: "◆",
  },
};

// ─── RISK LEVEL VISUAL CONFIG ───────────────────────────────────────────────────
export const RISK_META = {
  Low: {
    color: "#00E676",
    bg: "rgba(0,230,118,0.12)",
    glow: "0 0 12px rgba(0,230,118,0.4)",
  },
  Medium: {
    color: "#FFB300",
    bg: "rgba(255,179,0,0.12)",
    glow: "0 0 12px rgba(255,179,0,0.4)",
  },
  Critical: {
    color: "#FF3D3D",
    bg: "rgba(255,61,61,0.12)",
    glow: "0 0 14px rgba(255,61,61,0.5)",
  },
};

// ─── IAM FEATURE DEFINITIONS ────────────────────────────────────────────────────
// weight = how many points this feature adds to the risk score
export const FEATURE_LABELS = {
  has_wildcard_permission:   { label: "Wildcard *",           weight: 40 },
  public_access_enabled:     { label: "Public Access",        weight: 30 },
  admin_privileges:          { label: "Admin Privilege",      weight: 20 },
  cross_account_access:      { label: "Cross-Account Trust",  weight: 0  },
  unused_high_privilege_role:{ label: "Unused High Privilege",weight: 10 },
  ai_model_full_access:      { label: "AI Model Full Access", weight: 0  },
};

// ─── HEATMAP CELL COLORS PER FEATURE ────────────────────────────────────────────
export const FEATURE_HEATMAP_COLORS = {
  has_wildcard_permission:    "rgba(255,61,61,0.6)",
  public_access_enabled:      "rgba(255,100,0,0.6)",
  admin_privileges:           "rgba(255,180,0,0.5)",
  cross_account_access:       "rgba(200,100,255,0.4)",
  unused_high_privilege_role: "rgba(100,200,255,0.3)",
  ai_model_full_access:       "rgba(100,200,255,0.3)",
};

// ─── HEATMAP LEGEND ENTRIES ──────────────────────────────────────────────────────
export const HEATMAP_LEGEND = [
  { label: "Wildcard *",    color: "#FF3D3D" },
  { label: "Public Access", color: "#FF6400" },
  { label: "Admin Priv",    color: "#FFB400" },
  { label: "Cross-Account", color: "#C864FF" },
  { label: "Unused",        color: "#64C8FF" },
];

// ─── SCORE FORMULA DISPLAY ────────────────────────────────────────────────────────
export const SCORE_FORMULA = [
  { label: "Wildcard *",     weight: "×40", color: "#FF3D3D" },
  { label: "Public Access",  weight: "×30", color: "#FF6400" },
  { label: "Admin Priv",     weight: "×20", color: "#FFB400" },
  { label: "Unused High",    weight: "×10", color: "#64C8FF" },
];
