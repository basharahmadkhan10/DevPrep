import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
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
            !id.includes("vision")
        );
      console.log("Live active Groq models for this API key:", activeModels);
    }
  } catch (listErr) {
    console.warn("Failed to fetch live model list from Groq:", listErr.message);
  }

  // Preferred order: fast, stable chat models with high token limits
  const preferred = [
    "llama-3.1-8b-instant",
    "llama3-8b-8192",
    "llama-3.2-3b-preview",
    "llama-3.2-11b-text-preview",
    "qwen-2.5-32b",
    "gemma2-9b-it",
    "llama-3.3-70b-versatile"
  ];

  // Prioritize active models matching our preferred list, then any active models, then fallbacks
  const modelsToTry = [
    ...preferred.filter((m) => activeModels.includes(m)),
    ...activeModels,
    ...preferred,
  ].filter((v, i, a) => a.indexOf(v) === i); // unique

  const errors = [];

  for (const model of modelsToTry) {
    try {
      console.log(`Attempting report generation with Groq model: ${model}`);

      const response = await groq.chat.completions.create({
        model,
        max_tokens: 3000,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a SENIOR TECHNICAL RECRUITER with 15+ years experience. Evaluate candidate fit against the job description.

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
${jobDescription}

👤 CANDIDATE RESUME:
${resume}

💬 CANDIDATE SELF-DESCRIPTION:
${selfDescription}

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

      console.log(`Successfully generated report using model ${model}: Score=${result.matchScore}%`);
      return result;

    } catch (err) {
      console.warn(`Model ${model} attempt failed:`, err.message);
      errors.push(`[${model}]: ${err.message}`);
    }
  }

  throw new Error(`All candidate AI models failed: ${errors.join(" | ")}`);
}

export default generateInterviewReport;
