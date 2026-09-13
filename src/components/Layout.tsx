import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { CalendarDays, ChartNoAxesCombined, Compass, Focus, Home, Library, Map, Menu, Moon, RotateCcw, Settings, Sparkles, X, LogOut, User as UserIcon, Shield, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme, useAuth } from "../context";
import { Chatbot } from "./Chatbot";
import { db, type ConnectionStatus } from "../lib/db";

const nav = [
  { to: "/", label: "Today", icon: Home },
  { to: "/tracker", label: "Daily check-in", icon: Sparkles },
  { to: "/focus", label: "Focus", icon: Focus },
  { to: "/reset", label: "Reset", icon: RotateCcw },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/insights", label: "Insights", icon: ChartNoAxesCombined },
  { to: "/mind-map", label: "Mind map", icon: Map },
  { to: "/learn", label: "Learn", icon: Compass },
  { to: "/sources", label: "Sources", icon: Library },
];

export function Layout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const [status, setStatus] = useState<ConnectionStatus>({
    mode: "local",
    connected: true,
    message: "Local Storage Active"
  });

  useEffect(() => {
    db.checkConnectionStatus().then(setStatus);
  }, []);

  const handleExportBackup = async () => {
    try {
      const data = await db.exportAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const monthStr = new Date().toISOString().slice(0, 7);
      a.download = `revive-privacy-backup-${monthStr}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error", err);
    }
  };

  // Protect all app routes: If not logged in, redirect to /auth
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <img src="/logo.png" alt="REVIVE" />
          </div>
          <div>
            <strong>REVIVE</strong>
            <span>Understand. Reset. Move.</span>
          </div>
          <button className="mobile-close" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav>
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }: { isActive: boolean }) => (isActive ? "active" : "")}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <NavLink to="/settings" onClick={() => setOpen(false)}>
            <Settings size={18} />
            <span>Settings & backup</span>
          </NavLink>
          <button className="theme-button" onClick={toggleTheme}>
            <Moon size={17} />
            <span>{theme === "light" ? "Dark" : "Light"} mode</span>
          </button>

          {/* Replaced privacy-note class with Logout button */}
          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", padding: "0 4px" }}>
              <UserIcon size={15} color="var(--accent)" />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--ink)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {currentUser.name || currentUser.identifier} {currentUser.isPrivacyMode ? "🔒" : ""}
              </span>
            </div>
            <button
              className="logout-button"
              onClick={() => {
                setOpen(false);
                logout();
                navigate("/auth");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid var(--line)",
                background: "var(--surface-2)",
                color: "#ef4444",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <LogOut size={15} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {open && <button className="mobile-backdrop" onClick={() => setOpen(false)} aria-label="Close menu" />}

      <main className="main">
        <header className="topbar">
          <button className="menu-button" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="topbar-context">Personal cognition · recovery</div>
          <div className="topbar-right">
            <span className="status-dot" style={{ background: status.connected ? "#10b981" : "#ef4444" }} />
          </div>
        </header>

        <Outlet />
        <Chatbot />
      </main>
    </div>
  );
}
