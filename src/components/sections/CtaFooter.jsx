import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send, Check, ArrowRight, Github, Twitter, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Component Gallery", href: "#" },
    { label: "Getting Started", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Community: [
    { label: "GitHub", href: "#", icon: <Github className="w-3.5 h-3.5" /> },
    {
      label: "Twitter/X",
      href: "#",
      icon: <Twitter className="w-3.5 h-3.5" />,
    },
    { label: "Threads", href: "#" },
    { label: "Discord", href: "#" },
  ],
  Legal: [
    { label: "License (MIT)", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

const CtaFooter = () => {
  const containerRef = useRef(null);

  const ctaRef = useRef(null);
  // Renaming 'email' to 'feedback' logically, though in the previous step I kept the variable as 'email' in the JSX
  // I need to make sure I update the state variable name here to match what I actually want used.
  // Wait, in the previous step I used `value={email} onChange={(e) => setEmail(e.target.value)}`.
  // So I should keep it as `email` for now to avoid breaking the previous step's bind, OR I should have updated both.
  // Since I can't undo the previous step's *content* in the view, I will update the variable name here to 'feedback'
  // AND I will use a second `replace_file_content` to fix the JSX variable usage if needed, OR I will just rename the state variables here but keep the setter compatible if I can?
  // No, clean code -> Rename state variables.
  // I will rename `email` to `feedback` here.
  // ERROR HAZARD: I must make sure the JSX uses `feedback` and `setFeedback`.
  // The previous tool call used `value={email}` and `setEmail`.
  // So I MUST NOT rename them here unless I also fix the JSX.
  // I already applied the JSX change with `value={email}` in the previous turn.
  // To fix this cleanly:
  // 1. Rename state variables to `feedback` and `setFeedback`.
  // 2. Update `handleSubmit` to produce JSON and open URL.
  // 3. I will issue a *separate* fix for the JSX to use `feedback` instead of `email` in the next turn or combined if possible?
  // 'replace_file_content' only does one contiguous block.
  // The previous edit was Lines 135-178.
  // This edit is Lines 37-66.
  // So I can rename state variables here.
  // BUT the JSX determines what is valid. The JSX currently expects `email` and `setEmail`.
  // So I should KEEP the state as `email` for now to prevent immediate breakage, BUT logically it is `feedback`.
  // BETTER: I will rename the state variables here to `feedback` and `setFeedback`.
  // AND I will immediately issue another tool call to fix the JSX to use `feedback`.

  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      gsap.set(ctaRef.current, { y: 40, opacity: 0 });

      gsap.to(ctaRef.current, {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 90%",
          once: true,
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: containerRef },
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback) {
      setSubmitted(true);

      // Construct JSON payload
      const data = {
        date: new Date().toISOString(),
        feedback: feedback,
        platform: navigator.userAgent,
      };

      const jsonString = JSON.stringify(data, null, 2);
      const title = "New User Feedback";
      const body = "```json\n" + jsonString + "\n```";

      // Construct GitHub Issue URL
      // Repository: AdiYohanes/Me-UI (as inferred from package.json name 'indo-ui' but let's check user request again... user said "json accessible by me on github")
      // The user didn't explicitly give the repo URL in the prompt but previously I saw 'Me-UI' in footer.
      // I will use a placeholder or best guess and ask user to confirm/verify if needed.
      // Actually the footer link for GitHub was just '#'.
      // I'll use `AdiYohanes/Me-UI` based on the previous implementation plan which user approved.
      const repoUrl = "https://github.com/AdiYohanes/Me-UI/issues/new";
      const issueUrl = `${repoUrl}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;

      // Open in new tab
      window.open(issueUrl, "_blank");

      setTimeout(() => setSubmitted(false), 3000);
      setFeedback("");
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden transition-colors duration-300"
    >
      {/* ── CTA + Social Proof Area ─────────────────── */}
      <div className="py-20 bg-white dark:bg-slate-900 relative transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-blue-500/8 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="container mx-auto px-6">
          {/* Main CTA */}
          <div ref={ctaRef} className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Siap Bikin Website{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Lebih Interaktif?
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Mulai explore komponen gratis sekarang. Tidak perlu daftar, tidak
              perlu bayar.{" "}
              <strong className="text-slate-900 dark:text-slate-200">
                It's that simple.
              </strong>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Link
                to="/showcase"
                className="px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Explore Components
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="px-7 py-3.5 rounded-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white font-medium dark:border-slate-700 transition-all dark:hover:border-slate-600 flex items-center gap-2">
                ⭐ Star on GitHub
              </button>
            </div>

            {/* ── Support Card ──────────────── */}
            <div className="p-[2px] rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 mb-8 max-w-md mx-auto">
              <div className="rounded-[14px] bg-white dark:bg-slate-900 p-6 text-center transition-colors">
                <div className="text-4xl mb-3">☕</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                  Suka project ini?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                  Semua komponen gratis! Tapi kalau kamu merasa terbantu, kamu
                  bisa support kami lewat Trakteer.
                </p>
                <a
                  href="https://trakteer.id/adiyohanes19/tip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-pink-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Support via Trakteer
                </a>
                <p className="text-[10px] text-slate-500 dark:text-slate-600 mt-3">
                  Setiap dukungan berarti banyak bagi kami 💖
                </p>
              </div>
            </div>

            {/* Newsletter */}
            {/* Feedback / Masukan Section */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 backdrop-blur-sm transition-colors">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
                💬 Kirim Masukan & Saran
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs mb-4 max-w-md mx-auto">
                Bantu kami jadi lebih baik! Masukan kamu akan tersimpan sebagai
                GitHub Issue (JSON).
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 max-w-md mx-auto"
              >
                <textarea
                  placeholder="Tulis masukan kamu di sini..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 transition-all text-sm min-h-[100px] resize-none"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className={`flex-1 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      submitted
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    }`}
                  >
                    {submitted ? (
                      <>
                        <Check className="w-4 h-4" /> Redirecting...
                      </>
                    ) : (
                      <>
                        <Github className="w-4 h-4" /> Buat Issue
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!feedback) return;
                      const data = {
                        date: new Date().toISOString(),
                        feedback: feedback,
                        platform: navigator.userAgent,
                      };
                      const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "feedback.json";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
                    title="Download as JSON"
                  >
                    <span className="text-xs">⬇️ JSON</span>
                  </button>
                </div>
              </form>

              <p className="text-[10px] text-slate-500 dark:text-slate-600 mt-3">
                GitHub Issue akan terbuka otomatis dengan format JSON.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="pt-12 pb-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="text-xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                Me-UI
              </div>
              <p className="text-slate-600 dark:text-slate-500 text-sm leading-relaxed mb-3">
                Koleksi komponen React siap pakai dengan animasi kelas dunia.
                Made with 🇮🇩
              </p>
              <div className="flex gap-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 dark:text-slate-400 dark:hover:text-white dark:hover:border-slate-700 transition-all"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 dark:text-slate-400 dark:hover:text-white dark:hover:border-slate-700 transition-all"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
                  {title}
                </h4>
                <ul className="space-y-2">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-slate-600 hover:text-blue-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors text-sm flex items-center gap-2"
                      >
                        {link.icon && link.icon}
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-slate-500 dark:text-slate-500">
              <p className="flex items-center gap-1">
                © 2026 Me-UI. Built with
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-0.5" />
                using React & Tailwind.
              </p>
              <p className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                All systems operational
              </p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default CtaFooter;
