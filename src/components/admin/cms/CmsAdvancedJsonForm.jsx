import { useCallback, useEffect, useState } from "react";
import { CMS_DOCUMENT_KEYS } from "../../../lib/cmsDefaults";
import { loadCmsPayload, saveCmsPayload } from "../../../lib/cmsAdminApi";

export default function CmsAdvancedJsonForm() {
  const [selectedKey, setSelectedKey] = useState(CMS_DOCUMENT_KEYS[0].key);
  const [editorText, setEditorText] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  const loadKey = useCallback(async (key) => {
    setMsg({ type: "", text: "" });
    try {
      const payload = await loadCmsPayload(key);
      setEditorText(JSON.stringify(payload, null, 2));
    } catch (e) {
      setMsg({ type: "err", text: e.message });
    }
  }, []);

  useEffect(() => {
    loadKey(selectedKey);
  }, [selectedKey, loadKey]);

  async function handleSave(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    let payload;
    try {
      payload = JSON.parse(editorText);
    } catch {
      setMsg({ type: "err", text: "Invalid JSON." });
      return;
    }
    setSaving(true);
    try {
      await saveCmsPayload(selectedKey, payload);
      setMsg({ type: "ok", text: "Saved." });
    } catch (e) {
      setMsg({ type: "err", text: e.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1 className="admin-page-title">JSON</h1>
      <p className="admin-page-sub">
        Direct editing of stored documents. Prefer the structured screens unless
        you know the schema; invalid data can break the public site.
      </p>
      <div className="admin-panel">
      <div className="admin-form-grid" style={{ marginBottom: "1rem" }}>
        <div className="admin-field admin-field--full">
          <label>Document</label>
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
          >
            {CMS_DOCUMENT_KEYS.map(({ key, label }) => (
              <option key={key} value={key}>
                {key} — {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <form onSubmit={handleSave}>
        <textarea
          value={editorText}
          onChange={(e) => setEditorText(e.target.value)}
          spellCheck={false}
          style={{
            width: "100%",
            minHeight: "360px",
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.8rem",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--bg-input)",
            color: "var(--text-secondary)",
            marginBottom: "0.75rem",
          }}
        />
        <button type="submit" className="admin-btn" disabled={saving}>
          {saving ? "Saving…" : "Save JSON"}
        </button>
        {msg.text ? (
          <p
            className={`admin-msg ${msg.type === "ok" ? "admin-msg--ok" : "admin-msg--err"}`}
          >
            {msg.text}
          </p>
        ) : null}
      </form>
      </div>
    </>
  );
}
