import React, { useState, useMemo, useEffect } from "react";
import {
  Copy,
  Check,
  Code2,
  Layers,
  ArrowLeft,
  ChevronRight,
  Eye,
  Maximize2,
} from "lucide-react";
import { elementSourceCodes } from "../../data/elementSourceCodes";

import {
  ButtonSolid,
  ButtonOutline,
  ButtonGradient,
  ButtonLoading,
  ButtonIcon,
  ButtonDestructive,
} from "../elements/ButtonElements";

import {
  LoaderSpinner,
  LoaderDots,
  LoaderPulse,
  LoaderBar,
  LoaderSkeleton,
  LoaderOrbit,
} from "../elements/LoaderElements";

// ─── Syntax Highlighter ───────────────────────────────────────────────────────
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

function tokenizeLine(line) {
  const tokens = [];
  let remaining = line;
  while (remaining.length > 0) {
    let matched = false;
    if (remaining.startsWith("//")) {
      tokens.push({ type: "comment", value: remaining });
      break;
    }
    const patterns = [
      [/^(<\/[A-Za-z][A-Za-z0-9.]*>)/, "tag"],
      [/^(<[A-Za-z][A-Za-z0-9.]*)/, "tag"],
      [/^(\/?>;?)/, "tag"],
      [/^(\$\{[^}]*\})/, "template"],
      [/^("(?:[^"\\]|\\.)*")/, "string"],
      [/^('(?:[^'\\]|\\.)*')/, "string"],
      [/^(`(?:[^`\\]|\\.)*`)/, "string"],
      [
        /^(import|export|default|from|const|let|var|function|return|if|else|class|extends|new|this|typeof|null|undefined|true|false|async|await|try|catch|throw)\b/,
        "keyword",
      ],
      [
        /^(useState|useEffect|useRef|useContext|useMemo|useCallback|useGSAP|React)\b/,
        "react",
      ],
      [/^(\d+\.?\d*)/, "number"],
      [
        /^(className|onClick|onChange|style|href|src|alt|disabled|type|value|key|ref)(?=\s*=)/,
        "attribute",
      ],
      [/^(=>)/, "operator"],
      [/^([{}()[\];,=])/, "punctuation"],
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

const SyntaxHighlightedCode = ({ code }) => {
  const lines = useMemo(() => {
    if (!code) return [];
    return code.split("\n").map((line, i) => ({
      lineNumber: i + 1,
      tokens: tokenizeLine(line),
    }));
  }, [code]);

  return (
    <div className="font-mono text-[12.5px] leading-6">
      {lines.map((line) => (
        <div
          key={line.lineNumber}
          className="flex group hover:bg-white/[0.03] rounded-sm transition-colors"
        >
          <span className="flex-shrink-0 w-10 text-right pr-4 text-slate-700 select-none text-xs leading-6 group-hover:text-slate-500 transition-colors">
            {line.lineNumber}
          </span>
          <span className="flex-1 whitespace-pre-wrap break-all pr-4">
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

// ─── Element metadata ─────────────────────────────────────────────────────────
const buttonElements = [
  {
    key: "ButtonSolid",
    title: "Solid Button",
    emoji: "🔵",
    tags: ["hover-scale", "shadow-glow", "focus-ring"],
    Component: ButtonSolid,
    description:
      "Primary action button with hover scale and shadow glow effects.",
  },
  {
    key: "ButtonOutline",
    title: "Outline Button",
    emoji: "⭕",
    tags: ["ghost", "fill-on-hover", "border"],
    Component: ButtonOutline,
    description:
      "Ghost button that fills with color on hover — great for secondary actions.",
  },
  {
    key: "ButtonGradient",
    title: "Gradient Button",
    emoji: "🌈",
    tags: ["shimmer", "gradient", "animated"],
    Component: ButtonGradient,
    description:
      "Eye-catching gradient button with a sweeping shimmer animation on hover.",
  },
  {
    key: "ButtonLoading",
    title: "Loading Button",
    emoji: "⏳",
    tags: ["async", "disabled-state", "spinner"],
    Component: ButtonLoading,
    description:
      "Button with integrated loading spinner for async operations. Automatically disables while loading.",
  },
  {
    key: "ButtonIcon",
    title: "Icon Button",
    emoji: "🔘",
    tags: ["ripple", "toggle", "icon-only"],
    Component: ButtonIcon,
    description:
      "Circular icon button with ripple effect and toggle state — perfect for likes & favorites.",
  },
  {
    key: "ButtonDestructive",
    title: "Destructive Button",
    emoji: "🗑️",
    tags: ["danger", "confirm", "hover-fill"],
    Component: ButtonDestructive,
    description:
      "Danger button with a confirmation state — shows visual feedback when the action is triggered.",
  },
];

const loaderElements = [
  {
    key: "LoaderSpinner",
    title: "Ring Spinner",
    emoji: "🔄",
    tags: ["CSS animation", "scalable", "3 sizes"],
    Component: LoaderSpinner,
    description:
      "Classic rotating ring spinner, available in 3 sizes. Pure CSS `border` animation.",
  },
  {
    key: "LoaderDots",
    title: "Bouncing Dots",
    emoji: "•••",
    tags: ["stagger", "bounce", "3 variants"],
    Component: LoaderDots,
    description:
      "Three dots that bounce with a staggered delay — smooth and friendly loading indicator.",
  },
  {
    key: "LoaderPulse",
    title: "Pulse Rings",
    emoji: "💓",
    tags: ["ping", "concentric", "glow"],
    Component: LoaderPulse,
    description:
      "Concentric rings that expand and fade — great for live/active status indicators.",
  },
  {
    key: "LoaderBar",
    title: "Progress Bar",
    emoji: "▬",
    tags: ["determinate", "shimmer", "striped"],
    Component: LoaderBar,
    description:
      "3-in-1 progress bar: indeterminate shimmer, animated determinate fill, and striped pattern.",
  },
  {
    key: "LoaderSkeleton",
    title: "Skeleton",
    emoji: "🦴",
    tags: ["placeholder", "shimmer", "layout"],
    Component: LoaderSkeleton,
    description:
      "Card skeleton placeholder with shimmer effect. Perfect for loading states that match your layout.",
  },
  {
    key: "LoaderOrbit",
    title: "Dual Orbit",
    emoji: "🪐",
    tags: ["orbital", "3 speeds", "dual-ring"],
    Component: LoaderOrbit,
    description:
      "Two dots orbiting at different speeds and directions. Visually distinct and mesmerizing.",
  },
];

const allElements = { Button: buttonElements, Loader: loaderElements };

// ─── Grid Card (preview only, no inline code) ─────────────────────────────────
const ElementGridCard = ({ element, isDark, codeStyle, onViewCode }) => {
  const isTW = codeStyle === "tailwind";

  return (
    <div
      className={`group flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden cursor-default ${
        isDark
          ? "border-slate-800 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/70 hover:shadow-xl hover:shadow-black/30"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60 shadow-sm"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-slate-50/80"}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{element.emoji}</span>
          <h4
            className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}
          >
            {element.title}
          </h4>
        </div>
        {/* Style badge */}
        <span
          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
            isTW
              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
              : "bg-violet-500/10 text-violet-500 border-violet-500/20"
          }`}
        >
          {isTW ? "Tailwind" : "CSS"}
        </span>
      </div>

      {/* Live Preview */}
      <div
        className={`relative flex-1 flex items-center justify-center min-h-[150px] p-6 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}
      >
        {/* Grid bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDark
              ? `linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)`
              : `linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 transition-transform duration-300 group-hover:scale-[1.03]">
          <element.Component />
        </div>
      </div>

      {/* Footer */}
      <div
        className={`px-4 py-3 border-t flex items-center justify-between gap-2 transition-colors ${isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-slate-50/80"}`}
      >
        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          {element.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                isDark
                  ? "bg-slate-800 text-slate-500 border border-slate-700"
                  : "bg-slate-100 text-slate-400 border border-slate-200"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View Code Button */}
        <button
          onClick={() => onViewCode(element)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all duration-200 group/btn ${
            isDark
              ? "border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-600"
              : "border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white hover:border-slate-400 hover:shadow-sm"
          }`}
        >
          <Code2 className="w-3 h-3 transition-transform group-hover/btn:rotate-6" />
          View Code
        </button>
      </div>
    </div>
  );
};

// ─── Detail View (split panel) ────────────────────────────────────────────────
const ElementDetailView = ({
  element,
  allGroupElements,
  isDark,
  codeStyle,
  onCodeStyleChange,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeKey, setActiveKey] = useState(element.key);

  // When parent-navigated element changes, sync
  useEffect(() => {
    setActiveKey(element.key);
  }, [element.key]);

  const activeElement =
    allGroupElements.find((e) => e.key === activeKey) || element;
  const code = elementSourceCodes[activeKey]?.[codeStyle] ?? "";
  const isTW = codeStyle === "tailwind";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex flex-col h-full transition-colors ${isDark ? "bg-slate-950" : "bg-white"}`}
    >
      {/* ── Detail Header bar ── */}
      <div
        className={`flex-shrink-0 flex items-center justify-between px-5 py-3 border-b z-10 transition-colors ${
          isDark
            ? "border-slate-800 bg-slate-900/80 backdrop-blur-md"
            : "border-slate-200 bg-white/90 backdrop-blur-md"
        }`}
      >
        {/* Back + breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isDark
                ? "border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                : "border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>

          {/* Breadcrumb */}
          <div
            className={`hidden md:flex items-center gap-1.5 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            <span>Elements</span>
            <ChevronRight className="w-3 h-3" />
            <span>
              {element.key.startsWith("Button") ? "Button" : "Loader"}
            </span>
            <ChevronRight className="w-3 h-3" />
            <span
              className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}
            >
              {activeElement.title}
            </span>
          </div>
        </div>

        {/* Global TW / CSS toggle */}
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-semibold hidden sm:block ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            Style:
          </span>
          <div
            className={`flex rounded-xl p-1 border transition-colors ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"}`}
          >
            <button
              onClick={() => onCodeStyleChange("tailwind")}
              className={`px-3.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                isTW
                  ? "bg-blue-600 text-white shadow-sm"
                  : isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Tailwind
            </button>
            <button
              onClick={() => onCodeStyleChange("css")}
              className={`px-3.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                !isTW
                  ? "bg-violet-600 text-white shadow-sm"
                  : isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Pure CSS
            </button>
          </div>
        </div>
      </div>

      {/* ── Split Panel ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── LEFT: Preview Panel ── */}
        <div
          className={`flex flex-col w-[42%] flex-shrink-0 border-r transition-colors ${
            isDark
              ? "border-slate-800 bg-slate-950"
              : "border-slate-200 bg-slate-50/50"
          }`}
        >
          {/* Preview area */}
          <div
            className={`relative flex-1 flex items-center justify-center p-8 overflow-hidden ${isDark ? "bg-slate-950" : "bg-slate-50"}`}
          >
            {/* Grid bg */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: isDark
                  ? `linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)`
                  : `linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
            />

            {/* Soft glow */}
            <div
              className={`absolute inset-0 ${
                isTW ? "bg-blue-500/3" : "bg-violet-500/3"
              } pointer-events-none`}
            />

            {/* Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 z-10">
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  isTW
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : "bg-violet-500/10 text-violet-500 border-violet-500/20"
                }`}
              >
                <Eye className="w-2.5 h-2.5 inline mr-1 -mt-px" />
                {isTW ? "Tailwind CSS" : "Pure CSS"}
              </span>
            </div>

            {/* Component live preview */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <activeElement.Component />
            </div>
          </div>

          {/* Element info strip */}
          <div
            className={`flex-shrink-0 px-5 py-4 border-t transition-colors ${isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-white"}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{activeElement.emoji}</span>
              <div>
                <h3
                  className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}
                >
                  {activeElement.title}
                </h3>
                <p
                  className={`text-xs mt-0.5 leading-relaxed ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  {activeElement.description}
                </p>
              </div>
            </div>
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {activeElement.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${
                    isDark
                      ? "bg-slate-800 text-slate-500 border-slate-700"
                      : "bg-slate-100 text-slate-400 border-slate-200"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Variant navigator */}
          <div
            className={`flex-shrink-0 px-3 py-3 border-t transition-colors ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-slate-50"}`}
          >
            <p
              className={`text-[9px] font-bold uppercase tracking-widest mb-2 px-1 ${isDark ? "text-slate-600" : "text-slate-400"}`}
            >
              Other variants
            </p>
            <div className="flex flex-col gap-0.5">
              {allGroupElements.map((el) => {
                const isActive = el.key === activeKey;
                return (
                  <button
                    key={el.key}
                    onClick={() => setActiveKey(el.key)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? isDark
                          ? "bg-slate-700 text-white"
                          : "bg-white text-slate-900 shadow-sm border border-slate-200"
                        : isDark
                          ? "text-slate-500 hover:text-slate-200 hover:bg-slate-800/60"
                          : "text-slate-400 hover:text-slate-700 hover:bg-white/70"
                    }`}
                  >
                    <span className="text-sm flex-shrink-0">{el.emoji}</span>
                    <span className="flex-1 truncate">{el.title}</span>
                    {isActive && (
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isTW ? "bg-blue-500" : "bg-violet-500"}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Code Panel ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
          {/* Code toolbar */}
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-[#161b22]">
            <div className="flex items-center gap-3">
              {/* Traffic lights */}
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 transition-all" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 transition-all" />
              </div>

              {/* File name */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono ${isDark ? "text-slate-400" : "text-slate-300"}`}
                >
                  {activeKey}.{isTW ? "jsx" : "css.jsx"}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                    isTW
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-violet-500/10 text-violet-400 border-violet-500/20"
                  }`}
                >
                  {isTW ? "TW" : "CSS"}
                </span>
              </div>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                copied
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-600"
              }`}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>

          {/* Scrollable code */}
          <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar p-5">
            <SyntaxHighlightedCode code={code} />
          </div>

          {/* Footer note */}
          <div className="flex-shrink-0 px-5 py-2.5 border-t border-slate-800 flex items-center gap-3">
            <span className="text-[10px] text-slate-600">
              {code.split("\n").length} lines ·{" "}
              {isTW
                ? "Tailwind CSS utility classes"
                : "Pure CSS with inline <style>"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main ElementShowcase ─────────────────────────────────────────────────────
const ElementShowcase = ({ isDark, activeElementKey }) => {
  const [codeStyle, setCodeStyle] = useState("tailwind");
  const [detailElement, setDetailElement] = useState(null); // null = grid view

  // Reset detail when switching element group (Button ↔ Loader)
  useEffect(() => {
    setDetailElement(null);
  }, [activeElementKey]);

  const elements = allElements[activeElementKey] || buttonElements;

  const sectionMeta = {
    Button: {
      description:
        "Reusable button primitives — solid, outline, gradient, loading states, icon buttons, and destructive actions. Each available in Tailwind CSS or Pure CSS.",
      accentGradient: "from-blue-500/8 via-cyan-500/4 to-transparent",
    },
    Loader: {
      description:
        "Loading indicators and skeleton placeholders — ring spinner, bouncing dots, pulse rings, progress bars, skeleton blocks, and orbital loaders.",
      accentGradient: "from-violet-500/8 via-purple-500/4 to-transparent",
    },
  };

  const meta = sectionMeta[activeElementKey] || sectionMeta.Button;
  const isTW = codeStyle === "tailwind";
  const isDetail = detailElement !== null;

  // ── Detail View ──────────────────────────────────────────
  if (isDetail) {
    return (
      <div className="flex flex-col h-full">
        <ElementDetailView
          element={detailElement}
          allGroupElements={elements}
          isDark={isDark}
          codeStyle={codeStyle}
          onCodeStyleChange={setCodeStyle}
          onBack={() => setDetailElement(null)}
        />
      </div>
    );
  }

  // ── Grid View ────────────────────────────────────────────
  return (
    <div
      className={`relative w-full min-h-full transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-slate-50/30"}`}
    >
      {/* Accent gradient */}
      <div
        className={`absolute top-0 left-0 right-0 h-[180px] bg-gradient-to-b ${meta.accentGradient} pointer-events-none`}
      />

      {/* Description / toolbar bar */}
      <div
        className={`relative sticky top-0 z-10 px-6 py-2.5 border-b backdrop-blur-md transition-colors ${
          isDark
            ? "bg-slate-900/70 border-slate-800"
            : "bg-white/80 border-slate-100"
        }`}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 max-w-2xl">
            <Layers
              className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-violet-400" : "text-violet-600"}`}
            />
            <p
              className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {meta.description}
            </p>
          </div>

          {/* Global TW / CSS Toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={`text-[10px] font-semibold hidden sm:block ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              Style:
            </span>
            <div
              className={`flex rounded-xl p-1 border transition-colors ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}
            >
              <button
                onClick={() => setCodeStyle("tailwind")}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  isTW
                    ? "bg-blue-600 text-white shadow-sm"
                    : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Tailwind
              </button>
              <button
                onClick={() => setCodeStyle("css")}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  !isTW
                    ? "bg-violet-600 text-white shadow-sm"
                    : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Pure CSS
              </button>
            </div>
            <span
              className={`text-[9px] font-bold px-2 py-1 rounded-full border ${
                isTW
                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  : "bg-violet-500/10 text-violet-500 border-violet-500/20"
              }`}
            >
              {elements.length} variants
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="relative z-10 p-5">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDark
              ? `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`
              : `radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {elements.map((element) => (
            <ElementGridCard
              key={element.key}
              element={element}
              isDark={isDark}
              codeStyle={codeStyle}
              onViewCode={(el) => setDetailElement(el)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElementShowcase;
