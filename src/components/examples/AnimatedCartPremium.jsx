import React, { useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Minus, Plus } from "lucide-react";

// ╔══════════════════════════════════════════════════════════════════╗
// ║  AnimatedCartPremium — Interactive Shopping Cart                ║
// ║                                                                ║
// ║  Features:                                                     ║
// ║  • Clean SVG cart with rolling wheels on hover                 ║
// ║  • +/- buttons to add/remove items                             ║
// ║  • Items STACK upward in the basket (up to maxVisible)         ║
// ║  • Badge counter at top-right corner                           ║
// ║  • Click cart → drives away right → falls from top empty      ║
// ║                                                                ║
// ║  Props (template-configurable):                                ║
// ║  • maxVisible  — number: max items visible in cart (default 4) ║
// ║  • itemColors  — string[]: colors for cart items               ║
// ║  • cartColor   — string: cart body color                       ║
// ║  • accentColor — string: buttons & badge color                 ║
// ║  • onCheckout  — (count) => void: callback on cart click       ║
// ║  • width       — number: base width in px (height auto)        ║
// ║  • className   — string: extra wrapper classes                 ║
// ╚══════════════════════════════════════════════════════════════════╝

// ─── All geometry is defined inside a 120×100 viewBox ────────────
// Everything scales proportionally via the `width` prop.
// ViewBox layout (y-axis):
//   0-8    : breathing room above basket
//   8-70   : basket interior (items stack here from bottom)
//   70-74  : basket bottom wall
//   74-78  : axle stubs
//   78-96  : wheels
//   96-100 : ground clearance

const DEFAULT_ITEM_COLORS = [
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
];

export default function AnimatedCartPremium({
  maxVisible = 4,
  itemColors = DEFAULT_ITEM_COLORS,
  cartColor = "#334155",
  accentColor = "#3b82f6",
  onCheckout = null,
  width = 160,
  className = "",
}) {
  const containerRef = useRef(null);
  const cartGroupRef = useRef(null);
  const wheelLRef = useRef(null);
  const wheelRRef = useRef(null);
  const badgeRef = useRef(null);
  const isAnimating = useRef(false);

  const [count, setCount] = useState(0);

  // Derived height from viewBox aspect ratio (120:100)
  const height = (width / 120) * 100;

  const { contextSafe } = useGSAP({ scope: containerRef });

  // ─── Wheel spin on hover ──────────────────────────────────────
  const handleHoverEnter = contextSafe(() => {
    if (isAnimating.current) return;
    gsap.to(wheelLRef.current, {
      rotation: "+=360",
      duration: 0.6,
      ease: "power1.inOut",
      svgOrigin: "0 0",
    });
    gsap.to(wheelRRef.current, {
      rotation: "+=360",
      duration: 0.6,
      ease: "power1.inOut",
      svgOrigin: "0 0",
    });
    gsap.to(cartGroupRef.current, {
      y: -4,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
  });

  const handleHoverLeave = contextSafe(() => {
    if (isAnimating.current) return;
    gsap.to(cartGroupRef.current, { y: 0, duration: 0.2 });
  });

  // ─── Add item ─────────────────────────────────────────────────
  const addItem = contextSafe(() => {
    if (isAnimating.current) return;
    setCount((p) => p + 1);
    gsap.fromTo(
      cartGroupRef.current,
      { y: 0 },
      { y: -6, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" },
    );
    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.5 },
        { scale: 1, duration: 0.35, ease: "back.out(2)" },
      );
    }
    gsap.to(wheelLRef.current, {
      rotation: "+=120",
      duration: 0.3,
      ease: "power1.out",
      svgOrigin: "0 0",
    });
    gsap.to(wheelRRef.current, {
      rotation: "+=120",
      duration: 0.3,
      ease: "power1.out",
      svgOrigin: "0 0",
    });
  });

  // ─── Remove item ──────────────────────────────────────────────
  const removeItem = contextSafe(() => {
    if (isAnimating.current || count <= 0) return;
    setCount((p) => Math.max(0, p - 1));
    gsap.fromTo(
      cartGroupRef.current,
      { x: 0 },
      { x: -3, duration: 0.06, yoyo: true, repeat: 3, ease: "power1.inOut" },
    );
    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 1.2 },
        { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" },
      );
    }
  });

  // ─── Checkout animation ───────────────────────────────────────
  const checkout = contextSafe(() => {
    if (isAnimating.current || count <= 0) return;
    isAnimating.current = true;
    const prevCount = count;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    tl.to(cartGroupRef.current, { rotation: -6, duration: 0.15 })
      .to(
        wheelLRef.current,
        {
          rotation: "+=1080",
          duration: 0.8,
          ease: "power2.in",
          svgOrigin: "0 0",
        },
        "<",
      )
      .to(
        wheelRRef.current,
        {
          rotation: "+=1080",
          duration: 0.8,
          ease: "power2.in",
          svgOrigin: "0 0",
        },
        "<",
      )
      .to(
        cartGroupRef.current,
        { x: 280, opacity: 0, duration: 0.7, ease: "power2.in" },
        "<0.1",
      )
      .call(() => {
        setCount(0);
        onCheckout?.(prevCount);
      })
      .set(cartGroupRef.current, { x: 0, y: -140, rotation: 0, opacity: 1 })
      .to(cartGroupRef.current, { y: 0, duration: 0.6, ease: "bounce.out" })
      .to(
        wheelLRef.current,
        {
          rotation: "+=180",
          duration: 0.4,
          ease: "power1.out",
          svgOrigin: "0 0",
        },
        "<0.1",
      )
      .to(
        wheelRRef.current,
        {
          rotation: "+=180",
          duration: 0.4,
          ease: "power1.out",
          svgOrigin: "0 0",
        },
        "<",
      )
      .set(badgeRef.current, { scale: 0 });
  });

  // ─── Build stacked items ──────────────────────────────────────
  // Items stack from bottom of basket upward.
  // Basket interior: y=14 (top) to y=68 (bottom).
  // Each item is a small gift box. They stack onto each other.
  const visibleItems = Math.min(count, maxVisible);
  const ITEM_H = 13; // height of each gift box
  const ITEM_GAP = 1; // gap between stacked items
  const BASKET_BOTTOM = 67; // y position of basket floor (inside)
  const BASKET_LEFT = 28; // inner left edge
  const BASKET_WIDTH = 64; // inner width

  const stackedItems = [];
  for (let i = 0; i < visibleItems; i++) {
    const bottomY = BASKET_BOTTOM - (i + 1) * (ITEM_H + ITEM_GAP);
    stackedItems.push({
      y: bottomY,
      color: itemColors[i % itemColors.length],
    });
  }

  // Button sizing scales with cart width
  const btnSize = Math.max(28, Math.round(width * 0.22));
  const fontSize = Math.max(11, Math.round(width * 0.08));

  return (
    <div
      ref={containerRef}
      className={`inline-flex flex-col items-center gap-4 select-none ${className}`}
      style={{
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      {/* ═══ Cart + Badge ═══ */}
      <div
        className="relative cursor-pointer"
        onClick={checkout}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
      >
        <div ref={cartGroupRef} style={{ transformOrigin: "center bottom" }}>
          <svg
            viewBox="0 0 120 100"
            width={width}
            height={height}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ── Handle ── */}
            {/* Horizontal grip */}
            <line
              x1="4"
              y1="20"
              x2="16"
              y2="20"
              stroke={cartColor}
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Diagonal arm to basket */}
            <line
              x1="16"
              y1="20"
              x2="26"
              y2="68"
              stroke={cartColor}
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* ── Basket ── */}
            {/* Main body */}
            <rect
              x="24"
              y="10"
              width="72"
              height="60"
              rx="5"
              fill={cartColor}
            />
            {/* Inner area */}
            <rect
              x="27"
              y="13"
              width="66"
              height="54"
              rx="3.5"
              fill="#475569"
            />
            {/* Subtle inner glow */}
            <rect
              x="27"
              y="13"
              width="66"
              height="54"
              rx="3.5"
              fill="white"
              opacity="0.06"
            />

            {/* ── Stacked Items (bottom → up) ── */}
            {stackedItems.map((item, i) => (
              <g key={i}>
                {/* Gift box */}
                <rect
                  x={BASKET_LEFT}
                  y={item.y}
                  width={BASKET_WIDTH}
                  height={ITEM_H}
                  rx="2.5"
                  fill={item.color}
                />
                {/* Vertical ribbon */}
                <line
                  x1={BASKET_LEFT + BASKET_WIDTH / 2}
                  y1={item.y}
                  x2={BASKET_LEFT + BASKET_WIDTH / 2}
                  y2={item.y + ITEM_H}
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.5"
                  strokeLinecap="round"
                />
                {/* Horizontal ribbon */}
                <line
                  x1={BASKET_LEFT}
                  y1={item.y + ITEM_H / 2}
                  x2={BASKET_LEFT + BASKET_WIDTH}
                  y2={item.y + ITEM_H / 2}
                  stroke="white"
                  strokeWidth="1.5"
                  opacity="0.3"
                  strokeLinecap="round"
                />
                {/* Bow dot (ribbon knot) */}
                <circle
                  cx={BASKET_LEFT + BASKET_WIDTH / 2}
                  cy={item.y + ITEM_H / 2}
                  r="2"
                  fill="white"
                  opacity="0.6"
                />
              </g>
            ))}

            {/* ── Basket Rim (on top of items) ── */}
            <rect x="22" y="8" width="76" height="6" rx="3" fill={cartColor} />
            {/* Rim highlight */}
            <rect
              x="24"
              y="9"
              width="72"
              height="2"
              rx="1"
              fill="white"
              opacity="0.12"
            />

            {/* ── Basket Bottom ── */}
            <rect x="24" y="68" width="72" height="4" rx="2" fill={cartColor} />

            {/* ── Axle Stubs ── */}
            <line
              x1="42"
              y1="72"
              x2="42"
              y2="80"
              stroke={cartColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="78"
              y1="72"
              x2="78"
              y2="80"
              stroke={cartColor}
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* ── Left Wheel ── */}
            <g ref={wheelLRef} transform="translate(42, 87)">
              <circle cx="0" cy="0" r="8" fill={cartColor} />
              <circle cx="0" cy="0" r="5" fill="#64748b" />
              <circle cx="0" cy="0" r="2" fill={cartColor} />
              <line
                x1="0"
                y1="-6"
                x2="0"
                y2="6"
                stroke="#94a3b8"
                strokeWidth="1"
                opacity="0.4"
              />
              <line
                x1="-6"
                y1="0"
                x2="6"
                y2="0"
                stroke="#94a3b8"
                strokeWidth="1"
                opacity="0.4"
              />
            </g>

            {/* ── Right Wheel ── */}
            <g ref={wheelRRef} transform="translate(78, 87)">
              <circle cx="0" cy="0" r="8" fill={cartColor} />
              <circle cx="0" cy="0" r="5" fill="#64748b" />
              <circle cx="0" cy="0" r="2" fill={cartColor} />
              <line
                x1="0"
                y1="-6"
                x2="0"
                y2="6"
                stroke="#94a3b8"
                strokeWidth="1"
                opacity="0.4"
              />
              <line
                x1="-6"
                y1="0"
                x2="6"
                y2="0"
                stroke="#94a3b8"
                strokeWidth="1"
                opacity="0.4"
              />
            </g>
          </svg>
        </div>

        {/* ── Badge Counter ── */}
        <div
          ref={badgeRef}
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            minWidth: Math.max(20, width * 0.14),
            height: Math.max(20, width * 0.14),
            borderRadius: 999,
            background: accentColor,
            color: "#fff",
            fontSize: Math.max(10, width * 0.075),
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 5px",
            boxShadow: `0 2px 8px ${accentColor}50`,
            border: "2.5px solid white",
            transform: count > 0 ? "scale(1)" : "scale(0)",
            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            fontFamily: "inherit",
            lineHeight: 1,
          }}
        >
          {count}
        </div>
      </div>

      {/* ═══ Controls ═══ */}
      <div className="flex items-center gap-3">
        {/* Minus */}
        <button
          onClick={removeItem}
          disabled={count <= 0}
          style={{
            width: btnSize,
            height: btnSize,
            borderRadius: btnSize / 2,
            border: "2px solid #e2e8f0",
            background: "#fff",
            cursor: count > 0 ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: count > 0 ? 1 : 0.4,
            transition: "all 0.2s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
          onMouseEnter={(e) => {
            if (count > 0) e.currentTarget.style.borderColor = "#94a3b8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
        >
          <Minus
            style={{ width: fontSize, height: fontSize, color: "#64748b" }}
          />
        </button>

        {/* Count */}
        <div
          style={{
            minWidth: Math.max(36, width * 0.25),
            textAlign: "center",
            fontSize: fontSize + 4,
            fontWeight: 800,
            color: "#1e293b",
            fontFamily: "inherit",
          }}
        >
          {count}
        </div>

        {/* Plus */}
        <button
          onClick={addItem}
          style={{
            width: btnSize,
            height: btnSize,
            borderRadius: btnSize / 2,
            border: "none",
            background: accentColor,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            boxShadow: `0 2px 8px ${accentColor}30`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Plus style={{ width: fontSize, height: fontSize, color: "#fff" }} />
        </button>
      </div>

      {/* ═══ Hint ═══ */}
      <p
        style={{
          fontSize: Math.max(11, fontSize - 1),
          fontWeight: 500,
          color: "#94a3b8",
          margin: 0,
          textAlign: "center",
          fontFamily: "inherit",
          lineHeight: 1.4,
        }}
      >
        {count > 0 ? "Click cart to checkout!" : "Add items to cart"}
      </p>
    </div>
  );
}
