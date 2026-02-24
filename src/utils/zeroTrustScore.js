// ─── ZERO TRUST SCORING ENGINE ────────────────────────────────────────────────
//
// Philosophy: "How strictly does this role follow least privilege
//              and minimize implicit trust?"
//
// Model:
//   Start at 100 (fully compliant)
//   Deduct for violations
//   Reward good controls
//   Clamp to [0, 100]
//
// References:
//   NIST SP 800-207 (Zero Trust Architecture)
//   AWS IAM Security Best Practices
//   CIS Benchmarks for Cloud IAM

// ─── SCORE BANDS ───────────────────────────────────────────────────────────────
export const ZT_BANDS = [
  { min: 90, max: 100, label: "Strong",   color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0", description: "Strong Zero Trust alignment"  },
  { min: 75, max: 89,  label: "Good",     color: "#34D399", bg: "#F0FDF4", border: "#BBF7D0", description: "Good security posture"         },
  { min: 50, max: 74,  label: "Moderate", color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", description: "Moderate compliance"            },
  { min: 30, max: 49,  label: "Weak",     color: "#F97316", bg: "#FFF7ED", border: "#FED7AA", description: "Weak Zero Trust posture"        },
  { min: 0,  max: 29,  label: "Severe",   color: "#EF4444", bg: "#FEF2F2", border: "#FECACA", description: "Severe violation"               },
];

export function getZTBand(score) {
  return ZT_BANDS.find(b => score >= b.min && score <= b.max) || ZT_BANDS[ZT_BANDS.length - 1];
}

// ─── RULE DEFINITIONS ──────────────────────────────────────────────────────────

const HIGH_SEVERITY_RULES = [
  { key: "has_wildcard_permission",    label: "Wildcard Action (Action: *)",         points: -30 },
  { key: "public_access_enabled",      label: "Public Access Enabled",               points: -30 },
  { key: "admin_privileges",           label: "Admin Privileges Granted",            points: -25 },
  { key: "cross_account_access",       label: "Cross-Account Trust (Unrestricted)",  points: -20 },
];

const MEDIUM_SEVERITY_RULES = [
  { key: "ai_model_full_access",        label: "Full AI Model Access",                points: -15 },
  { key: "unused_high_privilege_role",  label: "Unused High Privilege Role",          points: -10 },
];

function getContextualDeductions(role) {
  const items = [];

  // Stale role: never used or 45+ days
  if (role.lastUsed === "Never") {
    items.push({ label: "Role never used — access may be unnecessary", points: -5, category: "Contextual" });
  } else if (role.lastUsed) {
    const match = role.lastUsed.match(/^(\d+)\s*days?/);
    if (match && parseInt(match[1]) >= 45) {
      items.push({ label: `Not used in ${role.lastUsed} — stale access`, points: -5, category: "Contextual" });
    }
  }

  // Too many attached policies
  if (Array.isArray(role.attachedPolicies) && role.attachedPolicies.length > 2) {
    items.push({ label: `${role.attachedPolicies.length} policies attached (>${2})`, points: -5, category: "Contextual" });
  }

  // Wildcard or public trusted entity
  const dangerousTrust = ["*", "allUsers", "allAuthenticatedUsers"];
  const hasDangerousTrust = Array.isArray(role.trustedEntities) &&
    role.trustedEntities.some(e => dangerousTrust.some(d => e.includes(d)));
  if (hasDangerousTrust) {
    items.push({ label: "Trusted entity includes public/wildcard principal", points: -10, category: "Contextual" });
  }

  return items;
}

function getSecurityRewards(role) {
  const items = [];

  try {
    const policy = JSON.parse(role.policy);

    // Scoped ARN resource (not *)
    const resource = policy.Resource || policy.resource;
    if (resource) {
      const resourceStr = Array.isArray(resource) ? resource.join(",") : String(resource);
      if (resource !== "*" && resourceStr.includes("arn:") && !resourceStr.endsWith(":*")) {
        items.push({ label: "Scoped to specific resource ARNs", points: +5, category: "Security Control" });
      }
    }

    // Uses IAM Conditions
    if (policy.Condition && Object.keys(policy.Condition).length > 0) {
      items.push({ label: "Uses IAM Conditions (IP / VPC / Tag restriction)", points: +10, category: "Security Control" });
    }
  } catch (_) {
    // unparseable policy — no rewards
  }

  return items;
}

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────
/**
 * Computes a deterministic, auditable Zero Trust Score.
 * Fully client-side — no AI dependency. Consistent across every run.
 *
 * @param {Object} role - Full IAM role object
 * @returns {{
 *   score: number,           // 0–100
 *   band: Object,            // label, color, description
 *   breakdown: Array,        // each deduction/reward with label + points
 *   totalDeductions: number,
 *   totalRewards: number
 * }}
 */
export function computeZeroTrustScore(role) {
  const breakdown = [];

  // 1. High severity
  for (const rule of HIGH_SEVERITY_RULES) {
    if (role.features[rule.key]) {
      breakdown.push({ label: rule.label, points: rule.points, category: "High Severity" });
    }
  }

  // 2. Medium severity
  for (const rule of MEDIUM_SEVERITY_RULES) {
    if (role.features[rule.key]) {
      breakdown.push({ label: rule.label, points: rule.points, category: "Medium Severity" });
    }
  }

  // 3. Contextual
  breakdown.push(...getContextualDeductions(role));

  // 4. Rewards
  breakdown.push(...getSecurityRewards(role));

  // 5. Final score
  const totalDeductions = breakdown.filter(b => b.points < 0).reduce((s, b) => s + b.points, 0);
  const totalRewards    = breakdown.filter(b => b.points > 0).reduce((s, b) => s + b.points, 0);
  const score           = Math.max(0, Math.min(100, 100 + totalDeductions + totalRewards));
  const band            = getZTBand(score);

  return { score, band, breakdown, totalDeductions, totalRewards };
}
