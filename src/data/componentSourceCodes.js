
// Mock source code mapping for demo/copy-paste functionality
// In a real app, this could be loaded from actual files or a CMS
export const componentSourceCodes = {
  BookingBar: `import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { MapPin, Calendar, Users, Search, Minus, Plus, Loader2, LocateFixed, ChevronDown, CheckCircle2 } from "lucide-react";

export default function BookingBar() {
  const containerRef = useRef(null);
  const searchBtnRef = useRef(null);
  const [activeTab, setActiveTab] = useState("stays");
  const [activeField, setActiveField] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Data States
  const [location, setLocation] = useState("Bali, Indonesia");
  const [dates, setDates] = useState({ start: null, end: null }); 
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [selectionMode, setSelectionMode] = useState("start");

  // Mock Data
  const locations = [
    { name: "Bali, Indonesia", icon: "🏝️", desc: "Tropical paradise" },
    { name: "Jakarta, Indonesia", icon: "🏙️", desc: "Capital city" },
    { name: "Yogyakarta, Indonesia", icon: "🏯", desc: "Cultural hub" },
    { name: "Lombok, Indonesia", icon: "🌊", desc: "Island life" },
    { name: "Raja Ampat", icon: "🐠", desc: "Diving heaven" },
  ];

  const { contextSafe } = useGSAP({ scope: containerRef });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveField(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFieldClick = contextSafe((field) => {
    if (activeField === field) {
      setActiveField(null);
      return;
    }
    setActiveField(field);

    gsap.fromTo(\`.field-\${field}\`,
      { scale: 0.95, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
    );
  });

  const handleSearch = contextSafe(() => {
    if (isSearching) return;
    setIsSearching(true);
    setActiveField(null);

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setIsSearching(false);
          gsap.to(".search-text", { opacity: 0, display: "none", duration: 0.1 });
        }, 2000);
      },
    });
    
    tl.to(".search-btn", { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
  });

  const handleDateClick = (day) => {
    if (selectionMode === "start" || (dates.start && dates.end)) {
        setDates({ start: day, end: null });
        setSelectionMode("end");
    } else if (selectionMode === "end") {
        if (day < dates.start) {
            setDates({ start: day, end: dates.start });
        } else {
             setDates({ ...dates, end: day });
        }
        setSelectionMode("start");
    }
  };

  const renderCalendar = () => (
    <div className="p-2">
      <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="text-slate-500 font-semibold text-xs py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2 gap-x-1">
      {[...Array(31)].map((_, i) => {
        const day = i + 1;
        const isStart = day === dates.start;
        const isEnd = day === dates.end;
        const isRange = dates.start && dates.end && day > dates.start && day < dates.end;
        
        return (
          <div key={i} className="relative flex justify-center">
             {isRange && <div className="absolute inset-y-0 inset-x-[-2px] bg-blue-500/10 z-0"></div>}
             {isStart && dates.end && <div className="absolute inset-y-0 right-[-2px] left-1/2 bg-blue-500/10 z-0 rounded-l-full"></div>}
             {isEnd && dates.start && <div className="absolute inset-y-0 left-[-2px] right-1/2 bg-blue-500/10 z-0 rounded-r-full"></div>}

            <button
                className={\`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                    \${isStart || isEnd ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105" : ""}
                    \${!isStart && !isEnd && !isRange ? "text-slate-300 hover:bg-slate-800 hover:text-white" : ""}
                    \${isRange ? "text-blue-400" : ""}
                \`}
                onClick={(e) => { e.stopPropagation(); handleDateClick(day); }}
            >
                {day}
            </button>
          </div>
        );
      })}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="w-full max-w-4xl bg-slate-950 p-6 rounded-[2rem] border border-slate-800/50 shadow-2xl relative select-none">
      {/* Shortened for brevity in demo display, full implementation included in real code */}
      {/* ... tabs, fields, calendar, dropdowns ... */}
      <div className="bg-slate-900/80 backdrop-blur-md p-2 rounded-[1.5rem] border border-slate-800 flex flex-col md:flex-row gap-2 relative z-10 shadow-xl">
         {/* ... inputs ... */}
         <button onClick={handleSearch} className={\`search-btn bg-blue-600 text-white p-2 rounded-2xl min-w-[64px] h-[64px] group \${isSearching ? "cursor-wait" : ""}\`}>
            {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
         </button>
      </div>
    </div>
  );
}`,
  ThemeToggle: `import React, { useState } from "react";
import { gsap } from "gsap";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    // Animate the toggle
    gsap.to(".toggle-handle", {
      x: newTheme ? 0 : 32,
      duration: 0.4,
      ease: "elastic.out(1, 0.6)",
    });

    // Rotate icons
    gsap.to(".toggle-icon", {
      rotation: newTheme ? 0 : 360,
      duration: 0.6,
      ease: "back.out(1.7)",
    });
  };

  return (
    <div
      onClick={toggleTheme}
      className={\`w-20 h-10 rounded-full p-1 cursor-pointer relative transition-colors duration-300 \${
        isDark ? "bg-slate-800" : "bg-blue-100"
      }\`}
    >
      <div className="toggle-handle w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center relative z-10">
        <div className="toggle-icon">
          {isDark ? (
            <Moon className="w-4 h-4 text-slate-800" />
          ) : (
            <Sun className="w-4 h-4 text-orange-500" />
          )}
        </div>
      </div>
    </div>
  );
}`,
  ProductCard: `import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";

export default function ProductCard() {
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
            className={\`w-5 h-5 transition-colors duration-300 \${isFavorite ? "fill-orange-500 text-orange-500" : "text-white"}\`}
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
              className={\`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 \${selectedColor === idx ? "border-orange-500 scale-110" : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"}\`}
            >
              <img
                src={color.img}
                alt="variant"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div
                className={\`absolute inset-0 \${color.bg} mix-blend-multiply opacity-50\`}
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

          <button className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group">
            <span className="group-hover:hidden">Add to Cart</span>
            <ShoppingCart className="w-5 h-5 hidden group-hover:block" />
          </button>
        </div>
      </div>
    </div>
  );
}`,
  AnimatedCart: `import React, { useState } from "react";
import { gsap } from "gsap";
import { ShoppingCart, Check } from "lucide-react";

export default function AnimatedCart() {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    if (isAdded) return;
    setIsAdded(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => setIsAdded(false), 2000);
      }
    });

    // Cart shake
    tl.to(".cart-icon", { rotation: -10, duration: 0.1 })
      .to(".cart-icon", { rotation: 10, duration: 0.1 })
      .to(".cart-icon", { rotation: -10, duration: 0.1 })
      .to(".cart-icon", { rotation: 0, duration: 0.1 })
      // Scale down to transform
      .to(".cart-btn", { width: 50, borderRadius: "50%", duration: 0.3 })
      // Show checkmark
      .to(".cart-icon", { opacity: 0, duration: 0.1 }, "<")
      .to(".check-icon", { opacity: 1, scale: 1, duration: 0.3 }, "-=0.2");
  };

  return (
    <button
      onClick={handleClick}
      className="cart-btn bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 overflow-hidden relative min-w-[50px] min-h-[50px]"
    >
      <ShoppingCart className="cart-icon w-5 h-5" />
      <Check className="check-icon w-5 h-5 absolute opacity-0 scale-0" />
      <span className="cart-text whitespace-nowrap overflow-hidden" 
        style={{ width: isAdded ? 0 : "auto", opacity: isAdded ? 0 : 1 }}>
        Add to Cart
      </span>
    </button>
  );
}`,
  ModernDropdown: `import React, { useState } from "react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";

export default function ModernDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-700 transition-colors"
      >
        <span className="font-semibold">My Account</span>
        <ChevronDown className={\`w-4 h-4 transition-transform duration-300 \${isOpen ? "rotate-180" : ""}\`} />
      </button>

      {/* Simplified for demo, use conditional rendering in production */}
      <div className={\`absolute top-[calc(100%+0.5rem)] left-0 w-56 bg-white rounded-2xl p-2 shadow-xl origin-top-left transition-all duration-300 \${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}\`}>
         <div className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-xl cursor-pointer text-slate-700">
            <User className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Profile</span>
         </div>
         <div className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-xl cursor-pointer text-slate-700">
            <Settings className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Settings</span>
         </div>
         <div className="h-[1px] bg-slate-100 my-1"></div>
         <div className="flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl cursor-pointer text-red-500">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
         </div>
      </div>
    </div>
  );
}`,
  ProductCardSlide: `// Premium Component - Slide-to-Add Product Card
// See full source in src/components/examples/ProductCardSlide.jsx
import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ShoppingCart, Star, ChevronDown, Check } from "lucide-react";

const ProductCardSlide = () => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const sliderRef = useRef(null);
  const knobRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const colors = [
    { name: "LIME", dot: "bg-lime-400" },
    { name: "SKY", dot: "bg-sky-400" },
    { name: "ROSE", dot: "bg-rose-400" },
    { name: "VIOLET", dot: "bg-violet-400" },
  ];

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 40, opacity: 0, duration: 0.8, ease: "power3.out"
    });
    gsap.to(imageRef.current, {
      y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: "sine.inOut"
    });
  }, { scope: cardRef });

  // Slide-to-add with drag interaction (mouse + touch)
  // Full implementation includes:
  // - Mouse/touch event handlers for drag
  // - Elastic snap-back animation on incomplete slides
  // - Success animation with color change + checkmark
  // - Auto-reset after 2.5 seconds

  return (
    <div ref={cardRef} className="w-full max-w-[340px] bg-white rounded-3xl shadow-2xl">
      {/* Header with gradient bg, color dropdown, price */}
      {/* Product image with floating animation */}
      {/* Star rating (4.5/5) + review count */}
      {/* Product name + description */}
      {/* Slide-to-add: draggable knob with cart icon */}
    </div>
  );
};

export default ProductCardSlide;`,
  ProductCardPremium: `// Premium Component - Limited Edition Product Card
// See full source in src/components/examples/ProductCardPremium.jsx
import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Heart, Minus, Plus, ShoppingBag, Flame } from "lucide-react";

const ProductCardPremium = () => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const colors = [
    { name: "Midnight", ring: "ring-orange-500" },
    { name: "Ocean", ring: "ring-cyan-400" },
    { name: "Shadow", ring: "ring-slate-400" },
    { name: "Fire", ring: "ring-red-500" },
  ];

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 50, opacity: 0, duration: 0.8, ease: "power3.out"
    });
    gsap.to(imageRef.current, {
      y: -10, rotation: 2, duration: 3,
      yoyo: true, repeat: -1, ease: "sine.inOut"
    });
  }, { scope: cardRef });

  // Add to cart with GSAP timeline animation:
  // - Button scale bounce (elastic.out)
  // - Text slide up + fade out
  // - Success text slide in from below
  // - Auto-reset after 1.5 seconds

  return (
    <div ref={cardRef} className="w-full max-w-[360px] bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Dark gradient header with product image */}
      {/* LIMITED EDITION badge (amber) */}
      {/* Heart/favorite button */}
      {/* Color variant thumbnails with ring highlight */}
      {/* Category label + price with strikethrough */}
      {/* Description with accent border */}
      {/* Inventory status bar (gradient orange-red) */}
      {/* Quantity selector + ADD TO CART button */}
    </div>
  );
};

export default ProductCardPremium;`,
  BookingBarPremium: `// Premium Component - Traveloka-Style Travel Booking Bar
// See full source in src/components/examples/BookingBarPremium.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Plane, Hotel, Car, Train, MapPin, CalendarDays,
  Users, Search, ArrowLeftRight, ChevronDown, ChevronRight,
  Check, Minus, Plus, Loader2, Baby, User, Briefcase,
} from "lucide-react";

// Configurable via props:
// categories - Tab items with emoji, label, and discount badges
// cities     - From/To city options with code and country
// classes    - Cabin class options (Economy, Business, etc.)
// defaultFrom - Default departure city
// promoBanner - Bottom promo banner with emoji, text, CTA
// animate    - Enable/disable GSAP animations
// onSearch   - Callback with all search parameters

const BookingBarPremium = ({
  categories = DEFAULT_CATEGORIES,
  cities = DEFAULT_CITIES,
  classes = DEFAULT_CLASSES,
  defaultFrom = { city: "Jakarta", code: "JKTC" },
  promoBanner = DEFAULT_PROMO,
  animate = true,
  onSearch = null,
}) => {
  // Features:
  // - Multi-tab categories (Flights, Hotels, Trains, etc.) with discount badges
  // - One-way / Round-trip radio toggle
  // - From/To city selectors with search and swap button
  // - Calendar date pickers with past-date blocking
  // - Passenger counter (Adults, Children, Infants)
  // - Cabin class selector (Economy, Business, First)
  // - Animated "Let's Search" button
  // - Promo banner with CTA

  return (
    <div className="w-full max-w-[980px] bg-white rounded-2xl shadow-xl border">
      {/* Category Tabs with emojis and discount badges */}
      {/* One-way / Round-trip toggle */}
      {/* Search fields: From | Swap | To | Departure | Return | Passengers */}
      {/* "Let's Search" button */}
      {/* Promo banner */}
    </div>
  );
};

export default BookingBarPremium;`,
  ThemeTogglePremium: `// Premium Component - Scenic Day/Night Toggle
// See full source in src/components/examples/ThemeTogglePremium.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Inspired by Dribbble landscape scene toggles
// Features:
// - Full scenic day/night transition within toggle track
// - Sky gradient: golden sunrise to starry night
// - Rolling green hills silhouette that darken at night
// - Animated clouds that drift in/out
// - Twinkling stars with staggered GSAP animation
// - Sun with expanding rays, moon with craters
// - Knob slides with back.out easing + elastic press feedback
// - Three sizes (sm/md/lg), controlled or uncontrolled

export default function ThemeTogglePremium({
  isDark: controlledDark,
  onToggle,
  size = "md",
  showLabel = true,
  className = "",
}) {
  // Internal state fallback (uncontrolled mode)
  const [internalDark, setInternalDark] = useState(false);
  const dark = controlledDark !== undefined ? controlledDark : internalDark;

  return (
    <button
      className="relative overflow-hidden cursor-pointer"
      style={{ width: 280, height: 120, borderRadius: 60 }}
      aria-label="Toggle dark/light mode"
      role="switch"
      aria-checked={dark}
    >
      {/* Sky gradient background */}
      {/* Stars (SVG circles with twinkle animation) */}
      {/* Cloud puffs (SVG ellipses) */}
      {/* Rolling hills (SVG paths) */}
      {/* Sliding knob with Sun/Moon inside */}
    </button>
  );
}`,
  AnimatedCartPremium: `// Premium Component - Interactive Shopping Cart
// See full source in src/components/examples/AnimatedCartPremium.jsx
import React, { useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Minus, Plus } from "lucide-react";

// Features:
// - Custom SVG cart with rolling wheels on hover
// - +/- buttons to add/remove items
// - Items visually fill cart basket (up to 4 visible, colored boxes)
// - Badge counter at top-right corner
// - Click cart: drives away right → falls from top empty with bounce
// - Fully configurable via props

// Props:
// maxVisible  - number: max visible items in cart (default 4)
// itemColors  - string[]: colors for package items
// cartColor   - string: cart body color
// accentColor - string: buttons & badge color
// onCheckout  - (count) => void: checkout callback
// size        - "sm" | "md" | "lg"
// className   - string: extra wrapper classes

export default function AnimatedCartPremium({
  maxVisible = 4,
  itemColors = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"],
  cartColor = "#334155",
  accentColor = "#3b82f6",
  onCheckout = null,
  size = "md",
  className = "",
}) {
  const [count, setCount] = useState(0);

  return (
    <div className="inline-flex flex-col items-center gap-5">
      {/* SVG Cart with wheels, handle, basket, and item slots */}
      {/* Badge counter (red dot with number) */}
      {/* +/- controls and count display */}
      {/* Hint text */}
    </div>
  );
}`
};

// Components that require premium/paid access
export const premiumComponents = new Set([
  "ProductCardSlide",
  "ProductCardPremium",
  "BookingBarPremium",
  "ThemeTogglePremium",
  "AnimatedCartPremium",
]);
