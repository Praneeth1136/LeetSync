import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Basic', 'Easy', 'Medium', 'Hard'], required: true },
  topicTags: [{ type: String }],
  platform: { type: String },
  leetcodeUrl: { type: String, required: true },
  acceptanceRate: { type: String },
  year: { type: String },
  companies: [{ type: String }]
}, { timestamps: true });

// Prevent duplicate URLs being added to the database
questionSchema.index({ leetcodeUrl: 1 }, { unique: true });

export default mongoose.model('Question', questionSchema);
