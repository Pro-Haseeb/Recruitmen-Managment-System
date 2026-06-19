export const STATUS_CONFIG = {
  scheduled: {
    label: "Scheduled",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.25)",
  },
  active: {
    label: "Active",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.25)",
  },
  completed: {
    label: "Completed",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.25)",
  },
  selected: {
    label: "Selected",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.25)",
  },
  rejected: {
    label: "Rejected",
    color: "#f87171",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
  },
};

export function getInterviewStatus(interview) {
  if (interview.result === "selected") return "selected";
  if (interview.result === "rejected") return "rejected";

  const now = Date.now();
  const interviewTime = new Date(interview.interviewDate).getTime();
  const twoHoursMs = 2 * 60 * 60 * 1000;

  if (interviewTime > now) return "scheduled";
  if (now - interviewTime <= twoHoursMs) return "active";
  return "completed";
}

export function isScheduledOrUpcoming(interview) {
  const status = getInterviewStatus(interview);
  return status === "scheduled" || status === "active";
}

export function isCandidateVisible(interview) {
  return interview.result === "pending";
}

export function formatInterviewDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatInterviewTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}
