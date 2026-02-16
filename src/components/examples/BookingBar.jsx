import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Minus,
  Plus,
  Loader2,
  LocateFixed,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

export default function BookingBar() {
  const containerRef = useRef(null);
  const searchBtnRef = useRef(null);
  const [activeTab, setActiveTab] = useState("stays");
  const [activeField, setActiveField] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Data States
  const [location, setLocation] = useState("Bali, Indonesia");
  const [dates, setDates] = useState({ start: null, end: null }); // Changed to null for selection logic
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [selectionMode, setSelectionMode] = useState("start"); // "start" or "end"

  // Mock Data
  const locations = [
    { name: "Bali, Indonesia", icon: "🏝️", desc: "Tropical paradise" },
    { name: "Jakarta, Indonesia", icon: "🏙️", desc: "Capital city" },
    { name: "Yogyakarta, Indonesia", icon: "🏯", desc: "Cultural hub" },
    { name: "Lombok, Indonesia", icon: "🌊", desc: "Island life" },
    { name: "Raja Ampat", icon: "🐠", desc: "Diving heaven" },
  ];

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Handle outside click to close popovers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
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

    // Animate field activation
    gsap.fromTo(
      `.field-${field}`,
      { scale: 0.95, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
    );
  });

  const handleSearch = contextSafe(() => {
    if (isSearching) return;
    setIsSearching(true);
    setActiveField(null);

    // 1. Simple Loader Animation
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          // Return to normal state
          setIsSearching(false);
          gsap.to(".search-text", {
            opacity: 0,
            display: "none",
            duration: 0.1,
          });
        }, 2000);
      },
    });

    // Animate to Loading State
    // We don't expand the button, just swap the content.
    // The conditional rendering in JSX handles the content swap.
    // We can just add a small squish effect for feedback.
    tl.to(".search-btn", {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
  });

  // Calendar Logic
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
          <div key={d} className="text-slate-500 font-semibold text-xs py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2 gap-x-1">
        {[...Array(31)].map((_, i) => {
          const day = i + 1;
          const isStart = day === dates.start;
          const isEnd = day === dates.end;
          const isRange =
            dates.start && dates.end && day > dates.start && day < dates.end;

          return (
            <div key={i} className="relative flex justify-center">
              {/* Range Background */}
              {isRange && (
                <div className="absolute inset-y-0 inset-x-[-2px] bg-blue-500/10 z-0"></div>
              )}
              {isStart && dates.end && (
                <div className="absolute inset-y-0 right-[-2px] left-1/2 bg-blue-500/10 z-0 rounded-l-full"></div>
              )}
              {isEnd && dates.start && (
                <div className="absolute inset-y-0 left-[-2px] right-1/2 bg-blue-500/10 z-0 rounded-r-full"></div>
              )}

              <button
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                    ${isStart || isEnd ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105" : ""}
                    ${!isStart && !isEnd && !isRange ? "text-slate-300 hover:bg-slate-800 hover:text-white" : ""}
                    ${isRange ? "text-blue-400" : ""}
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDateClick(day);
                }}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
        <span>{dates.start ? `Apr ${dates.start}` : "Select check-in"}</span>
        <span className="text-slate-600">→</span>
        <span>{dates.end ? `Apr ${dates.end}` : "Select check-out"}</span>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl bg-slate-950 p-6 rounded-[2rem] border border-slate-800/50 shadow-2xl relative select-none"
    >
      {/* Tabs */}
      <div className="flex gap-8 mb-6 px-4 border-b border-slate-800/50 pb-2">
        {["Stays", "Flights", "Cars", "Experiences"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`text-sm font-bold transition-all relative pb-4 px-1 ${activeTab === tab.toLowerCase() ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
          >
            {tab}
            {activeTab === tab.toLowerCase() && (
              <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-blue-500 rounded-t-full shadow-[0_-4px_10px_rgba(59,130,246,0.5)]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Search Bar Container */}
      <div className="bg-slate-900/80 backdrop-blur-md p-2 rounded-[1.5rem] border border-slate-800 flex flex-col md:flex-row gap-2 relative z-10 shadow-xl">
        {/* 1. Location Field */}
        <div
          className={`field-location flex-[1.5] relative p-4 rounded-2xl transition-all cursor-pointer border ${activeField === "location" ? "bg-slate-800 border-slate-700 shadow-lg" : "border-transparent hover:bg-slate-800/30"}`}
          onClick={() => handleFieldClick("location")}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl transition-all duration-300 ${activeField === "location" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"}`}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                Where
              </p>
              <p className="text-base text-white font-bold truncate">
                {location}
              </p>
            </div>
          </div>

          {/* Location Dropdown */}
          {activeField === "location" && (
            <div className="absolute top-[calc(100%+1rem)] left-0 w-[320px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-2 mb-2">
                <button className="w-full flex items-center gap-3 text-blue-400 text-sm font-bold p-3 hover:bg-blue-500/10 rounded-xl transition-colors">
                  <LocateFixed className="w-4 h-4" /> Use my current location
                </button>
              </div>
              <div className="h-[1px] bg-slate-800 mx-4 mb-2"></div>
              <div className="max-h-[240px] overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                {locations.map((loc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 hover:bg-slate-800 rounded-xl cursor-pointer transition-all group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(loc.name);
                      setActiveField("dates"); // Auto-advance
                    }}
                  >
                    <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-800 group-hover:bg-slate-700 rounded-xl text-lg transition-colors border border-slate-700 group-hover:border-slate-600">
                      {loc.icon}
                    </span>
                    <div>
                      <div className="text-sm text-white font-bold">
                        {loc.name}
                      </div>
                      <div className="text-xs text-slate-400">{loc.desc}</div>
                    </div>
                    {location === loc.name && (
                      <CheckCircle2 className="w-4 h-4 text-blue-500 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="hidden md:block w-[1px] bg-slate-800 my-3"></div>

        {/* 2. Dates Field */}
        <div
          className={`field-dates flex-[1.2] relative p-4 rounded-2xl transition-all cursor-pointer border ${activeField === "dates" ? "bg-slate-800 border-slate-700 shadow-lg" : "border-transparent hover:bg-slate-800/30"}`}
          onClick={() => handleFieldClick("dates")}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl transition-all duration-300 ${activeField === "dates" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-800 text-slate-400"}`}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                When
              </p>
              <div className="flex gap-2 text-sm text-white font-bold whitespace-nowrap">
                <span className={!dates.start ? "text-slate-500" : ""}>
                  {dates.start ? `Apr ${dates.start}` : "Check-in"}
                </span>
                <span className="text-slate-600">—</span>
                <span className={!dates.end ? "text-slate-500" : ""}>
                  {dates.end ? `Apr ${dates.end}` : "Check-out"}
                </span>
              </div>
            </div>
          </div>

          {/* Date Picker Popover */}
          {activeField === "dates" && (
            <div className="absolute top-[calc(100%+1rem)] left-0 md:left-1/2 md:-translate-x-1/2 w-[340px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h5 className="text-white font-bold text-lg">April 2024</h5>
                <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                  <button className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors">
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  </button>
                  <button className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors">
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </button>
                </div>
              </div>
              {renderCalendar()}
              <div className="mt-4 flex gap-2">
                <button
                  className="flex-1 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDates({ start: null, end: null });
                  }}
                >
                  Reset
                </button>
                <button
                  className="flex-1 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveField("guests");
                  }}
                >
                  Apply Dates
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:block w-[1px] bg-slate-800 my-3"></div>

        {/* 3. Guests Field */}
        <div
          className={`field-guests flex-1 relative p-4 rounded-2xl transition-all cursor-pointer border ${activeField === "guests" ? "bg-slate-800 border-slate-700 shadow-lg" : "border-transparent hover:bg-slate-800/30"}`}
          onClick={() => handleFieldClick("guests")}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl transition-all duration-300 ${activeField === "guests" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-800 text-slate-400"}`}
            >
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                Who
              </p>
              <p className="text-sm text-white font-bold">
                {guests.adults + guests.children} Guests
              </p>
            </div>
          </div>

          {/* Guest Counter Popover */}
          {activeField === "guests" && (
            <div className="absolute top-[calc(100%+1rem)] right-0 w-[280px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-300">
              <div
                key="adults"
                className="flex items-center justify-between mb-4"
              >
                <div>
                  <span className="block text-white font-bold">Adults</span>
                  <span className="text-xs text-slate-400">
                    Ages 13 or above
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-slate-800 rounded-lg p-1">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-30"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGuests({
                        ...guests,
                        adults: Math.max(1, guests.adults - 1),
                      });
                    }}
                    disabled={guests.adults <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-bold w-4 text-center">
                    {guests.adults}
                  </span>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGuests({ ...guests, adults: guests.adults + 1 });
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-slate-800 my-4"></div>

              <div key="children" className="flex items-center justify-between">
                <div>
                  <span className="block text-white font-bold">Children</span>
                  <span className="text-xs text-slate-400">Ages 2-12</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-800 rounded-lg p-1">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-30"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGuests({
                        ...guests,
                        children: Math.max(0, guests.children - 1),
                      });
                    }}
                    disabled={guests.children <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-bold w-4 text-center">
                    {guests.children}
                  </span>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGuests({ ...guests, children: guests.children + 1 });
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          ref={searchBtnRef}
          onClick={(e) => {
            e.stopPropagation();
            handleSearch();
          }}
          className={`search-btn bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-0 transition-all overflow-hidden min-w-[64px] h-[64px] self-center group ${isSearching ? "cursor-wait" : ""}`}
        >
          {isSearching ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Search className="search-icon w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="search-text hidden whitespace-nowrap text-base font-bold ml-3">
                Search
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
