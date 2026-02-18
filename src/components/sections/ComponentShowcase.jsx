import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, X, Copy, Check, Crown, Lock } from "lucide-react";
import ProductCard from "../examples/ProductCard";
import AnimatedCart from "../examples/AnimatedCart";
import BookingBar from "../examples/BookingBar";
import ThemeToggle from "../examples/ThemeToggle";
import ModernDropdown from "../examples/ModernDropdown";
import ProductCardSlide from "../examples/ProductCardSlide";
import ProductCardPremium from "../examples/ProductCardPremium";
import {
  componentSourceCodes,
  premiumComponents,
} from "../../data/componentSourceCodes";

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
  isPremium = false,
}) => {
  const [activeView, setActiveView] = useState("preview"); // "preview" | "code"
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col overflow-visible transition-colors duration-300 ${overflowDropdown ? "z-[30]" : "z-20"} ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </h4>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800 transition-colors">
          <button
            onClick={() => setActiveView("preview")}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
              activeView === "preview"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Preview
          </button>
          {isPremium ? (
            <button
              onClick={() => setActiveView("code")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                activeView === "code"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/20"
                  : "text-amber-500 hover:text-amber-600 bg-amber-500/10"
              }`}
            >
              <Crown className="w-3 h-3" /> Buy
            </button>
          ) : (
            <button
              onClick={() => setActiveView("code")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                activeView === "code"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Code2 className="w-3 h-3" /> Code
            </button>
          )}
        </div>
      </div>

      {/* Card Content Container - Uses grid stack for absolute positioning overlap or simple flex */}
      <div
        className={`relative flex-1 flex flex-col ${minHeight} overflow-visible`}
      >
        {/* PREVIEW MODE */}
        <div
          className={`absolute inset-0 flex ${overflowDropdown ? "items-start pt-8" : "items-center"} justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-all duration-300 overflow-visible ${activeView === "preview" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
        >
          {/* Background Grid Effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          </div>

          {/* Live Component */}
          <div className="relative z-10 w-full flex items-center justify-center transform transition-transform duration-500 hover:scale-[1.02]">
            {children}
          </div>
        </div>

        {/* CODE MODE */}
        <div
          className={`absolute inset-0 bg-[#0d1117] transition-opacity duration-300 flex flex-col ${activeView === "code" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
        >
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                copied
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
              }`}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="flex-1 overflow-auto p-6 custom-scrollbar">
            <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────
const ComponentShowcase = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const demoRef = useRef(null);

  useGSAP(
    () => {
      // Init hidden state (prevents FOUC)
      gsap.set([headerRef.current, demoRef.current], {
        y: 40,
        opacity: 0,
      });

      gsap.to(headerRef.current, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          once: true,
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.to(demoRef.current, {
        scrollTrigger: {
          trigger: demoRef.current,
          start: "top 85%",
          once: true,
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300"
    >
      {/* Subtle background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6">
        {/* ── Header ─────────────────────────────────── */}
        <div ref={headerRef} className="text-center mb-14 max-w-3xl mx-auto">
          <span className="py-1 px-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium inline-block mb-3">
            👀 Live Demo
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            Try it Live, No Screenshots
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            The components below are{" "}
            <strong className="text-slate-900 dark:text-slate-200">
              fully interactive
            </strong>{" "}
            — hover, click, and feel the animation.
          </p>
        </div>

        {/* ── Live Demos ──────────────────────── */}
        <div ref={demoRef} className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-7xl mx-auto">
            {/* Booking Bar */}
            <ShowcaseCard
              title="Booking Bar"
              icon="🏨"
              className="md:col-span-4"
              minHeight="min-h-[750px]"
              overflowDropdown={true}
              code={componentSourceCodes["BookingBar"]}
            >
              <div className="w-full flex items-center justify-center">
                <BookingBar />
              </div>
            </ShowcaseCard>

            {/* Theme Toggle */}
            <ShowcaseCard
              title="Theme Toggle"
              icon="🌓"
              className="md:col-span-2"
              minHeight="min-h-[300px]"
              code={componentSourceCodes["ThemeToggle"]}
            >
              <div className="flex items-center justify-center scale-[1.5]">
                <ThemeToggle />
              </div>
            </ShowcaseCard>

            {/* ProductCard */}
            <ShowcaseCard
              title="Product Card"
              icon="🛍️"
              className="md:col-span-2 row-span-2"
              minHeight="min-h-[620px]"
              code={componentSourceCodes["ProductCard"]}
            >
              <div className="flex items-center justify-center scale-90">
                <ProductCard />
              </div>
            </ShowcaseCard>

            {/* Animated Cart */}
            <ShowcaseCard
              title="Animated Cart"
              icon="🛒"
              className="md:col-span-2"
              minHeight="min-h-[400px]"
              code={componentSourceCodes["AnimatedCart"]}
            >
              <div className="flex items-center justify-center scale-[2]">
                <AnimatedCart />
              </div>
            </ShowcaseCard>

            {/* Modern Dropdown */}
            <ShowcaseCard
              title="Modern Dropdown"
              icon="💧"
              className="md:col-span-2"
              minHeight="min-h-[400px]"
              code={componentSourceCodes["ModernDropdown"]}
            >
              <div className="flex items-center justify-center">
                <ModernDropdown />
              </div>
            </ShowcaseCard>

            {/* ── Premium Section Divider ── */}
            <div className="md:col-span-6 flex items-center gap-4 my-4">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 tracking-wide">
                  Premium Components
                </span>
              </div>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
            </div>

            {/* ProductCardSlide (Premium) */}
            <ShowcaseCard
              title="Slide Card"
              icon="👟"
              className="md:col-span-2 row-span-2"
              minHeight="min-h-[620px]"
              isPremium={true}
              code={componentSourceCodes["ProductCardSlide"]}
            >
              <div className="flex items-center justify-center scale-90">
                <ProductCardSlide />
              </div>
            </ShowcaseCard>

            {/* ProductCardPremium (Premium) */}
            <ShowcaseCard
              title="Premium Card"
              icon="🔥"
              className="md:col-span-2 row-span-2"
              minHeight="min-h-[620px]"
              isPremium={true}
              code={componentSourceCodes["ProductCardPremium"]}
            >
              <div className="flex items-center justify-center scale-[0.85]">
                <ProductCardPremium />
              </div>
            </ShowcaseCard>

            {/* Premium CTA */}
            <div className="md:col-span-2 row-span-2 flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/20">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
                Unlock Premium
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 leading-relaxed">
                Get access to premium components with advanced animations,
                interactions, and production-ready code.
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  $4.99
                </span>
                <span className="text-sm text-slate-400 line-through">
                  $9.99
                </span>
              </div>
              <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-sm">
                <Lock className="w-4 h-4" />
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComponentShowcase;
