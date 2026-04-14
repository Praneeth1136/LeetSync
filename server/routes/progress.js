import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get user progress
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json(user.solvedQuestions);
  } catch (error) {
    console.error('Progress get error:', error);
    res.status(500).json({ message: 'Server error fetching progress' });
  }
});

// Toggle question completion
router.post('/toggle', authMiddleware, async (req, res) => {
  try {
    const { questionId, topic } = req.body;

    if (!questionId) {
      return res.status(400).json({ message: 'Question ID is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingIndex = user.solvedQuestions.findIndex(q => q.questionId === String(questionId));

    if (existingIndex > -1) {
      // Question exists, so remove it (untick)
      user.solvedQuestions.splice(existingIndex, 1);
    } else {
      // Question doesn't exist, so add it (tick)
      user.solvedQuestions.push({ questionId: String(questionId), topic: topic || 'Uncategorized' });
    }

    await user.save();
    res.status(200).json({ message: 'Progress updated', solvedQuestions: user.solvedQuestions });
  } catch (error) {
    console.error('Progress toggle error:', error);
    res.status(500).json({ message: 'Server error updating progress' });
  }
});

export default router;
