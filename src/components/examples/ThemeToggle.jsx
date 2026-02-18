import React, { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const containerRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Sync visual state on mount and theme changes
  useEffect(() => {
    if (!containerRef.current) return;

    // Background
    gsap.to(containerRef.current.querySelector(".toggle-bg"), {
      backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
      duration: 0.5,
    });

    // Knob
    gsap.to(containerRef.current.querySelector(".toggle-knob"), {
      x: isDark ? 0 : 32,
      duration: 0.4,
      ease: "back.out(1.7)",
      backgroundColor: isDark ? "#0f172a" : "#ffffff",
    });

    // Icons
    if (isDark) {
      gsap.to(containerRef.current.querySelector(".icon-sun"), {
        scale: 0,
        rotation: 90,
        opacity: 0,
        duration: 0.3,
      });
      gsap.to(containerRef.current.querySelector(".icon-moon"), {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.4,
        delay: 0.1,
      });
    } else {
      gsap.to(containerRef.current.querySelector(".icon-moon"), {
        scale: 0,
        rotation: 90,
        opacity: 0,
        duration: 0.3,
      });
      gsap.to(containerRef.current.querySelector(".icon-sun"), {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.4,
        delay: 0.1,
      });
    }
  }, [isDark]);

  const handleToggle = contextSafe(() => {
    toggleTheme();
  });

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center p-8 rounded-2xl border transition-colors duration-300 ${
        isDark
          ? "bg-slate-950/50 border-slate-800"
          : "bg-white border-slate-200 shadow-sm"
      }`}
    >
      <button
        onClick={handleToggle}
        className={`toggle-bg relative w-16 h-8 rounded-full shadow-inner flex items-center px-1 transition-colors ${
          isDark ? "bg-slate-800" : "bg-slate-200"
        }`}
        aria-label="Toggle Theme"
      >
        <div
          className={`toggle-knob w-6 h-6 rounded-full shadow-md relative flex items-center justify-center z-10 ${
            isDark ? "bg-slate-950" : "bg-white"
          }`}
        >
          <Moon
            className={`icon-moon w-3.5 h-3.5 text-blue-400 absolute fill-blue-400/20 ${
              !isDark ? "scale-0 opacity-0" : ""
            }`}
          />
          <Sun
            className={`icon-sun w-3.5 h-3.5 text-yellow-500 absolute fill-yellow-500/20 ${
              isDark ? "scale-0 opacity-0" : ""
            }`}
          />
        </div>
      </button>
      <span
        className={`ml-4 text-sm font-mono transition-colors duration-300 ${
          isDark ? "text-slate-400" : "text-slate-600"
        }`}
      >
        {isDark ? "Dark Mode" : "Light Mode"}
      </span>
    </div>
  );
}
