/** @format */

import React, { useState, useCallback, memo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useAuth } from "../auth.context.jsx";

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
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(200,146,58,0.05) 0%, transparent 55%)",
      }}
    />
  </>
));
AnimatedBackground.displayName = "AnimatedBackground";

const InputField = memo(
  ({
    id,
    type,
    label,
    value,
    onChange,
    placeholder,
    icon: Icon,
    autoComplete,
  }) => (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#ffffff",
          marginBottom: "8px",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
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
          onFocus={(e) =>
            (e.target.style.borderColor = "rgba(200,146,58,0.45)")
          }
          onBlur={(e) =>
            (e.target.style.borderColor = "rgba(255,255,255,0.08)")
          }
        />
      </div>
    </div>
  )
);
InputField.displayName = "InputField";

const UserIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="#5a5650"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="#5a5650"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const SocialBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
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
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.07)";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
      e.currentTarget.style.color = "#f0ece4";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      e.currentTarget.style.color = "#8a8680";
    }}
  >
    {children}
  </button>
);

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
      script.onerror = onError;
      document.body.appendChild(script);
    }
  }, [onSuccess, onError]);

  const handleGoogleClick = () => {
    if (isGoogleReady && window.google?.accounts) {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      disabled={isLoading || !isGoogleReady}
      style={{
        width: "100%",
        padding: "12px 16px",
        background: "#ffffff",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "10px",
        cursor: isLoading || !isGoogleReady ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        opacity: isLoading ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isLoading && isGoogleReady) {
          e.currentTarget.style.background = "#f5f5f5";
          e.currentTarget.style.borderColor = "rgba(200,146,58,0.3)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#ffffff";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
    >
      {isLoading ? (
        <div
          style={{
            width: "20px",
            height: "20px",
            border: "2px solid rgba(0,0,0,0.1)",
            borderTopColor: "#c8923a",
            borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
          }}
        />
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24">
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
      <span
        style={{
          color: "#1a1a1a",
          fontSize: "14px",
          fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {isLoading ? "Signing in..." : "Continue with Google"}
      </span>
    </button>
  );
};

function Login() {
  const navigate = useNavigate();
  const { loading, login, googleLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isGoogleProcessing, setIsGoogleProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleUsernameChange = useCallback(
    (e) => setUsername(e.target.value),
    []
  );
  const handlePasswordChange = useCallback(
    (e) => setPassword(e.target.value),
    []
  );

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
        }, 1000);
      } else {
        setError(result.error || "Invalid credentials. Please try again.");
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
          }, 1000);
        } else {
          setError(result.error || "Google sign in failed. Please try again.");
          setIsGoogleProcessing(false);
        }
      } catch (err) {
        console.error("Google login error:", err);
        setError("Google sign in failed. Please try again.");
        setIsGoogleProcessing(false);
      }
    },
    [googleLogin, navigate]
  );

  const handleGoogleError = useCallback(() => {
    setError("Google sign in failed. Please try again.");
    setIsGoogleProcessing(false);
  }, []);

  if (loading || isRedirecting) {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "#0e0e0e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              margin: "0 auto 20px",
              border: "2px solid rgba(255,255,255,0.08)",
              borderTopColor: "#c8923a",
              borderRadius: "50%",
              animation: "spin 0.9s linear infinite",
            }}
          />
          <p
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "18px",
              fontStyle: "italic",
              color: "#f0ece4",
              marginBottom: "8px",
            }}
          >
            {isRedirecting ? "Redirecting you..." : "Loading..."}
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#5a5650",
              fontWeight: 300,
            }}
          >
            {isRedirecting
              ? "Taking you to your dashboard"
              : "Please wait a moment"}
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "#0e0e0e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          position: "relative",
          overflowX: "hidden",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <AnimatedBackground />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "28px",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#f0ece4",
                letterSpacing: "-0.3px",
                marginBottom: "6px",
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#5a5650",
                fontWeight: 300,
              }}
            >
              Sign in to continue to your account
            </p>
          </div>

          <div
            style={{
              background: "#161616",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "32px",
            }}
          >
            {error && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: "rgba(184,92,110,0.10)",
                  border: "1px solid rgba(184,92,110,0.2)",
                  fontSize: "13px",
                  color: "#b85c6e",
                  fontWeight: 300,
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <ManualGoogleButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                isLoading={isGoogleProcessing}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "20px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "rgba(255,255,255,0.06)",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: "'DM Mono', monospace",
                  color: "#5a5650",
                  letterSpacing: "0.06em",
                }}
              >
                or sign in with email
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "rgba(255,255,255,0.06)",
                }}
              />
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              <InputField
                id="username"
                type="text"
                label="Username or Email"
                value={username}
                onChange={handleUsernameChange}
                placeholder="your@email.com"
                icon={UserIcon}
                autoComplete="username"
              />
              <InputField
                id="password"
                type="password"
                label="Password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                icon={LockIcon}
                autoComplete="current-password"
              />

              <div style={{ textAlign: "right", marginTop: "-8px" }}>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "#5a5650",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#c8923a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#5a5650")
                  }
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #c8923a 0%, #b85c6e 100%)",
                  color: "#f0ece4",
                  fontSize: "14px",
                  fontWeight: 400,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Sign In
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </form>

            <p
              style={{
                textAlign: "center",
                fontSize: "13px",
                color: "#5a5650",
                fontWeight: 300,
                marginTop: "24px",
              }}
            >
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "#c8923a",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Sign up for free
              </button>
            </p>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: "#3a3a38",
              marginTop: "20px",
              fontWeight: 300,
            }}
          >
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
