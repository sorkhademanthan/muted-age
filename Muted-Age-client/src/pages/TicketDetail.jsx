import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supportService } from '../services';
import { useAuth } from '../contexts/AuthContext';

function TicketDetail() {
  const { ticketId } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  useEffect(() => {
    if (ticket?.messages) {
      scrollToBottom();
    }
  }, [ticket?.messages]);

  const loadTicket = async () => {
    try {
      const response = await supportService.getTicket(ticketId);
      setTicket(response.data);
      console.log('✅ Ticket loaded:', response.data);
    } catch (error) {
      console.error('❌ Error loading ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();

    if (!replyText.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      setSubmitting(true);
      await supportService.replyToTicket(ticketId, { message: replyText });
      console.log('✅ Reply sent');
      setReplyText('');
      await loadTicket();
    } catch (error) {
      console.error('❌ Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReopen = async () => {
    if (window.confirm('Are you sure you want to reopen this ticket?')) {
      try {
        await supportService.reopenTicket(ticketId);
        console.log('✅ Ticket reopened');
        await loadTicket();
      } catch (error) {
        console.error('❌ Error reopening ticket:', error);
        alert('Failed to reopen ticket. Please try again.');
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusColor = (status) => {
    const colors = {
      open: '#2196F3',
      'in-progress': '#FF9800',
      resolved: '#4CAF50',
      closed: '#666',
    };
    return colors[status] || '#666';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'in-progress': 'In Progress',
    };
    return labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      order: '📦',
      product: '🛍️',
      shipping: '🚚',
      return: '↩️',
      account: '👤',
      payment: '💳',
      technical: '⚙️',
      other: '❓',
    };
    return icons[category] || '💬';
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading ticket...</div>;
  }

  if (!ticket) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Ticket not found</h2>
        <Link to="/support" style={{ color: '#2196F3' }}>← Back to Support Center</Link>
      </div>
    );
  }

  const canReply = ticket.status !== 'closed';
  const canReopen = ticket.status === 'closed' || ticket.status === 'resolved';

  return (
    <div className="ticket-detail-page" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/support" style={{ color: '#2196F3', textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
        ← Back to Support Center
      </Link>

      {/* Ticket Header */}
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '25px', marginBottom: '20px', background: '#f9f9f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <div>
            <h1 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {getCategoryIcon(ticket.category)} {ticket.subject}
            </h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666' }}>
                {ticket.ticketNumber}
              </span>
              <span
                style={{
                  padding: '6px 12px',
                  background: getStatusColor(ticket.status),
                  color: 'white',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {getStatusLabel(ticket.status)}
              </span>
              {ticket.priority === 'urgent' && (
                <span style={{ padding: '6px 12px', background: '#F44336', color: 'white', borderRadius: '5px', fontSize: '14px' }}>
                  🔥 Urgent
                </span>
              )}
            </div>
          </div>

          {canReopen && (
            <button
              onClick={handleReopen}
              style={{
                padding: '10px 20px',
                background: '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Reopen Ticket
            </button>
          )}
        </div>

        {/* Ticket Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Category</p>
            <p style={{ fontWeight: 'bold' }}>{ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Priority</p>
            <p style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{ticket.priority}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Created</p>
            <p style={{ fontWeight: 'bold' }}>{new Date(ticket.createdAt).toLocaleString()}</p>
          </div>
          {ticket.orderReference && (
            <div>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Order Reference</p>
              <Link to={`/orders/${ticket.orderReference}`} style={{ fontWeight: 'bold', color: '#2196F3' }}>
                {ticket.orderReference}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Messages Thread */}
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '25px', marginBottom: '20px', background: '#fff' }}>
        <h2 style={{ marginBottom: '20px' }}>Messages ({ticket.messages?.length || 0})</h2>

        <div style={{ maxHeight: '600px', overflowY: 'auto', marginBottom: '20px' }}>
          {ticket.messages && ticket.messages.length > 0 ? (
            <div style={{ display: 'grid', gap: '20px' }}>
              {ticket.messages.map((message, index) => {
                const isUser = message.sender === 'user';
                const isCurrentUser = message.sentBy?._id === user?.id || message.sentBy === user?.id;

                return (
                  <div
                    key={message._id || index}
                    style={{
                      display: 'flex',
                      flexDirection: isUser ? 'row-reverse' : 'row',
                      gap: '15px',
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: isUser ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#4CAF50',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        flexShrink: 0,
                      }}
                    >
                      {isUser ? user?.firstName?.[0]?.toUpperCase() || 'U' : 'S'}
                    </div>

                    {/* Message Content */}
                    <div style={{ flex: 1, maxWidth: '70%' }}>
                      <div
                        style={{
                          padding: '15px',
                          background: isUser ? '#f0f0f0' : '#e8f5e9',
                          borderRadius: '12px',
                          borderTopRightRadius: isUser ? '0' : '12px',
                          borderTopLeftRadius: isUser ? '12px' : '0',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <p style={{ fontWeight: 'bold', fontSize: '14px' }}>
                            {isUser ? 'You' : 'Support Team'}
                          </p>
                          <p style={{ fontSize: '12px', color: '#666' }}>
                            {new Date(message.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No messages yet. Our support team will respond soon.
            </p>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {canReply ? (
        <form onSubmit={handleReply} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '25px', background: '#fff' }}>
          <h3 style={{ marginBottom: '15px' }}>Send a Reply</h3>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your message here..."
            rows={6}
            required
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              resize: 'vertical',
              marginBottom: '15px',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '14px', color: '#666' }}>
              {replyText.length}/2000 characters
            </p>
            <button
              type="submit"
              disabled={submitting || !replyText.trim()}
              style={{
                padding: '12px 30px',
                background: submitting || !replyText.trim() ? '#ccc' : '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: submitting || !replyText.trim() ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              {submitting ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '25px', background: '#f9f9f9', textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            This ticket is closed. You cannot reply to closed tickets.
          </p>
          {canReopen && (
            <button
              onClick={handleReopen}
              style={{
                padding: '12px 30px',
                background: '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Reopen Ticket
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default TicketDetail;
