// utils/parseResumeWithAI.js

import axios from "axios";

export const parseResumeWithAI = async (resumeTxt) => {

  try {

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",

      {
        model: "openai/gpt-4.1-mini",
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: `
You are an AI Resume Parser.

Extract:
- fullName
- email
- phone
- skills
- education
- experience
- projects

Return ONLY valid JSON.
            `,
          },

          {
            role: "user",
            content: resumeTxt,
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

    const aiText =
      response.data.choices[0].message.content;



   const cleanText = aiText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleanText);

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    return null;
  }
};