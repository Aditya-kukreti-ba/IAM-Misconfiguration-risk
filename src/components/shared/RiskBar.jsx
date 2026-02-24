import { scoreToColor } from "../../utils/riskEngine";

// ─── RISK BAR ──────────────────────────────────────────────────────────────────
// A horizontal progress bar that fills proportionally to the risk score (0–100).
// Color transitions: green → amber → red based on score thresholds.

export default function RiskBar({ score }) {
  const color = scoreToColor(score);

  return (
    <div
      style={{
        width: "100%",
        height: 6,
        background: "rgba(255,255,255,0.06)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min(100, score)}%`,
          height: "100%",
          background: color,
          borderRadius: 3,
          transition: "width 0.8s cubic-bezier(.4,0,.2,1)",
          boxShadow: `0 0 8px ${color}88`,
        }}
      />
    </div>
  );
}
