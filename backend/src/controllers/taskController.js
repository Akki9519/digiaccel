const Task = require('../models/Task');
const { getWeekBounds, formatWeekLabel } = require('../utils/dateUtils');

/**
 * @desc Get all tasks with optional search and date filtering
 * @route GET /api/tasks
 */
const getTasks = async (req, res) => {
  try {
    const { search, status, priority, weekStart, weekEnd } = req.query;
    const filter = {};

    // Search keyword in title or description
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    // Filter by status
    if (status && ['In Progress', 'Completed'].includes(status)) {
      filter.status = status;
    }

    // Filter by priority
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      filter.priority = priority;
    }

    // Filter by week date range
    if (weekStart && weekEnd) {
      filter.dateTime = {
        $gte: new Date(weekStart),
        $lte: new Date(weekEnd),
      };
    }

    const tasks = await Task.find(filter).sort({ dateTime: 1 });
    return res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error('Error in getTasks:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching tasks', error: error.message });
  }
};

/**
 * @desc Get tasks organized by Monday-Sunday weeks with open vs completed metrics
 * @route GET /api/tasks/weekly
 */
const getWeeklyTasks = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    const tasks = await Task.find(filter).sort({ dateTime: 1 });

    // Group tasks by Monday-to-Sunday week
    const weekMap = new Map();

    tasks.forEach((task) => {
      const { startOfWeek, endOfWeek, weekId } = getWeekBounds(task.dateTime);

      if (!weekMap.has(weekId)) {
        weekMap.set(weekId, {
          weekId,
          startDate: startOfWeek,
          endDate: endOfWeek,
          weekLabel: formatWeekLabel(startOfWeek, endOfWeek),
          openTasks: 0,
          completedTasks: 0,
          totalTasks: 0,
          tasks: [],
        });
      }

      const weekGroup = weekMap.get(weekId);
      weekGroup.tasks.push(task);
      weekGroup.totalTasks += 1;

      if (task.status === 'Completed') {
        weekGroup.completedTasks += 1;
      } else {
        weekGroup.openTasks += 1;
      }
    });

    // Convert map to sorted array (chronological order)
    const weeks = Array.from(weekMap.values()).sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    // Compute global summary statistics
    let totalAllTasks = 0;
    let totalOpen = 0;
    let totalCompleted = 0;

    weeks.forEach((w) => {
      totalAllTasks += w.totalTasks;
      totalOpen += w.openTasks;
      totalCompleted += w.completedTasks;
    });

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalWeeks: weeks.length,
          totalAllTasks,
          totalOpen,
          totalCompleted,
        },
        weeks,
      },
    });
  } catch (error) {
    console.error('Error in getWeeklyTasks:', error);
    return res.status(500).json({ success: false, message: 'Server error grouping weekly tasks', error: error.message });
  }
};

/**
 * @desc Get a single task by ID
 * @route GET /api/tasks/:id
 */
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error('Error in getTaskById:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc Create a new task
 * @route POST /api/tasks
 */
const createTask = async (req, res) => {
  try {
    const { title, description, dateTime, priority, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is mandatory' });
    }

    if (!dateTime) {
      return res.status(400).json({ success: false, message: 'Date & Time is mandatory' });
    }

    const parsedDate = new Date(dateTime);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid Date & Time format' });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      dateTime: parsedDate,
      priority: priority || 'Medium',
      status: status || 'In Progress',
    });

    return res.status(201).json({ success: true, message: 'Task created successfully', data: newTask });
  } catch (error) {
    console.error('Error in createTask:', error);
    return res.status(500).json({ success: false, message: 'Server error creating task', error: error.message });
  }
};

/**
 * @desc Update an existing task
 * @route PUT /api/tasks/:id
 */
const updateTask = async (req, res) => {
  try {
    const { title, description, dateTime, priority, status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ success: false, message: 'Title cannot be empty' });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (dateTime !== undefined) {
      const parsedDate = new Date(dateTime);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid Date & Time format' });
      }
      task.dateTime = parsedDate;
    }

    if (priority !== undefined) {
      if (!['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({ success: false, message: 'Invalid priority' });
      }
      task.priority = priority;
    }

    if (status !== undefined) {
      if (!['In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      task.status = status;
    }

    const updatedTask = await task.save();
    return res.status(200).json({ success: true, message: 'Task updated successfully', data: updatedTask });
  } catch (error) {
    console.error('Error in updateTask:', error);
    return res.status(500).json({ success: false, message: 'Server error updating task', error: error.message });
  }
};

/**
 * @desc Toggle or set task status ('In Progress' <-> 'Completed')
 * @route PATCH /api/tasks/:id/status
 */
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (status) {
      if (!['In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Status must be In Progress or Completed' });
      }
      task.status = status;
    } else {
      // Toggle
      task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
    }

    const updatedTask = await task.save();
    return res.status(200).json({ success: true, message: 'Task status updated', data: updatedTask });
  } catch (error) {
    console.error('Error in updateTaskStatus:', error);
    return res.status(500).json({ success: false, message: 'Server error updating status', error: error.message });
  }
};

/**
 * @desc Delete task by ID
 * @route DELETE /api/tasks/:id
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.deleteOne();
    return res.status(200).json({ success: true, message: 'Task deleted successfully', data: { id: req.params.id } });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting task', error: error.message });
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
