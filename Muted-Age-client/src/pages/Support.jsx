import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supportService } from '../services';

function Support() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const loadTickets = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await supportService.getTickets(params);
      setTickets(response.data || []);
      console.log('✅ Tickets loaded:', response.data.length);
    } catch (error) {
      console.error('❌ Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
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

  const filterOptions = [
    { value: 'all', label: 'All Tickets' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        <div style={{
          fontSize: '14px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: '#999',
          fontWeight: '300',
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="support-page" style={{ 
      minHeight: '100vh',
      background: '#FFFFFF',
      padding: '100px 40px 60px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: '50px',
          paddingBottom: '30px',
          borderBottom: '1px solid #E5E5E5',
        }}>
          <div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#000',
              marginBottom: '12px',
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
            }}>
              Support Center
            </h1>
            <p style={{ 
              fontSize: '16px',
              letterSpacing: '1px',
              color: '#666',
              fontWeight: '300',
              textTransform: 'uppercase',
            }}>
              {tickets.length} {tickets.length === 1 ? 'Ticket' : 'Tickets'}
            </p>
          </div>
          <Link
            to="/support/new"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: '#000',
              color: '#FFF',
              textDecoration: 'none',
              borderRadius: '0',
              fontSize: '13px',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              fontWeight: '500',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#333';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#000';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            + Create New Ticket
          </Link>
        </div>

        {/* Filter Tabs - Minimal with Underline */}
        <div style={{ 
          display: 'flex', 
          gap: '40px', 
          marginBottom: '60px',
          borderBottom: '1px solid #E5E5E5',
        }}>
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              style={{
                padding: '20px 0',
                background: 'transparent',
                color: filter === option.value ? '#000' : '#999',
                border: 'none',
                borderBottom: filter === option.value ? '2px solid #000' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '13px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: filter === option.value ? '600' : '400',
                transition: 'all 0.3s ease',
                marginBottom: '-1px',
              }}
              onMouseEnter={(e) => {
                if (filter !== option.value) {
                  e.currentTarget.style.color = '#000';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== option.value) {
                  e.currentTarget.style.color = '#999';
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

      {/* Ticket List */}
      {tickets.length === 0 ? (
        /* Empty State - Premium Luxury */
        <div style={{ 
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 40px',
        }}>
          {/* Minimalist Ticket Icon */}
          <div style={{
            width: '100px',
            height: '100px',
            marginBottom: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <rect 
                x="20" y="30" 
                width="60" height="40" 
                rx="3" ry="3"
                fill="none" 
                stroke="#999" 
                strokeWidth="1.5"
              />
              <line x1="40" y1="30" x2="40" y2="70" stroke="#999" strokeWidth="1.5" strokeDasharray="4,4" />
              <circle cx="40" cy="30" r="4" fill="#999" />
              <circle cx="40" cy="70" r="4" fill="#999" />
            </svg>
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: '36px',
            fontWeight: '400',
            color: '#000',
            marginBottom: '18px',
            letterSpacing: '1px',
            lineHeight: '1.3',
          }}>
            {filter === 'all' ? 'No Support Tickets' : `No ${getStatusLabel(filter)} Tickets`}
          </h2>

          {/* Secondary Message */}
          <p style={{
            fontSize: '16px',
            fontWeight: '300',
            color: '#666',
            marginBottom: '60px',
            letterSpacing: '0.5px',
            lineHeight: '1.6',
            maxWidth: '450px',
          }}>
            {filter === 'all' 
              ? 'You haven\'t created any support tickets yet'
              : `You don't have any ${getStatusLabel(filter).toLowerCase()} tickets`
            }
          </p>

          {/* CTA Button */}
          {filter === 'all' && (
            <Link
              to="/support/new"
              style={{
                display: 'inline-block',
                padding: '18px 50px',
                background: '#000',
                color: '#FFF',
                textDecoration: 'none',
                borderRadius: '0',
                fontSize: '13px',
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                fontWeight: '500',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#333';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Create Your First Ticket
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {tickets.map(ticket => (
            <Link
              key={ticket._id}
              to={`/support/${ticket._id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  background: '#FFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '0',
                  padding: '30px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#000';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E5E5';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    {/* Ticket Number and Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '600',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        color: '#000',
                      }}>
                        {ticket.ticketNumber}
                      </span>
                      <span style={{
                        padding: '6px 14px',
                        background: '#F5F5F5',
                        color: '#666',
                        borderRadius: '0',
                        fontSize: '11px',
                        fontWeight: '500',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                      }}>
                        {getStatusLabel(ticket.status)}
                      </span>
                      {ticket.priority === 'urgent' && (
                        <span style={{ 
                          padding: '6px 14px', 
                          background: '#000', 
                          color: '#FFF', 
                          borderRadius: '0', 
                          fontSize: '11px',
                          letterSpacing: '1.5px',
                          textTransform: 'uppercase',
                        }}>
                          Urgent
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    <h3 style={{ 
                      marginBottom: '16px', 
                      fontSize: '22px',
                      fontWeight: '500',
                      letterSpacing: '0.5px',
                      color: '#000',
                      lineHeight: '1.4',
                    }}>
                      {ticket.subject}
                    </h3>

                    {/* Category and Created Date */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '20px', 
                      fontSize: '12px', 
                      color: '#999', 
                      marginBottom: '12px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                    }}>
                      <span>{ticket.category}</span>
                      <span>•</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Last Message Preview */}
                    {ticket.messages && ticket.messages.length > 0 && (
                      <p style={{ 
                        color: '#666', 
                        fontSize: '14px', 
                        marginTop: '16px',
                        lineHeight: '1.6',
                        fontWeight: '300',
                      }}>
                        {ticket.messages[ticket.messages.length - 1].message.substring(0, 120)}
                        {ticket.messages[ticket.messages.length - 1].message.length > 120 ? '...' : ''}
                      </p>
                    )}
                  </div>

                  {/* Message Count */}
                  <div style={{ 
                    textAlign: 'center',
                    marginLeft: '30px',
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      border: '1px solid #E5E5E5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '16px',
                      color: '#000',
                    }}>
                      {ticket.messages?.length || 0}
                    </div>
                    <p style={{ 
                      fontSize: '11px', 
                      color: '#999', 
                      marginTop: '8px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                    }}>
                      Replies
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Help Section - Premium & Refined */}
      <div style={{ 
        marginTop: '80px', 
        padding: '50px 40px',
        background: '#FAFAFA',
        borderRadius: '0',
        border: '1px solid #E5E5E5',
      }}>
        <h3 style={{ 
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: '500',
          letterSpacing: '1px',
          color: '#000',
        }}>
          Need Help?
        </h3>
        <p style={{ 
          color: '#666', 
          marginBottom: '30px',
          fontSize: '15px',
          lineHeight: '1.7',
          fontWeight: '300',
          maxWidth: '600px',
        }}>
          Our support team is here to help you with any questions or issues.
        </p>
        <div style={{ 
          display: 'grid', 
          gap: '16px',
          fontSize: '14px',
          color: '#666',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ 
              fontWeight: '500',
              color: '#000',
              minWidth: '140px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontSize: '11px',
            }}>
              Response Time:
            </span>
            <span style={{ fontWeight: '300' }}>Within 24 hours</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ 
              fontWeight: '500',
              color: '#000',
              minWidth: '140px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontSize: '11px',
            }}>
              Email:
            </span>
            <a href="mailto:support@mutedage.com" style={{ 
              fontWeight: '300',
              color: '#666',
              textDecoration: 'none',
            }}>
              support@mutedage.com
            </a>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ 
              fontWeight: '500',
              color: '#000',
              minWidth: '140px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontSize: '11px',
            }}>
              Phone:
            </span>
            <a href="tel:1-800-MUTED-AGE" style={{ 
              fontWeight: '300',
              color: '#666',
              textDecoration: 'none',
            }}>
              1-800-MUTED-AGE
            </a>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Support;
