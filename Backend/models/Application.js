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

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });