import { API_BASE, API_URL, mediaUrl } from '../../config.js'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../../components/Avatar/Avatar'
import { ShoppingBag, Heart, MessageCircle, Eye, Search, X, Smartphone, Building2, CreditCard, Truck, Copy, CheckCheck } from 'lucide-react'
import {
  ShoppingContainer,
  Header,
  HeaderTitle,
  SearchBar,
  SearchInput,
  FilterSection,
  CategoryTabs,
  CategoryTab,
  ProductsGrid,
  ProductCard,
  ProductImage,
  ProductInfo,
  ProductName,
  ProductPrice,
  ProductBusiness,
  BusinessName,
  ProductStats,
  StatItem,
  ProductActions,
  LikeButton,
  BuyButton,
  MessageButton,
  EmptyState
} from './Shopping.styled'

const categories = [
  'All', 'Electronics', 'Automotive', 'Fashion & Clothing', 'Home & Furniture',
  'Beauty & Personal Care', 'Sports & Outdoors', 'Books & Stationery', 'Toys & Games',
  'Food & Beverages', 'Health & Wellness', 'Jewelry & Accessories', 'Pet Supplies',
  'Garden & Tools', 'Baby & Kids', 'Art & Crafts', 'Music & Instruments',
  'Real Estate', 'Services', 'Other'
]

function Shopping() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Payment modal state
  const [payModal, setPayModal] = useState(null)
  const [payModalLoading, setPayModalLoading] = useState(false)
  const [copied, setCopied] = useState('')

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  useEffect(() => { fetchProducts() }, [selectedCategory, searchQuery])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'All') params.append('category', selectedCategory)
      if (searchQuery) params.append('search', searchQuery)
      const response = await fetch(`${API_BASE}/api/products?${params}`)
      const data = await response.json()
      if (data.success) setProducts(data.products)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductClick = (productId) => { navigate(`/shopping/${productId}`) }

  const handleLike = async (e, productId) => {
    e.stopPropagation()
    try {
      const token = localStorage.getItem('token')
      await fetch(`${API_BASE}/api/products/${productId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchProducts()
    } catch (error) { console.error('Failed to like product:', error) }
  }

  const handleMessage = async (e, product) => {
    e.stopPropagation()
    const message = prompt(`Send a message to ${product.business?.user_info?.fullName} about "${product.name}":`)
    if (message && message.trim()) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_BASE}/api/products/${product._id}/inquiry`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: message.trim() })
        })
        const data = await response.json()
        if (data.success) alert('Message sent! The seller will see your inquiry.')
        else alert('Failed to send message: ' + data.message)
      } catch (error) { alert('Failed to send message. Please try again.') }
    }
  }

  const handleBuy = async (e, product) => {
    e.stopPropagation()
    const businessId = product.business?._id
    if (!businessId) return
    setPayModalLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/users/payment-methods/${businessId}`)
      const data = await res.json()
      const pm = data.payment_methods || {}
      const hasAny = pm.easypaisa?.enabled || pm.jazzcash?.enabled ||
                     pm.bankTransfer?.enabled || pm.creditCard?.enabled || pm.cashOnDelivery?.enabled
      setPayModal({
        product,
        paymentMethods: hasAny ? pm : null,
        businessName: data.businessName || product.business?.user_info?.fullName
      })
    } catch {
      setPayModal({ product, paymentMethods: null, businessName: product.business?.user_info?.fullName })
    } finally {
      setPayModalLoading(false)
    }
  }

  if (loading) {
    return (
      <ShoppingContainer>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading products...</div>
      </ShoppingContainer>
    )
  }

  return (
    <ShoppingContainer>
      <Header>
        <HeaderTitle><ShoppingBag size={28} /> Shopping</HeaderTitle>
        <SearchBar>
          <Search size={20} />
          <SearchInput type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </SearchBar>
      </Header>

      <FilterSection>
        <CategoryTabs>
          {categories.map((category) => (
            <CategoryTab key={category} $isActive={selectedCategory === category} onClick={() => setSelectedCategory(category)}>
              {category}
            </CategoryTab>
          ))}
        </CategoryTabs>
      </FilterSection>

      {products.length === 0 ? (
        <EmptyState>
          <ShoppingBag size={64} />
          <h3>No Products Found</h3>
          <p>Check back later for new products</p>
        </EmptyState>
      ) : (
        <ProductsGrid>
          {products.map((product) => (
            <ProductCard key={product._id} onClick={() => handleProductClick(product._id)}>
              <ProductImage
                src={product.images?.length > 0 ? mediaUrl(product.images[0].url) : 'https://via.placeholder.com/300x300?text=No+Image'}
                alt={product.name}
              />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>Rs. {product.price.toFixed(2)}</ProductPrice>
                <ProductBusiness>
                  <Avatar
                    src={product.business?.profile_info?.avatar ? `${API_BASE}${product.business.profile_info.avatar}` : undefined}
                    name={product.business?.user_info?.fullName || 'Business'}
                    size={40}
                  />
                  <BusinessName>{product.business?.user_info?.fullName}</BusinessName>
                </ProductBusiness>
                <ProductStats>
                  <StatItem><Eye size={16} />{product.views}</StatItem>
                  <StatItem><Heart size={16} />{product.likesCount}</StatItem>
                  <StatItem><MessageCircle size={16} />{product.inquiriesCount}</StatItem>
                </ProductStats>
                <ProductActions>
                  <LikeButton onClick={(e) => handleLike(e, product._id)}><Heart size={18} />Like</LikeButton>
                  <BuyButton onClick={(e) => handleBuy(e, product)} disabled={payModalLoading}>
                    <ShoppingBag size={18} />{payModalLoading ? '...' : 'Buy'}
                  </BuyButton>
                  <MessageButton onClick={(e) => handleMessage(e, product)}><MessageCircle size={18} />Message</MessageButton>
                </ProductActions>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
      )}

      {/* ── PAYMENT METHODS MODAL ─────────────────────────────────────── */}
      {payModal && (
        <div onClick={() => setPayModal(null)} style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3000, padding: '20px'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'white', borderRadius: '24px', padding: '32px',
            width: '100%', maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto',
            position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <button onClick={() => setPayModal(null)} style={{
              position: 'absolute', top: '16px', right: '16px',
              background: '#f1f5f9', border: 'none', borderRadius: '50%',
              width: '36px', height: '36px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}><X size={18} /></button>

            {/* Product summary */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
              {payModal.product.images?.length > 0 && (
                <img src={mediaUrl(payModal.product.images[0].url)} alt="" style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} />
              )}
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800' }}>{payModal.product.name}</h2>
                <p style={{ margin: '0', color: '#14b8a6', fontWeight: '900', fontSize: '20px' }}>Rs. {payModal.product.price?.toFixed(2)}</p>
                <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '13px' }}>Seller: {payModal.businessName}</p>
              </div>
            </div>

            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
              How to Pay
            </h3>

            {!payModal.paymentMethods ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                <ShoppingBag size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
                <p style={{ margin: 0 }}>The seller hasn&apos;t set up payment methods yet.</p>
                <p style={{ margin: '8px 0 0', fontSize: '13px' }}>Send them a message to arrange payment.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* Easypaisa */}
                {payModal.paymentMethods.easypaisa?.enabled && (
                  <PayRow icon={<Smartphone size={20} color="#00B050" />} title="Easypaisa" color="#00B050">
                    <CopyField label="Account Number" value={payModal.paymentMethods.easypaisa.accountNumber} copyKey="ep_num" copied={copied} onCopy={handleCopy} />
                    <CopyField label="Account Name" value={payModal.paymentMethods.easypaisa.accountName} copyKey="ep_name" copied={copied} onCopy={handleCopy} />
                  </PayRow>
                )}

                {/* JazzCash */}
                {payModal.paymentMethods.jazzcash?.enabled && (
                  <PayRow icon={<Smartphone size={20} color="#E31837" />} title="JazzCash" color="#E31837">
                    <CopyField label="Mobile Number" value={payModal.paymentMethods.jazzcash.accountNumber} copyKey="jc_num" copied={copied} onCopy={handleCopy} />
                    <CopyField label="Account Name" value={payModal.paymentMethods.jazzcash.accountName} copyKey="jc_name" copied={copied} onCopy={handleCopy} />
                  </PayRow>
                )}

                {/* Bank Transfer */}
                {payModal.paymentMethods.bankTransfer?.enabled && (
                  <PayRow icon={<Building2 size={20} color="#3b82f6" />} title="Bank Transfer" color="#3b82f6">
                    {payModal.paymentMethods.bankTransfer.bankName && <CopyField label="Bank" value={payModal.paymentMethods.bankTransfer.bankName} copyKey="bt_bank" copied={copied} onCopy={handleCopy} />}
                    {payModal.paymentMethods.bankTransfer.accountTitle && <CopyField label="Account Title" value={payModal.paymentMethods.bankTransfer.accountTitle} copyKey="bt_title" copied={copied} onCopy={handleCopy} />}
                    {payModal.paymentMethods.bankTransfer.accountNumber && <CopyField label="Account Number" value={payModal.paymentMethods.bankTransfer.accountNumber} copyKey="bt_num" copied={copied} onCopy={handleCopy} />}
                    {payModal.paymentMethods.bankTransfer.iban && <CopyField label="IBAN" value={payModal.paymentMethods.bankTransfer.iban} copyKey="bt_iban" copied={copied} onCopy={handleCopy} />}
                    {payModal.paymentMethods.bankTransfer.branchCode && <CopyField label="Branch Code" value={payModal.paymentMethods.bankTransfer.branchCode} copyKey="bt_branch" copied={copied} onCopy={handleCopy} />}
                  </PayRow>
                )}

                {/* Credit Card */}
                {payModal.paymentMethods.creditCard?.enabled && (
                  <PayRow icon={<CreditCard size={20} color="#8b5cf6" />} title="Credit / Debit Card" color="#8b5cf6">
                    {payModal.paymentMethods.creditCard.instructions && (
                      <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
                        {payModal.paymentMethods.creditCard.instructions}
                      </p>
                    )}
                  </PayRow>
                )}

                {/* Cash on Delivery */}
                {payModal.paymentMethods.cashOnDelivery?.enabled && (
                  <PayRow icon={<Truck size={20} color="#f59e0b" />} title="Cash on Delivery" color="#f59e0b">
                    {payModal.paymentMethods.cashOnDelivery.areas && (
                      <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>
                        Available in: {payModal.paymentMethods.cashOnDelivery.areas}
                      </p>
                    )}
                  </PayRow>
                )}

              </div>
            )}

            <p style={{ marginTop: '20px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
              After payment, message the seller with your payment confirmation.
            </p>
          </div>
        </div>
      )}
      {/* ──────────────────────────────────────────────────────────────── */}

    </ShoppingContainer>
  )
}

// Helper: payment method row card
const PayRow = ({ icon, title, color, children }) => (
  <div style={{
    border: `1.5px solid ${color}30`,
    borderRadius: '14px',
    overflow: 'hidden'
  }}>
    <div style={{
      backgroundColor: `${color}12`,
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      {icon}
      <span style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>{title}</span>
    </div>
    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {children}
    </div>
  </div>
)

// Helper: copyable field row
const CopyField = ({ label, value, copyKey, copied, onCopy }) => {
  if (!value) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>{label}</span>
        <p style={{ margin: '2px 0 0', fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>{value}</p>
      </div>
      <button onClick={() => onCopy(value, copyKey)} style={{
        background: copied === copyKey ? '#d1fae5' : '#f1f5f9',
        border: 'none', borderRadius: '8px',
        padding: '6px 10px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '4px',
        fontSize: '12px', fontWeight: '700',
        color: copied === copyKey ? '#059669' : '#475569',
        transition: 'all 0.2s', flexShrink: 0
      }}>
        {copied === copyKey ? <><CheckCheck size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
      </button>
    </div>
  )
}

export default Shopping
