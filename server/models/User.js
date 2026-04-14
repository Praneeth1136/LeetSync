import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String },
  solvedQuestions: [{
    questionId: { type: String, required: true },
    topic: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
