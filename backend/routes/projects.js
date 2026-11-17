// backend/routes/projects.js
import express from 'express';
import Project from '../models/Project.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: List all projects for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    // Find projects where the user is either the owner or a team member
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { teamMembers: req.user.id }]
    }).populate('owner', 'name email');
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Create a new project
router.post('/', protect, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const project = new Project({
      title,
      description,
      owner: req.user.id,
      teamMembers: [req.user.id] // Owner is a member by default
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Delete a project (Only owner can delete)
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Ensure only the owner can delete
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;