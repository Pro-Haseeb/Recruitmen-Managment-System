const PREFIX = "recruitai-analysis";

export function saveAnalysisSession(jobId, payload) {
  try {
    sessionStorage.setItem(`${PREFIX}-${jobId}`, JSON.stringify(payload));
  } catch (e) {
    console.warn("Failed to persist analysis session", e);
  }
}

export function loadAnalysisSession(jobId) {
  try {
    const raw = sessionStorage.getItem(`${PREFIX}-${jobId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAnalysisSession(jobId) {
  sessionStorage.removeItem(`${PREFIX}-${jobId}`);
}
