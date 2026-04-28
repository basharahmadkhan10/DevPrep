import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 4000,
      temperature: 0.85, // Balanced variety without being random
      top_p: 0.95,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a SENIOR TECHNICAL RECRUITER with 15+ years experience at top tech companies (Google, Meta, Amazon). Your specialty is brutally honest candidate evaluation.

CRITICAL RULES:
1. NEVER default to average scores (70-85%)
2. Be harsh on gaps, generous on strengths
3. Each evaluation must be UNIQUE to the candidate
4. Return ONLY valid JSON - no explanations, no markdown

SCORING ALGORITHM (calculate dynamically per candidate):
• 95-100: Perfect match, hire immediately
• 85-94: Excellent, strong hire
• 70-84: Good, meets most requirements
• 55-69: Average, has gaps but potential
• 40-54: Below average, significant gaps
• 0-39: Poor match, not recommend

SCORING WEIGHTS (apply to EVERY candidate):
• Technical skills match: 40%
• Experience relevance: 25%
• Self-description alignment: 20%
• Culture/soft skills: 15%

REQUIRED OUTPUT STRUCTURE (EXACT - no additions, no omissions):
{
  "jobTitle": "string",
  "matchScore": number, // INTEGER 0-100, calculated fresh each time
  "technicalQuestion": [
    {"question": "string", "intention": "string", "answer": "string"}
  ],
  "behavioralQuestion": [
    {"question": "string", "intention": "string", "answer": "string"}
  ],
  "skillGaps": [
    {"skills": "string", "severity": "high|medium|low"}
  ],
  "preprationPlan": [
    {"day": "Day X", "time": "X-Y hours", "task": ["task1", "task2"]}
  ]
}

QUALITY CHECKS:
- technicalQuestion: EXACTLY 5 questions (mix of core tech, problem-solving, system design)
- behavioralQuestion: EXACTLY 5 questions (STAR method based)
- skillGaps: 3-5 items, severity DISTRIBUTED (not all high/medium/low)
- preprationPlan: EXACTLY 7 days, tasks PROGRESSIVE (start easy → complex)

FORCE VARIATION:
- If candidate is strong, score 85-94 (not 95 automatically)
- If candidate is weak, score 40-69 (not 70+)
- If candidate is mixed, score 50-80 based on weight distribution`
        },
        {
          role: "user",
          content: `ANALYZE THIS CANDIDATE WITH FRESH EYES (no default scoring):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 JOB DESCRIPTION:
${jobDescription}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 CANDIDATE RESUME:
${resume}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 CANDIDATE SELF-DESCRIPTION:
${selfDescription}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP-BY-STEP ANALYSIS (internal reasoning):
1. Extract top 5 required skills from JD
2. Map candidate's demonstrated skills from resume
3. Calculate match percentage (skill matches / required skills × 100)
4. Adjust weight based on experience years (bonus +10% if 5+ years relevant)
5. Adjust based on self-description authenticity (-15% if vague/overpromising)
6. FINAL SCORE = (skill_match × 0.4) + (exp_match × 0.25) + (self_match × 0.2) + (soft_match × 0.15)

Now produce the JSON output with these SPECIFIC requirements:

TECHNICAL QUESTIONS (must hit these areas):
- Q1: Core technology from JD that candidate seems weak in
- Q2: System design/scalability question
- Q3: Problem-solving with constraints
- Q4: Debugging/optimization scenario  
- Q5: Architecture/trade-off decision

BEHAVIORAL QUESTIONS (must be situational):
- Q1: Conflict resolution with specific metrics
- Q2: Failed project & recovery
- Q3: Leadership without authority
- Q4: Technical debt management
- Q5: Learning new technology rapidly

SKILL GAPS (must include):
- At least 1 HIGH severity gap (critical missing skill)
- At least 2 MEDIUM severity gaps
- Optional: 1-2 LOW severity gaps

PREPARATION PLAN (7-day progression):
- Day 1-2: Foundation (core missing skills)
- Day 3-4: Practice (technical + behavioral)
- Day 5-6: Advanced topics + system design
- Day 7: Mock interview + review

CRITICAL: Calculate matchScore using the weighted formula above. 
DO NOT copy from previous evaluations. 
If candidate is obviously weak, score BELOW 50.
If candidate is excellent, score 85-94 (rarely 95+).
If candidate has contradictory info in self-description vs resume, PENALIZE by 15-25 points.

Return ONLY the JSON object.`
        }
      ],
    });

    const raw = response.choices[0].message.content || "{}";
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").replace(/`/g, "").trim();
    let result = JSON.parse(cleaned);
    
    // Validation & normalization
    if (result.matchScore) {
      // Convert decimal to integer if needed
      if (result.matchScore <= 1 && result.matchScore > 0) {
        result.matchScore = Math.round(result.matchScore * 100);
      }
      // Enforce 0-100 range
      result.matchScore = Math.min(100, Math.max(0, Math.round(result.matchScore)));
    }
    
    // Ensure arrays have correct lengths
    if (!result.technicalQuestion || result.technicalQuestion.length !== 5) {
      console.warn(`Expected 5 technical questions, got ${result.technicalQuestion?.length}`);
    }
    if (!result.behavioralQuestion || result.behavioralQuestion.length !== 5) {
      console.warn(`Expected 5 behavioral questions, got ${result.behavioralQuestion?.length}`);
    }
    if (!result.preprationPlan || result.preprationPlan.length !== 7) {
      console.warn(`Expected 7 preparation days, got ${result.preprationPlan?.length}`);
    }
    
    // Log score for debugging
    console.log(`\n📊 Job Title: ${result.jobTitle}`);
    console.log(`🎯 Match Score: ${result.matchScore}%`);
    console.log(`📈 Score Distribution Check: ${result.matchScore < 50 ? 'Below Average' : result.matchScore < 70 ? 'Average' : result.matchScore < 85 ? 'Good' : 'Excellent'}`);
    
    return result;
    
  } catch (error) {
    console.error("Groq Error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    throw error;
  }
}

export default generateInterviewReport;
