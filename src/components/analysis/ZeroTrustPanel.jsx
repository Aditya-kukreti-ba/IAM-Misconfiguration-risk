import { computeZeroTrustScore, ZT_BANDS } from "../../utils/zeroTrustScore";
import { theme } from "../../styles/theme";

// ─── SCORE GAUGE ───────────────────────────────────────────────────────────────
function ScoreGauge({ score, band }) {
  const r = 54, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: 130, height: 130 }}>
        <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="65" cy="65" r={r} fill="none" stroke="#F3F4F6" strokeWidth="9" />
          <circle
            cx="65" cy="65" r={r} fill="none"
            stroke={band.color} strokeWidth="9"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: band.color, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 10, color: theme.text.muted, fontWeight: 500, marginTop: 2 }}>/ 100</span>
        </div>
      </div>
      <span style={{
        marginTop: 10, padding: "4px 14px", borderRadius: 20,
        background: band.bg, border: `1px solid ${band.border}`,
        color: band.color, fontSize: 12, fontWeight: 700,
      }}>
        {band.label}
      </span>
      <span style={{ fontSize: 11, color: theme.text.secondary, marginTop: 6, textAlign: "center" }}>
        {band.description}
      </span>
    </div>
  );
}

// ─── SCORE BAND LEGEND ─────────────────────────────────────────────────────────
function BandLegend({ currentScore }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {ZT_BANDS.map(band => {
        const active = currentScore >= band.min && currentScore <= band.max;
        return (
          <div key={band.label} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "5px 10px", borderRadius: 8,
            background: active ? band.bg : "transparent",
            border: `1px solid ${active ? band.border : "transparent"}`,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: band.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? band.color : theme.text.secondary }}>
                {band.label}
              </span>
              <span style={{ fontSize: 11, color: theme.text.muted, marginLeft: 6 }}>
                {band.min}–{band.max}
              </span>
            </div>
            {active && <span style={{ fontSize: 10, fontWeight: 700, color: band.color }}>← THIS ROLE</span>}
          </div>
        );
      })}
    </div>
  );
}

// ─── BREAKDOWN TABLE ───────────────────────────────────────────────────────────
const CAT_STYLES = {
  "High Severity":    { color: "#EF4444", bg: "#FEF2F2" },
  "Medium Severity":  { color: "#F59E0B", bg: "#FFFBEB" },
  "Contextual":       { color: "#8B5CF6", bg: "#F5F3FF" },
  "Security Control": { color: "#10B981", bg: "#ECFDF5" },
};

function BreakdownTable({ breakdown, totalDeductions, totalRewards }) {
  const categories = [...new Set(breakdown.map(b => b.category))];

  return (
    <div>
      {categories.map(cat => {
        const items = breakdown.filter(b => b.category === cat);
        const cc = CAT_STYLES[cat] || { color: "#6B7280", bg: "#F9FAFB" };
        return (
          <div key={cat} style={{ marginBottom: 14 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: cc.color,
              letterSpacing: "0.08em", textTransform: "uppercase",
              marginBottom: 6, display: "flex", alignItems: "center", gap: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: cc.color }} />
              {cat}
            </div>
            {items.map((item, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                padding: "7px 10px", marginBottom: 4, borderRadius: 8,
                background: item.points < 0 ? "#FAFAFA" : "#F0FDF4",
                border: `1px solid ${item.points < 0 ? theme.borderLight : "#A7F3D0"}`,
              }}>
                <span style={{ fontSize: 12, color: theme.text.primary, lineHeight: 1.4, flex: 1 }}>
                  {item.label}
                </span>
                <span style={{
                  fontSize: 13, fontWeight: 700, marginLeft: 12, flexShrink: 0,
                  color: item.points < 0 ? "#EF4444" : "#10B981",
                }}>
                  {item.points > 0 ? `+${item.points}` : item.points}
                </span>
              </div>
            ))}
          </div>
        );
      })}

      {/* Summary totals */}
      <div style={{ borderTop: `2px solid ${theme.border}`, paddingTop: 12, marginTop: 4, display: "flex", flexDirection: "column", gap: 5 }}>
        {[
          ["Base Score",        "100",               theme.text.primary],
          ["Total Deductions",  String(totalDeductions), "#EF4444"],
          ...(totalRewards > 0 ? [["Security Rewards", `+${totalRewards}`, "#10B981"]] : []),
        ].map(([label, val, color]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
            <span style={{ color: theme.text.secondary }}>{label}</span>
            <span style={{ fontWeight: 700, color }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function ZeroTrustPanel({ role }) {
  const { score, band, breakdown, totalDeductions, totalRewards } = computeZeroTrustScore(role);

  return (
    <div style={{
      border: `1px solid ${theme.border}`, borderRadius: theme.radius.md,
      overflow: "hidden", background: theme.bg.card, boxShadow: theme.shadowMd,
      marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 20px", borderBottom: `1px solid ${theme.borderLight}`,
        background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: theme.text.primary, letterSpacing: "0.04em" }}>ZERO TRUST SCORE</div>
          <div style={{ fontSize: 11, color: theme.text.muted, marginTop: 1 }}>NIST SP 800-207 · Least privilege compliance</div>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
          background: "#EFF6FF", color: "#3B82F6", border: "1px solid #BFDBFE",
        }}>
          Deterministic · No AI
        </span>
      </div>

      <div style={{ padding: 20 }}>
        {/* Gauge + Band Legend */}
        <div style={{
          display: "grid", gridTemplateColumns: "auto 1fr", gap: 24,
          marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${theme.borderLight}`,
        }}>
          <ScoreGauge score={score} band={band} />
          <BandLegend currentScore={score} />
        </div>

        {/* Score Breakdown */}
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.text.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
          Score Breakdown
        </div>
        {breakdown.length > 0
          ? <BreakdownTable breakdown={breakdown} totalDeductions={totalDeductions} totalRewards={totalRewards} />
          : <div style={{ textAlign: "center", padding: 16, fontSize: 13, color: theme.text.muted }}>
              No violations detected — fully compliant role.
            </div>
        }
      </div>
    </div>
  );
}
