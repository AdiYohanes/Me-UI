import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import {
  ChevronDown,
  Sliders,
  Settings,
  LogOut,
  User,
  Bell,
} from "lucide-react";

export default function ModernDropdown() {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const toggleMenu = contextSafe(() => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      // Open animation
      gsap.fromTo(
        ".dropdown-menu",
        { opacity: 0, y: -10, scale: 0.95, display: "none" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          display: "block",
          duration: 0.3,
          ease: "back.out(1.7)",
        },
      );

      gsap.fromTo(
        ".menu-item",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, delay: 0.1 },
      );

      gsap.to(".trigger-icon", { rotation: 180, duration: 0.3 });
    } else {
      // Close animation
      gsap.to(".dropdown-menu", {
        opacity: 0,
        y: -10,
        scale: 0.95,
        duration: 0.2,
        onComplete: () => gsap.set(".dropdown-menu", { display: "none" }),
      });
      gsap.to(".trigger-icon", { rotation: 0, duration: 0.3 });
    }
  });

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        onClick={toggleMenu}
        className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all text-white font-medium shadow-lg hover:shadow-xl active:scale-95 duration-200"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
          JD
        </div>
        <span>John Doe</span>
        <ChevronDown className="trigger-icon w-4 h-4 text-slate-400 transition-transform" />
      </button>

      {/* Dropdown Menu */}
      <div className="dropdown-menu absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden hidden z-50 ring-1 ring-black ring-opacity-5">
        <div className="p-2 space-y-1">
          {[
            { icon: User, label: "Profile", shortcut: "⌘P" },
            { icon: Settings, label: "Settings", shortcut: "⌘S" },
            { icon: Bell, label: "Notifications", badge: 3 },
          ].map((item, idx) => (
            <button
              key={idx}
              className="menu-item w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                <span>{item.label}</span>
              </div>
              {item.shortcut && (
                <span className="text-xs text-slate-600 font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 group-hover:border-slate-600">
                  {item.shortcut}
                </span>
              )}
              {item.badge && (
                <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="h-px bg-slate-800 my-1 mx-2"></div>

          <button className="menu-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
