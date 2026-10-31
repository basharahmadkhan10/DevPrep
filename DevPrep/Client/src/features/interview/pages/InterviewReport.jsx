/** @format */

import React, { useState, useEffect, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generateInterviewReportById } from "../services/interview.api.js";

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

export default function InterviewReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedIndex, setExpandedIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await generateInterviewReportById({ id });
        if (isMounted) {
          if (response?.data) {
            setReport(response.data);
          } else {
            setError("The requested dossier report could not be located.");
          }
        }
      } catch (err) {
        console.error("Failed to load report dossier:", err);
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to load candidate dossier.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReport();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center select-none font-studio">
        <div className="w-10 h-10 border border-neutral-700 border-t-white rounded-full animate-spin mb-4" />
        <h2 className="font-editorial text-2xl text-white italic">
          Decoding Candidate Dossier...
        </h2>
        <p className="font-mono-tech text-xs uppercase tracking-widest text-neutral-500 mt-2">
          Retrieving parsed questions and preparation roadmap
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center font-studio">
        <div className="editorial-card p-8 rounded-2xl max-w-md w-full">
          <h2 className="font-editorial text-2xl text-white mb-2">
            Dossier Inaccessible
          </h2>
          <p className="text-xs text-neutral-400 mb-6 font-light">
            {error || "Unable to retrieve the requested preparation dossier."}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full h-11 bg-white text-black rounded-full font-studio text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const {
    jobTitle = "Engineering Candidate",
    matchScore = 0,
    technicalQuestion = [],
    behavioralQuestion = [],
    skillGaps = [],
    preprationPlan = [],
  } = report;

  const tabs = [
    { id: "overview", label: "Executive Summary" },
    { id: "technical", label: `Technical (${technicalQuestion.length})` },
    { id: "behavioral", label: `Behavioral (${behavioralQuestion.length})` },
    { id: "gaps", label: `Skill Gaps (${skillGaps.length})` },
    { id: "plan", label: `7-Day Plan (${preprationPlan.length})` },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] bg-grid-minimal font-studio pb-24">
      {/* ─── Fixed Header ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-neutral-800/80 bg-[#09090b]/90 backdrop-blur-md px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-xs font-mono-tech text-neutral-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span className="hidden sm:inline">DASHBOARD</span>
          </button>
          <div className="h-4 w-[1px] bg-neutral-800 hidden sm:block" />
          <StudioLogo />
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono-tech text-xs px-3 py-1 rounded-full bg-white text-black font-bold">
            {matchScore}% MATCH
          </span>
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex text-xs font-mono-tech uppercase text-neutral-400 hover:text-white px-3 py-1 rounded-full border border-neutral-800 hover:border-neutral-600 transition-colors"
          >
            Print Dossier
          </button>
        </div>
      </header>

      {/* ─── Hero Dossier Header ─── */}
      <div className="pt-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="border-b border-neutral-800/80 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono-tech text-[11px] uppercase tracking-widest text-neutral-400">
                [ EVALUATION REPORT // {id.slice(-6).toUpperCase()} ]
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight">
              {jobTitle}
            </h1>
            <p className="font-studio text-xs sm:text-sm text-neutral-400 mt-2 font-light">
              Synthesized by Groq Llama-3.3-70B • Role Alignment Analysis
            </p>
          </div>

          {/* Large Editorial Score Display */}
          <div className="editorial-card rounded-2xl px-6 py-4 flex items-center gap-5 flex-shrink-0 self-start md:self-auto">
            <div>
              <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block">
                COMPUTED MATCH
              </span>
              <span className="font-editorial text-3xl sm:text-4xl text-white font-normal">
                {matchScore}%
              </span>
            </div>
            <div className="h-8 w-[1px] bg-neutral-800" />
            <div>
              <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block">
                READINESS LEVEL
              </span>
              <span className="font-studio text-xs uppercase font-semibold text-neutral-200">
                {matchScore >= 85
                  ? "Strong Hire"
                  : matchScore >= 70
                  ? "Competitive"
                  : matchScore >= 50
                  ? "Moderate Gap"
                  : "Critical Gaps"}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Clean Monochrome Tabs ─── */}
        <div className="flex items-center gap-2 overflow-x-auto py-6 border-b border-neutral-800/80 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setExpandedIndex(0);
              }}
              className={`px-4 py-2 rounded-full font-studio text-xs whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-800/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Tab Content Panels ─── */}
        <div className="mt-8">
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Metric Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="editorial-card rounded-2xl p-6">
                  <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block mb-1">
                    RUBRIC 01 (40%)
                  </span>
                  <p className="font-studio text-sm font-semibold text-white">Technical Match</p>
                  <p className="font-studio text-xs text-neutral-400 mt-2 font-light">
                    Direct mapping of skills against required core tech stack.
                  </p>
                </div>
                <div className="editorial-card rounded-2xl p-6">
                  <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block mb-1">
                    RUBRIC 02 (25%)
                  </span>
                  <p className="font-studio text-sm font-semibold text-white">Experience Weight</p>
                  <p className="font-studio text-xs text-neutral-400 mt-2 font-light">
                    Depth of tenure, architecture responsibilities, and scale.
                  </p>
                </div>
                <div className="editorial-card rounded-2xl p-6">
                  <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block mb-1">
                    RUBRIC 03 (20%)
                  </span>
                  <p className="font-studio text-sm font-semibold text-white">Self-Description</p>
                  <p className="font-studio text-xs text-neutral-400 mt-2 font-light">
                    Role alignment consistency and authenticity verification.
                  </p>
                </div>
                <div className="editorial-card rounded-2xl p-6">
                  <span className="font-mono-tech text-[10px] uppercase text-neutral-500 block mb-1">
                    RUBRIC 04 (15%)
                  </span>
                  <p className="font-studio text-sm font-semibold text-white">Leadership & STAR</p>
                  <p className="font-studio text-xs text-neutral-400 mt-2 font-light">
                    Demonstrated behavioral maturity and conflict resolution.
                  </p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Critical Gaps Preview */}
                <div className="editorial-card rounded-2xl p-7">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-studio text-base font-semibold text-white">
                      Identified Skill Gaps
                    </h3>
                    <button
                      onClick={() => setActiveTab("gaps")}
                      className="font-mono-tech text-xs text-neutral-400 hover:text-white"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {skillGaps.slice(0, 4).map((gap, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-[#09090b] border border-neutral-800 flex items-center justify-between"
                      >
                        <span className="font-studio text-xs font-medium text-neutral-200">
                          {gap.skills}
                        </span>
                        <span
                          className={`font-mono-tech text-[10px] uppercase px-2 py-0.5 rounded ${
                            gap.severity === "high"
                              ? "bg-red-950/60 border border-red-500/30 text-red-300"
                              : gap.severity === "medium"
                              ? "bg-neutral-800 text-neutral-300"
                              : "bg-neutral-900 text-neutral-500"
                          }`}
                        >
                          {gap.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7-Day Strategy Preview */}
                <div className="editorial-card rounded-2xl p-7">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-studio text-base font-semibold text-white">
                      Preparation Trajectory
                    </h3>
                    <button
                      onClick={() => setActiveTab("plan")}
                      className="font-mono-tech text-xs text-neutral-400 hover:text-white"
                    >
                      View Plan →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {preprationPlan.slice(0, 3).map((p, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-[#09090b] border border-neutral-800 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-mono-tech text-[10px] text-neutral-500 block">
                            {p.day} • {p.time}
                          </span>
                          <span className="font-studio text-xs font-medium text-neutral-200 line-clamp-1 mt-0.5">
                            {p.task?.[0] || "Foundational review"}
                          </span>
                        </div>
                        <span className="text-neutral-500 text-xs">→</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL QUESTIONS */}
          {activeTab === "technical" && (
            <div className="space-y-4 max-w-4xl">
              <div className="mb-6">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-neutral-500 block">
                  TECHNICAL INTERROGATION
                </span>
                <h2 className="font-editorial text-2xl text-white">
                  5 Targeted Technical Questions
                </h2>
                <p className="font-studio text-xs text-neutral-400 mt-1 font-light">
                  Tailored specifically to uncover candidate depth and address identified gaps from the JD.
                </p>
              </div>

              {technicalQuestion.map((q, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div
                    key={idx}
                    className="editorial-card rounded-2xl p-6 transition-all duration-200"
                  >
                    <div
                      onClick={() => setExpandedIndex(isExpanded ? -1 : idx)}
                      className="flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <span className="font-mono-tech text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 font-bold flex-shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <div>
                          <h3 className="font-studio text-sm sm:text-base font-semibold text-white leading-snug">
                            {q.question}
                          </h3>
                          <p className="font-mono-tech text-[11px] text-neutral-400 mt-1.5">
                            INTENTION: {q.intention}
                          </p>
                        </div>
                      </div>
                      <span className="text-neutral-500 font-mono-tech text-sm mt-1">
                        {isExpanded ? "−" : "+"}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="mt-5 pt-5 border-t border-neutral-800/80">
                        <span className="font-mono-tech text-[10px] uppercase text-neutral-500 tracking-wider block mb-2">
                          RECOMMENDED TECHNICAL RESPONSE & ARCHITECTURE:
                        </span>
                        <div className="p-4 rounded-xl bg-[#09090b] border border-neutral-800/80 font-studio text-xs leading-relaxed text-neutral-300 whitespace-pre-wrap">
                          {q.answer}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: BEHAVIORAL QUESTIONS */}
          {activeTab === "behavioral" && (
            <div className="space-y-4 max-w-4xl">
              <div className="mb-6">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-neutral-500 block">
                  STAR METHODOLOGY
                </span>
                <h2 className="font-editorial text-2xl text-white">
                  5 Situational & Behavioral Scenarios
                </h2>
                <p className="font-studio text-xs text-neutral-400 mt-1 font-light">
                  Formulated to evaluate leadership without authority, technical conflict resolution, and execution under constraints.
                </p>
              </div>

              {behavioralQuestion.map((q, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div
                    key={idx}
                    className="editorial-card rounded-2xl p-6 transition-all duration-200"
                  >
                    <div
                      onClick={() => setExpandedIndex(isExpanded ? -1 : idx)}
                      className="flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <span className="font-mono-tech text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 font-bold flex-shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <div>
                          <h3 className="font-studio text-sm sm:text-base font-semibold text-white leading-snug">
                            {q.question}
                          </h3>
                          <p className="font-mono-tech text-[11px] text-neutral-400 mt-1.5">
                            CRITICAL FOCUS: {q.intention}
                          </p>
                        </div>
                      </div>
                      <span className="text-neutral-500 font-mono-tech text-sm mt-1">
                        {isExpanded ? "−" : "+"}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="mt-5 pt-5 border-t border-neutral-800/80">
                        <span className="font-mono-tech text-[10px] uppercase text-neutral-500 tracking-wider block mb-2">
                          EXEMPLARY STAR FRAMEWORK ANSWER:
                        </span>
                        <div className="p-4 rounded-xl bg-[#09090b] border border-neutral-800/80 font-studio text-xs leading-relaxed text-neutral-300 whitespace-pre-wrap">
                          {q.answer}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: SKILL GAPS */}
          {activeTab === "gaps" && (
            <div className="space-y-6 max-w-4xl">
              <div className="mb-6">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-neutral-500 block">
                  GAP DECONSTRUCTION
                </span>
                <h2 className="font-editorial text-2xl text-white">
                  Prioritized Skill Gaps
                </h2>
                <p className="font-studio text-xs text-neutral-400 mt-1 font-light">
                  Direct discrepancies between candidate resume competencies and job specifications.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillGaps.map((gap, i) => (
                  <div key={i} className="editorial-card rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono-tech text-[10px] uppercase text-neutral-500">
                          GAP {i + 1}
                        </span>
                        <span
                          className={`font-mono-tech text-[10px] uppercase px-2.5 py-0.5 rounded-full font-semibold ${
                            gap.severity === "high"
                              ? "bg-red-950/60 border border-red-500/30 text-red-300"
                              : gap.severity === "medium"
                              ? "bg-neutral-800 text-neutral-200"
                              : "bg-neutral-900 text-neutral-400"
                          }`}
                        >
                          {gap.severity} SEVERITY
                        </span>
                      </div>
                      <h4 className="font-studio text-base font-semibold text-white">
                        {gap.skills}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800/60 font-mono-tech text-[10px] text-neutral-400 uppercase">
                      Action: Integrated into 7-day preparation schedule
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: 7-DAY PREPARATION PLAN */}
          {activeTab === "plan" && (
            <div className="space-y-6 max-w-4xl">
              <div className="mb-6">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-neutral-500 block">
                  CHRONOLOGICAL EXECUTION
                </span>
                <h2 className="font-editorial text-2xl text-white">
                  7-Day Structured Strategy
                </h2>
                <p className="font-studio text-xs text-neutral-400 mt-1 font-light">
                  A high-efficiency roadmap calibrated to eliminate high-severity gaps and reinforce system design patterns.
                </p>
              </div>

              <div className="space-y-4">
                {preprationPlan.map((dayPlan, i) => (
                  <div key={i} className="editorial-card rounded-2xl p-6 sm:p-7">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800/80 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono-tech text-xs px-2.5 py-1 rounded bg-white text-black font-bold">
                          {dayPlan.day}
                        </span>
                        <span className="font-studio text-sm font-semibold text-white">
                          Target Objectives
                        </span>
                      </div>
                      <span className="font-mono-tech text-xs text-neutral-400">
                        TIME COMMITMENT: {dayPlan.time}
                      </span>
                    </div>

                    <ul className="space-y-2.5">
                      {dayPlan.task?.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-3 font-studio text-xs text-neutral-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 mt-1.5 flex-shrink-0" />
                          <span className="leading-relaxed">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
