// ─── SCAN PROGRESS BAR ─────────────────────────────────────────────────────────
// Thin animated bar that fills left→right while a scan is running.
// Hides itself when scanning is false.

export default function ScanBar({ scanning, progress }) {
  if (!scanning) return null;

  return (
    <div style={{ height: 3, background: "rgba(0,255,178,0.1)" }}>
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg,#00FFB2,#0066FF)",
          transition: "width 0.15s",
          boxShadow: "0 0 12px #00FFB2",
        }}
      />
    </div>
  );
}
