const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// Helper: refresh all priority scores for a user's tasks
const refreshPriorities = async (userId) => {
  const tasks = await Task.find({ user: userId });
  const updates = tasks.map((task) => {
    const score = Task.computePriority(task.deadline, task.createdAt);
    return Task.findByIdAndUpdate(task._id, { priorityScore: score });
  });
  await Promise.all(updates);
};

// GET /api/tasks - Get all tasks sorted by priority
router.get('/', protect, async (req, res) => {
  try {
    // Refresh priorities before returning
    const tasks = await Task.find({ user: req.user._id });
    const updatedTasks = await Promise.all(
      tasks.map(async (task) => {
        const score = Task.computePriority(task.deadline, task.createdAt);
        task.priorityScore = score;
        await task.save();
        return task;
      })
    );

    // Sort: highest priority first, tie-break by createdAt (older first)
    updatedTasks.sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    res.json(updatedTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/tasks - Create a task
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, status, deadline } = req.body;

    if (!title || !deadline || !category) {
      return res.status(400).json({ message: 'Title, category, and deadline are required' });
    }

    const task = new Task({
      user: req.user._id,
      title,
      description,
      category,
      status: status || 'Pending',
      deadline,
    });

    // Calculate initial priority
    task.priorityScore = task.calculatePriority();
    await task.save();

    // Emit socket event
    req.app.get('io').to(req.user._id.toString()).emit('task:created', task);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.priorityScore = Task.computePriority(task.deadline, task.createdAt);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, category, status, deadline } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (category !== undefined) task.category = category;
    if (status !== undefined) task.status = status;
    if (deadline !== undefined) task.deadline = deadline;

    // Recalculate priority
    task.priorityScore = task.calculatePriority();
    await task.save();

    // Emit socket event
    req.app.get('io').to(req.user._id.toString()).emit('task:updated', task);

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();

    // Emit socket event
    req.app.get('io').to(req.user._id.toString()).emit('task:deleted', { _id: req.params.id });

    res.json({ message: 'Task deleted', _id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
