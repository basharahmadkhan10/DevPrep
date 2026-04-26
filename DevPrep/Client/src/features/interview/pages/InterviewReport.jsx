/** @format */

import React, { useState, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";

// ─── Animated Background ────────────────────────────────────────────────────

const AnimatedBackground = memo(() => (
  <>
    {/* Noise texture via SVG filter */}
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.6,
      }}
    />
    {/* Amber radial vignette */}
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
    <svg width="160" height="160" viewBox="0 0 160 160" className="flex-shrink-0">
      <circle
        cx="80" cy="80" r={radius}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="6"
        fill="none"
      />
      <circle
        cx="80" cy="80" r={radius}
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
        x="80" y="76"
        textAnchor="middle"
        fill="#f0ece4"
        fontSize="28"
        fontWeight="300"
        fontFamily="'DM Mono', monospace"
      >
        {score}%
      </text>
      <text
        x="80" y="96"
        textAnchor="middle"
        fill="#5a5650"
        fontSize="10"
        fontFamily="'DM Mono', monospace"
        letterSpacing="1"
      >
        MATCH
      </text>
    </svg>
  );
};

// ─── Navigation Bar ──────────────────────────────────────────────────────────

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
        height: "64px",
        background: "rgba(14,14,14,0.85)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between gap-2 h-full"
        style={{ maxWidth: "960px", padding: "0 24px" }}
      >
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 flex-shrink-0 transition-colors duration-200"
          style={{
            fontSize: "13px",
            fontWeight: 400,
            color: "#8a8680",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 10px",
            borderRadius: "6px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#f0ece4";
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#8a8680";
            e.currentTarget.style.background = "none";
          }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        {/* Tabs */}
        <div
          className="flex items-center gap-3 overflow-x-auto"
          style={{ scrollbarWidth: "none", flex: 1, justifyContent: "center" }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                style={{
                  position: "relative",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: isActive ? "#f0ece4" : "#5a5650",
                  background: isActive ? "rgba(255,255,255,0.07)" : "none",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#8a8680";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#5a5650";
                    e.currentTarget.style.background = "none";
                  }
                }}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.charAt(0)}</span>

                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: "'DM Mono', monospace",
                      padding: "1px 6px",
                      borderRadius: "3px",
                      lineHeight: "1.6",
                      color: isActive ? "#c8923a" : "#5a5650",
                      background: isActive ? "rgba(200,146,58,0.12)" : "rgba(255,255,255,0.06)",
                    }}
                  >
                    {tab.count}
                  </span>
                )}

                {/* Active underline */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-1px",
                      left: "12px",
                      right: "12px",
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

        <div style={{ width: "80px", flexShrink: 0 }} />
      </div>
    </nav>
  );
};

// ─── Page Header (always visible below nav) ──────────────────────────────────

const PAGE_META = {
  overview:  { title: "Overview",             description: "Your interview readiness at a glance" },
  technical: { title: "Technical questions",  description: "Tailored to the job requirements and your skills on record" },
  behavioral:{ title: "Behavioral questions", description: "Situational and competency-based questions common to this role" },
  gaps:      { title: "Skill gap analysis",   description: "Gaps detected against the job description requirements" },
  plan:      { title: "Preparation plan",     description: "Structured roadmap to cover gaps before the interview" },
};

const PageHeader = ({ activeTab }) => {
  const meta = PAGE_META[activeTab] || PAGE_META.overview;
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        paddingBottom: "24px",
        marginBottom: "28px",
      }}
    >
      <h2
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "28px",
          fontWeight: 400,
          fontStyle: "italic",
          color: "#f0ece4",
          letterSpacing: "-0.3px",
          marginBottom: "6px",
          lineHeight: 1.2,
        }}
      >
        {meta.title}
      </h2>
      <p style={{ fontSize: "13px", color: "#5a5650", fontWeight: 300 }}>{meta.description}</p>
    </div>
  );
};

// ─── Overview Tab ────────────────────────────────────────────────────────────

const OverviewTab = ({ reportData }) => {
  const score = reportData.matchScore;
  const readiness =
    score >= 70
      ? "strong alignment with the role — focus on identified gaps to sharpen your edge."
      : score >= 50
      ? "moderate alignment. Prioritise the skill gaps below to improve your standing."
      : "significant gaps detected. Review the preparation plan carefully before the interview.";

  const stats = [
    {
      label: "Technical",
      value: reportData.technicalQuestion.length,
      unit: "questions prepared",
      color: "#3a9e8a",
      dimColor: "rgba(58,158,138,0.12)",
      pct: Math.min(100, reportData.technicalQuestion.length * 20),
    },
    {
      label: "Behavioral",
      value: reportData.behavioralQuestion.length,
      unit: "questions prepared",
      color: "#c8923a",
      dimColor: "rgba(200,146,58,0.12)",
      pct: Math.min(100, reportData.behavioralQuestion.length * 20),
    },
    {
      label: "Skill gaps",
      value: reportData.skillGaps.length,
      unit: "areas to address",
      color: "#b85c6e",
      dimColor: "rgba(184,92,110,0.12)",
      pct: Math.min(100, reportData.skillGaps.length * 33),
    },
    {
      label: "Study plan",
      value: reportData.preprationPlan.length,
      unit: "days structured",
      color: "#7a7060",
      dimColor: "rgba(122,112,96,0.12)",
      pct: Math.min(100, reportData.preprationPlan.length * 25),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Hero */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "40px",
          alignItems: "center",
          padding: "36px",
          borderRadius: "12px",
          background: "#161616",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        className="overview-hero"
      >
        <ScoreRing score={score} />
        <div>
          <h3
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "22px",
              fontWeight: 400,
              color: "#f0ece4",
              marginBottom: "10px",
              lineHeight: 1.3,
            }}
          >
            Interview readiness assessment
          </h3>
          <p style={{ fontSize: "14px", color: "#8a8680", lineHeight: 1.7, fontWeight: 300 }}>
            Based on your resume and the job requirements, a {score}% match score indicates {readiness}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              padding: "20px 22px",
              borderRadius: "10px",
              background: "#161616",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
            }
          >
            <div
              style={{
                fontSize: "11px",
                fontFamily: "'DM Mono', monospace",
                color: "#5a5650",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: s.color,
                  flexShrink: 0,
                }}
              />
              {s.label}
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 300,
                color: "#f0ece4",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: "13px", color: "#5a5650", marginTop: "2px", fontWeight: 300 }}>
              {s.unit}
            </div>
            <div
              style={{
                height: "2px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "2px",
                marginTop: "16px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${s.pct}%`,
                  background: s.color,
                  borderRadius: "2px",
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Question Card ────────────────────────────────────────────────────────────

const QuestionCard = ({ item, index, category }) => {
  const isTech = category === "Technical";
  const badgeStyle = isTech
    ? { background: "rgba(58,158,138,0.12)", color: "#3a9e8a" }
    : { background: "rgba(200,146,58,0.12)", color: "#c8923a" };

  return (
    <div
      style={{
        padding: "22px",
        borderRadius: "10px",
        background: "#161616",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        gap: "18px",
        transition: "background 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1e1e1e";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#161616";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      {/* Number */}
      <div
        style={{
          flexShrink: 0,
          width: "28px",
          height: "28px",
          borderRadius: "6px",
          background: "rgba(255,255,255,0.05)",
          fontSize: "12px",
          fontFamily: "'DM Mono', monospace",
          color: "#5a5650",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {index + 1}
      </div>

      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: "15px",
            fontWeight: 400,
            color: "#f0ece4",
            marginBottom: "10px",
            lineHeight: 1.55,
          }}
        >
          {item.question}
        </p>
        <span
          style={{
            display: "inline-block",
            fontSize: "11px",
            fontFamily: "'DM Mono', monospace",
            padding: "3px 10px",
            borderRadius: "4px",
            marginBottom: "10px",
            ...badgeStyle,
          }}
        >
          {item.intention}
        </span>
        <p style={{ fontSize: "13px", color: "#8a8680", lineHeight: 1.7, fontWeight: 300 }}>
          {item.answer}
        </p>
      </div>
    </div>
  );
};

// ─── Skill Gap Item ───────────────────────────────────────────────────────────

const SkillGapItem = ({ item }) => {
  const severityMap = {
    high: { bg: "rgba(184,92,110,0.12)", text: "#b85c6e", label: "Critical" },
    medium: { bg: "rgba(200,146,58,0.12)", text: "#c8923a", label: "Important" },
    low: { bg: "rgba(58,158,138,0.12)", text: "#3a9e8a", label: "Nice to have" },
  };
  const s = severityMap[item.severity] || {
    bg: "rgba(255,255,255,0.06)",
    text: "#8a8680",
    label: item.severity,
  };

  return (
    <div
      style={{
        padding: "14px 18px",
        borderRadius: "8px",
        background: "#161616",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#1e1e1e")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#161616")}
    >
      <span style={{ fontSize: "14px", color: "#f0ece4", fontWeight: 400 }}>{item.skills}</span>
      <span
        style={{
          fontSize: "11px",
          fontFamily: "'DM Mono', monospace",
          padding: "3px 10px",
          borderRadius: "4px",
          background: s.bg,
          color: s.text,
        }}
      >
        {s.label}
      </span>
    </div>
  );
};

// ─── Prep Plan Card ───────────────────────────────────────────────────────────

const PrepPlanCard = ({ item, index }) => (
  <div
    style={{
      padding: "22px",
      borderRadius: "10px",
      background: "#161616",
      border: "1px solid rgba(255,255,255,0.08)",
      transition: "border-color 0.2s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)")}
    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "5px",
            background: "rgba(200,146,58,0.12)",
            color: "#c8923a",
            fontSize: "12px",
            fontFamily: "'DM Mono', monospace",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {index + 1}
        </div>
        <span style={{ fontSize: "15px", fontWeight: 400, color: "#f0ece4" }}>{item.day}</span>
      </div>
      <span
        style={{
          fontSize: "11px",
          fontFamily: "'DM Mono', monospace",
          color: "#7a7060",
          background: "rgba(122,112,96,0.12)",
          padding: "3px 10px",
          borderRadius: "4px",
        }}
      >
        {item.time}
      </span>
    </div>

    <div style={{ paddingLeft: "36px", display: "flex", flexDirection: "column", gap: "8px" }}>
      {item.task.map((t, i) => (
        <div
          key={i}
          style={{
            fontSize: "13px",
            color: "#8a8680",
            fontWeight: 300,
            display: "flex",
            gap: "10px",
            lineHeight: 1.6,
          }}
        >
          <span style={{ color: "#c8923a", flexShrink: 0, marginTop: "1px" }}>▹</span>
          <span>{t}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ onBack }) => (
  <div style={{ textAlign: "center", padding: "80px 20px" }}>
    <div
      style={{
        width: "56px",
        height: "56px",
        margin: "0 auto 20px",
        borderRadius: "12px",
        background: "#161616",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#5a5650" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3
      style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: "22px",
        fontStyle: "italic",
        color: "#f0ece4",
        marginBottom: "8px",
      }}
    >
      No report data
    </h3>
    <p style={{ fontSize: "13px", color: "#5a5650", fontWeight: 300 }}>
      Generate a report first by analysing your resume.
    </p>
    <button
      onClick={onBack}
      style={{
        marginTop: "24px",
        padding: "8px 20px",
        borderRadius: "8px",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "#f0ece4",
        fontSize: "13px",
        fontWeight: 400,
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
    >
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
    [interviewReport?.data]
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
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="mt-40">
            {reportData.technicalQuestion.map((item, i) => (
              <QuestionCard key={item._id || i} item={item} index={i} category="Technical" />
            ))}
          </div>
        );
      case "behavioral":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="mt-40">
            {reportData.behavioralQuestion.map((item, i) => (
              <QuestionCard key={item._id || i} item={item} index={i} category="Behavioral" />
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
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
        }}
      >
        <AnimatedBackground />

        <NavigationBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
          onBack={() => navigate("/dashboard")}
        />

        {/* 
          Fixed-height wrapper: nav (64px) + page header (~88px) = always same top offset.
          PageHeader is OUTSIDE renderTabContent so it never shifts with data changes.
        */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: "960px",
            margin: "0 auto",
            padding: "calc(64px + 32px) 24px 60px",
          }}
        >
          {/* Always-present header — same height every tab, data-independent */}
          {!isEmpty && <PageHeader activeTab={activeTab} />}

          {/* Tab content — no marginTop, no SectionHeader inside */}
          {renderTabContent()}
        </div>

        <style>{`
          @media (max-width: 600px) {
            .overview-hero { grid-template-columns: 1fr !important; }
          }
          * { box-sizing: border-box; }
        `}</style>
      </div>
    </>
  );
}

export default InterviewReport;