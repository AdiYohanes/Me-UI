// Element Source Codes — Tailwind CSS & Pure CSS implementations
// Each entry has { tailwind: string, css: string }

export const elementSourceCodes = {

    // ─────────────────────────────────────────────
    // BUTTONS
    // ─────────────────────────────────────────────

    ButtonSolid: {
        tailwind: `// Solid Primary Button — Tailwind CSS
function SolidButton() {
  return (
    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl
      hover:bg-blue-700 hover:scale-105 active:scale-95
      transition-all duration-200 shadow-lg shadow-blue-600/30
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      Get Started
    </button>
  );
}`,
        css: `// Solid Primary Button — Pure CSS
function SolidButton() {
  return (
    <>
      <style>{\`
        .btn-solid {
          padding: 12px 24px;
          background: #2563eb;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 10px 30px -8px rgba(37,99,235,0.4);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .btn-solid:hover {
          background: #1d4ed8;
          transform: scale(1.05);
          box-shadow: 0 14px 36px -8px rgba(37,99,235,0.5);
        }
        .btn-solid:active {
          transform: scale(0.95);
        }
        .btn-solid:focus-visible {
          box-shadow: 0 0 0 3px rgba(59,130,246,0.5);
        }
      \`}</style>
      <button className="btn-solid">Get Started</button>
    </>
  );
}`,
    },

    ButtonOutline: {
        tailwind: `// Ghost / Outline Button — Tailwind CSS
function OutlineButton() {
  return (
    <button className="px-6 py-3 bg-transparent text-blue-600 font-semibold rounded-xl
      border-2 border-blue-600 hover:bg-blue-600 hover:text-white
      active:scale-95 transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      Learn More
    </button>
  );
}`,
        css: `// Ghost / Outline Button — Pure CSS
function OutlineButton() {
  return (
    <>
      <style>{\`
        .btn-outline {
          padding: 11px 24px;
          background: transparent;
          color: #2563eb;
          font-weight: 600;
          font-size: 0.875rem;
          border: 2px solid #2563eb;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.2s;
          outline: none;
        }
        .btn-outline:hover {
          background: #2563eb;
          color: white;
        }
        .btn-outline:active {
          transform: scale(0.95);
        }
        .btn-outline:focus-visible {
          box-shadow: 0 0 0 3px rgba(59,130,246,0.4);
        }
      \`}</style>
      <button className="btn-outline">Learn More</button>
    </>
  );
}`,
    },

    ButtonGradient: {
        tailwind: `// Gradient Button with Shimmer — Tailwind CSS
function GradientButton() {
  return (
    <button className="relative px-8 py-3 font-semibold rounded-xl text-white
      bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600
      hover:from-violet-500 hover:via-purple-500 hover:to-pink-500
      hover:scale-105 active:scale-95 transition-all duration-300
      shadow-lg shadow-purple-500/40 overflow-hidden group
      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
      <span className="relative z-10">Upgrade Now</span>
      <span className="absolute inset-0 w-full h-full
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        -translate-x-full group-hover:translate-x-full
        transition-transform duration-700 ease-in-out" />
    </button>
  );
}`,
        css: `// Gradient Button with Shimmer — Pure CSS
function GradientButton() {
  return (
    <>
      <style>{\`
        .btn-gradient {
          position: relative;
          padding: 12px 32px;
          background: linear-gradient(to right, #7c3aed, #9333ea, #db2777);
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          overflow: hidden;
          box-shadow: 0 10px 30px -8px rgba(147,51,234,0.5);
          transition: transform 0.3s, box-shadow 0.3s;
          outline: none;
        }
        .btn-gradient::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 80%; height: 100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);
          transition: left 0.6s ease;
        }
        .btn-gradient:hover { transform: scale(1.05); }
        .btn-gradient:hover::before { left: 120%; }
        .btn-gradient:active { transform: scale(0.95); }
      \`}</style>
      <button className="btn-gradient">Upgrade Now</button>
    </>
  );
}`,
    },

    ButtonLoading: {
        tailwind: `// Loading State Button — Tailwind CSS
import { useState } from "react";

function LoadingButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={\`px-6 py-3 font-semibold rounded-xl text-white flex items-center gap-2.5
        transition-all duration-300 min-w-[160px] justify-center
        \${loading
          ? "bg-blue-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/30"
        }\`}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      )}
      {loading ? "Processing..." : "Submit Form"}
    </button>
  );
}`,
        css: `// Loading State Button — Pure CSS
import { useState } from "react";

function LoadingButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <style>{\`
        .btn-loading {
          padding: 12px 24px;
          background: #2563eb;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-width: 160px;
          transition: background 0.2s, transform 0.2s;
          outline: none;
          box-shadow: 0 10px 30px -8px rgba(37,99,235,0.4);
        }
        .btn-loading.is-loading {
          background: #93c5fd;
          cursor: not-allowed;
          box-shadow: none;
        }
        .btn-loading:not(.is-loading):hover { background: #1d4ed8; transform: scale(1.05); }
        .btn-loading:not(.is-loading):active { transform: scale(0.95); }
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
      \`}</style>
      <button
        className={\`btn-loading \${loading ? "is-loading" : ""}\`}
        onClick={handleClick}
        disabled={loading}
      >
        {loading && <div className="btn-spinner" />}
        {loading ? "Processing..." : "Submit Form"}
      </button>
    </>
  );
}`,
    },

    ButtonIcon: {
        tailwind: `// Icon Button with Ripple — Tailwind CSS
import { useState } from "react";
import { Heart } from "lucide-react";

function IconButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={() => setLiked(!liked)}
      className={\`relative w-12 h-12 rounded-full flex items-center justify-center
        transition-all duration-200 overflow-hidden group
        \${liked
          ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-110"
          : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-rose-50 hover:text-rose-500"
        }\`}
    >
      <Heart
        className={\`w-5 h-5 transition-transform duration-300 group-active:scale-75
          \${liked ? "fill-current scale-110" : ""}\`}
      />
      {/* Ripple */}
      <span className={
        "absolute inset-0 rounded-full bg-rose-400/30 scale-0 group-active:scale-100 "
        + "group-active:opacity-0 transition-all duration-500"
      } />
    </button>
  );
}`,
        css: `// Icon Button with Ripple — Pure CSS
import { useState } from "react";
import { Heart } from "lucide-react";

function IconButton() {
  const [liked, setLiked] = useState(false);

  return (
    <>
      <style>{\`
        .btn-icon {
          position: relative;
          width: 48px; height: 48px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          color: #64748b;
          overflow: hidden;
          transition: background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .btn-icon:hover { background: #fff1f2; color: #f43f5e; }
        .btn-icon.liked {
          background: #f43f5e;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 10px 25px -5px rgba(244,63,94,0.4);
        }
        .btn-icon::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(244,63,94,0.3);
          transform: scale(0);
          opacity: 1;
          transition: transform 0.4s, opacity 0.4s;
        }
        .btn-icon:active::after {
          transform: scale(1);
          opacity: 0;
        }
      \`}</style>
      <button
        className={\`btn-icon\${liked ? " liked" : ""}\`}
        onClick={() => setLiked(!liked)}
      >
        <Heart
          style={{
            width: 20, height: 20,
            fill: liked ? "currentColor" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>
    </>
  );
}`,
    },

    ButtonDestructive: {
        tailwind: `// Destructive / Danger Button — Tailwind CSS
import { useState } from "react";
import { Trash2 } from "lucide-react";

function DestructiveButton() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <button
      onClick={() => { setConfirmed(true); setTimeout(() => setConfirmed(false), 1500); }}
      className={\`px-6 py-3 font-semibold rounded-xl flex items-center gap-2.5
        transition-all duration-200 focus:outline-none
        \${confirmed
          ? "bg-red-600 text-white scale-95 shadow-inner"
          : "bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 hover:scale-105 active:scale-95"
        }\`}
    >
      <Trash2 className={\`w-4 h-4 \${confirmed ? "animate-bounce" : ""}\`} />
      {confirmed ? "Deleted!" : "Delete Account"}
    </button>
  );
}`,
        css: `// Destructive / Danger Button — Pure CSS
import { useState } from "react";
import { Trash2 } from "lucide-react";

function DestructiveButton() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <>
      <style>{\`
        .btn-destructive {
          padding: 11px 24px;
          background: #fff1f2;
          color: #e11d48;
          font-weight: 600;
          font-size: 0.875rem;
          border: 2px solid #fecdd3;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s;
          outline: none;
        }
        .btn-destructive:hover {
          background: #e11d48;
          color: white;
          border-color: #e11d48;
          transform: scale(1.05);
        }
        .btn-destructive.confirmed {
          background: #dc2626;
          color: white;
          border-color: #dc2626;
          transform: scale(0.95);
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.15);
        }
        @keyframes bounce-once {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .btn-destructive.confirmed svg { animation: bounce-once 0.4s ease; }
      \`}</style>
      <button
        className={\`btn-destructive\${confirmed ? " confirmed" : ""}\`}
        onClick={() => { setConfirmed(true); setTimeout(() => setConfirmed(false), 1500); }}
      >
        <Trash2 style={{ width: 16, height: 16 }} />
        {confirmed ? "Deleted!" : "Delete Account"}
      </button>
    </>
  );
}`,
    },

    // ─────────────────────────────────────────────
    // LOADERS
    // ─────────────────────────────────────────────

    LoaderSpinner: {
        tailwind: `// Ring Spinner — Tailwind CSS
function Spinner({ size = "md", color = "blue" }) {
  const sizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-14 h-14" };
  const colors = { blue: "border-blue-600", purple: "border-purple-600", rose: "border-rose-500" };

  return (
    <div className={\`\${sizes[size]} rounded-full border-4 border-slate-200
      \${colors[color]} border-t-transparent animate-spin\`}
    />
  );
}

// Usage
export default function Demo() {
  return (
    <div className="flex items-center gap-6">
      <Spinner size="sm" color="blue" />
      <Spinner size="md" color="purple" />
      <Spinner size="lg" color="rose" />
    </div>
  );
}`,
        css: `// Ring Spinner — Pure CSS
function Spinner({ size = "md", color = "#2563eb" }) {
  const px = { sm: 24, md: 40, lg: 56 };
  const bw = { sm: 3, md: 4, lg: 5 };
  const sz = px[size];
  const bwd = bw[size];

  return (
    <>
      <style>{\`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          border-radius: 50%;
          border-style: solid;
          border-color: #e2e8f0;
          animation: spin 0.75s linear infinite;
        }
      \`}</style>
      <div
        className="spinner"
        style={{ width: sz, height: sz, borderWidth: bwd, borderTopColor: color }}
      />
    </>
  );
}

export default function Demo() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:24 }}>
      <Spinner size="sm" color="#2563eb" />
      <Spinner size="md" color="#9333ea" />
      <Spinner size="lg" color="#f43f5e" />
    </div>
  );
}`,
    },

    LoaderDots: {
        tailwind: `// Bouncing Dots Loader — Tailwind CSS
function DotsLoader({ color = "bg-blue-600" }) {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={\`w-2.5 h-2.5 rounded-full \${color} animate-bounce\`}
          style={{ animationDelay: \`\${i * 120}ms\` }}
        />
      ))}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-5">
      <DotsLoader color="bg-blue-600" />
      <DotsLoader color="bg-violet-600" />
      <DotsLoader color="bg-emerald-500" />
    </div>
  );
}`,
        css: `// Bouncing Dots Loader — Pure CSS
function DotsLoader({ color = "#2563eb" }) {
  return (
    <>
      <style>{\`
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
        }
        .dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          animation: dot-bounce 1.2s ease-in-out infinite;
          display: inline-block;
        }
      \`}</style>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        {[0,1,2].map(i => (
          <div key={i} className="dot"
            style={{ background: color, animationDelay: \`\${i*120}ms\` }} />
        ))}
      </div>
    </>
  );
}

export default function Demo() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
      <DotsLoader color="#2563eb" />
      <DotsLoader color="#7c3aed" />
      <DotsLoader color="#10b981" />
    </div>
  );
}`,
    },

    LoaderPulse: {
        tailwind: `// Pulse / Heartbeat Loader — Tailwind CSS
function PulseLoader({ color = "bg-blue-500" }) {
  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      <div className={\`absolute w-full h-full rounded-full \${color} opacity-20 animate-ping\`} />
      <div className={\`absolute w-8 h-8 rounded-full \${color} opacity-40 animate-ping\`}
        style={{ animationDelay: "200ms" }} />
      <div className={\`w-5 h-5 rounded-full \${color}\`} />
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex items-center gap-8">
      <PulseLoader color="bg-blue-500" />
      <PulseLoader color="bg-purple-500" />
      <PulseLoader color="bg-rose-500" />
    </div>
  );
}`,
        css: `// Pulse / Heartbeat Loader — Pure CSS
function PulseLoader({ color = "#3b82f6" }) {
  return (
    <>
      <style>{\`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.5; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          animation: ping 1.2s cubic-bezier(0,0,0.2,1) infinite;
        }
        .pulse-core {
          width: 20px; height: 20px;
          border-radius: 50%;
          position: relative;
          z-index: 1;
        }
      \`}</style>
      <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", width:48, height:48 }}>
        <div className="pulse-ring" style={{ background: color, opacity: 0.2 }} />
        <div className="pulse-ring" style={{ background: color, opacity: 0.15, animationDelay:"0.2s" }} />
        <div className="pulse-core" style={{ background: color }} />
      </div>
    </>
  );
}

export default function Demo() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:32 }}>
      <PulseLoader color="#3b82f6" />
      <PulseLoader color="#a855f7" />
      <PulseLoader color="#f43f5e" />
    </div>
  );
}`,
    },

    LoaderBar: {
        tailwind: `// Progress Bar / Shimmer Loader — Tailwind CSS
function BarLoader({ progress = null, color = "from-blue-500 to-cyan-500" }) {
  const isIndeterminate = progress === null;
  return (
    <div className="relative h-2 w-48 rounded-full bg-slate-200 overflow-hidden">
      {isIndeterminate ? (
        <div className={\`absolute h-full w-1/2 rounded-full bg-gradient-to-r \${color}
          animate-[shimmer_1.4s_ease-in-out_infinite]\`}
        />
      ) : (
        <div
          className={\`h-full rounded-full bg-gradient-to-r \${color} transition-all duration-500\`}
          style={{ width: \`\${progress}%\` }}
        />
      )}
    </div>
  );
}

// Add to tailwind.config.js:
// animation: { shimmer: 'shimmer 1.4s ease-in-out infinite' }
// keyframes: { shimmer: { '0%': { left:'-60%' }, '100%': { left:'120%' } } }

export default function Demo() {
  return (
    <div className="flex flex-col gap-4 items-start">
      <BarLoader progress={null} color="from-blue-500 to-cyan-400" />
      <BarLoader progress={65} color="from-violet-500 to-purple-400" />
      <BarLoader progress={35} color="from-rose-500 to-pink-400" />
    </div>
  );
}`,
        css: `// Progress Bar / Shimmer Loader — Pure CSS
function BarLoader({ progress = null, color = "#3b82f6, #06b6d4" }) {
  const isIndeterminate = progress === null;
  return (
    <>
      <style>{\`
        @keyframes bar-slide {
          0%   { transform: translateX(-150%); }
          100% { transform: translateX(280%); }
        }
        .bar-track {
          position: relative;
          height: 8px;
          width: 192px;
          border-radius: 9999px;
          background: #e2e8f0;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.5s ease;
        }
        .bar-indeterminate {
          position: absolute;
          height: 100%;
          width: 45%;
          border-radius: 9999px;
          animation: bar-slide 1.4s ease-in-out infinite;
        }
      \`}</style>
      <div className="bar-track">
        {isIndeterminate ? (
          <div className="bar-indeterminate"
            style={{ background: \`linear-gradient(to right, \${color})\` }} />
        ) : (
          <div className="bar-fill"
            style={{ width: \`\${progress}%\`, background: \`linear-gradient(to right, \${color})\` }} />
        )}
      </div>
    </>
  );
}

export default function Demo() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16, alignItems:"flex-start" }}>
      <BarLoader progress={null} color="#3b82f6, #06b6d4" />
      <BarLoader progress={65} color="#8b5cf6, #a855f7" />
      <BarLoader progress={35} color="#f43f5e, #ec4899" />
    </div>
  );
}`,
    },

    LoaderSkeleton: {
        tailwind: `// Skeleton Placeholder Loader — Tailwind CSS
function SkeletonBlock({ className = "" }) {
  return (
    <div className={\`rounded-lg bg-slate-200 dark:bg-slate-700
      relative overflow-hidden before:absolute before:inset-0
      before:-translate-x-full before:animate-[shimmer_1.5s_infinite]
      before:bg-gradient-to-r before:from-transparent
      before:via-white/60 before:to-transparent \${className}\`} />
  );
}

export default function Demo() {
  return (
    <div className="flex flex-col gap-3 w-64 p-4 rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-10 h-10 rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <SkeletonBlock className="h-3 w-3/4" />
          <SkeletonBlock className="h-2.5 w-1/2" />
        </div>
      </div>
      <SkeletonBlock className="h-24 w-full rounded-xl" />
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-5/6" />
      <SkeletonBlock className="h-3 w-4/6" />
    </div>
  );
}

// Add to tailwind.config.js:
// keyframes: { shimmer: { '0%': { transform:'translateX(-100%)' }, '100%': { transform:'translateX(100%)' } } }
// animation: { shimmer: 'shimmer 1.5s infinite' }`,
        css: `// Skeleton Placeholder Loader — Pure CSS
function SkeletonBlock({ style = {} }) {
  return (
    <>
      <style>{\`
        @keyframes shimmer-sk {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton {
          background: #e2e8f0;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }
        .skeleton::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          animation: shimmer-sk 1.5s infinite;
        }
      \`}</style>
      <div className="skeleton" style={style} />
    </>
  );
}

export default function Demo() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12, width:240,
      padding:16, borderRadius:12, border:"1px solid #e2e8f0", background:"white" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <SkeletonBlock style={{ width:40, height:40, borderRadius:"50%" }} />
        <div style={{ display:"flex", flexDirection:"column", gap:8, flex:1 }}>
          <SkeletonBlock style={{ height:12, width:"75%" }} />
          <SkeletonBlock style={{ height:10, width:"50%" }} />
        </div>
      </div>
      <SkeletonBlock style={{ height:96, width:"100%", borderRadius:12 }} />
      <SkeletonBlock style={{ height:12, width:"100%" }} />
      <SkeletonBlock style={{ height:12, width:"85%" }} />
      <SkeletonBlock style={{ height:12, width:"66%" }} />
    </div>
  );
}`,
    },

    LoaderOrbit: {
        tailwind: `// Dual-Orbit Loader — Tailwind CSS
function OrbitLoader({ size = 48, color1 = "#3b82f6", color2 = "#e11d48" }) {
  return (
    <div className="relative flex items-center justify-center"
      style={{ width: size, height: size }}>
      {/* Center dot */}
      <div className="w-2 h-2 rounded-full bg-slate-400" />

      {/* Orbit 1 — clockwise */}
      <div className="absolute inset-0 rounded-full border border-slate-200
        animate-[spin_1.6s_linear_infinite]">
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2
          w-3 h-3 rounded-full shadow-lg"
          style={{ background: color1 }} />
      </div>

      {/* Orbit 2 — counter-clockwise, offset */}
      <div className="absolute inset-2 rounded-full border border-slate-200
        animate-[spin_1.1s_linear_infinite_reverse]">
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2
          w-2.5 h-2.5 rounded-full shadow-md"
          style={{ background: color2 }} />
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="flex items-center gap-10">
      <OrbitLoader size={48} color1="#3b82f6" color2="#e11d48" />
      <OrbitLoader size={64} color1="#8b5cf6" color2="#f59e0b" />
      <OrbitLoader size={56} color1="#10b981" color2="#06b6d4" />
    </div>
  );
}`,
        css: `// Dual-Orbit Loader — Pure CSS
function OrbitLoader({ size = 48, color1 = "#3b82f6", color2 = "#e11d48" }) {
  return (
    <>
      <style>{\`
        @keyframes orbit-cw { to { transform: rotate(360deg); } }
        @keyframes orbit-ccw { to { transform: rotate(-360deg); } }
        .orbit-wrap { position: relative; display:flex; align-items:center; justify-content:center; }
        .orbit-center { width:8px; height:8px; border-radius:50%; background:#94a3b8; }
        .orbit-ring {
          position:absolute; inset:0; border-radius:50%;
          border:1px solid #e2e8f0;
        }
        .orbit-ring.cw  { animation: orbit-cw  1.6s linear infinite; }
        .orbit-ring.ccw { animation: orbit-ccw 1.1s linear infinite; }
        .orbit-ring .dot {
          position:absolute; top:-5px; left:50%;
          transform:translateX(-50%);
          border-radius:50%;
          box-shadow:0 2px 6px rgba(0,0,0,0.2);
        }
      \`}</style>
      <div className="orbit-wrap" style={{ width:size, height:size }}>
        <div className="orbit-center" />
        <div className="orbit-ring cw" style={{ inset:0 }}>
          <div className="dot" style={{ width:12, height:12, background:color1 }} />
        </div>
        <div className="orbit-ring ccw" style={{ inset:8 }}>
          <div className="dot" style={{ width:10, height:10, background:color2 }} />
        </div>
      </div>
    </>
  );
}

export default function Demo() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:40 }}>
      <OrbitLoader size={48} color1="#3b82f6" color2="#e11d48" />
      <OrbitLoader size={64} color1="#8b5cf6" color2="#f59e0b" />
      <OrbitLoader size={56} color1="#10b981" color2="#06b6d4" />
    </div>
  );
}`,
    },
};
