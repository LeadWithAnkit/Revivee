import { useRef } from "react";
import { FileJson, ShieldCheck, Upload, Download, Shield } from "lucide-react";
import { Card, Button, SectionTitle } from "../components/ui";
import { db } from "../lib/db";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../context";

export default function Settings() {
  const input = useRef<HTMLInputElement>(null);
  const { refresh } = useAppData();
  const { currentUser } = useAuth();

  const exportData = async () => {
    const data = await db.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revive-privacy-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file?: File) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      await db.importAll(data);
      await refresh();
      alert("REVIVE backup successfully imported.");
    } catch {
      alert("That backup file could not be imported.");
    }
  };

  return (
    <div className="page">
      <SectionTitle
        eyebrow="Settings & Data Privacy"
        title="Control your data & account privacy."
        body="REVIVE keeps your data completely local, private, and secure inside your browser's IndexedDB storage. You can export or import your full history anytime."
      />

      {/* Monthly Privacy Mode Backup Alert (Only for Local-Only / Privacy Mode users) */}
      {currentUser?.isPrivacyMode && (
        <Card style={{ background: "color-mix(in srgb, var(--accent) 12%, var(--surface))", border: "1px solid var(--accent)", marginBottom: "20px" }}>
          <div className="privacy-banner-container">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--accent)", display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}>
                <Shield size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "var(--ink)" }}>Monthly Backup Reminder (Privacy Mode Active)</h4>
                <p className="muted" style={{ margin: "3px 0 0", fontSize: "12px", lineHeight: "1.45" }}>
                  Your account is operating in Privacy Mode (Local-Only Storage). Data is stored 100% on this device and not synced to cloud MongoDB servers. Remember to export your JSON backup monthly!
                </p>
              </div>
            </div>
            <Button onClick={exportData} variant="primary" style={{ padding: "8px 16px", fontSize: "12px", gap: "6px", flexShrink: 0 }}>
              <Upload size={15} /> Export Monthly JSON Backup
            </Button>
          </div>
        </Card>
      )}

      <div className="settings-grid">
        {/* Card 1: How to use Import & Export */}
        <Card>
          <span className="eyebrow">
            <FileJson size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} /> Data Management Guide
          </span>
          <h3 style={{ fontSize: "17px", margin: "6px 0 8px" }}>How to Use Import & Export</h3>
          <p className="muted" style={{ fontSize: "12.5px", lineHeight: "1.6" }}>
            Easily back up and transfer your complete REVIVE data locally using a single JSON file:
          </p>
          <ul style={{ fontSize: "12px", color: "var(--muted)", paddingLeft: "18px", margin: "10px 0 14px", lineHeight: "1.6" }}>
            <li style={{ marginBottom: "6px" }}>
              <strong>Exporting Data:</strong> Click <strong>"Export backup"</strong> to download a <code>.json</code> file containing all your local observations, focus sessions, tracker activities, and preferences.
            </li>
            <li>
              <strong>Importing Data:</strong> Click <strong>"Import backup"</strong> and select your downloaded <code>.json</code> file to instantly restore your complete history into your active browser session.
            </li>
          </ul>
        </Card>

        {/* Card 2: Privacy & Account Migration */}
        <Card>
          <span className="eyebrow">
            <ShieldCheck size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} /> Privacy & Account Mobility
          </span>
          <h3 style={{ fontSize: "17px", margin: "6px 0 8px" }}>Why Privacy Matters & Account Transfer</h3>
          <p className="muted" style={{ fontSize: "12.5px", lineHeight: "1.6" }}>
            Your personal cognition and daily logs belong entirely to you:
          </p>
          <ul style={{ fontSize: "12px", color: "var(--muted)", paddingLeft: "18px", margin: "10px 0 14px", lineHeight: "1.6" }}>
            <li style={{ marginBottom: "6px" }}>
              <strong>100% Local & Private:</strong> All your data remains safely stored inside your device's isolated browser IndexedDB storage. No third-party telemetry, ads, or background tracking.
            </li>
            <li>
              <strong>Shift Data to New Account:</strong> Shifting to a new account, browser, or device? Simply export your downloaded <code>.json</code> backup file from your old account and import it into your new account to keep all your data intact.
            </li>
          </ul>
        </Card>

        {/* Card 3: Export Action */}
        <Card>
          <span className="eyebrow">Export</span>
          <h3>Export your REVIVE data</h3>
          <p className="muted" style={{ fontSize: "12px", marginBottom: "14px" }}>
            Export if needed to get all data of yours as a JSON backup file.
          </p>
          <Button onClick={exportData} variant="primary">
            <Upload size={16} /> Export backup
          </Button>
        </Card>

        {/* Card 4: Import Action */}
        <Card>
          <span className="eyebrow">Restore</span>
          <h3>Import a backup</h3>
          <p className="muted" style={{ fontSize: "12px", marginBottom: "14px" }}>
            Select a previously exported JSON backup file to restore into your active account.
          </p>
          <input
            ref={input}
            type="file"
            accept="application/json"
            hidden
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => importData(e.target.files?.[0])}
          />
          <Button onClick={() => input.current?.click()} variant="soft">
            <Download size={16} /> Import backup
          </Button>
        </Card>
      </div>
    </div>
  );
}

