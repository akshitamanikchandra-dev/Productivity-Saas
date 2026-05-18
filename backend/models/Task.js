const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Work', 'Personal', 'Health', 'Learning', 'Finance', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    priorityScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Calculate priority score dynamically
// Overdue tasks get 10000 (highest)
// Priority increases as deadline approaches
// Earlier created tasks break ties
taskSchema.methods.calculatePriority = function () {
  const now = new Date();
  const deadlineTime = new Date(this.deadline).getTime();
  const nowTime = now.getTime();
  const msPerDay = 1000 * 60 * 60 * 24;

  const daysUntilDeadline = (deadlineTime - nowTime) / msPerDay;

  if (daysUntilDeadline < 0) {
    // Overdue: highest priority. Use createdAt as tiebreaker (older = higher)
    const ageBonus = (nowTime - new Date(this.createdAt).getTime()) / msPerDay;
    return 10000 + ageBonus;
  }

  // Priority increases as deadline approaches
  // Max score for urgent tasks (< 1 day) is 1000
  // Score decreases for tasks further away
  const urgencyScore = Math.max(0, 1000 - daysUntilDeadline * 10);
  return urgencyScore;
};

// Static: compute and return priority score without saving
taskSchema.statics.computePriority = function (deadline, createdAt) {
  const now = new Date();
  const deadlineTime = new Date(deadline).getTime();
  const nowTime = now.getTime();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilDeadline = (deadlineTime - nowTime) / msPerDay;

  if (daysUntilDeadline < 0) {
    const ageBonus = (nowTime - new Date(createdAt || now).getTime()) / msPerDay;
    return 10000 + ageBonus;
  }

  return Math.max(0, 1000 - daysUntilDeadline * 10);
};

module.exports = mongoose.model('Task', taskSchema);
