import React, { useState } from "react";
import { Heart, Trash2 } from "lucide-react";

// ─── 1. Solid Primary Button ──────────────────────────────────────────
export function ButtonSolid() {
  return (
    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      Get Started
    </button>
  );
}

// ─── 2. Ghost / Outline Button ────────────────────────────────────────
export function ButtonOutline() {
  return (
    <button className="px-6 py-3 bg-transparent text-blue-600 font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-600 hover:text-white active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      Learn More
    </button>
  );
}

// ─── 3. Gradient + Shimmer Button ────────────────────────────────────
export function ButtonGradient() {
  return (
    <button className="relative px-8 py-3 font-semibold rounded-xl text-white bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:via-purple-500 hover:to-pink-500 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-purple-500/40 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
      <span className="relative z-10">Upgrade Now</span>
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
    </button>
  );
}

// ─── 4. Loading State Button ─────────────────────────────────────────
export function ButtonLoading() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-6 py-3 font-semibold rounded-xl text-white flex items-center gap-2.5 transition-all duration-300 min-w-[160px] justify-center ${
        loading
          ? "bg-blue-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/30"
      }`}
    >
      {loading && (
        <svg
          className="animate-spin w-4 h-4 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {loading ? "Processing..." : "Submit Form"}
    </button>
  );
}

// ─── 5. Icon Button with Ripple ──────────────────────────────────────
export function ButtonIcon() {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setLiked(!liked)}
        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 overflow-hidden group ${
          liked
            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-110"
            : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-rose-50 dark:hover:bg-slate-700 hover:text-rose-500"
        }`}
      >
        <Heart
          className={`w-5 h-5 transition-transform duration-300 group-active:scale-75 ${liked ? "fill-current scale-110" : ""}`}
        />
        <span className="absolute inset-0 rounded-full bg-rose-400/30 scale-0 group-active:scale-100 group-active:opacity-0 transition-all duration-500" />
      </button>
      <span
        className={`text-xs font-medium transition-colors ${liked ? "text-rose-500" : "text-slate-400"}`}
      >
        {liked ? "Liked!" : "Like"}
      </span>
    </div>
  );
}

// ─── 6. Destructive / Danger Button ──────────────────────────────────
export function ButtonDestructive() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <button
      onClick={() => {
        setConfirmed(true);
        setTimeout(() => setConfirmed(false), 1500);
      }}
      className={`px-6 py-3 font-semibold rounded-xl flex items-center gap-2.5 transition-all duration-200 focus:outline-none ${
        confirmed
          ? "bg-red-600 text-white scale-95 shadow-inner"
          : "bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 hover:scale-105 active:scale-95"
      }`}
    >
      <Trash2 className={`w-4 h-4 ${confirmed ? "animate-bounce" : ""}`} />
      {confirmed ? "Deleted!" : "Delete Account"}
    </button>
  );
}
