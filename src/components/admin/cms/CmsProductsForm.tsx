import { useCallback, useEffect, useRef, useState } from "react";
import { loadCmsPayload, saveCmsPayload } from "../../../lib/cmsAdminApi";
import CmsImageField from "./CmsImageField";
import CmsSaveBar from "./CmsSaveBar";

function emptyProduct() {
  const id = Date.now();
  return {
    slug: `new-product-${id}`,
    name: "New product",
    category: "Disposable",
    tagline: "",
    description: "",
    image: "",
    showcaseImagePosition: "",
    specs: [],
    colorVariants: [],
    featureShowcase: [],
    showProductFeaturesHeading: true,
    featured: false,
    isNew: true,
  };
}

const emptyVariant = () => ({ name: "", hex: "#CCFF00", image: "" });
const emptyFeatureTile = () => ({
  title: "",
  image: "",
  showTitle: true,
  alt: "",
});

export default function CmsProductsForm() {
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [aliasRows, setAliasRows] = useState([]);
  const aliasInit = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    aliasInit.current = false;
    setEditingIndex(null);
    try {
      setDraft(await loadCmsPayload("products"));
    } catch (e) {
      setMsg({ type: "err", text: e.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!draft || aliasInit.current) return;
    aliasInit.current = true;
    setAliasRows(
      Object.entries(draft.slugAliases || {}).map(([from, to], i) => ({
        key: `alias-${i}-${from}`,
        from,
        to: to || "",
      })),
    );
  }, [draft]);

  const items = draft?.items || [];

  async function onSave() {
    if (!draft) return;
    const slugAliases = {};
    for (const r of aliasRows) {
      const f = r.from?.trim();
      if (!f) continue;
      slugAliases[f] = (r.to || "").trim() || f;
    }
    const slugs = items.map((p) => p.slug);
    const dup = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    if (dup.length) {
      setMsg({
        type: "err",
        text: `Duplicate slug(s): ${[...new Set(dup)].join(", ")}`,
      });
      return;
    }
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      await saveCmsPayload("products", { ...draft, items, slugAliases });
      setDraft({ ...draft, items, slugAliases });
      setMsg({ type: "ok", text: "Saved." });
    } catch (e) {
      setMsg({ type: "err", text: e.message });
    } finally {
      setSaving(false);
    }
  }

  function removeProduct(i) {
    if (!window.confirm("Delete this product from the catalog?")) return;
    const next = items.filter((_, j) => j !== i);
    setDraft({ ...draft, items: next });
    setEditingIndex(null);
  }

  function addProduct() {
    const next = [...items, emptyProduct()];
    setDraft({ ...draft, items: next });
    setEditingIndex(next.length - 1);
  }

  function updateProduct(i, patch) {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    setDraft({ ...draft, items: next });
  }

  if (loading || !draft)
    return (
      <>
        <h1 className="admin-page-title">Products</h1>
        <p className="admin-page-sub">
          {loading ? "Loading…" : "Unavailable."}
        </p>
      </>
    );

  const product = editingIndex != null ? items[editingIndex] : null;
  const specsText = (product?.specs || []).join("\n");
  const variants = product?.colorVariants || [];
  const tiles = product?.featureShowcase || [];

  return (
    <>
      <h1 className="admin-page-title">Products</h1>
      <p className="admin-page-sub">
        Catalog and detail pages. URL slug: <code>/products/your-slug</code>.
      </p>
      <div className="admin-panel">
      {editingIndex == null ? (
        <>
          <div className="admin-table-wrap" style={{ marginBottom: "1.5rem" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Category</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((p, i) => (
                  <tr key={`${p.slug}-${i}`}>
                    <td style={{ width: 72 }}>
                      {p.image ? (
                        <img
                          src={p.image}
                          alt=""
                          style={{
                            width: 56,
                            height: 56,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{p.name}</td>
                    <td>
                      <code style={{ fontSize: "0.78rem" }}>{p.slug}</code>
                    </td>
                    <td>{p.category}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        style={{ padding: "0.45rem 0.85rem" }}
                        onClick={() => setEditingIndex(i)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        style={{
                          padding: "0.45rem 0.85rem",
                          marginLeft: "0.35rem",
                        }}
                        onClick={() => removeProduct(i)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={addProduct}
          >
            + Add product
          </button>

          <h3 style={{ fontSize: "0.85rem", margin: "2rem 0 0.75rem" }}>
            Short URL redirects
          </h3>
          <p className="admin-cms-hint">
            If someone opens an old link, send them to the right product slug.
          </p>
          {aliasRows.map((row, i) => (
            <div
              key={row.key}
              className="admin-cms-split"
              style={{ marginBottom: "0.5rem" }}
            >
              <div className="admin-field">
                <label>Old path slug</label>
                <input
                  value={row.from}
                  onChange={(e) => {
                    const next = [...aliasRows];
                    next[i] = { ...next[i], from: e.target.value };
                    setAliasRows(next);
                  }}
                  placeholder="old-name"
                />
              </div>
              <div className="admin-field">
                <label>Redirect to slug</label>
                <input
                  value={row.to}
                  onChange={(e) => {
                    const next = [...aliasRows];
                    next[i] = { ...next[i], to: e.target.value };
                    setAliasRows(next);
                  }}
                  placeholder="topbar-9900-puffs"
                />
              </div>
              <div className="admin-field" style={{ alignSelf: "end" }}>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() =>
                    setAliasRows(aliasRows.filter((_, j) => j !== i))
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() =>
              setAliasRows([
                ...aliasRows,
                { key: `alias-${Date.now()}`, from: "", to: "" },
              ])
            }
          >
            + Add redirect
          </button>
        </>
      ) : (
        product && (
          <div className="admin-cms-card">
            <div className="admin-cms-card__head">
              <h3>Edit product</h3>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => setEditingIndex(null)}
              >
                ← Back to list
              </button>
            </div>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Slug (URL)</label>
                <input
                  value={product.slug || ""}
                  onChange={(e) =>
                    updateProduct(editingIndex, { slug: e.target.value })
                  }
                />
              </div>
              <div className="admin-field">
                <label>Name</label>
                <input
                  value={product.name || ""}
                  onChange={(e) =>
                    updateProduct(editingIndex, { name: e.target.value })
                  }
                />
              </div>
              <div className="admin-field">
                <label>Category</label>
                <input
                  value={product.category || ""}
                  onChange={(e) =>
                    updateProduct(editingIndex, { category: e.target.value })
                  }
                />
              </div>
              <div className="admin-field admin-field--full">
                <label>Short tagline</label>
                <input
                  value={product.tagline || ""}
                  onChange={(e) =>
                    updateProduct(editingIndex, { tagline: e.target.value })
                  }
                />
              </div>
              <div className="admin-field admin-field--full">
                <label>Description</label>
                <textarea
                  value={product.description || ""}
                  onChange={(e) =>
                    updateProduct(editingIndex, { description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <CmsImageField
                label="Main product image"
                value={product.image}
                onChange={(url) => updateProduct(editingIndex, { image: url })}
              />
              <div className="admin-field">
                <label>Image position (CSS)</label>
                <input
                  value={product.showcaseImagePosition || ""}
                  onChange={(e) =>
                    updateProduct(editingIndex, {
                      showcaseImagePosition: e.target.value,
                    })
                  }
                  placeholder="50% 62%"
                />
              </div>
              <div className="admin-field admin-field--full">
                <label>Bullet specs (one per line)</label>
                <textarea
                  value={specsText}
                  onChange={(e) =>
                    updateProduct(editingIndex, {
                      specs: e.target.value
                        .split(/\n/)
                        .map((l) => l.trim())
                        .filter(Boolean),
                    })
                  }
                  rows={5}
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
                    checked={product.showProductFeaturesHeading !== false}
                    onChange={(e) =>
                      updateProduct(editingIndex, {
                        showProductFeaturesHeading: e.target.checked,
                      })
                    }
                  />
                  Show “Product features” heading on detail page
                </label>
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
                    checked={Boolean(product.featured)}
                    onChange={(e) =>
                      updateProduct(editingIndex, {
                        featured: e.target.checked,
                      })
                    }
                  />
                  Featured (for internal flags)
                </label>
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
                    checked={Boolean(product.isNew)}
                    onChange={(e) =>
                      updateProduct(editingIndex, { isNew: e.target.checked })
                    }
                  />
                  Show “New” badge in listings
                </label>
              </div>
            </div>

            <h4 style={{ fontSize: "0.8rem", margin: "1.25rem 0 0.5rem" }}>
              Flavors / color variants
            </h4>
            {variants.map((v, vi) => (
              <div
                key={vi}
                className="admin-cms-card"
                style={{ background: "transparent" }}
              >
                <div className="admin-cms-card__head">
                  <h3>Variant {vi + 1}</h3>
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    onClick={() =>
                      updateProduct(editingIndex, {
                        colorVariants: variants.filter((_, j) => j !== vi),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="admin-cms-split">
                  <div className="admin-field">
                    <label>Name</label>
                    <input
                      value={v.name || ""}
                      onChange={(e) => {
                        const next = [...variants];
                        next[vi] = { ...next[vi], name: e.target.value };
                        updateProduct(editingIndex, { colorVariants: next });
                      }}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Color (hex)</label>
                    <input
                      value={v.hex || ""}
                      onChange={(e) => {
                        const next = [...variants];
                        next[vi] = { ...next[vi], hex: e.target.value };
                        updateProduct(editingIndex, { colorVariants: next });
                      }}
                    />
                  </div>
                </div>
                <CmsImageField
                  label="Variant image"
                  value={v.image}
                  onChange={(url) => {
                    const next = [...variants];
                    next[vi] = { ...next[vi], image: url };
                    updateProduct(editingIndex, { colorVariants: next });
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() =>
                updateProduct(editingIndex, {
                  colorVariants: [...variants, emptyVariant()],
                })
              }
            >
              + Add variant
            </button>

            <h4 style={{ fontSize: "0.8rem", margin: "1.25rem 0 0.5rem" }}>
              Feature gallery (detail page)
            </h4>
            {tiles.map((tile, ti) => (
              <div
                key={ti}
                className="admin-cms-card"
                style={{ background: "transparent" }}
              >
                <div className="admin-cms-card__head">
                  <h3>Tile {ti + 1}</h3>
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    onClick={() =>
                      updateProduct(editingIndex, {
                        featureShowcase: tiles.filter((_, j) => j !== ti),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Title (optional)</label>
                    <input
                      value={tile.title || ""}
                      onChange={(e) => {
                        const next = [...tiles];
                        next[ti] = { ...next[ti], title: e.target.value };
                        updateProduct(editingIndex, { featureShowcase: next });
                      }}
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
                        checked={tile.showTitle !== false}
                        onChange={(e) => {
                          const next = [...tiles];
                          next[ti] = {
                            ...next[ti],
                            showTitle: e.target.checked,
                          };
                          updateProduct(editingIndex, {
                            featureShowcase: next,
                          });
                        }}
                      />
                      Show title on image
                    </label>
                  </div>
                  <div className="admin-field admin-field--full">
                    <label>Image alt text</label>
                    <input
                      value={tile.alt || ""}
                      onChange={(e) => {
                        const next = [...tiles];
                        next[ti] = { ...next[ti], alt: e.target.value };
                        updateProduct(editingIndex, { featureShowcase: next });
                      }}
                    />
                  </div>
                  <CmsImageField
                    label="Image"
                    value={tile.image}
                    onChange={(url) => {
                      const next = [...tiles];
                      next[ti] = { ...next[ti], image: url };
                      updateProduct(editingIndex, { featureShowcase: next });
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() =>
                updateProduct(editingIndex, {
                  featureShowcase: [...tiles, emptyFeatureTile()],
                })
              }
            >
              + Add feature tile
            </button>

            <div style={{ marginTop: "1rem" }}>
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={() => removeProduct(editingIndex)}
              >
                Delete this product
              </button>
            </div>
          </div>
        )
      )}

      <CmsSaveBar onSave={onSave} saving={saving} message={msg} />
      </div>
    </>
  );
}
