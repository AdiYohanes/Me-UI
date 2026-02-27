import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Copy, Check } from "lucide-react";
import ProductCard from "../examples/ProductCard";
import AnimatedCart from "../examples/AnimatedCart";
import BookingBar from "../examples/BookingBar";
import ThemeToggle from "../examples/ThemeToggle";
import ModernDropdown from "../examples/ModernDropdown";
import { componentSourceCodes } from "../../data/componentSourceCodes";

gsap.registerPlugin(ScrollTrigger);

// ─── Showcase Card Component ─────────────────────────────────────
const ShowcaseCard = ({
  title,
  icon,
  children,
  code,
  className = "",
  minHeight = "min-h-[300px]",
  overflowDropdown = false,
}) => {
  const [activeView, setActiveView] = useState("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-300 flex flex-col ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setActiveView("preview")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeView === "preview"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveView("code")}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeView === "code"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <Code2 className="w-3 h-3" />
            Code
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`relative flex-1 ${minHeight}`}>
        {/* Preview */}
        <div
          className={`absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-300 ${
            overflowDropdown ? "overflow-visible" : "overflow-hidden"
          } ${activeView === "preview" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
        >
          <div
            className="flex items-center justify-center w-full h-full"
            style={{ overflow: overflowDropdown ? "visible" : "hidden" }}
          >
            {children}
          </div>
        </div>

        {/* Code */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 rounded-b-2xl overflow-hidden ${
            activeView === "code"
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <div className="absolute top-2 right-2 z-20">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                copied
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="h-full overflow-auto p-4 text-xs text-slate-300 bg-slate-900 dark:bg-slate-950 font-mono leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component Showcase Section ────────────────────────────
const ComponentShowcase = () => {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".showcase-card", {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Component Showcase
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Ready-to-use UI components built with React. Preview and copy the
            source code directly.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking Bar */}
          <div className="showcase-card">
            <ShowcaseCard
              title="Booking Bar"
              icon="🏨"
              code={componentSourceCodes.BookingBar}
              minHeight="min-h-[300px]"
            >
              <div
                style={{
                  transform: "scale(0.82)",
                  transformOrigin: "center center",
                  width: "100%",
                }}
              >
                <BookingBar />
              </div>
            </ShowcaseCard>
          </div>

          {/* Theme Toggle */}
          <div className="showcase-card">
            <ShowcaseCard
              title="Theme Toggle"
              icon="🌓"
              code={componentSourceCodes.ThemeToggle}
              minHeight="min-h-[220px]"
            >
              <ThemeToggle />
            </ShowcaseCard>
          </div>

          {/* Product Card — scaled down to fit */}
          <div className="showcase-card">
            <ShowcaseCard
              title="Product Card"
              icon="🛍️"
              code={componentSourceCodes.ProductCard}
              minHeight="min-h-[500px]"
            >
              <div
                style={{
                  transform: "scale(0.76)",
                  transformOrigin: "center center",
                  flexShrink: 0,
                }}
              >
                <ProductCard />
              </div>
            </ShowcaseCard>
          </div>

          {/* Animated Cart */}
          <div className="showcase-card">
            <ShowcaseCard
              title="Animated Cart"
              icon="🛒"
              code={componentSourceCodes.AnimatedCart}
              minHeight="min-h-[280px]"
            >
              <AnimatedCart />
            </ShowcaseCard>
          </div>

          {/* Modern Dropdown — full width, overflow visible for dropdown */}
          <div className="showcase-card md:col-span-2">
            <ShowcaseCard
              title="Modern Dropdown"
              icon="💧"
              code={componentSourceCodes.ModernDropdown}
              minHeight="min-h-[320px]"
              overflowDropdown
            >
              <ModernDropdown />
            </ShowcaseCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComponentShowcase;
