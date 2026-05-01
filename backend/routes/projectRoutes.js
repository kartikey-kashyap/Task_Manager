const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, addMember, removeMember, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, admin, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, admin, updateProject)
  .delete(protect, admin, deleteProject);

router.route('/:id/members')
  .post(protect, admin, addMember)
  .delete(protect, admin, removeMember);

module.exports = router;
