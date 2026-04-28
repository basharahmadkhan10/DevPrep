/** @format */

import React, { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview.js";

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
          "radial-gradient(ellipse at 50% 0%, rgba(200,146,58,0.05) 0%, transparent 60%)",
      }}
    />
  </>
));
AnimatedBackground.displayName = "AnimatedBackground";

const FontsLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap"
    rel="stylesheet"
  />
);

const MobileMenuButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "none",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "8px",
      color: "#8a8680",
    }}
    className="mobile-menu-btn">
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>
);

const Navbar = memo(({ onBack }) => (
  <nav
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 16px",
      
    }}>
    <button
      onClick={onBack}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
        fontWeight: 400,
        color: "#8a8680",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px 10px",
        borderRadius: "6px",
        fontFamily: "'DM Sans', sans-serif",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#f0ece4";
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#8a8680";
        e.currentTarget.style.background = "none";
      }}>
      <svg
        width="14"
        height="14"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span className="back-text">Back</span>
    </button>
    <div
      style={{
        fontSize: "16px",
        fontWeight: 400,
        color: "#5a5650",
        fontFamily: "'Instrument Serif', serif",
        fontStyle: "italic",
      }}>
      DevPrep
    </div>
    <div style={{ width: "60px" }} />
  </nav>
));
Navbar.displayName = "Navbar";

const JobDescriptionInput = memo(({ value, onChange }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "16px",
      }}>
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "rgba(58,158,138,0.12)",
          border: "1px solid rgba(58,158,138,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#3a9e8a"
          strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div>
        <p
          style={{
            fontSize: "16px",
            fontWeight: 500,
            color: "#f0ece4",
            marginBottom: "2px",
          }}>
          Job Description
        </p>
        <p style={{ fontSize: "12px", color: "#5a5650", fontWeight: 300 }}>
          Paste the complete job posting
        </p>
      </div>
    </div>

    <textarea
      value={value}
      onChange={onChange}
      placeholder="Paste the job description here..."
      style={{
        flex: 1,
        width: "100%",
        minHeight: "280px",
        padding: "16px",
        background: "#0e0e0e",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        color: "#f0ece4",
        fontSize: "14px",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        lineHeight: 1.6,
        resize: "vertical",
        outline: "none",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "rgba(200,146,58,0.4)")}
      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
    />

    <div
      style={{
        marginTop: "10px",
        display: "flex",
        justifyContent: "space-between",
      }}>
      <span
        style={{
          fontSize: "11px",
          fontFamily: "'DM Mono', monospace",
          color: "#5a5650",
        }}>
        min 50 chars
      </span>
      <span
        style={{
          fontSize: "11px",
          fontFamily: "'DM Mono', monospace",
          color: value.length >= 50 ? "#3a9e8a" : "#5a5650",
        }}>
        {value.length}
      </span>
    </div>
  </div>
));
JobDescriptionInput.displayName = "JobDescriptionInput";

const ResumeUpload = memo(({ file, onFileChange }) => {
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f?.type === "application/pdf") onFileChange(f);
    },
    [onFileChange],
  );

  const handleSelect = useCallback(
    (e) => {
      const f = e.target.files[0];
      if (f?.type === "application/pdf") onFileChange(f);
    },
    [onFileChange],
  );

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => document.getElementById("resume-upload")?.click()}
      style={{
        border: `1.5px dashed ${file ? "rgba(58,158,138,0.5)" : "rgba(255,255,255,0.12)"}`,
        borderRadius: "12px",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        background: file ? "rgba(58,158,138,0.05)" : "rgba(255,255,255,0.02)",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!file) {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }
      }}
      onMouseLeave={(e) => {
        if (!file) {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        }
      }}>
      <input
        id="resume-upload"
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={handleSelect}
      />
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: file ? "rgba(58,158,138,0.12)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${file ? "rgba(58,158,138,0.2)" : "rgba(255,255,255,0.08)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 12px",
        }}>
        <svg
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke={file ? "#3a9e8a" : "#5a5650"}
          strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      {file ?
        <>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#3a9e8a",
              marginBottom: "4px",
              wordBreak: "break-all",
            }}>
            {file.name}
          </p>
          <p
            style={{
              fontSize: "11px",
              fontFamily: "'DM Mono', monospace",
              color: "#5a5650",
            }}>
            {(file.size / 1024).toFixed(0)} KB
          </p>
        </>
      : <>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "#8a8680",
              marginBottom: "6px",
            }}>
            Upload Resume
          </p>
          <p style={{ fontSize: "11px", color: "#5a5650", fontWeight: 300 }}>
            PDF only — drag or click
          </p>
        </>
      }
    </div>
  );
});
ResumeUpload.displayName = "ResumeUpload";

const SelfDescriptionInput = memo(({ value, onChange }) => (
  <div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "16px",
      }}>
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "rgba(200,146,58,0.12)",
          border: "1px solid rgba(200,146,58,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#c8923a"
          strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <div>
        <p
          style={{
            fontSize: "16px",
            fontWeight: 500,
            color: "#f0ece4",
            marginBottom: "2px",
          }}>
          About You
        </p>
        <p style={{ fontSize: "12px", color: "#5a5650", fontWeight: 300 }}>
          Optional but recommended
        </p>
      </div>
    </div>
    <textarea
      value={value}
      onChange={onChange}
      placeholder="Tell us about your experience, skills, and background..."
      style={{
        width: "100%",
        height: "100px",
        padding: "14px 16px",
        background: "#0e0e0e",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        color: "#f0ece4",
        fontSize: "14px",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        lineHeight: 1.6,
        resize: "vertical",
        outline: "none",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "rgba(200,146,58,0.4)")}
      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
    />
  </div>
));
SelfDescriptionInput.displayName = "SelfDescriptionInput";

const AnalyzeButton = memo(({ isValid, onClick, isGenerating }) => (
  <button
    onClick={onClick}
    disabled={!isValid || isGenerating}
    style={{
      width: "100%",
      padding: "14px",
      borderRadius: "12px",
      border: "none",
      cursor: isValid && !isGenerating ? "pointer" : "not-allowed",
      fontSize: "14px",
      fontWeight: 500,
      fontFamily: "'DM Sans', sans-serif",
      color: "#f0ece4",
      background:
        isValid && !isGenerating ?
          "linear-gradient(135deg, #c8923a 0%, #b85c6e 100%)"
        : "rgba(255,255,255,0.06)",
      opacity: isValid && !isGenerating ? 1 : 0.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      transition: "opacity 0.2s, transform 0.15s",
    }}
    onMouseEnter={(e) => {
      if (isValid && !isGenerating) e.currentTarget.style.opacity = "0.88";
    }}
    onMouseLeave={(e) => {
      if (isValid && !isGenerating) e.currentTarget.style.opacity = "1";
    }}>
    {isGenerating ?
      <>
        <div
          style={{
            width: "16px",
            height: "16px",
            border: "2px solid rgba(255,255,255,0.2)",
            borderTopColor: "#f0ece4",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        Generating report...
      </>
    : <>
        Analyse Resume
        <svg
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </>
    }
  </button>
));
AnalyzeButton.displayName = "AnalyzeButton";

const LoadingOverlay = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(10,10,10,0.95)",
      backdropFilter: "blur(12px)",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "20px",
    }}>
    <div
      style={{
        width: "48px",
        height: "48px",
        border: "2px solid rgba(255,255,255,0.08)",
        borderTopColor: "#c8923a",
        borderRadius: "50%",
        animation: "spin 0.9s linear infinite",
      }}
    />
    <div style={{ textAlign: "center", padding: "0 20px" }}>
      <p
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "20px",
          fontStyle: "italic",
          color: "#f0ece4",
          marginBottom: "8px",
        }}>
        Analysing your profile
      </p>
      <p style={{ fontSize: "13px", color: "#5a5650", fontWeight: 300 }}>
        Comparing resume against job requirements...
      </p>
    </div>
  </div>
);

const Card = ({ children, style }) => (
  <div
    style={{
      background: "#161616",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "20px",
      ...style,
    }}>
    {children}
  </div>
);

function Dashboard() {
  const navigate = useNavigate();
  const { loading: apiLoading, generateReport } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const isValid = jobDescription.trim().length > 50 && resumeFile !== null;

  const handleJobDescriptionChange = useCallback(
    (e) => setJobDescription(e.target.value),
    [],
  );
  const handleSelfDescriptionChange = useCallback(
    (e) => setSelfDescription(e.target.value),
    [],
  );
  const handleResumeChange = useCallback((file) => {
    setResumeFile(file);
    setUploadError(null);
  }, []);

// Dashboard.jsx - Add this at top
window.onerror = function(msg, url, line, col, error) {
  alert("Error: " + msg + "\nLine: " + line);
  return false;
};

// handleAnalyze function mein
const handleAnalyze = useCallback(async () => {
  try {
    alert("Step 1: Starting");
    
    if (!isValid) {
      alert("Step 2: Invalid form - Resume or JD missing");
      return;
    }
    
    alert("Step 3: Calling API...");
    
    const reportData = await generateReport({
      resume: resumeFile,
      jobDescription,
      selfDescription,
    });
    
    alert("Step 4: Success! Navigating...");
    navigate(`/report/${reportData.data._id}`);
    
  } catch (error) {
  alert(
    "Step 5: ERROR\n" +
    "Message: " + error.message + "\n" +
    "Code: " + (error.code || "none") + "\n" +
    "Status: " + (error.response?.status || "none") + "\n" +
    "URL hit: " + (error.config?.url || "none") + "\n" +
    "Base: " + (error.config?.baseURL || "none")
  );
}
}, [isValid, generateReport, jobDescription, resumeFile, selfDescription, navigate]);

  if (apiLoading) {
  return (
    <div
      style={{
        minHeight: "100vh",
        marginTop: "30px",
        width: "100%",
        background: "#0e0e0e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            margin: "0 auto 16px",
            border: "2px solid rgba(255,255,255,0.08)",
            borderTopColor: "#c8923a",
            borderRadius: "50%",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#5a5650",
            fontWeight: 300,
          }}>
          Loading...
        </p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

  return (
    <>
      <FontsLink />
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "#0e0e0e",
          position: "relative",
          overflowX: "hidden",
          fontFamily: "'DM Sans', sans-serif",
        }}>
        <AnimatedBackground />
        <Navbar onBack={() => navigate("/")} />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: "1040px",
            margin: "0 auto",
            padding: "80px 16px 60px",
          }}>
          {/* Page heading - responsive */}
          <div style={{ marginBottom: "24px" }}>
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(24px, 6vw, 32px)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#f0ece4",
                letterSpacing: "-0.3px",
                marginBottom: "6px",
              }}>
              Create your interview plan
            </h1>
            <p
              style={{
                fontSize: "clamp(13px, 4vw, 14px)",
                color: "#8a8680",
                fontWeight: 300,
              }}>
              Paste the job description and upload your resume — the AI does the
              rest.
            </p>
          </div>

          {/* Error */}
          {uploadError && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(184,92,110,0.10)",
                border: "1px solid rgba(184,92,110,0.2)",
                fontSize: "13px",
                color: "#b85c6e",
                fontWeight: 300,
              }}>
              {uploadError}
            </div>
          )}

          {/* Responsive two-column layout */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
            className="dashboard-grid">
            {/* Left — Job Description */}
            <Card
              style={{
                minHeight: "400px",
                display: "flex",
                flexDirection: "column",
              }}>
              <JobDescriptionInput
                value={jobDescription}
                onChange={handleJobDescriptionChange}
              />
            </Card>

            {/* Right — stacked cards */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Card>
                <div style={{ marginBottom: "16px" }}>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#f0ece4",
                      marginBottom: "4px",
                    }}>
                    Resume
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#5a5650",
                      fontWeight: 300,
                    }}>
                    Upload your CV as PDF
                  </p>
                </div>
                <ResumeUpload
                  file={resumeFile}
                  onFileChange={handleResumeChange}
                />
              </Card>

              <Card>
                <SelfDescriptionInput
                  value={selfDescription}
                  onChange={handleSelfDescriptionChange}
                />
              </Card>

              <Card>
                <AnalyzeButton
                  isValid={isValid}
                  onClick={handleAnalyze}
                  isGenerating={isAnalyzing}
                />
                {!isValid && (
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "12px",
                      color: "#5a5650",
                      fontWeight: 300,
                      marginTop: "12px",
                    }}>
                    {!resumeFile ?
                      "Upload a PDF resume to continue"
                    : "Job description needs 50+ characters"}
                  </p>
                )}
              </Card>
            </div>
          </div>
        </div>

        {isAnalyzing && <LoadingOverlay />}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          
          * { box-sizing: border-box; }
          ::placeholder { color: #3a3a38; }
          
          /* Tablet and Desktop */
          @media (min-width: 768px) {
            .dashboard-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 20px !important;
            }
            .mobile-menu-btn {
              display: none !important;
            }
          }
          
          /* Mobile */
          @media (max-width: 767px) {
            .dashboard-grid {
              flex-direction: column;
            }
            .back-text {
              display: inline;
            }
          }
          
          /* Small mobile */
          @media (max-width: 480px) {
            .dashboard-grid {
              gap: 12px;
            }
            .back-text {
              display: none;
            }
          }
        `}</style>
      </div>
    </>
  );
}

export default Dashboard;
