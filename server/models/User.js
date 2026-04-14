import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  solvedQuestions: [{
    questionId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Question', 
      required: true 
    },
    status: { type: String, enum: ['Solved', 'Attempted'], default: 'Solved' },
    timestamp: { type: Date, default: Date.now },
    topic: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
