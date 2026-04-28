import { useCallback, useEffect, useState } from "react";
import {
  deleteCmsMediaFile,
  listCmsMediaFiles,
  uploadCmsAsset,
} from "../../../lib/cmsAdminApi";

export default function CmsMediaLibrary() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const load = useCallback(async () => {
    setLoading(true);
    setMsg({ type: "", text: "" });
    try {
      setFiles(await listCmsMediaFiles("public"));
    } catch (e) {
      setMsg({ type: "err", text: e.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onFiles(e) {
    const list = e.target.files;
    e.target.value = "";
    if (!list?.length) return;
    setUploading(true);
    setMsg({ type: "", text: "" });
    try {
      for (const file of list) {
        await uploadCmsAsset(file);
      }
      setMsg({ type: "ok", text: `Uploaded ${list.length} file(s).` });
      await load();
    } catch (err) {
      setMsg({ type: "err", text: err.message });
    } finally {
      setUploading(false);
    }
  }

  async function copyUrl(url) {
    try {
      await navigator.clipboard.writeText(url);
      setMsg({ type: "ok", text: "URL copied to clipboard." });
    } catch {
      setMsg({ type: "err", text: "Could not copy. Select the URL manually." });
    }
  }

  async function removeFile(path, url) {
    if (
      !window.confirm(
        "Delete this file from the library? Links using it will break.",
      )
    )
      return;
    try {
      await deleteCmsMediaFile(path);
      setMsg({ type: "ok", text: "Deleted." });
      await load();
    } catch (e) {
      setMsg({ type: "err", text: e.message });
    }
  }

  return (
    <>
      <h1 className="admin-page-title">Media</h1>
      <p className="admin-page-sub">
        Public image assets. Use <strong>Library</strong> on any image field to
        insert a file, or upload here first.
      </p>
      <div className="admin-panel">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "center",
          marginBottom: "1.25rem",
        }}
      >
        <label
          className="admin-btn admin-btn--ghost"
          style={{ cursor: uploading ? "wait" : "pointer" }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={onFiles}
            disabled={uploading}
          />
          {uploading ? "Uploading…" : "Upload images"}
        </label>
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={load}
          disabled={loading}
        >
          Refresh list
        </button>
      </div>

      {loading ? <p className="admin-page-sub">Loading…</p> : null}

      {!loading && (
        <div className="admin-cms-media-grid admin-cms-media-grid--large">
          {files.map((f) => (
            <div key={f.path} className="admin-cms-media-card">
              <div className="admin-cms-media-card__img">
                <img src={f.publicUrl} alt="" loading="lazy" />
              </div>
              <div className="admin-cms-media-card__meta">
                <code className="admin-cms-media-path" title={f.publicUrl}>
                  {f.name}
                </code>
                <div className="admin-cms-media-card__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.65rem" }}
                    onClick={() => copyUrl(f.publicUrl)}
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger"
                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.65rem" }}
                    onClick={() => removeFile(f.path, f.publicUrl)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && files.length === 0 ? (
        <p className="admin-page-sub">
          No files in the library yet. Upload images above.
        </p>
      ) : null}

      {msg.text ? (
        <p
          className={`admin-msg ${msg.type === "ok" ? "admin-msg--ok" : "admin-msg--err"}`}
          style={{ marginTop: "1rem" }}
        >
          {msg.text}
        </p>
      ) : null}
      </div>
    </>
  );
}
