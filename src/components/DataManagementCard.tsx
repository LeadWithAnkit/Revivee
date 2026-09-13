import React, { useState, useEffect } from "react";
import { Download, Upload, Trash2, ShieldCheck } from "lucide-react";
import { db } from "../lib/db";
import { auth } from "../lib/auth";
import { useAppData } from "../hooks/useAppData";

export const DataManagementCard: React.FC = () => {
  const { refresh } = useAppData();
  const [lastBackup, setLastBackup] = useState<string>("Never");
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const activeUserId = auth.getActiveUserId();
    const storedBackupTime = localStorage.getItem(`revive_last_backup_${activeUserId}`);
    if (storedBackupTime) {
      setLastBackup(storedBackupTime);
    }
  }, []);

  const handleExport = async () => {
    try {
      setExporting(true);
      setStatusMsg(null);
      const data = await db.exportAll();
      const currentUser = auth.getCurrentUser();

      const payload = {
        app: "REVIVE",
        version: "1.0",
        exportDate: new Date().toISOString(),
        exportedBy: currentUser ? currentUser.identifier : "Guest",
        data
      };

      const jsonStr = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const filename = `revive-backup-${currentUser ? currentUser.id : "local"}-${new Date().toISOString().slice(0, 10)}.json`;
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const formattedNow = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const activeUserId = auth.getActiveUserId();
      localStorage.setItem(`revive_last_backup_${activeUserId}`, formattedNow);
      setLastBackup(formattedNow);
      setStatusMsg({ type: "success", text: "Data exported successfully as JSON file!" });
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: "error", text: "Export failed. Please try again." });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      setStatusMsg(null);
      const text = await file.text();
      const parsed = JSON.parse(text);

      const dataToImport = parsed.data || parsed;
      if (!dataToImport.observations && !dataToImport.sessions) {
        throw new Error("Invalid REVIVE backup format.");
      }

      await db.importAll(dataToImport);
      await refresh();
      setStatusMsg({ type: "success", text: "All observations & study logs imported successfully!" });
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: "error", text: "Import failed. File must be a valid REVIVE backup JSON." });
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const handleDeleteData = async () => {
    if (window.confirm("Are you sure you want to delete all local data for this user account? This cannot be undone.")) {
      try {
        await db.clearAll();
        await refresh();
        setStatusMsg({ type: "success", text: "All local IndexedDB data deleted successfully." });
      } catch (err) {
        console.error(err);
        setStatusMsg({ type: "error", text: "Failed to clear local data." });
      }
    }
  };

  return (
    <div className="card data-card" style={{ padding: "24px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "20px", marginTop: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--ink)", margin: 0 }}>Your Data & Backup</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", fontSize: "12px", color: "var(--accent)" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            <span>Stored locally in isolated IndexedDB</span>
          </div>
          <p style={{ fontSize: "12px", color: "var(--muted)", margin: "6px 0 0 0" }}>
            Export if needed to get all data of yours.
          </p>
        </div>
        <ShieldCheck size={22} color="var(--accent)" />
      </div>

      <div style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: "18px" }}>
        <strong>Last backup:</strong> {lastBackup}
      </div>

      {statusMsg && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "12px",
            marginBottom: "16px",
            background: statusMsg.type === "success" ? "var(--accent-soft)" : "rgba(239, 68, 68, 0.12)",
            color: statusMsg.type === "success" ? "var(--accent)" : "#ef4444",
            border: `1px solid ${statusMsg.type === "success" ? "var(--accent)" : "#ef4444"}`
          }}
        >
          {statusMsg.text}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="btn btn-secondary"
          style={{ justifyContent: "center", padding: "11px 16px", fontSize: "12px", gap: "8px" }}
        >
          <Upload size={15} />
          <span>{exporting ? "Exporting..." : "Export my data"}</span>
        </button>

        <label
          className="btn btn-secondary"
          style={{ justifyContent: "center", padding: "11px 16px", fontSize: "12px", gap: "8px", cursor: "pointer", margin: 0 }}
        >
          <Download size={15} />
          <span>{importing ? "Importing..." : "Import data"}</span>
          <input type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
        </label>

        <button
          onClick={handleDeleteData}
          style={{
            justifyContent: "center",
            padding: "11px 16px",
            fontSize: "12px",
            gap: "8px",
            background: "none",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            transition: "all 0.2s"
          }}
        >
          <Trash2 size={15} />
          <span>Delete all local data</span>
        </button>
      </div>
    </div>
  );
};
