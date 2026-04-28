import { useCallback, useEffect, useState } from "react";
import { CMS_DOCUMENT_KEYS } from "../../../lib/cmsDefaults";
import {
  getCmsRevisionPayload,
  listCmsRevisions,
  restoreCmsRevision,
} from "../../../lib/cmsAdminApi";

export default function CmsHistoryForm() {
  const [contentKey, setContentKey] = useState(CMS_DOCUMENT_KEYS[0].key);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [previewId, setPreviewId] = useState(null);
  const [previewJson, setPreviewJson] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setMsg({ type: "", text: "" });
    setPreviewId(null);
    setPreviewJson("");
    try {
      setRows(await listCmsRevisions(contentKey));
    } catch (e) {
      setMsg({ type: "err", text: e.message });
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [contentKey]);

  useEffect(() => {
    load();
  }, [load]);

  async function showPreview(id) {
    setPreviewId(id);
    setPreviewLoading(true);
    setPreviewJson("");
    try {
      const { payload } = await getCmsRevisionPayload(id);
      setPreviewJson(JSON.stringify(payload, null, 2));
    } catch (e) {
      setPreviewJson(`Error: ${e.message}`);
    } finally {
      setPreviewLoading(false);
    }
  }

  async function restore(id) {
    if (
      !window.confirm(
        "Restore this version? The current live content will be saved as another backup first.",
      )
    )
      return;
    setMsg({ type: "", text: "" });
    try {
      await restoreCmsRevision(id);
      setMsg({ type: "ok", text: "Restored. The public site has been updated." });
      await load();
    } catch (e) {
      setMsg({ type: "err", text: e.message });
    }
  }

  return (
    <>
      <h1 className="admin-page-title">Revisions</h1>
      <p className="admin-page-sub">
        Prior saves per document (last {30} per key). Requires migration{" "}
        <code style={{ color: "var(--accent)" }}>
          20260427150000_cms_revisions.sql
        </code>
        .
      </p>
      <div className="admin-panel">
      <div
        className="admin-field admin-field--full"
        style={{ maxWidth: 480, marginBottom: "1rem" }}
      >
        <label>Document</label>
        <select
          value={contentKey}
          onChange={(e) => setContentKey(e.target.value)}
        >
          {CMS_DOCUMENT_KEYS.map(({ key, label }) => (
            <option key={key} value={key}>
              {key} — {label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="admin-btn admin-btn--ghost"
        onClick={load}
        disabled={loading}
        style={{ marginBottom: "1rem" }}
      >
        Refresh
      </button>

      {msg.text ? (
        <p
          className={`admin-msg ${msg.type === "ok" ? "admin-msg--ok" : "admin-msg--err"}`}
        >
          {msg.text}
        </p>
      ) : null}

      {loading ? <p className="admin-page-sub">Loading…</p> : null}

      {!loading && rows.length === 0 ? (
        <p className="admin-page-sub">
          No backups yet. Backups are created when you save changes to this
          document.
        </p>
      ) : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Saved at</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.65rem" }}
                    onClick={() => showPreview(r.id)}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    className="admin-btn"
                    style={{
                      padding: "0.4rem 0.75rem",
                      fontSize: "0.65rem",
                      marginLeft: "0.35rem",
                    }}
                    onClick={() => restore(r.id)}
                  >
                    Restore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewId ? (
        <div className="admin-cms-revision-preview">
          <h3 style={{ fontSize: "0.85rem", margin: "1.25rem 0 0.5rem" }}>
            Snapshot preview
          </h3>
          {previewLoading ? <p className="admin-page-sub">Loading…</p> : null}
          {!previewLoading && previewJson ? (
            <pre className="admin-cms-revision-pre">{previewJson}</pre>
          ) : null}
        </div>
      ) : null}
      </div>
    </>
  );
}
