// ─── FOOTER ───────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(0,255,180,0.08)",
        padding: "10px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
      }}
    >
      <span
        style={{
          fontFamily: "'Share Tech Mono'",
          fontSize: 9,
          color: "#2A4050",
          letterSpacing: "0.15em",
        }}
      >
        IAM·RISK·AI — CLOUD MISCONFIGURATION INTELLIGENCE PLATFORM
      </span>
      <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 9, color: "#2A4050" }}>
        AWS · AZURE · GCP · VERTEX AI · SAGEMAKER · BEDROCK
      </span>
    </div>
  );
}
