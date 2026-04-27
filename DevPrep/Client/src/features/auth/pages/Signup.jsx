/** @format */

import React, { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.context.jsx";

// ─── Shared Background ────────────────────────────────────────────────────────

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

// ─── Input Field ──────────────────────────────────────────────────────────────

const InputField = ({ id, type, label, value, onChange, placeholder, icon: Icon, autoComplete }) => (
  <div>
    <label style={{ display: "block", fontSize: "12px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: "#5a5650", marginBottom: "8px" }}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <Icon />
      </div>
      <input
        type={type} id={id} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete={autoComplete}
        style={{
          width: "100%", paddingLeft: "44px", paddingRight: "16px",
          paddingTop: "12px", paddingBottom: "12px",
          background: "#0e0e0e",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          color: "#f0ece4", fontSize: "14px",
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          outline: "none", transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = "rgba(200,146,58,0.45)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
      />
    </div>
  </div>
);

// ─── Icons ────────────────────────────────────────────────────────────────────

const UserIcon = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#5a5650" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const EmailIcon = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#5a5650" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const LockIcon = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#5a5650" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const ShieldIcon = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#5a5650" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;

// ─── Password Strength ────────────────────────────────────────────────────────

const getStrength = pass => {
  let s = 0;
  if (pass.length >= 8) s++;
  if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) s++;
  if (pass.match(/[0-9]/)) s++;
  if (pass.match(/[^a-zA-Z0-9]/)) s++;
  return s;
};

const STRENGTH_COLORS = { 0: "#b85c6e", 1: "#b85c6e", 2: "#c8923a", 3: "#3a9e8a", 4: "#3a9e8a" };
const STRENGTH_LABELS = { 0: "Very weak", 1: "Weak", 2: "Fair", 3: "Good", 4: "Strong" };

// ─── Social Button ────────────────────────────────────────────────────────────

const SocialBtn = ({ children }) => (
  <button
    style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
      padding: "10px 16px",
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "10px", color: "#8a8680", fontSize: "13px",
      fontFamily: "'DM Sans', sans-serif", fontWeight: 400, cursor: "pointer",
      transition: "all 0.2s",
    }}
    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.color = "#f0ece4"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#8a8680"; }}
  >
    {children}
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────

function Signup() {
  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState(null);

  const strength = getStrength(password);
  const strengthColor = STRENGTH_COLORS[strength];
  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) return setError("Please enter a username");
    if (!email.trim() || !email.includes("@")) return setError("Please enter a valid email address");
    if (!password || password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (!agreeTerms) return setError("Please agree to the Terms and Conditions");
    const response = await handleRegister(username, email, password);
    if (response) navigate("/dashboard");
    else setError("Registration failed. Please try again.");
  }, [username, email, password, confirmPassword, agreeTerms, handleRegister, navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0e0e0e", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "36px", height: "36px", border: "1.5px solid rgba(255,255,255,0.06)", borderTopColor: "#c8923a", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", minHeight: "100vh", background: "#0e0e0e", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", overflowX: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
        <AnimatedBackground />

        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "420px" }}>

          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", fontWeight: 400, fontStyle: "italic", color: "#f0ece4", letterSpacing: "-0.3px", marginBottom: "6px" }}>
              Create an account
            </h1>
            <p style={{ fontSize: "13px", color: "#5a5650", fontWeight: 300 }}>Join and build your interview advantage</p>
          </div>

          {/* Card */}
          <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "32px" }}>

            {error && (
              <div style={{ marginBottom: "20px", padding: "12px 16px", borderRadius: "8px", background: "rgba(184,92,110,0.10)", border: "1px solid rgba(184,92,110,0.2)", fontSize: "13px", color: "#b85c6e", fontWeight: 300 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <InputField id="username" type="text" label="Username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" icon={UserIcon} autoComplete="username" />
              <InputField id="email" type="email" label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" icon={EmailIcon} autoComplete="email" />

              {/* Password with strength */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: "#5a5650", marginBottom: "8px" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><LockIcon /></div>
                  <input
                    type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Create a strong password" autoComplete="new-password"
                    style={{ width: "100%", paddingLeft: "44px", paddingRight: "16px", paddingTop: "12px", paddingBottom: "12px", background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#f0ece4", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, outline: "none", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = "rgba(200,146,58,0.45)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>
                {password && (
                  <div style={{ marginTop: "8px" }}>
                    <div style={{ display: "flex", gap: "4px", marginBottom: "5px" }}>
                      {[1, 2, 3, 4].map(level => (
                        <div key={level} style={{ flex: 1, height: "2px", borderRadius: "2px", background: level <= strength ? strengthColor : "rgba(255,255,255,0.07)", transition: "background 0.3s" }} />
                      ))}
                    </div>
                    <span style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: strengthColor }}>{STRENGTH_LABELS[strength]} password</span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <InputField id="confirmPassword" type="password" label="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" icon={ShieldIcon} autoComplete="new-password" />
                {passwordsMismatch && <p style={{ fontSize: "12px", color: "#b85c6e", fontFamily: "'DM Mono', monospace", marginTop: "6px" }}>Passwords do not match</p>}
                {passwordsMatch && <p style={{ fontSize: "12px", color: "#3a9e8a", fontFamily: "'DM Mono', monospace", marginTop: "6px" }}>Passwords match</p>}
              </div>

              {/* Terms */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <input
                  type="checkbox" id="terms" checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  style={{ marginTop: "2px", width: "16px", height: "16px", accentColor: "#c8923a", cursor: "pointer", flexShrink: 0 }}
                />
                <label htmlFor="terms" style={{ fontSize: "12px", color: "#5a5650", fontWeight: 300, lineHeight: 1.6, cursor: "pointer" }}>
                  I agree to the{" "}
                  <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#c8923a", fontFamily: "'DM Sans', sans-serif", padding: 0 }}>Terms of Service</button>
                  {" "}and{" "}
                  <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#c8923a", fontFamily: "'DM Sans', sans-serif", padding: 0 }}>Privacy Policy</button>
                </label>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%", padding: "13px", borderRadius: "10px", border: "none",
                  background: "linear-gradient(135deg, #c8923a 0%, #b85c6e 100%)",
                  color: "#f0ece4", fontSize: "14px", fontWeight: 400,
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  transition: "opacity 0.2s", marginTop: "4px",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Create Account
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
              <span style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#5a5650", letterSpacing: "0.06em" }}>or sign up with</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
              <SocialBtn>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </SocialBtn>
              <SocialBtn>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </SocialBtn>
            </div>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#5a5650", fontWeight: 300 }}>
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#c8923a", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, transition: "opacity 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Sign in
              </button>
            </p>
          </div>

          <p style={{ textAlign: "center", fontSize: "11px", color: "#3a3a38", marginTop: "20px", fontWeight: 300 }}>
            By signing up, you agree to our Terms of Service and Privacy Policy
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

export default Signup;
