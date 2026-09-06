import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
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
  Award
} from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_STUDENTS, CATEGORIES } from './data/mockData';

export default function App() {
  // Database & Auth States
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('campusmart_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Error reading products from localStorage:", e);
    }
    return INITIAL_PRODUCTS;
  });

  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('campusmart_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error reading students from localStorage:", e);
    }
    return INITIAL_STUDENTS;
  });

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

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Modal control states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('student-login'); // 'student-login', 'student-register', 'admin-login'
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminTab, setAdminTab] = useState('students'); // 'students', 'products'
  const [adminStudentSearch, setAdminStudentSearch] = useState('');

  // Chat Modal states
  const [chatProduct, setChatProduct] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Form states - Student Login/Register
  const [loginStudentId, setLoginStudentId] = useState('');
  const [regName, setRegName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCollege, setRegCollege] = useState('School of Computing');

  // Form states - Admin Login
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Form states - Sell New Item
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Textbooks');
  const [newCondition, setNewCondition] = useState('Like New');
  const [newLocation, setNewLocation] = useState('');
  const [newCollege, setNewCollege] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');

  // Permanent Light Mode enforcement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Sync to localStorage
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
    try {
      confetti(opts);
    } catch (e) {
      console.warn("Confetti effect unavailable", e);
    }
  };

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Handlers
  const handleStudentRegister = (e) => {
    e.preventDefault();
    if (!regName || !regStudentId || !regEmail) return;

    const newStudent = {
      id: `STU-${Date.now().toString().slice(-4)}`,
      name: regName,
      email: regEmail,
      college: regCollege || "Engineering Department",
      studentId: regStudentId,
      joinedDate: new Date().toISOString().split('T')[0],
      status: "Active",
      listingsCount: 0
    };

    setStudents(prev => [newStudent, ...prev]);
    const userPayload = { role: 'student', ...newStudent };
    setCurrentUser(userPayload);
    setIsAuthModalOpen(false);

    // Reset form
    setRegName('');
    setRegStudentId('');
    setRegEmail('');

    triggerConfetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    showToast(`🎉 Student Account Created! Welcome, ${newStudent.name}`);
  };

  const handleStudentLogin = (e) => {
    e.preventDefault();
    if (!loginStudentId.trim()) return;

    const query = loginStudentId.trim().toLowerCase();
    const existing = students.find(s => 
      s.studentId.toLowerCase() === query || 
      s.email.toLowerCase() === query ||
      s.name.toLowerCase().includes(query)
    );

    if (existing) {
      const userPayload = { role: 'student', ...existing };
      setCurrentUser(userPayload);
      setIsAuthModalOpen(false);
      setLoginStudentId('');
      showToast(`Welcome back, ${existing.name}!`);
    } else {
      // Auto-create student session for smooth demo login
      const autoStudent = {
        id: `STU-${Date.now().toString().slice(-4)}`,
        name: loginStudentId.split('@')[0],
        email: loginStudentId.includes('@') ? loginStudentId : `${loginStudentId}@college.edu`,
        college: "School of Computing",
        studentId: loginStudentId.toUpperCase(),
        joinedDate: new Date().toISOString().split('T')[0],
        status: "Active",
        listingsCount: 0
      };
      setStudents(prev => [autoStudent, ...prev]);
      setCurrentUser({ role: 'student', ...autoStudent });
      setIsAuthModalOpen(false);
      setLoginStudentId('');
      showToast(`LoggedIn as Student ${autoStudent.name}`);
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
    setIsAuthModalOpen(false);
    setIsAdminDashboardOpen(true);
    setAdminUsername('');
    setAdminPassword('');
    showToast("👑 Authenticated as Administrator!");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminDashboardOpen(false);
    showToast("Logged out successfully.");
  };

  // Product Actions
  const handleSellSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const sellerName = currentUser ? currentUser.name : "Kabilan (Student)";
    const sellerCollege = currentUser ? currentUser.college : (newCollege || "School of Computing");

    const newItem = {
      id: `cm-${Date.now()}`,
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
      college: sellerCollege,
      location: newLocation || "Main Campus Dorms",
      description: newDescription || "Clean, ready for instant student handoff on campus!",
      image: newImage || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
      tags: ["Verified Student", newCategory, newCondition],
      status: "Available",
      views: 1,
      postedAgo: "Just now"
    };

    setProducts(prev => [newItem, ...prev]);
    setIsSellModalOpen(false);

    // Update student listings count if student
    if (currentUser && currentUser.id) {
      setStudents(prev => prev.map(s => s.id === currentUser.id ? { ...s, listingsCount: (s.listingsCount || 0) + 1 } : s));
    }
    
    // Reset form
    setNewTitle('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewDescription('');
    setNewImage('');
    setNewLocation('');

    triggerConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    showToast("🎉 Item published successfully to campus marketplace!");
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast("Listing deleted from marketplace.");
  };

  const handleDeleteStudent = (studentId) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    showToast("Student record removed from database.");
  };

  const toggleWishlist = (productId, e) => {
    if (e) e.stopPropagation();
    setWishlist(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      const exists = arr.includes(productId);
      if (exists) {
        showToast("Removed from Wishlist");
        return arr.filter(id => id !== productId);
      } else {
        showToast("Saved to Wishlist!");
        return [...arr, productId];
      }
    });
  };

  const openChat = (product, e) => {
    if (e) e.stopPropagation();
    if (!product) return;
    setChatProduct(product);
    setChatMessages([
      { sender: 'seller', text: `Hi! Thanks for checking out "${product.title}". It's available for meetup at ${product.location || 'campus'}.` }
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
        { sender: 'seller', text: `Sounds good! Meet at ${chatProduct?.location || 'the main quad'} around 4 PM today?` }
      ]);
    }, 1000);
  };

  // Safe Data getters
  const safeProducts = Array.isArray(products) ? products : [];
  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
  const safeStudents = Array.isArray(students) ? students : [];

  const filteredProducts = safeProducts.filter(item => {
    if (!item) return false;
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const title = item.title || '';
    const description = item.description || '';
    const tags = Array.isArray(item.tags) ? item.tags : [];
    const query = searchQuery ? searchQuery.toLowerCase() : '';
    
    const matchesSearch = query === '' || 
      title.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query) ||
      tags.some(t => String(t).toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const filteredStudents = safeStudents.filter(s => {
    if (!adminStudentSearch) return true;
    const q = adminStudentSearch.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) ||
      (s.studentId || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.college || '').toLowerCase().includes(q);
  });

  const totalMarketValue = safeProducts.reduce((acc, p) => acc + (Number(p.price) || 0), 0);

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'Textbooks': return <BookOpen size={16} />;
      case 'Electronics': return <Laptop size={16} />;
      case 'Hostel Gear': return <Home size={16} />;
      case 'Bicycles': return <Bike size={16} />;
      case 'Notes & Apparel': return <Shirt size={16} />;
      default: return <Grid size={16} />;
    }
  };

  return (
    <div className="app-root">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 300,
          background: 'var(--accent-gradient)',
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
                <span className="logo-badge">College Portal</span>
              </div>
            </div>
          </a>

          <div className="search-bar-container">
            <Search className="search-icon" size={18} />
            <input 
              type="text"
              className="search-input"
              placeholder="Search textbooks, iPads, mini fridges, calculators..."
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
            {/* Wishlist Button */}
            <button className="btn-icon" onClick={() => setIsWishlistModalOpen(true)} title="Wishlist">
              <Heart size={18} />
              {safeWishlist.length > 0 && <span className="badge-count">{safeWishlist.length}</span>}
            </button>

            {/* Authenticated Controls */}
            {currentUser ? (
              <>
                {currentUser.role === 'admin' ? (
                  <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }} onClick={() => setIsAdminDashboardOpen(true)}>
                    <Award size={18} />
                    <span>Admin Dashboard</span>
                  </button>
                ) : (
                  <>
                    <div className="user-chip">
                      <div className="user-chip-avatar">{currentUser.name?.charAt(0) || 'S'}</div>
                      <span>{currentUser.name}</span>
                    </div>
                    <button className="btn-primary" onClick={() => setIsSellModalOpen(true)}>
                      <Plus size={18} />
                      <span>Post Listing</span>
                    </button>
                  </>
                )}
                <button className="btn-icon" onClick={handleLogout} title="Logout">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <button className="btn-secondary" onClick={() => { setAuthTab('student-login'); setIsAuthModalOpen(true); }}>
                  <User size={16} />
                  <span>Student Login</span>
                </button>
                <button className="btn-primary" onClick={() => { setAuthTab('admin-login'); setIsAuthModalOpen(true); }}>
                  <Shield size={16} />
                  <span>Admin Portal</span>
                </button>
              </>
            )}
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
              Buy & Sell <span>Campus Gear & Books</span> Direct
            </h1>
            <p className="hero-subtitle">
              Exclusive campus marketplace for students to buy, sell, and trade textbooks, electronics, hostel furniture, calculators, and bicycles.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                className="btn-primary" 
                onClick={() => {
                  if (!currentUser) {
                    setAuthTab('student-login');
                    setIsAuthModalOpen(true);
                  } else {
                    setIsSellModalOpen(true);
                  }
                }}
              >
                <span>Post an Item for Sale</span>
                <ArrowRight size={18} />
              </button>
              
              {!currentUser && (
                <button className="btn-secondary" onClick={() => { setAuthTab('admin-login'); setIsAuthModalOpen(true); }}>
                  <Shield size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span>Admin Database Portal</span>
                </button>
              )}
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <h4>{safeStudents.length} Registered</h4>
                <p>Campus Students</p>
              </div>
              <div className="stat-item">
                <h4>{safeProducts.length} Active</h4>
                <p>Live Listings</p>
              </div>
              <div className="stat-item">
                <h4>${totalMarketValue}</h4>
                <p>Marketplace Value</p>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="category-bar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.label}</span>
            </button>
          ))}
        </section>

        {/* Products Section */}
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
                No campus listings found
              </h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                {searchQuery || activeCategory !== 'All' 
                  ? "No items match your active search or category filter. Try clearing filters!" 
                  : "Be the first student to post textbooks, laptops, hostel gear, or bicycles for sale on campus!"}
              </p>
              
              {searchQuery || activeCategory !== 'All' ? (
                <button className="btn-secondary" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>
                  Clear Filters
                </button>
              ) : (
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    if (!currentUser) {
                      setAuthTab('student-register');
                      setIsAuthModalOpen(true);
                    } else {
                      setIsSellModalOpen(true);
                    }
                  }}
                >
                  <Plus size={18} />
                  <span>List First Product Now</span>
                </button>
              )}
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
                        <span className="price-current">${product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="price-original">${product.originalPrice}</span>
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
                            {product.rating || '5.0'} ({product.reviewsCount || 1})
                          </div>
                        </div>
                        <div className="seller-location">
                          <MapPin size={12} />
                          <span>{(product.location || 'Campus Handoff').split(',')[0]}</span>
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
                        
                        {currentUser?.role === 'admin' && (
                          <button 
                            className="btn-danger-sm" 
                            style={{ padding: '6px' }}
                            title="Admin Delete"
                            onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Auth Modal (Student Login/Register & Admin Login) */}
      {isAuthModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={20} style={{ color: 'var(--accent-primary)' }} />
                Campus Access Portal
              </h3>
              <button className="modal-close" onClick={() => setIsAuthModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="auth-tabs">
                <button 
                  className={`auth-tab ${authTab === 'student-login' ? 'active' : ''}`}
                  onClick={() => setAuthTab('student-login')}
                >
                  Student Login
                </button>
                <button 
                  className={`auth-tab ${authTab === 'student-register' ? 'active' : ''}`}
                  onClick={() => setAuthTab('student-register')}
                >
                  Register Student
                </button>
                <button 
                  className={`auth-tab ${authTab === 'admin-login' ? 'active' : ''}`}
                  onClick={() => setAuthTab('admin-login')}
                >
                  Admin Portal
                </button>
              </div>

              {/* Student Login Form */}
              {authTab === 'student-login' && (
                <form onSubmit={handleStudentLogin}>
                  <div className="form-group">
                    <label className="form-label">Student ID or Email *</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="e.g. CS2026-089 or kabilan@college.edu"
                      value={loginStudentId}
                      onChange={(e) => setLoginStudentId(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    <span>Sign In to Student Account</span>
                  </button>
                </form>
              )}

              {/* Student Register Form */}
              {authTab === 'student-register' && (
                <form onSubmit={handleStudentRegister}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="e.g. Kabilan Ganesan"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Student Roll No / ID *</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="e.g. CS2026-089"
                      value={regStudentId}
                      onChange={(e) => setRegStudentId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">College Email *</label>
                    <input 
                      type="email"
                      className="form-control"
                      placeholder="kabilan@college.edu"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department / School</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="e.g. School of Computing"
                      value={regCollege}
                      onChange={(e) => setRegCollege(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    <Sparkles size={16} />
                    <span>Create Verified Student Account</span>
                  </button>
                </form>
              )}

              {/* Admin Login Form */}
              {authTab === 'admin-login' && (
                <form onSubmit={handleAdminLogin}>
                  <div style={{ padding: '10px 14px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.8rem', color: '#b45309' }}>
                    <strong>Admin Demo Credentials:</strong> Username: <code>admin</code> | Password: <code>admin123</code>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Admin Username *</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="admin"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Admin Passcode *</label>
                    <input 
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                    <Lock size={16} />
                    <span>Login to Admin Portal</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Dashboard Modal */}
      {isAdminDashboardOpen && currentUser?.role === 'admin' && (
        <div className="modal-overlay" onClick={() => setIsAdminDashboardOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', width: '95%' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={22} style={{ color: '#f59e0b' }} />
                  CampusMart Admin Portal & Database
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Manage registered students, monitor system listings, and moderate marketplace data.
                </p>
              </div>
              <button className="modal-close" onClick={() => setIsAdminDashboardOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Metrics Summary Cards */}
              <div className="admin-metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">
                    <Users size={24} />
                  </div>
                  <div>
                    <div className="metric-val">{safeStudents.length}</div>
                    <div className="metric-label">Registered Students</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <div className="metric-val">{safeProducts.length}</div>
                    <div className="metric-label">Live Listings</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>
                    <Tag size={24} />
                  </div>
                  <div>
                    <div className="metric-val">${totalMarketValue}</div>
                    <div className="metric-label">Total Listings Value</div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="auth-tabs" style={{ marginBottom: '1rem' }}>
                <button 
                  className={`auth-tab ${adminTab === 'students' ? 'active' : ''}`}
                  onClick={() => setAdminTab('students')}
                >
                  Student User Database ({safeStudents.length})
                </button>
                <button 
                  className={`auth-tab ${adminTab === 'products' ? 'active' : ''}`}
                  onClick={() => setAdminTab('products')}
                >
                  Manage Live Products ({safeProducts.length})
                </button>
              </div>

              {/* Tab 1: Student User Database Table */}
              {adminTab === 'students' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
                    <div className="search-bar-container" style={{ maxWidth: '360px' }}>
                      <Search className="search-icon" size={16} />
                      <input 
                        type="text"
                        className="search-input"
                        placeholder="Search student by name, ID or email..."
                        value={adminStudentSearch}
                        onChange={(e) => setAdminStudentSearch(e.target.value)}
                        style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', fontSize: '0.85rem' }}
                      />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Showing {filteredStudents.length} student records
                    </span>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Student ID</th>
                          <th>Full Name</th>
                          <th>College Email</th>
                          <th>Department / School</th>
                          <th>Date Joined</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                              No student records found.
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map(student => (
                            <tr key={student.id}>
                              <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{student.studentId}</td>
                              <td style={{ fontWeight: 600 }}>{student.name}</td>
                              <td style={{ color: 'var(--text-muted)' }}>{student.email}</td>
                              <td>{student.college}</td>
                              <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{student.joinedDate}</td>
                              <td>
                                <span className="logo-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                  {student.status || 'Active'}
                                </span>
                              </td>
                              <td>
                                <button 
                                  className="btn-danger-sm"
                                  onClick={() => handleDeleteStudent(student.id)}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Manage Live Products Table */}
              {adminTab === 'products' && (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Item Details</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Seller Name</th>
                        <th>Location</th>
                        <th>Posted</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeProducts.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            No active products in marketplace.
                          </td>
                        </tr>
                      ) : (
                        safeProducts.map(product => (
                          <tr key={product.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={product.image} alt={product.title} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{product.title}</span>
                              </div>
                            </td>
                            <td>{product.category}</td>
                            <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>${product.price}</td>
                            <td>{product.seller}</td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{product.location}</td>
                            <td style={{ fontSize: '0.775rem', color: 'var(--text-dim)' }}>{product.postedAgo}</td>
                            <td>
                              <button 
                                className="btn-danger-sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
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
                  style={{ width: '100%', borderRadius: 'var(--radius-md)', height: '260px', objectFit: 'cover' }} 
                />
                <div style={{ marginTop: '1rem', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(selectedProduct.tags || []).map((t, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.725rem',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)'
                    }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  {selectedProduct.category}
                </span>
                <h2 style={{ fontSize: '1.4rem', margin: '0.35rem 0 0.75rem' }}>{selectedProduct.title}</h2>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>${selectedProduct.price}</span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-dim)' }}>${selectedProduct.originalPrice}</span>
                  )}
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {selectedProduct.description}
                </p>

                <div style={{ padding: '0.85rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Campus Handoff Point</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} style={{ color: 'var(--accent-primary)' }} />
                    {selectedProduct.location} ({selectedProduct.college})
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={() => {
                    triggerConfetti({ particleCount: 100, spread: 60 });
                    showToast(`🎉 Deal scheduled with seller ${selectedProduct.seller}!`);
                    setSelectedProduct(null);
                  }}>
                    <Check size={18} />
                    <span>Meet & Buy Now</span>
                  </button>
                  <button className="btn-secondary" onClick={(e) => { openChat(selectedProduct, e); setSelectedProduct(null); }}>
                    <MessageSquare size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Product Modal */}
      {isSellModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSellModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                  placeholder="e.g. CLRS Algorithms Textbook (4th Ed)" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Selling Price ($) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="45" 
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price ($)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="95" 
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
                  <label className="form-label">Item Condition</label>
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
                <label className="form-label">Campus Pickup Location / Dorm</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. North Campus, Dorm B #204" 
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Item Description</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Describe condition, edition, included accessories..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input 
                  type="url" 
                  className="form-control" 
                  placeholder="https://images.unsplash.com/..." 
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                />
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

      {/* Chat Modal */}
      {chatProduct && (
        <div className="modal-overlay" onClick={() => setChatProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="user-chip-avatar" style={{ width: '32px', height: '32px' }}>
                  {chatProduct.seller?.charAt(0) || 'S'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{chatProduct.seller}</div>
                  <div style={{ fontSize: '0.725rem', color: '#10b981' }}>● Student Seller</div>
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
                        <div style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 800 }}>${p.price}</div>
                      </div>
                      <button className="btn-card btn-card-primary" onClick={(e) => { openChat(p, e); setIsWishlistModalOpen(false); }}>
                        Chat
                      </button>
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
            <span>— Exclusive Peer-to-Peer College Marketplace.</span>
          </div>
          <div>
            © 2026 CampusMart. Permanent Light Theme & Verified Student Network.
          </div>
        </div>
      </footer>
    </div>
  );
}
