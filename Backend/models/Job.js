import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    salary: String,
    degree: String,


    skills: [String],

    experienceLevel: String,

    education: String,

    location: String,

    deadline: Date,

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },


    criteriaWeights: {
      skills: {
        type: Number,
        default: 40,
        min: 0,
        max: 100
      },

      experience: {
        type: Number,
        default: 25,
        min: 0,
        max: 100
      },

      education: {
        type: Number,
        default: 20,
        min: 0,
        max: 100
      },

      certifications: {
        type: Number,
        default: 10,
        min: 0,
        max: 100
      },

      projects: {
        type: Number,
        default: 5,
        min: 0,
        max: 100
      },
    },
    screeningStarted: {
      type: Boolean,
      default: false
    },

    rankingGenerated: {
      type: Boolean,
      default: false
    }
  },

  { timestamps: true }
);

jobSchema.pre("save", function () {

  if (!this.criteriaWeights) {
    throw new Error("Criteria weights are required");
  }

  const total =
    (this.criteriaWeights.skills || 0) +
    (this.criteriaWeights.experience || 0) +
    (this.criteriaWeights.education || 0) +
    (this.criteriaWeights.certifications || 0) +
    (this.criteriaWeights.projects || 0);

  if (total !== 100) {
    throw new Error("Criteria weights must equal 100");
  }
});

export default mongoose.model("Job", jobSchema);