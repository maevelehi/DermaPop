import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Problems (from your doc)
 * - Mixed (7)
 * - Dry (7)
 * - Oily (7)
 */
const PROBLEMS = [
  // Mixed skin
  { id: "oilyTzone", label: "Oily T-zone", skinType: "mixed" },
  { id: "dryCheeks", label: "Dry cheeks", skinType: "mixed" },
  { id: "enlargedPores_mixed", label: "Enlarged pores", skinType: "mixed" },
  { id: "blackheads_mixed", label: "Blackheads", skinType: "mixed" },
  { id: "occasionalBreakouts", label: "Occasional breakouts", skinType: "mixed" },
  { id: "unevenSkinTone_mixed", label: "Uneven skin tone", skinType: "mixed" },
  { id: "dullness_mixed", label: "Dullness", skinType: "mixed" },

  // Dry skin
  { id: "tightness", label: "Tightness", skinType: "dry" },
  { id: "flakingPeeling", label: "Flaking / peeling", skinType: "dry" },
  { id: "damagedBarrier", label: "Damaged skin barrier", skinType: "dry" },
  { id: "fineLines", label: "Visible fine lines", skinType: "dry" },
  { id: "dullComplexion", label: "Dull complexion", skinType: "dry" },
  { id: "easilyIrritated", label: "Easily irritated", skinType: "dry" },
  { id: "roughTexture", label: "Rough texture", skinType: "dry" },

  // Oily skin
  { id: "excessOil", label: "Excess oil production", skinType: "oily" },
  { id: "cloggedPores", label: "Clogged pores", skinType: "oily" },
  { id: "frequentBreakouts", label: "Frequent breakouts", skinType: "oily" },
  { id: "enlargedPores_oily", label: "Enlarged pores", skinType: "oily" },
  { id: "blackheads_oily", label: "Blackheads", skinType: "oily" },
  { id: "shinyAppearance", label: "Shiny appearance", skinType: "oily" },
  { id: "postAcneMarks", label: "Post-acne marks", skinType: "oily" },
];

const PROBLEM_BY_ID = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));

// badge colors for each problem (you can tweak)
const BADGE_COLOR = {
  dryCheeks: "bg-purple-300",
  blackheads_mixed: "bg-blue-300",
  blackheads_oily: "bg-blue-300",
  // default fallback handled below
};

function getSelectedProblemsFromURL(search) {
  const params = new URLSearchParams(search);
  const raw = params.get("problems"); // e.g. "dryCheeks,blackheads_mixed"
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((id) => PROBLEM_BY_ID[id]); // keep only valid ids
}

// create 5 products per problem (21 problems * 5 = 105)
function buildMockProducts() {
  const perProblem = 5;
  const list = [];

  for (const problem of PROBLEMS) {
    for (let i = 1; i <= perProblem; i++) {
      list.push({
        id: `${problem.id}__p${i}`,
        problemId: problem.id, // IMPORTANT: one product belongs to one problem bucket for badge
        name: `Product ${i} for ${problem.label}`,
        brand: i % 2 === 0 ? "CeraVe" : "The Ordinary",
        active: i % 2 === 0 ? "Active 2% (placeholder)" : "Active 10% (placeholder)",
        price: Number((9.99 + i * 3.5 + (problem.id.length % 4) * 2).toFixed(2)),
        imageUrl: null, // you can replace with real image later
      });
    }
  }
  return list;
}

const ALL_PRODUCTS = buildMockProducts();

const LS_FAV_KEY = "dermapop_favorites_v1";

function HeartIcon({ filled }) {
  // simple inline SVG so you don't need extra libraries
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21s-7.2-4.35-9.6-8.25C.6 9.6 2.1 6.3 5.7 5.4c2-.5 3.7.2 4.9 1.5 1.2-1.3 2.9-2 4.9-1.5 3.6.9 5.1 4.2 3.3 7.35C19.2 16.65 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductPage() {
  const location = useLocation();

  // supports BOTH:
  // 1) navigate("/products?problems=dryCheeks,blackheads_mixed")
  // 2) navigate("/products", { state: { selectedProblems: ["dryCheeks"] } })
  const selectedProblems = useMemo(() => {
    const fromState = location.state?.selectedProblems;
    if (Array.isArray(fromState) && fromState.length) {
      return fromState.filter((id) => PROBLEM_BY_ID[id]);
    }
    return getSelectedProblemsFromURL(location.search);
  }, [location.search, location.state]);

  const showBadges = selectedProblems.length >= 2;

  // filters
  const [sortPrice, setSortPrice] = useState(""); // "", "asc", "desc"
  const [problemFilter, setProblemFilter] = useState("all"); // "all" or a problemId

  // wishlist toggle (view mode)
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // favorites: store product IDs
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_FAV_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  });

  // persist favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_FAV_KEY, JSON.stringify(Array.from(favorites)));
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const visibleProducts = useMemo(() => {
    let base = ALL_PRODUCTS;

    // if user selected problems on previous page -> only show those buckets
    if (selectedProblems.length) {
      base = base.filter((p) => selectedProblems.includes(p.problemId));
    }

    // optional filter dropdown (your "problem filter")
    if (problemFilter !== "all") {
      base = base.filter((p) => p.problemId === problemFilter);
    }

    // wishlist-only mode
    if (showWishlistOnly) {
      base = base.filter((p) => favorites.has(p.id));
    }

    // sort price
    if (sortPrice === "asc") base = [...base].sort((a, b) => a.price - b.price);
    if (sortPrice === "desc") base = [...base].sort((a, b) => b.price - a.price);

    return base;
  }, [selectedProblems, sortPrice, problemFilter, showWishlistOnly, favorites]);

  const problemOptionsForFilter = useMemo(() => {
    // if user selected problems, only show those in dropdown; else show all
    const ids = selectedProblems.length ? selectedProblems : PROBLEMS.map((p) => p.id);
    return ids.map((id) => PROBLEM_BY_ID[id]).filter(Boolean);
  }, [selectedProblems]);

  const wishlistCount = favorites.size;

  return (
    <div className="min-h-screen bg-[#F3ECE6]">
      <main className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* LEFT: Filters (1/5) */}
        <aside className="md:col-span-1">
          <div className="rounded-2xl bg-white/70 backdrop-blur p-5 shadow-sm border border-black/5">
            <h2 className="text-[#1A2B56] font-semibold text-lg mb-4">Filters</h2>

            {/* Price */}
            <details className="group rounded-xl border border-black/10 bg-white/60 px-4 py-3 mb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <span className="text-[#1A2B56] font-medium">Price</span>
                <span className="text-[#1A2B56]/60 group-open:rotate-180 transition">▾</span>
              </summary>
              <div className="pt-3 space-y-2">
                <button
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm ${
                    sortPrice === "asc" ? "bg-[#1A2B56] text-white" : "bg-white/70 text-[#1A2B56]"
                  }`}
                  onClick={() => setSortPrice("asc")}
                >
                  Lowest to highest
                </button>
                <button
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm ${
                    sortPrice === "desc" ? "bg-[#1A2B56] text-white" : "bg-white/70 text-[#1A2B56]"
                  }`}
                  onClick={() => setSortPrice("desc")}
                >
                  Highest to lowest
                </button>
                <button
                  className="w-full text-left rounded-lg px-3 py-2 text-sm bg-white/70 text-[#1A2B56]"
                  onClick={() => setSortPrice("")}
                >
                  Clear
                </button>
              </div>
            </details>

            {/* Problem */}
            <details className="group rounded-xl border border-black/10 bg-white/60 px-4 py-3">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <span className="text-[#1A2B56] font-medium">Problem</span>
                <span className="text-[#1A2B56]/60 group-open:rotate-180 transition">▾</span>
              </summary>

              <div className="pt-3">
                <select
                  value={problemFilter}
                  onChange={(e) => setProblemFilter(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm bg-white/80 border border-black/10 text-[#1A2B56]"
                >
                  <option value="all">All</option>
                  {problemOptionsForFilter.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </details>
          </div>
        </aside>

        {/* RIGHT: Product grid (4/5) */}
        <section className="md:col-span-4">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h1 className="text-[#1A2B56] text-2xl font-bold">Recommended Products</h1>
              <p className="text-[#1A2B56]/70 text-sm mt-1">
                {selectedProblems.length
                  ? `Showing products for: ${selectedProblems
                      .map((id) => PROBLEM_BY_ID[id]?.label)
                      .filter(Boolean)
                      .join(", ")}`
                  : "No problems selected (showing all mock products)."}
              </p>
            </div>

            {/* Top-right Wish List toggle */}
            <button
              onClick={() => setShowWishlistOnly((v) => !v)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold border transition ${
                showWishlistOnly
                  ? "bg-[#1A2B56] text-white border-[#1A2B56]"
                  : "bg-white/70 text-[#1A2B56] border-black/10 hover:bg-white"
              }`}
              title="Toggle Wish List"
            >
              Wish List{wishlistCount ? ` (${wishlistCount})` : ""}
            </button>
          </div>

          {/* Empty state for wishlist */}
          {showWishlistOnly && visibleProducts.length === 0 ? (
            <div className="rounded-2xl bg-white/70 border border-black/5 p-8 text-[#1A2B56]/70">
              No favorites yet. Tap the heart on a product to save it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProducts.map((p) => {
                const problemLabel = PROBLEM_BY_ID[p.problemId]?.label || "Problem";
                const badgeClass = BADGE_COLOR[p.problemId] || "bg-yellow-200";
                const isFav = favorites.has(p.id);

                return (
                  <div
                    key={p.id}
                    className="rounded-2xl overflow-hidden bg-white/80 border border-black/5 shadow-sm hover:shadow-md transition"
                  >
                    {/* TOP: image area */}
                    <div className="relative h-52 bg-gradient-to-br from-[#1A2B56]/10 to-[#1A2B56]/0 flex items-center justify-center">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="text-[#1A2B56]/40 text-sm">Image</div>
                      )}

                      {/* Heart favorite (top-right) */}
                      <button
                        onClick={() => toggleFavorite(p.id)}
                        className={`absolute top-3 right-3 rounded-full p-2 shadow border transition ${
                          isFav
                            ? "bg-white text-red-500 border-red-200"
                            : "bg-white/90 text-[#1A2B56]/60 border-black/10 hover:text-red-500"
                        }`}
                        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                        title={isFav ? "Unfavorite" : "Favorite"}
                      >
                        <HeartIcon filled={isFav} />
                      </button>

                      {/* Badge: ONLY show if multiple problems selected */}
                      {showBadges && (
                        <div
                          className={`absolute bottom-3 right-3 ${badgeClass} text-black text-xs font-semibold px-3 py-1 rounded-full shadow`}
                        >
                          {problemLabel}
                        </div>
                      )}
                    </div>

                    {/* BOTTOM: info */}
                    <div className="p-4 space-y-2">
                      <div className="text-[#1A2B56] font-semibold leading-snug">{p.name}</div>
                      <div className="text-[#1A2B56]/70 text-sm">{p.brand}</div>
                      <div className="text-[#1A2B56] text-sm">
                        <span className="text-[#1A2B56]/60">Active: </span>
                        {p.active}
                      </div>
                      <div className="text-[#1A2B56] font-bold">${p.price.toFixed(2)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}