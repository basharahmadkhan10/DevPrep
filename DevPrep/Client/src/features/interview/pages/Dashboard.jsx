/** @format */

import React, { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview.js";

// ─── Shared Design Tokens ─────────────────────────────────────────────────────
// amber: #c8923a  |  rose: #b85c6e  |  teal: #3a9e8a  |  stone: #7a7060
// bg: #0e0e0e  |  surface: #161616  |  surface2: #1e1e1e
// text: #f0ece4  |  text2: #8a8680  |  text3: #5a5650

// ─── Animated Background ──────────────────────────────────────────────────────

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
        background: "radial-gradient(ellipse at 50% 0%, rgba(200,146,58,0.05) 0%, transparent 60%)",
      }}
    />
  </>
));
AnimatedBackground.displayName = "AnimatedBackground";

// ─── Fonts Link ───────────────────────────────────────────────────────────────

const FontsLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap"
    rel="stylesheet"
  />
);

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = memo(({ onBack }) => (
  <nav
    style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 50,
      height: "64px",
      background: "rgba(14,14,14,0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
    }}
  >
    <button
      onClick={onBack}
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        fontSize: "13px", fontWeight: 400,
        color: "#8a8680", background: "none", border: "none",
        cursor: "pointer", padding: "6px 10px", borderRadius: "6px",
        fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.color = "#f0ece4"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "#8a8680"; e.currentTarget.style.background = "none"; }}
    >
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>Back</span>
    </button>
  </nav>
));
Navbar.displayName = "Navbar";

// ─── Job Description Input ────────────────────────────────────────────────────

const JobDescriptionInput = memo(({ value, onChange }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
      <div
        style={{
          width: "36px", height: "36px", borderRadius: "8px",
          background: "rgba(58,158,138,0.12)", border: "1px solid rgba(58,158,138,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#3a9e8a" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <div>
        <p style={{ fontSize: "15px", fontWeight: 400, color: "#f0ece4", marginBottom: "2px" }}>Job Description</p>
        <p style={{ fontSize: "12px", color: "#5a5650", fontWeight: 300 }}>Paste the complete job posting</p>
      </div>
    </div>

    <textarea
      value={value}
      onChange={onChange}
      placeholder="Paste the job description here..."
      style={{
        flex: 1,
        width: "100%",
        minHeight: "320px",
        padding: "16px",
        background: "#0e0e0e",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        color: "#f0ece4",
        fontSize: "14px",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        lineHeight: 1.7,
        resize: "none",
        outline: "none",
        transition: "border-color 0.2s",
      }}
      onFocus={e => e.target.style.borderColor = "rgba(200,146,58,0.4)"}
      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
    />

    <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#5a5650" }}>min 50 chars</span>
      <span style={{
        fontSize: "11px", fontFamily: "'DM Mono', monospace",
        color: value.length >= 50 ? "#3a9e8a" : "#5a5650",
      }}>{value.length}</span>
    </div>
  </div>
));
JobDescriptionInput.displayName = "JobDescriptionInput";

// ─── Resume Upload ────────────────────────────────────────────────────────────

const ResumeUpload = memo(({ file, onFileChange }) => {
  const handleDrop = useCallback(e => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") onFileChange(f);
  }, [onFileChange]);

  const handleSelect = useCallback(e => {
    const f = e.target.files[0];
    if (f?.type === "application/pdf") onFileChange(f);
  }, [onFileChange]);

  return (
    <div
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => document.getElementById("resume-upload")?.click()}
      style={{
        border: `1px dashed ${file ? "rgba(58,158,138,0.5)" : "rgba(255,255,255,0.12)"}`,
        borderRadius: "10px",
        padding: "24px",
        textAlign: "center",
        cursor: "pointer",
        background: file ? "rgba(58,158,138,0.05)" : "rgba(255,255,255,0.02)",
        transition: "all 0.2s",
      }}
      onMouseEnter={e => { if (!file) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}}
      onMouseLeave={e => { if (!file) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}}
    >
      <input id="resume-upload" type="file" accept=".pdf" style={{ display: "none" }} onChange={handleSelect} />
      <div style={{
        width: "36px", height: "36px", borderRadius: "8px",
        background: file ? "rgba(58,158,138,0.12)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${file ? "rgba(58,158,138,0.2)" : "rgba(255,255,255,0.08)"}`,
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
      }}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={file ? "#3a9e8a" : "#5a5650"} strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      {file ? (
        <>
          <p style={{ fontSize: "13px", fontWeight: 400, color: "#3a9e8a", marginBottom: "4px" }}>{file.name}</p>
          <p style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#5a5650" }}>{(file.size / 1024).toFixed(0)} KB</p>
        </>
      ) : (
        <>
          <p style={{ fontSize: "13px", fontWeight: 400, color: "#8a8680", marginBottom: "4px" }}>Upload Resume</p>
          <p style={{ fontSize: "11px", color: "#5a5650", fontWeight: 300 }}>PDF only — drag or click</p>
        </>
      )}
    </div>
  );
});
ResumeUpload.displayName = "ResumeUpload";

// ─── Self Description ─────────────────────────────────────────────────────────

const SelfDescriptionInput = memo(({ value, onChange }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "8px",
        background: "rgba(200,146,58,0.12)", border: "1px solid rgba(200,146,58,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#c8923a" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div>
        <p style={{ fontSize: "15px", fontWeight: 400, color: "#f0ece4", marginBottom: "2px" }}>About You</p>
        <p style={{ fontSize: "12px", color: "#5a5650", fontWeight: 300 }}>Optional but recommended</p>
      </div>
    </div>
    <textarea
      value={value}
      onChange={onChange}
      placeholder="Tell us about your experience, skills, and background..."
      style={{
        width: "100%", height: "120px",
        padding: "14px 16px",
        background: "#0e0e0e",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        color: "#f0ece4",
        fontSize: "14px",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        lineHeight: 1.7,
        resize: "none",
        outline: "none",
        transition: "border-color 0.2s",
      }}
      onFocus={e => e.target.style.borderColor = "rgba(200,146,58,0.4)"}
      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
    />
  </div>
));
SelfDescriptionInput.displayName = "SelfDescriptionInput";

// ─── Analyze Button ───────────────────────────────────────────────────────────

const AnalyzeButton = memo(({ isValid, onClick, isGenerating }) => (
  <button
    onClick={onClick}
    disabled={!isValid || isGenerating}
    style={{
      width: "100%",
      padding: "14px",
      borderRadius: "10px",
      border: "none",
      cursor: isValid && !isGenerating ? "pointer" : "not-allowed",
      fontSize: "14px",
      fontWeight: 400,
      fontFamily: "'DM Sans', sans-serif",
      color: "#f0ece4",
      background: isValid && !isGenerating
        ? "linear-gradient(135deg, #c8923a 0%, #b85c6e 100%)"
        : "rgba(255,255,255,0.06)",
      opacity: isValid && !isGenerating ? 1 : 0.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      transition: "opacity 0.2s, transform 0.15s",
    }}
    onMouseEnter={e => { if (isValid && !isGenerating) e.currentTarget.style.opacity = "0.88"; }}
    onMouseLeave={e => { if (isValid && !isGenerating) e.currentTarget.style.opacity = "1"; }}
    onMouseDown={e => { if (isValid && !isGenerating) e.currentTarget.style.transform = "scale(0.99)"; }}
    onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
  >
    {isGenerating ? (
      <>
        <div style={{
          width: "16px", height: "16px",
          border: "2px solid rgba(255,255,255,0.2)",
          borderTopColor: "#f0ece4",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        Generating report...
      </>
    ) : (
      <>
        Analyse Resume
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </>
    )}
  </button>
));
AnalyzeButton.displayName = "AnalyzeButton";

// ─── Loading Overlay ──────────────────────────────────────────────────────────

const LoadingOverlay = () => (
  <div style={{
    position: "fixed", inset: 0,
    background: "rgba(10,10,10,0.88)",
    backdropFilter: "blur(12px)",
    zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "column", gap: "20px",
  }}>
    <div style={{
      width: "48px", height: "48px",
      border: "1.5px solid rgba(255,255,255,0.08)",
      borderTopColor: "#c8923a",
      borderRadius: "50%",
      animation: "spin 0.9s linear infinite",
    }} />
    <div style={{ textAlign: "center" }}>
      <p style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: "22px", fontStyle: "italic",
        color: "#f0ece4", marginBottom: "6px",
      }}>Analysing your profile</p>
      <p style={{ fontSize: "13px", color: "#5a5650", fontWeight: 300 }}>
        Comparing resume against job requirements...
      </p>
    </div>
  </div>
);

// ─── Card Wrapper ─────────────────────────────────────────────────────────────

const Card = ({ children, style }) => (
  <div style={{
    background: "#161616",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "24px",
    ...style,
  }}>
    {children}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

function Dashboard() {
  const navigate = useNavigate();
  const { loading: apiLoading, generateReport } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const isValid = jobDescription.trim().length > 50 && resumeFile !== null;

  const handleJobDescriptionChange = useCallback(e => setJobDescription(e.target.value), []);
  const handleSelfDescriptionChange = useCallback(e => setSelfDescription(e.target.value), []);
  const handleResumeChange = useCallback(file => { setResumeFile(file); setUploadError(null); }, []);

  const handleAnalyze = useCallback(async () => {
    if (!isValid || isAnalyzing) return;
    setIsAnalyzing(true);
    setUploadError(null);
    try {
      const reportData = await generateReport({ resume: resumeFile, jobDescription, selfDescription });
      navigate(`/report/${reportData.data._id}`, { state: { report: reportData.data } });
    } catch (error) {
      setUploadError(error.response?.data?.message || error.message || "Failed to generate report. Please try again.");
      setIsAnalyzing(false);
    }
  }, [isValid, isAnalyzing, generateReport, jobDescription, resumeFile, selfDescription, navigate]);

  if (apiLoading) {
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: "#0e0e0e", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", margin: "0 auto 16px", border: "1.5px solid rgba(255,255,255,0.08)", borderTopColor: "#c8923a", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#5a5650", fontWeight: 300 }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <FontsLink />
      <div style={{ width: "100%", minHeight: "100vh", background: "#0e0e0e", position: "relative", overflowX: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
        <AnimatedBackground />
        <Navbar onBack={() => navigate("/")} />

        {/* Page content — padding accounts for fixed nav */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: "1040px", margin: "0 auto", padding: "calc(64px + 36px) 24px 60px" }}>

          {/* Page heading */}
          <div style={{ marginBottom: "20px" }}>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "32px", fontWeight: 400, fontStyle: "italic", color: "#f0ece4", letterSpacing: "-0.4px", marginBottom: "3px" }}>
              Create your interview plan
            </h1>
            <p style={{ fontSize: "14px", color: "#ffffff", fontWeight: 300 }}>
              Paste the job description and upload your resume — the AI does the rest.
            </p>
          </div>

          {/* Error */}
          {uploadError && (
            <div style={{ marginBottom: "20px", padding: "12px 16px", borderRadius: "8px", background: "rgba(184,92,110,0.10)", border: "1px solid rgba(184,92,110,0.2)", fontSize: "13px", color: "#b85c6e", fontWeight: 300 }}>
              {uploadError}
            </div>
          )}

          {/* Two-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "start" }} className="dashboard-grid">

            {/* Left — Job Description */}
            <Card style={{ minHeight: "480px", display: "flex", flexDirection: "column" }}>
              <JobDescriptionInput value={jobDescription} onChange={handleJobDescriptionChange} />
            </Card>

            {/* Right — stacked cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Card>
                <div style={{ marginBottom: "14px" }}>
                  <p style={{ fontSize: "15px", fontWeight: 400, color: "#f0ece4", marginBottom: "2px" }}>Resume</p>
                  <p style={{ fontSize: "12px", color: "#5a5650", fontWeight: 300 }}>Upload your CV as PDF</p>
                </div>
                <ResumeUpload file={resumeFile} onFileChange={handleResumeChange} />
              </Card>

              <Card>
                <SelfDescriptionInput value={selfDescription} onChange={handleSelfDescriptionChange} />
              </Card>

              <Card>
                <AnalyzeButton isValid={isValid} onClick={handleAnalyze} isGenerating={isAnalyzing} />
                {!isValid && (
                  <p style={{ textAlign: "center", fontSize: "12px", color: "#5a5650", fontWeight: 300, marginTop: "10px" }}>
                    {!resumeFile ? "Upload a PDF resume to continue" : "Job description needs 50+ characters"}
                  </p>
                )}
              </Card>
            </div>
          </div>
        </div>

        {isAnalyzing && <LoadingOverlay />}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @media (max-width: 720px) {
            .dashboard-grid { grid-template-columns: 1fr !important; }
          }
          * { box-sizing: border-box; }
          ::placeholder { color: #3a3a38; }
        `}</style>
      </div>
    </>
  );
}

export default Dashboard;