// backend/routes/comments.js
import express from 'express';
import Comment from '../models/Comment.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: Fetch all comments for a specific ticket
router.get('/:ticketId', protect, async (req, res) => {
  try {
    const comments = await Comment.find({ ticket: req.params.ticketId })
      .populate('user', 'name')
      .sort({ createdAt: 1 }); // Oldest first, like a chat history
      
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Add a new comment to a ticket
router.post('/:ticketId', protect, async (req, res) => {
  try {
    const { text } = req.body;
    
    const newComment = new Comment({
      ticket: req.params.ticketId,
      user: req.user.id,
      text
    });

    const savedComment = await newComment.save();
    
    // Populate the user data so the frontend can immediately display the author's name
    const populatedComment = await Comment.findById(savedComment._id).populate('user', 'name');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;