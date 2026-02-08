import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function SkinType() {
  const [skinType, setSkinType] = useState("");
  const navigate = useNavigate();

  const handleNext = async () => {
    if (!skinType) return;

    const user = auth.currentUser;
    if (!user) return; // not logged in

    // save to Firestore
    await updateDoc(doc(db, "users", user.uid), {
      skinType: skinType,
    });

    navigate(`/problems?skin=${encodeURIComponent(skinType)}`);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Dark + blurred background */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative z-10 w-[92%] max-w-md rounded-2xl bg-[#F3ECE6] p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-[#1A2B56] mb-6">
          Choosing your skin type
        </h1>

        <div className="space-y-4">
          {["mixed", "dry", "oily"].map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer text-[#1A2B56]"
            >
              <input
                type="radio"
                name="skinType"
                value={type}
                checked={skinType === type}
                onChange={(e) => setSkinType(e.target.value)}
                className="h-5 w-5 accent-[#1A2B56]"
              />
              <span className="text-lg capitalize">{type}</span>
            </label>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!skinType}
          className={`mt-8 w-full rounded-xl py-3 font-semibold text-white transition
            ${skinType ? "bg-[#1A2B56] hover:opacity-90" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
