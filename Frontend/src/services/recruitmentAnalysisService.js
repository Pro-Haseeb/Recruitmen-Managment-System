import { generateMockAnalysisResults } from "../utils/recruitmentAnalysis/mockAnalysisData.js";
import { PROCESSING_STEPS } from "../utils/recruitmentAnalysis/constants.js";

const STEP_DURATION_MS = 1400;

/**
 * Frontend-only analysis runner. Replace body with API call when backend is ready.
 * @example API.post(`/jobs/${jobId}/ai-analyze`, { criteria })
 */
export async function runAiAnalysis({ job, applications, criteria }) {
  for (let i = 0; i < PROCESSING_STEPS.length; i++) {
    await delay(STEP_DURATION_MS);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("recruitai-analysis-progress", {
          detail: { stepIndex: i, stepId: PROCESSING_STEPS[i].id },
        })
      );
    }
  }

  await delay(600);
  return generateMockAnalysisResults(job, applications, criteria);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { PROCESSING_STEPS };
