const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user (optional ?status=)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const query = { user: req.user._id };
    if (req.query.status) {
      query.status = req.query.status;
    }
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching tasks' 
    });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { title, description, status, priority, dueDate } = req.body;
    
    const task = new Task({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      user: req.user._id
    });

    await task.save();

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating task' 
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', [
  auth,
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    const { title, description, status, priority, dueDate } = req.body;
    
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

    await task.save();

    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating task' 
    });
  }
});

// @route   PATCH /api/tasks/:id/status
// @desc    Update task status
// @access  Private
router.patch('/:id/status', [
  auth,
  body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    task.status = req.body.status;
    await task.save();

    res.json({
      success: true,
      data: task,
      message: 'Task status updated successfully'
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating task status' 
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting task' 
    });
  }
});

module.exports = router;
