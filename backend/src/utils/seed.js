require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Task = require('../models/Task');
const connectDB = require('../config/db');

const sampleTasks = [
  // Exact Figma Screen Tasks for Today
  {
    title: 'Finishing Wireframe',
    description: 'Design mobile app wireframes and interactive user flows for client review',
    dateTime: new Date(),
    startTime: '09:00',
    endTime: '10:30',
    priority: 'High',
    status: 'In Progress',
  },
  {
    title: 'Meeting with team',
    description: 'Weekly sprint planning sync with product manager and developers',
    dateTime: new Date(),
    startTime: '11:00',
    endTime: '12:00',
    priority: 'Medium',
    status: 'In Progress',
  },
  {
    title: 'Buy a cat food',
    description: 'Pick up dry food and treats from pet store on 4th street',
    dateTime: new Date(),
    startTime: '17:00',
    endTime: '17:30',
    priority: 'Low',
    status: 'Completed',
  },
  {
    title: 'Finishing daily commission',
    description: 'Complete the freelance vector illustration asset pack',
    dateTime: new Date(),
    startTime: '18:00',
    endTime: '19:00',
    priority: 'Medium',
    status: 'Completed',
  },
  {
    title: 'Doing Homework',
    description: 'Finish math and computer science problem set chapter 4',
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // tomorrow
    startTime: '14:00',
    endTime: '15:30',
    priority: 'Medium',
    status: 'In Progress',
  },

  // Additional tasks for week representation
  {
    title: 'Code Refactoring & Unit Tests',
    description: 'Refactor date grouping helpers and verify Monday-Sunday boundary logic.',
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 48), // 2 days from now
    startTime: '10:00',
    endTime: '11:30',
    priority: 'Medium',
    status: 'Completed',
  },
  {
    title: 'Update Project Documentation',
    description: 'Write clear README with setup instructions, API contracts, and architecture summary.',
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 72),
    startTime: '16:00',
    endTime: '17:00',
    priority: 'Low',
    status: 'Completed',
  },
  {
    title: 'Initial Project Scaffolding',
    description: 'Setup Node/Express backend and Vite + React frontend with Tailwind CSS.',
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    startTime: '09:00',
    endTime: '11:00',
    priority: 'High',
    status: 'Completed',
  },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo_app_db';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    await Task.deleteMany({});
    console.log('[Seed] Cleared existing tasks.');

    const created = await Task.insertMany(sampleTasks);
    console.log(`[Seed] Successfully seeded ${created.length} sample tasks matching Figma design.`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  }
}

seed();
