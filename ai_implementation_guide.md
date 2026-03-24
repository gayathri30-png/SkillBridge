# Skillbridge AI Implementation Guide

This document details the technical implementation of all Artificial Intelligence features within the Skillbridge platform. Use this guide to explain the architecture, algorithms, and fail-safes incorporated into the system.

---

## 1. AI Algorithm Locations

### 1.1 Skill Gap Detector
* **File Paths:** 
  * Backend: [server/controllers/aiController.js](file:///d:/SkillBridge/server/controllers/aiController.js), [server/services/aiService.js](file:///d:/SkillBridge/server/services/aiService.js)
  * Frontend: [client/src/pages/AISkillGapDetector.jsx](file:///d:/SkillBridge/client/src/pages/AISkillGapDetector.jsx), [client/src/pages/SkillGapAnalysis.jsx](file:///d:/SkillBridge/client/src/pages/SkillGapAnalysis.jsx)
* **Key Functions:** [getSkillGapPathways](file:///d:/SkillBridge/server/controllers/aiController.js#658-807), [getJobsForSkillGap](file:///d:/SkillBridge/server/controllers/aiController.js#626-657)
* **API Endpoints:** `GET /api/ai/skill-gap/pathways`, `GET /api/ai/skill-gap/jobs`

### 1.2 Suitability Score (Candidate Match Score)
* **File Paths:** 
  * Backend: [server/controllers/aiController.js](file:///d:/SkillBridge/server/controllers/aiController.js)
  * Frontend: [client/src/components/JobApplyModal.jsx](file:///d:/SkillBridge/client/src/components/JobApplyModal.jsx), [client/src/components/profile/ApplicantEvaluation.jsx](file:///d:/SkillBridge/client/src/components/profile/ApplicantEvaluation.jsx)
* **Key Functions:** [calculateMatchScore](file:///d:/SkillBridge/server/controllers/aiController.js#4-67), [analyzeApplicationInsights](file:///d:/SkillBridge/server/controllers/aiController.js#120-175)
* **API Endpoints:** `GET /api/ai/match/:jobId`, `GET /api/ai/analyze/:applicationId`

### 1.3 Proposal Generator
* **File Paths:** 
  * Backend: [server/controllers/aiController.js](file:///d:/SkillBridge/server/controllers/aiController.js), [server/services/aiService.js](file:///d:/SkillBridge/server/services/aiService.js)
  * Frontend: [client/src/pages/AIProposalGenerator.jsx](file:///d:/SkillBridge/client/src/pages/AIProposalGenerator.jsx), [client/src/components/JobApplyModal.jsx](file:///d:/SkillBridge/client/src/components/JobApplyModal.jsx)
* **Key Functions:** [generateAdvancedProposal](file:///d:/SkillBridge/server/controllers/aiController.js#808-891), [generateProposal](file:///d:/SkillBridge/server/controllers/aiController.js#68-120)
* **API Endpoints:** `POST /api/ai/proposal/advanced/:jobId`, `GET /api/ai/proposal/:jobId`

### 1.4 Market Demand Analysis
* **File Paths:** 
  * Backend: [server/controllers/aiController.js](file:///d:/SkillBridge/server/controllers/aiController.js)
  * Frontend: [client/src/pages/RecruiterMarketIntelligence.jsx](file:///d:/SkillBridge/client/src/pages/RecruiterMarketIntelligence.jsx)
* **Key Functions:** [getMarketIntelligence](file:///d:/SkillBridge/server/controllers/aiController.js#325-406)
* **API Endpoints:** `GET /api/ai/market-intelligence`, `GET /api/ai/market-intelligence/:jobId`

### 1.5 Priority Upskilling
* **File Paths:** 
  * Backend: [server/controllers/aiController.js](file:///d:/SkillBridge/server/controllers/aiController.js)
  * Frontend: [client/src/components/StudentDashboard.jsx](file:///d:/SkillBridge/client/src/components/StudentDashboard.jsx)
* **Key Functions:** [getAdvancedUpskilling](file:///d:/SkillBridge/server/controllers/aiController.js#1016-1141)
* **API Endpoints:** `GET /api/ai/advanced-upskilling`

---

## 2. AI Implementation Details & Data Flow

### The AI Service Layer ([server/services/aiService.js](file:///d:/SkillBridge/server/services/aiService.js))
All calls to external AI models are routed through a dedicated wrapper. The system utilizes **Google Gemini 2.5 Flash** (`@google/genai`).
* **Data Flow**: Controllers construct prompt strings containing database contexts -> Passed to [generateGeminiResponse](file:///d:/SkillBridge/server/services/aiService.js#11-44) -> Calls `ai.models.generateContent` -> Returns Markdown/JSON to Controller -> Controller cleans and persists data.
* **Resilience**: If `GEMINI_API_KEY` is missing or invalid, the service gracefully returns `null`, prompting the controllers to trigger intelligent fallback heuristics.

### Skill Gap Detector Logic
1. **Input**: Student ID and Target Job ID/Title.
2. **Processing**: Queries SQL for `job_skills` and `user_skills`. Computes exact overlap to determine `missing` and `matched` skills.
3. **AI Generation**: Constructs a JSON-enforcing prompt for Gemini to create a learning pathway (timeframe, difficulty, resources) for each missing skill.
4. **Fallback**: If AI is offline, calculates difficulty and impact deterministically based on skill string length and index modulo math.
5. **Output**: Returns JSON pathways to the frontend and commits the result to database tracking tables.

### Proposal Generator Logic
1. **Input**: Student Profile (Bio, Skills), Target Job Details, requested Tone, and Length.
2. **Processing**: Formulates a system prompt demanding a highly personalized cover letter weaving the student's background directly into the company's requirements.
3. **AI Generation**: Gemini returns a tailored cover letter.
4. **Fallback**: Uses templated strings specific to the requested tone (e.g., *Friendly*, *Confident*, *Professional*) dynamically populated with SQL variables (`${student.name}`, `${job.title}`).

### Priority Upskilling Logic (Heuristic AI)
Rather than making slow LLM calls, this feature operates as a **Heuristic AI Engine**:
1. Groups all open jobs in the market and extracts their requested skill arrays.
2. Cross-references against the student's current resume.
3. Calculates "Unlock Value" (how many jobs the student is 1-2 skills away from qualifying for).
4. Sorts these gap skills by overall market demand to generate Top Priority recommendations.

---

## 3. Database Integration

The AI heavily integrates with the relational database to build context and cache expensive generative operations.

* **Core Knowledge Graph**: `users`, `jobs`, `skills`, `user_skills`, `job_skills`.
* **`skill_gap_analysis`**: Caches AI output. Contains `user_id`, `job_title`, `match_percentage`, `matched_skills` (JSON), and `missing_skills` (JSON). Prevents redundant processing on dashboard loads.
* **`ai_recommendations`**: Stores actionable AI advice. Contains `recommendation_type`, `recommendation_text`, `priority`, and `is_completed`.
* **`ai_proposals`**: Archives LLM-generated outputs for candidates. Stores `job_id`, `company`, `proposal_text`, `tone`, `length`.
* **`applications`**: Contains the `ai_match_score` comparing a student's resume against the role at the exact time of application.

---

## 4. Code Examples

### A. Gemini API Integration & Prompt Engineering ([aiService.js](file:///d:/SkillBridge/server/services/aiService.js))
```javascript
export const generateGeminiResponse = async (prompt, systemInstruction = null) => {
    const ai = getGeminiClient(); // Checks for key
    if (!ai) return null; // Safe fallback trigger

    try {
        const config = { temperature: 0.7 };
        if (systemInstruction) config.systemInstruction = systemInstruction;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: config,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini AI Generation Error:", error);
        throw new Error("Failed to generate AI response.");
    }
};
```

### B. Fallback Heuristic Execution ([aiController.js](file:///d:/SkillBridge/server/controllers/aiController.js) - Skill Gap)
```javascript
// Fallback if Gemini failed, gave invalid JSON, or API key is missing
if (pathways.length === 0 && missing.length > 0) {
    pathways = missing.map((skill, index) => {
        // Deterministic logic based on skill name length and index
        const diffIndex = (skill.length + index) % 3;
        const difficulties = ["Easy", "Medium", "Complex"];
        const impact = 5 + ((skill.length * 7 + index * 3) % 15);
        const timeframes = ["1-2 weeks", "2-4 weeks", "1-2 months"];

        return {
        skill,
        difficulty: difficulties[diffIndex],
        impact: impact,
        resources: [
            { name: `${skill} Official Docs`, url: `https://www.google.com/search?q=${encodeURIComponent(skill)}+documentation` }
        ],
        estimated_time: timeframes[diffIndex]
        };
    });
}
```

### C. Data Transformation & SQL Saving ([aiController.js](file:///d:/SkillBridge/server/controllers/aiController.js))
```javascript
// Ensure arrays are stringified correctly for MySQL JSON columns
const matchedSkillsJson = JSON.stringify(result.matched_skills || []);
const missingSkillsJson = JSON.stringify(result.missing_skills || []);

await db.promise().query(
    `INSERT INTO skill_gap_analysis (user_id, job_title, match_percentage, matched_skills, missing_skills) VALUES (?, ?, ?, ?, ?)`,
    [studentId, currentJobTitle, matchPercentage || 0, matchedSkillsJson, missingSkillsJson]
);
```

---

## 5. Summary Table

| AI Feature | Backend File | Key Function(s) | API Endpoint | Frontend Component | Database Tables |
|------------|--------------|-----------------|--------------|-------------------|-----------------|
| **Skill Gap Detector** | [aiController.js](file:///d:/SkillBridge/server/controllers/aiController.js) | [getSkillGapPathways](file:///d:/SkillBridge/server/controllers/aiController.js#658-807) | `GET /api/ai/skill-gap/pathways` | [AISkillGapDetector.jsx](file:///d:/SkillBridge/client/src/pages/AISkillGapDetector.jsx) | `skill_gap_analysis`, `ai_recommendations` |
| **Suitability Score** | [aiController.js](file:///d:/SkillBridge/server/controllers/aiController.js) | [calculateMatchScore](file:///d:/SkillBridge/server/controllers/aiController.js#4-67), [analyzeApplicationInsights](file:///d:/SkillBridge/server/controllers/aiController.js#120-175) | `GET /api/ai/match/:jobId` | [JobApplyModal.jsx](file:///d:/SkillBridge/client/src/components/JobApplyModal.jsx), [ApplicantEvaluation.jsx](file:///d:/SkillBridge/client/src/components/profile/ApplicantEvaluation.jsx) | `applications`, `user_skills`, `job_skills` |
| **Proposal Generator** | [aiController.js](file:///d:/SkillBridge/server/controllers/aiController.js) | [generateAdvancedProposal](file:///d:/SkillBridge/server/controllers/aiController.js#808-891) | `POST /api/ai/proposal/advanced/:jobId` | [AIProposalGenerator.jsx](file:///d:/SkillBridge/client/src/pages/AIProposalGenerator.jsx) | `ai_proposals` |
| **Market Demand Analysis** | [aiController.js](file:///d:/SkillBridge/server/controllers/aiController.js) | [getMarketIntelligence](file:///d:/SkillBridge/server/controllers/aiController.js#325-406) | `GET /api/ai/market-intelligence` | [RecruiterMarketIntelligence.jsx](file:///d:/SkillBridge/client/src/pages/RecruiterMarketIntelligence.jsx) | `jobs`, `skills`, `job_skills` |
| **Priority Upskilling** | [aiController.js](file:///d:/SkillBridge/server/controllers/aiController.js) | [getAdvancedUpskilling](file:///d:/SkillBridge/server/controllers/aiController.js#1016-1141) | `GET /api/ai/advanced-upskilling` | [StudentDashboard.jsx](file:///d:/SkillBridge/client/src/components/StudentDashboard.jsx) | `jobs`, `user_skills`, `job_skills` |
| **Smart Job Posts** | [aiController.js](file:///d:/SkillBridge/server/controllers/aiController.js) | [generateJobPost](file:///d:/SkillBridge/server/controllers/aiController.js#569-621) | `POST /api/ai/generate-job-post` | [PostJob.jsx](file:///d:/SkillBridge/client/src/components/PostJob.jsx) | `jobs` |

---
*Note: This report guarantees you are fully prepared to explain both generative LLM interactions and local computational heuristic methods within your codebase.*
