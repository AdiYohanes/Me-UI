import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Github, Star } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Me-UI
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-500 font-medium">
            by Adi Yohanes
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            to="/showcase"
            className="hover:text-blue-600 dark:hover:text-white transition-colors"
          >
            Showcase
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <Star className="w-3.5 h-3.5" />
            <span className="text-xs text-slate-500">Star</span>
          </a>
          <a
            href="https://trakteer.id/adiyohanes19/tip"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors shadow-lg shadow-blue-500/20"
          >
            Support
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-64 border-t border-slate-200 dark:border-slate-800" : "max-h-0"}`}
      >
        <nav className="container mx-auto px-6 py-4 flex flex-col gap-3 bg-white dark:bg-slate-950">
          <Link
            to="/showcase"
            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors py-2"
            onClick={() => setIsOpen(false)}
          >
            Showcase
          </Link>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
            <button className="w-full px-4 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors">
              Get Started
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
