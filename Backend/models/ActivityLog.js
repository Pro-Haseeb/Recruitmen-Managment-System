const logSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  action: String,
  entityType: String, // job, application, interview
  entityId: mongoose.Schema.Types.ObjectId,

  details: String

}, { timestamps: true });