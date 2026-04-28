import { useCallback, useEffect, useState } from "react";
import { loadCmsPayload, saveCmsPayload } from "../../../lib/cmsAdminApi";
import CmsSaveBar from "./CmsSaveBar";

const emptyLink = () => ({ label: "", path: "" });
const emptySection = () => ({ title: "", links: [emptyLink()] });

export default function CmsNavForm() {
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setDraft(await loadCmsPayload("navigation"));
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
      await saveCmsPayload("navigation", draft);
      setMsg({ type: "ok", text: "Saved." });
    } catch (e) {
      setMsg({ type: "err", text: e.message });
    } finally {
      setSaving(false);
    }
  }

  const primaryNav = draft?.primaryNav || [];

  function setNav(next) {
    setDraft({ ...draft, primaryNav: next });
  }

  function updateItem(i, patch) {
    const next = [...primaryNav];
    next[i] = { ...next[i], ...patch };
    setNav(next);
  }

  function removeItem(i) {
    if (!window.confirm("Remove this menu item?")) return;
    setNav(primaryNav.filter((_, j) => j !== i));
  }

  function addItem() {
    setNav([
      ...primaryNav,
      { label: "New link", path: "/", children: undefined },
    ]);
  }

  function toggleMega(i, on) {
    const item = primaryNav[i];
    updateItem(i, {
      children: on
        ? item.children?.length
          ? item.children
          : [emptySection()]
        : undefined,
    });
  }

  function updateSection(itemIndex, sectionIndex, patch) {
    const item = primaryNav[itemIndex];
    const children = [...(item.children || [])];
    children[sectionIndex] = { ...children[sectionIndex], ...patch };
    updateItem(itemIndex, { children });
  }

  function addSection(itemIndex) {
    const item = primaryNav[itemIndex];
    updateItem(itemIndex, {
      children: [...(item.children || []), emptySection()],
    });
  }

  function removeSection(itemIndex, sectionIndex) {
    const item = primaryNav[itemIndex];
    const children = (item.children || []).filter((_, j) => j !== sectionIndex);
    updateItem(itemIndex, { children: children.length ? children : undefined });
  }

  function updateLink(itemIndex, sectionIndex, linkIndex, patch) {
    const item = primaryNav[itemIndex];
    const section = { ...(item.children || [])[sectionIndex] };
    const links = [...(section.links || [])];
    links[linkIndex] = { ...links[linkIndex], ...patch };
    updateSection(itemIndex, sectionIndex, { links });
  }

  function addLink(itemIndex, sectionIndex) {
    const section = (primaryNav[itemIndex].children || [])[sectionIndex];
    const links = [...(section.links || []), emptyLink()];
    updateSection(itemIndex, sectionIndex, { links });
  }

  function removeLink(itemIndex, sectionIndex, linkIndex) {
    const section = (primaryNav[itemIndex].children || [])[sectionIndex];
    const links = (section.links || []).filter((_, j) => j !== linkIndex);
    updateSection(itemIndex, sectionIndex, {
      links: links.length ? links : [emptyLink()],
    });
  }

  if (loading || !draft) {
    return (
      <>
        <h1 className="admin-page-title">Navigation</h1>
        <p className="admin-page-sub">
          {loading ? "Loading…" : "Unavailable."}
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-page-title">Navigation</h1>
      <p className="admin-page-sub">
        Primary header links and optional multi-column dropdowns.
      </p>
      <div className="admin-panel">
        {primaryNav.map((item, i) => (
          <div key={i} className="admin-cms-card">
            <div className="admin-cms-card__head">
              <h3>Menu item {i + 1}</h3>
              <div className="admin-cms-row-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() => removeItem(i)}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Label</label>
                <input
                  value={item.label || ""}
                  onChange={(e) => updateItem(i, { label: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Link (path)</label>
                <input
                  value={item.path || ""}
                  onChange={(e) => updateItem(i, { path: e.target.value })}
                  placeholder="/products"
                />
              </div>
              <div className="admin-field admin-field--full">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(item.children?.length)}
                    onChange={(e) => toggleMega(i, e.target.checked)}
                  />
                  Dropdown / mega menu
                </label>
              </div>
            </div>

            {item.children?.length ? (
              <div
                style={{
                  marginTop: "1rem",
                  paddingLeft: "0.5rem",
                  borderLeft: "2px solid var(--accent)",
                }}
              >
                {item.children.map((section, si) => (
                  <div
                    key={si}
                    className="admin-cms-card"
                    style={{ background: "transparent" }}
                  >
                    <div className="admin-cms-card__head">
                      <h3>Column {si + 1}</h3>
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        onClick={() => removeSection(i, si)}
                      >
                        Remove column
                      </button>
                    </div>
                    <div className="admin-field admin-field--full">
                      <label>Column title</label>
                      <input
                        value={section.title || ""}
                        onChange={(e) =>
                          updateSection(i, si, { title: e.target.value })
                        }
                      />
                    </div>
                    {(section.links || []).map((link, li) => (
                      <div
                        key={li}
                        className="admin-cms-split"
                        style={{ marginBottom: "0.5rem" }}
                      >
                        <div className="admin-field">
                          <label>Link label</label>
                          <input
                            value={link.label || ""}
                            onChange={(e) =>
                              updateLink(i, si, li, { label: e.target.value })
                            }
                          />
                        </div>
                        <div className="admin-field">
                          <label>Path</label>
                          <input
                            value={link.path || ""}
                            onChange={(e) =>
                              updateLink(i, si, li, { path: e.target.value })
                            }
                          />
                        </div>
                        <div
                          className="admin-field"
                          style={{ alignSelf: "end" }}
                        >
                          <button
                            type="button"
                            className="admin-btn admin-btn--ghost"
                            onClick={() => removeLink(i, si, li)}
                          >
                            Remove link
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost"
                      onClick={() => addLink(i, si)}
                    >
                      + Add link in this column
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() => addSection(i)}
                >
                  + Add column
                </button>
              </div>
            ) : null}
          </div>
        ))}

        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={addItem}
        >
          + Add menu item
        </button>
        <CmsSaveBar onSave={onSave} saving={saving} message={msg} />
      </div>
    </>
  );
}
