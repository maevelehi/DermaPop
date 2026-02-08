// src/pages/ProductDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { skinConfig } from "../data/skinConfig";

function buildProblemLabelMap() {
  // Collect all problems from skinConfig into { [problemId]: label }
  const map = {};
  try {
    Object.values(skinConfig || {}).forEach((skin) => {
      (skin?.problems || []).forEach((p) => {
        if (p?.key) map[p.key] = p.label || p.key;
      });
    });
  } catch {
    // ignore
  }
  return map;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [ingredientsOpen, setIngredientsOpen] = useState(false);

  const problemLabelMap = useMemo(() => buildProblemLabelMap(), []);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      setErrMsg("");
      try {
        const snap = await getDoc(doc(db, "products", id));
        if (!snap.exists()) {
          setErrMsg("Product not found.");
          setProduct(null);
          return;
        }
        setProduct({ id: snap.id, ...snap.data() });
      } catch (e) {
        console.error(e);
        setErrMsg("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const formatPrice = (n) => {
    const num = Number(n);
    if (!Number.isFinite(num)) return "";
    return `$${num.toFixed(2)}`;
  };

  // "Actives mapped to problems": show each problem label + active list
  // (Your data doesn't specify which active fixes which problem, so we show:
  // "For <problem>: <all actives>")
  const activePairs = useMemo(() => {
    const actives = product?.actives || {};
    return Object.entries(actives); // [ [name, value], ... ]
  }, [product]);

  const problemChips = useMemo(() => {
    const ids = product?.problemIds || [];
    return ids.map((pid) => ({
      id: pid,
      label: problemLabelMap[pid] || pid,
    }));
  }, [product, problemLabelMap]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-600">{errMsg}</p>
        <button
          className="rounded-xl px-4 py-2 bg-[#1A2B56] text-white"
          onClick={() => navigate(-1)}
        >
          Go back
        </button>
      </div>
    );
  }

  const imageUrl = product?.imageUrl || "/product-images/placeholder.webp";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* 2 invisible columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT: image */}
          <div className="flex items-start justify-center md:justify-start">
            <div className="w-full max-w-sm rounded-2xl bg-white shadow p-6">
              <img
                src={imageUrl}
                alt={product?.name || "Product"}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* RIGHT: info */}
          <div className="flex flex-col">
            {/* Brand */}
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
              {product?.brand || ""}
            </p>

            {/* Product Name */}
            <h1 className="mt-2 text-3xl font-bold text-[#1A2B56]">
              {product?.name || ""}
            </h1>

            {/* Actives mapped to problemIds */}
            <div className="mt-6">
              <h2 className="text-base font-semibold text-[#1A2B56]">
                Actives for your concerns
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {problemChips.length > 0 ? (
                  problemChips.map((p) => (
                    <span
                      key={p.id}
                      className="rounded-full bg-[#F3ECE6] px-3 py-1 text-sm text-[#1A2B56]"
                      title={p.id}
                    >
                      {p.label}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">
                    No problem tags.
                  </span>
                )}
              </div>

              <div className="mt-4 rounded-2xl bg-white shadow p-4">
                {activePairs.length > 0 ? (
                  <ul className="space-y-2">
                    {activePairs.map(([k, v]) => (
                      <li key={k} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {k}
                        </span>
                        <span className="text-sm text-gray-900">
                          {String(v)}
                          {typeof v === "number" ? "%" : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No actives listed.</p>
                )}

                {/* If you truly want "mapped per problem" */}
                {/* You can replace the box above with per-problem sections later */}
              </div>
            </div>

            {/* Price */}
            <div className="mt-6">
              <p className="text-xl font-bold text-gray-900">
                {formatPrice(product?.price)}
              </p>
            </div>

            {/* Ingredients toggle */}
            <div className="mt-8 rounded-2xl bg-white shadow">
              <button
                type="button"
                className="w-full flex items-center justify-between px-5 py-4"
                onClick={() => setIngredientsOpen((s) => !s)}
                aria-expanded={ingredientsOpen}
              >
                <span className="text-base font-semibold text-[#1A2B56]">
                  Ingredients list
                </span>

                {/* upside-down triangle on the right */}
                <span
                  className={`transition-transform ${
                    ingredientsOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>

              {ingredientsOpen && (
                <div className="px-5 pb-5">
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {(product?.ingredientsList || []).map((ing, idx) => (
                      <li key={`${ing}-${idx}`}>{ing}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Optional: CTA */}
            {/* <button className="mt-8 w-full rounded-xl bg-[#1A2B56] py-3 font-semibold text-white hover:opacity-90">
              Add to wishlist
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
