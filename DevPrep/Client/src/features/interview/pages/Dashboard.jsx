/** @format */

import React, { useState, useCallback, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview.js";
import { useAuth } from "../../auth/auth.context.jsx";
import { getAllInterviewReport } from "../services/interview.api.js";

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

export default function Dashboard() {
  const navigate = useNavigate();
  const { handleLogout, user } = useAuth();
  const { generateReport } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pastReports, setPastReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  // Fetch past reports
  useEffect(() => {
    let isMounted = true;
    const fetchReports = async () => {
      setReportsLoading(true);
      try {
        const res = await getAllInterviewReport();
        if (isMounted && res?.data) {
          setPastReports(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch past reports:", err);
      } finally {
        if (isMounted) setReportsLoading(false);
      }
    };
    fetchReports();
    return () => {
      isMounted = false;
    };
  }, []);

  const isValid = jobDescription.trim().length >= 50 && resumeFile !== null;

  const handleResumeSelect = useCallback((file) => {
    setErrorMessage(null);
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Only PDF format documents are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File exceeds the 5MB upload threshold.");
      return;
    }
    setResumeFile(file);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      handleResumeSelect(file);
    },
    [handleResumeSelect]
  );

  const handleAnalyze = useCallback(async () => {
    if (!isValid || isAnalyzing) return;

    setErrorMessage(null);
    setIsAnalyzing(true);
    setAnalysisStep(1);

    const stepTimer1 = setTimeout(() => setAnalysisStep(2), 1500);
    const stepTimer2 = setTimeout(() => setAnalysisStep(3), 3200);

    try {
      const reportData = await generateReport({
        resume: resumeFile,
        jobDescription,
        selfDescription: selfDescription || "Focused on delivering high-impact engineering solutions.",
      });

      if (reportData?.data?._id) {
        navigate(`/report/${reportData.data._id}`);
      } else {
        throw new Error("Invalid response format received from generation service.");
      }
    } catch (err) {
      console.error("Report generation failure:", err);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsAnalyzing(false);

      const serverMsg = err.response?.data?.message || err.message;
      if (err.response?.status === 400 && serverMsg?.toLowerCase().includes("10 pages")) {
        setErrorMessage(
          serverMsg || "Resume exceeds maximum allowed length of 10 pages. Please upload a concise 1-2 page resume."
        );
      } else if (err.response?.status === 429) {
        setErrorMessage(
          "Report generation limit reached (max 5 per 10 minutes). Please wait a few moments before trying again."
        );
      } else {
        setErrorMessage(serverMsg || "Failed to generate dossier. Please verify the resume PDF and try again.");
      }
    }
  }, [isValid, isAnalyzing, generateReport, resumeFile, jobDescription, selfDescription, navigate]);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] bg-grid-minimal font-studio">
      {/* ─── Minimalist Studio Header (Image 1 reference) ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-neutral-800/80 bg-[#09090b]/90 backdrop-blur-md px-6 md:px-12 flex items-center justify-between">
        <StudioLogo />

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8">
          <span className="font-mono-tech text-xs uppercase tracking-wider text-neutral-400">
            [ ARCHIVE ACTIVE ]
          </span>
          <a
            href="#past-dossiers"
            className="text-xs text-neutral-300 hover:text-white transition-colors"
          >
            Dossier History ({pastReports.length})
          </a>
          <button
            onClick={() => handleLogout()}
            className="text-xs uppercase font-mono-tech tracking-wider text-neutral-400 hover:text-white px-3 py-1.5 rounded-full border border-neutral-800 hover:border-neutral-600 transition-colors"
          >
            Sign Out
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 text-neutral-400 hover:text-white"
          aria-label="Open Navigation Menu"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      {/* ─── Mobile Drawer Menu (Directly Matching Reference Image 1) ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm md:hidden flex justify-end">
          <div className="w-[85%] max-w-sm h-full bg-[#111113] border-l border-neutral-800 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-8 border-b border-neutral-800">
                <StudioLogo />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Minimal drawer list items with chevron > */}
              <div className="mt-8 space-y-6">
                <a
                  href="#new-dossier"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-base font-studio text-white py-2 border-b border-neutral-800/40"
                >
                  <span>New Dossier</span>
                  <span className="text-neutral-500 font-mono-tech text-sm">›</span>
                </a>
                <a
                  href="#past-dossiers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-base font-studio text-white py-2 border-b border-neutral-800/40"
                >
                  <span>Dossier Archive</span>
                  <span className="text-neutral-500 font-mono-tech text-sm">
                    {pastReports.length} ›
                  </span>
                </a>
                <div className="pt-4">
                  <span className="font-mono-tech text-[10px] uppercase text-neutral-500 tracking-widest block mb-2">
                    CANDIDATE
                  </span>
                  <p className="text-sm text-neutral-300 font-medium">
                    {user?.name || user?.email || "Verified Candidate"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full h-12 bg-white text-black rounded-full font-studio text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* ─── Main Content Container ─── */}
      <main id="new-dossier" className="pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Editorial Heading */}
        <div className="mb-12 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-neutral-400">
              [ INGESTION PROTOCOL // RE-ENGINEERING RESUME ]
            </span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-white font-bold leading-[1.08] tracking-tight">
            Architect Your Dossier.
          </h1>
          <p className="font-studio text-sm sm:text-base text-neutral-300 mt-4 leading-relaxed font-normal">
            Deconstruct technical requirements against candidate experience. Computes weighted match rubrics, pinpoints prioritized skill gaps, and synthesizes 5 technical and 5 STAR behavioral challenges.
          </p>
        </div>

        {/* Prominent Alert Banner */}
        {errorMessage && (
          <div className="mb-8 p-5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-studio flex items-start gap-3.5 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-red-400 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold uppercase tracking-wider text-[11px] text-red-300 mb-0.5">
                Ingestion Verification Alert
              </p>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* ─── Two-Column Workstation Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Job Description Ingestion (7 cols) */}
          <div className="lg:col-span-7 editorial-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[500px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block">
                    STEP 01
                  </span>
                  <h2 className="font-studio text-base font-semibold text-white">
                    Target Job Description
                  </h2>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono-tech text-xs tracking-wider ${
                      jobDescription.length >= 50 ? "text-emerald-400" : "text-neutral-500"
                    }`}
                  >
                    {jobDescription.length} / 50 MIN
                  </span>
                </div>
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description, technical requirements, core competencies, and responsibilities here..."
                className="w-full h-80 p-4 rounded-xl bg-[#09090b] border border-neutral-800 text-neutral-200 placeholder-neutral-600 font-studio text-sm leading-relaxed resize-none focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 font-mono-tech">
              <span>FORMAT: PLAIN TEXT</span>
              <span>SYNTACTIC EXTRACTOR ACTIVE</span>
            </div>
          </div>

          {/* Right Column: Resume & Self-Description & Submit (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Resume File Dropzone */}
            <div className="editorial-card rounded-2xl p-6 sm:p-7">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block">
                    STEP 02
                  </span>
                  <h3 className="font-studio text-base font-semibold text-white">
                    Candidate Resume
                  </h3>
                </div>
                <span className="font-mono-tech text-[10px] uppercase tracking-wider text-neutral-500">
                  PDF 1.4+ (≤ 10 PGS)
                </span>
              </div>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById("resume-input-file")?.click()}
                className={`border border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  resumeFile
                    ? "border-emerald-500/40 bg-emerald-950/10"
                    : "border-neutral-800 hover:border-neutral-600 bg-[#09090b]/50 hover:bg-[#09090b]"
                }`}
              >
                <input
                  id="resume-input-file"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => handleResumeSelect(e.target.files[0])}
                />

                <div className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center mx-auto mb-3 bg-[#111113]">
                  {resumeFile ? (
                    <span className="text-emerald-400 text-lg">✓</span>
                  ) : (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#a1a1aa">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  )}
                </div>

                {resumeFile ? (
                  <div>
                    <p className="font-studio text-xs font-semibold text-white truncate max-w-[260px] mx-auto">
                      {resumeFile.name}
                    </p>
                    <p className="font-mono-tech text-[11px] text-neutral-500 mt-1">
                      {(resumeFile.size / 1024).toFixed(0)} KB // IN-MEMORY BUFFER READY
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-studio text-xs font-medium text-neutral-300">
                      Drop resume PDF here or click to browse
                    </p>
                    <p className="font-mono-tech text-[10px] text-neutral-500 mt-1">
                      Max 5MB • Max 10 Pages • In-Memory Processing
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Candidate Persona Context */}
            <div className="editorial-card rounded-2xl p-6 sm:p-7">
              <div className="mb-3">
                <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block">
                  STEP 03 (OPTIONAL)
                </span>
                <h3 className="font-studio text-sm font-semibold text-white">
                  Candidate Persona Context
                </h3>
              </div>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder="Briefly state target seniority, key achievements, or specific technical domains you wish to emphasize..."
                rows={3}
                className="w-full p-3.5 rounded-xl bg-[#09090b] border border-neutral-800 text-neutral-200 placeholder-neutral-600 font-studio text-xs leading-relaxed resize-none focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Launch Action */}
            <div className="editorial-card rounded-2xl p-6">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!isValid || isAnalyzing}
                className="w-full h-14 bg-white text-black hover:bg-neutral-200 disabled:opacity-30 disabled:hover:bg-white rounded-full font-studio text-xs uppercase tracking-widest font-bold transition-all duration-200 flex items-center justify-center gap-3 group"
              >
                <span>Generate Intelligence Dossier</span>
                <span className="transform group-hover:translate-x-1.5 transition-transform duration-200">
                  →
                </span>
              </button>

              <div className="mt-3 text-center">
                <span className="font-mono-tech text-[10px] uppercase text-neutral-500">
                  {isValid
                    ? "STATUS: READY FOR INFERENCE"
                    : !resumeFile
                    ? "STATUS: AWAITING RESUME PDF"
                    : "STATUS: JD REQUIRES 50+ CHARACTERS"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Dossier History Section (Archival Feed) ─── */}
        <section id="past-dossiers" className="mt-24 pt-12 border-t border-neutral-800/80">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-mono-tech text-xs uppercase tracking-widest text-neutral-500 block mb-1">
                ARCHIVE RECORD
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                Past Preparation Dossiers
              </h2>
            </div>
            <span className="font-mono-tech text-xs text-neutral-400">
              {pastReports.length} REPORTS LOGGED
            </span>
          </div>

          {reportsLoading ? (
            <div className="py-12 text-center text-neutral-500 font-mono-tech text-xs">
              Loading Archive Feed...
            </div>
          ) : pastReports.length === 0 ? (
            <div className="editorial-card rounded-2xl p-12 text-center">
              <p className="font-editorial text-xl text-neutral-300 italic mb-2">
                No archived dossiers found.
              </p>
              <p className="font-studio text-xs text-neutral-500">
                Upload your first resume and target JD above to generate a comprehensive strategy.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastReports.map((report) => (
                <div
                  key={report._id}
                  onClick={() => navigate(`/report/${report._id}`)}
                  className="editorial-card rounded-2xl p-6 cursor-pointer group flex flex-col justify-between min-h-[170px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono-tech text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white font-semibold">
                        {report.matchScore}% MATCH
                      </span>
                      <span className="font-mono-tech text-[10px] text-neutral-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-studio text-sm font-semibold text-white group-hover:text-neutral-300 transition-colors line-clamp-2">
                      {report.jobTitle || "Engineering Candidate Dossier"}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs font-studio text-neutral-400 group-hover:text-white transition-colors">
                    <span>Inspect Strategy</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ─── Editorial Analysis Modal / Overlay ─── */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-14 h-14 border border-neutral-800 border-t-white rounded-full animate-spin mb-6" />

          <span className="font-mono-tech text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-3">
            [ INFERENCE IN PROGRESS ]
          </span>

          <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal mb-6">
            Synthesizing Dossier Strategy
          </h2>

          <div className="space-y-2 max-w-sm font-mono-tech text-xs text-neutral-400 text-left">
            <div className={`flex items-center gap-2 ${analysisStep >= 1 ? "text-white" : "opacity-40"}`}>
              <span>{analysisStep >= 1 ? "✓" : "○"}</span>
              <span>01 // Parsing in-memory PDF buffer</span>
            </div>
            <div className={`flex items-center gap-2 ${analysisStep >= 2 ? "text-white" : "opacity-40"}`}>
              <span>{analysisStep >= 2 ? "✓" : "○"}</span>
              <span>02 // Correlating technical skill alignment</span>
            </div>
            <div className={`flex items-center gap-2 ${analysisStep >= 3 ? "text-white" : "opacity-40"}`}>
              <span>{analysisStep >= 3 ? "✓" : "○"}</span>
              <span>03 // Synthesizing questions & 7-day roadmap</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
