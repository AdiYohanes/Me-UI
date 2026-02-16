import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";

const ProductCard = () => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const colors = [
    {
      bg: "bg-slate-200",
      img: "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
    },
    {
      bg: "bg-blue-200",
      img: "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
    },
    {
      bg: "bg-green-200",
      img: "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
    },
    {
      bg: "bg-red-200",
      img: "https://freepngimg.com/thumb/shoes/27428-5-nike-shoes-transparent-background.png",
    },
  ];

  useGSAP(
    () => {
      // Entrance Animation
      gsap.from(cardRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Image Float Loop
      gsap.to(imageRef.current, {
        y: -10,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    },
    { scope: cardRef },
  );

  const handleColorChange = (index) => {
    setSelectedColor(index);
    gsap.fromTo(
      imageRef.current,
      { scale: 0.9, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
    );
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full max-w-[340px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl font-sans text-white border border-slate-800 mx-auto"
    >
      {/* Header / Image Area */}
      <div className="relative h-64 w-full bg-slate-800/50 flex items-center justify-center p-6 group overflow-hidden">
        {/* Heart Icon */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-300 ${isFavorite ? "fill-orange-500 text-orange-500" : "text-white"}`}
          />
        </button>

        {/* Product Image */}
        <img
          ref={imageRef}
          src={colors[selectedColor].img}
          alt="Nike Air Max 270"
          loading="lazy"
          className="w-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] z-10"
        />

        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Content Body */}
      <div className="p-6">
        {/* Thumbnails */}
        <div className="flex gap-3 mb-6">
          {colors.map((color, idx) => (
            <button
              key={idx}
              onClick={() => handleColorChange(idx)}
              className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedColor === idx ? "border-orange-500 scale-110" : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"}`}
            >
              <img
                src={color.img}
                alt="variant"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {/* Overlay to simulate color since we use same image */}
              <div
                className={`absolute inset-0 ${color.bg} mix-blend-multiply opacity-50`}
              ></div>
            </button>
          ))}
        </div>

        <div className="mb-1">
          <span className="text-orange-500 text-xs font-bold tracking-wider uppercase">
            Women Shoes
          </span>
        </div>

        <h3 className="text-2xl font-bold mb-4">Nike Air Max 270</h3>

        <div className="flex items-baseline gap-3 mb-8">
          <span className="text-3xl font-bold text-white">$139.99</span>
          <span className="text-slate-500 text-lg line-through">$169.99</span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-4 bg-slate-800 rounded-xl px-4 py-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-white hover:text-orange-500 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-white hover:text-orange-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group">
            <span className="group-hover:hidden">Add to Cart</span>
            <ShoppingCart className="w-5 h-5 hidden group-hover:block" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
