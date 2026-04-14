import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const questions = await Question.find({});
    // Format to match the frontend shape originally provided by mockData.js
    const formattedQuestions = questions.map(q => ({
      id: q._id,
      title: q.title,
      platform: q.platform,
      difficulty: q.difficulty,
      topic: q.topicTags && q.topicTags[0] ? q.topicTags[0] : 'Uncategorized',
      subtopic: q.topicTags && q.topicTags[1] ? q.topicTags[1] : undefined,
      link: q.leetcodeUrl,
      year: q.year,
      acceptance: q.acceptanceRate,
      companies: q.companies
    }));
    res.status(200).json(formattedQuestions);
  } catch (error) {
    console.error('Questions fetch error:', error);
    res.status(500).json({ message: 'Server error fetching questions' });
  }
});

export default router;
