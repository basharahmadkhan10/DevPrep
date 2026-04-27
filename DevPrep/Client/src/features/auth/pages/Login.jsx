/** @format */

import React, { useState, useCallback, memo,useRef,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import {useAuth} from '../auth.context.jsx';


const AnimatedBackground = memo(() => (
  <>
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.6,
      }}
    />
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(200,146,58,0.05) 0%, transparent 55%)",
      }}
    />
  </>
));
AnimatedBackground.displayName = "AnimatedBackground";


const InputField = memo(({ id, type, label, value, onChange, placeholder, icon: Icon, autoComplete }) => (
  <div>
    <label style={{ display: "block", fontSize: "12px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: "#ffffff", marginBottom: "8px" }}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <Icon />
      </div>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={{
          width: "100%",
          paddingLeft: "44px",
          paddingRight: "16px",
          paddingTop: "12px",
          paddingBottom: "12px",
          background: "#0e0e0e",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          color: "#f0ece4",
          fontSize: "14px",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = "rgba(200,146,58,0.45)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
      />
    </div>
  </div>
));
InputField.displayName = "InputField";


const UserIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#5a5650" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#5a5650" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);


const SocialBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
      padding: "10px 16px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "10px",
      color: "#8a8680",
      fontSize: "13px",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 400,
      cursor: "pointer",
      transition: "all 0.2s",
      width: "100%",
    }}
    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.color = "#f0ece4"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#8a8680"; }}
  >
    {children}
  </button>
);


const ManualGoogleButton = ({ onSuccess, onError, isProcessing }) => {
  const buttonRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !buttonRef.current) return;

    const initializeGoogleButton = () => {
      if (!window.google || !window.google.accounts) return;

      initialized.current = true;
      
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
      
      if (buttonRef.current) {
        buttonRef.current.innerHTML = '';
        
        window.google.accounts.id.renderButton(
          buttonRef.current,
          { 
            theme: 'filled_black',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 400, 
            logo_alignment: 'center',
          }
        );
      }
    };

    if (window.google && window.google.accounts) {
      initializeGoogleButton();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleButton;
      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
        onError?.();
      };
      document.body.appendChild(script);

      return () => {
        // Cleanup
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        if (window.google && window.google.accounts) {
          window.google.accounts.id.cancel();
        }
        initialized.current = false;
      };
    }
  }, [onSuccess, onError]);

  return (
    <div style={{ position: "relative", width: "60%", minHeight: "52px" }}>
      {isProcessing && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}>
          <div style={{
            width: "24px",
            height: "24px",
            border: "2px solid rgba(255,255,255,0.2)",
            borderTopColor: "#c8923a",
            borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
          }} />
        </div>
      )}
      <div 
        ref={buttonRef} 
        style={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          opacity: isProcessing ? 0.5 : 1,
          pointerEvents: isProcessing ? 'none' : 'auto'
        }}
      />
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

function Login() {
  const navigate = useNavigate();
  const { loading, login, googleLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isGoogleProcessing, setIsGoogleProcessing] = useState(false);

  const handleUsernameChange = useCallback(e => setUsername(e.target.value), []);
  const handlePasswordChange = useCallback(e => setPassword(e.target.value), []);

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) { setError("Please enter your username or email"); return; }
    if (!password.trim()) { setError("Please enter your password"); return; }
    const result = await login(username, password);
    console.log(result);
    if (result.success) {
      navigate("/dashboard");
  } else {
    setError(result.error || "Invalid credentials. Please try again.");
  }
  }, [username, password, login, navigate]);

  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    setIsGoogleProcessing(true);
    setError(null);
    try {
      const result = await googleLogin(credentialResponse.credential);
      if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Google sign in failed. Please try again.");
    }
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google sign in failed. Please try again.");
    } finally {
      setIsGoogleProcessing(false);
    }
  }, [googleLogin, navigate]);

  const handleGoogleError = useCallback(() => {
    setError("Google sign in failed. Please try again.");
    setIsGoogleProcessing(false);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", width:"100%", background: "#0e0e0e", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "36px", height: "36px", border: "1.5px solid rgba(255,255,255,0.06)", borderTopColor: "#c8923a", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", minHeight: "100vh", background: "#0e0e0e", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflowX: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
        <AnimatedBackground />

        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "400px" }}>

          {/* Wordmark */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", fontWeight: 400, fontStyle: "italic", color: "#f0ece4", letterSpacing: "-0.3px", marginBottom: "6px" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "13px", color: "#5a5650", fontWeight: 300 }}>Sign in to continue to your account</p>
          </div>

          {/* Card */}
          <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "32px" }}>

            {error && (
              <div style={{ marginBottom: "20px", padding: "12px 16px", borderRadius: "8px", background: "rgba(184,92,110,0.10)", border: "1px solid rgba(184,92,110,0.2)", fontSize: "13px", color: "#b85c6e", fontWeight: 300 }}>
                {error}
              </div>
            )}

            {/* Google Sign In Button */}
            <div style={{  display:"flex", justifyContent:"center", alignItems:"center",marginBottom: "20px" }}>
              <ManualGoogleButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                isProcessing={isGoogleProcessing}
              />
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
              <span style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#5a5650", letterSpacing: "0.06em" }}>or sign in with email</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <InputField
                id="username" type="text" label="Username or Email"
                value={username} onChange={handleUsernameChange}
                placeholder="your@email.com" icon={UserIcon} autoComplete="username"
              />
              <InputField
                id="password" type="password" label="Password"
                value={password} onChange={handlePasswordChange}
                placeholder="••••••••" icon={LockIcon} autoComplete="current-password"
              />

              <div style={{ textAlign: "right", marginTop: "-8px" }}>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#5a5650", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#c8923a"}
                  onMouseLeave={e => e.currentTarget.style.color = "#5a5650"}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%", padding: "13px",
                  borderRadius: "10px", border: "none",
                  background: "linear-gradient(135deg, #c8923a 0%, #b85c6e 100%)",
                  color: "#f0ece4", fontSize: "14px", fontWeight: 400,
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Sign In
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </form>

            {/* Optional GitHub Button (commented out) */}
            {/* <div style={{ marginTop: "20px" }}>
              <SocialBtn onClick={() => console.log("GitHub login")}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </SocialBtn>
            </div> */}

            <p style={{ textAlign: "center", fontSize: "13px", color: "#5a5650", fontWeight: 300, marginTop: "24px" }}>
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#c8923a", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, transition: "opacity 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Sign up for free
              </button>
            </p>
          </div>

          <p style={{ textAlign: "center", fontSize: "11px", color: "#3a3a38", marginTop: "20px", fontWeight: 300 }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          * { box-sizing: border-box; }
          ::placeholder { color: #3a3a38 !important; }
        `}</style>
      </div>
    </>
  );
}

export default Login;
