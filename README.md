# 🛡️ IAM Misconfiguration Risk AI

> **Live Demo → [iam-misconfiguration-risk.vercel.app](https://iam-misconfiguration-risk.vercel.app/)**

An enterprise-grade cloud security intelligence platform that detects, scores, and explains IAM misconfiguration risks across **AWS**, **Azure**, and **GCP** — powered by AI analysis and a deterministic Zero Trust scoring engine.

---

## 📸 Preview

```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar │  Dashboard · Roles · Analysis · Reports          │
│  --------│-------------------------------------------------  │
│  IAM     │  Total Roles  Critical  Medium  Avg Risk Score   │
│  Risk AI │     10           4        3        47/100        │
│          │                                                   │
│  Dash    │  [Risk Donut Chart]  [Cloud Bar Chart]           │
│  Roles   │                                                   │
│  Analysis│  Top Risky Roles Table (sortable, filterable)    │
│  Reports │                                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🔍 Multi-Cloud IAM Scanning
- Supports **AWS** (SageMaker, Bedrock), **Azure** (Azure ML, Cognitive Services, OpenAI Service), and **GCP** (Vertex AI, Cloud AI)
- Detects wildcard permissions, public access, admin privilege abuse, cross-account trust, and stale roles

### 🤖 AI-Powered Risk Analysis
- Integrates with **Groq AI** (LLaMA 3.3 70B) for deep policy analysis
- Returns structured reports: verdict, attack vectors, detailed findings, remediation steps, and blast radius

### 🏗️ Zero Trust Scoring Engine
- **Deterministic, client-side** — no AI dependency, consistent results every run
- Based on **NIST SP 800-207** Zero Trust Architecture principles
- Starts at 100, deducts for violations, rewards good controls

```
Score = 100
  − 30  Wildcard Action (Action: *)
  − 30  Public Access Enabled
  − 25  Admin Privileges
  − 20  Cross-Account Trust (Unrestricted)
  − 15  Full AI Model Access
  − 10  Unused High Privilege Role
  − 10  Wildcard/Public Trusted Entity
  −  5  Stale Role (45+ days unused)
  +  5  Scoped Resource ARNs
  + 10  IAM Conditions (IP/VPC/Tag)
  ────────────────────────
  = Final Score [0–100]
```

| Score | Band | Meaning |
|-------|------|---------|
| 90–100 | 🟢 Strong | Strong Zero Trust alignment |
| 75–89 | 🟢 Good | Good security posture |
| 50–74 | 🟡 Moderate | Moderate compliance |
| 30–49 | 🟠 Weak | Weak Zero Trust posture |
| 0–29 | 🔴 Severe | Severe violation |

### 📊 Risk Scoring Engine
```
Risk Score = (Wildcard × 40) + (Public Access × 30)
           + (Admin Privilege × 20) + (Unused High Privilege × 10)

0–30   → Low
31–60  → Medium
61–100 → Critical
```

### 🎯 Executive & Technical Views
- **Executive View** — Clean summary: stat cards, donut chart, top risky roles table
- **Technical View** — Full heatmap, feature flag matrix, per-role breakdowns

---

## 🧱 Architecture

```
IAM Data (JSON)
     │
     ▼
Feature Extractor
     │
     ├──► Risk Scoring Engine (client-side)
     │         └── Risk Score + Level
     │
     ├──► Zero Trust Engine (client-side, deterministic)
     │         └── ZT Score + Band + Breakdown
     │
     └──► Groq AI Proxy (Node.js backend)
               └── Verdict · Findings · Remediation · Blast Radius
                         │
                         ▼
                    React Dashboard
         ┌────────────────────────────────┐
         │  Sidebar │ Navbar │ Main Area  │
         │  Dashboard · Roles · Analysis  │
         └────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
iam-risk-dashboard/
├── server.js                        # Groq API proxy (Express)
├── .env                             # API keys (never committed)
├── .env.example                     # Template for contributors
│
└── src/
    ├── App.jsx                      # Root layout + state management
    ├── data/
    │   └── iamData.js               # IAM role definitions
    ├── constants/
    │   └── config.js                # Cloud + risk visual config
    ├── utils/
    │   ├── riskEngine.js            # Risk score calculator
    │   ├── zeroTrustScore.js        # Zero Trust engine (NIST 800-207)
    │   └── claudeApi.js             # Groq AI API client
    ├── styles/
    │   ├── theme.js                 # SaaS color palette + tokens
    │   └── global.js                # CSS resets + animations
    └── components/
        ├── layout/
        │   ├── Sidebar.jsx          # Fixed 240px navigation
        │   └── TopNavbar.jsx        # Page title + controls
        ├── dashboard/
        │   ├── DashboardTab.jsx     # Executive/Technical toggle
        │   ├── StatCards.jsx        # KPI summary cards
        │   ├── RiskCharts.jsx       # Donut + stacked bar charts
        │   └── TopRiskyRoles.jsx    # Top 5 table
        ├── roles/
        │   ├── RolesTab.jsx         # Sortable/filterable table
        │   └── RoleDrawer.jsx       # Slide-in detail panel
        └── analysis/
            ├── AnalysisTab.jsx      # 30/70 split layout
            ├── ZeroTrustPanel.jsx   # ZT score gauge + breakdown
            └── RoleDetailPanel.jsx  # Left metadata panel
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Groq API key](https://console.groq.com/keys) (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/Aditya-kukreti-ba/IAM-Misconfiguration-risk.git
cd IAM-Misconfiguration-risk

# Install dependencies
npm install
npm install dotenv express cors
```

### Configuration

```bash
# Copy the env template
cp .env.example .env
```

Edit `.env` and add your Groq API key:
```env
GROQ_API_KEY=gsk_your_key_here
```

### Running Locally

You need **two terminals**:

**Terminal 1 — Backend proxy:**
```bash
node server.js
# ✅ Groq proxy running on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
npm run dev
# ➜ Local: http://localhost:5173/
```

---

## 🔐 Security Notes

- **Never commit `.env`** — it is listed in `.gitignore`
- The Groq API key lives only in your `.env` file and is injected at runtime via `process.env`
- All Zero Trust scoring is computed **client-side** — no sensitive data leaves the browser except to your own proxy
- The proxy server adds the API key header server-side so it is never exposed to the frontend bundle

---

## 🌐 Deployment

Live at: **[https://iam-misconfiguration-risk.vercel.app/](https://iam-misconfiguration-risk.vercel.app/)**

Frontend is deployed on **Vercel**. The backend proxy must be hosted separately (Railway, Render, or any Node.js host) and the `VITE_API_URL` env variable updated in Vercel project settings to point to it.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Charts | Recharts |
| AI Engine | Groq API (LLaMA 3.3 70B) |
| Backend Proxy | Express.js |
| Styling | Inline styles + CSS-in-JS |
| Deployment | Vercel (frontend) |

---

## 📋 Detected Risk Patterns

| Misconfiguration | Severity | Description |
|-----------------|----------|-------------|
| Wildcard Permission (`*`) | 🔴 Critical | Allows any action on any resource |
| Public Access Enabled | 🔴 Critical | Resource exposed to the internet |
| Admin Privileges | 🔴 Critical | Full administrative control granted |
| Cross-Account Trust | 🟠 High | Trust relationship with external accounts |
| Full AI Model Access | 🟡 Medium | Unrestricted access to AI/ML APIs |
| Unused High Privilege | 🟡 Medium | High-privilege role with no recent usage |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'add: your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">
  Built with React · Groq AI · NIST SP 800-207 Zero Trust Principles
  <br/>
  <a href="https://iam-misconfiguration-risk.vercel.app/">🔗 Live Demo</a>
</div>
