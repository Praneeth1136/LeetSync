import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Question from '../models/Question.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables relative to server dir
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, '../../src/utils/questions.json'), 'utf-8');
    const questions = JSON.parse(rawData);

    // Format for our schema
    const formattedQuestions = questions.map(q => ({
      title: q.title,
      difficulty: q.difficulty,
      topicTags: [q.topic, q.subtopic].filter(Boolean),
      platform: q.platform,
      leetcodeUrl: q.link,
      acceptanceRate: q.acceptance,
      year: q.year,
      companies: q.companies || []
    }));

    // Avoid duplicates by using upsert
    console.log(`Starting insertion of ${formattedQuestions.length} questions...`);
    
    let added = 0;
    for (const q of formattedQuestions) {
       const result = await Question.updateOne(
         { leetcodeUrl: q.leetcodeUrl },
         { $set: q },
         { upsert: true }
       );
       if (result.upsertedCount > 0) added++;
    }

    console.log(`Database Seeded with ${added} new questions!`);
    process.exit();
  } catch (error) {
    console.error('Error with import:', error);
    process.exit(1);
  }
};

connectDB().then(importData);
