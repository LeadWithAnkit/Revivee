import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Shield, Sparkles, User, Lock, Mail, Phone, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context";
import { Card, SectionTitle } from "../components/ui";

export default function Auth() {
  const navigate = useNavigate();
  const { login, signup, currentUser } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // Email or Mobile Number
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, redirect to home declaratively
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === "login") {
      const res = login(identifier, password);
      if (res.success) {
        setSuccessMsg("Welcome back to REVIVE!");
        setTimeout(() => navigate("/"), 400);
      } else {
        setError(res.error || "Authentication failed.");
      }
    } else {
      const res = signup(name, identifier, password);
      if (res.success) {
        setSuccessMsg("Account created successfully! Welcome to REVIVE.");
        setTimeout(() => navigate("/"), 400);
      } else {
        setError(res.error || "Signup failed.");
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "24px 16px"
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              margin: "0 auto 14px",
              borderRadius: "16px",
              background: "var(--surface)",
              border: "1px solid var(--line)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)"
            }}
          >
            <img src="/logo.png" alt="REVIVE" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, margin: "0 0 6px", color: "var(--ink)", letterSpacing: "-0.5px" }}>
            REVIVE
          </h1>
          <p className="muted" style={{ fontSize: "13.5px", margin: 0 }}>
            Understand. Reset. Move.
          </p>
        </div>

        {/* Auth Glassmorphism Card */}
        <Card style={{ padding: "32px 28px", borderRadius: "20px", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
          {/* Mode Switcher Tabs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4px",
              background: "var(--surface-2)",
              padding: "4px",
              borderRadius: "12px",
              marginBottom: "24px",
              border: "1px solid var(--line)"
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              style={{
                padding: "8px",
                borderRadius: "9px",
                border: 0,
                fontSize: "12.5px",
                fontWeight: 700,
                background: mode === "login" ? "var(--surface)" : "transparent",
                color: mode === "login" ? "var(--ink)" : "var(--muted)",
                boxShadow: mode === "login" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              style={{
                padding: "8px",
                borderRadius: "9px",
                border: 0,
                fontSize: "12.5px",
                fontWeight: 700,
                background: mode === "signup" ? "var(--surface)" : "transparent",
                color: mode === "signup" ? "var(--ink)" : "var(--muted)",
                boxShadow: mode === "signup" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Create Account
            </button>
          </div>

          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <h2 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 4px", color: "var(--ink)" }}>
              {mode === "login" ? "Welcome back" : "Begin your reset"}
            </h2>
            <p className="muted" style={{ fontSize: "12.5px", margin: 0 }}>
              {mode === "login"
                ? "Enter your credentials to access your personal observations."
                : "Create an isolated account for private, evidence-informed tracking."}
            </p>
          </div>

          {/* Feedback Badges */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                borderRadius: "10px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                fontSize: "12px",
                marginBottom: "18px"
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                borderRadius: "10px",
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#059669",
                fontSize: "12px",
                marginBottom: "18px"
              }}
            >
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>
            {/* Full Name field (Signup only) */}
            {mode === "signup" && (
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "6px" }}>
                  YOUR NAME
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} color="var(--muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 38px",
                      borderRadius: "10px",
                      border: "1px solid var(--line)",
                      background: "var(--surface-2)",
                      fontSize: "13px",
                      color: "var(--ink)"
                    }}
                  />
                </div>
              </div>
            )}

            {/* Email or Phone Number input */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "6px" }}>
                EMAIL OR MOBILE NUMBER
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} color="var(--muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  required
                  placeholder="name@example.com or +1234567890"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 38px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    background: "var(--surface-2)",
                    fontSize: "13px",
                    color: "var(--ink)"
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "6px" }}>
                PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="var(--muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 38px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    background: "var(--surface-2)",
                    fontSize: "13px",
                    color: "var(--ink)"
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                marginTop: "6px",
                fontSize: "13px",
                fontWeight: 700,
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <span>{mode === "login" ? "Sign In to REVIVE" : "Create My Account"}</span>
              <ArrowRight size={16} />
            </button>

          </form>
        </Card>

        {/* Security & Privacy Guarantee */}
        <div style={{ textAlign: "center", marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "var(--muted)", fontSize: "11.5px" }}>
          <Shield size={14} color="var(--accent)" />
          <span>Local-First & Offline Capable · Private Data Encryption</span>
        </div>
      </div>
    </div>
  );
}
