import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

let groqClient = null;
function getGroqClient() {
  if (!groqClient && process.env.GROQ_API_KEY) {
    try {
      groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    } catch (e) {
      console.warn("Failed to initialize Groq client:", e.message);
    }
  }
  return groqClient;
}

// Extract primary technical competencies for heuristic scoring
const COMMON_TECH_KEYWORDS = [
  "react", "react.js", "next.js", "vue", "angular", "node", "node.js", "express",
  "typescript", "javascript", "python", "django", "fastapi", "golang", "java", "spring",
  "c++", "c#", ".net", "sql", "postgresql", "mysql", "mongodb", "redis",
  "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "graphql", "rest", "git",
  "microservices", "system design", "kafka", "rabbitmq", "tailwind", "redux"
];

function generateFallbackReport({ resume, selfDescription, jobDescription }) {
  console.log("Generating high-fidelity fallback intelligence report...");
  const resumeLower = (resume || "").toLowerCase();
  const jdLower = (jobDescription || "").toLowerCase();

  // Keyword extraction & matching
  const jdKeywords = COMMON_TECH_KEYWORDS.filter((kw) => jdLower.includes(kw));
  const matchedKeywords = jdKeywords.filter((kw) => resumeLower.includes(kw));
  const missingKeywords = jdKeywords.filter((kw) => !resumeLower.includes(kw));

  let score = 70;
  if (jdKeywords.length > 0) {
    score = Math.round((matchedKeywords.length / jdKeywords.length) * 100);
    score = Math.max(45, Math.min(95, score)); // Keep within a realistic evaluation window
  }

  // Infer job title from first line of JD
  const firstLine = jobDescription.split("\n")[0]?.trim() || "";
  let inferredTitle = "Software Engineer";
  if (firstLine.length > 5 && firstLine.length < 60 && !firstLine.includes("http")) {
    inferredTitle = firstLine.replace(/^(hiring|seeking|job title|role)[:\s]*/i, "").trim();
  } else if (jdLower.includes("frontend") || jdLower.includes("react")) {
    inferredTitle = "Senior Frontend Engineer";
  } else if (jdLower.includes("backend") || jdLower.includes("node")) {
    inferredTitle = "Senior Backend Engineer";
  } else if (jdLower.includes("full stack") || jdLower.includes("fullstack")) {
    inferredTitle = "Full Stack Engineer";
  }

  // Determine top gaps
  const topGaps = (missingKeywords.length > 0 ? missingKeywords : ["System Design Architecture", "High-Throughput Caching", "Automated E2E Testing"])
    .slice(0, 4)
    .map((skill, idx) => ({
      skills: skill.toUpperCase(),
      severity: idx === 0 ? "high" : idx === 1 ? "medium" : "low"
    }));

  const primaryTech = matchedKeywords[0] || "Architecture";
  const secondaryTech = matchedKeywords[1] || "Distributed Systems";

  return {
    jobTitle: inferredTitle,
    matchScore: score,
    technicalQuestion: [
      {
        question: `How would you architect and optimize state management and rendering performance in a scalable application utilizing ${primaryTech}?`,
        intention: "Evaluate deep architectural understanding, memory profiling, and re-rendering prevention under high transaction volume.",
        answer: "Discuss component boundary isolation, immutable data flows, selective subscriptions (e.g. Zustand/Redux selectors or signal abstractions), and profiling with Flamegraphs to eliminate redundant computation."
      },
      {
        question: `Explain how you handle asynchronous edge cases, network partitioning, and idempotency when integrating external services.`,
        intention: "Assess distributed systems resilience, retry strategies, and data consistency models.",
        answer: "Detail exponential backoff with jitter, idempotent request IDs stored in Redis/DB with atomic operations, and circuit breaker patterns to prevent cascade failure."
      },
      {
        question: `What considerations dictate your schema design and indexing strategy in a database supporting high read vs write traffic?`,
        intention: "Assess query execution plan optimization, indexing trade-offs (B-Tree vs Hash), and denormalization choices.",
        answer: "Analyze compound indexing left-prefix rules, write amplification trade-offs, explain() analysis to prevent full collection scans, and caching read-heavy layers."
      },
      {
        question: `Walk through your approach to securing an API against broken object level authorization (BOLA) and token leakage.`,
        intention: "Verify security-first mindset, authorization middleware design, and authentication rotation.",
        answer: "Enforce ownership validation checks at the service layer on every resource ID lookup, short-lived JWT access tokens in memory, and HttpOnly/Secure refresh token rotation with revocation lists."
      },
      {
        question: `How do you diagnose and resolve a severe production memory leak or CPU spike under heavy traffic?`,
        intention: "Assess observability, profiling toolchain familiarity, and live debugging under pressure.",
        answer: "Inspect container metrics (cgroups), capture heap snapshots and CPU flamegraphs using node --inspect or APM agents, look for retained event listeners or unclosed streams, and stage hotfix rollout."
      }
    ],
    behavioralQuestion: [
      {
        question: "Describe a high-stakes scenario where you disagreed with a technical design decision by a peer or senior engineer. How did you proceed?",
        intention: "Assess diplomatic technical discourse, adherence to team velocity, and disagreement without friction.",
        answer: "Use STAR framework: Articulate the objective trade-offs using benchmarks or prototypes rather than opinion, present a risk-benefit matrix, agree on an empirical test, and commit fully to team consensus."
      },
      {
        question: "Tell me about a production outage or critical regression you inadvertently caused. What immediate actions did you take?",
        intention: "Gauge psychological safety, accountability, crisis incident command, and post-mortem hygiene.",
        answer: "Acknowledge the alert immediately, initiate rollback or feature-flag isolation, communicate status transparently, then conduct a blameless post-mortem with preventative automated checks."
      },
      {
        question: "How do you manage competing priorities when product stakeholders demand feature delivery while engineering demands tech debt remediation?",
        intention: "Examine capacity planning, stakeholder communication, and business alignment.",
        answer: "Quantify tech debt in terms of business impact—delivery lead time, defect rate, cloud compute costs. Advocate for a dedicated 15-20% continuous allocation per sprint."
      },
      {
        question: "Share an example where you mentored an engineer or elevated team engineering standards.",
        intention: "Assess multiplier effect, empathy, and code review culture leadership.",
        answer: "Establish clear design review checklists, conduct paired architectural discussions, and share written post-mortems and patterns to elevate collective team capability."
      },
      {
        question: "Describe how you approached learning an unfamiliar language, framework, or cloud technology under tight deadlines.",
        intention: "Evaluate rapid learning agility, practical prototyping, and resourcefulness.",
        answer: "Deconstruct the core primitives first, build an end-to-end sandbox prototype exercising edge cases, read official RFCs/specifications, and implement internal team cheatsheets."
      }
    ],
    skillGaps: topGaps,
    preprationPlan: [
      {
        day: "Day 1",
        time: "2.5 hours",
        task: [
          `Review core fundamentals and advanced internals of ${primaryTech || "primary language"}`,
          "Audit official documentation on concurrent rendering, event loop mechanics, and memory allocation"
        ]
      },
      {
        day: "Day 2",
        time: "3.0 hours",
        task: [
          `Deep-dive into missing requirement: ${topGaps[0]?.skills || "System Architecture"}`,
          "Implement a minimal working repository verifying hands-on patterns and API syntax"
        ]
      },
      {
        day: "Day 3",
        time: "2.5 hours",
        task: [
          "Practice 3 complex coding scenario problems emphasizing edge cases and time/space complexity",
          "Analyze optimal query plans, database indexing, and normalization trade-offs"
        ]
      },
      {
        day: "Day 4",
        time: "2.5 hours",
        task: [
          "System design drill: Architect a horizontally scalable, high-throughput service with caching",
          "Map out CDN edge caching, load balancing, message brokers, and DB sharding strategies"
        ]
      },
      {
        day: "Day 5",
        time: "2.0 hours",
        task: [
          "Formulate 5 structured STAR behavioral stories covering conflict, leadership, failure, and velocity",
          "Record mock responses to verify conciseness and quantifiable impact metrics"
        ]
      },
      {
        day: "Day 6",
        time: "2.5 hours",
        task: [
          "End-to-end mock technical interview simulation with 45-minute strict timer",
          "Review past production incident post-mortems and key architectural decisions"
        ]
      },
      {
        day: "Day 7",
        time: "1.5 hours",
        task: [
          "High-level strategy review: Re-read target job description competencies",
          "Prepare thoughtful, company-specific reverse interview questions for hiring managers"
        ]
      }
    ]
  };
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const groq = getGroqClient();

  if (!groq) {
    console.warn("Groq API key not configured or client missing. Falling back to analytical engine.");
    return generateFallbackReport({ resume, selfDescription, jobDescription });
  }

  // Token bounding to prevent 6,000 TPM rate limits on free tier
  const safeResume = (resume || "").slice(0, 4500);
  const safeJd = (jobDescription || "").slice(0, 3500);
  const safeSelf = (selfDescription || "").slice(0, 800);

  let activeModels = [];
  try {
    const listRes = await groq.models.list();
    if (listRes?.data) {
      activeModels = listRes.data
        .map((m) => m.id)
        .filter(
          (id) =>
            !id.includes("whisper") &&
            !id.includes("embed") &&
            !id.includes("guard") &&
            !id.includes("vision") &&
            !id.includes("mixtral") &&
            !id.includes("llama3-70b-8192") &&
            !id.includes("llama3-8b-8192")
        );
      console.log("Active viable Groq models:", activeModels);
    }
  } catch (listErr) {
    console.warn("Failed to fetch live model list from Groq:", listErr.message);
  }

  const preferred = [
    "llama-3.1-8b-instant",
    "llama-3.3-70b-versatile",
    "gemma2-9b-it",
    "qwen-2.5-32b",
    "llama-3.2-3b-preview",
    "llama-3.2-11b-text-preview"
  ];

  const modelsToTry = [
    ...preferred.filter((m) => activeModels.includes(m)),
    ...activeModels,
    ...preferred,
  ].filter((v, i, a) => a.indexOf(v) === i);

  const errors = [];

  for (const model of modelsToTry) {
    try {
      console.log(`Attempting report generation with Groq model: ${model}`);

      const response = await groq.chat.completions.create({
        model,
        max_tokens: 1800,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a SENIOR TECHNICAL RECRUITER. Evaluate candidate fit against the job description.

SCORING WEIGHTS:
• Technical skills match: 40%
• Experience relevance: 25%
• Self-description alignment: 20%
• Culture/soft skills: 15%

REQUIRED OUTPUT STRUCTURE (JSON only):
{
  "jobTitle": "string",
  "matchScore": number (0-100),
  "technicalQuestion": [
    {"question": "string", "intention": "string", "answer": "string"}
  ],
  "behavioralQuestion": [
    {"question": "string", "intention": "string", "answer": "string"}
  ],
  "skillGaps": [
    {"skills": "string", "severity": "high"} // severity must be strictly "high", "medium", or "low"
  ],
  "preprationPlan": [
    {"day": "Day 1", "time": "2 hours", "task": ["task 1", "task 2"]}
  ]
}

RULES:
- technicalQuestion: exactly 5 questions
- behavioralQuestion: exactly 5 questions
- skillGaps: 3-5 items with severity: "high", "medium", or "low"
- preprationPlan: exactly 7 days
- Output strictly valid JSON with no markdown wrapping.`
          },
          {
            role: "user",
            content: `EVALUATE CANDIDATE:

📋 JOB DESCRIPTION:
${safeJd}

👤 CANDIDATE RESUME:
${safeResume}

💬 CANDIDATE SELF-DESCRIPTION:
${safeSelf}

Return only the valid JSON object.`
          }
        ],
      });

      const raw = response.choices?.[0]?.message?.content || "{}";
      const cleaned = raw.replace(/```json\n?|\n?```/g, "").replace(/`/g, "").trim();
      let result = JSON.parse(cleaned);

      // Normalize matchScore
      if (typeof result.matchScore === "number") {
        if (result.matchScore <= 1 && result.matchScore > 0) {
          result.matchScore = Math.round(result.matchScore * 100);
        }
        result.matchScore = Math.min(100, Math.max(0, Math.round(result.matchScore)));
      } else {
        result.matchScore = 70;
      }

      result.jobTitle = result.jobTitle || result.title || "Software Engineer";

      // Normalize skillGaps
      const rawGaps = Array.isArray(result.skillGaps) ? result.skillGaps : [];
      result.skillGaps = rawGaps.map((gap) => {
        const rawSev = String(gap.severity || "medium").toLowerCase().trim();
        const severity = ["low", "medium", "high"].includes(rawSev) ? rawSev : "medium";
        return {
          skills: gap.skills || gap.skill || gap.name || "Technical Competency",
          severity,
        };
      });
      if (result.skillGaps.length === 0) {
        result.skillGaps = [
          { skills: "System Design and Scalability", severity: "medium" },
          { skills: "Testing and Performance Profiling", severity: "low" }
        ];
      }

      // Normalize technicalQuestion
      const rawTech = Array.isArray(result.technicalQuestion)
        ? result.technicalQuestion
        : Array.isArray(result.technicalQuestions)
        ? result.technicalQuestions
        : [];
      result.technicalQuestion = rawTech.map((q) => ({
        question: q.question || "Technical scenario question",
        intention: q.intention || "Assess technical depth and implementation trade-offs",
        answer: q.answer || q.sampleAnswer || q.solution || "Structured technical resolution with architectural trade-offs.",
      }));
      while (result.technicalQuestion.length < 5) {
        result.technicalQuestion.push({
          question: "How do you evaluate performance bottlenecks and optimize critical rendering or query paths?",
          intention: "Assess debugging methodology and systematic profiling techniques.",
          answer: "Profile using APM and browser devtools, isolate slow database queries or DOM thrashing, and apply targeted caching or query indexing."
        });
      }

      // Normalize behavioralQuestion
      const rawBeh = Array.isArray(result.behavioralQuestion)
        ? result.behavioralQuestion
        : Array.isArray(result.behavioralQuestions)
        ? result.behavioralQuestions
        : [];
      result.behavioralQuestion = rawBeh.map((q) => ({
        question: q.question || "Behavioral scenario question",
        intention: q.intention || "Evaluate leadership and conflict resolution under constraints",
        answer: q.answer || q.sampleAnswer || q.solution || "STAR (Situation, Task, Action, Result) methodology approach.",
      }));
      while (result.behavioralQuestion.length < 5) {
        result.behavioralQuestion.push({
          question: "Describe a project where requirements shifted mid-development. How did you realign the engineering approach?",
          intention: "Evaluate agility and communication with stakeholders.",
          answer: "Used STAR format: Assessed scope variance, communicated delivery trade-offs to product stakeholders, and decoupled modular components."
        });
      }

      // Normalize preprationPlan
      const rawPlan = Array.isArray(result.preprationPlan)
        ? result.preprationPlan
        : Array.isArray(result.preparationPlan)
        ? result.preparationPlan
        : [];
      result.preprationPlan = rawPlan.map((p, idx) => ({
        day: p.day || `Day ${idx + 1}`,
        time: p.time || "2-3 hours",
        task: Array.isArray(p.task)
          ? p.task
          : Array.isArray(p.tasks)
          ? p.tasks
          : [String(p.task || p.tasks || "Study fundamental concept review and practice implementation")],
      }));
      while (result.preprationPlan.length < 7) {
        const d = result.preprationPlan.length + 1;
        result.preprationPlan.push({
          day: `Day ${d}`,
          time: "2 hours",
          task: ["Review core architecture patterns", "Practice targeted scenario questions"]
        });
      }

      console.log(`Successfully generated report using model ${model}: Score=${result.matchScore}%`);
      return result;

    } catch (err) {
      console.warn(`Model ${model} attempt failed:`, err.message);
      errors.push(`[${model}]: ${err.message}`);
    }
  }

  console.warn("All candidate Groq models exhausted. Activating fallback report generator.", errors);
  return generateFallbackReport({ resume, selfDescription, jobDescription });
}

export default generateInterviewReport;

