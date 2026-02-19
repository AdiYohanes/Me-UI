import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Play, Code2, Sparkles, Copy, Check } from "lucide-react";

const installCmd = "npx me-ui@latest init";

const Hero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const floatingRef = useRef([]);
  const [cmdCopied, setCmdCopied] = useState(false);

  // Typewriter effect not needed for simpler static text, but let's keep it if we want 'dynamic' feel or just remove it.
  // User asked for "Me-UI your design solution dan apa gitu tambahin yang bagus".
  // Let's make it static but impactful.

  useGSAP(
    () => {
      // Set initial state to prevent FOUC
      gsap.set(
        [
          titleRef.current,
          subtitleRef.current,
          ctaRef.current,
          statsRef.current,
        ],
        { y: 40, opacity: 0 },
      );

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(titleRef.current, { y: 0, opacity: 1, duration: 0.8, delay: 0.2 })
        .to(subtitleRef.current, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
        .to(statsRef.current, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
        .to(ctaRef.current, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3");

      // Floating elements
      floatingRef.current.forEach((el, i) => {
        if (el) {
          gsap.to(el, {
            y: -12 + i * 4,
            x: Math.sin(i) * 8,
            duration: 3 + i * 0.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: i * 0.2,
          });
        }
      });
    },
    { scope: containerRef },
  );

  const handleCopyCmd = async () => {
    try {
      await navigator.clipboard.writeText(installCmd);
      setCmdCopied(true);
      setTimeout(() => setCmdCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const stats = [
    { value: "15+", label: "Components", icon: "📦" },
    { value: "GSAP", label: "Powered", icon: "⚡" },
    { value: "0", label: "Bloat", icon: "🎯" },
    { value: "100%", label: "Copy-Paste", icon: "📋" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16"
    >
      {/* Background — reduced blur for perf */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      {/* Floating decorative elements */}
      <div
        ref={(el) => (floatingRef.current[0] = el)}
        className="absolute top-32 left-[10%] w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl backdrop-blur-sm hidden lg:flex"
      >
        ⚛️
      </div>
      <div
        ref={(el) => (floatingRef.current[1] = el)}
        className="absolute top-48 right-[12%] w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-lg backdrop-blur-sm hidden lg:flex"
      >
        🎨
      </div>
      <div
        ref={(el) => (floatingRef.current[2] = el)}
        className="absolute bottom-40 left-[15%] w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-sm backdrop-blur-sm hidden lg:flex"
      >
        ✨
      </div>
      <div
        ref={(el) => (floatingRef.current[3] = el)}
        className="absolute bottom-32 right-[8%] w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-lg backdrop-blur-sm hidden lg:flex"
      >
        🚀
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              🎉 100% Free & Open Source
            </span>
            <span className="py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
              v1.0 Public Beta
            </span>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              Me-UI,
            </span>
            <br />
            <span className="text-blue-600 dark:text-blue-500">
              Your Design Solution.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            A free collection of{" "}
            <strong className="text-slate-900 dark:text-slate-200">
              React components
            </strong>{" "}
            with GSAP animations. Built for developers who want interactive &
            modern websites effortlessly. 100% free, no strings attached.
          </p>

          {/* Stats */}
          <div
            ref={statsRef}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900/50 dark:border-slate-800 dark:shadow-none transition-colors"
              >
                <span className="text-xl">{stat.icon}</span>
                <div className="text-left">
                  <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col items-center gap-5">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/showcase"
                className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Explore Components
              </Link>
              <button className="px-8 py-4 rounded-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white font-medium dark:border-slate-700 transition-all dark:hover:border-slate-600 flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                View on GitHub
              </button>
              <a
                href="https://trakteer.id/adiyohanes19/tip"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-pink-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span className="text-lg">☕</span>
                Support Us
              </a>
            </div>

            {/* Comming Soon Alert - replacing terminal command since CLI is not ready */}
            <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>More components coming soon!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradients — reduced blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/15 blur-[80px] rounded-full -z-10 pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-[250px] h-[250px] bg-purple-500/8 blur-[60px] rounded-full -z-10 pointer-events-none"></div>
    </section>
  );
};

export default Hero;
