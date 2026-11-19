const Task = require('../models/Task');
const { getWeekBounds, formatWeekLabel } = require('../utils/dateUtils');

// Get all tasks with optional search & filters
const getTasks = async (req, res) => {
  try {
    const { search, status, priority } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).sort({ dateTime: 1 });
    return res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get tasks grouped by Monday-Sunday weeks
const getWeeklyTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dateTime: 1 });

    const weekMap = {};
    let totalOpen = 0;
    let totalCompleted = 0;

    tasks.forEach((task) => {
      const { weekId, startOfWeek, endOfWeek } = getWeekBounds(task.dateTime);

      if (!weekMap[weekId]) {
        weekMap[weekId] = {
          weekId,
          startDate: startOfWeek,
          endDate: endOfWeek,
          weekLabel: formatWeekLabel(startOfWeek, endOfWeek),
          openTasks: 0,
          completedTasks: 0,
          totalTasks: 0,
          tasks: [],
        };
      }

      weekMap[weekId].tasks.push(task);
      weekMap[weekId].totalTasks += 1;

      if (task.status === 'Completed') {
        weekMap[weekId].completedTasks += 1;
        totalCompleted += 1;
      } else {
        weekMap[weekId].openTasks += 1;
        totalOpen += 1;
      }
    });

    const weeks = Object.values(weekMap);

    return res.json({
      success: true,
      data: {
        summary: {
          totalWeeks: weeks.length,
          totalAllTasks: tasks.length,
          totalOpen,
          totalCompleted,
        },
        weeks,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    return res.json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, dateTime } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (!dateTime) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const task = await Task.create(req.body);
    return res.status(201).json({ success: true, data: task });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    return res.json({ success: true, data: task });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Toggle or update status
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    task.status = req.body.status || (task.status === 'Completed' ? 'In Progress' : 'Completed');
    await task.save();

    return res.json({ success: true, data: task });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    return res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  getWeeklyTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
