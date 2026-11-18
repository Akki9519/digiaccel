const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is mandatory'],
      trim: true,
      maxlength: [160, 'Title cannot exceed 160 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    dateTime: {
      type: Date,
      required: [true, 'Date & time is mandatory'],
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be either Low, Medium, or High',
      },
      default: 'Medium',
    },
    status: {
      type: String,
      enum: {
        values: ['In Progress', 'Completed'],
        message: 'Status must be either In Progress or Completed',
      },
      default: 'In Progress',
    },
  },
  {
    timestamps: true,
  }
);

// Index for search optimization
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ dateTime: 1 });
taskSchema.index({ status: 1 });

module.exports = mongoose.model('Task', taskSchema);
