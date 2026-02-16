import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/sections/LandingPage";
import ShowcasePage from "./pages/ShowcasePage";
import Header from "./components/layout/Header";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-blue-500/30 transition-colors duration-300">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/showcase/*" element={<ShowcasePage />} />
      </Routes>
    </div>
  );
}

export default App;
