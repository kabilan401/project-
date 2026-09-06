import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  PlusCircle,
  Heart, 
  MessageSquare, 
  Grid, 
  BookOpen, 
  Laptop, 
  Home, 
  Bike, 
  Shirt, 
  MapPin, 
  Star, 
  X, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Send,
  Eye,
  Tag,
  ArrowRight,
  UserCheck,
  Shield,
  LogOut,
  User,
  Users,
  Trash2,
  Lock,
  Mail,
  Award,
  GraduationCap,
  Building,
  QrCode,
  Upload
} from 'lucide-react';

export default function App() {
  // Clear any legacy mock items from browser memory
  useEffect(() => {
    try {
      const saved = localStorage.getItem('campusmart_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If parsed items contain old legacy mock IDs like "cm-001", clear them out!
        if (Array.isArray(parsed) && parsed.some(p => p.id && p.id.startsWith('cm-00'))) {
          localStorage.removeItem('campusmart_products');
          setProducts([]);
        }
      }
    } catch (e) {}
  }, []);

  // Products State - Fresh (Empty by default)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('campusmart_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !parsed.some(p => p.id && p.id.startsWith('cm-00'))) {
          return parsed;
        }
      }
    } catch (e) {}
    return [];
  });

  // Students Database State
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('campusmart_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Current Logged In User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campusmart_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('campusmart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Auth Page State: 'student-register', 'student-login', 'admin-login'
  const [loginPageTab, setLoginPageTab] = useState('student-register');

  // Search & Filter
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Modals & Chat
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [adminTab, setAdminTab] = useState('students'); // 'students', 'products'
  const [adminSearch, setAdminSearch] = useState('');

  const [chatProduct, setChatProduct] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Student Form Inputs
  const [regName, setRegName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCollege, setRegCollege] = useState('School of Computing');
  const [loginId, setLoginId] = useState('');

  // Admin Form Inputs
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Sell Product Form Inputs
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Textbooks');
  const [newCondition, setNewCondition] = useState('Like New');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newUPI, setNewUPI] = useState('');

  // Permanent Light Mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Android Hardware Back Button & Modal Dismiss Listener
  useEffect(() => {
    const handlePopState = () => {
      if (selectedProduct || isSellModalOpen || isWishlistModalOpen || chatProduct) {
        setSelectedProduct(null);
        setIsSellModalOpen(false);
        setIsWishlistModalOpen(false);
        setChatProduct(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedProduct, isSellModalOpen, isWishlistModalOpen, chatProduct]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('campusmart_products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('campusmart_students', JSON.stringify(students));
    } catch (e) {}
  }, [students]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('campusmart_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('campusmart_current_user');
      }
    } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('campusmart_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  const triggerConfetti = (opts) => {
    try { confetti(opts); } catch (e) {}
  };

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ---------------- AUTH HANDLERS ----------------
  const handleStudentRegister = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regStudentId.trim() || !regEmail.trim()) return;

    const newStudent = {
      id: `STU-${Date.now().toString().slice(-4)}`,
      name: regName.trim(),
      email: regEmail.trim(),
      college: regCollege || "Engineering Department",
      studentId: regStudentId.trim().toUpperCase(),
      joinedDate: new Date().toISOString().split('T')[0],
      status: "Active",
      listingsCount: 0
    };

    setStudents(prev => [newStudent, ...prev]);
    const userPayload = { role: 'student', ...newStudent };
    setCurrentUser(userPayload);

    setRegName('');
    setRegStudentId('');
    setRegEmail('');

    triggerConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    showToast(`🎉 Registration Successful! Welcome, ${newStudent.name}`);
  };

  const handleStudentLogin = (e) => {
    e.preventDefault();
    if (!loginId.trim()) return;

    const query = loginId.trim().toLowerCase();
    const existing = students.find(s => 
      s.studentId.toLowerCase() === query || 
      s.email.toLowerCase() === query ||
      s.name.toLowerCase().includes(query)
    );

    if (existing) {
      setCurrentUser({ role: 'student', ...existing });
      setLoginId('');
      showToast(`Welcome back, ${existing.name}!`);
    } else {
      const autoStudent = {
        id: `STU-${Date.now().toString().slice(-4)}`,
        name: loginId.split('@')[0],
        email: loginId.includes('@') ? loginId : `${loginId}@college.edu`,
        college: "School of Computing",
        studentId: loginId.toUpperCase(),
        joinedDate: new Date().toISOString().split('T')[0],
        status: "Active",
        listingsCount: 0
      };
      setStudents(prev => [autoStudent, ...prev]);
      setCurrentUser({ role: 'student', ...autoStudent });
      setLoginId('');
      showToast(`Logged in as Student ${autoStudent.name}`);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (!adminUsername || !adminPassword) return;

    const adminPayload = {
      role: 'admin',
      name: 'System Administrator',
      email: 'admin@campusmart.edu',
      id: 'ADM-001'
    };

    setCurrentUser(adminPayload);
    setAdminUsername('');
    setAdminPassword('');
    showToast("👑 Authenticated as Administrator!");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast("Logged out successfully.");
  };

  const handleSellSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const sellerName = currentUser ? currentUser.name : "Student";
    const upiHandle = newUPI.trim() || `${sellerName.toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${encodeURIComponent(upiHandle)}&pn=${encodeURIComponent(sellerName)}&am=${parseFloat(newPrice)}&cu=INR`;

    const newItem = {
      id: `prod-${Date.now()}`,
      title: newTitle,
      price: parseFloat(newPrice),
      originalPrice: newOriginalPrice ? parseFloat(newOriginalPrice) : parseFloat(newPrice) * 1.4,
      category: newCategory,
      condition: newCondition,
      conditionColor: newCondition === 'Like New' ? '#10b981' : newCondition === 'Excellent' ? '#3b82f6' : '#f59e0b',
      seller: sellerName,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      rating: 5.0,
      reviewsCount: 1,
      college: currentUser ? currentUser.college : "School of Computing",
      location: newLocation || "Main Campus Quad",
      description: newDescription || "Great condition, ready for quick campus pickup!",
      image: newImage || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
      upiId: upiHandle,
      paymentQr: qrUrl,
      tags: ["Student Listing", newCategory, newCondition],
      status: "Available",
      postedAgo: "Just now"
    };

    setProducts(prev => [newItem, ...prev]);
    setIsSellModalOpen(false);

    if (currentUser?.id) {
      setStudents(prev => prev.map(s => s.id === currentUser.id ? { ...s, listingsCount: (s.listingsCount || 0) + 1 } : s));
    }

    setNewTitle('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewDescription('');
    setNewImage('');
    setNewLocation('');
    setNewUPI('');

    triggerConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    showToast("🎉 Your product has been listed on the marketplace!");
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("Listing deleted.");
  };

  const handleDeleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast("Student record removed from Admin Database.");
  };

  const toggleWishlist = (id, e) => {
    if (e) e.stopPropagation();
    setWishlist(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      if (arr.includes(id)) {
        showToast("Removed from Wishlist");
        return arr.filter(item => item !== id);
      } else {
        showToast("Saved to Wishlist!");
        return [...arr, id];
      }
    });
  };

  const openChat = (product, e) => {
    if (e) e.stopPropagation();
    setChatProduct(product);
    setChatMessages([
      { sender: 'seller', text: `Hi! Thanks for reaching out about "${product.title}". It's available for meetup at ${product.location || 'campus'}.` }
    ]);
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'seller', text: `Awesome! Meet near ${chatProduct?.location || 'the main quad'} around 4 PM today?` }
      ]);
    }, 1000);
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const safeStudents = Array.isArray(students) ? students : [];
  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];

  const filteredProducts = safeProducts.filter(item => {
    if (!item) return false;
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const title = item.title || '';
    const description = item.description || '';
    const tags = Array.isArray(item.tags) ? item.tags : [];
    const query = searchQuery ? searchQuery.toLowerCase() : '';
    
    return matchesCategory && (query === '' || 
      title.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query) ||
      tags.some(t => String(t).toLowerCase().includes(query)));
  });

  const filteredStudents = safeStudents.filter(s => {
    if (!adminSearch) return true;
    const q = adminSearch.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) ||
      (s.studentId || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.college || '').toLowerCase().includes(q);
  });

  const totalMarketValue = safeProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  // =------------------- 1. SCREEN: DEDICATED LOGIN & REGISTER PAGE (When Not Logged In) -------------------
  if (!currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        color: '#0f172a'
      }}>
        {/* Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 300,
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '9999px',
            fontWeight: 600,
            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={18} />
            {toastMessage}
          </div>
        )}

        {/* Top Header */}
        <header style={{
          padding: '1.25rem 2rem',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}>
              <ShoppingBag size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CampusMart
              </h1>
              <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>Verified College Portal</div>
            </div>
          </div>
        </header>

        {/* Center Auth Card Container */}
        <main style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            background: '#ffffff',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <GraduationCap size={32} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                Welcome to CampusMart
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Sign up or log in as a student to access the campus marketplace and save your profile into the database.
              </p>
            </div>

            {/* Auth Mode Switcher Tabs */}
            <div style={{
              display: 'flex',
              background: '#f1f5f9',
              padding: '4px',
              borderRadius: '14px',
              marginBottom: '2rem',
              gap: '4px'
            }}>
              <button 
                onClick={() => setLoginPageTab('student-register')}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  background: loginPageTab === 'student-register' ? '#ffffff' : 'transparent',
                  color: loginPageTab === 'student-register' ? '#4f46e5' : '#64748b',
                  boxShadow: loginPageTab === 'student-register' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                Register Student
              </button>
              <button 
                onClick={() => setLoginPageTab('student-login')}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  background: loginPageTab === 'student-login' ? '#ffffff' : 'transparent',
                  color: loginPageTab === 'student-login' ? '#4f46e5' : '#64748b',
                  boxShadow: loginPageTab === 'student-login' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                Student Sign In
              </button>
              <button 
                onClick={() => setLoginPageTab('admin-login')}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  background: loginPageTab === 'admin-login' ? '#ffffff' : 'transparent',
                  color: loginPageTab === 'admin-login' ? '#d97706' : '#64748b',
                  boxShadow: loginPageTab === 'admin-login' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                Admin Portal
              </button>
            </div>

            {/* FORM 1: Student Registration */}
            {loginPageTab === 'student-register' && (
              <form onSubmit={handleStudentRegister}>
                <div style={{ marginBottom: '1.1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Student Full Name *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Kabilan Ganesan"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div style={{ marginBottom: '1.1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Student Roll No / ID *
                  </label>
                  <input 
                    type="text"
                    inputMode="text"
                    required
                    placeholder="e.g. CS2026-089"
                    value={regStudentId}
                    onChange={(e) => setRegStudentId(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div style={{ marginBottom: '1.1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    College Email *
                  </label>
                  <input 
                    type="email"
                    inputMode="email"
                    required
                    placeholder="e.g. kabilan@college.edu"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Department / College
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. School of Computing"
                    value={regCollege}
                    onChange={(e) => setRegCollege(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      fontSize: '0.925rem'
                    }}
                  />
                </div>

                <button 
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(79, 70, 229, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Sparkles size={18} />
                  <span>Register & Save to Admin Database</span>
                </button>
              </form>
            )}

            {/* FORM 2: Student Sign In */}
            {loginPageTab === 'student-login' && (
              <form onSubmit={handleStudentLogin}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Student ID or College Email *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. CS2026-089 or kabilan@college.edu"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      fontSize: '0.925rem'
                    }}
                  />
                </div>

                <button 
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(79, 70, 229, 0.35)'
                  }}
                >
                  Sign In to Marketplace
                </button>
              </form>
            )}

            {/* FORM 3: Admin Login */}
            {loginPageTab === 'admin-login' && (
              <form onSubmit={handleAdminLogin}>
                <div style={{ padding: '10px 14px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.8rem', color: '#b45309' }}>
                  <strong>Admin Login Credentials:</strong> Username: <code>admin</code> | Password: <code>admin123</code>
                </div>

                <div style={{ marginBottom: '1.1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Admin Username *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="admin"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      fontSize: '0.925rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Admin Password *
                  </label>
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      fontSize: '0.925rem'
                    }}
                  />
                </div>

                <button 
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Lock size={18} />
                  <span>Access Admin Student Database</span>
                </button>
              </form>
            )}
          </div>
        </main>

        <footer style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.825rem', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
          © 2026 CampusMart. Verified Peer-to-Peer College Portal.
        </footer>
      </div>
    );
  }

  // =------------------- 2. SCREEN: ADMIN DASHBOARD DATABASE VIEW -------------------
  if (currentUser?.role === 'admin') {
    return (
      <div className="app-root" style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
        {/* Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 300,
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '9999px',
            fontWeight: 600,
            boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={18} />
            {toastMessage}
          </div>
        )}

        <header className="app-header">
          <div className="header-container">
            <div className="logo-brand">
              <div className="logo-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <Award size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="logo-title" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    CampusMart Admin Portal
                  </span>
                  <span className="logo-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706' }}>System Database</span>
                </div>
              </div>
            </div>

            <div className="header-actions">
              <div className="user-chip">
                <Shield size={16} style={{ color: '#d97706' }} />
                <span>Administrator</span>
              </div>
              <button className="btn-icon" onClick={handleLogout} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
          {/* Top Admin KPI Cards */}
          <div className="admin-metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div className="metric-card">
              <div className="metric-icon" style={{ color: '#4f46e5', background: 'rgba(79, 70, 229, 0.1)' }}>
                <Users size={26} />
              </div>
              <div>
                <div className="metric-val">{safeStudents.length}</div>
                <div className="metric-label">Registered Students in Database</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                <ShoppingBag size={26} />
              </div>
              <div>
                <div className="metric-val">{safeProducts.length}</div>
                <div className="metric-label">Active Listed Products</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>
                <Tag size={26} />
              </div>
              <div>
                <div className="metric-val">₹{totalMarketValue.toLocaleString('en-IN')}</div>
                <div className="metric-label">Total Marketplace Value</div>
              </div>
            </div>
          </div>

          {/* Admin Database Control Bar */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div className="auth-tabs" style={{ margin: 0, width: 'auto' }}>
                <button 
                  className={`auth-tab ${adminTab === 'students' ? 'active' : ''}`}
                  onClick={() => setAdminTab('students')}
                  style={{ padding: '8px 20px' }}
                >
                  Student Database ({safeStudents.length})
                </button>
                <button 
                  className={`auth-tab ${adminTab === 'products' ? 'active' : ''}`}
                  onClick={() => setAdminTab('products')}
                  style={{ padding: '8px 20px' }}
                >
                  Manage Products ({safeProducts.length})
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  className="btn-danger-sm"
                  style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => {
                    if (window.confirm("Wipe all student registration data and products for a 100% fresh start?")) {
                      setStudents([]);
                      setProducts([]);
                      localStorage.removeItem('campusmart_students');
                      localStorage.removeItem('campusmart_products');
                      showToast("Database reset to 100% fresh state!");
                    }
                  }}
                >
                  <Trash2 size={16} />
                  <span>Purge Database (Fresh Start)</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Registered Students Database Table */}
            {adminTab === 'students' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className="search-bar-container" style={{ maxWidth: '380px' }}>
                    <Search className="search-icon" size={16} />
                    <input 
                      type="text"
                      className="search-input"
                      placeholder="Search student by name, ID, or email..."
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      style={{ padding: '0.55rem 1rem 0.55rem 2.5rem', fontSize: '0.875rem' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Total: <strong>{filteredStudents.length} Students</strong>
                  </span>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>College Email</th>
                        <th>Department / School</th>
                        <th>Date Registered</th>
                        <th>Listings</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                            <Users size={36} style={{ color: '#cbd5e1', marginBottom: '0.5rem' }} />
                            <div>No student records found in database.</div>
                            <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Students can register from the Student Login/Registration screen.</div>
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map(student => (
                          <tr key={student.id}>
                            <td style={{ fontWeight: 800, color: '#4f46e5' }}>{student.studentId}</td>
                            <td style={{ fontWeight: 700 }}>{student.name}</td>
                            <td style={{ color: '#475569' }}>{student.email}</td>
                            <td>{student.college}</td>
                            <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{student.joinedDate}</td>
                            <td>
                              <span className="logo-badge" style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
                                {student.listingsCount || 0} items
                              </span>
                            </td>
                            <td>
                              <button 
                                className="btn-danger-sm"
                                onClick={() => handleDeleteStudent(student.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Mobile Responsive Stacked Card View */}
                  <div className="mobile-card-list">
                    {filteredStudents.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
                        <Users size={32} style={{ color: '#cbd5e1', marginBottom: '0.5rem' }} />
                        <div>No student records found in database.</div>
                      </div>
                    ) : (
                      filteredStudents.map(student => (
                        <div key={student.id} className="mobile-card-item">
                          <div className="mobile-card-header">
                            <div style={{ fontWeight: 800, color: '#4f46e5', fontSize: '0.9rem' }}>{student.studentId}</div>
                            <span className="logo-badge" style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
                              {student.listingsCount || 0} items
                            </span>
                          </div>
                          <div className="mobile-card-row">
                            <span className="mobile-card-label">Name</span>
                            <span className="mobile-card-value">{student.name}</span>
                          </div>
                          <div className="mobile-card-row">
                            <span className="mobile-card-label">Email</span>
                            <span className="mobile-card-value" style={{ fontSize: '0.8rem', color: '#475569' }}>{student.email}</span>
                          </div>
                          <div className="mobile-card-row">
                            <span className="mobile-card-label">Department</span>
                            <span className="mobile-card-value">{student.college}</span>
                          </div>
                          <div className="mobile-card-row">
                            <span className="mobile-card-label">Registered</span>
                            <span className="mobile-card-value" style={{ fontSize: '0.775rem', color: '#94a3b8' }}>{student.joinedDate}</span>
                          </div>
                          <div className="mobile-card-actions">
                            <button className="btn-danger-sm" onClick={() => handleDeleteStudent(student.id)}>
                              Delete Student
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Manage Listed Products Table */}
            {adminTab === 'products' && (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product Title</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Seller Name</th>
                      <th>Campus Location</th>
                      <th>Posted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                          <ShoppingBag size={36} style={{ color: '#cbd5e1', marginBottom: '0.5rem' }} />
                          <div>No product listings in marketplace.</div>
                        </td>
                      </tr>
                    ) : (
                      safeProducts.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img src={p.image} alt={p.title} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                              <span style={{ fontWeight: 700 }}>{p.title}</span>
                            </div>
                          </td>
                          <td>{p.category}</td>
                          <td style={{ fontWeight: 800, color: '#4f46e5' }}>₹{p.price.toLocaleString('en-IN')}</td>
                          <td>{p.seller}</td>
                          <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{p.location}</td>
                          <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{p.postedAgo}</td>
                          <td>
                            <button 
                              className="btn-danger-sm"
                              onClick={() => handleDeleteProduct(p.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Mobile Responsive Stacked Card View */}
                <div className="mobile-card-list">
                  {safeProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
                      <ShoppingBag size={32} style={{ color: '#cbd5e1', marginBottom: '0.5rem' }} />
                      <div>No product listings in marketplace.</div>
                    </div>
                  ) : (
                    safeProducts.map(p => (
                      <div key={p.id} className="mobile-card-item">
                        <div className="mobile-card-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={p.image} alt={p.title} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.title}</span>
                          </div>
                          <span style={{ fontWeight: 800, color: '#4f46e5' }}>₹{p.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">Category</span>
                          <span className="mobile-card-value">{p.category}</span>
                        </div>
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">Seller</span>
                          <span className="mobile-card-value">{p.seller}</span>
                        </div>
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">Location</span>
                          <span className="mobile-card-value" style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.location}</span>
                        </div>
                        <div className="mobile-card-actions">
                          <button className="btn-danger-sm" onClick={() => handleDeleteProduct(p.id)}>
                            Delete Listing
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // =------------------- 3. SCREEN: STUDENT MARKETPLACE VIEW (Logged-in Student) -------------------
  return (
    <div className="app-root">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 300,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '9999px',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideUp 0.3s ease'
        }}>
          <Sparkles size={18} />
          {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <header className="app-header">
        <div className="header-container">
          <a href="#" className="logo-brand">
            <div className="logo-icon-wrapper">
              <ShoppingBag size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="logo-title">CampusMart</span>
                <span className="logo-badge">Verified Student</span>
              </div>
            </div>
          </a>

          <div className="search-bar-container">
            <Search className="search-icon" size={18} />
            <input 
              type="text"
              className="search-input"
              placeholder="Search textbooks, calculators, hostel gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <X 
                size={16} 
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>

          <div className="header-actions">
            <button className="btn-icon" onClick={() => setIsWishlistModalOpen(true)} title="Wishlist">
              <Heart size={18} />
              {safeWishlist.length > 0 && <span className="badge-count">{safeWishlist.length}</span>}
            </button>

            <div className="user-chip">
              <div className="user-chip-avatar">{currentUser.name?.charAt(0) || 'S'}</div>
              <span>{currentUser.name} ({currentUser.studentId})</span>
            </div>

            <button className="btn-primary" onClick={() => setIsSellModalOpen(true)}>
              <Plus size={18} />
              <span>Post Listing</span>
            </button>

            <button className="btn-icon" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Banner */}
        <section className="hero-banner">
          <div className="hero-content">
            <div className="hero-pill">
              <ShieldCheck size={16} />
              Verified Student Peer-to-Peer Marketplace
            </div>
            <h1 className="hero-title">
              Buy, Sell & Trade <span>Campus Gear</span>
            </h1>
            <p className="hero-subtitle">
              Exclusive campus marketplace for verified students to post and buy textbooks, electronics, hostel furniture, and bicycles.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" onClick={() => setIsSellModalOpen(true)}>
                <Plus size={18} />
                <span>Post Item for Sale</span>
              </button>
            </div>
          </div>
        </section>

        {/* Category Bar */}
        <section className="category-bar">
          {['All', 'Textbooks', 'Electronics', 'Hostel Gear', 'Bicycles', 'Notes & Apparel'].map(cat => (
            <button
              key={cat}
              className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span>{cat}</span>
            </button>
          ))}
        </section>

        {/* Product Grid */}
        <section className="products-section">
          <div className="section-header">
            <h2 className="section-title">
              {activeCategory === 'All' ? 'Campus Listings' : `${activeCategory} Listings`}
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                ({filteredProducts.length} items)
              </span>
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--accent-gradient-subtle)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <ShoppingBag size={36} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                No active campus listings
              </h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                {searchQuery 
                  ? "No listings match your search term."
                  : "The marketplace is completely fresh! Be the first student to post an item for sale on campus."}
              </p>
              <button className="btn-primary" onClick={() => setIsSellModalOpen(true)}>
                <Plus size={18} />
                <span>Post First Listing Now</span>
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => {
                const isFavorite = safeWishlist.includes(product.id);
                return (
                  <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                    <div className="card-image-wrapper">
                      <img src={product.image} alt={product.title} className="product-image" />
                      <span className="badge-condition" style={{ backgroundColor: product.conditionColor }}>
                        {product.condition}
                      </span>
                      <button 
                        className={`btn-wishlist ${isFavorite ? 'active' : ''}`}
                        onClick={(e) => toggleWishlist(product.id, e)}
                        title="Save to Wishlist"
                      >
                        <Heart size={16} fill={isFavorite ? 'white' : 'none'} />
                      </button>
                    </div>

                    <div className="card-body">
                      <div className="card-category">{product.category}</div>
                      <h3 className="card-title">{product.title}</h3>

                      <div className="card-price-row">
                        <span className="price-current">₹{product.price?.toLocaleString('en-IN')}</span>
                        {product.originalPrice > product.price && (
                          <span className="price-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                        )}
                      </div>

                      <div className="card-seller">
                        <div className="user-chip-avatar" style={{ width: '28px', height: '28px' }}>
                          {product.seller?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="seller-name">{product.seller}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                            <Star size={10} style={{ color: '#f59e0b', display: 'inline', marginRight: '2px' }} />
                            5.0 Verified Student
                          </div>
                        </div>
                        <div className="seller-location">
                          <MapPin size={12} />
                          <span>{product.location}</span>
                        </div>
                      </div>

                      <div className="card-actions">
                        <button className="btn-card btn-card-primary" onClick={(e) => openChat(product, e)}>
                          <MessageSquare size={14} />
                          <span>Chat</span>
                        </button>
                        <button className="btn-card btn-card-secondary" onClick={() => setSelectedProduct(product)}>
                          <Eye size={14} />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-nav">
        <button onClick={() => { setActiveCategory('All'); window.scrollTo(0, 0); }}>
          <ShoppingBag size={20} />
          <span>Home</span>
        </button>
        <button onClick={() => setIsSellModalOpen(true)}>
          <PlusCircle size={28} style={{ color: 'var(--accent-primary)' }} />
          <span>Post</span>
        </button>
        <button onClick={() => setIsWishlistModalOpen(true)}>
          <Heart size={20} />
          <span>Wishlist</span>
        </button>
      </nav>

      {/* Post Product Modal */}
      {isSellModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSellModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-drag-handle"></div>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} style={{ color: 'var(--accent-primary)' }} />
                Post Item for Campus Sale
              </h3>
              <button className="modal-close" onClick={() => setIsSellModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSellSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Item Title *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Data Structures Textbook (3rd Ed)" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Selling Price (₹) *</label>
                  <input 
                    type="number" 
                    inputMode="numeric"
                    className="form-control" 
                    placeholder="e.g. 850" 
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="999" 
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-control"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Textbooks">Textbooks</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Hostel Gear">Hostel Gear</option>
                    <option value="Bicycles">Bicycles & Rides</option>
                    <option value="Notes & Apparel">Notes & Apparel</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Condition</label>
                  <select 
                    className="form-control"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                  >
                    <option value="Like New">Like New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pickup Location / Dorm</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. North Quad, Dorm B #204" 
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Item Description</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Describe condition, edition..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                ></textarea>
              </div>

              {/* Photo Upload & Paste Section */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Upload size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span>Upload / Paste Item Photo *</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="form-control"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          setNewImage(evt.target?.result || '');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    — OR paste web photo URL link below —
                  </div>

                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="https://images.unsplash.com/..." 
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                  />
                </div>

                {newImage && (
                  <div style={{ marginTop: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px' }}>
                      📸 Photo Preview:
                    </div>
                    <img 
                      src={newImage} 
                      alt="Product Preview" 
                      style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--accent-primary)' }} 
                    />
                  </div>
                )}
              </div>

              {/* Student UPI Payment QR Section */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <QrCode size={16} style={{ color: '#10b981' }} />
                  <span>Student UPI ID / Payment Handle (Optional)</span>
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. 9876543210@upi or student@okicici" 
                  value={newUPI}
                  onChange={(e) => setNewUPI(e.target.value)}
                />
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Auto-generates a scannable Payment QR Code for direct GooglePay, PhonePe, Paytm payments in Rupees (₹).
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsSellModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Sparkles size={16} />
                  <span>Publish Listing</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-drag-handle"></div>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={18} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontWeight: 700 }}>Item Details</span>
              </div>
              <button className="modal-close" onClick={() => setSelectedProduct(null)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.title} 
                  style={{ width: '100%', borderRadius: 'var(--radius-md)', height: '220px', objectFit: 'cover' }} 
                />

                {/* Student Payment QR Box */}
                <div style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.06) 0%, rgba(16, 185, 129, 0.06) 100%)',
                  borderRadius: '16px',
                  border: '1px solid rgba(79, 70, 229, 0.2)',
                  marginTop: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
                    <QrCode size={16} />
                    <span>Student Seller Payment QR (₹)</span>
                  </div>
                  
                  <div style={{ background: 'white', padding: '8px', borderRadius: '12px', display: 'inline-block', boxShadow: '0 4px 10px rgba(0,0,0,0.06)', marginBottom: '6px' }}>
                    <img 
                      src={selectedProduct.paymentQr || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${encodeURIComponent(selectedProduct.upiId || 'student@upi')}&pn=${encodeURIComponent(selectedProduct.seller)}&am=${selectedProduct.price}&cu=INR`} 
                      alt="Payment QR Code"
                      style={{ width: '130px', height: '130px', display: 'block' }}
                    />
                  </div>

                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
                    Pay ₹{selectedProduct.price?.toLocaleString('en-IN')} to {selectedProduct.seller}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#475569', marginTop: '2px' }}>
                    UPI ID: <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', color: '#4f46e5', fontWeight: 700 }}>{selectedProduct.upiId || `${(selectedProduct.seller || 'student').toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`}</code>
                  </div>
                  <div style={{ fontSize: '0.675rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>
                    ● Scan with GPay / PhonePe / Paytm
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  {selectedProduct.category}
                </span>
                <h2 style={{ fontSize: '1.4rem', margin: '0.35rem 0 0.75rem' }}>{selectedProduct.title}</h2>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>₹{selectedProduct.price?.toLocaleString('en-IN')}</span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {selectedProduct.description}
                </p>

                <div style={{ padding: '0.75rem 0.9rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.775rem', fontWeight: 700, marginBottom: '2px', color: 'var(--text-main)' }}>Campus Handoff Location</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} style={{ color: 'var(--accent-primary)' }} />
                    {selectedProduct.location || 'Main Quad'} ({selectedProduct.college || 'College Campus'})
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={() => {
                    triggerConfetti({ particleCount: 100, spread: 60 });
                    showToast(`🎉 Direct meetup scheduled with seller ${selectedProduct.seller}! Pay via QR or Cash.`);
                    setSelectedProduct(null);
                  }}>
                    <Check size={18} />
                    <span>Meet & Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatProduct && (
        <div className="modal-overlay" onClick={() => setChatProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-drag-handle"></div>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="user-chip-avatar" style={{ width: '32px', height: '32px' }}>
                  {chatProduct.seller?.charAt(0) || 'S'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{chatProduct.seller}</div>
                  <div style={{ fontSize: '0.725rem', color: '#10b981' }}>● Verified Student Seller</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setChatProduct(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="chat-messages">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`chat-bubble ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={sendChatMessage} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Type a message to agree on meetup..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ padding: '0.65rem' }}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Modal */}
      {isWishlistModalOpen && (
        <div className="modal-overlay" onClick={() => setIsWishlistModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-drag-handle"></div>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={20} style={{ color: '#ef4444' }} />
                Saved Wishlist ({safeWishlist.length})
              </h3>
              <button className="modal-close" onClick={() => setIsWishlistModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {safeWishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  No saved items yet. Click the heart icon on any product card to save it!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {safeProducts.filter(p => p && p.id && safeWishlist.includes(p.id)).map(p => (
                    <div key={p.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                      <img src={p.image} alt={p.title} style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.title}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 800 }}>₹{p.price?.toLocaleString('en-IN')}</div>
                      </div>
                      <button className="modal-close" onClick={() => toggleWishlist(p.id)}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>CampusMart</span>
            <span>— College Marketplace for verified students.</span>
          </div>
          <div>
            © 2026 CampusMart.
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Sticky Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button 
          className={`mobile-nav-item ${activeCategory === 'All' && !selectedProduct && !isSellModalOpen && !isWishlistModalOpen ? 'active' : ''}`}
          onClick={() => {
            setActiveCategory('All');
            setSearchQuery('');
            setSelectedProduct(null);
            setIsSellModalOpen(false);
            setIsWishlistModalOpen(false);
            setChatProduct(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="mobile-nav-icon-wrapper">
            <Home size={20} />
          </div>
          <span>Home</span>
        </button>

        <button 
          className={`mobile-nav-item ${isSellModalOpen ? 'active' : ''}`}
          onClick={() => {
            if (!currentUser) {
              showToast("Please register or log in as a student to sell items.");
              setShowStudentAuthModal(true);
            } else {
              setIsSellModalOpen(true);
            }
          }}
        >
          <div className="mobile-nav-icon-wrapper" style={{ background: 'var(--accent-gradient)', color: 'white' }}>
            <PlusCircle size={20} />
          </div>
          <span>Sell</span>
        </button>

        <button 
          className={`mobile-nav-item ${isWishlistModalOpen ? 'active' : ''}`}
          onClick={() => setIsWishlistModalOpen(true)}
        >
          <div className="mobile-nav-icon-wrapper">
            <Heart size={20} />
          </div>
          {safeWishlist.length > 0 && (
            <span className="mobile-nav-badge">{safeWishlist.length}</span>
          )}
          <span>Wishlist</span>
        </button>

        <button 
          className={`mobile-nav-item ${currentUser?.role === 'admin' ? 'active' : ''}`}
          onClick={() => {
            if (currentUser?.role === 'admin') {
              showToast("Viewing Admin System Database");
            } else {
              setLoginPageTab('admin-login');
              setShowStudentAuthModal(true);
            }
          }}
        >
          <div className="mobile-nav-icon-wrapper">
            <Shield size={20} />
          </div>
          <span>Admin</span>
        </button>

        <button 
          className="mobile-nav-item"
          onClick={() => {
            if (currentUser) {
              handleLogout();
            } else {
              setLoginPageTab('student-register');
              setShowStudentAuthModal(true);
            }
          }}
        >
          <div className="mobile-nav-icon-wrapper">
            <User size={20} />
          </div>
          <span>{currentUser ? 'Logout' : 'Account'}</span>
        </button>
      </nav>
    </div>
  );
}
