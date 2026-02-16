import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const containerRef = useRef(null);
  const [isDark, setIsDark] = useState(true);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleToggle = contextSafe(() => {
    setIsDark(!isDark);

    // Background transition
    gsap.to(".toggle-bg", {
      backgroundColor: isDark ? "#e2e8f0" : "#1e293b", // slate-200 -> slate-800
      duration: 0.5,
    });

    // Knob movement
    gsap.to(".toggle-knob", {
      x: isDark ? 32 : 0,
      duration: 0.4,
      ease: "back.out(1.7)",
      backgroundColor: isDark ? "#ffffff" : "#0f172a", // white -> slate-950
    });

    // Icon rotation and fade
    if (isDark) {
      // Switch to Light Mode
      gsap.to(".icon-moon", {
        scale: 0,
        rotation: 90,
        opacity: 0,
        duration: 0.3,
      });
      gsap.fromTo(
        ".icon-sun",
        { scale: 0, rotation: -90, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.4, delay: 0.1 },
      );
    } else {
      // Switch to Dark Mode
      gsap.to(".icon-sun", {
        scale: 0,
        rotation: 90,
        opacity: 0,
        duration: 0.3,
      });
      gsap.fromTo(
        ".icon-moon",
        { scale: 0, rotation: -90, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.4, delay: 0.1 },
      );
    }
  });

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center p-8 bg-slate-950/50 rounded-2xl border border-slate-800"
    >
      <button
        onClick={handleToggle}
        className="toggle-bg relative w-16 h-8 rounded-full bg-slate-800 shadow-inner flex items-center px-1 transition-colors"
        aria-label="Toggle Theme"
      >
        <div className="toggle-knob w-6 h-6 rounded-full bg-slate-950 shadow-md relative flex items-center justify-center z-10">
          <Moon className="icon-moon w-3.5 h-3.5 text-blue-400 absolute fill-blue-400/20" />
          <Sun className="icon-sun w-3.5 h-3.5 text-yellow-500 absolute scale-0 opacity-0 fill-yellow-500/20" />
        </div>
      </button>
      <span className="ml-4 text-sm font-mono text-slate-400">
        {isDark ? "Dark Mode" : "Light Mode"}
      </span>
    </div>
  );
}
