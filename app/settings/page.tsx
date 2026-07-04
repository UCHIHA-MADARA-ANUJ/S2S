"use client";
import { useState, useEffect } from "react";
import { Download, Upload, Trash2, Moon, Sun, Bell, BellOff, Eye, Database, Shield, Mail, CheckCircle2, Loader2, FileJson, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { getFingerprint, resetFingerprint } from "@/lib/fingerprint";

export default function SettingsPage() {
  const [fp, setFp] = useState<string | null>(null);
  const [myData, setMyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [notif, setNotif] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    (async () => {
      const f = await getFingerprint();
      setFp(f);
      setLoading(true);
      try {
        const r = await fetch(`/api/me?fp=${encodeURIComponent(f)}`);
        const d = await r.json();
        if (d.success) setMyData(d.data);
      } catch {}
      setLoading(false);
      // Load prefs
      try {
        const t = localStorage.getItem("sv:theme");
        if (t === "light") setTheme("light");
        const n = localStorage.getItem("sv:notif");
        if (n === "off") setNotif(false);
        const rm = localStorage.getItem("sv:reduce-motion");
        if (rm === "on") setReduceMotion(true);
      } catch {}
    })();
  }, []);

  const exportJSON = () => {
    if (!myData) { toast.error("No data to export"); return; }
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), fingerprint: fp, data: myData }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `skillverse-my-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported as JSON");
  };

  const exportCSV = () => {
    if (!myData) { toast.error("No data to export"); return; }
    const headers = Object.keys(myData);
    const vals = headers.map((h) => {
      const v = myData[h];
      if (v == null) return "";
      const s = String(v).replace(/"/g, '""');
      return /[,"\n]/.test(s) ? `"${s}"` : s;
    });
    const csv = [headers.join(","), vals.join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `skillverse-my-data-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported as CSV");
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(String(ev.target?.result || ""));
        if (!data.data) throw new Error("Invalid format");
        toast.success("Data imported (preview only — submit via /survey to record)");
        console.log("Imported:", data);
      } catch (err: any) {
        toast.error("Invalid JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const deleteData = async () => {
    if (!confirm("Permanently delete all your SkillVerse data? This cannot be undone.")) return;
    if (!fp) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/me?fp=${encodeURIComponent(fp)}`, { method: "DELETE" });
      const d = await r.json();
      if (d.success) {
        toast.success("Your data has been deleted");
        setMyData(null);
      } else {
        toast.error(d.error || "Delete failed");
      }
    } catch (e: any) {
      toast.error("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = (v: "dark" | "light") => {
    setTheme(v);
    try { localStorage.setItem("sv:theme", v); } catch {}
    document.documentElement.classList.toggle("light", v === "light");
  };

  const toggleNotif = () => {
    const next = !notif;
    setNotif(next);
    try { localStorage.setItem("sv:notif", next ? "on" : "off"); } catch {}
  };

  const toggleReduceMotion = () => {
    const next = !reduceMotion;
    setReduceMotion(next);
    try { localStorage.setItem("sv:reduce-motion", next ? "on" : "off"); } catch {}
    document.documentElement.style.setProperty("--sv-motion-scale", next ? "0" : "1");
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="label mb-2">SETTINGS · DATA · PRIVACY</p>
          <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight">Your data, your rules.</h1>
          <p className="text-text-secondary mt-3 max-w-xl">Export, import, or delete your SkillVerse data. Toggle preferences. Anonymous by default.</p>
        </div>

        <section className="glass p-6 mb-6">
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" /> Your data
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Device fingerprint</span>
              <code className="text-xs font-mono px-2 py-1 rounded bg-white/5">{fp || "…"}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Survey response</span>
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-text-muted" /> : myData ? <span className="text-success flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Submitted</span> : <span className="text-text-muted">Not yet</span>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
            <button onClick={exportJSON} disabled={!myData} className="btn-secondary text-xs disabled:opacity-50">
              <FileJson className="w-3.5 h-3.5" /> Export JSON
            </button>
            <button onClick={exportCSV} disabled={!myData} className="btn-secondary text-xs disabled:opacity-50">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
            </button>
            <label className="btn-secondary text-xs cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Import JSON
              <input type="file" accept="application/json" onChange={importData} className="sr-only" />
            </label>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <button onClick={deleteData} disabled={loading || !myData} className="inline-flex items-center gap-2 px-4 py-2 bg-error/10 text-error border border-error/20 rounded-lg text-xs font-semibold hover:bg-error/20 disabled:opacity-50">
              <Trash2 className="w-3.5 h-3.5" /> Delete my data
            </button>
            <p className="text-xs text-text-muted mt-2">Removes your response from our database. Cannot be undone.</p>
          </div>
        </section>

        <section className="glass p-6 mb-6">
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-accent" /> Appearance
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Theme</p>
                <p className="text-xs text-text-muted">Choose your preferred look</p>
              </div>
              <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                <button onClick={() => toggleTheme("dark")} className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 ${theme === "dark" ? "bg-primary text-white" : "text-text-secondary"}`} aria-pressed={theme === "dark"}>
                  <Moon className="w-3 h-3" /> Dark
                </button>
                <button onClick={() => toggleTheme("light")} className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 ${theme === "light" ? "bg-primary text-white" : "text-text-secondary"}`} aria-pressed={theme === "light"}>
                  <Sun className="w-3 h-3" /> Light
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div>
                <p className="text-sm">Reduce motion</p>
                <p className="text-xs text-text-muted">Turn off animations (also respects your OS setting)</p>
              </div>
              <button onClick={toggleReduceMotion} className={`w-11 h-6 rounded-full transition-colors ${reduceMotion ? "bg-primary" : "bg-white/10"}`} aria-pressed={reduceMotion} aria-label="Toggle reduce motion">
                <span className={`block w-4 h-4 bg-white rounded-full transition-transform mt-1 ${reduceMotion ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </section>

        <section className="glass p-6 mb-6">
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-secondary" /> Notifications
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Toast notifications</p>
              <p className="text-xs text-text-muted">Get feedback when actions complete (AI responses, exports, etc.)</p>
            </div>
            <button onClick={toggleNotif} className={`w-11 h-6 rounded-full transition-colors ${notif ? "bg-primary" : "bg-white/10"}`} aria-pressed={notif} aria-label="Toggle notifications">
              <span className={`block w-4 h-4 bg-white rounded-full transition-transform mt-1 ${notif ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </section>

        <section className="glass p-6 mb-6">
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-success" /> Privacy
          </h2>
          <ul className="text-sm text-text-secondary space-y-2">
            <li>✅ No login. No email. No phone. No name.</li>
            <li>✅ Device fingerprint used only to prevent duplicate surveys.</li>
            <li>✅ Your CSV uploads are processed locally + sent to Gemini. Not stored.</li>
            <li>✅ Open source. Read every line of code on GitHub.</li>
            <li>📜 Full privacy policy: <a href="/docs#privacy" className="text-primary hover:underline">/docs#privacy</a></li>
          </ul>
        </section>

        <section className="glass p-6">
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-pink-500" /> Contact
          </h2>
          <p className="text-sm text-text-secondary">
            Questions, bug reports, or feature ideas? Email{" "}
            <a href="mailto:anujphulera@gmail.com" className="text-primary hover:underline">anujphulera@gmail.com</a>{" "}
            or open an issue on <a href="https://github.com/UCHIHA-MADARA-ANUJ/S2S/issues" target="_blank" rel="noopener" className="text-primary hover:underline">GitHub</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
