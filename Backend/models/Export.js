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