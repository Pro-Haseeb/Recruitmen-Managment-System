import axios from "axios";

export const scoreResumeWithAI = async (jobDetails, parsedResumeData) => {
  try {
    let skillsStr = "";
    if (parsedResumeData?.skills) {
      if (Array.isArray(parsedResumeData.skills)) {
        skillsStr = parsedResumeData.skills.join(", ");
      } else if (typeof parsedResumeData.skills === "object") {
        skillsStr = Object.entries(parsedResumeData.skills)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
          .join("; ");
      } else {
        skillsStr = String(parsedResumeData.skills);
      }
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4.1-mini",
        max_tokens: 600,
        messages: [
          {
            role: "system",
            content: `
You are an expert recruiter assistant AI.
Your job is to score a candidate's parsed resume against a job description's requirements based on custom weights.

Calculate individual scores for each section. The maximum score for each section is defined by the weights below:
- Skills (Max Score: ${jobDetails.criteriaWeights?.skills ?? 40})
- Experience (Max Score: ${jobDetails.criteriaWeights?.experience ?? 25})
- Education (Max Score: ${jobDetails.criteriaWeights?.education ?? 20})
- Certifications (Max Score: ${jobDetails.criteriaWeights?.certifications ?? 10})
- Projects (Max Score: ${jobDetails.criteriaWeights?.projects ?? 5})

Calculate the final overall score as the sum of all section scores (Max: 100).
Also provide a short explanation (1-2 sentences) detailing your feedback.

Return ONLY a valid JSON object matching this structure:
{
  "score": number, // total score out of 100
  "scoreBreakdown": {
    "skills": number,
    "experience": number,
    "education": number,
    "certifications": number,
    "projects": number
  },
  "feedback": "string"
}
            `,
          },
          {
            role: "user",
            content: `
Job Details:
- Title: ${jobDetails.title}
- Required Skills: ${jobDetails.skills?.join(", ") ?? ""}
- Required Experience Level: ${jobDetails.experienceLevel ?? ""}
- Required Education: ${jobDetails.education ?? ""}

Candidate Resume:
- Skills: ${skillsStr}
- Experience: ${JSON.stringify(parsedResumeData?.experience ?? "")}
- Education: ${JSON.stringify(parsedResumeData?.education ?? "")}
- Projects: ${JSON.stringify(parsedResumeData?.projects ?? "")}
            `,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiText = response.data.choices[0].message.content;
    const cleanText = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Scoring Error:", error.response?.data || error.message);
    return null;
  }
};
