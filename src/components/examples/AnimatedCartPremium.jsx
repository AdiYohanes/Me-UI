import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

// ╔══════════════════════════════════════════════════════════════════╗
// ║  AnimatedCartPremium — Interactive Shopping Cart                ║
// ║                                                                 ║
// ║  Features:                                                      ║
// ║  • Uses the exact cart.svg shape (24×24 viewBox line-art)       ║
// ║  • Smooth hover: lift + wheel spin                              ║
// ║  • Add animation: bounce + badge pop + rolling wheels           ║
// ║  • Remove animation: shake + badge shrink                       ║
// ║  • Checkout: zoom-away right → drop from top empty             ║
// ║  • Count badge with spring animation                            ║
// ║                                                                 ║
// ║  Props:                                                         ║
// ║  • maxVisible  — max item dots in cart (default 5)              ║
// ║  • cartColor   — stroke color for the cart (default #1e293b)    ║
// ║  • accentColor — badge & button fill   (default #6366f1)        ║
// ║  • itemColors  — colors for item dots                           ║
// ║  • onCheckout  — (count) => void callback on checkout           ║
// ║  • width       — base pixel width for the SVG (default 180)     ║
// ║  • className   — optional wrapper class string                  ║
// ╚══════════════════════════════════════════════════════════════════╝

const DEFAULT_ITEM_COLORS = [
  "#6366f1", // indigo
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#ec4899", // pink
  "#0ea5e9", // sky
];

export default function AnimatedCartPremium({
  maxVisible = 5,
  itemColors = DEFAULT_ITEM_COLORS,
  cartColor = "#1e293b",
  accentColor = "#6366f1",
  onCheckout = null,
  width = 180,
  className = "",
}) {
  // ── Refs ──────────────────────────────────────────────────────────
  const containerRef = useRef(null);
  const cartGroupRef = useRef(null); // entire cart SVG group
  const wheelLRef = useRef(null); // left wheel <g>
  const wheelRRef = useRef(null); // right wheel <g>
  const badgeRef = useRef(null); // counter badge
  const cartPathRef = useRef(null); // main cart body <g>
  const isAnimating = useRef(false);

  const [count, setCount] = useState(0);

  // viewBox is 24×24 so SVG is always a square
  const svgSize = width;

  // Stroke width scales so cart outline stays visible at any size
  const sw = Math.max(1.0, (width / 180) * 1.2);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // ── Hover: lift cart + continuous wheel spin ──────────────────────
  const handleHoverEnter = contextSafe(() => {
    if (isAnimating.current) return;
    gsap.to(cartGroupRef.current, {
      y: -6,
      duration: 0.25,
      ease: "power2.out",
    });
    gsap.to([wheelLRef.current, wheelRRef.current], {
      rotation: "+=360",
      duration: 0.7,
      ease: "power1.inOut",
      transformOrigin: "50% 50%",
    });
  });

  const handleHoverLeave = contextSafe(() => {
    if (isAnimating.current) return;
    gsap.to(cartGroupRef.current, {
      y: 0,
      duration: 0.3,
      ease: "elastic.out(1, 0.6)",
    });
  });

  // ── Add Item: bounce + badge pop + wheel roll ─────────────────────
  const addItem = contextSafe(() => {
    if (isAnimating.current) return;
    setCount((p) => p + 1);

    // Cart bounce
    gsap.fromTo(
      cartGroupRef.current,
      { y: 0 },
      { y: -8, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.out" },
    );

    // Badge scale pop
    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(3)" },
      );
    }

    // Wheel spin on add
    gsap.to([wheelLRef.current, wheelRRef.current], {
      rotation: "+=120",
      duration: 0.35,
      ease: "power2.out",
      transformOrigin: "50% 50%",
    });

    // Cart path color flash
    gsap.fromTo(
      cartPathRef.current,
      { opacity: 0.5 },
      { opacity: 1, duration: 0.3, ease: "power1.out" },
    );
  });

  // ── Remove Item: shake + badge shrink ────────────────────────────
  const removeItem = contextSafe(() => {
    if (isAnimating.current || count <= 0) return;
    setCount((p) => Math.max(0, p - 1));

    gsap.fromTo(
      cartGroupRef.current,
      { x: 0 },
      { x: -4, duration: 0.055, yoyo: true, repeat: 5, ease: "power1.inOut" },
    );

    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 1.3 },
        {
          scale: count - 1 > 0 ? 1 : 0,
          duration: 0.35,
          ease: "elastic.out(1, 0.5)",
        },
      );
    }
  });

  // ── Checkout: drive away → fall from top ─────────────────────────
  const checkout = contextSafe(() => {
    if (isAnimating.current || count <= 0) return;
    isAnimating.current = true;
    const prevCount = count;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    // 1. Tilt + accelerate right
    tl.to(cartGroupRef.current, {
      rotation: -5,
      duration: 0.12,
      ease: "power1.in",
    })
      .to(
        [wheelLRef.current, wheelRRef.current],
        {
          rotation: "+=1440",
          duration: 0.75,
          ease: "power2.in",
          transformOrigin: "50% 50%",
        },
        "<",
      )
      .to(
        cartGroupRef.current,
        { x: svgSize * 1.8, opacity: 0, duration: 0.65, ease: "power2.in" },
        "<0.08",
      )
      // 2. Reset state mid-flight (invisible)
      .call(() => {
        setCount(0);
        onCheckout?.(prevCount);
      })
      // 3. Snap to above + reset rotation
      .set(cartGroupRef.current, {
        x: 0,
        y: -svgSize * 1.2,
        rotation: 0,
        opacity: 1,
      })
      // 4. Fall in with bounce
      .to(cartGroupRef.current, { y: 0, duration: 0.65, ease: "bounce.out" })
      // 5. Hide badge instantly
      .set(badgeRef.current, { scale: 0, opacity: 0 }, "<");
  });

  // ── Visible item dots ─────────────────────────────────────────────
  const visibleCount = Math.min(count, maxVisible);

  // Scale helpers
  const btnSize = Math.max(32, Math.round(width * 0.22));
  const fontSize = Math.max(12, Math.round(width * 0.085));
  const badgeSize = Math.max(22, Math.round(width * 0.16));
  const badgeFontSize = Math.max(11, Math.round(width * 0.09));

  // ── Gift box items inside the basket ─────────────────────────────
  // Basket interior (24×24 viewBox):
  //   x: 9.0 → 19.5   (left wall ~x=8.3, right wall ~x=20, with padding)
  //   y: 7.2 → 13.2   (top rim y=6, bottom rail y=14, with padding)
  // Items stack in 3 columns, rows grow upward from the basket floor.
  const BOX_W = 2.9; // gift box width  (SVG units)
  const BOX_H = 2.6; // gift box height (SVG units)
  const BOX_COLS = 3;
  const BOX_GAP_X = 0.45;
  const BOX_GAP_Y = 0.35;
  // Left edge so 3 boxes fill the basket evenly
  const BASKET_LEFT = 9.0;
  const BASKET_FLOOR = 13.2; // y of basket floor (items sit ON top of this)

  const giftBoxes = [];
  for (let i = 0; i < visibleCount; i++) {
    const col = i % BOX_COLS;
    const row = Math.floor(i / BOX_COLS);
    const bx = BASKET_LEFT + col * (BOX_W + BOX_GAP_X);
    // Stack from floor upward — each new row pushes items up
    const by = BASKET_FLOOR - (row + 1) * (BOX_H + BOX_GAP_Y);
    giftBoxes.push({ x: bx, y: by, color: itemColors[i % itemColors.length] });
  }

  return (
    <div
      ref={containerRef}
      className={`inline-flex flex-col items-center gap-5 select-none ${className}`}
      style={{
        fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* ═══ Cart SVG + Badge wrapper ═══ */}
      <div
        className="relative cursor-pointer"
        onClick={checkout}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
        style={{ width: svgSize, height: svgSize }}
      >
        <div
          ref={cartGroupRef}
          style={{
            width: "100%",
            height: "100%",
            transformOrigin: "center bottom",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={svgSize}
            height={svgSize}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ── Clip paths ── */}
            <defs>
              {/* Outer SVG boundary clip */}
              <clipPath id="cart-clip">
                <rect width="24" height="24" />
              </clipPath>
              {/* Basket interior clip — approximate filled rectangle of the basket body */}
              {/* Basket left wall ~x=8.3, right wall ~x=20.9, top y=6, bottom y=14 */}
              <clipPath id="basket-interior">
                <rect x="8.8" y="6.3" width="11.8" height="7.0" rx="0.3" />
              </clipPath>
            </defs>

            <g clipPath="url(#cart-clip)" ref={cartPathRef}>
              {/* ── Handle path — render FIRST (behind everything) ── */}
              <path
                d="M2 4H4.23362C4.68578 4 5.08169 4.30341 5.19924 4.74003L8.30076 16.26C8.41831 16.6966 8.81422 17 9.26638 17H19"
                stroke={cartColor}
                strokeWidth={sw}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* ── Gift boxes (clipped to basket interior) ── */}
              <g clipPath="url(#basket-interior)">
                {giftBoxes.map((box, i) => (
                  <g key={i}>
                    {/* Box body */}
                    <rect
                      x={box.x}
                      y={box.y}
                      width={BOX_W}
                      height={BOX_H}
                      rx="0.4"
                      fill={box.color}
                      opacity="0.92"
                    />
                    {/* Lid separator — brighter top strip */}
                    <rect
                      x={box.x}
                      y={box.y}
                      width={BOX_W}
                      height={BOX_H * 0.32}
                      rx="0.4"
                      fill="white"
                      opacity="0.22"
                    />
                    {/* Vertical ribbon */}
                    <line
                      x1={box.x + BOX_W / 2}
                      y1={box.y}
                      x2={box.x + BOX_W / 2}
                      y2={box.y + BOX_H}
                      stroke="white"
                      strokeWidth="0.55"
                      opacity="0.65"
                    />
                    {/* Horizontal ribbon */}
                    <line
                      x1={box.x}
                      y1={box.y + BOX_H * 0.32}
                      x2={box.x + BOX_W}
                      y2={box.y + BOX_H * 0.32}
                      stroke="white"
                      strokeWidth="0.45"
                      opacity="0.55"
                    />
                    {/* Bow — left loop */}
                    <path
                      d={`M ${box.x + BOX_W / 2} ${box.y - 0.05} C ${box.x + BOX_W / 2 - 0.65} ${box.y - 0.75}, ${box.x + BOX_W / 2 - 0.65} ${box.y - 0.15}, ${box.x + BOX_W / 2} ${box.y - 0.05}`}
                      stroke="white"
                      strokeWidth="0.42"
                      fill="none"
                      opacity="0.8"
                    />
                    {/* Bow — right loop */}
                    <path
                      d={`M ${box.x + BOX_W / 2} ${box.y - 0.05} C ${box.x + BOX_W / 2 + 0.65} ${box.y - 0.75}, ${box.x + BOX_W / 2 + 0.65} ${box.y - 0.15}, ${box.x + BOX_W / 2} ${box.y - 0.05}`}
                      stroke="white"
                      strokeWidth="0.42"
                      fill="none"
                      opacity="0.8"
                    />
                  </g>
                ))}
              </g>

              {/* ── Basket rim/body path — render ON TOP of items ── */}
              <path
                d="M5.33331 6H19.8672C20.4687 6 20.9341 6.52718 20.8595 7.12403L20.1095 13.124C20.0469 13.6245 19.6215 14 19.1172 14H16.5555H9.44442H7.99998"
                stroke={cartColor}
                strokeWidth={sw}
                strokeLinejoin="round"
              />

              {/* ── Left wheel ── */}
              <g ref={wheelLRef} style={{ transformOrigin: "10px 20px" }}>
                <circle
                  cx="10"
                  cy="20"
                  r="1"
                  stroke={cartColor}
                  strokeWidth={sw * 0.92}
                  strokeLinejoin="round"
                />
                <line
                  x1="10"
                  y1="19.15"
                  x2="10"
                  y2="20.85"
                  stroke={cartColor}
                  strokeWidth={sw * 0.45}
                  opacity="0.55"
                />
                <line
                  x1="9.15"
                  y1="20"
                  x2="10.85"
                  y2="20"
                  stroke={cartColor}
                  strokeWidth={sw * 0.45}
                  opacity="0.55"
                />
              </g>

              {/* ── Right wheel (centered at cx=17.5, cy=20) ── */}
              <g ref={wheelRRef} style={{ transformOrigin: "17.5px 20px" }}>
                <circle
                  cx="17.5"
                  cy="20"
                  r="1"
                  stroke={cartColor}
                  strokeWidth={sw * 0.92}
                  strokeLinejoin="round"
                />
                <line
                  x1="17.5"
                  y1="19.15"
                  x2="17.5"
                  y2="20.85"
                  stroke={cartColor}
                  strokeWidth={sw * 0.45}
                  opacity="0.55"
                />
                <line
                  x1="16.65"
                  y1="20"
                  x2="18.35"
                  y2="20"
                  stroke={cartColor}
                  strokeWidth={sw * 0.45}
                  opacity="0.55"
                />
              </g>
            </g>
          </svg>
        </div>

        {/* ── Badge Counter ── */}
        <div
          ref={badgeRef}
          style={{
            position: "absolute",
            top: Math.round(svgSize * 0.04),
            right: Math.round(svgSize * 0.06),
            minWidth: badgeSize,
            height: badgeSize,
            borderRadius: 9999,
            background: accentColor,
            color: "#fff",
            fontSize: badgeFontSize,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 5px",
            boxShadow: `0 3px 10px ${accentColor}55, 0 1px 3px rgba(0,0,0,0.15)`,
            border: "2.5px solid white",
            transform: count > 0 ? "scale(1)" : "scale(0)",
            opacity: count > 0 ? 1 : 0,
            lineHeight: 1,
            zIndex: 10,
            willChange: "transform",
          }}
        >
          {count}
        </div>
      </div>

      {/* ═══ Controls ═══ */}
      <div className="flex items-center gap-3">
        {/* ── Minus ── */}
        <button
          onClick={removeItem}
          disabled={count <= 0}
          aria-label="Remove item"
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
            opacity: count > 0 ? 1 : 0.38,
            transition: "border-color 0.18s, transform 0.15s, opacity 0.2s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            outline: "none",
          }}
          onMouseEnter={(e) => {
            if (count > 0) {
              e.currentTarget.style.borderColor = "#94a3b8";
              e.currentTarget.style.transform = "scale(1.07)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Minus
            style={{ width: fontSize, height: fontSize, color: "#64748b" }}
          />
        </button>

        {/* ── Count display ── */}
        <div
          style={{
            minWidth: Math.max(40, width * 0.27),
            textAlign: "center",
            fontSize: fontSize + 6,
            fontWeight: 800,
            color: "#0f172a",
            fontFamily: "inherit",
            transition: "color 0.2s",
            letterSpacing: "-0.02em",
          }}
        >
          {count}
        </div>

        {/* ── Plus ── */}
        <button
          onClick={addItem}
          aria-label="Add item"
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
            transition: "transform 0.15s, box-shadow 0.15s",
            boxShadow: `0 3px 10px ${accentColor}45`,
            outline: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = `0 5px 15px ${accentColor}60`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = `0 3px 10px ${accentColor}45`;
          }}
        >
          <Plus style={{ width: fontSize, height: fontSize, color: "#fff" }} />
        </button>
      </div>

      {/* ═══ Instruction hint ═══ */}
      <p
        style={{
          fontSize: Math.max(11, fontSize - 2),
          fontWeight: 500,
          color: "#94a3b8",
          margin: 0,
          textAlign: "center",
          fontFamily: "inherit",
          lineHeight: 1.4,
          letterSpacing: "0.01em",
        }}
      >
        {count > 0 ? (
          <>
            <ShoppingCart
              style={{
                display: "inline",
                width: fontSize,
                height: fontSize,
                verticalAlign: "middle",
                marginRight: 4,
                color: accentColor,
              }}
            />
            Click cart to checkout!
          </>
        ) : (
          "Add items to cart"
        )}
      </p>
    </div>
  );
}
