import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F3ECE6] overflow-hidden">
      <main className="mx-auto max-w-6xl px-10 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <section className="space-y-8">
          <h1 className="text-[#1A2B56] leading-tight">
            <span className="block text-xl font-light tracking-wide italic">
              Welcome to
            </span>
            <span className="block text-7xl md:text-8xl font-bold tracking-tight">
              DermaPop
            </span>
          </h1>

          <p className="text-[#1A2B56]/70 max-w-md text-lg leading-relaxed font-light">
            Personalized skincare powered by ingredient purity. We rank products
            by targeted actives and show clear percentages—no confusing ingredient
            lists, just clarity.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-fit bg-[#1A2B56] text-white px-12 py-4 rounded-full text-sm font-semibold tracking-wide
                       shadow-xl transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            Get Started
          </button>
        </section>

        {/* RIGHT */}
        <section className="relative flex justify-center items-center">
          {/* Big % background */}
          <div className="pointer-events-none absolute -right-2 -top-50 select-none">
            <span className="text-[22rem] md:text-[34rem] font-black text-[#1A2B56] opacity-[0.08] leading-none">
              %
            </span>
          </div>

          {/* Product (from public folder) */}
          <div className="relative z-10 w-72 md:w-96 h-[520px] md:h-[620px] overflow-hidden">
            <img
              src="/landing.png"
              alt="Product"
              className="h-full w-full object-cover object-[50%_55%]
                         drop-shadow-[0_35px_40px_rgba(0,0,0,0.22)]
                         transition-transform duration-700 hover:scale-105"
            />
          </div>
        </section>
      </main>
    </div>
  );
}