import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Search,
  ArrowLeftRight,
  ChevronDown,
  ChevronRight,
  Minus,
  Plus,
  Loader2,
  Baby,
  User,
  Users,
} from "lucide-react";

// ╔══════════════════════════════════════════════════════════════════╗
// ║  BookingBarPremium — Travel Booking Bar (Traveloka-Style)      ║
// ╚══════════════════════════════════════════════════════════════════╝

// ─── Defaults ──────────────────────────────────────────────────────
const DEFAULT_CATEGORIES = [
  { key: "flights", label: "Flights", emoji: "✈️", discount: null },
  { key: "todos", label: "To Dos", emoji: "🎯", discount: null },
  { key: "hotels", label: "Hotels", emoji: "🏨", discount: "-40%" },
  { key: "pickup", label: "Airport Pickup", emoji: "🚐", discount: "-20%" },
  { key: "trains", label: "Trains", emoji: "🚂", discount: null },
  { key: "villas", label: "Villas & Apt.", emoji: "🏡", discount: "-40%" },
];

const DEFAULT_CITIES = [
  { city: "Jakarta", code: "JKTC", country: "Indonesia", emoji: "🏙️" },
  { city: "Surabaya", code: "SUB", country: "Indonesia", emoji: "🌆" },
  { city: "Bali / Denpasar", code: "DPS", country: "Indonesia", emoji: "🏝️" },
  { city: "Yogyakarta", code: "JOG", country: "Indonesia", emoji: "🏯" },
  { city: "Bandung", code: "BDO", country: "Indonesia", emoji: "🌄" },
  { city: "Medan", code: "KNO", country: "Indonesia", emoji: "🌿" },
  { city: "Makassar", code: "UPG", country: "Indonesia", emoji: "⛵" },
  { city: "Singapore", code: "SIN", country: "Singapore", emoji: "🇸🇬" },
  { city: "Kuala Lumpur", code: "KUL", country: "Malaysia", emoji: "🇲🇾" },
  { city: "Bangkok", code: "BKK", country: "Thailand", emoji: "🇹🇭" },
];

const DEFAULT_CLASSES = [
  "Economy",
  "Premium Economy",
  "Business",
  "First Class",
];

const DEFAULT_PROMO = {
  emoji: "✈️",
  text: "Yuk, cek ada promo apa aja yang bisa kamu pakai biar pesan tiket pesawat jadi lebih hemat.",
  ctaText: "Cek promonya sekarang!",
};

// ─── Date Helpers ──────────────────────────────────────────────────
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

const getToday = () => {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
};
const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const formatDate = (d) => {
  if (!d) return null;
  const dt = new Date(d.year, d.month, d.day);
  return `${DAYS_OF_WEEK[dt.getDay()]}, ${d.day} ${MONTHS[d.month]} ${String(d.year).slice(-2)}`;
};
const isSameDate = (a, b) =>
  a && b && a.year === b.year && a.month === b.month && a.day === b.day;
const isAfterDate = (a, b) =>
  a && b && new Date(a.year, a.month, a.day) > new Date(b.year, b.month, b.day);
const isBetweenDates = (d, s, e) => {
  if (!d || !s || !e) return false;
  const dd = new Date(d.year, d.month, d.day);
  return (
    dd > new Date(s.year, s.month, s.day) &&
    dd < new Date(e.year, e.month, e.day)
  );
};
const isBeforeToday = (d) => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return new Date(d.year, d.month, d.day) < t;
};

// ═══════════════════════════════════════════════════════════════════
// Dropdown Portal — renders at body level via fixed positioning
// ═══════════════════════════════════════════════════════════════════
function DropdownPortal({ anchorRef, open, alignRight, width, children }) {
  const [style, setStyle] = useState({
    position: "fixed",
    opacity: 0,
    pointerEvents: "none",
  });

  const recalc = useCallback(() => {
    if (!anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    let left = alignRight ? r.right - width : r.left;
    if (left < 8) left = 8;
    if (left + width > window.innerWidth - 8)
      left = window.innerWidth - width - 8;

    // Decide if dropdown should appear above or below
    const spaceBelow = window.innerHeight - r.bottom;
    const top = spaceBelow > 360 ? r.bottom + 6 : undefined;
    const bottom =
      spaceBelow <= 360 ? window.innerHeight - r.top + 6 : undefined;

    setStyle({
      position: "fixed",
      top: top != null ? top : undefined,
      bottom: bottom != null ? bottom : undefined,
      left,
      width,
      zIndex: 99999,
      opacity: 1,
      pointerEvents: "auto",
    });
  }, [anchorRef, alignRight, width]);

  // Sync position BEFORE browser paint
  useLayoutEffect(() => {
    if (!open) return;
    recalc();
    // Also recalc on next frame for safety (some browsers defer layout)
    const raf = requestAnimationFrame(recalc);
    return () => cancelAnimationFrame(raf);
  }, [open, recalc]);

  // Track scroll on every scrollable ancestor + window resize
  useEffect(() => {
    if (!open) return;
    const onUpdate = () => requestAnimationFrame(recalc);

    // Walk up the DOM to find scrollable ancestors
    const scrollParents = [];
    let el = anchorRef.current?.parentElement;
    while (el) {
      const s = getComputedStyle(el);
      if (/(auto|scroll)/.test(s.overflow + s.overflowY + s.overflowX)) {
        scrollParents.push(el);
        el.addEventListener("scroll", onUpdate, { passive: true });
      }
      el = el.parentElement;
    }
    window.addEventListener("resize", onUpdate);
    window.addEventListener("scroll", onUpdate, true); // capture phase catches all scrolls

    return () => {
      scrollParents.forEach((p) => p.removeEventListener("scroll", onUpdate));
      window.removeEventListener("resize", onUpdate);
      window.removeEventListener("scroll", onUpdate, true);
    };
  }, [open, recalc, anchorRef]);

  if (!open) return null;

  return createPortal(
    <div
      className="bbp-portal"
      style={style}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
          animation: "bbpDropIn 0.2s cubic-bezier(0.16,1,0.3,1) forwards",
        }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

// ═══════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════
const BookingBarPremium = ({
  categories = DEFAULT_CATEGORIES,
  cities = DEFAULT_CITIES,
  classes = DEFAULT_CLASSES,
  defaultFrom = { city: "Jakarta", code: "JKTC" },
  defaultCategory = "flights",
  promoBanner = DEFAULT_PROMO,
  animate = true,
  onSearch = null,
  className = "",
}) => {
  const containerRef = useRef(null);
  const today = getToday();

  // Refs for each field (portal anchors)
  const refFrom = useRef(null);
  const refTo = useRef(null);
  const refDepart = useRef(null);
  const refReturn = useRef(null);
  const refPax = useRef(null);

  // State
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [tripType, setTripType] = useState("oneway");
  const [activeField, setActiveField] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [fromCity, setFromCity] = useState(
    cities.find((c) => c.code === defaultFrom.code) || cities[0],
  );
  const [toCity, setToCity] = useState(null);
  const [cityQuery, setCityQuery] = useState("");
  const [departureDate, setDepartureDate] = useState(today);
  const [returnDate, setReturnDate] = useState(null);
  const [calMonth, setCalMonth] = useState({
    year: today.year,
    month: today.month,
  });
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [seatClass, setSeatClass] = useState(classes[0]);

  const totalPax = passengers.adults + passengers.children + passengers.infants;

  // GSAP entrance
  const { contextSafe } = useGSAP({ scope: containerRef });
  useGSAP(
    () => {
      if (animate)
        gsap.from(containerRef.current, {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        });
    },
    { scope: containerRef },
  );

  // Close on click outside (check both container AND portal)
  useEffect(() => {
    const handler = (e) => {
      const inContainer = containerRef.current?.contains(e.target);
      const inPortal = e.target.closest?.(".bbp-portal");
      if (!inContainer && !inPortal) setActiveField(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Handlers
  const openField = contextSafe((f) => {
    setActiveField((prev) => (prev === f ? null : f));
    setCityQuery("");
  });
  const swapCities = contextSafe(() => {
    setFromCity(toCity);
    setToCity(fromCity);
    if (animate)
      gsap.fromTo(
        ".bbp-swap",
        { rotation: 0 },
        { rotation: 180, duration: 0.35, ease: "back.out(1.7)" },
      );
  });
  const doSearch = contextSafe(() => {
    if (isSearching) return;
    setIsSearching(true);
    setActiveField(null);
    if (animate)
      gsap.fromTo(
        ".bbp-btn",
        { scale: 1 },
        { scale: 0.94, duration: 0.08, yoyo: true, repeat: 1 },
      );
    onSearch?.({
      category: activeCategory,
      tripType,
      from: fromCity,
      to: toCity,
      departure: departureDate,
      return: returnDate,
      passengers,
      class: seatClass,
    });
    setTimeout(() => setIsSearching(false), 2000);
  });

  const filteredCities = cities.filter(
    (c) =>
      c.city.toLowerCase().includes(cityQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(cityQuery.toLowerCase()),
  );

  // ─── Shared dropdown styles (inline, no Tailwind dependency for portals) ─
  const dropdownBox = {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 20px 60px -10px rgba(0,0,0,0.20), 0 0 0 1px rgba(0,0,0,0.04)",
    overflow: "hidden",
  };
  const dropdownBoxOpen = { ...dropdownBox, overflow: "visible" };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <>
      {/* Global keyframes for portal animations */}
      <style>{`
        @keyframes bbpDropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        ref={containerRef}
        className={`w-full max-w-[960px] bg-white rounded-2xl shadow-[0_4px_32px_-6px_rgba(0,0,0,0.10)] border border-slate-200/80 select-none ${className}`}
        style={{
          fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
        }}
      >
        {/* ═══ Category Tabs ═══ */}
        <div
          className="flex items-center gap-0.5 px-4 pt-4 pb-2 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat.key
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="text-sm">{cat.emoji}</span>
              <span>{cat.label}</span>
              {cat.discount && (
                <span className="text-[9px] font-extrabold text-white bg-red-500 px-1.5 py-[1px] rounded-md leading-none ml-0.5">
                  {cat.discount}
                </span>
              )}
            </button>
          ))}
          <button className="ml-auto p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all flex-shrink-0">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="h-[1px] bg-slate-100 mx-4" />

        {/* ═══ Trip Type ═══ */}
        <div className="flex items-center gap-5 px-6 py-3">
          {["oneway", "roundtrip"].map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setTripType(type)}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${tripType === type ? "border-blue-500 bg-blue-500 shadow-sm shadow-blue-500/25" : "border-slate-300 group-hover:border-slate-400"}`}
              >
                {tripType === type && (
                  <div className="w-[5px] h-[5px] bg-white rounded-full" />
                )}
              </div>
              <span
                className={`text-[13px] font-semibold transition-colors ${tripType === type ? "text-slate-800" : "text-slate-500"}`}
              >
                {type === "oneway" ? "One way" : "Round-trip"}
              </span>
            </label>
          ))}
        </div>

        {/* ═══ Search Fields ═══ */}
        <div className="px-4 pb-4">
          <div className="flex flex-col lg:flex-row items-stretch border border-slate-200 rounded-xl">
            {/* FROM */}
            <div
              ref={refFrom}
              className={`flex-1 px-4 py-3 cursor-pointer border-b lg:border-b-0 lg:border-r border-slate-200 transition-colors duration-200 ${activeField === "from" ? "bg-blue-50/40" : "hover:bg-slate-50/60"}`}
              onClick={() => openField("from")}
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                From
              </p>
              <p className="text-[14px] font-bold text-slate-800 truncate">
                {fromCity ? (
                  <>
                    {fromCity.city}{" "}
                    <span className="text-slate-400 font-semibold">
                      {fromCity.code}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400">Select city</span>
                )}
              </p>
            </div>

            {/* SWAP */}
            <div className="hidden lg:flex items-center -mx-4 relative z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  swapCities();
                }}
                className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
              >
                <ArrowLeftRight className="bbp-swap w-3.5 h-3.5 text-blue-500" />
              </button>
            </div>

            {/* TO */}
            <div
              ref={refTo}
              className={`flex-1 px-4 py-3 cursor-pointer border-b lg:border-b-0 lg:border-r border-slate-200 transition-colors duration-200 ${activeField === "to" ? "bg-blue-50/40" : "hover:bg-slate-50/60"}`}
              onClick={() => openField("to")}
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                To
              </p>
              <p className="text-[14px] font-bold text-slate-800 truncate">
                {toCity ? (
                  <>
                    {toCity.city}{" "}
                    <span className="text-slate-400 font-semibold">
                      {toCity.code}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400">Going Anywhere?</span>
                )}
              </p>
            </div>

            {/* DEPARTURE */}
            <div
              ref={refDepart}
              className={`flex-1 px-4 py-3 cursor-pointer border-b lg:border-b-0 lg:border-r border-slate-200 transition-colors duration-200 ${activeField === "departure" ? "bg-blue-50/40" : "hover:bg-slate-50/60"}`}
              onClick={() => openField("departure")}
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Departure
              </p>
              <p className="text-[13px] font-bold text-slate-800 truncate">
                {departureDate ? (
                  formatDate(departureDate)
                ) : (
                  <span className="text-slate-400">Select date</span>
                )}
              </p>
            </div>

            {/* RETURN */}
            <div
              ref={refReturn}
              className={`flex-1 px-4 py-3 cursor-pointer border-b lg:border-b-0 lg:border-r border-slate-200 transition-colors duration-200 ${activeField === "return" ? "bg-blue-50/40" : "hover:bg-slate-50/60"} ${tripType !== "roundtrip" ? "opacity-60" : ""}`}
              onClick={() => {
                if (tripType !== "roundtrip") setTripType("roundtrip");
                openField("return");
              }}
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Return {tripType !== "roundtrip" && "– Better deals!"}
              </p>
              <p className="text-[13px] font-bold truncate">
                {tripType === "roundtrip" && returnDate ? (
                  <span className="text-slate-800">
                    {formatDate(returnDate)}
                  </span>
                ) : (
                  <span className="text-blue-500 text-[12px]">
                    {tripType !== "roundtrip"
                      ? "Book round-trip"
                      : "Select date"}
                  </span>
                )}
              </p>
            </div>

            {/* PASSENGERS */}
            <div
              ref={refPax}
              className={`flex-1 px-4 py-3 cursor-pointer transition-colors duration-200 ${activeField === "passengers" ? "bg-blue-50/40" : "hover:bg-slate-50/60"}`}
              onClick={() => openField("passengers")}
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Passenger, Class
              </p>
              <p className="text-[13px] font-bold text-slate-800 truncate">
                {totalPax}, {seatClass}
              </p>
            </div>

            {/* SEARCH BUTTON */}
            <div className="flex items-center px-3 py-2 lg:py-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  doSearch();
                }}
                disabled={isSearching}
                className={`bbp-btn bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-bold text-[13px] shadow-md shadow-blue-500/20 transition-all duration-200 flex items-center gap-2 whitespace-nowrap disabled:opacity-60 ${!isSearching ? "hover:shadow-lg hover:-translate-y-[1px]" : "cursor-wait"}`}
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Let's Search"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ═══ Promo Banner ═══ */}
        {promoBanner && (
          <div className="mx-4 mb-4 bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 border border-blue-100/80 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-xl flex-shrink-0">{promoBanner.emoji}</span>
            <p className="text-[12px] text-slate-600 flex-1 leading-relaxed">
              {promoBanner.text}{" "}
              <button className="text-blue-500 font-bold hover:text-blue-600 hover:underline transition-colors">
                {promoBanner.ctaText}
              </button>
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* PORTAL DROPDOWNS (rendered at document.body via portal)   */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* FROM dropdown */}
      <DropdownPortal
        anchorRef={refFrom}
        open={activeField === "from"}
        width={300}
      >
        <div style={dropdownBox}>
          <div style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#f8fafc",
                borderRadius: 12,
                padding: "8px 12px",
              }}
            >
              <Search
                style={{
                  width: 16,
                  height: 16,
                  color: "#94a3b8",
                  flexShrink: 0,
                }}
              />
              <input
                type="text"
                placeholder="Search city or code..."
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                autoFocus
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 13,
                  color: "#0f172a",
                  width: "100%",
                  fontFamily: "inherit",
                  fontWeight: 500,
                }}
              />
            </div>
          </div>
          <div style={{ maxHeight: 240, overflowY: "auto", padding: 6 }}>
            {filteredCities
              .filter((c) => !toCity || c.code !== toCity.code)
              .map((city, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setFromCity(city);
                    openField("to");
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 12,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#eff6ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f1f5f9",
                      borderRadius: 8,
                      fontSize: 14,
                    }}
                  >
                    {city.emoji}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1e293b",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {city.city}
                    </div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>
                      {city.country}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94a3b8",
                      background: "#f8fafc",
                      padding: "2px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {city.code}
                  </span>
                </button>
              ))}
            {filteredCities.filter((c) => !toCity || c.code !== toCity.code)
              .length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  padding: 24,
                  fontSize: 14,
                  color: "#94a3b8",
                }}
              >
                No cities found
              </p>
            )}
          </div>
        </div>
      </DropdownPortal>

      {/* TO dropdown */}
      <DropdownPortal anchorRef={refTo} open={activeField === "to"} width={300}>
        <div style={dropdownBox}>
          <div style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#f8fafc",
                borderRadius: 12,
                padding: "8px 12px",
              }}
            >
              <Search
                style={{
                  width: 16,
                  height: 16,
                  color: "#94a3b8",
                  flexShrink: 0,
                }}
              />
              <input
                type="text"
                placeholder="Search city or code..."
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                autoFocus
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 13,
                  color: "#0f172a",
                  width: "100%",
                  fontFamily: "inherit",
                  fontWeight: 500,
                }}
              />
            </div>
          </div>
          <div style={{ maxHeight: 240, overflowY: "auto", padding: 6 }}>
            {filteredCities
              .filter((c) => !fromCity || c.code !== fromCity.code)
              .map((city, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setToCity(city);
                    openField("departure");
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 12,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#eff6ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f1f5f9",
                      borderRadius: 8,
                      fontSize: 14,
                    }}
                  >
                    {city.emoji}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1e293b",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {city.city}
                    </div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>
                      {city.country}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94a3b8",
                      background: "#f8fafc",
                      padding: "2px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {city.code}
                  </span>
                </button>
              ))}
            {filteredCities.filter((c) => !fromCity || c.code !== fromCity.code)
              .length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  padding: 24,
                  fontSize: 14,
                  color: "#94a3b8",
                }}
              >
                No cities found
              </p>
            )}
          </div>
        </div>
      </DropdownPortal>

      {/* DEPARTURE calendar */}
      <DropdownPortal
        anchorRef={refDepart}
        open={activeField === "departure"}
        width={290}
      >
        <CalendarPanel
          calMonth={calMonth}
          setCalMonth={setCalMonth}
          today={today}
          departureDate={departureDate}
          returnDate={returnDate}
          selected={departureDate}
          showRange={false}
          onSelect={(d) => {
            setDepartureDate(d);
            openField(tripType === "roundtrip" ? "return" : "passengers");
          }}
        />
      </DropdownPortal>

      {/* RETURN calendar */}
      <DropdownPortal
        anchorRef={refReturn}
        open={activeField === "return" && tripType === "roundtrip"}
        width={290}
      >
        <CalendarPanel
          calMonth={calMonth}
          setCalMonth={setCalMonth}
          today={today}
          departureDate={departureDate}
          returnDate={returnDate}
          selected={returnDate}
          showRange
          onSelect={(d) => {
            if (departureDate && isAfterDate(d, departureDate)) {
              setReturnDate(d);
              openField("passengers");
            } else {
              setDepartureDate(d);
              setReturnDate(null);
            }
          }}
        />
      </DropdownPortal>

      {/* PASSENGERS dropdown */}
      <DropdownPortal
        anchorRef={refPax}
        open={activeField === "passengers"}
        alignRight
        width={310}
      >
        <div style={{ ...dropdownBoxOpen, padding: 20 }}>
          {[
            {
              key: "adults",
              label: "Adults",
              sub: "> 12 years",
              Icon: User,
              bg: "#eff6ff",
              clr: "#3b82f6",
              min: 1,
            },
            {
              key: "children",
              label: "Children",
              sub: "2 – 12 years",
              Icon: Users,
              bg: "#f0fdf4",
              clr: "#22c55e",
              min: 0,
            },
            {
              key: "infants",
              label: "Infants",
              sub: "Under 2 years",
              Icon: Baby,
              bg: "#fdf2f8",
              clr: "#ec4899",
              min: 0,
            },
          ].map(({ key, label, sub, Icon, bg, clr, min }) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: bg,
                  }}
                >
                  <Icon style={{ width: 16, height: 16, color: clr }} />
                </div>
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>{sub}</div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: 4,
                }}
              >
                <button
                  disabled={passengers[key] <= min}
                  onClick={() =>
                    setPassengers((p) => ({
                      ...p,
                      [key]: Math.max(min, p[key] - 1),
                    }))
                  }
                  style={{
                    width: 28,
                    height: 28,
                    border: "none",
                    borderRadius: 8,
                    background: "transparent",
                    cursor: passengers[key] <= min ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: passengers[key] <= min ? 0.3 : 1,
                  }}
                >
                  <Minus style={{ width: 14, height: 14, color: "#64748b" }} />
                </button>
                <span
                  style={{
                    width: 22,
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {passengers[key]}
                </span>
                <button
                  onClick={() =>
                    setPassengers((p) => ({ ...p, [key]: p[key] + 1 }))
                  }
                  style={{
                    width: 28,
                    height: 28,
                    border: "none",
                    borderRadius: 8,
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Plus style={{ width: 14, height: 14, color: "#64748b" }} />
                </button>
              </div>
            </div>
          ))}
          <div style={{ height: 1, background: "#f1f5f9", marginBottom: 16 }} />
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 10,
            }}
          >
            Cabin Class
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
              marginBottom: 16,
            }}
          >
            {classes.map((cls) => (
              <button
                key={cls}
                onClick={() => setSeatClass(cls)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                  background: seatClass === cls ? "#3b82f6" : "#f8fafc",
                  color: seatClass === cls ? "#fff" : "#475569",
                  boxShadow:
                    seatClass === cls
                      ? "0 2px 8px rgba(59,130,246,0.25)"
                      : "none",
                }}
              >
                {cls}
              </button>
            ))}
          </div>
          <button
            onClick={() => setActiveField(null)}
            style={{
              width: "100%",
              padding: "10px 0",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 12px rgba(59,130,246,0.2)",
            }}
          >
            Done
          </button>
        </div>
      </DropdownPortal>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════
// CalendarPanel — extracted for reuse (departure + return)
// ═══════════════════════════════════════════════════════════════════
function CalendarPanel({
  calMonth,
  setCalMonth,
  today,
  departureDate,
  returnDate,
  selected,
  showRange,
  onSelect,
}) {
  const { year, month } = calMonth;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = new Date(year, month, 1).getDay();

  const navBtn = {
    border: "none",
    background: "transparent",
    padding: 6,
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    transition: "all 0.15s",
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow:
          "0 20px 60px -10px rgba(0,0,0,0.20), 0 0 0 1px rgba(0,0,0,0.04)",
        padding: 16,
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      {/* Month Nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <button
          style={navBtn}
          onClick={() =>
            setCalMonth((p) =>
              p.month === 0
                ? { year: p.year - 1, month: 11 }
                : { ...p, month: p.month - 1 },
            )
          }
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <ChevronDown
            style={{ width: 16, height: 16, transform: "rotate(90deg)" }}
          />
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
          {MONTHS[month]} {year}
        </span>
        <button
          style={navBtn}
          onClick={() =>
            setCalMonth((p) =>
              p.month === 11
                ? { year: p.year + 1, month: 0 }
                : { ...p, month: p.month + 1 },
            )
          }
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <ChevronDown
            style={{ width: 16, height: 16, transform: "rotate(-90deg)" }}
          />
        </button>
      </div>

      {/* Day headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        {DAY_HEADERS.map((d, i) => (
          <div
            key={i}
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#94a3b8",
              padding: 4,
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "3px 2px",
        }}
      >
        {[...Array(firstDow)].map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const d = { year, month, day };
          const past = isBeforeToday(d);
          const sel = isSameDate(d, selected);
          const dep = isSameDate(d, departureDate);
          const ret = isSameDate(d, returnDate);
          const inRange =
            showRange && isBetweenDates(d, departureDate, returnDate);
          const isToday_ = isSameDate(d, today);
          const isActive = sel || dep || ret;

          return (
            <div
              key={day}
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {inRange && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: -2,
                    right: -2,
                    background: "#eff6ff",
                    zIndex: 0,
                  }}
                />
              )}
              <button
                disabled={past}
                onClick={() => !past && onSelect(d)}
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  border: "none",
                  cursor: past ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  background: isActive
                    ? "#3b82f6"
                    : inRange
                      ? "#eff6ff"
                      : "transparent",
                  color: past
                    ? "#cbd5e1"
                    : isActive
                      ? "#fff"
                      : inRange
                        ? "#3b82f6"
                        : "#334155",
                  transform: isActive ? "scale(1.1)" : "none",
                  boxShadow: isActive
                    ? "0 4px 12px rgba(59,130,246,0.3)"
                    : "none",
                  outline: isToday_ && !isActive ? "1px solid #60a5fa" : "none",
                  outlineOffset: isToday_ && !isActive ? 2 : 0,
                }}
                onMouseEnter={(e) => {
                  if (!past && !isActive) {
                    e.currentTarget.style.background = "#eff6ff";
                    e.currentTarget.style.color = "#3b82f6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!past && !isActive) {
                    e.currentTarget.style.background = inRange
                      ? "#eff6ff"
                      : "transparent";
                    e.currentTarget.style.color = inRange
                      ? "#3b82f6"
                      : "#334155";
                  }
                }}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BookingBarPremium;
