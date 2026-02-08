import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const PROBLEMS = [
  { id: "oilyTzone", label: "Oily T-zone", skinType: "mixed" },
  { id: "dryCheeks", label: "Dry cheeks", skinType: "mixed" },
  { id: "enlargedPores", label: "Enlarged pores", skinType: "mixed" },
  { id: "blackheads", label: "Blackheads", skinType: "mixed" },
  {
    id: "occasionalBreakouts",
    label: "Occasional breakouts",
    skinType: "mixed",
  },
  { id: "unevenTone", label: "Uneven skin tone", skinType: "mixed" },
  { id: "dullness", label: "Dullness", skinType: "mixed" },

  { id: "tightness", label: "Tightness", skinType: "dry" },
  { id: "flaking", label: "Flaking / peeling", skinType: "dry" },
  { id: "barrierDamage", label: "Damaged skin barrier", skinType: "dry" },
  { id: "fineLines", label: "Visible fine lines", skinType: "dry" },
  { id: "dullComplexion", label: "Dull complexion", skinType: "dry" },
  { id: "irritation", label: "Easily irritated", skinType: "dry" },
  { id: "roughTexture", label: "Rough texture", skinType: "dry" },

  { id: "excessOil", label: "Excess oil production", skinType: "oily" },
  { id: "cloggedPores", label: "Clogged pores", skinType: "oily" },
  { id: "frequentBreakouts", label: "Frequent breakouts", skinType: "oily" },
  { id: "enlargedPores", label: "Enlarged pores", skinType: "oily" },
  { id: "blackheads", label: "Blackheads", skinType: "oily" },
  { id: "shinyAppearance", label: "Shiny appearance", skinType: "oily" },
  { id: "postAcneMarks", label: "Post-acne marks", skinType: "oily" },
];

const PROBLEM_BY_ID = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));

const BADGE_COLOR = {
  dryCheeks: "bg-purple-300",
  blackheads: "bg-blue-300",
  cloggedPores: "bg-blue-200",
  excessOil: "bg-yellow-200",
  frequentBreakouts: "bg-red-200",
  enlargedPores: "bg-emerald-200",
  dullness: "bg-amber-200",
  unevenTone: "bg-indigo-200",
  postAcneMarks: "bg-pink-200",
  irritation: "bg-orange-200",
  barrierDamage: "bg-lime-200",
  flaking: "bg-slate-200",
  roughTexture: "bg-teal-200",
};

function getSelectedProblemsFromURL(search) {
  const params = new URLSearchParams(search);
  const raw = params.get("problems");
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((id) => PROBLEM_BY_ID[id]);
}

function getSkinFromURL(search) {
  const params = new URLSearchParams(search);
  const skin = params.get("skin");
  if (!skin) return "";
  const v = skin.toLowerCase();
  if (v === "oily" || v === "mixed" || v === "dry") return v;
  return "";
}

const LS_FAV_KEY = "dermapop_favorites_v2"; // bump key since we're switching to ids

function HeartIcon({ filled }) {
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

function formatActives(actives) {
  if (!actives || typeof actives !== "object") return "—";
  const entries = Object.entries(actives);
  if (!entries.length) return "—";
  return entries
    .map(([k, v]) => `${k} ${typeof v === "number" ? `${v}%` : String(v)}`)
    .join(", ");
}

export default function ProductPage() {
  const location = useLocation();

  // supports:
  // /products?skin=oily&problems=blackheads,cloggedPores
  // OR navigate("/products", { state: { skinType, selectedProblems } })
  const skinType = useMemo(() => {
    const fromState = location.state?.skinType;
    if (fromState === "oily" || fromState === "mixed" || fromState === "dry")
      return fromState;
    return getSkinFromURL(location.search);
  }, [location.search, location.state]);

  const selectedProblems = useMemo(() => {
    const fromState = location.state?.selectedProblems;
    if (Array.isArray(fromState) && fromState.length) {
      return fromState.filter((id) => PROBLEM_BY_ID[id]);
    }
    return getSelectedProblemsFromURL(location.search);
  }, [location.search, location.state]);

  const showBadges = selectedProblems.length >= 2;

  // UI filters
  const [sortPrice, setSortPrice] = useState(""); // "", "asc", "desc"
  const [problemFilter, setProblemFilter] = useState("all"); // "all" or a problemId
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // favorites (now store Firestore product.id)
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_FAV_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_FAV_KEY, JSON.stringify(Array.from(favorites)));
    } catch (e) {
      console.warn("Failed to save favorites to localStorage", e);
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

  // 🔥 Firestore results (based on URL problems)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setErr("");

      try {
        if (!selectedProblems.length) {
          if (!cancelled) setProducts([]);
          return;
        }

        const q = query(
          collection(db, "products"),
          where("problemIds", "array-contains-any", selectedProblems),
        );

        const snap = await getDocs(q);

        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // ✅ hard dedupe by Firestore id
        const unique = Array.from(new Map(list.map((p) => [p.id, p])).values());

        if (!cancelled) setProducts(unique);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setErr("Failed to load products.");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [selectedProblems]);

  const visibleProducts = useMemo(() => {
    let base = products;

    // ✅ OPTIONAL client-side filter by skinType (Firestore limitation)
    if (skinType) {
      base = base.filter(
        (p) => Array.isArray(p.skinTypes) && p.skinTypes.includes(skinType),
      );
    }

    // dropdown filter
    if (problemFilter !== "all") {
      base = base.filter(
        (p) =>
          Array.isArray(p.problemIds) && p.problemIds.includes(problemFilter),
      );
    }

    // wishlist-only
    if (showWishlistOnly) {
      base = base.filter((p) => favorites.has(p.id));
    }

    // sort
    if (sortPrice === "asc")
      base = [...base].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sortPrice === "desc")
      base = [...base].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

    return base;
  }, [
    products,
    skinType,
    sortPrice,
    problemFilter,
    showWishlistOnly,
    favorites,
  ]);

  const problemOptionsForFilter = useMemo(() => {
    let list = PROBLEMS;
    if (skinType) list = list.filter((p) => p.skinType === skinType);

    // if URL passed problems, show only those in dropdown
    if (selectedProblems.length) {
      const selectedSet = new Set(selectedProblems);
      list = list.filter((p) => selectedSet.has(p.id));
    }

    // remove duplicates by id
    const seen = new Set();
    return list.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [skinType, selectedProblems]);

  const wishlistCount = favorites.size;

  const getBadgeProblemForProduct = (p) => {
    if (!showBadges) return null;
    const matching = (p.problemIds || []).filter((id) =>
      selectedProblems.includes(id),
    );
    return matching.length ? matching[0] : null;
  };

  return (
    <div className="min-h-screen bg-[#F3ECE6]">
      <main className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* LEFT: Filters */}
        <aside className="md:col-span-1">
          <div className="rounded-2xl bg-white/70 backdrop-blur p-5 shadow-sm border border-black/5">
            <h2 className="text-[#1A2B56] font-semibold text-lg mb-4">
              Filters
            </h2>

            {/* Price */}
            <details className="group rounded-xl border border-black/10 bg-white/60 px-4 py-3 mb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <span className="text-[#1A2B56] font-medium">Price</span>
                <span className="text-[#1A2B56]/60 group-open:rotate-180 transition">
                  ▾
                </span>
              </summary>
              <div className="pt-3 space-y-2">
                <button
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm ${
                    sortPrice === "asc"
                      ? "bg-[#1A2B56] text-white"
                      : "bg-white/70 text-[#1A2B56]"
                  }`}
                  onClick={() => setSortPrice("asc")}
                >
                  Lowest to highest
                </button>
                <button
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm ${
                    sortPrice === "desc"
                      ? "bg-[#1A2B56] text-white"
                      : "bg-white/70 text-[#1A2B56]"
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
                <span className="text-[#1A2B56]/60 group-open:rotate-180 transition">
                  ▾
                </span>
              </summary>
              <div className="pt-3">
                <select
                  value={problemFilter}
                  onChange={(e) => setProblemFilter(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm bg-white/80 border border-black/10 text-[#1A2B56]"
                >
                  <option value="all">All</option>
                  {problemOptionsForFilter.map((p) => (
                    <option key={`${p.skinType}__${p.id}`} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </details>
          </div>
        </aside>

        {/* RIGHT: Grid */}
        <section className="md:col-span-4">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h1 className="text-[#1A2B56] text-2xl font-bold">
                Recommended Products
              </h1>
              <p className="text-[#1A2B56]/70 text-sm mt-1">
                {skinType
                  ? `Skin type: ${skinType}`
                  : "Skin type: (not provided)"}
                {selectedProblems.length
                  ? ` • Problems: ${selectedProblems
                      .map((id) => PROBLEM_BY_ID[id]?.label || id)
                      .join(", ")}`
                  : ""}
              </p>
            </div>

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

          {loading ? (
            <div className="rounded-2xl bg-white/70 border border-black/5 p-8 text-[#1A2B56]/70">
              Loading products…
            </div>
          ) : err ? (
            <div className="rounded-2xl bg-white/70 border border-black/5 p-8 text-[#1A2B56]/70">
              {err}
            </div>
          ) : showWishlistOnly && visibleProducts.length === 0 ? (
            <div className="rounded-2xl bg-white/70 border border-black/5 p-8 text-[#1A2B56]/70">
              No favorites yet. Tap the heart on a product to save it here.
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="rounded-2xl bg-white/70 border border-black/5 p-8 text-[#1A2B56]/70">
              No products match your current filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProducts.map((p) => {
                const isFav = favorites.has(p.id);

                const badgeProblemId = getBadgeProblemForProduct(p);
                const badgeLabel = badgeProblemId
                  ? PROBLEM_BY_ID[badgeProblemId]?.label || badgeProblemId
                  : null;
                const badgeClass = badgeProblemId
                  ? BADGE_COLOR[badgeProblemId] || "bg-yellow-200"
                  : "bg-yellow-200";

                return (
                  <div
                    key={p.id}
                    className="rounded-2xl overflow-hidden bg-white/80 border border-black/5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="relative h-52 bg-gradient-to-br from-[#1A2B56]/10 to-[#1A2B56]/0 flex items-center justify-center">
                      <img
                        src={p.imageUrl || "/placeholder.webp"}
                        alt={p.name}
                        className="h-full w-full object-contain p-4"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.webp";
                        }}
                      />

                      <button
                        onClick={() => toggleFavorite(p.id)}
                        className={`absolute top-3 right-3 rounded-full p-2 shadow border transition ${
                          isFav
                            ? "bg-white text-red-500 border-red-200"
                            : "bg-white/90 text-[#1A2B56]/60 border-black/10 hover:text-red-500"
                        }`}
                        aria-label={
                          isFav ? "Remove from favorites" : "Add to favorites"
                        }
                        title={isFav ? "Unfavorite" : "Favorite"}
                      >
                        <HeartIcon filled={isFav} />
                      </button>

                      {showBadges && badgeLabel && (
                        <div
                          className={`absolute bottom-3 right-3 ${badgeClass} text-black text-xs font-semibold px-3 py-1 rounded-full shadow`}
                        >
                          {badgeLabel}
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[#1A2B56] font-semibold leading-snug">
                        {p.name}
                      </div>
                      <div className="text-[#1A2B56]/70 text-sm">{p.brand}</div>

                      <div className="text-[#1A2B56] text-sm">
                        <span className="text-[#1A2B56]/60">Actives: </span>
                        {formatActives(p.actives)}
                      </div>

                      <div className="text-[#1A2B56] font-bold">
                        {typeof p.price === "number"
                          ? `$${p.price.toFixed(2)}`
                          : "—"}
                      </div>
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
