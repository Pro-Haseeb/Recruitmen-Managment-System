const MOCK_NAMES = [
  { name: "Ayesha Khan", email: "ayesha.khan@email.com", role: "Full Stack Developer" },
  { name: "Bilal Ahmed", email: "bilal.ahmed@email.com", role: "Backend Engineer" },
  { name: "Sara Malik", email: "sara.malik@email.com", role: "React Specialist" },
  { name: "Hassan Raza", email: "hassan.raza@email.com", role: "DevOps Engineer" },
  { name: "Fatima Noor", email: "fatima.noor@email.com", role: "UI/UX Developer" },
  { name: "Usman Ali", email: "usman.ali@email.com", role: "Data Analyst" },
  { name: "Zainab Shah", email: "zainab.shah@email.com", role: "Mobile Developer" },
  { name: "Omar Farooq", email: "omar.farooq@email.com", role: "Cloud Architect" },
];

const STRENGTH_POOL = [
  "Strong React & TypeScript portfolio",
  "Led cross-functional delivery teams",
  "Excellent system design fundamentals",
  "Proven API integration experience",
  "Outstanding communication in interviews",
  "AWS certified with production deployments",
  "Consistent open-source contributions",
];

const MISSING_POOL = [
  "GraphQL experience",
  "Kubernetes exposure",
  "Advanced statistics",
  "Public speaking / presentations",
  "Enterprise security compliance",
  "Legacy monolith migration",
];

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

function pick(pool, seed, count = 2) {
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(pool[(seed + i * 7) % pool.length]);
  }
  return [...new Set(out)];
}

function classifyScore(score) {
  if (score >= 75) return "recommended";
  if (score >= 45) return "average";
  return "rejected";
}

function buildCandidateFromApp(app, index, criteria, jobTitle) {
  const name =
    app.candidateName || app.candidate?.name || MOCK_NAMES[index % MOCK_NAMES.length].name;
  const email =
    app.candidateEmail || app.candidate?.email || MOCK_NAMES[index % MOCK_NAMES.length].email;
  const seed = hashSeed(`${name}-${jobTitle}-${index}`);
  const base = 42 + (seed % 52);
  const criteriaBoost = Math.min(12, (criteria?.length || 0) * 2);
  const aiScore = Math.min(98, base + criteriaBoost);
  const matchScore = Math.max(35, aiScore - (seed % 8));

  return {
    id: app._id || `mock-${index}`,
    name,
    email,
    appliedRole: app.job?.title || jobTitle || "Position",
    aiScore,
    matchScore,
    tier: classifyScore(aiScore),
    rank: 0,
    strengths: pick(STRENGTH_POOL, seed, 2),
    missingSkills: pick(MISSING_POOL, seed + 3, 2),
    criteriaBreakdown: (criteria || []).map((c, i) => ({
      id: c.id,
      label: c.label,
      score: Math.min(100, 50 + ((seed + i * 11) % 45)),
    })),
    statusLabel:
      classifyScore(aiScore) === "recommended"
        ? "Recommended"
        : classifyScore(aiScore) === "average"
          ? "Average"
          : "Rejected",
  };
}

/**
 * Builds ranked mock AI results from real applications or fallback pool.
 * Ready to swap for API response shape later.
 */
export function generateMockAnalysisResults(job, applications = [], criteria = []) {
  const jobTitle = job?.title || "Role";
  const source =
    applications.length > 0
      ? applications
      : MOCK_NAMES.map((m, i) => ({
          _id: `demo-app-${i}`,
          candidateName: m.name,
          candidateEmail: m.email,
          job: { title: jobTitle },
        }));

  const candidates = source
    .map((app, i) => buildCandidateFromApp(app, i, criteria, jobTitle))
    .sort((a, b) => b.aiScore - a.aiScore)
    .map((c, i) => ({ ...c, rank: i + 1 }));

  return {
    jobId: job?._id,
    jobTitle,
    analyzedAt: new Date().toISOString(),
    totalCandidates: candidates.length,
    recommended: candidates.filter((c) => c.tier === "recommended").length,
    average: candidates.filter((c) => c.tier === "average").length,
    rejected: candidates.filter((c) => c.tier === "rejected").length,
    candidates,
  };
}
