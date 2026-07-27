import { API_BASE, API_URL, mediaUrl } from '../../config.js'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, MessageSquare, TrendingUp, Plus, LogOut, X,
  ImageIcon, Video, CreditCard, Smartphone, Building2, Truck, CheckCircle,
  Save, Eye, Heart, ShoppingBag, Send, Bot, Menu, ChevronLeft, Star,
  AlertCircle, RefreshCw, Edit2, Trash2, BarChart2
} from 'lucide-react'
import { logout as apiLogout } from '../../services/api'
import Avatar from '../../components/Avatar/Avatar'

/* ─── theme ────────────────────────────────────────────────── */
const T = {
  teal: '#14b8a6', dark: '#0f172a', border: '#e2e8f0',
  bg: '#f1f5f9', red: '#ef4444', green: '#10b981',
  purple: '#8b5cf6', amber: '#f59e0b'
}

/* ─── helpers ───────────────────────────────────────────────── */
const tok = () => localStorage.getItem('token')
const fmt = ts => {
  if (!ts) return ''
  const d = new Date(ts), now = new Date()
  const s = Math.floor((now - d) / 1000)
  if (s < 60) return 'Just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return d.toLocaleDateString()
}

const CATEGORIES = [
  'Electronics','Automotive','Fashion & Clothing','Home & Furniture',
  'Beauty & Personal Care','Sports & Outdoors','Books & Stationery',
  'Toys & Games','Food & Beverages','Health & Wellness','Jewelry & Accessories',
  'Pet Supplies','Garden & Tools','Baby & Kids','Art & Crafts',
  'Music & Instruments','Real Estate','Services','Other'
]

/* ─── sub-components ────────────────────────────────────────── */
const Toggle = ({ on, color, onClick }) => (
  <div onClick={onClick} style={{
    width:48, height:26, borderRadius:13, cursor:'pointer',
    backgroundColor: on ? color : '#cbd5e1',
    position:'relative', transition:'background 0.2s', flexShrink:0
  }}>
    <div style={{
      position:'absolute', top:3, left: on ? 25 : 3,
      width:20, height:20, borderRadius:'50%', background:'white',
      transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,.2)'
    }}/>
  </div>
)

const PayCard = ({ icon, title, color, enabled, onToggle, children }) => (
  <div style={{
    background:'white', borderRadius:16, marginBottom:14,
    border:`2px solid ${enabled ? color : '#e2e8f0'}`, overflow:'hidden'
  }}>
    <div onClick={() => onToggle(!enabled)} style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'14px 18px', background: enabled ? `${color}10` : '#f8fafc', cursor:'pointer'
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ background: enabled ? `${color}20` : '#f1f5f9', padding:8, borderRadius:10 }}>{icon}</div>
        <span style={{ fontWeight:800, fontSize:15, color:'#0f172a' }}>{title}</span>
      </div>
      <Toggle on={enabled} color={color} onClick={() => {}} />
    </div>
    {enabled && <div style={{ padding:'16px 18px' }}>{children}</div>}
  </div>
)

const StatCard = ({ label, value, icon, color, sub }) => (
  <div style={{
    background:'white', borderRadius:12, padding:'14px 16px',
    boxShadow:'0 1px 6px rgba(0,0,0,.06)', display:'flex', alignItems:'center', gap:12
  }}>
    <div style={{ background:`${color}18`, borderRadius:10, padding:8, flexShrink:0 }}>{icon}</div>
    <div>
      <p style={{ margin:0, fontSize:11, color:'#64748b', fontWeight:600 }}>{label}</p>
      <p style={{ margin:'2px 0 0', fontSize:22, fontWeight:900, color:'#0f172a' }}>{value}</p>
      {sub && <p style={{ margin:'2px 0 0', fontSize:10, color:'#94a3b8' }}>{sub}</p>}
    </div>
  </div>
)

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function BusinessDashboard({ onLogout }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  /* products */
  const [products, setProducts] = useState([])
  const [analytics, setAnalytics] = useState({ totalProducts:0, totalViews:0, totalInquiries:0, totalLikes:0 })

  /* payment */
  const [paymentMethods, setPaymentMethods] = useState({
    easypaisa:    { enabled:false, accountNumber:'', accountName:'' },
    jazzcash:     { enabled:false, accountNumber:'', accountName:'' },
    bankTransfer: { enabled:false, bankName:'', accountTitle:'', accountNumber:'', iban:'', branchCode:'' },
    creditCard:   { enabled:false, instructions:'' },
    cashOnDelivery:{ enabled:false, areas:'' }
  })
  const [payLoading, setPayLoading] = useState(false)
  const [paySaved,   setPaySaved]   = useState(false)

  /* messages / inquiries */
  const [inquiries, setInquiries]       = useState([])
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [replyText, setReplyText]       = useState('')
  const [replySending, setReplySending] = useState(false)

  /* AI chat */
  const [aiOpen, setAiOpen]       = useState(false)
  const [aiHistory, setAiHistory] = useState([])
  const [aiInput, setAiInput]     = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const aiEnd = useRef(null)

  /* create product form */
  const [form, setForm] = useState({
    title:'', price:'', description:'', category:'Electronics',
    stock:'', externalLink:'', imageFile:null, videoFile:null
  })
  const [publishing, setPublishing] = useState(false)

  /* ── data loaders ─────────────────────────────────────────── */
  const loadProducts = async () => {
    try {
      const r = await fetch(`${API_URL}/products/business/my-products`, { headers:{ Authorization:`Bearer ${tok()}` } })
      const d = await r.json()
      if (d.success) {
        setProducts(d.products.map(p => ({
          id:p._id, title:p.name, price:p.price, description:p.description,
          category:p.category, stock:p.stock, views:p.views||0,
          likes:p.likesCount||0, inquiriesCount:p.inquiriesCount||0,
          preview: p.images?.length ? mediaUrl(p.images[0].url) : null,
          inquiries: p.inquiries || []
        })))
        if (d.analytics) setAnalytics(d.analytics)
      }
    } catch (e) { console.error(e) }
  }

  const loadPaymentMethods = async () => {
    try {
      const r = await fetch(`${API_URL}/users/payment-methods`, { headers:{ Authorization:`Bearer ${tok()}` } })
      const d = await r.json()
      if (d.success && d.payment_methods) setPaymentMethods(prev => ({ ...prev, ...d.payment_methods }))
    } catch (e) { console.error(e) }
  }

  const loadInquiries = async () => {
    try {
      const r = await fetch(`${API_URL}/products/business/my-products`, { headers:{ Authorization:`Bearer ${tok()}` } })
      const d = await r.json()
      if (d.success) {
        const all = []
        d.products.forEach(p => {
          p.inquiries?.forEach(inq => {
            all.push({
              id: inq._id,
              productId: p._id,
              productName: p.name,
              productImage: p.images?.length ? mediaUrl(p.images[0].url) : null,
              userName: inq.user?.user_info?.fullName || 'User',
              userEmail: inq.user?.email || '',
              userId: inq.user?._id,
              userAvatar: inq.user?.profile_info?.avatar ? `${API_BASE}${inq.user.profile_info.avatar}` : undefined,
              message: inq.message,
              time: fmt(inq.createdAt),
              createdAt: inq.createdAt
            })
          })
        })
        all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setInquiries(all)
      }
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    loadProducts()
    loadPaymentMethods()
    loadInquiries()
  }, [])

  useEffect(() => {
    aiEnd.current?.scrollIntoView({ behavior:'smooth' })
  }, [aiHistory])

  /* ── handlers ─────────────────────────────────────────────── */
  const handleLogout = () => { apiLogout(); if (onLogout) onLogout(); navigate('/'); window.location.reload() }

  const handlePublish = async e => {
    e.preventDefault(); setPublishing(true)
    try {
      const fd = new FormData()
      fd.append('name', form.title); fd.append('description', form.description)
      fd.append('price', form.price); fd.append('category', form.category)
      fd.append('stock', form.stock); fd.append('tags', JSON.stringify([]))
      if (form.imageFile) fd.append('images', form.imageFile)
      const r = await fetch(`${API_URL}/products`, {
        method:'POST', headers:{ Authorization:`Bearer ${tok()}` }, body:fd
      })
      const d = await r.json()
      if (d.success) {
        setShowAddForm(false)
        setForm({ title:'', price:'', description:'', category:'Electronics', stock:'', externalLink:'', imageFile:null, videoFile:null })
        loadProducts()
        setActiveTab('inventory')
      } else { alert(d.message || 'Failed to create product') }
    } catch (err) { alert(err.message) }
    finally { setPublishing(false) }
  }

  const handleSavePayments = async () => {
    setPayLoading(true)
    try {
      const r = await fetch(`${API_URL}/users/payment-methods`, {
        method:'PUT', headers:{ Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json' },
        body: JSON.stringify(paymentMethods)
      })
      const d = await r.json()
      if (d.success) { setPaySaved(true); setTimeout(() => setPaySaved(false), 3000) }
    } catch (e) { console.error(e) }
    finally { setPayLoading(false) }
  }

  const handleReply = async () => {
    if (!replyText.trim() || !selectedInquiry) return
    setReplySending(true)
    try {
      const r = await fetch(`${API_URL}/users/messages/${selectedInquiry.userId}`, {
        method:'POST', headers:{ Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json' },
        body: JSON.stringify({ message: replyText.trim() })
      })
      const d = await r.json()
      if (d.success) {
        setReplyText('')
        alert('Reply sent to ' + selectedInquiry.userName)
      } else { alert(d.message || 'Failed to send') }
    } catch (e) { alert('Failed to send reply') }
    finally { setReplySending(false) }
  }

  const handleAiSend = async () => {
    if (!aiInput.trim() || aiLoading) return
    const userMsg = { role:'user', content: aiInput.trim() }
    const newHistory = [...aiHistory, userMsg]
    setAiHistory(newHistory)
    setAiInput('')
    setAiLoading(true)
    try {
      const r = await fetch(`${API_URL}/ai/chat`, {
        method:'POST', headers:{ Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json' },
        body: JSON.stringify({ message: userMsg.content, history: aiHistory.slice(-8) })
      })
      const d = await r.json()
      if (d.success) setAiHistory(prev => [...prev, { role:'assistant', content: d.reply }])
      else setAiHistory(prev => [...prev, { role:'assistant', content:'Sorry, AI is unavailable right now.' }])
    } catch (e) {
      setAiHistory(prev => [...prev, { role:'assistant', content:'Connection error. Make sure Ollama is running.' }])
    }
    setAiLoading(false)
  }

  const pm = (key, field, val) => setPaymentMethods(p => ({ ...p, [key]: { ...p[key], [field]: val } }))

  // Check if mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [isMobile])

  /* ─── styles ──────────────────────────────────────────────── */
  const lbl = { fontSize:11, fontWeight:800, color:'#0f172a', marginBottom:5, display:'block', textTransform:'uppercase' }
  const inp = { width:'100%', padding:'11px 14px', borderRadius:10, border:'1px solid #e2e8f0', outline:'none', boxSizing:'border-box', fontSize:14 }
  const nav = active => ({
    display:'flex', alignItems:'center', gap:10, padding:'11px 16px', borderRadius:10,
    cursor:'pointer', marginBottom:4,
    backgroundColor: active ? T.teal : 'transparent',
    color: active ? 'white' : '#94a3b8', fontWeight:700, fontSize:14,
    transition:'all .15s'
  })

// render
  /* ── RENDER ─────────────────────────────────────────────── */
  return (
    <div style={{ display:'flex', width:'100%', maxWidth:'100%', height:'100vh', overflow:'hidden', overflowX:'hidden', overflowY:'hidden', background:T.bg, fontFamily:'system-ui,sans-serif' }}>

      {/* ── SIDEBAR ─── */}
      <aside style={{
        width: sidebarOpen ? (isMobile ? '80%' : 260) : 0,
        minWidth: sidebarOpen ? (isMobile ? '80%' : 260) : 0,
        background:T.dark, color:'white',
        display:'flex', flexDirection:'column',
        padding: sidebarOpen ? '24px 16px' : '24px 0',
        height:'100vh', transition:'all .25s', overflow:'hidden',
        position: isMobile && sidebarOpen ? 'fixed' : 'relative',
        zIndex: isMobile && sidebarOpen ? 999 : 'auto',
        inset: isMobile && sidebarOpen ? 0 : 'auto',
        maxHeight: '100vh', overflowY: 'auto'
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:40 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ background:T.teal, padding:8, borderRadius:10, flexShrink:0 }}>
              <TrendingUp size={22} color="white"/>
            </div>
            {sidebarOpen && <span style={{ fontWeight:900, fontSize:17, whiteSpace:'nowrap' }}>SELLER STUDIO</span>}
          </div>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} style={{
              background:'none', border:'none', cursor:'pointer', color:'white',
              display:'flex', alignItems:'center', justifyContent:'center',
              padding:'4px', flexShrink:0, transition:'opacity .2s'
            }}>
              <X size={24}/>
            </button>
          )}
        </div>
        <nav style={{ flex:1 }}>
          {[
            { id:'overview',   icon:<LayoutDashboard size={18}/>, label:'Dashboard' },
            { id:'inventory',  icon:<Package size={18}/>,         label:'My Products' },
            { id:'messages',   icon:<MessageSquare size={18}/>,   label:'Messages' },
            { id:'payments',   icon:<CreditCard size={18}/>,      label:'Payment Methods' },
            { id:'ai',         icon:<Bot size={18}/>,             label:'AI Assistant' },
          ].map(n => (
            <div key={n.id} onClick={() => setActiveTab(n.id)} style={nav(activeTab===n.id)}>
              {n.icon}
              {sidebarOpen && <span>{n.label}</span>}
              {!sidebarOpen && null}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── MAIN ─── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', minWidth:0, maxWidth:'100%' }}>

        {/* top bar */}
        <header style={{
          padding: isMobile ? '12px 16px' : '14px 24px', 
          display:'flex', justifyContent:'space-between',
          alignItems:'center', background:'white', borderBottom:`1px solid ${T.border}`,
          flexShrink:0, gap:12, flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, flex: isMobile ? 1 : 'auto' }}>
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex' }}>
              {sidebarOpen ? <ChevronLeft size={22}/> : <Menu size={22}/>}
            </button>
            <h1 style={{ margin:0, fontSize: isMobile ? 14 : 18, fontWeight:900, textTransform:'uppercase', color:'#0f172a' }}>
              {activeTab === 'overview' ? 'Dashboard' : activeTab === 'inventory' ? 'My Products' : activeTab === 'messages' ? 'Messages' : activeTab === 'payments' ? 'Payment Methods' : 'AI Assistant'}
            </h1>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center', flex: isMobile ? '0 0 100%' : 'auto', marginTop: isMobile ? '8px' : '0' }}>
            <button onClick={() => setShowAddForm(true)} style={{
              background:T.teal, color:'white', border:'none', borderRadius:10,
              padding: isMobile ? '8px 12px' : '9px 16px', fontWeight:800, cursor:'pointer', display:'flex', gap:6, alignItems:'center', fontSize: isMobile ? 12 : 14
            }}>
              <Plus size={16}/> {isMobile ? 'New' : 'New Listing'}
            </button>
            <button onClick={handleLogout} style={{
              background:T.red, color:'white', border:'none', borderRadius:10,
              padding: isMobile ? '8px 12px' : '9px 14px', fontWeight:800, cursor:'pointer', display:'flex', gap:6, alignItems:'center', fontSize: isMobile ? 12 : 14
            }}>
              <LogOut size={16}/> {isMobile ? '' : 'Log Out'}
            </button>
          </div>
        </header>

        {/* content */}
        <main style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding: isMobile ? '16px' : '24px', boxSizing:'border-box', maxWidth:'100%' }}>

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill,minmax(200px,1fr))', gap:12, marginBottom:20 }}>
                <StatCard label="Total Products" value={analytics.totalProducts||products.length} icon={<Package size={18} color={T.teal}/>} color={T.teal} sub="listed products"/>
                <StatCard label="Total Views"    value={analytics.totalViews||0}     icon={<Eye size={18} color={T.purple}/>}  color={T.purple} sub="across all products"/>
                <StatCard label="Total Likes"    value={analytics.totalLikes||0}     icon={<Heart size={18} color={T.red}/>}   color={T.red} sub="product likes"/>
                <StatCard label="Inquiries"      value={analytics.totalInquiries||inquiries.length} icon={<MessageSquare size={18} color={T.amber}/>} color={T.amber} sub="customer messages"/>
              </div>
              <h3 style={{ fontWeight:800, fontSize:15, color:'#0f172a', marginBottom:14 }}>Recent Products</h3>
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
                {products.slice(0,4).map(p => (
                  <div key={p.id} style={{ background:'white', borderRadius:16, overflow:'hidden', boxShadow:'0 1px 6px rgba(0,0,0,.06)' }}>
                    <div style={{ height:130, background:'#f1f5f9', overflow:'hidden' }}>
                      {p.preview && <img src={p.preview} alt={p.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>}
                    </div>
                    <div style={{ padding:'12px 14px' }}>
                      <p style={{ margin:'0 0 4px', fontWeight:800, fontSize:14, color:'#0f172a' }}>{p.title}</p>
                      <p style={{ margin:0, color:T.teal, fontWeight:900 }}>Rs. {p.price}</p>
                      <div style={{ display:'flex', gap:12, marginTop:8, color:'#64748b', fontSize:12 }}>
                        <span><Eye size={12}/> {p.views}</span>
                        <span><Heart size={12}/> {p.likes}</span>
                        <span><MessageSquare size={12}/> {p.inquiriesCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'40px 0', color:'#94a3b8' }}>
                    <Package size={48} style={{ marginBottom:12, opacity:.4 }}/>
                    <p style={{ margin:0, fontWeight:700 }}>No products yet</p>
                    <button onClick={() => setShowAddForm(true)} style={{ marginTop:12, background:T.teal, color:'white', border:'none', borderRadius:10, padding:'10px 20px', fontWeight:800, cursor:'pointer' }}>
                      + Add Your First Product
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── INVENTORY ── */}
          {activeTab === 'inventory' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <p style={{ margin:0, color:'#64748b', fontWeight:600 }}>{products.length} product{products.length!==1?'s':''}</p>
                <button onClick={loadProducts} style={{ background:'none', border:`1px solid ${T.border}`, borderRadius:8, padding:'7px 12px', cursor:'pointer', display:'flex', gap:6, alignItems:'center', fontSize:13, color:'#475569', fontWeight:600 }}>
                  <RefreshCw size={14}/> Refresh
                </button>
              </div>
              {products.length === 0 ? (
                <div style={{ textAlign:'center', padding:'60px 0', color:'#94a3b8' }}>
                  <ShoppingBag size={56} style={{ marginBottom:16, opacity:.3 }}/>
                  <h3 style={{ margin:'0 0 8px', fontWeight:800, color:'#475569' }}>No products yet</h3>
                  <button onClick={() => setShowAddForm(true)} style={{ background:T.teal, color:'white', border:'none', borderRadius:12, padding:'12px 24px', fontWeight:800, cursor:'pointer' }}>
                    Create Your First Listing
                  </button>
                </div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
                  {products.map(p => (
                    <div key={p.id} style={{ background:'white', borderRadius:16, overflow:'hidden', boxShadow:'0 1px 6px rgba(0,0,0,.06)' }}>
                      <div style={{ height:160, background:'#f1f5f9', overflow:'hidden', position:'relative' }}>
                        {p.preview && <img src={p.preview} alt={p.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>}
                        <div style={{ position:'absolute', top:8, right:8, background:p.stock>0?T.green:T.red, color:'white', borderRadius:6, padding:'3px 8px', fontSize:11, fontWeight:800 }}>
                          {p.stock>0 ? `Stock: ${p.stock}` : 'Out of Stock'}
                        </div>
                      </div>
                      <div style={{ padding:'14px 16px' }}>
                        <p style={{ margin:'0 0 2px', fontWeight:800, fontSize:15 }}>{p.title}</p>
                        <p style={{ margin:'0 0 8px', color:T.teal, fontWeight:900, fontSize:16 }}>Rs. {p.price}</p>
                        <p style={{ margin:'0 0 10px', fontSize:12, color:'#64748b', background:'#f1f5f9', display:'inline-block', borderRadius:6, padding:'2px 8px' }}>{p.category}</p>
                        <div style={{ display:'flex', gap:10, color:'#94a3b8', fontSize:12 }}>
                          <span style={{ display:'flex', gap:3, alignItems:'center' }}><Eye size={12}/>{p.views}</span>
                          <span style={{ display:'flex', gap:3, alignItems:'center' }}><Heart size={12}/>{p.likes}</span>
                          <span style={{ display:'flex', gap:3, alignItems:'center' }}><MessageSquare size={12}/>{p.inquiriesCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── MESSAGES ── */}
          {activeTab === 'messages' && (
            <div style={{ display:'grid', gridTemplateColumns: selectedInquiry && !isMobile ? '1fr 1fr' : '1fr', gap:20, height:'calc(100vh - 160px)' }}>
              <div style={{ background:'white', borderRadius:20, overflow:'hidden', display: isMobile && selectedInquiry ? 'none' : 'flex', flexDirection:'column' }}>
                <div style={{ padding:'16px 20px', borderBottom:`1px solid ${T.border}`, background:'#f8fafc', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <h2 style={{ margin:0, fontWeight:800, fontSize: isMobile ? 14 : 16 }}>Inquiries ({inquiries.length})</h2>
                  <button onClick={loadInquiries} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b' }}><RefreshCw size={16}/></button>
                </div>
                <div style={{ flex:1, overflowY:'auto' }}>
                  {inquiries.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'48px 24px', color:'#94a3b8' }}>
                      <MessageSquare size={48} style={{ marginBottom:12, opacity:.4 }}/>
                      <p style={{ margin:0, fontWeight:700 }}>No messages yet</p>
                    </div>
                  ) : inquiries.map(inq => (
                    <div key={inq.id} onClick={() => setSelectedInquiry(selectedInquiry?.id===inq.id ? null : inq)}
                      style={{ padding:'16px 20px', borderBottom:`1px solid #f1f5f9`, cursor:'pointer', background: selectedInquiry?.id===inq.id ? '#f0fdfa' : 'white', transition:'background .2s' }}>
                      <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                        <Avatar src={inq.userAvatar} name={inq.userName} size={40}/>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', justifyContent:'space-between' }}>
                            <span style={{ fontWeight:700, fontSize:14 }}>{inq.userName}</span>
                            <span style={{ fontSize:12, color:'#94a3b8' }}>{inq.time}</span>
                          </div>
                          <p style={{ margin:'4px 0 0', fontSize:13, color:'#475569', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{inq.message}</p>
                          <p style={{ margin:'4px 0 0', fontSize:11, color:T.teal, fontWeight:700 }}>{inq.productName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedInquiry && (
                <div style={{ background:'white', borderRadius:20, overflow:'hidden', display:'flex', flexDirection:'column' }}>
                  <div style={{ padding:'16px 20px', borderBottom:`1px solid ${T.border}`, background:'#f8fafc', display:'flex', gap:12, alignItems:'center' }}>
                    <Avatar src={selectedInquiry.userAvatar} name={selectedInquiry.userName} size={isMobile ? 32 : 40}/>
                    <div>
                      <p style={{ margin:0, fontWeight:800, fontSize: isMobile ? 13 : 15 }}>{selectedInquiry.userName}</p>
                      <p style={{ margin:0, fontSize:12, color:'#64748b' }}>{isMobile ? selectedInquiry.userEmail.split('@')[0] : selectedInquiry.userEmail}</p>
                    </div>
                    <button onClick={() => setSelectedInquiry(null)} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#64748b' }}><X size={18}/></button>
                  </div>
                  <div style={{ flex:1, padding:20, overflowY:'auto' }}>
                    {selectedInquiry.productImage && (
                      <div style={{ display:'flex', gap:10, alignItems:'center', background:'#f0fdfa', padding:12, borderRadius:12, marginBottom:16, borderLeft:`3px solid ${T.teal}` }}>
                        <img src={selectedInquiry.productImage} alt="" style={{ width:48, height:48, borderRadius:8, objectFit:'cover' }}/>
                        <div>
                          <p style={{ margin:0, fontSize:11, color:'#64748b', fontWeight:700, textTransform:'uppercase' }}>Product</p>
                          <p style={{ margin:0, fontWeight:800 }}>{selectedInquiry.productName}</p>
                        </div>
                      </div>
                    )}
                    <div style={{ background:'#f1f5f9', borderRadius:12, padding:'14px 16px' }}>
                      <p style={{ margin:0, lineHeight:1.6, color:'#0f172a' }}>{selectedInquiry.message}</p>
                    </div>
                  </div>
                  <div style={{ padding:'14px 20px', borderTop:`1px solid ${T.border}`, display:'flex', gap:10 }}>
                    <input
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => e.key==='Enter' && !e.shiftKey && handleReply()}
                      placeholder="Write a reply..."
                      style={{ flex:1, padding:'10px 14px', border:`1px solid ${T.border}`, borderRadius:10, outline:'none', fontSize:14 }}
                    />
                    <button onClick={handleReply} disabled={replySending || !replyText.trim()} style={{
                      background:T.teal, color:'white', border:'none', borderRadius:10,
                      padding:'10px 16px', cursor:'pointer', display:'flex', gap:6, alignItems:'center', fontWeight:700, opacity: replySending?0.7:1
                    }}>
                      <Send size={16}/>{replySending ? '...' : 'Send'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── PAYMENT METHODS ── */}
          {activeTab === 'payments' && (
            <div style={{ maxWidth:720, margin:'0 auto' }}>
              <p style={{ color:'#64748b', marginBottom:20, fontSize:14 }}>Enable payment methods buyers will see when they click Buy on your products.</p>
              <PayCard icon={<Smartphone size={20} color="#00B050"/>} title="Easypaisa" color="#00B050" enabled={paymentMethods.easypaisa?.enabled} onToggle={v => pm('easypaisa','enabled',v)}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div><label style={lbl}>Account Number</label><input style={inp} placeholder="03XX-XXXXXXX" value={paymentMethods.easypaisa?.accountNumber||''} onChange={e => pm('easypaisa','accountNumber',e.target.value)}/></div>
                  <div><label style={lbl}>Account Name</label><input style={inp} placeholder="Holder name" value={paymentMethods.easypaisa?.accountName||''} onChange={e => pm('easypaisa','accountName',e.target.value)}/></div>
                </div>
              </PayCard>
              <PayCard icon={<Smartphone size={20} color="#E31837"/>} title="JazzCash" color="#E31837" enabled={paymentMethods.jazzcash?.enabled} onToggle={v => pm('jazzcash','enabled',v)}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div><label style={lbl}>Mobile Number</label><input style={inp} placeholder="03XX-XXXXXXX" value={paymentMethods.jazzcash?.accountNumber||''} onChange={e => pm('jazzcash','accountNumber',e.target.value)}/></div>
                  <div><label style={lbl}>Account Name</label><input style={inp} placeholder="Holder name" value={paymentMethods.jazzcash?.accountName||''} onChange={e => pm('jazzcash','accountName',e.target.value)}/></div>
                </div>
              </PayCard>
              <PayCard icon={<Building2 size={20} color="#3b82f6"/>} title="Bank Transfer" color="#3b82f6" enabled={paymentMethods.bankTransfer?.enabled} onToggle={v => pm('bankTransfer','enabled',v)}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div><label style={lbl}>Bank Name</label><input style={inp} placeholder="HBL, MCB, UBL..." value={paymentMethods.bankTransfer?.bankName||''} onChange={e => pm('bankTransfer','bankName',e.target.value)}/></div>
                  <div><label style={lbl}>Account Title</label><input style={inp} placeholder="Account title" value={paymentMethods.bankTransfer?.accountTitle||''} onChange={e => pm('bankTransfer','accountTitle',e.target.value)}/></div>
                  <div><label style={lbl}>Account Number</label><input style={inp} placeholder="XXXX-XXXXXXX" value={paymentMethods.bankTransfer?.accountNumber||''} onChange={e => pm('bankTransfer','accountNumber',e.target.value)}/></div>
                  <div><label style={lbl}>IBAN (optional)</label><input style={inp} placeholder="PK00XXXX..." value={paymentMethods.bankTransfer?.iban||''} onChange={e => pm('bankTransfer','iban',e.target.value)}/></div>
                </div>
              </PayCard>
              <PayCard icon={<CreditCard size={20} color="#8b5cf6"/>} title="Credit / Debit Card" color="#8b5cf6" enabled={paymentMethods.creditCard?.enabled} onToggle={v => pm('creditCard','enabled',v)}>
                <div><label style={lbl}>Payment Instructions</label><textarea style={{ ...inp, height:70, resize:'vertical' }} placeholder="e.g. Send via bank app link..." value={paymentMethods.creditCard?.instructions||''} onChange={e => pm('creditCard','instructions',e.target.value)}/></div>
              </PayCard>
              <PayCard icon={<Truck size={20} color="#f59e0b"/>} title="Cash on Delivery" color="#f59e0b" enabled={paymentMethods.cashOnDelivery?.enabled} onToggle={v => pm('cashOnDelivery','enabled',v)}>
                <div><label style={lbl}>Available Cities/Areas</label><input style={inp} placeholder="e.g. Lahore, Karachi" value={paymentMethods.cashOnDelivery?.areas||''} onChange={e => pm('cashOnDelivery','areas',e.target.value)}/></div>
              </PayCard>
              <button onClick={handleSavePayments} disabled={payLoading} style={{
                width:'100%', padding:15, background: paySaved ? T.green : T.teal, color:'white',
                borderRadius:12, border:'none', fontWeight:900, cursor:'pointer', fontSize:15,
                display:'flex', alignItems:'center', justifyContent:'center', gap:10, transition:'background .3s'
              }}>
                {paySaved ? <><CheckCircle size={20}/>Saved!</> : <><Save size={20}/>{payLoading ? 'Saving...' : 'Save Payment Methods'}</>}
              </button>
            </div>
          )}

          {/* ── AI ASSISTANT ── */}
          {activeTab === 'ai' && (
            <div style={{ maxWidth:700, margin:'0 auto', display:'flex', flexDirection:'column', height:'calc(100vh - 160px)' }}>
              <div style={{ background:'white', borderRadius:20, flex:1, display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 1px 6px rgba(0,0,0,.06)' }}>
                <div style={{ padding:'16px 20px', borderBottom:`1px solid ${T.border}`, background:'#f0fdfa', display:'flex', gap:12, alignItems:'center' }}>
                  <div style={{ background:T.teal, borderRadius:10, padding:8 }}><Bot size={20} color="white"/></div>
                  <div>
                    <p style={{ margin:0, fontWeight:800, fontSize:15 }}>Verity AI Assistant</p>
                    <p style={{ margin:0, fontSize:12, color:'#64748b' }}>Powered by llama3.2 (local)</p>
                  </div>
                </div>
                <div style={{ flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:12 }}>
                  {aiHistory.length === 0 && (
                    <div style={{ textAlign:'center', padding:'32px 0', color:'#94a3b8' }}>
                      <Bot size={48} style={{ marginBottom:12, opacity:.3 }}/>
                      <p style={{ margin:0, fontWeight:700 }}>Ask me anything about your business, products, or customers!</p>
                    </div>
                  )}
                  {aiHistory.map((msg, i) => (
                    <div key={i} style={{ display:'flex', justifyContent: msg.role==='user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth:'80%', padding:'10px 14px', borderRadius: msg.role==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: msg.role==='user' ? T.teal : '#f1f5f9',
                        color: msg.role==='user' ? 'white' : '#0f172a',
                        fontSize:14, lineHeight:1.6, whiteSpace:'pre-wrap'
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div style={{ display:'flex' }}>
                      <div style={{ background:'#f1f5f9', borderRadius:'16px 16px 16px 4px', padding:'10px 16px', color:'#64748b', fontSize:14 }}>
                        Thinking...
                      </div>
                    </div>
                  )}
                  <div ref={aiEnd}/>
                </div>
                <div style={{ padding:'14px 20px', borderTop:`1px solid ${T.border}`, display:'flex', gap:10 }}>
                  <input
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    onKeyDown={e => e.key==='Enter' && !e.shiftKey && handleAiSend()}
                    placeholder="Ask the AI assistant..."
                    style={{ flex:1, padding:'11px 16px', border:`1px solid ${T.border}`, borderRadius:12, outline:'none', fontSize:14 }}
                  />
                  <button onClick={handleAiSend} disabled={aiLoading || !aiInput.trim()} style={{
                    background:T.teal, color:'white', border:'none', borderRadius:12,
                    padding:'11px 18px', cursor:'pointer', fontWeight:700, display:'flex', gap:6, alignItems:'center',
                    opacity: (aiLoading||!aiInput.trim()) ? 0.6 : 1
                  }}>
                    <Send size={16}/>{aiLoading ? '...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── CREATE PRODUCT MODAL ── */}
      {showAddForm && (
        <div onClick={() => setShowAddForm(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:28, padding:'32px 36px', width:'100%', maxWidth:680, maxHeight:'90vh', overflowY:'auto', position:'relative' }}>
            <button onClick={() => setShowAddForm(false)} style={{ position:'absolute', top:18, right:18, background:'#f1f5f9', border:'none', borderRadius:'50%', width:34, height:34, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={18}/></button>
            <h2 style={{ margin:'0 0 24px', fontWeight:900, fontSize:20 }}>Create Business Listing</h2>
            <form onSubmit={handlePublish}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:14 }}>
                <div><label style={lbl}>Product Title</label><input style={inp} value={form.title} onChange={e => setForm({...form, title:e.target.value})} required/></div>
                <div><label style={lbl}>Price (PKR)</label><input style={inp} type="number" value={form.price} onChange={e => setForm({...form, price:e.target.value})} required/></div>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={lbl}>Description</label>
                <textarea style={{ ...inp, height:80 }} value={form.description} onChange={e => setForm({...form, description:e.target.value})} required/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:14 }}>
                <div>
                  <label style={lbl}>Category</label>
                  <select style={inp} value={form.category} onChange={e => setForm({...form, category:e.target.value})}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Stock</label><input style={inp} type="number" value={form.stock} onChange={e => setForm({...form, stock:e.target.value})} required/></div>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={lbl}>External Link (optional)</label>
                <input style={inp} value={form.externalLink} onChange={e => setForm({...form, externalLink:e.target.value})}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
                <div>
                  <input type="file" accept="image/*" id="img-up" style={{ display:'none' }} onChange={e => setForm({...form, imageFile:e.target.files[0]})}/>
                  <label htmlFor="img-up" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, border:'2px dashed #cbd5e1', borderRadius:14, padding:'20px 16px', cursor:'pointer', background:'#f8fafc', color: form.imageFile ? T.teal : '#94a3b8', fontWeight:700, fontSize:14 }}>
                    <ImageIcon size={24}/>{form.imageFile ? form.imageFile.name : 'Upload Image'}
                  </label>
                </div>
                <div>
                  <input type="file" accept="video/*" id="vid-up" style={{ display:'none' }} onChange={e => setForm({...form, videoFile:e.target.files[0]})}/>
                  <label htmlFor="vid-up" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, border:'2px dashed #cbd5e1', borderRadius:14, padding:'20px 16px', cursor:'pointer', background:'#f8fafc', color: form.videoFile ? T.teal : '#94a3b8', fontWeight:700, fontSize:14 }}>
                    <Video size={24}/>{form.videoFile ? form.videoFile.name : 'Upload Video'}
                  </label>
                </div>
              </div>
              <button type="submit" disabled={publishing} style={{
                width:'100%', padding:15, background:T.teal, color:'white',
                borderRadius:12, border:'none', fontWeight:900, cursor:'pointer', fontSize:15,
                opacity: publishing ? 0.7 : 1
              }}>
                {publishing ? 'Publishing...' : 'Confirm & Publish'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
