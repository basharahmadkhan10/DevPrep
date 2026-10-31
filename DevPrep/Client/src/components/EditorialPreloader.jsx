/** @format */

import React, { useState, useEffect } from "react";

export default function EditorialPreloader() {
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Only run on page reload (hard refresh) or initial session visit
    let isReload = false;
    try {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        isReload = navEntries[0].type === "reload";
      }
    } catch {
      isReload = false;
    }

    const hasInitialized = sessionStorage.getItem("devprep_initialized");

    // Run if it's a reload OR if it's the very first visit in this tab
    if (isReload || !hasInitialized) {
      setLoading(true);
      sessionStorage.setItem("devprep_initialized", "true");

      let current = 0;
      const interval = setInterval(() => {
        current += Math.floor(Math.random() * 14) + 6;
        if (current >= 100) {
          current = 100;
          setPercent(100);
          clearInterval(interval);
          setTimeout(() => {
            setExiting(true);
            setTimeout(() => {
              setLoading(false);
            }, 600);
          }, 250);
        } else {
          setPercent(current);
        }
      }, 35);

      return () => clearInterval(interval);
    }
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#09090b] flex flex-col justify-between p-8 md:p-14 select-none pointer-events-auto transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] ${
        exiting ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <div className="w-2 h-4 bg-black rounded-r-full mr-auto" />
          </div>
          <span className="font-syne text-xs uppercase tracking-[0.25em] text-neutral-300 font-bold">
            DevPrep.
          </span>
        </div>
        <span className="font-mono-tech text-[11px] uppercase tracking-wider text-neutral-500">
          SYS.INIT // MONOCHROME
        </span>
      </div>

      {/* Center Display */}
      <div className="max-w-4xl mx-auto w-full my-auto text-center md:text-left">
        <div className="mb-4">
          <span className="font-mono-tech text-xs uppercase tracking-widest text-neutral-400">
            [ ARCHIVE INTELLIGENCE DOSSIER ]
          </span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05]">
          Preparing Talent, <br />
          <span className="text-neutral-400 font-normal">Engineering Futures.</span>
        </h1>
      </div>

      {/* Bottom Counter & Status */}
      <div className="w-full">
        <div className="flex items-end justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-mono-tech text-xs tracking-wider text-neutral-400 uppercase">
              {percent < 100 ? "Calibrating Neural Architecture..." : "System Ready"}
            </span>
          </div>
          <div className="font-mono-tech text-3xl md:text-4xl text-white font-bold tracking-tighter">
            {String(percent).padStart(2, "0")}%
          </div>
        </div>

        {/* Hairline Progress Bar */}
        <div className="w-full h-[1px] bg-neutral-800 overflow-hidden relative">
          <div
            className="h-full bg-white transition-all duration-75 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
