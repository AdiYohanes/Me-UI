import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ShoppingCart, Star, ChevronDown, Check } from "lucide-react";

// ╔══════════════════════════════════════════════════════════════════╗
// ║  ProductCardSlide — Configurable Premium Product Card          ║
// ║                                                                ║
// ║  USAGE:                                                        ║
// ║  <ProductCardSlide />                    // uses defaults      ║
// ║  <ProductCardSlide                                             ║
// ║    product={{ name: "My Shoe", price: 79.99 }}                 ║
// ║    animate={false}                                             ║
// ║    onAddToCart={(product) => console.log(product)}             ║
// ║  />                                                            ║
// ╚══════════════════════════════════════════════════════════════════╝

// ─── Default Product Data ──────────────────────────────────────────
const DEFAULT_PRODUCT = {
  name: "New Sneakers TL",
  description:
    "Lightweight, durable sneakers made for all-day comfort and everyday style. Engineered for the modern step.",
  price: 59.99,
  originalPrice: null, // set to show strikethrough, e.g. 89.99
  rating: 4, // 1-5 star rating
  reviewCount: 263,
  image:
    "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
};

// ─── Default Color Variants ────────────────────────────────────────
// Each color can optionally have its own image
const DEFAULT_COLORS = [
  {
    name: "LIME",
    dot: "bg-lime-400",
    accent: "from-lime-50 to-white",
    image: null,
  },
  {
    name: "SKY",
    dot: "bg-sky-400",
    accent: "from-sky-50 to-white",
    image: null,
  },
  {
    name: "ROSE",
    dot: "bg-rose-400",
    accent: "from-rose-50 to-white",
    image: null,
  },
  {
    name: "VIOLET",
    dot: "bg-violet-400",
    accent: "from-violet-50 to-white",
    image: null,
  },
];

// ─── Default Animation Config ──────────────────────────────────────
const DEFAULT_ANIMATION = {
  entrance: true, // card entrance animation
  floatingImage: true, // image float up/down loop
  floatDistance: -8, // px to float
  floatDuration: 2.5, // seconds per float cycle
  colorTransition: true, // animate on color change
};

const ProductCardSlide = ({
  product = DEFAULT_PRODUCT,
  colors = DEFAULT_COLORS,
  animate = DEFAULT_ANIMATION,
  onAddToCart = null,
  className = "",
}) => {
  // Merge with defaults (so partial overrides work)
  const p = { ...DEFAULT_PRODUCT, ...product };
  const anim =
    animate === false
      ? { entrance: false, floatingImage: false, colorTransition: false }
      : {
          ...DEFAULT_ANIMATION,
          ...(typeof animate === "object" ? animate : {}),
        };

  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const sliderRef = useRef(null);
  const knobRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [showColors, setShowColors] = useState(false);

  // Resolve current image (color-specific or product default)
  const currentImage = colors[selectedColor]?.image || p.image;

  // ─── Animations ──────────────────────────────────────────────
  useGSAP(
    () => {
      if (anim.entrance) {
        gsap.from(cardRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      if (anim.floatingImage && imageRef.current) {
        gsap.to(imageRef.current, {
          y: anim.floatDistance,
          duration: anim.floatDuration,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    },
    { scope: cardRef },
  );

  // ─── Slide-to-add Logic ──────────────────────────────────────
  const handleSlideStart = (e) => {
    if (isAdded) return;
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const slider = sliderRef.current;
    const knob = knobRef.current;
    if (!slider || !knob) return;

    const sliderRect = slider.getBoundingClientRect();
    const knobWidth = knob.offsetWidth;
    const maxX = sliderRect.width - knobWidth - 8;

    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let x = clientX - sliderRect.left - knobWidth / 2;
      x = Math.max(0, Math.min(x, maxX));
      gsap.set(knob, { x });

      if (x >= maxX - 5) {
        setIsDragging(false);
        setIsAdded(true);

        gsap.to(knob, { x: maxX, duration: 0.2, ease: "power2.out" });
        gsap.to(".slide-text", { opacity: 0, duration: 0.2 });
        gsap.to(".slide-track", { backgroundColor: "#22c55e", duration: 0.3 });
        gsap.fromTo(
          ".slide-check",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
        );

        // Fire callback
        if (onAddToCart) {
          onAddToCart({
            ...p,
            selectedColor: colors[selectedColor]?.name,
            image: currentImage,
          });
        }

        setTimeout(() => {
          setIsAdded(false);
          gsap.to(knob, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
          gsap.to(".slide-text", { opacity: 1, duration: 0.3, delay: 0.3 });
          gsap.to(".slide-track", {
            backgroundColor: "#f1f5f9",
            duration: 0.3,
          });
          gsap.to(".slide-check", { scale: 0, opacity: 0, duration: 0.2 });
        }, 2500);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      if (!isAdded) {
        gsap.to(knob, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, isAdded]);

  // ─── Color Change Handler ────────────────────────────────────
  const handleColorSelect = (i) => {
    setSelectedColor(i);
    setShowColors(false);
    if (anim.colorTransition && imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
      );
    }
  };

  // ─── Format Price ────────────────────────────────────────────
  const formatPrice = (val) =>
    typeof val === "number" ? `$${val.toFixed(2)}` : val;

  return (
    <div
      ref={cardRef}
      className={`relative w-full max-w-[340px] bg-white rounded-3xl overflow-visible shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] font-sans text-slate-900 mx-auto select-none ${className}`}
    >
      {/* ── Header ── */}
      <div
        className={`relative h-72 w-full bg-gradient-to-b ${colors[selectedColor]?.accent || "from-slate-50 to-white"} rounded-t-3xl flex items-center justify-center p-8 overflow-hidden`}
      >
        {/* Color Dropdown */}
        {colors.length > 1 && (
          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={() => setShowColors(!showColors)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white transition-all shadow-sm"
            >
              <span
                className={`w-2 h-2 rounded-full ${colors[selectedColor]?.dot || "bg-slate-400"}`}
              ></span>
              {colors[selectedColor]?.name || "Default"}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${showColors ? "rotate-180" : ""}`}
              />
            </button>

            {showColors && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 min-w-[120px] z-50">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleColorSelect(i)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      selectedColor === i
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${c.dot}`}
                    ></span>
                    {c.name}
                    {selectedColor === i && (
                      <Check className="w-3 h-3 ml-auto text-green-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price */}
        <div className="absolute top-4 right-5 z-20 text-right">
          <span className="text-2xl font-black text-slate-800">
            {formatPrice(p.price)}
          </span>
          {p.originalPrice && (
            <p className="text-xs text-slate-400 line-through">
              {formatPrice(p.originalPrice)}
            </p>
          )}
        </div>

        {/* Product Image */}
        <img
          ref={imageRef}
          src={currentImage}
          alt={p.name}
          loading="lazy"
          className="w-[85%] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)] z-10 -rotate-[8deg]"
        />
      </div>

      {/* ── Content ── */}
      <div className="p-6 pt-5">
        {/* Rating */}
        {p.rating > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= p.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200 fill-slate-200"
                  }`}
                />
              ))}
            </div>
            {p.reviewCount > 0 && (
              <span className="text-xs text-slate-400 font-medium">
                ({p.reviewCount} Reviews)
              </span>
            )}
          </div>
        )}

        {/* Name & Description */}
        <h3 className="text-xl font-bold text-slate-900 mb-1.5">{p.name}</h3>
        {p.description && (
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            {p.description}
          </p>
        )}

        {/* Slide to Add */}
        <div
          ref={sliderRef}
          className="slide-track relative h-14 bg-slate-100 rounded-2xl overflow-hidden cursor-pointer"
        >
          <div className="slide-text absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
            <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
              Slide to Add
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 -rotate-90" />
          </div>

          <div className="slide-check absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 scale-0">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-white" />
              <span className="text-sm font-bold text-white tracking-wide">
                Added!
              </span>
            </div>
          </div>

          <div
            ref={knobRef}
            onMouseDown={handleSlideStart}
            onTouchStart={handleSlideStart}
            className="absolute top-1 left-1 w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shadow-lg hover:bg-slate-700 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSlide;
