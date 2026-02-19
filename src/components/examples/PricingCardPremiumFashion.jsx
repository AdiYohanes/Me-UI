import React, { useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// ╔══════════════════════════════════════════════════════════════════╗
// ║  PricingCardPremiumFashion — Premium Luxury Fashion Card        ║
// ║                                                                 ║
// ║  Features:                                                      ║
// ║  • Dark charcoal/black with gold accent, serif typography      ║
// ║  • GSAP Hover: 3D card tilt (rotateX/Y) + shimmer sweep        ║
// ║  • GSAP Click: luxury ripple pulse + elastic scale pop         ║
// ║  • Gold gradient badge + feature list with em-dash markers     ║
// ║                                                                 ║
// ║  Props:                                                         ║
// ║  • plan        — plan name (default "Couture")                 ║
// ║  • price       — price string (default "€299")                 ║
// ║  • period      — billing period (default "/ season")           ║
// ║  • description — plan tagline                                  ║
// ║  • features    — string[] feature list                         ║
// ║  • ctaLabel    — CTA button text                               ║
// ║  • onCta       — () => void callback                           ║
// ╚══════════════════════════════════════════════════════════════════╝

const DEFAULT_FEATURES = [
  "Unlimited bespoke collections",
  "Personal stylist concierge",
  "Front-row show access",
  "Private atelier consultations",
  "Global shipping, no duties",
  "Exclusive member events",
];

export default function PricingCardPremiumFashion({
  plan = "Couture",
  price = "€299",
  period = "/ season",
  description = "For those who see fashion not as clothing, but as language.",
  features = DEFAULT_FEATURES,
  ctaLabel = "Request Access",
  onCta = null,
}) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const shimmerRef = useRef(null);
  const rippleRef = useRef(null);
  const [ripplePos, setRipplePos] = useState({ x: "50%", y: "50%" });
  const [showRipple, setShowRipple] = useState(false);
  const isAnimating = useRef(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // ── Helper: get mouse position relative to card ───────────────────
  const getRelativePos = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0.5, y: 0.5, xPx: 0, yPx: 0 };
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return { x, y, xPx: e.clientX - rect.left, yPx: e.clientY - rect.top };
  }, []);

  // ── Hover: 3D tilt + shimmer sweep ───────────────────────────────
  const handleMouseMove = contextSafe((e) => {
    if (isAnimating.current) return;
    const { x, y } = getRelativePos(e);

    // Subtle 3D tilt (max ±8 deg)
    const rotX = (0.5 - y) * 16;
    const rotY = (x - 0.5) * 16;

    gsap.to(cardRef.current, {
      rotateX: rotX,
      rotateY: rotY,
      duration: 0.35,
      ease: "power1.out",
      transformPerspective: 900,
      transformOrigin: "center center",
    });

    // Shimmer tracks mouse
    gsap.to(shimmerRef.current, {
      x: `${x * 100}%`,
      y: `${y * 100}%`,
      opacity: 0.7,
      duration: 0.5,
      ease: "power1.out",
    });
  });

  const handleMouseEnter = contextSafe(() => {
    if (isAnimating.current) return;
    gsap.to(shimmerRef.current, { opacity: 0.7, duration: 0.3 });
    gsap.to(cardRef.current, {
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  const handleMouseLeave = contextSafe(() => {
    if (isAnimating.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
    gsap.to(shimmerRef.current, { opacity: 0, duration: 0.4 });
  });

  // ── Click: ripple pulse + elastic scale ──────────────────────────
  const handleClick = contextSafe((e) => {
    e.stopPropagation();
    if (isAnimating.current) return;
    isAnimating.current = true;

    const { xPx, yPx } = getRelativePos(e);
    setRipplePos({ x: xPx, y: yPx });
    setShowRipple(true);

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        setShowRipple(false);
        gsap.set(rippleRef.current, { scale: 0, opacity: 0 });
      },
    });

    // Card pop
    tl.to(cardRef.current, {
      scale: 1.04,
      duration: 0.15,
      ease: "power2.out",
    });

    // Ripple expand
    tl.fromTo(
      rippleRef.current,
      { scale: 0, opacity: 0.6 },
      { scale: 6, opacity: 0, duration: 0.75, ease: "power2.out" },
      "<",
    );

    // Card settle back with elastic
    tl.to(cardRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });

    tl.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.4 }, "<");
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[340px] select-none"
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        perspective: "900px",
      }}
    >
      {/* Card */}
      <div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          background:
            "linear-gradient(145deg, #1a1a1a 0%, #0e0e0e 60%, #1c1412 100%)",
          border: "1px solid rgba(200,165,80,0.35)",
          boxShadow:
            "0 30px 80px -15px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(200,165,80,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Shimmer highlight — follows mouse */}
        <div
          ref={shimmerRef}
          className="absolute pointer-events-none"
          style={{
            width: "160px",
            height: "160px",
            background:
              "radial-gradient(circle, rgba(200,165,80,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            top: 0,
            left: 0,
            opacity: 0,
            zIndex: 5,
          }}
        />

        {/* Ripple element */}
        {showRipple && (
          <div
            ref={rippleRef}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "80px",
              height: "80px",
              background:
                "radial-gradient(circle, rgba(200,165,80,0.3) 0%, transparent 70%)",
              transform: "scale(0) translate(-50%, -50%)",
              transformOrigin: "center center",
              left: ripplePos.x,
              top: ripplePos.y,
              zIndex: 6,
            }}
          />
        )}

        {/* Fine gold top border line */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(200,165,80,0.8) 30%, rgba(230,185,100,1) 50%, rgba(200,165,80,0.8) 70%, transparent 100%)",
          }}
        />

        {/* Card body */}
        <div className="relative px-8 pt-8 pb-8" style={{ zIndex: 10 }}>
          {/* Badge */}
          <div className="flex items-center justify-between mb-6">
            <span
              className="text-xs font-bold tracking-[0.3em] uppercase"
              style={{
                background: "linear-gradient(90deg, #c8a550, #e6b964, #c8a550)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Georgia', serif",
                letterSpacing: "0.35em",
              }}
            >
              ✦ Couture Exclusive ✦
            </span>
          </div>

          {/* Plan name */}
          <div className="mb-1">
            <h3
              className="text-white font-bold leading-none"
              style={{
                fontSize: "13px",
                letterSpacing: "0.2em",
                opacity: 0.5,
                textTransform: "uppercase",
              }}
            >
              {plan}
            </h3>
          </div>

          {/* Price */}
          <div className="flex items-end gap-2 mb-3">
            <span
              className="font-bold leading-none"
              style={{
                fontSize: "52px",
                background:
                  "linear-gradient(135deg, #c8a550, #f5d88a, #c8a550)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Georgia', 'Times New Roman', serif",
              }}
            >
              {price}
            </span>
            <span
              className="text-sm mb-2 font-light"
              style={{ color: "rgba(200,165,80,0.6)", letterSpacing: "0.05em" }}
            >
              {period}
            </span>
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-6 italic"
            style={{ color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}
          >
            "{description}"
          </p>

          {/* Gold hairline divider */}
          <div
            className="mb-6"
            style={{
              height: "0.5px",
              background:
                "linear-gradient(90deg, transparent, rgba(200,165,80,0.5) 30%, rgba(200,165,80,0.5) 70%, transparent)",
            }}
          />

          {/* Features */}
          <div className="space-y-3 mb-7">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  style={{
                    color: "rgba(200,165,80,0.7)",
                    fontSize: "14px",
                    marginTop: "1px",
                    flexShrink: 0,
                  }}
                >
                  —
                </span>
                <span
                  className="text-sm font-light leading-snug"
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {f}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            className="w-full py-4 font-bold tracking-widest uppercase transition-all duration-300 relative overflow-hidden group"
            style={{
              background:
                "linear-gradient(135deg, #c8a550 0%, #e6b964 50%, #c8a550 100%)",
              color: "#0e0e0e",
              fontSize: "12px",
              letterSpacing: "0.3em",
              border: "none",
              fontFamily: "'Georgia', serif",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onCta?.();
            }}
          >
            {/* Shine sweep on button hover */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
              }}
            />
            {ctaLabel}
          </button>

          <p
            className="text-center mt-4 font-light"
            style={{
              color: "rgba(200,165,80,0.4)",
              fontSize: "11px",
              letterSpacing: "0.15em",
            }}
          >
            Hover for tilt · Click for ripple
          </p>
        </div>

        {/* Fine gold bottom border line */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(200,165,80,0.8) 30%, rgba(230,185,100,1) 50%, rgba(200,165,80,0.8) 70%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
