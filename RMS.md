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
    enum: ["open", "closed"]
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });
```

---

## 5. Application Model

```js
const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  resumeUrl: String,
  parsedData: {
    skills: [String],
    education: String,
    experience: String
  },
  aiScore: Number,
  aiJustification: String,
  status: {
    type: String,
    enum: [
      "applied",
      "shortlisted",
      "rejected",
      "interview",
      "selected",
      "exported"
    ],
    default: "applied"
  },
  notes: String,
  exported: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Duplicate prevention
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
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

* Backend setup completed
* Database schema designed (production-level)
* Ready for Auth system implementation

---

## Next Steps

1. Implement User authentication (JWT + bcrypt)
2. Build Auth APIs
3. Start Job module APIs
4. Connect Application pipeline

---

This document defines the backend foundation of RMS. Any deviation will break system consistency.
