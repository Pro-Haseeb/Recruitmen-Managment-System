/**
 * Returns true when the job application deadline has passed (end of deadline day).
 */
export function isJobDeadlinePassed(job) {
  if (!job?.deadline) return false;
  const deadline = new Date(job.deadline);
  if (Number.isNaN(deadline.getTime())) return false;
  deadline.setHours(23, 59, 59, 999);
  return Date.now() > deadline.getTime();
}

export function formatJobDeadline(job) {
  if (!job?.deadline) return "No deadline set";
  const d = new Date(job.deadline);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getApplicationPhase(job) {
  return isJobDeadlinePassed(job) ? "analysis_ready" : "collecting";
}
