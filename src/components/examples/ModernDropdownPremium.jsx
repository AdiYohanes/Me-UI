import React, { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ChevronDown,
  User,
  Settings,
  Bell,
  CreditCard,
  Shield,
  LogOut,
  Sparkles,
} from "lucide-react";

// ╔══════════════════════════════════════════════════════════════════╗
// ║  ModernDropdownPremium — Premium User Account Dropdown          ║
// ║                                                                ║
// ║  Design: Minimal glassmorphism, dark surface, crisp type       ║
// ║  Motion: Fast spring open, staggered items, subtle hover lift  ║
// ║                                                                ║
// ║  Props (all optional, component works uncontrolled by default) ║
// ║  • userName     — string: display name                         ║
// ║  • userEmail    — string: email sub-label                      ║
// ║  • avatarInitials — string: 2-letter avatar fallback           ║
// ║  • avatarGradient — [string,string]: from/to colors            ║
// ║  • menuItems    — array of menu item configs                   ║
// ║  • onItemClick  — (key) => void: item click callback           ║
// ║  • onLogout     — () => void: logout callback                  ║
// ║  • className    — string: extra wrapper classes                ║
// ╚══════════════════════════════════════════════════════════════════╝

const DEFAULT_ITEMS = [
  {
    key: "profile",
    icon: User,
    label: "Profile",
    sub: "View your account",
    shortcut: "⌘P",
  },
  {
    key: "notifications",
    icon: Bell,
    label: "Notifications",
    sub: "3 unread",
    badge: 3,
  },
  {
    key: "billing",
    icon: CreditCard,
    label: "Billing",
    sub: "Manage subscription",
    shortcut: "⌘B",
  },
  {
    key: "settings",
    icon: Settings,
    label: "Settings",
    sub: "App preferences",
    shortcut: "⌘,",
  },
  { key: "security", icon: Shield, label: "Security", sub: "2FA & sessions" },
];

export default function ModernDropdownPremium({
  userName = "Adi Yohanes",
  userEmail = "adi@indo-ui.com",
  avatarInitials = "AY",
  avatarGradient = ["#6366f1", "#8b5cf6"],
  menuItems = DEFAULT_ITEMS,
  onItemClick = null,
  onLogout = null,
  className = "",
}) {
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const chevronRef = useRef(null);
  const tlRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  // ─── Click-outside close ────────────────────────────────────────
  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (isOpen) closeMenu();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  // ─── GSAP context safe helpers ──────────────────────────────────
  const { contextSafe } = useGSAP({ scope: containerRef });

  const openMenu = contextSafe(() => {
    if (tlRef.current) tlRef.current.kill();

    const menu = menuRef.current;
    const items = menu.querySelectorAll(".dp-item");
    const divider = menu.querySelector(".dp-divider");

    // Make visible before animating
    gsap.set(menu, { display: "block", pointerEvents: "auto" });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl
      // Panel springs in
      .fromTo(
        menu,
        { opacity: 0, y: -8, scale: 0.97, transformOrigin: "top right" },
        { opacity: 1, y: 0, scale: 1, duration: 0.22 },
      )
      // Header fade
      .fromTo(
        ".dp-header",
        { opacity: 0, y: -4 },
        { opacity: 1, y: 0, duration: 0.18 },
        "-=0.12",
      )
      // Items stagger
      .fromTo(
        items,
        { opacity: 0, x: -6 },
        { opacity: 1, x: 0, duration: 0.2, stagger: 0.04 },
        "-=0.1",
      )
      // Divider
      .fromTo(
        divider,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.2, transformOrigin: "left" },
        "-=0.15",
      )
      // Logout row
      .fromTo(
        ".dp-logout",
        { opacity: 0, x: -6 },
        { opacity: 1, x: 0, duration: 0.18 },
        "-=0.1",
      );

    // Chevron rotate
    gsap.to(chevronRef.current, {
      rotation: 180,
      duration: 0.25,
      ease: "power2.out",
    });

    tlRef.current = tl;
  });

  const closeMenu = contextSafe(() => {
    if (tlRef.current) tlRef.current.kill();

    const menu = menuRef.current;

    const tl = gsap.timeline({
      onComplete: () =>
        gsap.set(menu, { display: "none", pointerEvents: "none" }),
    });

    tl.to(menu, {
      opacity: 0,
      y: -6,
      scale: 0.97,
      duration: 0.18,
      ease: "power2.in",
    });

    gsap.to(chevronRef.current, {
      rotation: 0,
      duration: 0.22,
      ease: "power2.out",
    });

    tlRef.current = tl;
  });

  const toggleMenu = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      openMenu();
    } else {
      setIsOpen(false);
      closeMenu();
    }
  }, [isOpen, openMenu, closeMenu]);

  // ─── Item hover micro-animation ─────────────────────────────────
  const handleItemEnter = contextSafe((e) => {
    gsap.to(e.currentTarget, {
      x: 3,
      duration: 0.18,
      ease: "power2.out",
    });
    gsap.to(e.currentTarget.querySelector(".dp-item-icon"), {
      scale: 1.15,
      rotate: -4,
      duration: 0.2,
      ease: "back.out(2)",
    });
  });

  const handleItemLeave = contextSafe((e) => {
    gsap.to(e.currentTarget, { x: 0, duration: 0.2, ease: "power2.out" });
    gsap.to(e.currentTarget.querySelector(".dp-item-icon"), {
      scale: 1,
      rotate: 0,
      duration: 0.2,
      ease: "power2.out",
    });
  });

  // ─── Trigger button micro-press ─────────────────────────────────
  const handleTriggerPress = contextSafe((e) => {
    gsap.to(e.currentTarget, { scale: 0.97, duration: 0.1 });
  });
  const handleTriggerRelease = contextSafe((e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1,0.5)",
    });
    toggleMenu();
  });

  return (
    <div
      ref={containerRef}
      className={`relative inline-block select-none ${className}`}
      style={{
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      {/* ═══ Trigger Button ═══ */}
      <button
        onMouseDown={handleTriggerPress}
        onMouseUp={handleTriggerRelease}
        onTouchStart={handleTriggerPress}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleTriggerRelease(e);
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl
          bg-[#0f1117] border border-white/8 hover:border-white/14
          shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30
          transition-[border-color,box-shadow] duration-200 cursor-pointer
          focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
      >
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black text-white flex-shrink-0 shadow-md"
          style={{
            background: `linear-gradient(135deg, ${avatarGradient[0]}, ${avatarGradient[1]})`,
          }}
        >
          {avatarInitials}
        </div>

        {/* Name */}
        <div className="text-left hidden sm:block">
          <p className="text-[13px] font-semibold text-white leading-tight">
            {userName}
          </p>
          <p className="text-[11px] text-white/40 leading-none mt-0.5 truncate max-w-[120px]">
            {userEmail}
          </p>
        </div>

        {/* Pro badge */}
        <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border border-violet-500/20 text-[9px] font-bold text-violet-300 tracking-wide uppercase">
          <Sparkles className="w-2.5 h-2.5" />
          Pro
        </span>

        {/* Chevron */}
        <ChevronDown
          ref={chevronRef}
          className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors duration-150 flex-shrink-0"
          strokeWidth={2.5}
        />
      </button>

      {/* ═══ Dropdown Panel ═══ */}
      <div
        ref={menuRef}
        style={{
          display: "none",
          pointerEvents: "none",
          fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
        }}
        className="absolute right-0 mt-2.5 w-72 z-50
          rounded-2xl overflow-hidden
          bg-[#0f1117]/95 backdrop-blur-xl
          border border-white/8
          shadow-2xl shadow-black/50
          ring-1 ring-white/4"
      >
        {/* ── Header profile block ── */}
        <div className="dp-header px-4 pt-4 pb-3.5 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-black text-white flex-shrink-0 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${avatarGradient[0]}, ${avatarGradient[1]})`,
              }}
            >
              {avatarInitials}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-white leading-tight">
                {userName}
              </p>
              <p className="text-[11px] text-white/40 truncate mt-0.5">
                {userEmail}
              </p>
            </div>
            <div className="ml-auto flex-shrink-0">
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-violet-600/25 to-indigo-600/25 border border-violet-500/20 text-[9px] font-bold text-violet-300 tracking-wider uppercase">
                <Sparkles className="w-2.5 h-2.5" />
                Pro
              </span>
            </div>
          </div>
        </div>

        {/* ── Menu Items ── */}
        <div className="p-2 space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onMouseEnter={handleItemEnter}
              onMouseLeave={handleItemLeave}
              onClick={() => {
                onItemClick?.(item.key);
                setIsOpen(false);
                closeMenu();
              }}
              className="dp-item w-full flex items-center gap-3 px-3 py-2.5
                rounded-xl cursor-pointer
                hover:bg-white/6 active:bg-white/10
                transition-colors duration-100
                group/item text-left"
            >
              {/* Icon pill */}
              <div className="dp-item-icon w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/6 group-hover/item:bg-white/10 transition-colors duration-150">
                <item.icon
                  className="w-4 h-4 text-white/50 group-hover/item:text-white/80 transition-colors duration-150"
                  strokeWidth={1.8}
                />
              </div>

              {/* Label & sub */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white/80 group-hover/item:text-white leading-tight transition-colors duration-150">
                  {item.label}
                </p>
                {item.sub && (
                  <p className="text-[11px] text-white/30 leading-none mt-0.5 truncate">
                    {item.sub}
                  </p>
                )}
              </div>

              {/* Right: shortcut or badge */}
              {item.shortcut && (
                <span className="text-[10px] text-white/20 font-mono px-1.5 py-0.5 rounded-md border border-white/8 flex-shrink-0 group-hover/item:text-white/35 transition-colors duration-150">
                  {item.shortcut}
                </span>
              )}
              {item.badge && (
                <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-violet-500 rounded-full flex-shrink-0 shadow shadow-violet-500/40">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          {/* Divider */}
          <div className="dp-divider h-px bg-white/6 my-1.5 mx-1" />

          {/* Logout */}
          <button
            onMouseEnter={handleItemEnter}
            onMouseLeave={handleItemLeave}
            onClick={() => {
              onLogout?.();
              setIsOpen(false);
              closeMenu();
            }}
            className="dp-logout dp-item w-full flex items-center gap-3 px-3 py-2.5
              rounded-xl cursor-pointer
              hover:bg-red-500/10 active:bg-red-500/15
              transition-colors duration-100
              group/logout text-left"
          >
            <div className="dp-item-icon w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/6 group-hover/logout:bg-red-500/15 transition-colors duration-150">
              <LogOut
                className="w-4 h-4 text-white/40 group-hover/logout:text-red-400 transition-colors duration-150"
                strokeWidth={1.8}
              />
            </div>
            <p className="text-[13px] font-semibold text-white/60 group-hover/logout:text-red-400 transition-colors duration-150">
              Sign out
            </p>
          </button>
        </div>

        {/* Subtle bottom glow */}
        <div
          className="h-px mx-4"
          style={{
            background: `linear-gradient(90deg, transparent, ${avatarGradient[0]}33, transparent)`,
          }}
        />
      </div>
    </div>
  );
}
