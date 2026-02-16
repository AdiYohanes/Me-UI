import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ShoppingCart } from "lucide-react";

const AnimatedCart = () => {
  const cartRef = useRef(null);
  const iconRef = useRef(null);
  const badgeRef = useRef(null);
  const [count, setCount] = useState(0);

  const { contextSafe } = useGSAP({ scope: cartRef });

  const handleMouseEnter = contextSafe(() => {
    gsap.to(iconRef.current, {
      rotation: 10,
      duration: 0.1,
      yoyo: true,
      repeat: 3,
      ease: "power1.inOut",
      onComplete: () =>
        gsap.to(iconRef.current, { rotation: 0, duration: 0.2 }),
    });
  });

  const handleClick = contextSafe(() => {
    setCount((prev) => prev + 1);

    // Icon Pop animation
    gsap.fromTo(
      iconRef.current,
      { scale: 0.8 },
      { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.out" },
    );

    // Badge animation
    gsap.fromTo(
      badgeRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
    );
  });

  return (
    <div ref={cartRef} className="flex flex-col items-center gap-4">
      <button
        className="relative group bg-white p-4 rounded-full shadow-lg hover:shadow-blue-500/30 transition-shadow duration-300"
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
      >
        <div ref={iconRef} className="text-slate-800">
          <ShoppingCart className="w-8 h-8" />
        </div>

        {/* Badge */}
        <div
          ref={badgeRef}
          className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-slate-50 ${count === 0 ? "opacity-0 scale-0" : ""}`}
        >
          {count}
        </div>
      </button>
      <p className="text-slate-400 text-sm font-medium">Click me!</p>
    </div>
  );
};

export default AnimatedCart;
