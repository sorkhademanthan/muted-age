const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const Order = require('../models/Order');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const { sendTicketNotification } = require('../utils/emailNotifications');

// ============================================
// USER ROUTES - Ticket Management
// ============================================

/**
 * @route   POST /api/support/tickets
 * @desc    Create a new support ticket
 * @access  Private (User)
 */
router.post('/tickets', authMiddleware, async (req, res) => {
  try {
    const {
      subject,
      description,
      category,
      priority,
      relatedOrderId,
      relatedProductId,
    } = req.body;

    // Validation
    if (!subject || !description || !category) {
      return res.status(400).json({
        success: false,
        error: 'Please provide subject, description, and category',
      });
    }

    // Validate related order if provided
    if (relatedOrderId) {
      const order = await Order.findOne({
        _id: relatedOrderId,
        user: req.user._id,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found or does not belong to you',
        });
      }
    }

    // Validate related product if provided
    if (relatedProductId) {
      const product = await Product.findById(relatedProductId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found',
        });
      }
    }

    // Create ticket
    const ticket = new Complaint({
      user: req.user.id,
      subject,
      description,
      category,
      priority: priority || 'medium',
      relatedOrder: relatedOrderId || undefined,
      relatedProduct: relatedProductId || undefined,
    });

    // Add initial message
    await ticket.addMessage(req.user.id, 'user', description);

    await ticket.save();

    // Populate for response
    await ticket.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'relatedOrder', select: 'orderNumber' },
      { path: 'relatedProduct', select: 'name slug' },
    ]);

    // Send email notification to admins
    try {
      await sendTicketNotification('new', ticket);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      data: ticket,
      message: 'Support ticket created successfully',
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create ticket',
      details: error.message,
    });
  }
});

/**
 * @route   GET /api/support/tickets
 * @desc    Get all tickets for current user
 * @access  Private (User)
 */
router.get('/tickets', authMiddleware, async (req, res) => {
  try {
    const { status, category } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (category) filters.category = category;

    const tickets = await Complaint.getByUser(req.user.id, filters);

    res.json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    console.error('Get user tickets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tickets',
    });
  }
});

/**
 * @route   GET /api/support/tickets/:ticketId
 * @desc    Get ticket details with full conversation
 * @access  Private (User - own tickets only)
 */
router.get('/tickets/:ticketId', authMiddleware, async (req, res) => {
  try {
    const ticket = await Complaint.findOne({
      _id: req.params.ticketId,
      user: req.user.id,
    })
      .populate('user', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName')
      .populate('relatedOrder', 'orderNumber')
      .populate('relatedProduct', 'name slug')
      .populate('messages.sender', 'firstName lastName');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found',
      });
    }

    // Filter out internal messages for users
    const userVisibleTicket = ticket.toObject();
    userVisibleTicket.messages = userVisibleTicket.messages.filter(msg => !msg.isInternal);

    res.json({
      success: true,
      data: userVisibleTicket,
    });
  } catch (error) {
    console.error('Get ticket details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve ticket',
    });
  }
});

/**
 * @route   POST /api/support/tickets/:ticketId/messages
 * @desc    Add a reply to ticket
 * @access  Private (User - own tickets only)
 */
router.post('/tickets/:ticketId/messages', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    const ticket = await Complaint.findOne({
      _id: req.params.ticketId,
      user: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found',
      });
    }

    // Check if ticket is closed
    if (ticket.status === 'closed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot reply to closed ticket. Please reopen it first.',
      });
    }

    // Add message
    const newMessage = await ticket.addMessage(req.user.id, 'user', message);

    // If ticket was resolved, move to in-progress
    if (ticket.status === 'resolved') {
      await ticket.updateStatus('in-progress');
    }

    // Send email notification
    try {
      await sendTicketNotification('reply', ticket, newMessage);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    res.json({
      success: true,
      data: newMessage,
      message: 'Reply added successfully',
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add reply',
    });
  }
});

/**
 * @route   POST /api/support/tickets/:ticketId/reopen
 * @desc    Reopen a resolved ticket
 * @access  Private (User - own tickets only)
 */
router.post('/tickets/:ticketId/reopen', authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a reason for reopening',
      });
    }

    const ticket = await Complaint.findOne({
      _id: req.params.ticketId,
      user: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found',
      });
    }

    // Check if can be reopened
    if (!ticket.canBeReopened()) {
      return res.status(400).json({
        success: false,
        error: 'This ticket cannot be reopened. The 7-day reopen period has expired. Please create a new ticket.',
      });
    }

    await ticket.reopen(req.user.id, reason);

    // Send notification
    try {
      await sendTicketNotification('reopen', ticket);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    res.json({
      success: true,
      data: ticket,
      message: 'Ticket reopened successfully',
    });
  } catch (error) {
    console.error('Reopen ticket error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reopen ticket',
      details: error.message,
    });
  }
});

/**
 * @route   GET /api/support/my-tickets/summary
 * @desc    Get summary of user's tickets
 * @access  Private (User)
 */
router.get('/my-tickets/summary', authMiddleware, async (req, res) => {
  try {
    const [open, inProgress, resolved] = await Promise.all([
      Complaint.countDocuments({ user: req.user.id, status: 'open' }),
      Complaint.countDocuments({ user: req.user.id, status: 'in-progress' }),
      Complaint.countDocuments({ user: req.user.id, status: 'resolved' }),
    ]);

    const recentTickets = await Complaint.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('ticketNumber subject status category priority createdAt');

    res.json({
      success: true,
      data: {
        summary: {
          open,
          inProgress,
          resolved,
          total: open + inProgress + resolved,
        },
        recentTickets,
      },
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve summary',
    });
  }
});

// ============================================
// ADMIN ROUTES - Ticket Management
// ============================================

/**
 * @route   GET /api/support/admin/tickets
 * @desc    Get all tickets with filters (Admin)
 * @access  Private (Admin)
 */
router.get('/admin/tickets', authMiddleware, adminOnly, async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      category: req.query.category,
      priority: req.query.priority,
      assignedTo: req.query.assignedTo,
      unassigned: req.query.unassigned,
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
    };

    const result = await Complaint.getAllWithFilters(filters);

    res.json({
      success: true,
      count: result.tickets.length,
      data: result.tickets,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Admin get tickets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tickets',
    });
  }
});

/**
 * @route   GET /api/support/admin/tickets/:ticketId
 * @desc    Get ticket details including internal notes (Admin)
 * @access  Private (Admin)
 */
router.get('/admin/tickets/:ticketId', authMiddleware, adminOnly, async (req, res) => {
  try {
    const ticket = await Complaint.findById(req.params.ticketId)
      .populate('user', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName email')
      .populate('relatedOrder')
      .populate('relatedProduct')
      .populate('messages.sender', 'firstName lastName email role');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found',
      });
    }

    res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('Admin get ticket details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve ticket',
    });
  }
});

/**
 * @route   PATCH /api/support/admin/tickets/:ticketId/assign
 * @desc    Assign ticket to admin
 * @access  Private (Admin)
 */
router.patch('/admin/tickets/:ticketId/assign', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { adminId } = req.body;

    const ticket = await Complaint.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found',
      });
    }

    await ticket.assignTo(adminId || req.user.id);

    // Add internal note
    await ticket.addMessage(
      req.user.id,
      'admin',
      `Ticket assigned to admin`,
      true // internal note
    );

    await ticket.populate('assignedTo', 'firstName lastName');

    res.json({
      success: true,
      data: ticket,
      message: 'Ticket assigned successfully',
    });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign ticket',
    });
  }
});

/**
 * @route   PATCH /api/support/admin/tickets/:ticketId/status
 * @desc    Update ticket status
 * @access  Private (Admin)
 */
router.patch('/admin/tickets/:ticketId/status', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Valid status is required',
      });
    }

    const ticket = await Complaint.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found',
      });
    }

    await ticket.updateStatus(status, req.user.id);

    // Send notification
    try {
      await sendTicketNotification('status_update', ticket);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    res.json({
      success: true,
      data: ticket,
      message: `Ticket status updated to ${status}`,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update status',
    });
  }
});

/**
 * @route   PATCH /api/support/admin/tickets/:ticketId/priority
 * @desc    Update ticket priority
 * @access  Private (Admin)
 */
router.patch('/admin/tickets/:ticketId/priority', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { priority } = req.body;

    if (!priority || !['low', 'medium', 'high', 'urgent'].includes(priority)) {
      return res.status(400).json({
        success: false,
        error: 'Valid priority is required',
      });
    }

    const ticket = await Complaint.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found',
      });
    }

    await ticket.updatePriority(priority);

    // Add internal note
    await ticket.addMessage(
      req.user.id,
      'admin',
      `Priority changed to ${priority}`,
      true
    );

    res.json({
      success: true,
      data: ticket,
      message: `Priority updated to ${priority}`,
    });
  } catch (error) {
    console.error('Update priority error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update priority',
    });
  }
});

/**
 * @route   POST /api/support/admin/tickets/:ticketId/messages
 * @desc    Admin reply to ticket
 * @access  Private (Admin)
 */
router.post('/admin/tickets/:ticketId/messages', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { message, isInternal } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    const ticket = await Complaint.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found',
      });
    }

    const newMessage = await ticket.addMessage(
      req.user.id,
      'admin',
      message,
      isInternal || false
    );

    // If ticket was open, move to in-progress
    if (ticket.status === 'open') {
      await ticket.updateStatus('in-progress');
    }

    // Send email to user (only for non-internal messages)
    if (!isInternal) {
      try {
        await sendTicketNotification('admin_reply', ticket, newMessage);
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }
    }

    res.json({
      success: true,
      data: newMessage,
      message: isInternal ? 'Internal note added' : 'Reply sent to user',
    });
  } catch (error) {
    console.error('Admin reply error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add reply',
    });
  }
});

/**
 * @route   PATCH /api/support/admin/tickets/:ticketId/notes
 * @desc    Update internal notes
 * @access  Private (Admin)
 */
router.patch('/admin/tickets/:ticketId/notes', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { notes } = req.body;

    const ticket = await Complaint.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found',
      });
    }

    ticket.internalNotes = notes;
    await ticket.save();

    res.json({
      success: true,
      data: ticket,
      message: 'Internal notes updated',
    });
  } catch (error) {
    console.error('Update notes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update notes',
    });
  }
});

/**
 * @route   GET /api/support/admin/statistics
 * @desc    Get support statistics dashboard
 * @access  Private (Admin)
 */
router.get('/admin/statistics', authMiddleware, adminOnly, async (req, res) => {
  try {
    const stats = await Complaint.getStatistics();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics',
    });
  }
});

/**
 * @route   POST /api/support/admin/tickets/bulk-close
 * @desc    Bulk close resolved tickets
 * @access  Private (Admin)
 */
router.post('/admin/tickets/bulk-close', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { ticketIds } = req.body;

    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of ticket IDs',
      });
    }

    const result = await Complaint.updateMany(
      {
        _id: { $in: ticketIds },
        status: 'resolved',
      },
      {
        $set: {
          status: 'closed',
          closedAt: new Date(),
          canReopen: false,
        },
      }
    );

    res.json({
      success: true,
      data: {
        updated: result.modifiedCount,
      },
      message: `${result.modifiedCount} tickets closed successfully`,
    });
  } catch (error) {
    console.error('Bulk close error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to close tickets',
    });
  }
});

module.exports = router;
