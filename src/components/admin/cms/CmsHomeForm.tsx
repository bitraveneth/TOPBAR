import { useCallback, useEffect, useRef, useState } from "react";
import { loadCmsPayload, saveCmsPayload } from "../../../lib/cmsAdminApi";
import CmsImageField from "./CmsImageField";
import CmsSaveBar from "./CmsSaveBar";

const SUB = [
  { id: "hero", label: "Hero carousel" },
  { id: "showcase", label: "Featured products" },
  { id: "brand", label: "Brand & tagline" },
  { id: "reviews", label: "Customer quotes" },
  { id: "blog", label: "News & events" },
];

const emptySlide = () => ({
  tag: "",
  title: "",
  subtitle: "",
  image: "",
  cta: "Discover Now",
  link: "/products",
});

function moveArr(arr, i, delta) {
  const j = i + delta;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export default function CmsHomeForm() {
  const [sub, setSub] = useState("hero");
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [flavorList, setFlavorList] = useState([]);
  const flavorInit = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    flavorInit.current = false;
    try {
      setDraft(await loadCmsPayload("home"));
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
    if (!draft || flavorInit.current) return;
    flavorInit.current = true;
    const o = draft.flavorOrderBySlug || {};
    setFlavorList(
      Object.entries(o).map(([slug, arr], i) => ({
        key: `fl-${slug}-${i}`,
        slug,
        line: Array.isArray(arr) ? arr.join(", ") : "",
      })),
    );
  }, [draft]);

  async function onSave() {
    if (!draft) return;
    const flavorOrderBySlug = {};
    for (const row of flavorList) {
      const s = row.slug?.trim();
      if (!s) continue;
      flavorOrderBySlug[s] = row.line
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }
    const payload = { ...draft, flavorOrderBySlug };
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      await saveCmsPayload("home", payload);
      setDraft(payload);
      setMsg({ type: "ok", text: "Saved." });
    } catch (e) {
      setMsg({ type: "err", text: e.message });
    } finally {
      setSaving(false);
    }
  }

  const slides = draft?.heroSlides || [];
  const brandValues = draft?.brandValues || [];
  const loved = draft?.lovedByYou || { ribbons: ["", ""], items: [] };
  const ribbons =
    loved.ribbons?.length >= 2
      ? loved.ribbons
      : [loved.ribbons?.[0] || "", loved.ribbons?.[1] || ""];
  const blog = draft?.blogPreview || { featuredPost: {}, sidePosts: [] };
  const featuredPost = blog.featuredPost || {};
  const sidePosts = blog.sidePosts || [];

  if (loading || !draft)
    return (
      <>
        <h1 className="admin-page-title">Home</h1>
        <p className="admin-page-sub">
          {loading ? "Loading…" : "Unavailable."}
        </p>
      </>
    );

  return (
    <>
      <h1 className="admin-page-title">Home</h1>
      <p className="admin-page-sub">
        Landing page: hero, featured products, brand, quotes, and news block.
      </p>
      <div className="admin-panel">
      <div className="admin-cms-subtabs">
        {SUB.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`admin-cms-subtab${sub === t.id ? " is-active" : ""}`}
            onClick={() => setSub(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {sub === "hero" && (
        <>
          <p className="admin-cms-hint">
            Large rotating banners at the top of the home page.
          </p>
          {slides.map((s, i) => (
            <div key={i} className="admin-cms-card">
              <div className="admin-cms-card__head">
                <h3>Slide {i + 1}</h3>
                <div className="admin-cms-row-actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    onClick={() =>
                      setDraft({ ...draft, heroSlides: moveArr(slides, i, -1) })
                    }
                    disabled={i === 0}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    onClick={() =>
                      setDraft({ ...draft, heroSlides: moveArr(slides, i, 1) })
                    }
                    disabled={i === slides.length - 1}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    onClick={() => {
                      if (!window.confirm("Remove this slide?")) return;
                      setDraft({
                        ...draft,
                        heroSlides: slides.filter((_, j) => j !== i),
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Small tag</label>
                  <input
                    value={s.tag || ""}
                    onChange={(e) => {
                      const next = [...slides];
                      next[i] = { ...next[i], tag: e.target.value };
                      setDraft({ ...draft, heroSlides: next });
                    }}
                  />
                </div>
                <div className="admin-field">
                  <label>Title</label>
                  <input
                    value={s.title || ""}
                    onChange={(e) => {
                      const next = [...slides];
                      next[i] = { ...next[i], title: e.target.value };
                      setDraft({ ...draft, heroSlides: next });
                    }}
                  />
                </div>
                <div className="admin-field admin-field--full">
                  <label>Subtitle</label>
                  <textarea
                    value={s.subtitle || ""}
                    onChange={(e) => {
                      const next = [...slides];
                      next[i] = { ...next[i], subtitle: e.target.value };
                      setDraft({ ...draft, heroSlides: next });
                    }}
                    rows={2}
                  />
                </div>
                <CmsImageField
                  label="Background image"
                  value={s.image}
                  onChange={(url) => {
                    const next = [...slides];
                    next[i] = { ...next[i], image: url };
                    setDraft({ ...draft, heroSlides: next });
                  }}
                />
                <div className="admin-field">
                  <label>Button text</label>
                  <input
                    value={s.cta || ""}
                    onChange={(e) => {
                      const next = [...slides];
                      next[i] = { ...next[i], cta: e.target.value };
                      setDraft({ ...draft, heroSlides: next });
                    }}
                  />
                </div>
                <div className="admin-field">
                  <label>Button link</label>
                  <input
                    value={s.link || ""}
                    onChange={(e) => {
                      const next = [...slides];
                      next[i] = { ...next[i], link: e.target.value };
                      setDraft({ ...draft, heroSlides: next });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() =>
              setDraft({ ...draft, heroSlides: [...slides, emptySlide()] })
            }
          >
            + Add slide
          </button>
        </>
      )}

      {sub === "showcase" && (
        <>
          <p className="admin-cms-hint">
            Which products appear in the home &amp; products grids, and flavor
            chip order.
          </p>
          <div className="admin-field admin-field--full">
            <label>Section title</label>
            <input
              value={draft.productShowcaseTitle || ""}
              onChange={(e) =>
                setDraft({ ...draft, productShowcaseTitle: e.target.value })
              }
            />
          </div>
          <div className="admin-field admin-field--full">
            <label>
              Featured product slugs (one per line — must match a product below)
            </label>
            <textarea
              value={(draft.featuredProductSlugs || []).join("\n")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  featuredProductSlugs: e.target.value
                    .split(/\n/)
                    .map((x) => x.trim())
                    .filter(Boolean),
                })
              }
              rows={4}
            />
          </div>
          <h3 style={{ fontSize: "0.85rem", margin: "1.25rem 0 0.5rem" }}>
            Flavor order on home page
          </h3>
          <p className="admin-cms-hint">
            For each product, list flavor names in display order
            (comma-separated). Must match variant names on the product.
          </p>
          {flavorList.map((row, i) => (
            <div
              key={row.key}
              className="admin-cms-split"
              style={{ marginBottom: "0.75rem" }}
            >
              <div className="admin-field">
                <label>Product slug</label>
                <input
                  value={row.slug}
                  onChange={(e) => {
                    const next = [...flavorList];
                    next[i] = { ...next[i], slug: e.target.value };
                    setFlavorList(next);
                  }}
                />
              </div>
              <div className="admin-field">
                <label>Flavor order</label>
                <input
                  value={row.line}
                  onChange={(e) => {
                    const next = [...flavorList];
                    next[i] = { ...next[i], line: e.target.value };
                    setFlavorList(next);
                  }}
                  placeholder="Mango, Coke Ice, Berry Grape"
                />
              </div>
              <div className="admin-field" style={{ alignSelf: "end" }}>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() =>
                    setFlavorList(flavorList.filter((_, j) => j !== i))
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
              setFlavorList([
                ...flavorList,
                { key: `fl-new-${Date.now()}`, slug: "", line: "" },
              ])
            }
          >
            + Add flavor order row
          </button>
        </>
      )}

      {sub === "brand" && (
        <>
          <div className="admin-field admin-field--full">
            <label>Large tagline (scroll section)</label>
            <textarea
              value={draft.topbarTagline || ""}
              onChange={(e) =>
                setDraft({ ...draft, topbarTagline: e.target.value })
              }
              rows={3}
            />
          </div>
          <h3 style={{ fontSize: "0.85rem", margin: "1.25rem 0 0.5rem" }}>
            Brand values
          </h3>
          {brandValues.map((v, i) => (
            <div key={i} className="admin-cms-card">
              <div className="admin-cms-card__head">
                <h3>Value {i + 1}</h3>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      brandValues: brandValues.filter((_, j) => j !== i),
                    })
                  }
                >
                  Remove
                </button>
              </div>
              <div className="admin-cms-split">
                <div className="admin-field">
                  <label>Keyword</label>
                  <input
                    value={v.keyword || ""}
                    onChange={(e) => {
                      const next = [...brandValues];
                      next[i] = { ...next[i], keyword: e.target.value };
                      setDraft({ ...draft, brandValues: next });
                    }}
                  />
                </div>
                <div className="admin-field admin-field--full">
                  <label>Description</label>
                  <textarea
                    value={v.text || ""}
                    onChange={(e) => {
                      const next = [...brandValues];
                      next[i] = { ...next[i], text: e.target.value };
                      setDraft({ ...draft, brandValues: next });
                    }}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() =>
              setDraft({
                ...draft,
                brandValues: [...brandValues, { keyword: "", text: "" }],
              })
            }
          >
            + Add value
          </button>
        </>
      )}

      {sub === "reviews" && (
        <>
          <p className="admin-cms-hint">
            Scrolling review cards on the home page.
          </p>
          <div className="admin-cms-split">
            <div className="admin-field">
              <label>Top ribbon text</label>
              <input
                value={ribbons[0] || ""}
                onChange={(e) => {
                  const r = [...ribbons];
                  r[0] = e.target.value;
                  setDraft({ ...draft, lovedByYou: { ...loved, ribbons: r } });
                }}
              />
            </div>
            <div className="admin-field">
              <label>Bottom ribbon text</label>
              <input
                value={ribbons[1] || ""}
                onChange={(e) => {
                  const r = [...ribbons];
                  r[1] = e.target.value;
                  setDraft({ ...draft, lovedByYou: { ...loved, ribbons: r } });
                }}
              />
            </div>
          </div>
          {(loved.items || []).map((item, i) => (
            <div key={i} className="admin-cms-card">
              <div className="admin-cms-card__head">
                <h3>Quote {i + 1}</h3>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      lovedByYou: {
                        ...loved,
                        items: (loved.items || []).filter((_, j) => j !== i),
                      },
                    })
                  }
                >
                  Remove
                </button>
              </div>
              <div className="admin-form-grid">
                <CmsImageField
                  label="Photo"
                  value={item.img}
                  onChange={(url) => {
                    const items = [...(loved.items || [])];
                    items[i] = { ...items[i], img: url };
                    setDraft({ ...draft, lovedByYou: { ...loved, items } });
                  }}
                />
                <div className="admin-field admin-field--full">
                  <label>Quote</label>
                  <textarea
                    value={item.text || ""}
                    onChange={(e) => {
                      const items = [...(loved.items || [])];
                      items[i] = { ...items[i], text: e.target.value };
                      setDraft({ ...draft, lovedByYou: { ...loved, items } });
                    }}
                    rows={2}
                  />
                </div>
                <div className="admin-field">
                  <label>Author label</label>
                  <input
                    value={item.author || ""}
                    onChange={(e) => {
                      const items = [...(loved.items || [])];
                      items[i] = { ...items[i], author: e.target.value };
                      setDraft({ ...draft, lovedByYou: { ...loved, items } });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() =>
              setDraft({
                ...draft,
                lovedByYou: {
                  ...loved,
                  items: [
                    ...(loved.items || []),
                    { img: "", text: "", author: "" },
                  ],
                },
              })
            }
          >
            + Add quote
          </button>
        </>
      )}

      {sub === "blog" && (
        <>
          <div className="admin-field admin-field--full">
            <label>Section heading</label>
            <input
              value={blog.sectionTitle || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  blogPreview: { ...blog, sectionTitle: e.target.value },
                })
              }
            />
          </div>
          <h3 style={{ fontSize: "0.85rem", margin: "1rem 0 0.5rem" }}>
            Featured story
          </h3>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Title</label>
              <input
                value={featuredPost.title || ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    blogPreview: {
                      ...blog,
                      featuredPost: { ...featuredPost, title: e.target.value },
                    },
                  })
                }
              />
            </div>
            <div className="admin-field">
              <label>Category</label>
              <input
                value={featuredPost.category || ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    blogPreview: {
                      ...blog,
                      featuredPost: {
                        ...featuredPost,
                        category: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
            <div className="admin-field">
              <label>Date</label>
              <input
                value={featuredPost.date || ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    blogPreview: {
                      ...blog,
                      featuredPost: { ...featuredPost, date: e.target.value },
                    },
                  })
                }
              />
            </div>
            <div className="admin-field admin-field--full">
              <label>Excerpt</label>
              <textarea
                value={featuredPost.excerpt || ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    blogPreview: {
                      ...blog,
                      featuredPost: {
                        ...featuredPost,
                        excerpt: e.target.value,
                      },
                    },
                  })
                }
                rows={2}
              />
            </div>
            <CmsImageField
              label="Image"
              value={featuredPost.image}
              onChange={(url) =>
                setDraft({
                  ...draft,
                  blogPreview: {
                    ...blog,
                    featuredPost: { ...featuredPost, image: url },
                  },
                })
              }
            />
          </div>

          <h3 style={{ fontSize: "0.85rem", margin: "1.25rem 0 0.5rem" }}>
            Side stories
          </h3>
          {sidePosts.map((post, i) => (
            <div key={i} className="admin-cms-card">
              <div className="admin-cms-card__head">
                <h3>Story {i + 1}</h3>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      blogPreview: {
                        ...blog,
                        sidePosts: sidePosts.filter((_, j) => j !== i),
                      },
                    })
                  }
                >
                  Remove
                </button>
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Title</label>
                  <input
                    value={post.title || ""}
                    onChange={(e) => {
                      const next = [...sidePosts];
                      next[i] = { ...next[i], title: e.target.value };
                      setDraft({
                        ...draft,
                        blogPreview: { ...blog, sidePosts: next },
                      });
                    }}
                  />
                </div>
                <div className="admin-field">
                  <label>Category</label>
                  <input
                    value={post.category || ""}
                    onChange={(e) => {
                      const next = [...sidePosts];
                      next[i] = { ...next[i], category: e.target.value };
                      setDraft({
                        ...draft,
                        blogPreview: { ...blog, sidePosts: next },
                      });
                    }}
                  />
                </div>
                <div className="admin-field">
                  <label>Date</label>
                  <input
                    value={post.date || ""}
                    onChange={(e) => {
                      const next = [...sidePosts];
                      next[i] = { ...next[i], date: e.target.value };
                      setDraft({
                        ...draft,
                        blogPreview: { ...blog, sidePosts: next },
                      });
                    }}
                  />
                </div>
                <div className="admin-field admin-field--full">
                  <label>Excerpt</label>
                  <textarea
                    value={post.excerpt || ""}
                    onChange={(e) => {
                      const next = [...sidePosts];
                      next[i] = { ...next[i], excerpt: e.target.value };
                      setDraft({
                        ...draft,
                        blogPreview: { ...blog, sidePosts: next },
                      });
                    }}
                    rows={2}
                  />
                </div>
                <CmsImageField
                  label="Image"
                  value={post.image}
                  onChange={(url) => {
                    const next = [...sidePosts];
                    next[i] = { ...next[i], image: url };
                    setDraft({
                      ...draft,
                      blogPreview: { ...blog, sidePosts: next },
                    });
                  }}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() =>
              setDraft({
                ...draft,
                blogPreview: {
                  ...blog,
                  sidePosts: [
                    ...sidePosts,
                    {
                      title: "",
                      category: "",
                      date: "",
                      excerpt: "",
                      image: "",
                    },
                  ],
                },
              })
            }
          >
            + Add side story
          </button>
        </>
      )}

      <CmsSaveBar onSave={onSave} saving={saving} message={msg} />
      </div>
    </>
  );
}
