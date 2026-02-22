import React, { useState, useEffect } from 'react';
import { MessageSquare, Package } from 'lucide-react';
const BusinessMessages = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadInquiries();
  }, []);
  const loadInquiries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/products/business/my-products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const allInquiries = [];
        data.products.forEach(product => {
          if (product.inquiries && product.inquiries.length > 0) {
            product.inquiries.forEach(inquiry => {
              allInquiries.push({
                id: inquiry._id,
                productId: product._id,
                productName: product.name,
                productImage: product.images && product.images.length > 0 
                  ? `http://localhost:5000${product.images[0].url}` 
                  : null,
                userName: inquiry.user?.user_info?.fullName || inquiry.user?.fullName || 'User',
                userEmail: inquiry.user?.email || '',
                userAvatar: inquiry.user?.profile_info?.avatar 
                  ? `http://localhost:5000${inquiry.user.profile_info.avatar}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(inquiry.user?.user_info?.fullName || 'User')}&background=14b8a6&color=fff&size=150`,
                message: inquiry.message,
                time: formatTime(inquiry.createdAt),
                createdAt: inquiry.createdAt
              });
            });
          }
        });
        allInquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setInquiries(allInquiries);
      }
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
        Loading messages...
      </div>
    );
  }
  if (inquiries.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%', 
        color: '#94a3b8', 
        padding: '3rem'
      }}>
        <MessageSquare size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Messages Yet</h3>
        <p style={{ textAlign: 'center', maxWidth: '400px' }}>
          When customers send inquiries about your products, they'll appear here.
        </p>
      </div>
    );
  }
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '24px', 
      height: '100%', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f8fafc'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
          Customer Inquiries ({inquiries.length})
        </h2>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {inquiries.map((inquiry) => (
          <div 
            key={inquiry.id} 
            style={{ 
              padding: '1.25rem', 
              borderBottom: '1px solid #f1f5f9',
              transition: 'background 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
              <img 
                src={inquiry.userAvatar}
                alt={inquiry.userName}
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #14b8a6'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.25rem' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1f2937' }}>
                      {inquiry.userName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {inquiry.userEmail}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {inquiry.time}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ 
              backgroundColor: '#f0fdfa', 
              padding: '0.875rem', 
              borderRadius: '12px',
              borderLeft: '3px solid #14b8a6',
              marginBottom: '0.75rem'
            }}>
              <p style={{ margin: 0, color: '#1f2937', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {inquiry.message}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={16} style={{ color: '#6b7280' }} />
              <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>
                Product: {inquiry.productName}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BusinessMessages;
