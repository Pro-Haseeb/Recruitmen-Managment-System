import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    salary: String,

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

    requiredSkills: [String],

    requiredDegree: {
      type: String,
    },

    minimumExperience: {
      type: Number,
      default: 0,
    },

    requiredCertifications: [String],

    criteriaWeights: {
      skills: {
        type: Number,
        default: 40,
      },

      experience: {
        type: Number,
        default: 25,
      },

      education: {
        type: Number,
        default: 20,
      },

      certifications: {
        type: Number,
        default: 10,
      },

      projects: {
        type: Number,
        default: 5,
      },
    },
  },

  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);