const Task = require('../models/Task');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const filter = req.user.role === 'Member' ? { assignedTo: req.user._id } : {};

    const totalTasks = await Task.countDocuments(filter);
    
    const statusCounts = await Task.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get completed tasks
    const completedTasks = await Task.countDocuments({
      ...filter,
      status: 'Done'
    });

    // Get pending tasks (Todo + In Progress)
    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: { $in: ['Todo', 'In Progress'] }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueTasks = await Task.countDocuments({
      ...filter,
      dueDate: { $lt: today },
      status: { $ne: 'Done' }
    });

    let tasksPerUser = [];
    if (req.user.role === 'Admin') {
      tasksPerUser = await Task.aggregate([
        { $match: filter },
        { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        { $project: { name: { $ifNull: ['$user.name', 'Unassigned'] }, count: 1 } }
      ]);
    }

    const recentTasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('assignedTo', 'name')
      .populate('projectId', 'name');

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      statusCounts,
      tasksPerUser,
      recentTasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
