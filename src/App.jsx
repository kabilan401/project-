import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Heart, 
  MessageSquare, 
  Moon, 
  Sun, 
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
  ArrowRight
} from 'lucide-react';
import { INITIAL_PRODUCTS, CATEGORIES } from './data/mockData';

export default function App() {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('campusmart_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error reading campusmart_products from localStorage:", e);
    }
    return INITIAL_PRODUCTS;
  });
  
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('campusmart_theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('campusmart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [chatProduct, setChatProduct] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Textbooks');
  const [newCondition, setNewCondition] = useState('Like New');
  const [newLocation, setNewLocation] = useState('');
  const [newCollege, setNewCollege] = useState('School of Computing');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('campusmart_theme', theme);
    } catch (e) {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('campusmart_products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

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
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
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
        showToast("Added to Wishlist!");
        return [...arr, productId];
      }
    });
  };

  const handleSellSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const newItem = {
      id: `cm-${Date.now()}`,
      title: newTitle,
      price: parseFloat(newPrice),
      originalPrice: newOriginalPrice ? parseFloat(newOriginalPrice) : parseFloat(newPrice) * 1.5,
      category: newCategory,
      condition: newCondition,
      conditionColor: newCondition === 'Like New' ? '#10b981' : newCondition === 'Excellent' ? '#3b82f6' : '#f59e0b',
      seller: "You (Kabilan)",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      rating: 5.0,
      reviewsCount: 1,
      college: newCollege || "Engineering Department",
      location: newLocation || "Main Campus Dorm",
      description: newDescription || "Great condition, ready for quick pickup on campus!",
      image: newImage || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
      tags: ["Student Listing", newCategory, newCondition],
      status: "Available",
      views: 1,
      postedAgo: "Just now"
    };

    setProducts([newItem, ...products]);
    setIsSellModalOpen(false);
    
    // Reset form
    setNewTitle('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewDescription('');
    setNewImage('');
    setNewLocation('');

    // Trigger celebration
    triggerConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast("🎉 Your item has been listed successfully!");
  };

  const openChat = (product, e) => {
    if (e) e.stopPropagation();
    if (!product) return;
    setChatProduct(product);
    setChatMessages([
      { sender: 'seller', text: `Hi! Thanks for reaching out about "${product.title}". It's available for pickup at ${product.location || 'campus'}.` }
    ]);
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    // Auto response
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'seller', text: `Awesome! Does meeting near ${chatProduct?.location || 'the main quad'} around 4 PM work for you?` }
      ]);
    }, 1000);
  };

  const handleBuyNow = (product) => {
    triggerConfetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });
    showToast(`🎉 Order placed! Direct meetup scheduled with ${product?.seller || 'seller'}.`);
    setSelectedProduct(null);
  };

  // Filtering
  const safeProducts = Array.isArray(products) ? products : INITIAL_PRODUCTS;
  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];

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
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
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
                <span className="logo-badge">Verified College</span>
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
            <button className="btn-icon" onClick={toggleTheme} title="Toggle Dark/Light Mode">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="btn-icon" onClick={() => setIsWishlistModalOpen(true)} title="Wishlist">
              <Heart size={18} />
              {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
            </button>

            <button className="btn-primary" onClick={() => setIsSellModalOpen(true)}>
              <Plus size={18} />
              <span>Sell Item</span>
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
              100% Student Verified Peer-to-Peer Marketplace
            </div>
            <h1 className="hero-title">
              Buy, Sell & Trade <span>Dorm Gear & Books</span> Instantly
            </h1>
            <p className="hero-subtitle">
              Save up to 70% on college textbooks, laptops, hostel furniture, calculators, and rides. Direct campus handoffs — zero shipping fees!
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" onClick={() => setIsSellModalOpen(true)}>
                <span>Post a Listing</span>
                <ArrowRight size={18} />
              </button>
              <button className="btn-secondary" onClick={() => setActiveCategory('Textbooks')}>
                <span>Browse Textbooks</span>
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <h4>2,400+</h4>
                <p>Campus Students</p>
              </div>
              <div className="stat-item">
                <h4>$45k+</h4>
                <p>Saved on Books</p>
              </div>
              <div className="stat-item">
                <h4>15 Mins</h4>
                <p>Avg Handoff Time</p>
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

        {/* Product Grid */}
        <section className="products-section">
          <div className="section-header">
            <h2 className="section-title">
              {activeCategory === 'All' ? 'Latest Campus Listings' : `${activeCategory} Listings`}
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                ({filteredProducts.length} items)
              </span>
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
              <Search size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3>No items found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Try adjusting your search or category filter.
              </p>
              <button className="btn-secondary" style={{ marginTop: '1.5rem' }} onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>
                Reset Filters
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
                        <span className="price-current">${product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="price-original">${product.originalPrice}</span>
                        )}
                      </div>

                      <div className="card-seller">
                        <img src={product.avatar} alt={product.seller} className="seller-avatar" />
                        <div>
                          <div className="seller-name">{product.seller}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                            <Star size={10} style={{ color: '#f59e0b', display: 'inline', marginRight: '2px' }} />
                            {product.rating} ({product.reviewsCount})
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

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
                  {selectedProduct.originalPrice > selectedProduct.price && selectedProduct.originalPrice > 0 && (
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                      Save {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}%
                    </span>
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
                  <button className="btn-primary" style={{ flex: 1 }} onClick={() => handleBuyNow(selectedProduct)}>
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

      {/* Sell Modal */}
      {isSellModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSellModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} style={{ color: 'var(--accent-primary)' }} />
                Post Item for Sale
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
                  <label className="form-label">Original Retail Price ($)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="90" 
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
                <img src={chatProduct.avatar} alt={chatProduct.seller} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{chatProduct.seller}</div>
                  <div style={{ fontSize: '0.725rem', color: '#10b981' }}>● Online now</div>
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
                  No saved items yet. Click the heart icon on any card to save it!
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
            <span>— College Marketplace platform for students.</span>
          </div>
          <div>
            © 2026 CampusMart. Built for verified peer-to-peer campus trading.
          </div>
        </div>
      </footer>
    </div>
  );
}
