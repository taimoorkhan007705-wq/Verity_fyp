import { API_BASE, API_URL } from '../../config.js'
import { useState, useEffect } from "react"
import { Users, FileText, BarChart2, Trash2, ShieldOff, Shield, AlertTriangle, Star, LogOut, Search, X, TrendingUp, Link2, CheckCircle, Ban } from "lucide-react"
import Avatar from '../../components/Avatar/Avatar'
import { logout as apiLogout } from "../../services/api"
import { useNavigate } from "react-router-dom"

const API = `${API_BASE}/api/admin`
const token = () => localStorage.getItem("token")
const hdrs = () => ({ Authorization: `Bearer ${token()}`, "Content-Type": "application/json" })
const avatarUrl = (u) => (u?.avatar?.startsWith("http") ? u.avatar : u?.avatar?.startsWith("/uploads") ? `${API_BASE}${u.avatar}` : undefined)
const RC = { User:"#3b82f6", Reviewer:"#10b981", Business:"#f59e0b", Admin:"#6366f1" }
const aBtn = (c) => ({ backgroundColor:c+"18", color:c, border:"none", borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontWeight:700, fontSize:"0.8rem" })

function SC({ icon: Icon, label, value, color }) {
  return (
    <div style={{ background:"#e0f2fe", borderRadius:16, padding:"1.5rem", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", display:"flex", alignItems:"center", gap:"1rem", border:"1px solid #b3e5fc" }}>
      <div style={{ width:52, height:52, borderRadius:14, backgroundColor:color+"20", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <div style={{ fontSize:"1.6rem", fontWeight:900, color:"#0f172a" }}>{value ?? "�"}</div>
        <div style={{ fontSize:"0.82rem", color:"#0c4a6e", fontWeight:600 }}>{label}</div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState("overview")
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState("")
  const [warnModal, setWarnModal] = useState(null)
  const [warnMsg, setWarnMsg] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/stats`, { headers: hdrs() }).then(r => r.json()),
      fetch(`${API}/users`, { headers: hdrs() }).then(r => r.json()),
      fetch(`${API}/posts`, { headers: hdrs() }).then(r => r.json()),
      fetch(`${API}/reviewer-requests`, { headers: hdrs() }).then(r => r.json()).catch(() => ({ requests: [] })),
    ]).then(([s, u, p, req]) => {
      if (s.success) setStats(s.stats)
      if (u.success) setUsers(u.users)
      if (p.success) setPosts(p.posts)
      if (req.requests) setRequests(req.requests)
    }).finally(() => setLoading(false))
  }, [])

  const delUser = async (id) => {
    if (!confirm("Delete this user?")) return
    const r = await fetch(`${API}/users/${id}`, { method:"DELETE", headers:hdrs() }).then(r => r.json())
    if (r.success) setUsers(prev => prev.filter(u => u.id !== id))
  }
  const ban = async (id) => {
    const r = await fetch(`${API}/users/${id}/ban`, { method:"PATCH", headers:hdrs() }).then(r => r.json())
    if (r.success) setUsers(prev => prev.map(u => u.id === id ? { ...u, isBanned: r.isBanned } : u))
  }
  const verify = async (id) => {
    const r = await fetch(`${API}/users/${id}/verify`, { method:"PATCH", headers:hdrs() }).then(r => r.json())
    if (r.success) setUsers(prev => prev.map(u => u.id === id ? { ...u, isVerified: r.isVerified } : u))
  }
  const warn = async () => {
    if (!warnMsg.trim()) return
    const r = await fetch(`${API}/users/${warnModal}/warn`, { method:"POST", headers:hdrs(), body:JSON.stringify({ message:warnMsg }) }).then(r => r.json())
    if (r.success) { setWarnModal(null); setWarnMsg(""); alert("Warning sent") }
  }
  const promote = async (id) => {
    if (!confirm("Promote to Reviewer?")) return
    const r = await fetch(`${API}/users/${id}/promote`, { method:"POST", headers:hdrs() }).then(r => r.json())
    if (r.success) setUsers(prev => prev.map(u => u.id === id ? { ...u, role:"Reviewer" } : u))
  }
  const block = async (id) => {
    const reason = prompt("Enter reason for blocking (optional):")
    if (reason === null) return
    const r = await fetch(`${API}/users/${id}/block`, { method:"POST", headers:hdrs(), body:JSON.stringify({ reason }) }).then(r => r.json())
    if (r.success) { 
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isBlocked: true } : u))
      alert("User blocked!")
    } else {
      alert(r.message)
    }
  }
  const unblock = async (id) => {
    if (!confirm("Unblock this user?")) return
    const r = await fetch(`${API}/users/${id}/unblock`, { method:"POST", headers:hdrs() }).then(r => r.json())
    if (r.success) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isBlocked: false } : u))
      alert("User unblocked!")
    } else {
      alert(r.message)
    }
  }
  const delPost = async (id) => {
    if (!confirm("Delete post?")) return
    const r = await fetch(`${API}/posts/${id}`, { method:"DELETE", headers:hdrs() }).then(r => r.json())
    if (r.success) setPosts(prev => prev.filter(p => p._id !== id))
  }

  const approveRequest = async (userId) => {
    if (!confirm("Approve this reviewer request?")) return
    const r = await fetch(`${API}/reviewer-requests/${userId}/approve`, { method:"POST", headers:hdrs() }).then(r => r.json())
    if (r.success) {
      setRequests(prev => prev.filter(req => req.userId !== userId))
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role:"Reviewer" } : u))
      alert("Reviewer approved!")
    }
  }

  const rejectRequest = async (userId) => {
    if (!confirm("Reject this reviewer request?")) return
    const r = await fetch(`${API}/reviewer-requests/${userId}/reject`, { method:"POST", headers:hdrs() }).then(r => r.json())
    if (r.success) {
      setRequests(prev => prev.filter(req => req.userId !== userId))
      alert("Request rejected!")
    }
  }

  const fil = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", backgroundColor:"#f8fafc", fontFamily:"sans-serif" }}>
      <aside style={{ width:240, minWidth:240, backgroundColor:"#0f172a", color:"white", display:"flex", flexDirection:"column", padding:"1.5rem 1rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"2rem" }}>
          <div style={{ backgroundColor:"#6366f1", borderRadius:10, padding:8 }}><Shield size={20} color="white" /></div>
          <span style={{ fontWeight:900, fontSize:"1.1rem" }}>Admin Panel</span>
        </div>
        <nav style={{ flex:1 }}>
          {[["overview","Overview",BarChart2],["users","Users",Users],["requests","Requests",AlertTriangle],["posts","Posts",FileText]].map(([k,l,I]) => (
            <div key={k} onClick={() => setTab(k)} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:10, cursor:"pointer", marginBottom:4, fontWeight:700, fontSize:"0.9rem", backgroundColor:tab===k?"#6366f1":"transparent", color:tab===k?"white":"#94a3b8" }}>
              <I size={18} /> {l}
            </div>
          ))}
        </nav>
        <div onClick={() => { apiLogout(); navigate("/") }} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:10, cursor:"pointer", fontWeight:700, backgroundColor:"#ef4444", color:"white" }}>
          <LogOut size={18} /> Log Out
        </div>
      </aside>

      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <header style={{ padding:"1.25rem 2rem", backgroundColor:"white", borderBottom:"1px solid #e2e8f0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h1 style={{ fontWeight:900, fontSize:"1.3rem", color:"#0f172a", margin:0, textTransform:"capitalize" }}>{tab}</h1>
          <span style={{ fontSize:"0.85rem", color:"#64748b" }}>Verity Admin</span>
        </header>
        <div style={{ flex:1, overflowY:"auto", padding:"1.5rem 2rem" }}>
          {loading ? <div style={{ textAlign:"center", padding:"4rem", color:"#94a3b8" }}>Loading...</div> : (
            <>
              {tab === "overview" && stats && (
                <>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
                    <SC icon={Users} label="Users" value={stats.users} color="#3b82f6" />
                    <SC icon={Star} label="Reviewers" value={stats.reviewers} color="#10b981" />
                    <SC icon={TrendingUp} label="Businesses" value={stats.businesses} color="#f59e0b" />
                    <SC icon={FileText} label="Posts" value={stats.posts} color="#8b5cf6" />
                    <SC icon={Link2} label="Connections" value={stats.connections} color="#14b8a6" />
                    <SC icon={Users} label="Total" value={stats.total} color="#6366f1" />
                  </div>
                  <div style={{ background:"#e0f2fe", borderRadius:16, padding:"1.5rem", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontWeight:800, marginBottom:"1rem", color:"#0c4a6e" }}>Recent Signups</div>
                    {users.slice(0,5).map(u => (
                      <div key={u.id} style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.75rem" }}>
                        <Avatar src={avatarUrl(u)} name={u.fullName} alt={u.fullName} size={38} />
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:"0.9rem", display:"flex", alignItems:"center", gap:4 }}>
                            {u.fullName} {u.isVerified && <CheckCircle size={14} color="#10b981" fill="#10b981" />}
                          </div>
                          <div style={{ fontSize:"0.75rem", color:"#94a3b8" }}>{u.email}</div>
                        </div>
                        <span style={{ backgroundColor:(RC[u.role]||"#6366f1")+"20", color:RC[u.role]||"#6366f1", fontSize:"0.75rem", fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{u.role}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {tab === "users" && (
                <>
                  <div style={{ position:"relative", marginBottom:"1.25rem" }}>
                    <Search size={16} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ width:"100%", padding:"10px 10px 10px 36px", borderRadius:12, border:"1px solid #e2e8f0", outline:"none", fontSize:"0.9rem", boxSizing:"border-box" }} />
                  </div>
                  <div style={{ background:"#e0f2fe", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.875rem" }}>
                      <thead><tr style={{ backgroundColor:"#cffafe", borderBottom:"1px solid #06b6d4" }}>
                        {["User","Role","Status","Trust","Actions"].map(h => <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontWeight:800, color:"#0c4a6e", fontSize:"0.78rem", textTransform:"uppercase" }}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {fil.map(u => (
                          <tr key={u.id} style={{ borderBottom:"1px solid #b3e5fc" }}>
                            <td style={{ padding:"12px 16px", minWidth:"220px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", minWidth:0 }}>
                                <Avatar src={avatarUrl(u)} name={u.fullName} alt={u.fullName} size={36} />
                                <div style={{ minWidth:0, flex:1 }}>
                                  <div style={{ fontWeight:700, display:"flex", alignItems:"center", gap:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"#0f172a" }}>
                                    {u.fullName}
                                    {u.isVerified && <CheckCircle size={13} color="#10b981" fill="#10b981" />}
                                  </div>
                                  <div style={{ fontSize:"0.75rem", color:"#94a3b8", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding:"12px 16px" }}><span style={{ backgroundColor:(RC[u.role]||"#6366f1")+"20", color:RC[u.role]||"#6366f1", fontSize:"0.75rem", fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{u.role}</span></td>
                            <td style={{ padding:"12px 16px" }}><span style={{ backgroundColor:u.isBanned?"#fee2e2":"#dcfce7", color:u.isBanned?"#dc2626":"#16a34a", fontSize:"0.75rem", fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{u.isBanned?"Banned":"Active"}</span></td>
                            <td style={{ padding:"12px 16px", color:"#64748b", fontWeight:600 }}>{u.trustScore}</td>
                            <td style={{ padding:"12px 16px" }}>
                              <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
                                <button onClick={() => ban(u.id)} title={u.isBanned?"Unban":"Ban"} style={aBtn(u.isBanned?"#10b981":"#f59e0b")}>{u.isBanned?<Shield size={13}/>:<ShieldOff size={13}/>}</button>
                                <button onClick={() => verify(u.id)} title={u.isVerified?"Remove Tick":"Give Green Tick"} style={aBtn(u.isVerified?"#6366f1":"#10b981")}><CheckCircle size={13}/></button>
                                <button onClick={() => setWarnModal(u.id)} title="Warn" style={aBtn("#f59e0b")}><AlertTriangle size={13}/></button>
                                {u.role==="User" && <button onClick={() => promote(u.id)} title="Promote to Reviewer" style={aBtn("#10b981")}><Star size={13}/></button>}
                                <button onClick={() => u.isBlocked ? unblock(u.id) : block(u.id)} title={u.isBlocked?"Unblock":"Block"} style={aBtn(u.isBlocked?"#10b981":"#ef4444")}><Ban size={13}/></button>
                                <button onClick={() => delUser(u.id)} title="Delete" style={aBtn("#ef4444")}><Trash2 size={13}/></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {fil.length===0 && <tr><td colSpan={5} style={{ padding:"2rem", textAlign:"center", color:"#94a3b8" }}>No users</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {tab === "requests" && (
                <div style={{ background:"#e0f2fe", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                  {requests.length === 0 ? (
                    <div style={{ padding:"2rem", textAlign:"center", color:"#94a3b8" }}>No pending reviewer requests</div>
                  ) : (
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.875rem" }}>
                      <thead><tr style={{ backgroundColor:"#cffafe", borderBottom:"1px solid #06b6d4" }}>
                        {["User","Email","Role","Requested At","Actions"].map(h => <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontWeight:800, color:"#0c4a6e", fontSize:"0.78rem", textTransform:"uppercase" }}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {requests.map(req => (
                          <tr key={req.userId} style={{ borderBottom:"1px solid #b3e5fc" }}>
                            <td style={{ padding:"12px 16px", minWidth:"220px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", minWidth:0 }}>
                                <Avatar src={avatarUrl(req.user)} name={req.user?.fullName} alt={req.user?.fullName} size={36} />
                                <div style={{ fontWeight:700, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"#0f172a" }}>{req.user?.fullName}</div>
                              </div>
                            </td>
                            <td style={{ padding:"12px 16px", fontSize:"0.85rem", color:"#64748b", minWidth:"180px" }}>{req.user?.email}</td>
                            <td style={{ padding:"12px 16px" }}><span style={{ backgroundColor:"#fef3c720", color:"#f59e0b", fontSize:"0.75rem", fontWeight:700, padding:"3px 10px", borderRadius:20 }}>User</span></td>
                            <td style={{ padding:"12px 16px", fontSize:"0.85rem", color:"#94a3b8" }}>{new Date(req.requestedAt).toLocaleDateString()}</td>
                            <td style={{ padding:"12px 16px" }}>
                              <div style={{ display:"flex", gap:"0.5rem" }}>
                                <button onClick={() => approveRequest(req.userId)} style={{ backgroundColor:"#10b98120", color:"#10b981", border:"none", borderRadius:8, padding:"6px 12px", fontWeight:700, fontSize:"0.8rem", cursor:"pointer" }}>Approve</button>
                                <button onClick={() => rejectRequest(req.userId)} style={{ backgroundColor:"#ef444420", color:"#ef4444", border:"none", borderRadius:8, padding:"6px 12px", fontWeight:700, fontSize:"0.8rem", cursor:"pointer" }}>Reject</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {tab === "posts" && (
                <div style={{ background:"#e0f2fe", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.875rem" }}>
                    <thead><tr style={{ backgroundColor:"#cffafe", borderBottom:"1px solid #06b6d4" }}>
                      {["Author","Content","Status","Likes","Comments","Del"].map(h => <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontWeight:800, color:"#0c4a6e", fontSize:"0.78rem", textTransform:"uppercase" }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {posts.map(p => (
                        <tr key={p._id} style={{ borderBottom:"1px solid #b3e5fc" }}>
                          <td style={{ padding:"12px 16px" }}>
                            <div style={{ fontWeight:700, fontSize:"0.85rem" }}>{p.author?.user_info?.fullName||p.author?.fullName||"?"}</div>
                            <div style={{ fontSize:"0.75rem", color:"#94a3b8" }}>{p.author?.email}</div>
                          </td>
                          <td style={{ padding:"12px 16px", maxWidth:260 }}><div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.content}</div></td>
                          <td style={{ padding:"12px 16px" }}><span style={{ fontSize:"0.75rem", fontWeight:700, padding:"3px 10px", borderRadius:20, backgroundColor:p.verificationStatus==="approved"?"#dcfce7":p.verificationStatus==="rejected"?"#fee2e2":"#fef9c3", color:p.verificationStatus==="approved"?"#16a34a":p.verificationStatus==="rejected"?"#dc2626":"#92400e" }}>{p.verificationStatus}</span></td>
                          <td style={{ padding:"12px 16px", color:"#64748b", fontWeight:600 }}>{p.likes?.length||0}</td>
                          <td style={{ padding:"12px 16px", color:"#64748b", fontWeight:600 }}>{p.comments?.length||0}</td>
                          <td style={{ padding:"12px 16px" }}><button onClick={() => delPost(p._id)} style={aBtn("#ef4444")}><Trash2 size={14}/></button></td>
                        </tr>
                      ))}
                      {posts.length===0 && <tr><td colSpan={6} style={{ padding:"2rem", textAlign:"center", color:"#94a3b8" }}>No posts</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {warnModal && (
        <div style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }} onClick={() => setWarnModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:"white", borderRadius:20, padding:"2rem", width:420, position:"relative" }}>
            <button onClick={() => setWarnModal(null)} style={{ position:"absolute", top:14, right:14, background:"#f1f5f9", border:"none", borderRadius:"50%", width:30, height:30, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><X size={15}/></button>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem" }}><AlertTriangle size={22} color="#f59e0b"/><h3 style={{ fontWeight:900, margin:0 }}>Send Warning</h3></div>
            <textarea value={warnMsg} onChange={e => setWarnMsg(e.target.value)} placeholder="Warning message..." rows={4} style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #e2e8f0", outline:"none", fontSize:"0.9rem", resize:"vertical", boxSizing:"border-box", marginBottom:"1rem" }}/>
            <button onClick={warn} style={{ width:"100%", padding:"11px 0", borderRadius:10, border:"none", backgroundColor:"#f59e0b", color:"white", fontWeight:800, cursor:"pointer" }}>Send Warning</button>
          </div>
        </div>
      )}
    </div>
  )
}

