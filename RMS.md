# Recruitment Management System (RMS)

## Backend Models Specification (MERN)

---

## 1. Company Model

```js
const companySchema = new mongoose.Schema({
  name: String,
  website: String,
  size: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
}, { timestamps: true });
```

---

## 2. Demo Request Model

```js
const demoRequestSchema = new mongoose.Schema({
  companyName: String,
  website: String,
  companySize: String,
  officialEmail: String,
  contactNumber: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
}, { timestamps: true });
```

---

## 3. User Model

```js
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["system_owner", "company_admin", "hr", "candidate"]
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null
  }
}, { timestamps: true });
```

---

## 4. Job Model

```js
const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  skills: [String],
  experienceLevel: String,
  education: String,
  location: String,
  deadline: Date,
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open"
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  criteriaWeights: {
    skills: { type: Number, default: 40, min: 0, max: 100 },
    experience: { type: Number, default: 25, min: 0, max: 100 },
    education: { type: Number, default: 20, min: 0, max: 100 },
    certifications: { type: Number, default: 10, min: 0, max: 100 },
    projects: { type: Number, default: 5, min: 0, max: 100 }
  },
  screeningStarted: { type: Boolean, default: false },
  rankingGenerated: { type: Boolean, default: false }
}, { timestamps: true });

// Pre-save hook validation: total criteria weights must equal 100
jobSchema.pre("save", function () {
  if (!this.criteriaWeights) throw new Error("Criteria weights are required");
  const total =
    (this.criteriaWeights.skills || 0) +
    (this.criteriaWeights.experience || 0) +
    (this.criteriaWeights.education || 0) +
    (this.criteriaWeights.certifications || 0) +
    (this.criteriaWeights.projects || 0);
  if (total !== 100) throw new Error("Criteria weights must equal 100");
});
```

---

## 5. Application Model

```js
const applicationSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  },
  candidateName: String,
  candidateEmail: String,
  resumetxt: String,
  resume: String,
  parsedResume: {
    fullName: String,
    email: String,
    phone: String,
    skills: mongoose.Schema.Types.Mixed,
    education: mongoose.Schema.Types.Mixed,
    experience: mongoose.Schema.Types.Mixed,
    projects: mongoose.Schema.Types.Mixed
  },
  score: { type: Number, default: 0 },
  scoreBreakdown: {
    skills: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    certifications: { type: Number, default: 0 },
    projects: { type: Number, default: 0 }
  },
  feedback: String,
  status: {
    type: String,
    enum: ["applied", "shortlisted", "rejected"],
    default: "applied"
  }
}, { timestamps: true });
```
```

---

## 6. Interview Model

```js
const interviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application"
  },
  scheduledAt: Date,
  meetingLink: String,
  interviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  feedback: String,
  result: {
    type: String,
    enum: ["pending", "pass", "fail"]
  }
}, { timestamps: true });
```

---

## 7. Activity Logs Model

```js
const logSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  action: String,
  entityType: String,
  entityId: mongoose.Schema.Types.ObjectId,
  details: String
}, { timestamps: true });
```

---

## 8. Export Log Model

```js
const exportLogSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application"
  },
  exportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  exportedAt: Date
}, { timestamps: true });
```

---

## Key Engineering Rules

* Always filter data by company (multi-tenant isolation)
* Never allow duplicate applications (DB index enforced)
* Store both raw CV and parsed data
* Use role-based access control (RBAC)
* Log critical actions for audit

---

## Current Progress

* **Authentication & Authorization**: Integrated JWT & bcrypt. Role-based access control (RBAC) is active for System Owner, Company Admin, HR, and Candidate.
* **Company & Team Management**: Implemented HR registration and deletion with dynamic multi-tenant company bounds and a limit of 3 HR users per company.
* **Job Board Engine**: Created APIs and frontend screens for Job postings. Integrated dynamic Custom Criteria Weights (Skills, Experience, Education, Projects, Certifications) that sum up to 100.
* **Resume Parsing & AI Scoring**: Connected CV text extraction, AI parsing (GPT-4o-mini via OpenRouter), and dynamic AI scoring. The system ranks candidates based on customized job requirements.
* **Admin Dashboard & Controls**: Added real-time user blocking/unblocking, paginated accounts ledger, status filters, and interactive demo requests logging.
* **Candidate Application Management**: Implemented secure application status filtering (Pending, Shortlisted, Rejected), interactive candidate profile drawers, detailed AI-evaluated score breakdown metrics, real-time job-specific leaderboards with candidate ranking calculations, and instant shortlist/reject action controls.
* **Modern Premium Frontend**: Beautiful Glassmorphism dark-theme UX, responsive layouts, modular sidebars, and slide-out detail drawers.

---

## Next Steps

1. Complete and integrate Interview scheduling engine (Interviews module API & Candidate notifications).
2. Develop comprehensive export tools (PDF/Excel data reports for shortlisted candidates).
3. Expand AI criteria models to support advanced NLP-based domain semantic matching.
4. Perform final end-to-end integration testing and prepare production deployment build.

---

This document defines the backend foundation and progress of RMS. Any deviation will break system consistency.
