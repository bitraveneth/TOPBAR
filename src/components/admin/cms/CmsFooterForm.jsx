import { useCallback, useEffect, useState } from "react";
import { loadCmsPayload, saveCmsPayload } from "../../../lib/cmsAdminApi";
import CmsSaveBar from "./CmsSaveBar";

const emptyLink = () => ({ label: "", path: "" });

export default function CmsFooterForm() {
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setDraft(await loadCmsPayload("footer"));
    } catch (e) {
      setMsg({ type: "err", text: e.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      await saveCmsPayload("footer", draft);
      setMsg({ type: "ok", text: "Saved." });
    } catch (e) {
      setMsg({ type: "err", text: e.message });
    } finally {
      setSaving(false);
    }
  }

  const columns = draft?.columns || [];

  function setCols(next) {
    setDraft({ ...draft, columns: next });
  }

  function updateColumn(ci, patch) {
    const next = [...columns];
    next[ci] = { ...next[ci], ...patch };
    setCols(next);
  }

  function addColumn() {
    setCols([...columns, { title: "New column", links: [emptyLink()] }]);
  }

  function removeColumn(ci) {
    if (!window.confirm("Remove this column and all its links?")) return;
    setCols(columns.filter((_, j) => j !== ci));
  }

  function updateColLink(ci, li, patch) {
    const col = columns[ci];
    const links = [...(col.links || [])];
    links[li] = { ...links[li], ...patch };
    updateColumn(ci, { links });
  }

  function addColLink(ci) {
    const col = columns[ci];
    updateColumn(ci, { links: [...(col.links || []), emptyLink()] });
  }

  function removeColLink(ci, li) {
    const col = columns[ci];
    const links = (col.links || []).filter((_, j) => j !== li);
    updateColumn(ci, { links: links.length ? links : [emptyLink()] });
  }

  const legalLinks = draft?.legalLinks || [];

  function setLegal(next) {
    setDraft({ ...draft, legalLinks: next });
  }

  if (loading || !draft)
    return (
      <>
        <h1 className="admin-page-title">Footer</h1>
        <p className="admin-page-sub">
          {loading ? "Loading…" : "Unavailable."}
        </p>
      </>
    );

  return (
    <>
      <h1 className="admin-page-title">Footer</h1>
      <p className="admin-page-sub">
        Columns, legal links, copyright, and decorative wordmark.
      </p>
      <div className="admin-panel">
      {columns.map((col, ci) => (
        <div key={ci} className="admin-cms-card">
          <div className="admin-cms-card__head">
            <h3>Column {ci + 1}</h3>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => removeColumn(ci)}
            >
              Remove column
            </button>
          </div>
          <div className="admin-field admin-field--full">
            <label>Heading</label>
            <input
              value={col.title || ""}
              onChange={(e) => updateColumn(ci, { title: e.target.value })}
            />
          </div>
          {(col.links || []).map((link, li) => (
            <div
              key={li}
              className="admin-cms-split"
              style={{ marginBottom: "0.5rem" }}
            >
              <div className="admin-field">
                <label>Link text</label>
                <input
                  value={link.label || ""}
                  onChange={(e) =>
                    updateColLink(ci, li, { label: e.target.value })
                  }
                />
              </div>
              <div className="admin-field">
                <label>Path</label>
                <input
                  value={link.path || ""}
                  onChange={(e) =>
                    updateColLink(ci, li, { path: e.target.value })
                  }
                />
              </div>
              <div className="admin-field" style={{ alignSelf: "end" }}>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() => removeColLink(ci, li)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => addColLink(ci)}
          >
            + Add link
          </button>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn admin-btn--ghost"
        onClick={addColumn}
        style={{ marginBottom: "1.5rem" }}
      >
        + Add column
      </button>

      <div className="admin-form-grid">
        <div className="admin-field admin-field--full">
          <label>Copyright line</label>
          <input
            value={draft.copyright || ""}
            onChange={(e) => setDraft({ ...draft, copyright: e.target.value })}
          />
        </div>
        <div className="admin-field admin-field--full">
          <label>Large wordmark (decorative)</label>
          <input
            value={draft.giantWordmark || ""}
            onChange={(e) =>
              setDraft({ ...draft, giantWordmark: e.target.value })
            }
          />
        </div>
      </div>

      <h3 style={{ fontSize: "0.85rem", margin: "1.25rem 0 0.75rem" }}>
        Legal links
      </h3>
      {legalLinks.map((link, i) => (
        <div
          key={i}
          className="admin-cms-split"
          style={{ marginBottom: "0.5rem" }}
        >
          <div className="admin-field">
            <label>Label</label>
            <input
              value={link.label || ""}
              onChange={(e) => {
                const next = [...legalLinks];
                next[i] = { ...next[i], label: e.target.value };
                setLegal(next);
              }}
            />
          </div>
          <div className="admin-field">
            <label>Path</label>
            <input
              value={link.path || ""}
              onChange={(e) => {
                const next = [...legalLinks];
                next[i] = { ...next[i], path: e.target.value };
                setLegal(next);
              }}
            />
          </div>
          <div className="admin-field" style={{ alignSelf: "end" }}>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => setLegal(legalLinks.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn admin-btn--ghost"
        onClick={() => setLegal([...legalLinks, emptyLink()])}
      >
        + Add legal link
      </button>

      <CmsSaveBar onSave={onSave} saving={saving} message={msg} />
      </div>
    </>
  );
}
