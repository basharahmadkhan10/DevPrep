/** @format */

import React, { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.context.jsx";

const StudioLogo = memo(() => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center overflow-hidden">
      <div className="w-2.5 h-5 bg-black rounded-r-full mr-auto" />
    </div>
    <span className="font-syne text-sm uppercase tracking-[0.2em] text-white font-bold">
      DevPrep.
    </span>
  </div>
));
StudioLogo.displayName = "StudioLogo";

const getStrength = (pass) => {
  let s = 0;
  if (pass.length >= 8) s++;
  if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) s++;
  if (pass.match(/[0-9]/)) s++;
  if (pass.match(/[^a-zA-Z0-9]/)) s++;
  return s;
};

const STRENGTH_LABELS = { 0: "Insufficient", 1: "Weak", 2: "Standard", 3: "Optimal", 4: "Fortified" };

export default function Signup() {
  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState(null);

  const strength = getStrength(password);
  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);
      if (!username.trim()) return setError("Please designate a username");
      if (!email.trim() || !email.includes("@")) return setError("Please provide a valid corporate or personal email");
      if (!password || password.length < 8) return setError("Password must contain at least 8 characters");
      if (!password.match(/[A-Z]/) || !password.match(/[0-9]/))
        return setError("Password must contain an uppercase letter and a number");
      if (password !== confirmPassword) return setError("Passwords do not match");
      if (!agreeTerms) return setError("Please acknowledge the Candidate Protocol & Terms");

      const response = await handleRegister(username, email, password);
      if (response) {
        navigate("/dashboard");
      } else {
        setError("Registration failed. Email or username may already be registered.");
      }
    },
    [username, email, password, confirmPassword, agreeTerms, handleRegister, navigate]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border border-neutral-700 border-t-white rounded-full animate-spin mb-4" />
        <h2 className="font-editorial text-2xl text-white italic">
          Initializing Archive Profile...
        </h2>
        <p className="font-mono-tech text-xs uppercase tracking-widest text-neutral-500 mt-2">
          Generating cryptographic credential keys
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col lg:flex-row bg-grid-minimal">
      {/* Left Column: High-Fashion Editorial Statement */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-800/80">
        <div>
          <StudioLogo />
          <div className="mt-16 lg:mt-24 max-w-xl">
            <span className="font-mono-tech text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-4">
              [ ONBOARDING // CANDIDATE INITIATION ]
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-white tracking-tight">
              Crafting Excellence, <br />
              <span className="text-neutral-400 font-normal">Engineering Distinction.</span>
            </h1>
            <p className="font-studio text-sm sm:text-base text-neutral-400 mt-6 leading-relaxed max-w-md font-normal">
              Elevate your interview trajectory with systematic gap deconstruction, technical depth mapping, and tactical STAR behavioral preparation.
            </p>
          </div>
        </div>

        {/* Studio Specs */}
        <div className="mt-12 pt-8 border-t border-neutral-800/60 grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div>
            <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block mb-1">
              ARCHIVE
            </span>
            <p className="font-studio text-xs font-medium text-neutral-300">
              Persistent Dossiers
            </p>
          </div>
          <div>
            <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block mb-1">
              BENCHMARK
            </span>
            <p className="font-studio text-xs font-medium text-neutral-300">
              Tier-1 Tech Standards
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block mb-1">
              PRIVACY
            </span>
            <p className="font-studio text-xs font-medium text-neutral-300">
              Zero Disk Retention
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Minimalist Signup Form */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-neutral-400 block mb-2">
              INITIATION PROTOCOL
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Create Candidate Record
            </h2>
            <p className="font-studio text-xs text-neutral-400 mt-1">
              Establish your verified profile to begin generating bespoke interview analyses.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs font-studio flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block font-mono-tech text-[11px] uppercase tracking-wider text-neutral-400 mb-2"
              >
                Candidate Name / Handle
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full h-12 px-4 rounded-xl bg-[#121214] border border-neutral-800 text-white placeholder-neutral-600 font-studio text-sm focus:outline-none focus:border-white transition-colors duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-mono-tech text-[11px] uppercase tracking-wider text-neutral-400 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@domain.com"
                className="w-full h-12 px-4 rounded-xl bg-[#121214] border border-neutral-800 text-white placeholder-neutral-600 font-studio text-sm focus:outline-none focus:border-white transition-colors duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-mono-tech text-[11px] uppercase tracking-wider text-neutral-400 mb-2"
              >
                Passcode (Min. 8 chars, 1 uppercase, 1 number)
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-12 px-4 rounded-xl bg-[#121214] border border-neutral-800 text-white placeholder-neutral-600 font-studio text-sm focus:outline-none focus:border-white transition-colors duration-200"
              />
              {password && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5 mb-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 h-[2px] rounded-full transition-colors duration-300 ${
                          level <= strength ? "bg-white" : "bg-neutral-800"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono-tech">
                    <span className="text-neutral-500 uppercase">Entropy</span>
                    <span className="text-white uppercase">{STRENGTH_LABELS[strength]}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block font-mono-tech text-[11px] uppercase tracking-wider text-neutral-400 mb-2"
              >
                Confirm Passcode
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full h-12 px-4 rounded-xl bg-[#121214] border text-white placeholder-neutral-600 font-studio text-sm focus:outline-none transition-colors duration-200 ${
                  passwordsMismatch
                    ? "border-red-500/50"
                    : passwordsMatch
                    ? "border-emerald-500/50"
                    : "border-neutral-800 focus:border-white"
                }`}
              />
              {passwordsMismatch && (
                <p className="font-mono-tech text-[10px] text-red-400 mt-1 uppercase">
                  Passcodes do not match
                </p>
              )}
              {passwordsMatch && (
                <p className="font-mono-tech text-[10px] text-emerald-400 mt-1 uppercase">
                  Passcodes verified
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded bg-[#121214] border border-neutral-700 checked:bg-white checked:border-white transition-colors"
                />
                <span className="font-studio text-xs text-neutral-400 leading-snug">
                  I agree to the confidential evaluation protocol and candidate data terms.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-12 mt-4 bg-white text-black hover:bg-neutral-200 rounded-full font-studio text-xs uppercase tracking-wider font-semibold transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Initialize Candidate Account</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-150">
                →
              </span>
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs font-studio">
            <span className="text-neutral-500">Existing candidate?</span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-white hover:text-neutral-300 underline underline-offset-4 font-medium transition-colors"
            >
              Access Dossier →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
