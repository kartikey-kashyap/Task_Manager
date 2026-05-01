const Task = require('../models/Task');
const Notification = require('../models/Notification');

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, projectId } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      projectId
    });

    if (assignedTo) {
      await Notification.create({
        userId: assignedTo,
        message: `You have been assigned a new task: ${title}`
      });
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.projectId) filter.projectId = req.query.projectId;
    if (req.user.role === 'Member') {
      filter.assignedTo = req.user._id;
    }
    const tasks = await Task.find(filter).populate('assignedTo', 'name email').populate('projectId', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, status, projectId } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    if (req.user.role === 'Member') {
      if (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      // Members can only update status
      if (status) task.status = status;
    } else {
      // Admins can update everything
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (priority) task.priority = priority;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
      if (status) task.status = status;
      if (projectId) task.projectId = projectId;
    }

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
