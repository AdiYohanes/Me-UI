import React from "react";
import Hero from "./Hero";
import ComponentShowcase from "./ComponentShowcase";
import CtaFooter from "./CtaFooter";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <main className="flex-grow">
        <Hero />
        <ComponentShowcase />
        <CtaFooter />
      </main>
    </div>
  );
};

export default LandingPage;
