import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, MessageSquare, TrendingUp, Plus, LogOut, X, Send, ImageIcon, Video } from "lucide-react";
import { logout as apiLogout } from "../../services/api";
import BusinessMessages from "./BusinessMessages";

const BusinessDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("messages"); 
  const [showAddForm, setShowAddForm] = useState(false);
  
  // --- PRODUCT STORAGE ---
  const [myProducts, setMyProducts] = useState([]);
  
  // Load products on mount
  React.useEffect(() => {
    loadMyProducts();
  }, []);
  
  const loadMyProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/products/business/my-products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const formattedProducts = data.products.map(p => ({
          id: p._id,
          title: p.name,
          price: p.price,
          description: p.description,
          category: p.category,
          stock: p.stock,
          preview: p.images && p.images.length > 0 ? `http://localhost:5000${p.images[0].url}` : null
        }));
        setMyProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };
  
  // --- FORM STATE ---
  const [productData, setProductData] = useState({
    title: "", 
    price: "", 
    description: "", 
    category: "Electronics", 
    stock: "", 
    externalLink: "", 
    imageFile: null, 
    videoFile: null
  });
  
  const theme = { teal: "#14b8a6", dark: "#0f172a", border: "#e2e8f0", bg: "#f1f5f9" };
  
  // --- FUNCTIONS ---
  const handleLogout = () => {
    apiLogout();
    if (onLogout) onLogout();
    navigate('/');
    window.location.reload();
  };

  
  const handlePublish = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Creating product with data:', productData);
      
      const formData = new FormData();
      formData.append('name', productData.title);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('stock', productData.stock);
      formData.append('tags', JSON.stringify([]));
      
      if (productData.imageFile) {
        formData.append('images', productData.imageFile);
        console.log('Image file attached:', productData.imageFile.name);
      }
      
      const token = localStorage.getItem('token');
      console.log('Sending request to backend...');
      
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        alert('Product created successfully!');
        // Add to local state for immediate display
        const newProduct = {
          id: data.product._id,
          title: productData.title,
          price: productData.price,
          description: productData.description,
          category: productData.category,
          stock: productData.stock,
          preview: productData.imageFile ? URL.createObjectURL(productData.imageFile) : null
        };
        setMyProducts([newProduct, ...myProducts]);
        setShowAddForm(false);
        setActiveTab("inventory");
        setProductData({ title: "", price: "", description: "", category: "Electronics", stock: "", externalLink: "", imageFile: null, videoFile: null });
      } else {
        console.error('Failed to create product:', data);
        alert('Failed to create product: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product: ' + error.message);
    }
  };
  
  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", backgroundColor: theme.bg, fontFamily: "sans-serif" }}>
      {/* SIDEBAR */}
      <aside style={{ 
        width: "280px", 
        minWidth: "280px", 
        backgroundColor: theme.dark, 
        color: "white", 
        display: "flex", 
        flexDirection: "column", 
        padding: "30px 20px", 
        height: "100vh", 
        justifyContent: "space-between",
        overflow: "hidden"
      }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "50px" }}>
            <div style={{ backgroundColor: theme.teal, padding: "8px", borderRadius: "10px" }}>
              <TrendingUp size={24} color="white" />
            </div>
            <span style={{ fontWeight: "900", fontSize: "20px" }}>SELLER STUDIO</span>
          </div>
          
          <nav style={{ flex: 1 }}>
            <div onClick={() => setActiveTab("overview")} style={navLinkStyle(activeTab === "overview", theme)}>
              <LayoutDashboard size={20}/> Dashboard
            </div>
            <div onClick={() => setActiveTab("inventory")} style={navLinkStyle(activeTab === "inventory", theme)}>
              <Package size={20}/> My Products
            </div>
            <div onClick={() => setActiveTab("messages")} style={navLinkStyle(activeTab === "messages", theme)}>
              <MessageSquare size={20}/> Messages
            </div>
          </nav>
        </div>
        
        {/* LOGOUT BUTTON - ALWAYS AT BOTTOM */}
        <div 
          onClick={handleLogout} 
          style={{ 
            background: "#f87171", 
            border: "none", 
            color: "white", 
            cursor: "pointer", 
            fontWeight: "800",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "14px 20px",
            borderRadius: "10px",
            transition: "all 0.2s",
            marginTop: "20px",
            flexShrink: 0
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#dc2626";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#f87171";
          }}
        >
          <LogOut size={20}/> Log Out
        </div>
      </aside>
      
      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <header style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", borderBottom: `1px solid ${theme.border}` }}>
          <h1 style={{ fontSize: "24px", fontWeight: "900" }}>{activeTab.toUpperCase()}</h1>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <button onClick={() => setShowAddForm(true)} style={primaryBtn(theme)}>
              <Plus size={20}/> Create Business Listing
            </button>
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                gap: "8px",
                alignItems: "center"
              }}
            >
              <LogOut size={18}/> Logout
            </button>
          </div>
        </header>
        
        <section style={{ flex: 1, padding: "30px", overflow: "hidden" }}>
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", fontSize: "18px" }}>
              <div style={{ textAlign: "center" }}>
                <LayoutDashboard size={64} style={{ margin: "0 auto 20px", opacity: 0.5 }} />
                <p>Dashboard Overview Coming Soon</p>
              </div>
            </div>
          )}
          
          {/* MESSAGES TAB */}
          {activeTab === "messages" && (
            <BusinessMessages />
          )}
          
          {/* MY PRODUCTS TAB (INVENTORY) */}
          {activeTab === "inventory" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
              {myProducts.map(p => (
                <div key={p.id} style={{ backgroundColor: "white", padding: "15px", borderRadius: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                  <div style={{ height: "150px", backgroundColor: "#f1f5f9", borderRadius: "10px", overflow: "hidden", marginBottom: "10px" }}>
                    {p.preview && <img src={p.preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={p.title} />}
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
                <div>
                  <label style={labelStyle}>Product Title</label>
                  <input style={inputStyle} value={productData.title} onChange={e => setProductData({...productData, title: e.target.value})} required />
                </div>
                <div>
                  <label style={labelStyle}>Price (PKR)</label>
                  <input style={inputStyle} value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} required />
                </div>
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, height: "80px" }} value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} required />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "15px" }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})}>
                    <option>Electronics</option>
                    <option>Automotive</option>
                    <option>Fashion & Clothing</option>
                    <option>Home & Furniture</option>
                    <option>Beauty & Personal Care</option>
                    <option>Sports & Outdoors</option>
                    <option>Books & Stationery</option>
                    <option>Toys & Games</option>
                    <option>Food & Beverages</option>
                    <option>Health & Wellness</option>
                    <option>Jewelry & Accessories</option>
                    <option>Pet Supplies</option>
                    <option>Garden & Tools</option>
                    <option>Baby & Kids</option>
                    <option>Art & Crafts</option>
                    <option>Music & Instruments</option>
                    <option>Real Estate</option>
                    <option>Services</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Stock</label>
                  <input style={inputStyle} type="number" value={productData.stock} onChange={e => setProductData({...productData, stock: e.target.value})} required />
                </div>
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>External Link</label>
                <input style={inputStyle} value={productData.externalLink} onChange={e => setProductData({...productData, externalLink: e.target.value})} />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
                <div style={uploadBox}>
                  <input type="file" accept="image/*" style={{ display: 'none' }} id="img" onChange={e => setProductData({...productData, imageFile: e.target.files[0]})} />
                  <label htmlFor="img" style={{ cursor: 'pointer' }}>
                    <ImageIcon size={24}/> {productData.imageFile ? "Image Ready" : "Upload Image"}
                  </label>
                </div>
                <div style={uploadBox}>
                  <input type="file" accept="video/*" style={{ display: 'none' }} id="vid" onChange={e => setProductData({...productData, videoFile: e.target.files[0]})} />
                  <label htmlFor="vid" style={{ cursor: 'pointer' }}>
                    <Video size={24}/> {productData.videoFile ? "Video Ready" : "Upload Video"}
                  </label>
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

const navLinkStyle = (active, theme) => ({ 
  display: "flex", 
  alignItems: "center", 
  gap: "10px", 
  padding: "12px 20px", 
  borderRadius: "10px", 
  cursor: "pointer", 
  marginBottom: "5px", 
  backgroundColor: active ? theme.teal : "transparent", 
  color: active ? "white" : "#94a3b8", 
  fontWeight: "700" 
});

const labelStyle = { 
  fontSize: "11px", 
  fontWeight: "800", 
  color: "#0f172a", 
  marginBottom: "5px", 
  display: "block", 
  textTransform: "uppercase" 
};

const inputStyle = { 
  width: "100%", 
  padding: "12px", 
  borderRadius: "10px", 
  border: "1px solid #e2e8f0", 
  outline: "none", 
  boxSizing: "border-box" 
};

const uploadBox = { 
  border: "1px dashed #cbd5e1", 
  padding: "20px", 
  borderRadius: "15px", 
  textAlign: "center", 
  backgroundColor: "#f8fafc", 
  fontWeight: "700" 
};

const primaryBtn = (theme) => ({ 
  backgroundColor: theme.teal, 
  color: "white", 
  padding: "10px 20px", 
  borderRadius: "10px", 
  border: "none", 
  fontWeight: "800", 
  cursor: "pointer", 
  display: "flex", 
  gap: "8px" 
});

const publishBtn = (theme) => ({ 
  width: "100%", 
  padding: "15px", 
  backgroundColor: theme.teal, 
  color: "white", 
  borderRadius: "12px", 
  border: "none", 
  fontWeight: "900", 
  cursor: "pointer" 
});

export default BusinessDashboard;
