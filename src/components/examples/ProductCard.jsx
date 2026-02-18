import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";

// ╔══════════════════════════════════════════════════════════════════╗
// ║  ProductCard — Configurable Product Card (Free)                ║
// ║                                                                ║
// ║  USAGE:                                                        ║
// ║  <ProductCard />                         // uses defaults      ║
// ║  <ProductCard                                                  ║
// ║    product={{                                                   ║
// ║      name: "Ultra Boost",                                      ║
// ║      category: "Running",                                      ║
// ║      price: 199.99,                                            ║
// ║      originalPrice: 249.99,                                    ║
// ║      image: "/shoes/main.png",                                 ║
// ║    }}                                                           ║
// ║    colors={[                                                    ║
// ║      { bg: "bg-blue-200",  image: "/shoes/blue.png" },         ║
// ║      { bg: "bg-red-200",   image: "/shoes/red.png" },          ║
// ║    ]}                                                           ║
// ║    animate={false}                                              ║
// ║    onAddToCart={(product, qty) => handleCart(product, qty)}      ║
// ║  />                                                            ║
// ╚══════════════════════════════════════════════════════════════════╝

// ─── Default Product Data ──────────────────────────────────────────
const DEFAULT_PRODUCT = {
  name: "Nike Air Max 270",
  category: "Women Shoes",
  price: 139.99,
  originalPrice: 169.99, // set to null to hide
  image:
    "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
};

// ─── Default Color Variants ────────────────────────────────────────
const DEFAULT_COLORS = [
  {
    bg: "bg-slate-200",
    image:
      "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
  },
  {
    bg: "bg-blue-200",
    image:
      "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
  },
  {
    bg: "bg-green-200",
    image:
      "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
  },
  {
    bg: "bg-red-200",
    image:
      "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
  },
];

// ─── Default Animation Config ──────────────────────────────────────
const DEFAULT_ANIMATION = {
  entrance: true, // card slide-up entrance
  floatingImage: true, // image float loop
  floatDistance: -10, // px to float
  floatDuration: 2, // seconds per float cycle
  colorTransition: true, // animate image on color change
};

const ProductCard = ({
  product = DEFAULT_PRODUCT,
  colors = DEFAULT_COLORS,
  animate = DEFAULT_ANIMATION,
  maxQuantity = 10,
  onAddToCart = null,
  onFavoriteToggle = null,
  className = "",
}) => {
  // Merge with defaults
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
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Resolve current image
  const currentImage = colors[selectedColor]?.image || p.image;

  useGSAP(
    () => {
      if (anim.entrance) {
        gsap.from(cardRef.current, {
          y: 50,
          opacity: 0,
          duration: 1,
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

  const handleColorChange = (index) => {
    setSelectedColor(index);
    if (anim.colorTransition && imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { scale: 0.9, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
      );
    }
  };

  const handleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    if (onFavoriteToggle) onFavoriteToggle(newState, p);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(
        {
          ...p,
          selectedColor: selectedColor,
          image: currentImage,
        },
        quantity,
      );
    }
  };

  const formatPrice = (val) =>
    typeof val === "number" ? `$${val.toFixed(2)}` : val;

  return (
    <div
      ref={cardRef}
      className={`relative w-full max-w-[340px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl font-sans text-white border border-slate-800 mx-auto ${className}`}
    >
      {/* ── Image Area ── */}
      <div className="relative h-64 w-full bg-slate-800/50 flex items-center justify-center p-6 group overflow-hidden">
        <button
          onClick={handleFavorite}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-300 ${
              isFavorite ? "fill-orange-500 text-orange-500" : "text-white"
            }`}
          />
        </button>

        <img
          ref={imageRef}
          src={currentImage}
          alt={p.name}
          loading="lazy"
          className="w-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] z-10"
        />

        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* ── Content ── */}
      <div className="p-6">
        {/* Color Thumbnails */}
        {colors.length > 1 && (
          <div className="flex gap-3 mb-6">
            {colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => handleColorChange(idx)}
                className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  selectedColor === idx
                    ? "border-orange-500 scale-110"
                    : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                }`}
              >
                <img
                  src={color.image || p.image}
                  alt={`Variant ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 ${color.bg} mix-blend-multiply opacity-50`}
                ></div>
              </button>
            ))}
          </div>
        )}

        {/* Category */}
        {p.category && (
          <div className="mb-1">
            <span className="text-orange-500 text-xs font-bold tracking-wider uppercase">
              {p.category}
            </span>
          </div>
        )}

        <h3 className="text-2xl font-bold mb-4">{p.name}</h3>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-8">
          <span className="text-3xl font-bold text-white">
            {formatPrice(p.price)}
          </span>
          {p.originalPrice && (
            <span className="text-slate-500 text-lg line-through">
              {formatPrice(p.originalPrice)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 bg-slate-800 rounded-xl px-4 py-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-white hover:text-orange-500 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              className="text-white hover:text-orange-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span className="group-hover:hidden">Add to Cart</span>
            <ShoppingCart className="w-5 h-5 hidden group-hover:block" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
