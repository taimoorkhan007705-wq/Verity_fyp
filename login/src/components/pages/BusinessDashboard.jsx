import React, { useState } from "react";
import { 
  LayoutDashboard, Package, MessageSquare, TrendingUp, 
  Plus, LogOut, X, Link as LinkIcon, Send, ImageIcon, Video, Search, MoreVertical, Phone, Video as VideoCall, Trash2
} from "lucide-react";

const BusinessDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("messages"); 
  const [showAddForm, setShowAddForm] = useState(false);
  
  // --- PRODUCT STORAGE ---
  const [myProducts, setMyProducts] = useState([]);

  // --- MESSAGES LOGIC (INSTAGRAM STYLE) ---
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatHistory, setChatHistory] = useState({
    1: [{ id: 101, text: "Is this still available?", sender: "customer", time: "10:00 AM" }],
    2: [{ id: 201, text: "I want to buy the lake product.", sender: "customer", time: "09:30 AM" }]
  });

  const contacts = [
    { id: 1, name: "Ahmed Ali", avatar: "A", lastMsg: "Price?", time: "2m" },
    { id: 2, name: "Sara Khan", avatar: "S", lastMsg: "Available?", time: "1h" },
  ];

  // --- FORM STATE (EXACTLY AS REQUESTED) ---
  const [productData, setProductData] = useState({
    title: "", price: "", description: "", category: "Electronics", stock: "", externalLink: "", imageFile: null, videoFile: null
  });

  const theme = { teal: "#14b8a6", dark: "#0f172a", border: "#e2e8f0", bg: "#f1f5f9" };

  // --- FUNCTIONS ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    const msg = { id: Date.now(), text: newMessage, sender: "me", time: "Now" };
    setChatHistory(prev => ({ ...prev, [selectedChat.id]: [...(prev[selectedChat.id] || []), msg] }));
    setNewMessage("");
  };

  const handlePublish = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      ...productData,
      preview: productData.imageFile ? URL.createObjectURL(productData.imageFile) : null
    };
    setMyProducts([newProduct, ...myProducts]);
    setShowAddForm(false);
    setActiveTab("inventory");
    setProductData({ title: "", price: "", description: "", category: "Electronics", stock: "", externalLink: "", imageFile: null, videoFile: null });
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", backgroundColor: theme.bg, fontFamily: "sans-serif" }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: "280px", minWidth: "280px", backgroundColor: theme.dark, color: "white", display: "flex", flexDirection: "column", padding: "30px 20px", height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "50px" }}>
          <div style={{ backgroundColor: theme.teal, padding: "8px", borderRadius: "10px" }}><TrendingUp size={24} color="white" /></div>
          <span style={{ fontWeight: "900", fontSize: "20px" }}>SELLER STUDIO</span>
        </div>
        <nav style={{ flex: 1 }}>
          <div onClick={() => setActiveTab("overview")} style={navLinkStyle(activeTab === "overview", theme)}><LayoutDashboard size={20}/> Dashboard</div>
          <div onClick={() => setActiveTab("inventory")} style={navLinkStyle(activeTab === "inventory", theme)}><Package size={20}/> My Products</div>
          <div onClick={() => setActiveTab("messages")} style={navLinkStyle(activeTab === "messages", theme)}><MessageSquare size={20}/> Messages</div>
        </nav>
        <button onClick={onLogout} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontWeight: "800" }}><LogOut size={20}/> Log Out</button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <header style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", borderBottom: `1px solid ${theme.border}` }}>
          <h1 style={{ fontSize: "24px", fontWeight: "900" }}>{activeTab.toUpperCase()}</h1>
          <button onClick={() => setShowAddForm(true)} style={primaryBtn(theme)}><Plus size={20}/> Create Business Listing</button>
        </header>

        <section style={{ flex: 1, padding: "30px", overflow: "hidden" }}>
          
          {/* MESSAGES TAB (INSTAGRAM STYLE) */}
          {activeTab === "messages" && (
            <div style={{ display: "flex", backgroundColor: "white", borderRadius: "24px", height: "100%", overflow: "hidden", border: `1px solid ${theme.border}` }}>
              <div style={{ width: "320px", borderRight: `1px solid ${theme.border}`, overflowY: "auto" }}>
                {contacts.map(c => (
                  <div key={c.id} onClick={() => setSelectedChat(c)} style={{ padding: "20px", cursor: "pointer", backgroundColor: selectedChat?.id === c.id ? "#f0fdfa" : "white", borderBottom: `1px solid ${theme.bg}` }}>
                    <div style={{ fontWeight: "800" }}>{c.name}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{c.lastMsg}</div>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {selectedChat ? (
                  <>
                    <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#f8fafc" }}>
                      {(chatHistory[selectedChat.id] || []).map(m => (
                        <div key={m.id} style={{ alignSelf: m.sender === "me" ? "flex-end" : "flex-start", backgroundColor: m.sender === "me" ? theme.teal : "white", color: m.sender === "me" ? "white" : "black", padding: "10px 15px", borderRadius: "15px", maxWidth: "70%" }}>{m.text}</div>
                      ))}
                    </div>
                    <form onSubmit={handleSendMessage} style={{ padding: "20px", display: "flex", gap: "10px", borderTop: `1px solid ${theme.border}` }}>
                      <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} style={{ flex: 1, padding: "12px", borderRadius: "20px", border: `1px solid ${theme.border}` }} placeholder="Message..." />
                      <button type="submit" style={{ backgroundColor: theme.teal, color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px" }}><Send size={18}/></button>
                    </form>
                  </>
                ) : <div style={{ margin: "auto", color: "#94a3b8" }}>Select a chat</div>}
              </div>
            </div>
          )}

          {/* MY PRODUCTS TAB (INVENTORY) */}
          {activeTab === "inventory" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
              {myProducts.map(p => (
                <div key={p.id} style={{ backgroundColor: "white", padding: "15px", borderRadius: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                  <div style={{ height: "150px", backgroundColor: "#f1f5f9", borderRadius: "10px", overflow: "hidden", marginBottom: "10px" }}>
                    {p.preview && <img src={p.preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <h4 style={{ margin: "0" }}>{p.title}</h4>
                  <p style={{ color: theme.teal, fontWeight: "900" }}>Rs. {p.price}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* CREATE LISTING MODAL */}
      {showAddForm && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div style={{ backgroundColor: "white", width: "800px", borderRadius: "32px", padding: "40px", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
             <X onClick={() => setShowAddForm(false)} style={{ position: "absolute", right: "25px", top: "25px", cursor: "pointer" }} />
             <h2 style={{ fontWeight: "900", marginBottom: "25px" }}>Create Business Listing</h2>
             <form onSubmit={handlePublish}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "15px" }}>
                  <div><label style={labelStyle}>Product Title</label><input style={inputStyle} value={productData.title} onChange={e => setProductData({...productData, title: e.target.value})} required /></div>
                  <div><label style={labelStyle}>Price (PKR)</label><input style={inputStyle} value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} required /></div>
                </div>
                <div style={{ marginBottom: "15px" }}><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, height: "80px" }} value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} required /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "15px" }}>
                  <div><label style={labelStyle}>Category</label><select style={inputStyle} value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})}><option>Electronics</option><option>Automotive</option></select></div>
                  <div><label style={labelStyle}>Stock</label><input style={inputStyle} type="number" value={productData.stock} onChange={e => setProductData({...productData, stock: e.target.value})} required /></div>
                </div>
                <div style={{ marginBottom: "15px" }}><label style={labelStyle}>External Link</label><input style={inputStyle} value={productData.externalLink} onChange={e => setProductData({...productData, externalLink: e.target.value})} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
                   <div style={uploadBox}>
                      <input type="file" accept="image/*" style={{ display: 'none' }} id="img" onChange={e => setProductData({...productData, imageFile: e.target.files[0]})} />
                      <label htmlFor="img" style={{ cursor: 'pointer' }}><ImageIcon size={24}/> {productData.imageFile ? "Image Ready" : "Upload Image"}</label>
                   </div>
                   <div style={uploadBox}>
                      <input type="file" accept="video/*" style={{ display: 'none' }} id="vid" onChange={e => setProductData({...productData, videoFile: e.target.files[0]})} />
                      <label htmlFor="vid" style={{ cursor: 'pointer' }}><Video size={24}/> {productData.videoFile ? "Video Ready" : "Upload Video"}</label>
                   </div>
                </div>
                <button type="submit" style={publishBtn(theme)}>Confirm & Publish</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

const navLinkStyle = (active, theme) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "12px 20px", borderRadius: "10px", cursor: "pointer", marginBottom: "5px", backgroundColor: active ? theme.teal : "transparent", color: active ? "white" : "#94a3b8", fontWeight: "700" });
const labelStyle = { fontSize: "11px", fontWeight: "800", color: "#0f172a", marginBottom: "5px", display: "block", textTransform: "uppercase" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", boxSizing: "border-box" };
const uploadBox = { border: "1px dashed #cbd5e1", padding: "20px", borderRadius: "15px", textAlign: "center", backgroundColor: "#f8fafc", fontWeight: "700" };
const primaryBtn = (theme) => ({ backgroundColor: theme.teal, color: "white", padding: "10px 20px", borderRadius: "10px", border: "none", fontWeight: "800", cursor: "pointer", display: "flex", gap: "8px" });
const publishBtn = (theme) => ({ width: "100%", padding: "15px", backgroundColor: theme.teal, color: "white", borderRadius: "12px", border: "none", fontWeight: "900", cursor: "pointer" });

export default BusinessDashboard;