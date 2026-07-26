import { useState } from 'react'
import { MessageCircle, XCircle, Home } from 'lucide-react'
import NotificationBadge from './NotificationBadge'


export default function BadgeDemo() {
  const [messageCount, setMessageCount] = useState(5)
  const [rejectionCount, setRejectionCount] = useState(2)
  const [feedCount, setFeedCount] = useState(4)

  return (
    <div style={{ padding: '3rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', color: '#0f172a' }}>
        Badge Counter Demo
      </h1>
      
      <div style={{ display: 'grid', gap: '2rem' }}>
        {}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: 16, 
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)' 
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
            Messages Badge
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Shows count from 1-9, then "9+" for values over 9. Hides when count is 0.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>
              <NotificationBadge count={messageCount}>
                <MessageCircle size={48} />
              </NotificationBadge>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                Current Count: {messageCount}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => setMessageCount(0)} style={buttonStyle}>0</button>
                <button onClick={() => setMessageCount(1)} style={buttonStyle}>1</button>
                <button onClick={() => setMessageCount(5)} style={buttonStyle}>5</button>
                <button onClick={() => setMessageCount(9)} style={buttonStyle}>9</button>
                <button onClick={() => setMessageCount(12)} style={buttonStyle}>12</button>
                <button onClick={() => setMessageCount(99)} style={buttonStyle}>99</button>
              </div>
            </div>
          </div>
        </div>

        {}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: 16, 
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)' 
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
            Rejected Posts Badge
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Shows count from 1-9, then "9+" for values over 9. Hides when count is 0.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>
              <NotificationBadge count={rejectionCount}>
                <XCircle size={48} />
              </NotificationBadge>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                Current Count: {rejectionCount}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => setRejectionCount(0)} style={buttonStyle}>0</button>
                <button onClick={() => setRejectionCount(1)} style={buttonStyle}>1</button>
                <button onClick={() => setRejectionCount(3)} style={buttonStyle}>3</button>
                <button onClick={() => setRejectionCount(9)} style={buttonStyle}>9</button>
                <button onClick={() => setRejectionCount(15)} style={buttonStyle}>15</button>
              </div>
            </div>
          </div>
        </div>

        {}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: 16, 
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)' 
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
            Feed Badge (Special Mode)
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Only shows when count ≥ 3. Displays "3" for exactly 3, "3+" for more than 3.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>
              <NotificationBadge count={feedCount} feedMode>
                <Home size={48} />
              </NotificationBadge>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                Current Count: {feedCount}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => setFeedCount(0)} style={buttonStyle}>0</button>
                <button onClick={() => setFeedCount(1)} style={buttonStyle}>1</button>
                <button onClick={() => setFeedCount(2)} style={buttonStyle}>2</button>
                <button onClick={() => setFeedCount(3)} style={buttonStyle}>3</button>
                <button onClick={() => setFeedCount(5)} style={buttonStyle}>5</button>
                <button onClick={() => setFeedCount(10)} style={buttonStyle}>10</button>
              </div>
            </div>
          </div>
        </div>

        {}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: 16, 
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)' 
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>
            Badge Comparison Grid
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {[0, 1, 2, 3, 5, 9, 10, 15].map(count => (
              <div key={count} style={{ textAlign: 'center' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginBottom: '0.5rem',
                  fontSize: '2rem'
                }}>
                  <NotificationBadge count={count}>
                    <MessageCircle size={32} />
                  </NotificationBadge>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                  Count: {count}
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>
            Feed Mode (3+ threshold)
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '1.5rem'
          }}>
            {[0, 1, 2, 3, 4, 5, 10].map(count => (
              <div key={count} style={{ textAlign: 'center' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginBottom: '0.5rem',
                  fontSize: '2rem'
                }}>
                  <NotificationBadge count={count} feedMode>
                    <Home size={32} />
                  </NotificationBadge>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                  Count: {count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div style={{ 
          background: '#f8fafc', 
          padding: '2rem', 
          borderRadius: 16,
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
            Technical Specifications
          </h2>
          <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8 }}>
            <li><strong>Position:</strong> Absolute, top-right corner (-6px offset)</li>
            <li><strong>Size:</strong> 18px height, min-width 18px, auto-expands for content</li>
            <li><strong>Color:</strong> #ef4444 (red background), white text</li>
            <li><strong>Font:</strong> 10px, bold (700)</li>
            <li><strong>Border:</strong> 2px solid surface color</li>
            <li><strong>Animation:</strong> Subtle pulse effect (2s infinite)</li>
            <li><strong>Shadow:</strong> 0 2px 4px rgba(0,0,0,0.2)</li>
            <li><strong>Z-index:</strong> 1 (appears above icon)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const buttonStyle = {
  padding: '6px 12px',
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  background: 'white',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#475569',
  transition: 'all 0.15s',
}

