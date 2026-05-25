export const DEFAULT_CRITERIA = [
  { id: "experience", label: "Experience", weight: 20 },
  { id: "education", label: "Education", weight: 15 },
  { id: "certifications", label: "Certifications", weight: 10 },
  { id: "projects", label: "Projects", weight: 15 },
  { id: "skills", label: "Skills", weight: 25 },
  { id: "communication", label: "Communication", weight: 15 },
];

/** Short labels shown in UI (easy to scan) */
export const CRITERIA_META = {
  experience: {
    label: "Experience",
    description: "Past jobs and years in the field",
  },
  education: {
    label: "Education",
    description: "Degrees and academic background",
  },
  certifications: {
    label: "Certifications",
    description: "Licenses and professional certificates",
  },
  projects: {
    label: "Projects",
    description: "Portfolio and practical work",
  },
  skills: {
    label: "Skills",
    description: "Tools and technologies for the role",
  },
  communication: {
    label: "Communication",
    description: "Writing, teamwork, and clarity",
  },
};

export const WEIGHT_PRESETS = {
  balanced: {
    label: "Balanced",
    weights: { experience: 20, education: 15, certifications: 10, projects: 15, skills: 25, communication: 15 },
  },
  skillsFocused: {
    label: "Skills focused",
    weights: { experience: 15, education: 10, certifications: 5, projects: 15, skills: 40, communication: 15 },
  },
  experienceFocused: {
    label: "Experience focused",
    weights: { experience: 35, education: 15, certifications: 10, projects: 10, skills: 20, communication: 10 },
  },
};

export const PROCESSING_STEPS = [
  { id: "reading", label: "Reading resumes", criteriaHint: "experience" },
  { id: "extracting", label: "Extracting skills & projects", criteriaHint: "skills" },
  { id: "matching", label: "Matching education & certifications", criteriaHint: "education" },
  { id: "scoring", label: "Scoring communication & fit", criteriaHint: "communication" },
  { id: "ranking", label: "Ranking candidates", criteriaHint: null },
];

export const RESULT_TABS = [
  { id: "all", label: "All" },
  { id: "recommended", label: "Recommended" },
  { id: "average", label: "Average" },
  { id: "rejected", label: "Rejected" },
];

export const WEIGHT_TARGET = 100;

export function getCriteriaLabel(criterion) {
  return CRITERIA_META[criterion.id]?.label || criterion.label;
}

export function applyPreset(presetKey) {
  const preset = WEIGHT_PRESETS[presetKey];
  if (!preset) return DEFAULT_CRITERIA.map((c) => ({ ...c }));
  return DEFAULT_CRITERIA.map((c) => ({
    ...c,
    weight: preset.weights[c.id] ?? c.weight,
  }));
}
