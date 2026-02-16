import React, { useState } from "react";
import { componentSourceCodes } from "../data/componentSourceCodes";
import { Link } from "react-router-dom";
import { Code2, Check, Copy, ChevronRight } from "lucide-react";
import BookingBar from "../components/examples/BookingBar";
import ThemeToggle from "../components/examples/ThemeToggle";
import ProductCard from "../components/examples/ProductCard";
import AnimatedCart from "../components/examples/AnimatedCart";
import ModernDropdown from "../components/examples/ModernDropdown";

const componentMap = {
  BookingBar: BookingBar,
  ThemeToggle: ThemeToggle,
  ProductCard: ProductCard,
  AnimatedCart: AnimatedCart,
  ModernDropdown: ModernDropdown,
};

const ShowcasePage = () => {
  const [activeComponent, setActiveComponent] = useState("BookingBar");
  const [activeView, setActiveView] = useState("preview"); // 'preview' | 'code'
  const [copied, setCopied] = useState(false);

  // Map keys to components
  const activeCompData = {
    name: activeComponent,
    Component: componentMap[activeComponent],
    code: componentSourceCodes[activeComponent],
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCompData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-white text-slate-600 overflow-hidden font-sans">
      {/* ─── Top Header ────────────────────────────────────────── */}
      <header className="h-16 flex-shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-50">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight flex items-center gap-2"
          >
            <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              Me-UI
            </span>
          </Link>
          <span className="text-[11px] text-slate-400 pt-1 font-medium">
            by Adi Yohanes
          </span>
        </div>

        {/* Center: Title */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Showcase
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 hidden sm:flex">
            <span className="text-slate-400">{"< >"}</span>
            <span>Star</span>
          </button>

          <a
            href="https://trakteer.id/adiyohanes19/tip"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-lg shadow-slate-900/10"
          >
            Support
          </a>
        </div>
      </header>

      {/* ─── Main Content Wrapper ──────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ─── Sidebar ─────────────────────────────────────────── */}
        <aside className="w-[260px] flex-shrink-0 border-r border-slate-200 bg-slate-50/50 flex flex-col hidden md:flex">
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 pl-3">
              Components
            </h3>
            <div className="space-y-1">
              {Object.keys(componentSourceCodes).map((key) => {
                const isActive = activeComponent === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveComponent(key)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                      isActive
                        ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    <span>{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Profile Section (Mockup) */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-cyan-100 border border-slate-100 flex items-center justify-center text-xs font-bold text-blue-600">
                UP
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors truncate">
                  User Pro
                </h4>
                <p className="text-[10px] text-slate-400 truncate">
                  View Profile
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── Preview Area ────────────────────────────────────── */}
        <main className="flex-1 flex flex-col relative bg-white">
          {/* Toolbar */}
          <div className="h-16 flex items-center justify-between px-8 border-b border-slate-100 bg-white z-10">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              {activeCompData.name.replace(/([A-Z])/g, " $1").trim()}
            </h2>

            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveView("preview")}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all shadow-sm ${activeView === "preview" ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700 shadow-none"}`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveView("code")}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all shadow-sm ${activeView === "code" ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700 shadow-none"}`}
              >
                {"< >"} Code
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative flex flex-col items-center justify-center p-8 bg-slate-50/30 overflow-visible">
            {/* Simple Grid Background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            ></div>

            <div
              className={`relative z-10 w-full max-w-4xl transition-all duration-300 ${activeView === "code" ? "hidden" : "block"}`}
            >
              <div className="flex items-center justify-center min-h-[500px]">
                {activeCompData.Component ? <activeCompData.Component /> : null}
              </div>

              {/* Import Snippet */}
              <div className="mt-16 text-center">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-mono text-slate-500">
                  <span className="text-purple-600 font-semibold">import</span>
                  <span className="text-slate-900 font-semibold">{`{ ${activeCompData.name} }`}</span>
                  <span className="text-purple-600 font-semibold">from</span>
                  <span className="text-green-600">'@me-ui/react'</span>
                  <button
                    onClick={handleCopy}
                    className="ml-3 pl-3 border-l border-slate-200 hover:text-blue-600 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Code View Overlay */}
            <div
              className={`absolute inset-0 bg-[#0d1117] z-20 flex flex-col transition-opacity duration-300 ${activeView === "code" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d1117]">
                <span className="text-xs text-slate-400 font-mono">
                  source.jsx
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs items-center gap-2 flex text-slate-300 hover:text-white transition-all border border-slate-700"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied ? "Copied" : "Copy Code"}
                </button>
              </div>
              <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                  {activeCompData.code}
                </pre>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShowcasePage;
