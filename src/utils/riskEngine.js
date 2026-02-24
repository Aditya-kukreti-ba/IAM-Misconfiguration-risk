// ─── RISK SCORING ENGINE ───────────────────────────────────────────────────────
//
// Formula (from spec):
//   Risk Score = (Wildcard * 40) + (Public Access * 30)
//              + (Admin Privilege * 20) + (Unused High Privilege * 10)
//
// Thresholds:
//   0–30   → Low      (level 0)
//   31–60  → Medium   (level 1)
//   61–100 → Critical (level 2)

/**
 * @param {Object} features - IAM feature flags (booleans)
 * @returns {{ score: number, level: number, label: string }}
 */
export function computeRisk(features) {
  const score =
    (features.has_wildcard_permission    ? 40 : 0) +
    (features.public_access_enabled      ? 30 : 0) +
    (features.admin_privileges           ? 20 : 0) +
    (features.unused_high_privilege_role ? 10 : 0);

  if (score <= 30) return { score, level: 0, label: "Low" };
  if (score <= 60) return { score, level: 1, label: "Medium" };
  return              { score, level: 2, label: "Critical" };
}

/**
 * Returns the color for a given numeric risk score (for gradient bars etc.)
 * @param {number} score
 * @returns {string} hex color
 */
export function scoreToColor(score) {
  if (score <= 30) return "#00E676";
  if (score <= 60) return "#FFB300";
  return "#FF3D3D";
}
