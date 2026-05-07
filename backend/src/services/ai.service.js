import { client as model } from "../configs/ai.config.js";

const sleep = (ms) =>
    new Promise((r) =>
        setTimeout(r, ms)
    );

export const getMatchScore = async (
    resumeText,
    jobDescription
) => {

    let retries = 3;

    while (retries > 0) {

        try {

            const prompt = `
You are an ATS AI recruiter.

Analyze the resume against
the job description.

Return ONLY valid JSON.

{
  "score": number,
  "matchedSkills": [],
  "missingSkills": [],
  "summary": ""
}

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}
            `;

            const result =
                await model.generateContent(
                    prompt
                );

            const response =
                await result.response;

            const text =
                response.text();

            const cleaned = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            return JSON.parse(cleaned);

        } catch (err) {

            retries--;

            console.error("AI ERROR:", err.message);

            if (
                retries > 0
            ) {

                console.log(
                    "Retrying..."
                );

                await sleep(2000);

                continue;
            }

            return {
                score: 0,
                matchedSkills: [],
                missingSkills: [],
                summary:
                    "AI analysis unavailable",
            };
        }
    }
};