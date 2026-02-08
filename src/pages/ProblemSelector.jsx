// src/pages/ProblemSelector.jsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { skinConfig } from "../data/skinConfig";
import { useEffect } from "react";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

export default function ProblemSelector() {
  const navigate = useNavigate();
  const location = useLocation();

  // read skin type from query: /problems?skin=oily
  const skin = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("skin") || "";
  }, [location.search]);

  const problems = skinConfig[skin]?.problems || [];

  const [selected, setSelected] = useState([]);
  //   useEffect(() => {
  //     if (!skin) return;

  //     (async () => {
  //       const q = query(
  //         collection(db, "products"),
  //         where("skinTypes", "array-contains", skin),
  //         limit(20),
  //       );

  //       const snap = await getDocs(q);

  //       console.log(
  //         "Products for selected skin:",
  //         skin,
  //         snap.docs.map((d) => ({ id: d.id, ...d.data() })),
  //       );
  //     })();
  //   }, [skin]);

  const toggleProblem = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleNext = async () => {
    if (selected.length === 0) return;

    const user = auth.currentUser;
    if (!user) return;

    await setDoc(
      doc(db, "users", user.uid),
      {
        problems: selected,
      },
      { merge: true },
    );

    try {
      const q = query(
        collection(db, "products"),
        where("problemIds", "array-contains-any", selected),
      );

      const snap = await getDocs(q);

      console.log(
        "Products matching selected problems:",
        snap.docs.map((d) => ({ id: d.id, ...d.data() })),
      );
    } catch (e) {
      console.error(e);
    }

    navigate(
      `/products?skin=${encodeURIComponent(skin)}&problems=${encodeURIComponent(selected.join(","))}`,
    );
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Dark + blurred background */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative z-10 w-[92%] max-w-md rounded-2xl bg-[#F3ECE6] p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-[#1A2B56] mb-6">
          Common skin problem for{" "}
          <span className="capitalize">{skin || "your skin "}</span>
        </h1>

        <div className="space-y-4">
          {problems.map((p) => (
            <label
              key={p.id}
              className="flex items-start gap-3 cursor-pointer text-[#1A2B56]"
            >
              <input
                type="checkbox"
                checked={selected.includes(p.id)}
                onChange={() => toggleProblem(p.id)}
                className="mt-1 h-5 w-5 accent-[#1A2B56]"
              />
              <div className="leading-tight">
                <div className="text-lg font-semibold">{p.label}</div>
                <div className="text-sm text-[#1A2B56]/70">
                  Best ingredient:{" "}
                  <span className="font-medium">{p.ingredient}</span>
                </div>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={selected.length === 0}
          className={`mt-8 w-full rounded-xl py-3 font-semibold text-white transition
            ${selected.length > 0 ? "bg-[#1A2B56] hover:opacity-90" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
