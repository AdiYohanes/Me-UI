import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Heart, Minus, Plus, ShoppingBag, Flame } from "lucide-react";

// ╔══════════════════════════════════════════════════════════════════╗
// ║  ProductCardPremium — Configurable Premium Product Card        ║
// ║                                                                ║
// ║  USAGE:                                                        ║
// ║  <ProductCardPremium />                  // uses defaults      ║
// ║  <ProductCardPremium                                           ║
// ║    product={{                                                   ║
// ║      name: "Ultra Boost",                                      ║
// ║      price: 199,                                               ║
// ║      originalPrice: 249.99,                                    ║
// ║      category: "Running",                                      ║
// ║      description: "Next-gen cushioning technology.",            ║
// ║      badge: "New Arrival",                                     ║
// ║      stock: { current: 12, total: 50 },                        ║
// ║    }}                                                           ║
// ║    colors={[                                                    ║
// ║      { name: "Black", ring: "ring-slate-500",                  ║
// ║        bg: "from-slate-900 to-slate-800",                      ║
// ║        image: "/shoes/black.png" },                             ║
// ║      { name: "White", ring: "ring-blue-400",                   ║
// ║        bg: "from-blue-900 to-slate-800",                       ║
// ║        image: "/shoes/white.png" },                             ║
// ║    ]}                                                           ║
// ║    animate={false}                                              ║
// ║    onAddToCart={(product, qty) => console.log(product, qty)}    ║
// ║  />                                                            ║
// ╚══════════════════════════════════════════════════════════════════╝

// ─── Default Product Data ──────────────────────────────────────────
const DEFAULT_PRODUCT = {
  name: "Air Max 270",
  category: "Performance",
  description:
    "Experience maximum cushioning with the tallest Air unit to date. Designed for lifestyle and all-day comfort.",
  price: 139,
  originalPrice: 169.99, // set to null to hide strikethrough
  image:
    "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
  badge: "Limited Edition", // set to null to hide badge
  badgeColor: "bg-amber-500", // Tailwind bg class for badge
  stock: {
    // set to null to hide stock bar
    current: 12,
    total: 50,
    lowThreshold: 15, // show "Low Stock" when current <= this
  },
};

// ─── Default Color Variants ────────────────────────────────────────
// Each color MUST have its own `image` for the variant thumbnails
const DEFAULT_COLORS = [
  {
    name: "Midnight",
    ring: "ring-orange-500",
    bg: "from-slate-900 via-slate-800 to-slate-900",
    image:
      "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
  },
  {
    name: "Ocean",
    ring: "ring-cyan-400",
    bg: "from-cyan-900 via-slate-800 to-slate-900",
    image:
      "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
  },
  {
    name: "Shadow",
    ring: "ring-slate-400",
    bg: "from-zinc-800 via-slate-900 to-zinc-900",
    image:
      "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
  },
  {
    name: "Fire",
    ring: "ring-red-500",
    bg: "from-red-950 via-slate-900 to-slate-900",
    image:
      "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
  },
];

// ─── Default Animation Config ──────────────────────────────────────
const DEFAULT_ANIMATION = {
  entrance: true, // card slide-up entrance
  floatingImage: true, // image float + slight rotation loop
  floatDistance: -10, // px to float
  floatDuration: 3, // seconds per float cycle
  colorTransition: true, // animate image on color change
  cartBounce: true, // elastic bounce on add-to-cart
  favoriteSpring: true, // spring animation on heart click
};

const ProductCardPremium = ({
  product = DEFAULT_PRODUCT,
  colors = DEFAULT_COLORS,
  animate = DEFAULT_ANIMATION,
  maxQuantity = 10,
  onAddToCart = null,
  onFavoriteToggle = null,
  className = "",
}) => {
  // Merge with defaults (so partial overrides work)
  const p = { ...DEFAULT_PRODUCT, ...product };
  if (product.stock) p.stock = { ...DEFAULT_PRODUCT.stock, ...product.stock };
  const anim =
    animate === false
      ? {
          entrance: false,
          floatingImage: false,
          colorTransition: false,
          cartBounce: false,
          favoriteSpring: false,
        }
      : {
          ...DEFAULT_ANIMATION,
          ...(typeof animate === "object" ? animate : {}),
        };

  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Resolve current image
  const currentImage = colors[selectedColor]?.image || p.image;

  // Stock calculation
  const stockPercent = p.stock
    ? Math.round((p.stock.current / p.stock.total) * 100)
    : null;
  const isLowStock = p.stock && p.stock.current <= (p.stock.lowThreshold || 15);

  // ─── Animations ──────────────────────────────────────────────
  useGSAP(
    () => {
      if (anim.entrance) {
        gsap.from(cardRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      if (anim.floatingImage && imageRef.current) {
        gsap.to(imageRef.current, {
          y: anim.floatDistance,
          rotation: 2,
          duration: anim.floatDuration,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    },
    { scope: cardRef },
  );

  // ─── Color Change Handler ────────────────────────────────────
  const handleColorChange = (index) => {
    setSelectedColor(index);
    if (anim.colorTransition && imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { scale: 0.85, opacity: 0, rotation: -5 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
      );
    }
  };

  // ─── Add to Cart Handler ─────────────────────────────────────
  const handleAddToCart = () => {
    if (isAdding) return;
    setIsAdding(true);

    if (anim.cartBounce) {
      const tl = gsap.timeline({
        onComplete: () => setTimeout(() => setIsAdding(false), 1500),
      });

      tl.to(".atc-btn", { scale: 0.95, duration: 0.1 })
        .to(".atc-btn", {
          scale: 1,
          duration: 0.3,
          ease: "elastic.out(1, 0.4)",
        })
        .to(".atc-text", { y: -30, opacity: 0, duration: 0.2 }, "<")
        .fromTo(
          ".atc-success",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
          "-=0.1",
        )
        .to(".atc-success", { y: -30, opacity: 0, duration: 0.2, delay: 1 })
        .to(".atc-text", {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
    } else {
      setTimeout(() => setIsAdding(false), 1500);
    }

    if (onAddToCart) {
      onAddToCart(
        {
          ...p,
          selectedColor: colors[selectedColor]?.name,
          image: currentImage,
        },
        quantity,
      );
    }
  };

  // ─── Favorite Handler ────────────────────────────────────────
  const handleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    if (anim.favoriteSpring) {
      gsap.fromTo(
        ".heart-icon",
        { scale: 0.5 },
        { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" },
      );
    }
    if (onFavoriteToggle) onFavoriteToggle(newState, p);
  };

  // ─── Format Price ────────────────────────────────────────────
  const formatPrice = (val) =>
    typeof val === "number" ? `$${val % 1 === 0 ? val : val.toFixed(2)}` : val;

  return (
    <div
      ref={cardRef}
      className={`relative w-full max-w-[360px] bg-white rounded-3xl overflow-hidden shadow-[0_25px_60px_-12px_rgba(0,0,0,0.2)] font-sans mx-auto select-none ${className}`}
    >
      {/* ── Image Section (Dark Header) ── */}
      <div
        className={`relative h-[280px] w-full bg-gradient-to-br ${colors[selectedColor]?.bg || "from-slate-900 to-slate-800"} flex items-center justify-center p-8 overflow-hidden`}
      >
        {/* Badge */}
        {p.badge && (
          <div className="absolute top-4 left-4 z-20">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${p.badgeColor || "bg-amber-500"} text-white text-[10px] font-black uppercase tracking-wider shadow-lg`}
            >
              <Flame className="w-3 h-3" />
              {p.badge}
            </div>
          </div>
        )}

        {/* Heart */}
        <button
          onClick={handleFavorite}
          className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isFavorite
              ? "bg-red-500 shadow-lg shadow-red-500/30"
              : "bg-white/10 backdrop-blur-sm hover:bg-white/20"
          }`}
        >
          <Heart
            className={`heart-icon w-5 h-5 transition-colors duration-300 ${
              isFavorite ? "fill-white text-white" : "text-white"
            }`}
          />
        </button>

        {/* Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[60%] bg-orange-500/10 rounded-full blur-[60px] pointer-events-none"></div>

        {/* Product Image */}
        <img
          ref={imageRef}
          src={currentImage}
          alt={p.name}
          loading="lazy"
          className="w-[90%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-10 -rotate-[12deg]"
        />

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* ── Color Variants ── */}
      {colors.length > 1 && (
        <div className="flex justify-center gap-3 -mt-5 relative z-20 px-6">
          {colors.map((c, i) => (
            <button
              key={i}
              onClick={() => handleColorChange(i)}
              className={`w-12 h-12 rounded-xl bg-white border-2 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
                selectedColor === i
                  ? `ring-2 ${c.ring} ring-offset-2 scale-110 shadow-md`
                  : "border-slate-200 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={c.image || p.image}
                alt={c.name}
                loading="lazy"
                className="w-full h-full object-cover p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Content ── */}
      <div className="p-6 pt-4">
        {/* Category + Price */}
        <div className="flex items-start justify-between mb-1">
          {p.category && (
            <span className="text-orange-500 text-[10px] font-black tracking-[0.2em] uppercase">
              {p.category}
            </span>
          )}
          <div className="text-right">
            <span className="text-2xl font-black text-slate-900">
              {formatPrice(p.price)}
            </span>
            {p.originalPrice && (
              <p className="text-xs text-slate-400 line-through">
                {formatPrice(p.originalPrice)}
              </p>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-2">{p.name}</h3>

        {/* Description with accent bar */}
        {p.description && (
          <div className="flex gap-3 mb-5">
            <div className="w-[3px] bg-gradient-to-b from-orange-400 to-orange-200 rounded-full flex-shrink-0"></div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {p.description}
            </p>
          </div>
        )}

        {/* Inventory Status */}
        {p.stock && stockPercent !== null && (
          <>
            <div className="flex items-center justify-between mb-5 px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Inventory Status
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isLowStock ? "text-orange-500" : "text-green-500"
                }`}
              >
                {isLowStock ? "Low Stock" : "In Stock"} ({p.stock.current} left)
              </span>
            </div>
            <div className="relative h-1.5 bg-slate-100 rounded-full mb-6 overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                  isLowStock
                    ? "bg-gradient-to-r from-orange-400 to-red-500"
                    : "bg-gradient-to-r from-green-400 to-emerald-500"
                }`}
                style={{ width: `${stockPercent}%` }}
              ></div>
            </div>
          </>
        )}

        {/* Actions Row */}
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center gap-0 border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-900 w-8 text-center text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              className="px-3 py-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="atc-btn flex-1 bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden relative disabled:opacity-70"
          >
            <div className="atc-text flex items-center gap-2">
              <span className="text-sm tracking-wide">ADD TO CART</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="atc-success absolute flex items-center gap-2 opacity-0">
              <span className="text-sm font-bold">ADDED ✓</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardPremium;
