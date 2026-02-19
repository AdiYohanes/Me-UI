import React, { useState } from "react";
import { Check } from "lucide-react";

// ╔══════════════════════════════════════════════════════════════════╗
// ║  PricingCard — Free Tier                                        ║
// ║                                                                 ║
// ║  A simple, clean, modern pricing card for a free tier plan.    ║
// ║  Uses Tailwind CSS only (no GSAP needed for free tier).        ║
// ║                                                                 ║
// ║  Props:                                                         ║
// ║  • plan        — plan name (default "Free")                    ║
// ║  • price       — price string (default "$0")                   ║
// ║  • period      — billing period (default "/ month")            ║
// ║  • description — short plan description                        ║
// ║  • features    — string[] list of features                     ║
// ║  • ctaLabel    — CTA button text                               ║
// ║  • onCta       — () => void callback                           ║
// ╚══════════════════════════════════════════════════════════════════╝

const DEFAULT_FEATURES = [
  "Up to 3 projects",
  "Basic analytics dashboard",
  "Community support",
  "1 GB storage",
  "API access (100 req/day)",
];

export default function PricingCard({
  plan = "Free",
  price = "$0",
  period = "/ month",
  description = "Everything you need to get started. No credit card required.",
  features = DEFAULT_FEATURES,
  ctaLabel = "Get Started — Free",
  onCta = null,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className="relative w-full max-w-[340px] select-none"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Card */}
      <div
        className="relative rounded-2xl border bg-white overflow-hidden transition-all duration-300"
        style={{
          borderColor: isHovered ? "#c7d2fe" : "#e2e8f0",
          boxShadow: isHovered
            ? "0 20px 60px -12px rgba(99,102,241,0.18), 0 4px 16px -4px rgba(0,0,0,0.08)"
            : "0 4px 24px -6px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          transform: isHovered
            ? isPressed
              ? "translateY(1px)"
              : "translateY(-4px)"
            : "translateY(0)",
        }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300" />

        {/* Card header */}
        <div className="px-7 pt-7 pb-5">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {plan}
          </span>

          {/* Price */}
          <div className="flex items-end gap-1.5 mb-2">
            <span className="text-5xl font-extrabold text-slate-900 tracking-tight leading-none">
              {price}
            </span>
            <span className="text-slate-400 text-sm font-medium mb-1.5">
              {period}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-7 h-px bg-slate-100" />

        {/* Features */}
        <div className="px-7 py-5 space-y-3">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 w-4.5 h-4.5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <Check
                  className="w-2.5 h-2.5 text-emerald-500"
                  strokeWidth={3}
                />
              </span>
              <span className="text-sm text-slate-600 leading-snug">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-7 pb-7 pt-2">
          <button
            onClick={onCta}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 border-2 border-slate-900 text-slate-900 bg-transparent hover:bg-slate-900 hover:text-white active:scale-[0.98]"
          >
            {ctaLabel}
          </button>

          <p className="text-center text-[11px] text-slate-400 mt-3 font-medium">
            No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
