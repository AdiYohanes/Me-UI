import React, { useState, useMemo } from "react";
import { componentSourceCodes } from "../data/componentSourceCodes";
import { Link } from "react-router-dom";
import {
  Check,
  Copy,
  ChevronRight,
  Sparkles,
  Heart,
  ExternalLink,
} from "lucide-react";
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
import ModernDropdownPremium from "../components/examples/ModernDropdownPremium";
import PricingCard from "../components/examples/PricingCard";
import PricingCardPremiumMinecraft from "../components/examples/PricingCardPremiumMinecraft";
import PricingCardPremiumFashion from "../components/examples/PricingCardPremiumFashion";

// ─── Sidebar menu items ────────────────────────────────────────────
// All components are free
const menuItems = [
  {
    key: "BookingBar",
    emoji: "🏨",
    label: "Booking Bar",
    variants: [
      { key: "BookingBar", Component: BookingBar },
      { key: "BookingBarPremium", Component: BookingBarPremium },
    ],
  },
  {
    key: "ThemeToggle",
    emoji: "🌓",
    label: "Theme Toggle",
    variants: [
      { key: "ThemeToggle", Component: ThemeToggle },
      { key: "ThemeTogglePremium", Component: ThemeTogglePremium },
    ],
  },
  {
    key: "ProductCard",
    emoji: "🛍️",
    label: "Product Card",
    variants: [
      { key: "ProductCard", Component: ProductCard },
      { key: "ProductCardSlide", Component: ProductCardSlide },
      { key: "ProductCardPremium", Component: ProductCardPremium },
    ],
  },
  {
    key: "AnimatedCart",
    emoji: "🛒",
    label: "Animated Cart",
    variants: [
      { key: "AnimatedCart", Component: AnimatedCart },
      { key: "AnimatedCartPremium", Component: AnimatedCartPremium },
    ],
  },
  {
    key: "ModernDropdown",
    emoji: "💧",
    label: "Modern Dropdown",
    variants: [
      { key: "ModernDropdown", Component: ModernDropdown },
      { key: "ModernDropdownPremium", Component: ModernDropdownPremium },
    ],
  },
  {
    key: "PricingCard",
    emoji: "💳",
    label: "Pricing Card",
    variants: [
      { key: "PricingCard", Component: PricingCard },
      {
        key: "PricingCardPremiumMinecraft",
        Component: PricingCardPremiumMinecraft,
      },
      {
        key: "PricingCardPremiumFashion",
        Component: PricingCardPremiumFashion,
      },
    ],
  },
];

// Per-variant display config — all free now
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
    tag: "Free",
    tagColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  ThemeToggle: {
    wrapperClass: "scale-[1.3]",
    title: "Theme Toggle",
    subtitle: "Dark/light mode toggle with spring animation",
    tag: "Free",
    tagColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  ThemeTogglePremium: {
    wrapperClass: "",
    title: "Scenic Day/Night Toggle",
    subtitle: "Landscape scene toggle with sun, moon, stars & rolling hills",
    tag: "Free",
    tagColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
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
    tag: "Free",
    tagColor: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  },
  ProductCardPremium: {
    wrapperClass: "",
    title: "Limited Edition Card",
    subtitle: "Dark header card with limited edition badge & inventory status",
    tag: "Free",
    tagColor: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
  AnimatedCart: {
    wrapperClass: "scale-[1.8]",
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
    tag: "Free",
    tagColor: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  },
  ModernDropdown: {
    wrapperClass: "",
    title: "Modern Dropdown",
    subtitle: "Sleek user dropdown menu with staggered GSAP reveal",
    tag: "Free",
    tagColor: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  },
  ModernDropdownPremium: {
    wrapperClass: "",
    title: "Glassmorphism Dropdown",
    subtitle:
      "Glassmorphism dark panel with spring open, staggered items & hover micro-animations",
    tag: "Free",
    tagColor: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  },
  PricingCard: {
    wrapperClass: "",
    title: "Free Pricing Card",
    subtitle:
      "Clean modern pricing card — hover to lift, feature list with checkmarks",
    tag: "Free",
    tagColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  PricingCardPremiumMinecraft: {
    wrapperClass: "",
    title: "Minecraft Card",
    subtitle:
      "Pixel-art pricing card — hover for dirt particles, click for TNT explosion",
    tag: "Free",
    tagColor: "bg-lime-500/10 text-lime-600 border-lime-500/20",
  },
  PricingCardPremiumFashion: {
    wrapperClass: "",
    title: "Fashion Card",
    subtitle:
      "Luxury editorial card — hover for 3D tilt & shimmer, click for gold ripple",
    tag: "Free",
    tagColor: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  },
};

// Menu-level config
const menuConfig = {
  BookingBar: {
    accentGradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
    description:
      "Booking bars for travel — from hotel search to multi-tab travel booking with flights, hotels, trains and more. All free!",
    previewAlign: "items-start pt-10",
    minHeight: "min-h-[700px]",
    forceStack: true,
    cardMinHeight: "min-h-[280px]",
  },
  ThemeToggle: {
    accentGradient: "from-purple-500/10 via-indigo-500/5 to-transparent",
    description:
      "Theme toggles — from a simple spring-animated switch to a scenic landscape day/night toggle with sun, moon, stars, clouds & rolling hills.",
    previewAlign: "items-center",
    minHeight: "min-h-[400px]",
    cardMinHeight: "min-h-[220px]",
  },
  ProductCard: {
    accentGradient: "from-orange-500/10 via-red-500/5 to-transparent",
    description:
      "Product cards for e-commerce — from basics to animated designs with advanced interactions. All free to use!",
    previewAlign: "items-center",
    minHeight: "min-h-[600px]",
    cardMinHeight: "min-h-[320px]",
  },
  AnimatedCart: {
    accentGradient: "from-green-500/10 via-emerald-500/5 to-transparent",
    description:
      "Animated carts — from a simple wiggle icon to an interactive cart with rolling wheels, fillable items, and cinematic checkout animation.",
    previewAlign: "items-center",
    minHeight: "min-h-[450px]",
    cardMinHeight: "min-h-[260px]",
  },
  ModernDropdown: {
    accentGradient: "from-violet-500/10 via-indigo-500/5 to-transparent",
    description:
      "Dropdown menus — from a GSAP-animated user menu to a glassmorphism panel with spring open animation, staggered item reveal, icon micro-animations, keyboard shortcuts, badges, and click-outside close.",
    previewAlign: "items-start pt-16",
    minHeight: "min-h-[420px]",
    forceStack: true,
    cardMinHeight: "min-h-[260px]",
  },
  PricingCard: {
    accentGradient: "from-emerald-500/10 via-cyan-500/5 to-transparent",
    description:
      "Pricing cards — from a sleek free tier card to themed variants: a Minecraft pixel-art card with GSAP particle explosions, and a luxury fashion card with 3D tilt and gold ripple animations.",
    previewAlign: "items-center",
    minHeight: "min-h-[600px]",
    cardMinHeight: "min-h-[300px]",
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
  isDark,
  wrapperClass,
  cardMinHeight = "min-h-[180px]",
}) => {
  const cfg = variantConfig[variantKey] || {};

  return (
    <div
      className={`relative rounded-2xl border overflow-visible transition-colors duration-300 flex flex-col ${
        isDark
          ? "border-slate-800 bg-slate-900/30"
          : "border-slate-200 bg-white/50"
      }`}
    >
      {/* Card Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
          isDark ? "border-slate-800/50" : "border-slate-100"
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4
              className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-slate-800"}`}
            >
              {cfg.title}
            </h4>
            <span
              className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border flex-shrink-0 ${cfg.tagColor}`}
            >
              {cfg.tag}
            </span>
          </div>
          <p
            className={`text-[10px] leading-snug line-clamp-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            {cfg.subtitle}
          </p>
        </div>
      </div>

      {/* Component Preview */}
      <div
        className={`flex-1 p-4 flex items-center justify-center ${cardMinHeight} overflow-visible`}
      >
        <div className={`${wrapperClass} overflow-visible`}>
          <Component />
        </div>
      </div>
    </div>
  );
};

// ─── Trakteer Support Button (Floating) ────────────────────────────
const TrakteerSupportButton = ({ isDark }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href="https://trakteer.id/adiyohanes19/tip"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-[999] group"
      title="Support Us on Trakteer ☕"
    >
      {/* Glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500"></div>

      {/* Main button */}
      <div
        className={`relative flex items-center gap-2.5 rounded-full border shadow-2xl transition-all duration-500 overflow-hidden ${
          isHovered ? "pr-5" : "pr-0"
        } ${
          isDark
            ? "bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 shadow-black/30 hover:border-pink-500/40"
            : "bg-gradient-to-r from-white to-slate-50 border-slate-200 shadow-slate-300/30 hover:border-pink-400/40"
        }`}
        style={{
          width: isHovered ? 210 : 56,
          height: 56,
        }}
      >
        {/* Coffee icon container */}
        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
          <div
            className="text-2xl transition-transform duration-300"
            style={{
              transform: isHovered
                ? "scale(1.2) rotate(-12deg)"
                : "scale(1) rotate(0deg)",
            }}
          >
            ☕
          </div>
        </div>

        {/* Expanded text */}
        <div
          className="flex flex-col whitespace-nowrap overflow-hidden transition-all duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            maxWidth: isHovered ? 160 : 0,
          }}
        >
          <span
            className={`text-[11px] font-bold ${isDark ? "text-white" : "text-slate-800"}`}
          >
            Support Me
          </span>
          <span
            className={`text-[9px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Buy me a coffee ❤️
          </span>
        </div>
      </div>

      {/* Floating particles */}
      {isHovered && (
        <>
          <div
            className="absolute -top-2 left-3 text-sm animate-bounce"
            style={{ animationDelay: "0ms" }}
          >
            ✨
          </div>
          <div
            className="absolute -top-3 right-4 text-xs animate-bounce"
            style={{ animationDelay: "200ms" }}
          >
            💖
          </div>
          <div
            className="absolute -top-1 left-1/2 text-xs animate-bounce"
            style={{ animationDelay: "400ms" }}
          >
            ⭐
          </div>
        </>
      )}
    </a>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────
const ShowcasePage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeMenu, setActiveMenu] = useState("BookingBar");
  const [activeView, setActiveView] = useState("preview");
  const [activeCodeVariant, setActiveCodeVariant] = useState(null);
  const [copied, setCopied] = useState(false);

  const activeItem = menuItems.find((m) => m.key === activeMenu);
  const activeMConfig = menuConfig[activeMenu] || {};

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

        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2">
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full border transition-colors ${
              isDark
                ? "text-slate-400 bg-slate-800 border-slate-700"
                : "text-slate-500 bg-slate-100 border-slate-200"
            }`}
          >
            Showcase
          </span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            100% Free
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Trakteer Support Button in Header */}
          <a
            href="https://trakteer.id/adiyohanes19/tip"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-2 group ${
              isDark
                ? "bg-gradient-to-r from-pink-500/10 to-orange-500/10 text-pink-400 border border-pink-500/20 hover:from-pink-500/20 hover:to-orange-500/20 hover:border-pink-500/40"
                : "bg-gradient-to-r from-pink-50 to-orange-50 text-pink-600 border border-pink-200 hover:from-pink-100 hover:to-orange-100 hover:border-pink-300"
            }`}
          >
            <span className="text-base group-hover:animate-bounce">☕</span>
            <span>Support</span>
            <Heart className="w-3 h-3 fill-current opacity-60 group-hover:opacity-100 transition-opacity" />
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

          {/* Sidebar Bottom: show ModernDropdownPremium demo when that menu is active, else static user profile */}
          {activeMenu === "ModernDropdown" ? (
            <div
              className={`p-4 border-t transition-colors ${
                isDark
                  ? "border-slate-800 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p
                className={`text-[10px] font-bold uppercase tracking-widest mb-3 pl-1 ${
                  isDark ? "text-slate-600" : "text-slate-400"
                }`}
              >
                Live Demo Below ↓
              </p>
              <ModernDropdownPremium
                userName="Adi Yohanes"
                userEmail="adi@indo-ui.com"
                avatarInitials="AY"
              />
            </div>
          ) : (
            <div
              className={`p-4 border-t transition-colors ${
                isDark
                  ? "border-slate-800 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
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
                    className={`text-sm font-semibold truncate group-hover:text-blue-500 transition-colors ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Adi Yohanes
                  </h4>
                  <p
                    className={`text-[10px] truncate ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Developer
                  </p>
                </div>
              </div>
            </div>
          )}
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
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {activeItem?.variants.length} variant
                {activeItem?.variants.length > 1 ? "s" : ""} · Free
              </span>
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
                className={`px-6 py-2.5 border-b transition-colors duration-300 ${
                  isDark
                    ? "bg-slate-900/50 border-slate-800"
                    : "bg-slate-50/80 border-slate-100"
                }`}
              >
                <div className="flex items-center gap-2 max-w-3xl">
                  <Sparkles
                    className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                  />
                  <p
                    className={`text-xs leading-relaxed line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {activeMConfig.description}
                  </p>
                </div>
              </div>

              {/* Component(s) Preview */}
              <div
                className={`relative w-full p-5 transition-colors duration-300 overflow-visible ${isDark ? "bg-slate-950" : "bg-slate-50/30"}`}
              >
                {/* Accent Gradient */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b ${activeMConfig.accentGradient} pointer-events-none`}
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
                <div className="relative z-10">
                  {activeItem?.variants.length === 1 ? (
                    /* ── Single Variant: centered full-width display ── */
                    (() => {
                      const variant = activeItem.variants[0];
                      const vCfg = variantConfig[variant.key] || {};
                      return (
                        <div key={variant.key}>
                          <div
                            className={`flex flex-col ${activeMConfig.previewAlign || "items-center"} justify-center w-full min-h-[320px]`}
                          >
                            <div className="w-full flex justify-center">
                              <div className={vCfg.wrapperClass || ""}>
                                <div className="flex items-center justify-center">
                                  <variant.Component />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center mt-4">
                            <button
                              onClick={() => {
                                setActiveCodeVariant(variant.key);
                                setActiveView("code");
                              }}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
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
                    })()
                  ) : (
                    /* ── Multiple Variants: grid display ── */
                    <div>
                      {(() => {
                        const cardMinHeight =
                          activeMConfig.cardMinHeight || "min-h-[180px]";
                        const forceStack = activeMConfig.forceStack || false;

                        const renderGrid = (variants) => (
                          <div
                            className={`grid gap-4 ${
                              forceStack || variants.length === 1
                                ? "grid-cols-1"
                                : variants.length === 2
                                  ? "grid-cols-2"
                                  : "grid-cols-3"
                            }`}
                          >
                            {variants.map((variant) => {
                              const vCfg = variantConfig[variant.key] || {};
                              return (
                                <div
                                  key={variant.key}
                                  className="flex flex-col"
                                >
                                  <VariantPreviewCard
                                    variantKey={variant.key}
                                    Component={variant.Component}
                                    isDark={isDark}
                                    wrapperClass={vCfg.wrapperClass || ""}
                                    cardMinHeight={cardMinHeight}
                                  />
                                  {/* Code button per variant — all free */}
                                  <div className="flex justify-center mt-2.5">
                                    <button
                                      onClick={() => {
                                        setActiveCodeVariant(variant.key);
                                        setActiveView("code");
                                      }}
                                      className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                                        isDark
                                          ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                                          : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm"
                                      }`}
                                    >
                                      {"</>"} View Code
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );

                        return renderGrid(activeItem.variants);
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Code View (all free — no premium overlay) ── */}
            {activeView === "code" && activeCodeVariant && (
              <div className="absolute inset-0 z-20 flex flex-col">
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
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      FREE
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
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ─── Floating Trakteer Support Button ──────────────────── */}
      <TrakteerSupportButton isDark={isDark} />
    </div>
  );
};

export default ShowcasePage;
