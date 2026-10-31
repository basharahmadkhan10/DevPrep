import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Models list in priority order (starting with universally supported production models)
const MODELS_TO_TRY = [
  "llama-3.1-8b-instant",
  "llama3-70b-8192",
  "llama3-8b-8192",
  "mixtral-8x7b-32768",
];

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  let lastError = null;

  for (const model of MODELS_TO_TRY) {
    try {
      console.log(`Attempting report generation with Groq model: ${model}`);

      const response = await groq.chat.completions.create({
        model,
        max_tokens: 3500,
        temperature: 0.3, // Lower temperature for more grounded, reliable evaluation
        top_p: 0.9,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a SENIOR TECHNICAL RECRUITER with 15+ years experience at top tech companies. Your specialty is objective, highly accurate candidate evaluation.

SCORING WEIGHTS:
• Technical skills match: 40%
• Experience relevance: 25%
• Self-description alignment: 20%
• Culture/soft skills: 15%

REQUIRED OUTPUT STRUCTURE (Return ONLY valid JSON matching this exact schema):
{
  "jobTitle": "string (inferred role title from JD)",
  "matchScore": number (integer between 0 and 100),
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
    {"day": "Day 1", "time": "2-3 hours", "task": ["Task 1", "Task 2"]}
  ]
}

QUALITY RULES:
- technicalQuestion: EXACTLY 5 questions (mix of core tech, architecture, debugging)
- behavioralQuestion: EXACTLY 5 questions (STAR format based)
- skillGaps: 3-5 items with severity strictly lowercase: "high", "medium", or "low"
- preprationPlan: EXACTLY 7 days with "task" array of actionable study steps
- Return ONLY the JSON object. No explanations or markdown.`
          },
          {
            role: "user",
            content: `EVALUATE THIS CANDIDATE:

📋 JOB DESCRIPTION:
${jobDescription}

👤 CANDIDATE RESUME:
${resume}

💬 CANDIDATE BACKGROUND:
${selfDescription}

Compute the weighted matchScore (0-100), extract skill gaps, formulate 5 technical questions with sample solutions, 5 STAR behavioral questions, and a 7-day preparation plan. Return valid JSON only.`
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
        result.matchScore = 70; // safe fallback
      }

      // Normalize jobTitle
      result.jobTitle = result.jobTitle || result.title || "Software Engineer";

      // Normalize skillGaps (ensure severity is strictly lowercase low/medium/high)
      const rawGaps = Array.isArray(result.skillGaps) ? result.skillGaps : [];
      result.skillGaps = rawGaps.map((gap) => {
        const rawSev = String(gap.severity || "medium").toLowerCase().trim();
        const severity = ["low", "medium", "high"].includes(rawSev) ? rawSev : "medium";
        return {
          skills: gap.skills || gap.skill || gap.name || "Technical Competency",
          severity,
        };
      });

      // Normalize technical questions
      const rawTech = Array.isArray(result.technicalQuestion)
        ? result.technicalQuestion
        : Array.isArray(result.technicalQuestions)
        ? result.technicalQuestions
        : [];
      result.technicalQuestion = rawTech.map((q) => ({
        question: q.question || "Technical scenario question",
        intention: q.intention || "Assess depth of problem-solving under constraints",
        answer: q.answer || q.sampleAnswer || q.solution || "Structured technical resolution with architectural trade-offs.",
      }));

      // Normalize behavioral questions
      const rawBeh = Array.isArray(result.behavioralQuestion)
        ? result.behavioralQuestion
        : Array.isArray(result.behavioralQuestions)
        ? result.behavioralQuestions
        : [];
      result.behavioralQuestion = rawBeh.map((q) => ({
        question: q.question || "Behavioral scenario question",
        intention: q.intention || "Evaluate leadership without authority and conflict resolution",
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
          : [String(p.task || p.tasks || "Review core concept fundamentals and practical exercises")],
      }));

      console.log(`Success with model ${model}: Score=${result.matchScore}%, Title=${result.jobTitle}`);
      return result;

    } catch (err) {
      console.warn(`Model ${model} failed:`, err.message);
      lastError = err;
      // Continue to next model in loop
    }
  }

  throw lastError || new Error("All Groq models failed to generate interview report.");
}

export default generateInterviewReport;
