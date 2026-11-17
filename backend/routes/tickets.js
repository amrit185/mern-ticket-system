// backend/routes/tickets.js
import express from 'express';
import Ticket from '../models/Ticket.js';
import Project from '../models/Project.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: List all tickets for a specific project
router.get('/:projectId', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ project: req.params.projectId })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 }); // Newest first
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Create a new ticket in a project
router.post('/:projectId', protect, async (req, res) => {
  try {
    const { title, description, priority, assignee } = req.body;
    const projectId = req.params.projectId;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newTicket = new Ticket({
      title,
      description,
      priority,
      status: 'To Do',
      project: projectId,
      createdBy: req.user.id,
      assignee: assignee || req.user.id // Default to creator if no assignee
    });

    const savedTicket = await newTicket.save();
    
    // Return populated ticket so the frontend immediately has user data
    const populatedTicket = await Ticket.findById(savedTicket._id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update a ticket (status, priority, assignee, etc.)
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, description, status, priority, assignee } = req.body;
    
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, assignee },
      { new: true } // Returns the updated document
    )
    .populate('assignee', 'name email')
    .populate('createdBy', 'name email');

    if (!updatedTicket) return res.status(404).json({ message: 'Ticket not found' });

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Remove a ticket
router.delete('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;