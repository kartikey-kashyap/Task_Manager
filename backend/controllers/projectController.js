const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: members || []
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Member') {
      query = { $or: [{ members: req.user._id }, { createdBy: req.user._id }] };
    }
    const projects = await Project.find(query).populate('createdBy', 'name email').populate('members', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy', 'name email').populate('members', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.members.some(m => m.toString() === userId)) {
      project.members.push(userId);
      await project.save();
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.members = project.members.filter(id => id.toString() !== userId);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    project.name = name || project.name;
    project.description = description !== undefined ? description : project.description;
    if (members) project.members = members;
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
