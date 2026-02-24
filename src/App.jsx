import { useState, useRef } from "react";
import { globalStyles }   from "./styles/global";
import { theme }          from "./styles/theme";
import { ALL_ROLES }      from "./data/iamData";
import { analyzeIAMRole } from "./utils/claudeApi";

import Sidebar      from "./components/layout/Sidebar";
import TopNavbar    from "./components/layout/TopNavbar";
import DashboardTab from "./components/dashboard/DashboardTab";
import RolesTab     from "./components/roles/RolesTab";
import AnalysisTab  from "./components/analysis/AnalysisTab";

export default function App() {
  const [activeTab,    setActiveTab]    = useState("dashboard");
  const [viewMode,     setViewMode]     = useState("executive");
  const [cloudFilter,  setCloudFilter]  = useState("All");
  const [scanning,     setScanning]     = useState(false);
  const [scanned,      setScanned]      = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [llmResult,    setLlmResult]    = useState(null);
  const [llmLoading,   setLlmLoading]   = useState(false);
  const scanRef = useRef(null);

  const filteredRoles = cloudFilter === "All"
    ? ALL_ROLES
    : ALL_ROLES.filter(r => r.cloud === cloudFilter);

  function handleScan() {
    setScanning(true); setScanned(false);
    setTimeout(() => { setScanning(false); setScanned(true); }, 2200);
  }

  async function handleAnalyze(role) {
    setSelectedRole(role);
    setLlmResult(null);
    setLlmLoading(true);
    setActiveTab("analysis");
    try {
      const result = await analyzeIAMRole(role);
      setLlmResult(result);
    } catch (err) {
      setLlmResult({ error: "Analysis failed. Check your API connection.", detail: err.message });
    }
    setLlmLoading(false);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: theme.bg.page }}>
      <style>{globalStyles}</style>

      {/* Fixed left sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main column */}
      <div style={{ marginLeft: theme.sidebarWidth, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Fixed top navbar */}
        <TopNavbar
          activeTab={activeTab}
          cloudFilter={cloudFilter}
          setCloudFilter={setCloudFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          scanning={scanning}
          onScan={handleScan}
          scanned={scanned}
        />

        {/* Page content (offset by navbar height) */}
        <main style={{ marginTop: theme.navbarHeight, padding: 24, flex: 1 }}>
          {activeTab === "dashboard" && (
            <DashboardTab
              allRoles={filteredRoles}
              viewMode={viewMode}
              onRoleClick={handleAnalyze}
            />
          )}
          {activeTab === "roles" && (
            <RolesTab
              allRoles={filteredRoles}
              onAnalyze={handleAnalyze}
            />
          )}
          {activeTab === "analysis" && (
            <AnalysisTab
              selectedRole={selectedRole}
              llmResult={llmResult}
              llmLoading={llmLoading}
              onReanalyze={() => selectedRole && handleAnalyze(selectedRole)}
            />
          )}
          {(activeTab === "reports" || activeTab === "settings") && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 40 }}>🚧</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.text.primary, textTransform: "capitalize" }}>{activeTab} — Coming Soon</div>
              <div style={{ fontSize: 13, color: theme.text.secondary }}>This section is under development.</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
