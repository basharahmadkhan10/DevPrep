/** @format */

import React, { useState, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";

// ─── Animated Background ────────────────────────────────────────────────────

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

// ─── Score Ring ──────────────────────────────────────────────────────────────

const ScoreRing = ({ score }) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 160 160"
      className="flex-shrink-0"
      style={{ maxWidth: "100%", height: "auto" }}>
      <circle
        cx="80"
        cy="80"
        r={radius}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="6"
        fill="none"
      />
      <circle
        cx="80"
        cy="80"
        r={radius}
        stroke="url(#scoreGrad)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 80 80)"
        className="transition-all duration-1000 ease-out"
      />
      <defs>
        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c8923a" />
          <stop offset="100%" stopColor="#b85c6e" />
        </linearGradient>
      </defs>
      <text
        x="80"
        y="76"
        textAnchor="middle"
        fill="#f0ece4"
        fontSize="28"
        fontWeight="300"
        fontFamily="'DM Mono', monospace">
        {score}%
      </text>
      <text
        x="80"
        y="96"
        textAnchor="middle"
        fill="#5a5650"
        fontSize="10"
        fontFamily="'DM Mono', monospace"
        letterSpacing="1">
        MATCH
      </text>
    </svg>
  );
};

// ─── Navigation Bar - Mobile Responsive ──────────────────────────────────────

const NavigationBar = ({ activeTab, onTabChange, counts, onBack }) => {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "technical", label: "Technical", count: counts.technical },
    { id: "behavioral", label: "Behavioral", count: counts.behavioral },
    { id: "gaps", label: "Gaps", count: counts.skillGaps },
    { id: "plan", label: "Plan", count: counts.plan },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        height: "60px",
        background: "rgba(14,14,14,0.95)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(255,255,255,0.08)",
      }}>
      <div
        className="mx-auto flex items-center justify-between gap-2 h-full"
        style={{ maxWidth: "960px", padding: "0 12px" }}>
        <button
          onClick={onBack}
          className="flex items-center gap-1 flex-shrink-0 transition-colors duration-200"
          style={{
            fontSize: "13px",
            fontWeight: 400,
            color: "#8a8680",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 8px",
            borderRadius: "6px",
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
          <span className="back-text" style={{ fontSize: "12px" }}>
            Back
          </span>
        </button>

        <div
          className="flex items-center gap-1 overflow-x-auto"
          style={{ scrollbarWidth: "none", flex: 1, justifyContent: "center" }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                style={{
                  position: "relative",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 400,
                  color: isActive ? "#f0ece4" : "#5a5650",
                  background: isActive ? "rgba(255,255,255,0.07)" : "none",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "all 0.2s",
                }}>
                <span className="tab-label">{tab.label}</span>
                <span className="tab-label-short" style={{ display: "none" }}>
                  {tab.label.charAt(0)}
                </span>

                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontFamily: "'DM Mono', monospace",
                      padding: "1px 5px",
                      borderRadius: "3px",
                      color: isActive ? "#c8923a" : "#5a5650",
                      background:
                        isActive ?
                          "rgba(200,146,58,0.12)"
                        : "rgba(255,255,255,0.06)",
                    }}>
                    {tab.count}
                  </span>
                )}

                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-1px",
                      left: "8px",
                      right: "8px",
                      height: "1px",
                      background: "#c8923a",
                      borderRadius: "1px",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div style={{ width: "50px", flexShrink: 0 }} />
      </div>
    </nav>
  );
};

// ─── Page Header - Responsive ────────────────────────────────────────────────

const PAGE_META = {
  overview: {
    title: "Overview",
    description: "Your interview readiness at a glance",
  },
  technical: {
    title: "Technical",
    description: "Tailored to the job requirements and your skills",
  },
  behavioral: {
    title: "Behavioral",
    description: "Situational and competency-based questions",
  },
  gaps: {
    title: "Skill gaps",
    description: "Gaps detected against job requirements",
  },
  plan: {
    title: "Preparation",
    description: "Structured roadmap to cover gaps",
  },
};

const PageHeader = ({ activeTab }) => {
  const meta = PAGE_META[activeTab] || PAGE_META.overview;
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        paddingBottom: "16px",
        marginBottom: "20px",
      }}>
      <h2
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "24px",
          fontWeight: 400,
          fontStyle: "italic",
          color: "#f0ece4",
          letterSpacing: "-0.3px",
          marginBottom: "4px",
          lineHeight: 1.2,
        }}>
        {meta.title}
      </h2>
      <p style={{ fontSize: "12px", color: "#5a5650", fontWeight: 300 }}>
        {meta.description}
      </p>
    </div>
  );
};

// ─── Overview Tab - Responsive ───────────────────────────────────────────────

const OverviewTab = ({ reportData }) => {
  const score = reportData.matchScore;
  const readiness =
    score >= 70 ? "strong alignment — focus on identified gaps"
    : score >= 50 ? "moderate alignment. Prioritise skill gaps below"
    : "significant gaps detected. Review prep plan carefully";

  const stats = [
    {
      label: "Technical",
      value: reportData.technicalQuestion.length,
      unit: "questions",
      color: "#3a9e8a",
      pct: Math.min(100, reportData.technicalQuestion.length * 20),
    },
    {
      label: "Behavioral",
      value: reportData.behavioralQuestion.length,
      unit: "questions",
      color: "#c8923a",
      pct: Math.min(100, reportData.behavioralQuestion.length * 20),
    },
    {
      label: "Skill gaps",
      value: reportData.skillGaps.length,
      unit: "areas",
      color: "#b85c6e",
      pct: Math.min(100, reportData.skillGaps.length * 33),
    },
    {
      label: "Study plan",
      value: reportData.preprationPlan.length,
      unit: "days",
      color: "#7a7060",
      pct: Math.min(100, reportData.preprationPlan.length * 25),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Hero - Responsive */}
      <div
        className="overview-hero"
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "24px",
          alignItems: "center",
          padding: "24px",
          borderRadius: "12px",
          background: "#161616",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
        <ScoreRing score={score} />
        <div>
          <h3
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "18px",
              fontWeight: 400,
              color: "#f0ece4",
              marginBottom: "8px",
              lineHeight: 1.3,
            }}>
            Interview readiness
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "#8a8680",
              lineHeight: 1.6,
              fontWeight: 300,
            }}>
            {score}% match - {readiness}
          </p>
        </div>
      </div>

      {/* Stats grid - Responsive */}
      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
        }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              padding: "16px",
              borderRadius: "10px",
              background: "#161616",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
            <div
              style={{
                fontSize: "10px",
                fontFamily: "'DM Mono', monospace",
                color: "#5a5650",
                letterSpacing: "0.08em",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}>
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: s.color,
                }}
              />
              {s.label}
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 300,
                color: "#f0ece4",
                fontFamily: "'DM Mono', monospace",
              }}>
              {s.value}
            </div>
            <div
              style={{ fontSize: "11px", color: "#5a5650", marginTop: "2px" }}>
              {s.unit}
            </div>
            <div
              style={{
                height: "2px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "2px",
                marginTop: "12px",
                overflow: "hidden",
              }}>
              <div
                style={{
                  height: "100%",
                  width: `${s.pct}%`,
                  background: s.color,
                  borderRadius: "2px",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Question Card - Responsive ──────────────────────────────────────────────

const QuestionCard = ({ item, index, category }) => {
  const isTech = category === "Technical";
  const badgeStyle =
    isTech ?
      { background: "rgba(58,158,138,0.12)", color: "#3a9e8a" }
    : { background: "rgba(200,146,58,0.12)", color: "#c8923a" };

  return (
    <div
      className="question-card"
      style={{
        padding: "16px",
        borderRadius: "10px",
        background: "#161616",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        gap: "12px",
      }}>
      <div
        style={{
          flexShrink: 0,
          width: "24px",
          height: "24px",
          borderRadius: "6px",
          background: "rgba(255,255,255,0.05)",
          fontSize: "11px",
          fontFamily: "'DM Mono', monospace",
          color: "#5a5650",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        {index + 1}
      </div>

      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 400,
            color: "#f0ece4",
            marginBottom: "8px",
            lineHeight: 1.5,
          }}>
          {item.question}
        </p>
        <span
          style={{
            display: "inline-block",
            fontSize: "10px",
            fontFamily: "'DM Mono', monospace",
            padding: "2px 8px",
            borderRadius: "4px",
            marginBottom: "8px",
            ...badgeStyle,
          }}>
          {item.intention}
        </span>
        <p
          style={{
            fontSize: "12px",
            color: "#8a8680",
            lineHeight: 1.6,
            fontWeight: 300,
          }}>
          {item.answer}
        </p>
      </div>
    </div>
  );
};

// ─── Skill Gap Item - Responsive ─────────────────────────────────────────────

const SkillGapItem = ({ item }) => {
  const severityMap = {
    high: { bg: "rgba(184,92,110,0.12)", text: "#b85c6e", label: "Critical" },
    medium: {
      bg: "rgba(200,146,58,0.12)",
      text: "#c8923a",
      label: "Important",
    },
    low: { bg: "rgba(58,158,138,0.12)", text: "#3a9e8a", label: "Nice" },
  };
  const s = severityMap[item.severity] || {
    bg: "rgba(255,255,255,0.06)",
    text: "#8a8680",
    label: item.severity,
  };

  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: "8px",
        background: "#161616",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        flexWrap: "wrap",
      }}>
      <span
        style={{
          fontSize: "13px",
          color: "#f0ece4",
          fontWeight: 400,
          flex: 1,
        }}>
        {item.skills}
      </span>
      <span
        style={{
          fontSize: "10px",
          fontFamily: "'DM Mono', monospace",
          padding: "2px 8px",
          borderRadius: "4px",
          background: s.bg,
          color: s.text,
        }}>
        {s.label}
      </span>
    </div>
  );
};

// ─── Prep Plan Card - Responsive ─────────────────────────────────────────────

const PrepPlanCard = ({ item, index }) => (
  <div
    className="prep-plan-card"
    style={{
      padding: "16px",
      borderRadius: "10px",
      background: "#161616",
      border: "1px solid rgba(255,255,255,0.08)",
    }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "12px",
        flexWrap: "wrap",
        gap: "8px",
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "5px",
            background: "rgba(200,146,58,0.12)",
            color: "#c8923a",
            fontSize: "11px",
            fontFamily: "'DM Mono', monospace",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          {index + 1}
        </div>
        <span style={{ fontSize: "14px", fontWeight: 400, color: "#f0ece4" }}>
          {item.day}
        </span>
      </div>
      <span
        style={{
          fontSize: "10px",
          fontFamily: "'DM Mono', monospace",
          color: "#7a7060",
          background: "rgba(122,112,96,0.12)",
          padding: "2px 8px",
          borderRadius: "4px",
        }}>
        {item.time}
      </span>
    </div>

    <div
      className="prep-plan-tasks"
      style={{
        paddingLeft: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}>
      {item.task.map((t, i) => (
        <div
          key={i}
          style={{
            fontSize: "12px",
            color: "#8a8680",
            fontWeight: 300,
            display: "flex",
            gap: "8px",
            lineHeight: 1.5,
          }}>
          <span style={{ color: "#c8923a", flexShrink: 0 }}>▹</span>
          <span>{t}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── Empty State - Responsive ─────────────────────────────────────────────────

const EmptyState = ({ onBack }) => (
  <div style={{ textAlign: "center", padding: "40px 20px" }}>
    <div
      style={{
        width: "48px",
        height: "48px",
        margin: "0 auto 16px",
        borderRadius: "12px",
        background: "#161616",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="#5a5650"
        strokeWidth="1.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <h3
      style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: "20px",
        fontStyle: "italic",
        color: "#f0ece4",
        marginBottom: "6px",
      }}>
      No report data
    </h3>
    <p style={{ fontSize: "12px", color: "#5a5650", fontWeight: 300 }}>
      Generate a report first by analysing your resume.
    </p>
    <button
      onClick={onBack}
      style={{
        marginTop: "20px",
        padding: "8px 20px",
        borderRadius: "8px",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "#f0ece4",
        fontSize: "13px",
        cursor: "pointer",
      }}>
      Go to Dashboard
    </button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

function InterviewReport() {
  const navigate = useNavigate();
  const { interviewReport } = useInterview();
  const [activeTab, setActiveTab] = useState("overview");

  const reportData = useMemo(
    () =>
      interviewReport?.data || {
        matchScore: 0,
        technicalQuestion: [],
        behavioralQuestion: [],
        skillGaps: [],
        preprationPlan: [],
      },
    [interviewReport?.data],
  );

  const counts = {
    technical: reportData.technicalQuestion.length,
    behavioral: reportData.behavioralQuestion.length,
    skillGaps: reportData.skillGaps.length,
    plan: reportData.preprationPlan.length,
  };

  const isEmpty = Object.values(counts).every((c) => c === 0);

  const renderTabContent = () => {
    if (isEmpty) return <EmptyState onBack={() => navigate("/dashboard")} />;

    switch (activeTab) {
      case "overview":
        return <OverviewTab reportData={reportData} />;
      case "technical":
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {reportData.technicalQuestion.map((item, i) => (
              <QuestionCard
                key={item._id || i}
                item={item}
                index={i}
                category="Technical"
              />
            ))}
          </div>
        );
      case "behavioral":
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {reportData.behavioralQuestion.map((item, i) => (
              <QuestionCard
                key={item._id || i}
                item={item}
                index={i}
                category="Behavioral"
              />
            ))}
          </div>
        );
      case "gaps":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {reportData.skillGaps.map((item, i) => (
              <SkillGapItem key={item._id || i} item={item} />
            ))}
          </div>
        );
      case "plan":
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {reportData.preprationPlan.map((item, i) => (
              <PrepPlanCard key={item._id || i} item={item} index={i} />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

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
          position: "relative",
          overflowX: "hidden",
        }}>
        <AnimatedBackground />
        <NavigationBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
          onBack={() => navigate("/dashboard")}
        />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: "960px",
            margin: "0 auto",
            padding: "80px 16px 40px",
          }}>
          {!isEmpty && <PageHeader activeTab={activeTab} />}
          {renderTabContent()}
        </div>

        <style>{`
          * { box-sizing: border-box; }
          
          /* Mobile Styles */
          @media (max-width: 640px) {
            .overview-hero {
              grid-template-columns: 1fr !important;
              text-align: center;
              padding: 20px !important;
            }
            
            .stats-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 8px !important;
            }
            
            .question-card {
              flex-direction: column !important;
              gap: 10px !important;
            }
            
            .prep-plan-tasks {
              padding-left: 20px !important;
            }
            
            .tab-label {
              display: none !important;
            }
            
            .tab-label-short {
              display: inline !important;
            }
            
            .back-text {
              display: none !important;
            }
          }
          
          /* Tablet Styles */
          @media (min-width: 641px) and (max-width: 768px) {
            .stats-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            
            .tab-label {
              display: inline !important;
            }
            
            .tab-label-short {
              display: none !important;
            }
          }
          
          /* Desktop Styles */
          @media (min-width: 769px) {
            .stats-grid {
              grid-template-columns: repeat(4, 1fr) !important;
            }
            
            .tab-label {
              display: inline !important;
            }
            
            .tab-label-short {
              display: none !important;
            }
            
            .back-text {
              display: inline !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}

export default InterviewReport;
