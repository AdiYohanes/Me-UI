import React, { useState, useMemo, useEffect } from "react";
import {
  Copy,
  Check,
  Code2,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { componentSourceCodes } from "../../data/componentSourceCodes";

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
        /^(useState|useEffect|useRef|useContext|useMemo|useCallback|useGSAP|contextSafe|React)\b/,
        "react",
      ],
      [/^(\d+\.?\d*)/, "number"],
      [
        /^(className|onClick|onChange|onSubmit|onMouseEnter|onMouseLeave|onMouseDown|onTouchStart|ref|key|style|href|src|alt|disabled|type|value|placeholder|loading)(?=\s*=)/,
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
          <span className="flex-shrink-0 w-12 text-right pr-4 text-slate-700 select-none text-xs leading-6 group-hover:text-slate-500 transition-colors">
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

// ─── Grid Card ────────────────────────────────────────────────────────────────
const ComponentGridCard = ({
  variant,
  cfg,
  isDark,
  wrapperClass,
  previewScale,
  cardMinHeight,
  onViewCode,
}) => (
  <div
    className={`group flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden ${
      isDark
        ? "border-slate-800 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/70 hover:shadow-xl hover:shadow-black/30"
        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60 shadow-sm"
    }`}
  >
    {/* Header */}
    <div
      className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
        isDark
          ? "border-slate-800 bg-slate-900/60"
          : "border-slate-100 bg-slate-50/80"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h4
            className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-slate-800"}`}
          >
            {cfg.title}
          </h4>
        </div>
        <p
          className={`text-[10px] leading-snug line-clamp-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}
        >
          {cfg.subtitle}
        </p>
      </div>
    </div>

    {/* Live Preview */}
    <div
      className={`relative ${isDark ? "bg-slate-950" : "bg-slate-50"}`}
      style={{
        height: cardMinHeight
          .replace("min-h-", "")
          .replace("[", "")
          .replace("]", ""),
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin",
        scrollbarColor: isDark ? "#334155 transparent" : "#cbd5e1 transparent",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)`
            : `linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className={`relative z-10 p-4 flex justify-center ${wrapperClass}`}>
        <div
          style={
            previewScale
              ? {
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top center",
                  width: `${100 / previewScale}%`,
                  display: "flex",
                  justifyContent: "center",
                }
              : { width: "100%", display: "flex", justifyContent: "center" }
          }
        >
          <variant.Component />
        </div>
      </div>
    </div>

    {/* Footer */}
    <div
      className={`px-4 py-3 border-t flex items-center justify-end transition-colors ${
        isDark
          ? "border-slate-800 bg-slate-900/60"
          : "border-slate-100 bg-slate-50/80"
      }`}
    >
      <button
        onClick={() => onViewCode(variant)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all duration-200 group/btn ${
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

// ─── Detail View (split-panel) ────────────────────────────────────────────────
const ComponentDetailView = ({
  variant,
  allVariants,
  menuItem,
  variantConfig,
  isDark,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeVariantKey, setActiveVariantKey] = useState(variant.key);

  useEffect(() => {
    setActiveVariantKey(variant.key);
  }, [variant.key]);

  const activeVariant =
    allVariants.find((v) => v.key === activeVariantKey) || variant;
  const activeCfg = variantConfig[activeVariantKey] || {};
  const code = componentSourceCodes[activeVariantKey] ?? "";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex flex-col h-full ${isDark ? "bg-slate-950" : "bg-white"}`}
    >
      {/* ── Detail Header ── */}
      <div
        className={`flex-shrink-0 flex items-center justify-between px-5 py-3 border-b z-10 ${
          isDark
            ? "border-slate-800 bg-slate-900/80 backdrop-blur-md"
            : "border-slate-200 bg-white/90 backdrop-blur-md"
        }`}
      >
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
          <div
            className={`hidden md:flex items-center gap-1.5 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            <span>Components</span>
            <ChevronRight className="w-3 h-3" />
            <span>{menuItem.label}</span>
            <ChevronRight className="w-3 h-3" />
            <span
              className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}
            >
              {activeCfg.title}
            </span>
          </div>
        </div>
      </div>

      {/* ── Split Panel ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Preview */}
        <div
          className={`flex flex-col w-[50%] flex-shrink-0 border-r ${isDark ? "border-slate-800" : "border-slate-200"}`}
        >
          {/* Preview area */}
          <div
            className={`relative flex-1 flex items-start justify-center p-6 overflow-y-auto overflow-x-hidden custom-scrollbar min-h-[220px] ${isDark ? "bg-slate-950" : "bg-slate-50"}`}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: isDark
                  ? `linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)`
                  : `linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
            />
            <div className="absolute top-4 left-4 z-10">
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  isDark
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-emerald-50 text-emerald-600 border-emerald-200"
                }`}
              >
                <Eye className="w-2.5 h-2.5 inline mr-1 -mt-px" />
                Live Preview
              </span>
            </div>
            <div
              className={`relative z-10 w-full mt-10 flex justify-center ${activeCfg.wrapperClass || ""}`}
            >
              <div
                style={
                  activeCfg.previewScale
                    ? {
                        transform: `scale(${activeCfg.previewScale})`,
                        transformOrigin: "top center",
                        width: `${100 / activeCfg.previewScale}%`,
                        display: "flex",
                        justifyContent: "center",
                      }
                    : {
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }
                }
              >
                <activeVariant.Component />
              </div>
            </div>
          </div>

          {/* Info strip */}
          <div
            className={`flex-shrink-0 px-5 py-4 border-t ${isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-white"}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{menuItem.emoji}</span>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3
                    className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}
                  >
                    {activeCfg.title}
                  </h3>
                </div>
                <p
                  className={`text-xs leading-relaxed ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  {activeCfg.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Variant navigator */}
          <div
            className={`flex-shrink-0 px-3 py-3 border-t ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-slate-50"}`}
          >
            <p
              className={`text-[9px] font-bold uppercase tracking-widest mb-2 px-1 ${isDark ? "text-slate-600" : "text-slate-400"}`}
            >
              All variants
            </p>
            <div className="flex flex-col gap-0.5">
              {allVariants.map((v) => {
                const vCfg = variantConfig[v.key] || {};
                const isActive = v.key === activeVariantKey;
                return (
                  <button
                    key={v.key}
                    onClick={() => setActiveVariantKey(v.key)}
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
                    <span className="flex-1 truncate">
                      {vCfg.title || v.key}
                    </span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Code */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
          {/* Toolbar */}
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-[#161b22]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">
                  {activeVariantKey}.jsx
                </span>
              </div>
            </div>
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

          {/* Code area */}
          <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar p-5">
            <SyntaxHighlightedCode code={code} />
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 px-5 py-2.5 border-t border-slate-800">
            <span className="text-[10px] text-slate-600">
              {code.split("\n").length} lines · React JSX
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main ComponentShowcase ───────────────────────────────────────────────────
const ComponentShowcase = ({ menuItem, menuConfig, variantConfig, isDark }) => {
  const [detailVariant, setDetailVariant] = useState(null);

  useEffect(() => {
    setDetailVariant(null);
  }, [menuItem.key]);

  const mCfg = menuConfig[menuItem.key] || {};
  const variants = menuItem.variants;

  const forceStack = mCfg.forceStack || false;
  const gridClass =
    forceStack || variants.length === 1
      ? "grid-cols-1 max-w-3xl"
      : variants.length === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  if (detailVariant) {
    return (
      <div className="flex flex-col h-full">
        <ComponentDetailView
          variant={detailVariant}
          allVariants={variants}
          menuItem={menuItem}
          variantConfig={variantConfig}
          isDark={isDark}
          onBack={() => setDetailVariant(null)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full min-h-full ${isDark ? "bg-slate-950" : "bg-slate-50/30"}`}
    >
      {/* Accent gradient */}
      <div
        className={`absolute top-0 left-0 right-0 h-[180px] bg-gradient-to-b ${mCfg.accentGradient} pointer-events-none`}
      />

      {/* Description bar */}
      <div
        className={`relative sticky top-0 z-10 px-6 py-2.5 border-b backdrop-blur-md ${
          isDark
            ? "bg-slate-900/70 border-slate-800"
            : "bg-white/80 border-slate-100"
        }`}
      >
        <div className="flex items-center gap-2 max-w-3xl">
          <Sparkles
            className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-blue-400" : "text-blue-600"}`}
          />
          <p
            className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {mCfg.description}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="relative z-10 p-5">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDark
              ? `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`
              : `radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className={`relative grid ${gridClass} gap-5 mx-auto`}>
          {variants.map((variant) => {
            const cfg = variantConfig[variant.key] || {};
            return (
              <ComponentGridCard
                key={variant.key}
                variant={variant}
                cfg={cfg}
                isDark={isDark}
                wrapperClass={cfg.wrapperClass || ""}
                previewScale={cfg.previewScale}
                cardMinHeight={mCfg.cardMinHeight || "min-h-[200px]"}
                onViewCode={(v) => setDetailVariant(v)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComponentShowcase;
