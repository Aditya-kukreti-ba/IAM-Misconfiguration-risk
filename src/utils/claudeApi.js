const SYSTEM_PROMPT = `You are an expert cloud security engineer specializing in IAM misconfiguration detection.
Analyze the provided IAM role configuration and return a structured security report in this EXACT JSON format:
{
  "verdict": "Critical|Medium|Low",
  "summary": "One sentence executive summary",
  "attack_vectors": ["attack vector 1", "attack vector 2"],
  "findings": [{"issue": "issue name", "severity": "Critical|High|Medium|Low", "detail": "explanation"}],
  "remediation": ["step 1", "step 2", "step 3"],
  "blast_radius": "Description of potential impact if exploited",
  "zero_trust_score": 0
}
Return ONLY valid JSON. No markdown, no backticks, no explanation outside the JSON.`;

export async function analyzeIAMRole(role) {
  const payload = {
    role: role.role,
    cloud: role.cloud,
    service: role.service,
    policy: role.policy,
    features: role.features,
    risk_score: role.risk.score,
    risk_level: role.risk.label,
    attached_policies: role.attachedPolicies,
    trusted_entities: role.trustedEntities,
  };

  const response = await fetch("http://localhost:3001/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",   // fast + smart Groq model
      temperature: 0.1,                    // low temp = consistent JSON
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Analyze this IAM configuration for security risks:\n\n${JSON.stringify(payload, null, 2)}`,
        },
      ],
    }),
  });

  const data = await response.json();

  // Groq returns: data.choices[0].message.content  (NOT data.content[0].text)
  const raw = data?.choices?.[0]?.message?.content;

  if (!raw) {
    console.error("Groq raw response:", JSON.stringify(data, null, 2));
    throw new Error("Empty response from Groq");
  }

  // Strip any accidental markdown fences
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}