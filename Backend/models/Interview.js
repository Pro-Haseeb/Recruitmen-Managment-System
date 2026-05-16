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