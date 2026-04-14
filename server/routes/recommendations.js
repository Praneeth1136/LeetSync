import express from 'express';
import User from '../models/User.js';
import Question from '../models/Question.js';
import protect from '../middleware/protect.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('solvedQuestions.questionId');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const solvedQuestions = user.solvedQuestions.map(q => q.questionId);
    // Be careful of null references if a question was deleted
    const validSolvedQuestions = solvedQuestions.filter(q => q !== null);
    const solvedIds = validSolvedQuestions.map(q => q._id);

    // 1. Weakness Analysis
    // Get totality of database topics
    const allQuestions = await Question.find({});
    const topicCounts = {};
    const solvedTopicCounts = {};

    allQuestions.forEach(q => {
      q.topicTags.forEach(tag => {
        topicCounts[tag] = (topicCounts[tag] || 0) + 1;
        solvedTopicCounts[tag] = 0; // initialize
      });
    });

    validSolvedQuestions.forEach(q => {
      q.topicTags.forEach(tag => {
        if (solvedTopicCounts[tag] !== undefined) {
          solvedTopicCounts[tag] += 1;
        }
      });
    });

    // Calculate percentages
    const topicStats = Object.keys(topicCounts).map(topic => {
      const total = topicCounts[topic];
      const solved = solvedTopicCounts[topic];
      return {
        topic,
        percentage: total > 0 ? (solved / total) * 100 : 100
      };
    });

    // Sort ascending to get bottom 3
    topicStats.sort((a, b) => a.percentage - b.percentage);
    const weakTopics = topicStats.slice(0, 3).map(t => t.topic);

    // 2. Difficulty Scaling
    let difficultyDistribution = { Basic: 0, Easy: 0, Medium: 0, Hard: 0 };
    validSolvedQuestions.forEach(q => {
      if (difficultyDistribution[q.difficulty] !== undefined) {
        difficultyDistribution[q.difficulty] += 1;
      }
    });

    let favorDifficulty = 'Easy';
    let maxSolved = -1;
    for (const [diff, count] of Object.entries(difficultyDistribution)) {
      if (count > maxSolved) {
        maxSolved = count;
        favorDifficulty = diff;
      }
    }

    let targetDifficulties = [];
    if (favorDifficulty === 'Basic' || favorDifficulty === 'Easy') {
      targetDifficulties = ['Easy', 'Easy', 'Easy', 'Medium', 'Medium'];
    } else if (favorDifficulty === 'Medium') {
      targetDifficulties = ['Medium', 'Medium', 'Hard', 'Hard', 'Hard'];
    } else {
      targetDifficulties = ['Hard', 'Hard', 'Hard', 'Hard', 'Hard'];
    }

    // 3. Filtering and fetching
    // Get candidates excluding solved ones
    const candidates = await Question.find({
      _id: { $nin: solvedIds },
      topicTags: { $in: weakTopics }
    });

    // If not enough questions match weak topics, pull from entire unsolved set
    let fallbackCandidates = [];
    if (candidates.length < 5) {
       fallbackCandidates = await Question.find({
          _id: { $nin: solvedIds }
       });
    }

    let recommendations = [];
    let usedIds = new Set();

    const pickQuestion = (targetDiff, sourceList) => {
      const match = sourceList.find(q => q.difficulty === targetDiff && !usedIds.has(q._id.toString()));
      if (match) {
        usedIds.add(match._id.toString());
        return match;
      }
      return null;
    };

    for (let diff of targetDifficulties) {
       // try finding in weak topics
       let chosen = pickQuestion(diff, candidates);
       // fallback to any topic
       if (!chosen) chosen = pickQuestion(diff, fallbackCandidates);
       // ultimate fallback: any difficulty remaining in candidates
       if (!chosen) chosen = candidates.find(q => !usedIds.has(q._id.toString()));
       if (!chosen) chosen = fallbackCandidates.find(q => !usedIds.has(q._id.toString()));
       
       if (chosen) recommendations.push(chosen);
    }

    res.status(200).json({ recommended: recommendations, weakTopics, favorDifficulty });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Server error generating recommendations' });
  }
});

export default router;
