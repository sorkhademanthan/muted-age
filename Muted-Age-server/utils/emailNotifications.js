const nodemailer = require('nodemailer');
const config = require('../config/config');

// ============================================
// NODEMAILER TRANSPORTER
// ============================================

let transporter = null;

/**
 * Initialize email transporter
 */
const initializeTransporter = () => {
  if (!config.email.user || !config.email.password) {
    console.warn('⚠️  Email credentials not configured. Notifications will be logged to console.');
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      service: config.email.service,
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });

    console.log('✅ Email transporter initialized');
    return transporter;
  } catch (error) {
    console.error('❌ Failed to initialize email transporter:', error);
    console.log('📧 Falling back to console logging for notifications');
    return null;
  }
};

/**
 * Get or create transporter
 */
const getTransporter = () => {
  if (!transporter) {
    transporter = initializeTransporter();
  }
  return transporter;
};

// ============================================
// EMAIL TEMPLATES
// ============================================

/**
 * New ticket created - Notification to Admin
 */
const newTicketAdminTemplate = (ticket) => {
  return {
    subject: `🎫 New Support Ticket: ${ticket.ticketNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .ticket-info { background: #fff; padding: 15px; margin: 10px 0; border-left: 4px solid #000; }
          .label { font-weight: bold; color: #666; }
          .priority-high { color: #dc3545; font-weight: bold; }
          .priority-urgent { color: #ff0000; font-weight: bold; animation: blink 1s infinite; }
          .priority-medium { color: #ffc107; font-weight: bold; }
          .priority-low { color: #28a745; font-weight: bold; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          @keyframes blink { 50% { opacity: 0.5; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎫 New Support Ticket</h1>
          </div>
          <div class="content">
            <div class="ticket-info">
              <p><span class="label">Ticket Number:</span> <strong>${ticket.ticketNumber}</strong></p>
              <p><span class="label">Priority:</span> <span class="priority-${ticket.priority}">${ticket.priority.toUpperCase()}</span></p>
              <p><span class="label">Category:</span> ${ticket.category}</p>
              <p><span class="label">Status:</span> ${ticket.status}</p>
            </div>
            
            <div class="ticket-info">
              <p><span class="label">Customer:</span> ${ticket.user.firstName} ${ticket.user.lastName}</p>
              <p><span class="label">Email:</span> ${ticket.user.email}</p>
              ${ticket.relatedOrder ? `<p><span class="label">Related Order:</span> ${ticket.relatedOrder.orderNumber}</p>` : ''}
            </div>

            <div class="ticket-info">
              <p><span class="label">Subject:</span></p>
              <h3>${ticket.subject}</h3>
              <p><span class="label">Description:</span></p>
              <p>${ticket.description}</p>
            </div>

            <p style="text-align: center; margin-top: 20px;">
              <a href="${config.frontendUrl}/admin/support/tickets/${ticket._id}" 
                 style="background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Ticket
              </a>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated notification from Muted Age Support System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

/**
 * New ticket confirmation - Notification to User
 */
const newTicketUserTemplate = (ticket) => {
  return {
    subject: `Ticket Created: ${ticket.ticketNumber} - We're here to help!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .ticket-box { background: #fff; padding: 15px; margin: 10px 0; border-left: 4px solid #000; }
          .label { font-weight: bold; color: #666; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Contacting Us!</h1>
          </div>
          <div class="content">
            <p>Hi ${ticket.user.firstName},</p>
            <p>We've received your support request and our team is reviewing it. Here are the details:</p>
            
            <div class="ticket-box">
              <p><span class="label">Ticket Number:</span> <strong>${ticket.ticketNumber}</strong></p>
              <p><span class="label">Subject:</span> ${ticket.subject}</p>
              <p><span class="label">Category:</span> ${ticket.category}</p>
              <p><span class="label">Status:</span> ${ticket.status}</p>
            </div>

            <p>We typically respond within 24 hours. You can track your ticket status and add additional information anytime.</p>

            <p style="text-align: center; margin-top: 20px;">
              <a href="${config.frontendUrl}/support/tickets/${ticket._id}" 
                 style="background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Ticket
              </a>
            </p>
          </div>
          <div class="footer">
            <p>Need help? Reply to this email or visit our support center.</p>
            <p>&copy; ${new Date().getFullYear()} Muted Age. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

/**
 * Admin replied to ticket - Notification to User
 */
const adminReplyTemplate = (ticket, message) => {
  return {
    subject: `Reply to Your Ticket: ${ticket.ticketNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .reply-box { background: #fff; padding: 15px; margin: 10px 0; border-left: 4px solid #28a745; }
          .label { font-weight: bold; color: #666; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>We've Responded to Your Ticket</h1>
          </div>
          <div class="content">
            <p>Hi ${ticket.user.firstName},</p>
            <p>Our support team has replied to your ticket <strong>${ticket.ticketNumber}</strong>:</p>
            
            <div class="reply-box">
              <p><span class="label">Support Team:</span></p>
              <p>${message.message}</p>
            </div>

            <p>You can view the full conversation and reply to this ticket by clicking below:</p>

            <p style="text-align: center; margin-top: 20px;">
              <a href="${config.frontendUrl}/support/tickets/${ticket._id}" 
                 style="background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View & Reply
              </a>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated notification. Please do not reply directly to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Muted Age. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

/**
 * User replied to ticket - Notification to Admin
 */
const userReplyTemplate = (ticket, message) => {
  return {
    subject: `Customer Reply: ${ticket.ticketNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .reply-box { background: #fff; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; }
          .label { font-weight: bold; color: #666; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Customer Reply</h1>
          </div>
          <div class="content">
            <p><strong>${ticket.user.firstName} ${ticket.user.lastName}</strong> replied to ticket <strong>${ticket.ticketNumber}</strong>:</p>
            
            <div class="reply-box">
              <p>${message.message}</p>
              <p style="font-size: 12px; color: #666; margin-top: 10px;">
                Replied at: ${new Date(message.createdAt).toLocaleString()}
              </p>
            </div>

            <p style="text-align: center; margin-top: 20px;">
              <a href="${config.frontendUrl}/admin/support/tickets/${ticket._id}" 
                 style="background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View & Respond
              </a>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated notification from Muted Age Support System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

/**
 * Ticket status updated - Notification to User
 */
const statusUpdateTemplate = (ticket) => {
  const statusMessages = {
    'in-progress': 'Our team is actively working on your issue.',
    'resolved': 'Your issue has been resolved! If you\'re still experiencing problems, you can reopen this ticket within 7 days.',
    'closed': 'This ticket has been closed. If you need further assistance, please create a new ticket.',
  };

  return {
    subject: `Ticket ${ticket.ticketNumber} Status: ${ticket.status.toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .status-box { background: #fff; padding: 15px; margin: 10px 0; border-left: 4px solid #ffc107; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ticket Status Update</h1>
          </div>
          <div class="content">
            <p>Hi ${ticket.user.firstName},</p>
            <p>The status of your ticket <strong>${ticket.ticketNumber}</strong> has been updated:</p>
            
            <div class="status-box">
              <p><strong>New Status: ${ticket.status.toUpperCase()}</strong></p>
              <p>${statusMessages[ticket.status] || 'Your ticket status has been updated.'}</p>
            </div>

            ${ticket.status === 'resolved' ? `
              <p style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <strong>Note:</strong> You have 7 days to reopen this ticket if the issue persists. 
                After that, you'll need to create a new ticket.
              </p>
            ` : ''}

            <p style="text-align: center; margin-top: 20px;">
              <a href="${config.frontendUrl}/support/tickets/${ticket._id}" 
                 style="background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Ticket
              </a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Muted Age. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

/**
 * Ticket reopened - Notification to Admin
 */
const ticketReopenedTemplate = (ticket) => {
  return {
    subject: `🔄 Ticket Reopened: ${ticket.ticketNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: #fff; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .alert { background: #fff; padding: 15px; margin: 10px 0; border-left: 4px solid #dc3545; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔄 Ticket Reopened</h1>
          </div>
          <div class="content">
            <div class="alert">
              <p><strong>Ticket ${ticket.ticketNumber}</strong> has been reopened by the customer.</p>
              <p><strong>Customer:</strong> ${ticket.user.firstName} ${ticket.user.lastName}</p>
              <p><strong>Original Issue:</strong> ${ticket.subject}</p>
            </div>

            <p>Please review the ticket and provide assistance.</p>

            <p style="text-align: center; margin-top: 20px;">
              <a href="${config.frontendUrl}/admin/support/tickets/${ticket._id}" 
                 style="background: #dc3545; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Ticket
              </a>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated notification from Muted Age Support System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

// ============================================
// SEND EMAIL FUNCTIONS
// ============================================

/**
 * Log notification to console (fallback when email not configured)
 */
const logNotification = (to, subject, html) => {
  console.log('\n📧 ═══════════════════════════════════════════════════════');
  console.log('📧 EMAIL NOTIFICATION (Console Mode)');
  console.log('📧 ═══════════════════════════════════════════════════════');
  console.log(`📧 To: ${to}`);
  console.log(`📧 Subject: ${subject}`);
  console.log('📧 ───────────────────────────────────────────────────────');
  
  // Extract text from HTML (simple text extraction)
  const textContent = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  console.log('📧 Content Preview:');
  console.log(textContent.substring(0, 300) + '...');
  console.log('📧 ═══════════════════════════════════════════════════════\n');
  
  return { success: true, method: 'console' };
};

/**
 * Send email
 */
const sendEmail = async (to, subject, html) => {
  const transport = getTransporter();

  if (!transport) {
    // Fallback to console logging
    return logNotification(to, subject, html);
  }

  try {
    const mailOptions = {
      from: config.email.from,
      to,
      subject,
      html,
    };

    const info = await transport.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send failed:', error);
    console.log('📧 Falling back to console logging...');
    return logNotification(to, subject, html);
  }
};

/**
 * Send ticket notification based on event type
 */
const sendTicketNotification = async (eventType, ticket, message = null) => {
  try {
    await ticket.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'relatedOrder', select: 'orderNumber' },
      { path: 'relatedProduct', select: 'name' },
    ]);

    let template;
    let recipients = [];

    switch (eventType) {
      case 'new':
        // Send to user
        template = newTicketUserTemplate(ticket);
        await sendEmail(ticket.user.email, template.subject, template.html);
        
        // Send to admin (you can configure admin emails in config)
        if (config.email.adminEmail) {
          template = newTicketAdminTemplate(ticket);
          await sendEmail(config.email.adminEmail, template.subject, template.html);
        }
        break;

      case 'reply':
        // User replied - notify admin
        if (config.email.adminEmail) {
          template = userReplyTemplate(ticket, message);
          await sendEmail(config.email.adminEmail, template.subject, template.html);
        }
        break;

      case 'admin_reply':
        // Admin replied - notify user
        template = adminReplyTemplate(ticket, message);
        await sendEmail(ticket.user.email, template.subject, template.html);
        break;

      case 'status_update':
        // Status changed - notify user
        template = statusUpdateTemplate(ticket);
        await sendEmail(ticket.user.email, template.subject, template.html);
        break;

      case 'reopen':
        // Ticket reopened - notify admin
        if (config.email.adminEmail) {
          template = ticketReopenedTemplate(ticket);
          await sendEmail(config.email.adminEmail, template.subject, template.html);
        }
        break;

      default:
        console.log('Unknown notification type:', eventType);
    }

    return { success: true };
  } catch (error) {
    console.error('Ticket notification error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  initializeTransporter,
  sendEmail,
  sendTicketNotification,
};
