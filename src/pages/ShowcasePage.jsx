import React, { useState, useMemo } from "react";
import {
  componentSourceCodes,
  premiumComponents,
} from "../data/componentSourceCodes";
import { Link } from "react-router-dom";
import { Check, Copy, ChevronRight, Sparkles, Crown, Lock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import BookingBar from "../components/examples/BookingBar";
import ThemeToggle from "../components/examples/ThemeToggle";
import ProductCard from "../components/examples/ProductCard";
import AnimatedCart from "../components/examples/AnimatedCart";
import ModernDropdown from "../components/examples/ModernDropdown";
import ProductCardSlide from "../components/examples/ProductCardSlide";
import ProductCardPremium from "../components/examples/ProductCardPremium";
import BookingBarPremium from "../components/examples/BookingBarPremium";
import ThemeTogglePremium from "../components/examples/ThemeTogglePremium";
import AnimatedCartPremium from "../components/examples/AnimatedCartPremium";

// ─── Sidebar menu items ────────────────────────────────────────────
// Each menu can have multiple variants (free + premium)
const menuItems = [
  {
    key: "BookingBar",
    emoji: "🏨",
    label: "Booking Bar",
    variants: [
      { key: "BookingBar", Component: BookingBar, isPremium: false },
      {
        key: "BookingBarPremium",
        Component: BookingBarPremium,
        isPremium: true,
      },
    ],
  },
  {
    key: "ThemeToggle",
    emoji: "🌓",
    label: "Theme Toggle",
    variants: [
      { key: "ThemeToggle", Component: ThemeToggle, isPremium: false },
      {
        key: "ThemeTogglePremium",
        Component: ThemeTogglePremium,
        isPremium: true,
      },
    ],
  },
  {
    key: "ProductCard",
    emoji: "🛍️",
    label: "Product Card",
    variants: [
      { key: "ProductCard", Component: ProductCard, isPremium: false },
      { key: "ProductCardSlide", Component: ProductCardSlide, isPremium: true },
      {
        key: "ProductCardPremium",
        Component: ProductCardPremium,
        isPremium: true,
      },
    ],
  },
  {
    key: "AnimatedCart",
    emoji: "🛒",
    label: "Animated Cart",
    variants: [
      { key: "AnimatedCart", Component: AnimatedCart, isPremium: false },
      {
        key: "AnimatedCartPremium",
        Component: AnimatedCartPremium,
        isPremium: true,
      },
    ],
  },
  {
    key: "ModernDropdown",
    emoji: "💧",
    label: "Modern Dropdown",
    variants: [
      { key: "ModernDropdown", Component: ModernDropdown, isPremium: false },
    ],
  },
];

// Per-variant display config
const variantConfig = {
  BookingBar: {
    wrapperClass: "w-full max-w-4xl",
    title: "Booking Bar",
    subtitle: "Interactive hotel booking bar with animated dropdowns",
    tag: "Free",
    tagColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  BookingBarPremium: {
    wrapperClass: "w-full max-w-[980px]",
    title: "Travel Booking Bar",
    subtitle:
      "Traveloka-style multi-tab booking with flights, hotels, trains & more",
    tag: "Premium",
    tagColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  ThemeToggle: {
    wrapperClass: "scale-[1.8]",
    title: "Theme Toggle",
    subtitle: "Dark/light mode toggle with spring animation",
    tag: "Free",
    tagColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  ThemeTogglePremium: {
    wrapperClass: "",
    title: "Scenic Day/Night Toggle",
    subtitle: "Landscape scene toggle with sun, moon, stars & rolling hills",
    tag: "Premium",
    tagColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  ProductCard: {
    wrapperClass: "",
    title: "Product Card",
    subtitle: "Sporty product card with color variants and add-to-cart",
    tag: "Free",
    tagColor: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  ProductCardSlide: {
    wrapperClass: "",
    title: "Slide Card",
    subtitle: "Clean minimal card with slide-to-add cart interaction",
    tag: "Premium",
    tagColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  ProductCardPremium: {
    wrapperClass: "",
    title: "Premium Card",
    subtitle: "Dark header card with limited edition badge & inventory status",
    tag: "Premium",
    tagColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  AnimatedCart: {
    wrapperClass: "scale-[2.5]",
    title: "Animated Cart",
    subtitle: "Animated shopping cart icon with wiggle effects",
    tag: "Free",
    tagColor: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  AnimatedCartPremium: {
    wrapperClass: "",
    title: "Interactive Cart",
    subtitle:
      "SVG cart with stacking items, rolling wheels & checkout animation",
    tag: "Premium",
    tagColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  ModernDropdown: {
    wrapperClass: "",
    title: "Modern Dropdown",
    subtitle: "Sleek user dropdown menu with staggered reveal",
    tag: "Free",
    tagColor: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  },
};

// Menu-level config
const menuConfig = {
  BookingBar: {
    accentGradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
    description:
      "Booking bars for travel — from free hotel search to premium multi-tab travel booking with flights, hotels, trains and more.",
    previewAlign: "items-start pt-10",
    minHeight: "min-h-[700px]",
  },
  ThemeToggle: {
    accentGradient: "from-purple-500/10 via-indigo-500/5 to-transparent",
    description:
      "Theme toggles — from a simple spring-animated switch to a scenic landscape day/night toggle with sun, moon, stars, clouds & rolling hills.",
    previewAlign: "items-center",
    minHeight: "min-h-[400px]",
  },
  ProductCard: {
    accentGradient: "from-orange-500/10 via-red-500/5 to-transparent",
    description:
      "Product cards for e-commerce — from free basics to premium animated designs with advanced interactions.",
    previewAlign: "items-center",
    minHeight: "min-h-[600px]",
  },
  AnimatedCart: {
    accentGradient: "from-green-500/10 via-emerald-500/5 to-transparent",
    description:
      "Animated carts — from a simple wiggle icon to a premium interactive cart with rolling wheels, fillable items, and cinematic checkout animation.",
    previewAlign: "items-center",
    minHeight: "min-h-[450px]",
  },
  ModernDropdown: {
    accentGradient: "from-slate-500/10 via-zinc-500/5 to-transparent",
    description:
      "A sleek user dropdown menu with staggered reveal animation, keyboard shortcuts, and notification badge.",
    previewAlign: "items-start pt-16",
    minHeight: "min-h-[400px]",
  },
};

// ─── Simple JSX Syntax Highlighter ─────────────────────────────────
function highlightJSX(code) {
  if (!code) return [];
  const lines = code.split("\n");
  return lines.map((line, lineIndex) => ({
    lineNumber: lineIndex + 1,
    tokens: tokenizeLine(line),
  }));
}

function tokenizeLine(line) {
  const tokens = [];
  let remaining = line;

  while (remaining.length > 0) {
    let matched = false;

    if (remaining.startsWith("//")) {
      tokens.push({ type: "comment", value: remaining });
      remaining = "";
      continue;
    }

    const patterns = [
      [/^(<\/[A-Za-z][A-Za-z0-9.]*>)/, "tag"],
      [/^(<[A-Za-z][A-Za-z0-9.]*)/, "tag"],
      [/^(\/?>)/, "tag"],
      [/^(\$\{[^}]*\})/, "template"],
      [/^("(?:[^"\\]|\\.)*")/, "string"],
      [/^('(?:[^'\\]|\\.)*')/, "string"],
      [/^(`(?:[^`\\]|\\.)*`)/, "string"],
      [
        /^(import|export|default|from|const|let|var|function|return|if|else|class|extends|new|this|typeof|null|undefined|true|false|async|await|try|catch|throw)\b/,
        "keyword",
      ],
      [
        /^(useState|useEffect|useRef|useContext|useMemo|useCallback|useGSAP|contextSafe|React)\b/,
        "react",
      ],
      [/^(\d+\.?\d*)/, "number"],
      [
        /^(className|onClick|onChange|onSubmit|onMouseEnter|onMouseLeave|onMouseDown|onTouchStart|ref|key|style|href|src|alt|disabled|type|value|placeholder|loading)(?=\s*=)/,
        "attribute",
      ],
      [/^(=>)/, "operator"],
      [/^([{}()\[\];,=])/, "punctuation"],
    ];

    for (const [regex, type] of patterns) {
      const m = remaining.match(regex);
      if (m) {
        tokens.push({ type, value: m[1] });
        remaining = remaining.slice(m[1].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push({ type: "plain", value: remaining[0] });
      remaining = remaining.slice(1);
    }
  }
  return tokens;
}

const tokenColors = {
  keyword: "text-purple-400",
  react: "text-cyan-400",
  string: "text-green-400",
  template: "text-orange-400",
  comment: "text-slate-500 italic",
  tag: "text-red-400",
  attribute: "text-yellow-300",
  number: "text-orange-300",
  operator: "text-pink-400",
  punctuation: "text-slate-400",
  plain: "text-slate-300",
};

const SyntaxHighlightedCode = ({ code }) => {
  const highlighted = useMemo(() => highlightJSX(code), [code]);
  return (
    <div className="font-mono text-[13px] leading-6">
      {highlighted.map((line) => (
        <div
          key={line.lineNumber}
          className="flex hover:bg-white/[0.03] transition-colors"
        >
          <span className="flex-shrink-0 w-12 text-right pr-4 text-slate-600 select-none text-xs leading-6">
            {line.lineNumber}
          </span>
          <span className="flex-1 whitespace-pre-wrap break-all">
            {line.tokens.map((token, i) => (
              <span
                key={i}
                className={tokenColors[token.type] || "text-slate-300"}
              >
                {token.value}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Variant Card in Preview ───────────────────────────────────────
const VariantPreviewCard = ({
  variantKey,
  Component,
  isPremium,
  isDark,
  wrapperClass,
}) => {
  const cfg = variantConfig[variantKey] || {};

  return (
    <div
      className={`relative rounded-2xl border overflow-visible transition-colors duration-300 ${
        isPremium
          ? isDark
            ? "border-amber-500/20 bg-slate-900/50"
            : "border-amber-500/20 bg-amber-50/30"
          : isDark
            ? "border-slate-800 bg-slate-900/30"
            : "border-slate-200 bg-white/50"
      }`}
    >
      {/* Card Header */}
      <div
        className={`flex items-center justify-between px-6 py-4 border-b transition-colors ${
          isDark ? "border-slate-800/50" : "border-slate-100"
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            {isPremium && <Crown className="w-3.5 h-3.5 text-amber-500" />}
            <h4
              className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}
            >
              {cfg.title}
            </h4>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.tagColor}`}
            >
              {cfg.tag}
            </span>
          </div>
          <p
            className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            {cfg.subtitle}
          </p>
        </div>
      </div>

      {/* Component Preview */}
      <div className="p-8 flex items-center justify-center min-h-[350px] overflow-visible">
        <div className={`${wrapperClass} overflow-visible`}>
          <Component />
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────
const ShowcasePage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeMenu, setActiveMenu] = useState("BookingBar");
  const [activeView, setActiveView] = useState("preview");
  const [activeCodeVariant, setActiveCodeVariant] = useState(null); // which variant's code to show
  const [copied, setCopied] = useState(false);

  const activeItem = menuItems.find((m) => m.key === activeMenu);
  const activeMConfig = menuConfig[activeMenu] || {};

  // Check if this menu has any premium variants
  const hasPremium = activeItem?.variants.some((v) => v.isPremium);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex flex-col h-screen overflow-hidden font-sans transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-slate-300" : "bg-white text-slate-600"
      }`}
    >
      {/* ─── Top Header ────────────────────────────────────────── */}
      <header
        className={`h-16 flex-shrink-0 border-b backdrop-blur-md flex items-center justify-between px-6 z-50 transition-colors duration-300 ${
          isDark
            ? "border-slate-800 bg-slate-950/80"
            : "border-slate-200 bg-white/80"
        }`}
      >
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight flex items-center gap-2"
          >
            <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              Me-UI
            </span>
          </Link>
          <span
            className={`text-[11px] pt-1 font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            by Adi Yohanes
          </span>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full border transition-colors ${
              isDark
                ? "text-slate-400 bg-slate-800 border-slate-700"
                : "text-slate-500 bg-slate-100 border-slate-200"
            }`}
          >
            Showcase
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://trakteer.id/adiyohanes19/tip"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-lg ${
              isDark
                ? "bg-white text-slate-900 hover:bg-slate-200 shadow-white/10"
                : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10"
            }`}
          >
            Support
          </a>
        </div>
      </header>

      {/* ─── Main Content ──────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ─── Sidebar ───────────────────────────────────────── */}
        <aside
          className={`w-[260px] flex-shrink-0 border-r flex flex-col hidden md:flex transition-colors duration-300 ${
            isDark
              ? "border-slate-800 bg-slate-900/50"
              : "border-slate-200 bg-slate-50/50"
          }`}
        >
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <h3
              className={`text-[10px] font-bold uppercase tracking-widest mb-4 pl-3 ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              Components
            </h3>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = activeMenu === item.key;
                const itemHasPremium = item.variants.some((v) => v.isPremium);
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveMenu(item.key);
                      setActiveView("preview");
                      setActiveCodeVariant(null);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                      isActive
                        ? isDark
                          ? "bg-slate-800 text-blue-400 shadow-sm ring-1 ring-slate-700"
                          : "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                        : isDark
                          ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                          : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.emoji}</span>
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {itemHasPremium && (
                        <Crown className="w-3 h-3 text-amber-500" />
                      )}
                      {item.variants.length > 1 && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isDark
                              ? "bg-slate-700 text-slate-400"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {item.variants.length}
                        </span>
                      )}
                      {isActive && (
                        <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Profile */}
          <div
            className={`p-4 border-t transition-colors ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
          >
            <div
              className={`flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer group border ${
                isDark
                  ? "border-transparent hover:border-slate-700 hover:bg-slate-800"
                  : "border-transparent hover:border-slate-100 hover:bg-slate-50"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
                AY
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm font-semibold truncate group-hover:text-blue-500 transition-colors ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  Adi Yohanes
                </h4>
                <p
                  className={`text-[10px] truncate ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  Developer
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── Preview Area ──────────────────────────────────── */}
        <main className="flex-1 flex flex-col relative">
          {/* Toolbar */}
          <div
            className={`h-16 flex-shrink-0 flex items-center justify-between px-8 border-b z-[40] transition-colors duration-300 ${
              isDark
                ? "border-slate-800 bg-slate-950"
                : "border-slate-100 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeItem?.emoji}</span>
              <div>
                <h2
                  className={`text-lg font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}
                >
                  {activeItem?.label}
                </h2>
              </div>
              {hasPremium && (
                <span className="text-[9px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                  <Crown className="w-2.5 h-2.5" />
                  Includes Premium
                </span>
              )}
            </div>

            <div
              className={`flex p-1 rounded-lg border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"}`}
            >
              <button
                onClick={() => {
                  setActiveView("preview");
                  setActiveCodeVariant(null);
                }}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeView === "preview"
                    ? isDark
                      ? "bg-slate-700 text-white shadow-sm"
                      : "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                    : isDark
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative overflow-y-auto">
            {/* ── Preview Mode ── */}
            <div
              className={`relative flex flex-col w-full transition-all duration-300 ${
                activeView !== "preview" ? "hidden" : "flex"
              }`}
            >
              {/* Description Bar */}
              <div
                className={`px-8 py-5 border-b transition-colors duration-300 ${
                  isDark
                    ? "bg-slate-900/50 border-slate-800"
                    : "bg-slate-50/80 border-slate-100"
                }`}
              >
                <div className="flex items-start gap-3 max-w-3xl">
                  <Sparkles
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                  />
                  <p
                    className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {activeMConfig.description}
                  </p>
                </div>
              </div>

              {/* Component(s) Preview */}
              <div
                className={`relative w-full p-8 transition-colors duration-300 overflow-visible ${isDark ? "bg-slate-950" : "bg-slate-50/30"}`}
              >
                {/* Accent Gradient */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b ${activeMConfig.accentGradient} pointer-events-none`}
                ></div>

                {/* Grid Background */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: isDark
                      ? `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`
                      : `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                  }}
                ></div>

                {/* Render variants */}
                <div className="relative z-10 space-y-8">
                  {activeItem?.variants.map((variant, idx) => {
                    const vCfg = variantConfig[variant.key] || {};
                    const isPremiumVariant = variant.isPremium;

                    // If single variant (no card wrapper needed)
                    if (activeItem.variants.length === 1) {
                      return (
                        <div key={variant.key}>
                          {/* Single component — render directly */}
                          <div
                            className={`flex flex-col ${activeMConfig.previewAlign || "items-center"} justify-center w-full ${activeMConfig.minHeight || "min-h-[400px]"}`}
                          >
                            <div className="w-full flex justify-center">
                              <div className={vCfg.wrapperClass || ""}>
                                <div className="flex items-center justify-center">
                                  <variant.Component />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Code button for single free component */}
                          <div className="flex justify-center mt-6">
                            <button
                              onClick={() => {
                                setActiveCodeVariant(variant.key);
                                setActiveView("code");
                              }}
                              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                isDark
                                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm"
                              }`}
                            >
                              {"</>"} View Source Code
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // Multiple variants — use card wrapper
                    return (
                      <div key={variant.key}>
                        {/* Premium divider before first premium item */}
                        {isPremiumVariant &&
                          idx > 0 &&
                          !activeItem.variants[idx - 1].isPremium && (
                            <div className="flex items-center gap-4 mb-8 mt-4">
                              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
                              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                                <Crown className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-xs font-bold text-amber-600 tracking-wide">
                                  Premium Variants
                                </span>
                              </div>
                              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
                            </div>
                          )}

                        <VariantPreviewCard
                          variantKey={variant.key}
                          Component={variant.Component}
                          isPremium={isPremiumVariant}
                          isDark={isDark}
                          wrapperClass={vCfg.wrapperClass || ""}
                        />

                        {/* Code button per variant */}
                        <div className="flex justify-center mt-4 mb-2">
                          {isPremiumVariant ? (
                            <button
                              onClick={() => {
                                setActiveCodeVariant(variant.key);
                                setActiveView("code");
                              }}
                              className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20"
                            >
                              <Crown className="w-3.5 h-3.5" /> Buy — View
                              Source
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveCodeVariant(variant.key);
                                setActiveView("code");
                              }}
                              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                isDark
                                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm"
                              }`}
                            >
                              {"</>"} View Source Code
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Code View ── */}
            {activeView === "code" && activeCodeVariant && (
              <div className="absolute inset-0 z-20 flex flex-col">
                {premiumComponents.has(activeCodeVariant) ? (
                  /* Premium Buy Overlay */
                  <div
                    className={`flex-1 flex flex-col items-center justify-center p-8 ${isDark ? "bg-slate-950" : "bg-white"}`}
                  >
                    <div className="absolute inset-0 overflow-hidden opacity-[0.06] pointer-events-none">
                      <pre className="p-8 font-mono text-xs leading-6 whitespace-pre-wrap">
                        {componentSourceCodes[activeCodeVariant]}
                      </pre>
                    </div>

                    <div className="relative z-10 text-center max-w-md">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20">
                        <Crown className="w-10 h-10 text-white" />
                      </div>
                      <h3
                        className={`text-2xl font-black mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        Premium Component
                      </h3>
                      <p
                        className={`text-sm leading-relaxed mb-8 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                      >
                        Get the full source code for{" "}
                        <span className="font-bold text-amber-500">
                          {variantConfig[activeCodeVariant]?.title ||
                            activeCodeVariant}
                        </span>{" "}
                        with all GSAP animations, interactive features, and
                        responsive styling.
                      </p>

                      <div
                        className={`rounded-2xl border p-6 mb-6 ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                      >
                        <div className="flex items-baseline justify-center gap-2 mb-2">
                          <span
                            className={`text-4xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
                          >
                            $4.99
                          </span>
                          <span
                            className={`text-sm line-through ${isDark ? "text-slate-500" : "text-slate-400"}`}
                          >
                            $9.99
                          </span>
                        </div>
                        <p
                          className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
                        >
                          One-time payment • Lifetime access • Free updates
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveView("code-unlocked")}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 text-sm"
                      >
                        <Crown className="w-4 h-4" />
                        Buy Now — View Source Code
                      </button>
                      <p
                        className={`text-[10px] mt-4 ${isDark ? "text-slate-600" : "text-slate-400"}`}
                      >
                        * Payment integration coming soon. Click to preview code
                        for now.
                      </p>

                      <button
                        onClick={() => {
                          setActiveView("preview");
                          setActiveCodeVariant(null);
                        }}
                        className={`mt-6 text-xs font-medium ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"} transition-colors`}
                      >
                        ← Back to Preview
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Free Code View */
                  <>
                    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#161b22]">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                        </div>
                        <span className="text-xs text-slate-500 font-mono ml-2">
                          {activeCodeVariant}.jsx
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveView("preview");
                            setActiveCodeVariant(null);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors border border-slate-700 hover:bg-slate-800"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={() =>
                            handleCopy(componentSourceCodes[activeCodeVariant])
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs items-center gap-2 flex transition-all border ${
                            copied
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700"
                          }`}
                        >
                          {copied ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          {copied ? "Copied!" : "Copy Code"}
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto p-6 custom-scrollbar bg-[#0d1117]">
                      <SyntaxHighlightedCode
                        code={componentSourceCodes[activeCodeVariant]}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Code Unlocked (premium after clicking buy) ── */}
            {activeView === "code-unlocked" && activeCodeVariant && (
              <div className="absolute inset-0 bg-[#0d1117] z-30 flex flex-col">
                <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#161b22]">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                    </div>
                    <span className="text-xs text-slate-500 font-mono ml-2">
                      {activeCodeVariant}.jsx
                    </span>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      PREMIUM
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveView("preview");
                        setActiveCodeVariant(null);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors border border-slate-700 hover:bg-slate-800"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() =>
                        handleCopy(componentSourceCodes[activeCodeVariant])
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs items-center gap-2 flex transition-all border ${
                        copied
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700"
                      }`}
                    >
                      {copied ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copied ? "Copied!" : "Copy Code"}
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-6 custom-scrollbar">
                  <SyntaxHighlightedCode
                    code={componentSourceCodes[activeCodeVariant]}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShowcasePage;
