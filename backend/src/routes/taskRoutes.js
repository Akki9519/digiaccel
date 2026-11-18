const express = require('express');
const router = express.Router();
const {
  getTasks,
  getWeeklyTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');

// Weekly grouping route (must come before /:id)
router.get('/weekly', getWeeklyTasks);

// Basic CRUD routes
router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);

module.exports = router;
