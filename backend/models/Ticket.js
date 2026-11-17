// backend/models/Ticket.js
import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['To Do', 'In Progress', 'Done'], 
    default: 'To Do' 
  },
  assignee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);