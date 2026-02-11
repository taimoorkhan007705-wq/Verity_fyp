import React, { useState, useRef } from "react";
import { 
  Plus, Trash2, Search, X, ExternalLink,
  Image as ImageIcon, Video, Play, Upload, 
  CheckCircle2, Briefcase
} from "lucide-react";

const BusinessDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: "Smart Watch Enterprise", 
      price: "12,500", 
      type: "image",
      url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300",
      link: "https://amazon.com"
    }
  ]);

  const [form, setForm] = useState({ name: "", price: "", link: "" });

  const theme = {
    teal: "#14b8a6", // From your sidebar
    bg: "#f8fafc",
    border: "#e2e8f0"
  };

  const s = {
    container: { backgroundColor: theme.bg, minHeight: "100vh", fontFamily: "sans-serif", color: "#1e293b" },
    nav: { backgroundColor: "white", padding: "20px 50px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}` },
    formCard: { backgroundColor: "white", padding: "40px", borderRadius: "20px", border: `1px solid ${theme.border}`, marginBottom: "40px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" },
    input: { width: "100%", padding: "22px", fontSize: "20px", borderRadius: "12px", border: `2px solid #f1f5f9`, backgroundColor: "#f8fafc", boxSizing: "border-box", outline: "none", marginBottom: "25px", fontWeight: "600" },
    upload: { border: `2px dashed ${theme.border}`, borderRadius: "15px", padding: "35px", textAlign: "center", cursor: "pointer", marginBottom: "25px" },
    primaryBtn: { backgroundColor: theme.teal, color: "white", padding: "16px 32px", borderRadius: "12px", fontWeight: "700", border: "none", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", gap: "10px" },
    row: { display: "flex", alignItems: "center", padding: "25px 45px", borderBottom: `1px solid #f1f5f9`, backgroundColor: "white", cursor: "pointer" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const newItem = { 
      id: Date.now(), 
      ...form,
      price: parseInt(form.price).toLocaleString(), 
      type: mediaType, 
      url: previewUrl || "https://via.placeholder.com/300" 
    };
    setProducts([newItem, ...products]);
    setForm({ name: "", price: "", link: "" });
    setPreviewUrl(null);
    setIsFormOpen(false);
  };

  return (
    <div style={s.container}>
      <nav style={s.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Briefcase size={28} color={theme.teal} />
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800" }}>Business Dashboard</h1>
        </div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} style={s.primaryBtn}>
          {isFormOpen ? <X size={20}/> : <Plus size={20}/>} {isFormOpen ? "Cancel" : "Add Product"}
        </button>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "50px 20px" }}>
        
        {isFormOpen && (
          <div style={s.formCard}>
            <form onSubmit={handleCreate}>
              <p style={{ fontWeight: "800", marginBottom: "10px", fontSize: "14px", color: "#64748b", textTransform: "uppercase" }}>Product Title</p>
              <input required style={s.input} placeholder="Enter name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
              
              <div style={{ display: "flex", gap: "25px" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: "800", marginBottom: "10px", fontSize: "14px", color: "#64748b", textTransform: "uppercase" }}>Price (PKR)</p>
                  <input required type="number" style={s.input} placeholder="Rs." value={form.price} onChange={(e)=>setForm({...form, price: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: "800", marginBottom: "10px", fontSize: "14px", color: "#64748b", textTransform: "uppercase" }}>Content Type</p>
                  <div style={{ display: "flex", gap: "10px", backgroundColor: "#f1f5f9", padding: "8px", borderRadius: "12px" }}>
                    <button type="button" onClick={() => setMediaType("image")} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", backgroundColor: mediaType === "image" ? theme.teal : "transparent", color: mediaType === "image" ? "white" : "#64748b" }}>Image</button>
                    <button type="button" onClick={() => setMediaType("video")} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", backgroundColor: mediaType === "video" ? theme.teal : "transparent", color: mediaType === "video" ? "white" : "#64748b" }}>Video</button>
                  </div>
                </div>
              </div>

              <p style={{ fontWeight: "800", marginBottom: "10px", fontSize: "14px", color: "#64748b", textTransform: "uppercase" }}>Store Link (Amazon/Shopify)</p>
              <input style={s.input} placeholder="Paste link here..." value={form.link} onChange={(e)=>setForm({...form, link: e.target.value})} />

              <div style={s.upload} onClick={() => fileInputRef.current.click()}>
                <input type="file" ref={fileInputRef} hidden accept={mediaType === "image" ? "image/*" : "video/*"} onChange={handleFileUpload} />
                {previewUrl ? (
                  <p style={{ color: theme.teal, fontWeight: "800", margin: 0 }}><CheckCircle2 size={18} inline /> File Attached</p>
                ) : (
                  <p style={{ margin: 0, fontWeight: "700", color: "#64748b" }}><Upload size={24} style={{marginBottom:'10px'}} /> <br/> Tap to upload from Device</p>
                )}
              </div>

              <button type="submit" style={{ ...s.primaryBtn, width: "100%", padding: "24px", justifyContent: "center", fontSize: "18px" }}>
                Confirm & List Product
              </button>
            </form>
          </div>
        )}

        <div style={{ borderRadius: "15px", overflow: "hidden", border: `1px solid ${theme.border}` }}>
          <div style={{ backgroundColor: "white", padding: "25px 45px", borderBottom: `2px solid ${theme.bg}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>Manage Inventory</h3>
            <div style={{ position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: "15px", top: "12px", color: "#cbd5e1" }} />
              <input placeholder="Search..." style={{ padding: "12px 15px 12px 45px", borderRadius: "10px", border: `1px solid ${theme.border}`, outline: "none", width: "250px" }} value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
            </div>
          </div>

          {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p) => (
            <div key={p.id} style={s.row} onClick={() => setSelectedProduct(p)}>
              <div style={{ width: "70px", height: "70px", borderRadius: "12px", overflow: "hidden", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {p.type === "image" ? (
                  <img src={p.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Play color={theme.teal} size={24} />
                )}
              </div>
              <div style={{ flex: 1, marginLeft: "25px" }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "700" }}>{p.name}</p>
                <span style={{ fontSize: "12px", fontWeight: "800", color: theme.teal }}>{p.type.toUpperCase()}</span>
              </div>
              <div style={{ textAlign: "right", marginRight: "40px" }}>
                <p style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>Rs. {p.price}</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setProducts(products.filter(i => i.id !== p.id)); }} 
                style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1" }}
              >
                <Trash2 size={22} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP VIEW */}
      {selectedProduct && (
        <div style={s.modalOverlay} onClick={() => setSelectedProduct(null)}>
          <div style={{ backgroundColor: "white", width: "100%", maxWidth: "550px", borderRadius: "28px", overflow: "hidden", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: "absolute", right: "20px", top: "20px", background: "white", border: "none", cursor: "pointer", borderRadius: "50%", padding: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 10 }}>
              <X size={24} />
            </button>
            <div style={{ height: "350px", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {selectedProduct.type === "image" ? (
                <img src={selectedProduct.url} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <video src={selectedProduct.url} controls autoPlay style={{ width: "100%", height: "100%" }} />
              )}
            </div>
            <div style={{ padding: "40px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: "800", margin: "0 0 10px 0" }}>{selectedProduct.name}</h2>
              <p style={{ fontSize: "32px", fontWeight: "900", color: theme.teal, margin: "0 0 25px 0" }}>Rs. {selectedProduct.price}</p>
              {selectedProduct.link && (
                <a href={selectedProduct.link} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <button style={{ ...s.primaryBtn, width: "100%", justifyContent: "center", padding: "22px" }}>
                    <ExternalLink size={22} /> Visit External Store
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;