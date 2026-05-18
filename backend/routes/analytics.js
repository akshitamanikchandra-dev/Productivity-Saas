const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// GET /api/analytics - Get productivity insights
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const allTasks = await Task.find({ user: userId });

    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.status === 'Completed').length;
    const pending = allTasks.filter((t) => t.status === 'Pending').length;
    const inProgress = allTasks.filter((t) => t.status === 'In Progress').length;

    // Tasks completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedToday = allTasks.filter(
      (t) => t.status === 'Completed' && new Date(t.updatedAt) >= today
    ).length;

    // Category-wise distribution
    const categoryMap = {};
    allTasks.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + 1;
    });
    const categoryDistribution = Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count,
    }));

    // Most active category
    const mostActiveCategory =
      categoryDistribution.sort((a, b) => b.count - a.count)[0]?.name || 'N/A';

    // Overdue tasks
    const now = new Date();
    const overdue = allTasks.filter(
      (t) => t.status !== 'Completed' && new Date(t.deadline) < now
    ).length;

    // Completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      total,
      completed,
      pending,
      inProgress,
      completedToday,
      overdue,
      completionRate,
      mostActiveCategory,
      categoryDistribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
