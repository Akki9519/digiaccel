require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const connectDB = require('../config/db');

const sampleTasks = [
  // Current week tasks (assuming mid-November 2026 or relative to today)
  {
    title: 'Complete SDE-1 Assignment Submission',
    description: 'Ensure backend API and React frontend are properly tested and deployed on Netlify.',
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours from now
    priority: 'High',
    status: 'In Progress',
  },
  {
    title: 'Design Review with Product Team',
    description: 'Walk through Figma responsive mobile layout and swipe-to-delete interaction.',
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // tomorrow
    priority: 'High',
    status: 'In Progress',
  },
  {
    title: 'Code Refactoring & Unit Tests',
    description: 'Refactor date grouping helpers and verify Monday-Sunday boundary logic.',
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 48), // 2 days from now
    priority: 'Medium',
    status: 'Completed',
  },
  {
    title: 'Update Project Documentation',
    description: 'Write clear README with setup instructions, API contracts, and architecture summary.',
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 72),
    priority: 'Low',
    status: 'Completed',
  },

  // Next week tasks
  {
    title: 'Sprint Planning & Backlog Grooming',
    description: 'Review upcoming learner experience features and architecture milestones.',
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    priority: 'High',
    status: 'In Progress',
  },
  {
    title: 'Database Indexing & Query Tuning',
    description: 'Benchmark search endpoint and optimize text index performance.',
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
    priority: 'Medium',
    status: 'In Progress',
  },

  // Past week tasks
  {
    title: 'Initial Project Scaffolding',
    description: 'Setup Node/Express backend and Vite + React frontend with Tailwind CSS.',
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
    priority: 'High',
    status: 'Completed',
  },
  {
    title: 'Setup MongoDB Schema & Endpoints',
    description: 'Configure Mongoose Task model with title, dateTime, priority, and status fields.',
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    priority: 'Medium',
    status: 'Completed',
  },
];

const seedData = async () => {
  try {
    await connectDB();
    await Task.deleteMany({});
    console.log('[Seed] Cleared existing tasks.');

    const created = await Task.insertMany(sampleTasks);
    console.log(`[Seed] Successfully inserted ${created.length} sample tasks.`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
