const config = require('../config/config');

// ============================================
// RESEND EMAIL SERVICE
// ============================================
// This is a modern alternative to nodemailer
// Install: npm install resend
// Get API key: https://resend.com/api-keys

let Resend;
let resendClient = null;

/**
 * Initialize Resend client
 */
const initializeResend = () => {
  if (!config.email.resendApiKey) {
    console.warn('⚠️  Resend API key not configured. Notifications will be logged to console.');
    return null;
  }

  try {
    // Dynamically import Resend
    Resend = require('resend').Resend;
    resendClient = new Resend(config.email.resendApiKey);
    console.log('✅ Resend email service initialized');
    return resendClient;
  } catch (error) {
    console.error('❌ Failed to initialize Resend:', error);
    console.log('📧 Run: npm install resend');
    return null;
  }
};

/**
 * Log notification to console (fallback)
 */
const logNotification = (to, subject, html) => {
  console.log('\n📧 ═══════════════════════════════════════════════════════');
  console.log('📧 EMAIL NOTIFICATION (Console Mode)');
  console.log('📧 ═══════════════════════════════════════════════════════');
  console.log(`📧 To: ${to}`);
  console.log(`📧 Subject: ${subject}`);
  console.log('📧 ───────────────────────────────────────────────────────');
  
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
 * Send email using Resend
 */
const sendEmail = async (to, subject, html) => {
  const client = resendClient || initializeResend();

  if (!client) {
    // Fallback to console logging
    return logNotification(to, subject, html);
  }

  try {
    const result = await client.emails.send({
      from: config.email.from,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html,
    });

    console.log('✅ Email sent via Resend:', result.id);
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('❌ Resend email send failed:', error);
    console.log('📧 Falling back to console logging...');
    return logNotification(to, subject, html);
  }
};

/**
 * Send ticket notification
 */
const sendTicketNotification = async (eventType, ticket, message = null) => {
  try {
    await ticket.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'relatedOrder', select: 'orderNumber' },
      { path: 'relatedProduct', select: 'name' },
    ]);

    const { getEmailTemplate } = require('./emailTemplates');
    let template;

    switch (eventType) {
      case 'new':
        // Send to user
        template = getEmailTemplate('newTicketUser', ticket);
        await sendEmail(ticket.user.email, template.subject, template.html);
        
        // Send to admin
        if (config.email.adminEmail) {
          template = getEmailTemplate('newTicketAdmin', ticket);
          await sendEmail(config.email.adminEmail, template.subject, template.html);
        }
        break;

      case 'reply':
        // User replied - notify admin
        if (config.email.adminEmail) {
          template = getEmailTemplate('userReply', ticket, message);
          await sendEmail(config.email.adminEmail, template.subject, template.html);
        }
        break;

      case 'admin_reply':
        // Admin replied - notify user
        template = getEmailTemplate('adminReply', ticket, message);
        await sendEmail(ticket.user.email, template.subject, template.html);
        break;

      case 'status_update':
        // Status changed - notify user
        template = getEmailTemplate('statusUpdate', ticket);
        await sendEmail(ticket.user.email, template.subject, template.html);
        break;

      case 'reopen':
        // Ticket reopened - notify admin
        if (config.email.adminEmail) {
          template = getEmailTemplate('ticketReopened', ticket);
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
  initializeResend,
  sendEmail,
  sendTicketNotification,
};
