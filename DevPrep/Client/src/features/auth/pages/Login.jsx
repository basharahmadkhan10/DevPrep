/** @format */

import React, { useState, useCallback, memo, useRef, useEffect } from "react";
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

const ManualGoogleButton = ({ onSuccess, onError, isLoading }) => {
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const buttonRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const initGoogle = () => {
      if (!window.google?.accounts) return;

      initialized.current = true;
      setIsGoogleReady(true);

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (response.credential) {
            onSuccess({ credential: response.credential });
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    };

    if (window.google?.accounts) {
      initGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    }
  }, [onSuccess]);

  const handleCustomClick = () => {
    if (isLoading) return;

    if (window.google?.accounts) {
      if (!initialized.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response.credential) {
              onSuccess({ credential: response.credential });
            }
          },
        });
        initialized.current = true;
      }
      window.google.accounts.id.prompt();
    } else {
      onError?.();
    }
  };

  return (
    <button
      type="button"
      onClick={handleCustomClick}
      disabled={isLoading}
      className="w-full h-12 flex items-center justify-center gap-3 bg-white text-black hover:bg-neutral-200 transition-all duration-200 rounded-full font-studio text-xs uppercase tracking-wider font-semibold disabled:opacity-50"
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      <span>{isLoading ? "Authenticating..." : "Continue with Google"}</span>
    </button>
  );
};

export default function Login() {
  const navigate = useNavigate();
  const { loading, login, googleLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isGoogleProcessing, setIsGoogleProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);
      if (!username.trim()) {
        setError("Please enter your username or email");
        return;
      }
      if (!password.trim()) {
        setError("Please enter your password");
        return;
      }

      setIsRedirecting(true);
      const result = await login(username, password);

      if (result.success) {
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        setError(result.error || "Invalid credentials. Please verify your details.");
        setIsRedirecting(false);
      }
    },
    [username, password, login, navigate]
  );

  const handleGoogleSuccess = useCallback(
    async (credentialResponse) => {
      setIsGoogleProcessing(true);
      setError(null);
      try {
        const result = await googleLogin(credentialResponse.credential);
        if (result.success) {
          setIsRedirecting(true);
          setTimeout(() => {
            navigate("/dashboard");
          }, 800);
        } else {
          setError(result.error || "Google sign in failed. Please try again.");
          setIsGoogleProcessing(false);
        }
      } catch (err) {
        console.error("Google login error:", err);
        setError("Google authentication service failed.");
        setIsGoogleProcessing(false);
      }
    },
    [googleLogin, navigate]
  );

  const handleGoogleError = useCallback(() => {
    setError("Google authentication was aborted.");
    setIsGoogleProcessing(false);
  }, []);

  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border border-neutral-700 border-t-white rounded-full animate-spin mb-4" />
        <h2 className="font-editorial text-2xl text-white italic">
          {isRedirecting ? "Authenticating Access Dossier..." : "Loading Session..."}
        </h2>
        <p className="font-mono-tech text-xs uppercase tracking-widest text-neutral-500 mt-2">
          Verifying security handshake
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col lg:flex-row bg-grid-minimal">
      {/* Left Column: High-End Editorial Statement */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-800/80">
        <div>
          <StudioLogo />
          <div className="mt-16 lg:mt-24 max-w-xl">
            <span className="font-mono-tech text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-4">
              [ EDITION 2026 // CANDIDATE PREPARATION ]
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-white tracking-tight">
              Master the Dialogue, <br />
              <span className="text-neutral-400 font-normal">Command the Room.</span>
            </h1>
            <p className="font-studio text-sm sm:text-base text-neutral-400 mt-6 leading-relaxed max-w-md font-normal">
              An architectural evaluation engine designed to deconstruct resumes, map critical skill gaps, and engineer role-tailored interview strategies.
            </p>
          </div>
        </div>

        {/* Minimalist Specs Block */}
        <div className="mt-12 pt-8 border-t border-neutral-800/60 grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div>
            <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block mb-1">
              SPEC 01
            </span>
            <p className="font-studio text-xs font-medium text-neutral-300">
              In-Memory PDF Parser
            </p>
          </div>
          <div>
            <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block mb-1">
              SPEC 02
            </span>
            <p className="font-studio text-xs font-medium text-neutral-300">
              Weighted Match Rubric
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block mb-1">
              SPEC 03
            </span>
            <p className="font-studio text-xs font-medium text-neutral-300">
              Rotated JWT Security
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Minimalist Access Form */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-neutral-400 block mb-2">
              AUTHENTICATION
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Sign In to Dossier
            </h2>
            <p className="font-studio text-xs text-neutral-400 mt-1">
              Access your saved interview reports and strategic roadmaps.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs font-studio flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Social Auth */}
          <ManualGoogleButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            isLoading={isGoogleProcessing}
          />

          {/* Clean Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-neutral-800" />
            <span className="bg-[#09090b] px-4 font-mono-tech text-[10px] uppercase tracking-widest text-neutral-500 absolute">
              OR ARCHIVE ID
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block font-mono-tech text-[11px] uppercase tracking-wider text-neutral-400 mb-2"
              >
                Username or Email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="name@organization.com"
                className="w-full h-12 px-4 rounded-xl bg-[#121214] border border-neutral-800 text-white placeholder-neutral-600 font-studio text-sm focus:outline-none focus:border-white transition-colors duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-mono-tech text-[11px] uppercase tracking-wider text-neutral-400 mb-2"
              >
                Passcode
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-12 px-4 rounded-xl bg-[#121214] border border-neutral-800 text-white placeholder-neutral-600 font-studio text-sm focus:outline-none focus:border-white transition-colors duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 mt-2 bg-white text-black hover:bg-neutral-200 rounded-full font-studio text-xs uppercase tracking-wider font-semibold transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Authenticate Dossier</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-150">
                →
              </span>
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs font-studio">
            <span className="text-neutral-500">Unregistered candidate?</span>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-white hover:text-neutral-300 underline underline-offset-4 font-medium transition-colors"
            >
              Initialize Profile →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
