import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Briefcase, ChevronRight, ShieldCheck } from 'lucide-react';

const BusinessLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    // Logic: In a real app, you'd verify business credentials here
    console.log("Logging into Business Account...", credentials);
    
    // For now, we simulate a successful login
    localStorage.setItem("businessToken", "true"); 
    navigate("/dashboard"); 
  };

  const theme = {
    teal: "#14b8a6",
    navy: "#0f172a",
    slate: "#1e293b",
    border: "#e2e8f0"
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "white", fontFamily: "sans-serif" }}>
      
      {/* LEFT SIDE: Branding & Info */}
      <div style={{ 
        flex: 1.2, 
        backgroundColor: theme.navy, 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        padding: "80px", 
        color: "white",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Subtle Background Pattern Decoration */}
        <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, transparent 70%)" }}></div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
            <div style={{ backgroundColor: theme.teal, padding: "10px", borderRadius: "12px" }}>
              <Briefcase size={32} color="white" />
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: "900", letterSpacing: "1px" }}>VERITY BUSINESS</h2>
          </div>

          <h1 style={{ fontSize: "52px", fontWeight: "900", lineHeight: "1.1", marginBottom: "25px" }}>
            Scale your brand <br/> with <span style={{ color: theme.teal }}>Professional Tools.</span>
          </h1>
          
          <p style={{ fontSize: "18px", color: "#94a3b8", maxWidth: "480px", lineHeight: "1.6", marginBottom: "40px" }}>
            The dedicated workspace for verified merchants and service providers to manage ads, track leads, and grow revenue.
          </p>

          <div style={{ display: "grid", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <ShieldCheck color={theme.teal} size={24} />
              <span style={{ fontWeight: "600", color: "#cbd5e1" }}>Secure Encrypted Business Access</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <TrendingUpIndicator color={theme.teal} />
              <span style={{ fontWeight: "600", color: "#cbd5e1" }}>Real-time Sales Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "900", color: theme.navy, margin: 0 }}>Business Sign In</h2>
            <p style={{ color: "#64748b", marginTop: "10px", fontWeight: "500" }}>Enter your store administration credentials</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "12px", fontWeight: "800", color: theme.navy, textTransform: "uppercase" }}>Work Email Address</label>
              <input 
                required 
                type="email" 
                style={inputStyle} 
                placeholder="admin@yourcompany.com" 
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              />
            </div>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "12px", fontWeight: "800", color: theme.navy, textTransform: "uppercase" }}>Password</label>
              <input 
                required 
                type="password" 
                style={inputStyle} 
                placeholder="••••••••" 
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              />
            </div>

            <div style={{ textAlign: "right", marginBottom: "30px" }}>
              <span style={{ fontSize: "14px", color: theme.teal, fontWeight: "700", cursor: "pointer" }}>Forgot Password?</span>
            </div>

            <button type="submit" style={submitBtnStyle}>
              <Lock size={18}/> Access Dashboard <ChevronRight size={18} />
            </button>
          </form>
          
          <div style={{ marginTop: "40px", padding: "25px", borderRadius: "20px", backgroundColor: "#f8fafc", border: `1px solid ${theme.border}`, textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#64748b", fontWeight: "600" }}>
              Want to start selling? 
              <span style={{ color: theme.teal, fontWeight: "800", marginLeft: "8px", cursor: "pointer" }}>Create Business Account</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Styles
const inputStyle = {
  width: "100%",
  padding: "18px 20px",
  borderRadius: "14px",
  border: "2px solid #f1f5f9",
  backgroundColor: "#f8fafc",
  marginTop: "10px",
  outline: "none",
  fontSize: "16px",
  fontWeight: "600",
  boxSizing: "border-box",
  transition: "border-color 0.2s"
};

const submitBtnStyle = {
  width: "100%",
  padding: "20px",
  borderRadius: "14px",
  border: "none",
  backgroundColor: "#14b8a6",
  color: "white",
  fontWeight: "800",
  fontSize: "16px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  boxShadow: "0 10px 15px -3px rgba(20, 184, 166, 0.3)"
};

const TrendingUpIndicator = ({ color }) => (
  <div style={{ color }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  </div>
);

export default BusinessLogin;