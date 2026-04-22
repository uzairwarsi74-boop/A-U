/**
 * LUXE Store Engine — core data layer
 * All data stored in localStorage for static hosting compatibility.
 */

const LUXE = {

  // ── Keys ──────────────────────────────────────────────
  KEYS: {
    CONFIG:     'luxe_config',
    PRODUCTS:   'luxe_products',
    CARDS:      'luxe_cards',
    ORDERS:     'luxe_orders',
    CART:       'luxe_cart',
    WISHLIST:   'luxe_wishlist',
    NEWSLETTER: 'luxe_newsletter',
    ADMIN_SESS: 'luxe_admin_session',
    DARK_MODE:  'luxe_dark_mode'
  },

  // ── Defaults (loaded from /data/*.json on first run) ──
  _defaults: {
    config:   null,
    products: null,
    cards:    null
  },

  // ── Bootstrap ─────────────────────────────────────────
  async init() {
    await this._loadDefaults();
    this._applyTheme();
    this._applyFonts();
    this._applyBranding();
    this._renderNav();
    this._renderBanner();
    this._darkModeToggleInit();
  },

  async _loadDefaults() {
    const base = this._basePath();
    if (!localStorage.getItem(this.KEYS.CONFIG)) {
      try {
        const r = await fetch(base + 'data/config.json');
        const d = await r.json();
        localStorage.setItem(this.KEYS.CONFIG, JSON.stringify(d));
      } catch(e) { localStorage.setItem(this.KEYS.CONFIG, JSON.stringify({})); }
    }
    if (!localStorage.getItem(this.KEYS.PRODUCTS)) {
      try {
        const r = await fetch(base + 'data/products.json');
        const d = await r.json();
        localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(d));
      } catch(e) { localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify([])); }
    }
    if (!localStorage.getItem(this.KEYS.CARDS)) {
      try {
        const r = await fetch(base + 'data/cards.json');
        const d = await r.json();
        localStorage.setItem(this.KEYS.CARDS, JSON.stringify(d));
      } catch(e) { localStorage.setItem(this.KEYS.CARDS, JSON.stringify([])); }
    }
  },

  _basePath() {
    const p = window.location.pathname;
    if (p.includes('/pages/') || p.includes('/admin/')) return '../';
    return '';
  },

  // ── Getters / Setters ─────────────────────────────────
  getConfig()   { try { return JSON.parse(localStorage.getItem(this.KEYS.CONFIG)) || {}; } catch(e) { return {}; } },
  setConfig(d)  { localStorage.setItem(this.KEYS.CONFIG, JSON.stringify(d)); },

  getProducts() { try { return JSON.parse(localStorage.getItem(this.KEYS.PRODUCTS)) || []; } catch(e) { return []; } },
  setProducts(d){ localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(d)); },

  getCards()    { try { return JSON.parse(localStorage.getItem(this.KEYS.CARDS)) || []; } catch(e) { return []; } },
  setCards(d)   { localStorage.setItem(this.KEYS.CARDS, JSON.stringify(d)); },

  getOrders()   { try { return JSON.parse(localStorage.getItem(this.KEYS.ORDERS)) || []; } catch(e) { return []; } },
  setOrders(d)  { localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(d)); },

  getCart()     { try { return JSON.parse(localStorage.getItem(this.KEYS.CART)) || []; } catch(e) { return []; } },
  setCart(d)    { localStorage.setItem(this.KEYS.CART, JSON.stringify(d)); this._updateCartBadge(); },

  getWishlist() { try { return JSON.parse(localStorage.getItem(this.KEYS.WISHLIST)) || []; } catch(e) { return []; } },
  setWishlist(d){ localStorage.setItem(this.KEYS.WISHLIST, JSON.stringify(d)); },

  getNewsletter(){ try { return JSON.parse(localStorage.getItem(this.KEYS.NEWSLETTER)) || []; } catch(e) { return []; } },

  // ── Admin Session ─────────────────────────────────────
  isAdmin() { return sessionStorage.getItem(this.KEYS.ADMIN_SESS) === 'true'; },
  adminLogin(password) {
    const stored = localStorage.getItem('luxe_admin_pw') || 'admin1234';
    if (password === stored) {
      sessionStorage.setItem(this.KEYS.ADMIN_SESS, 'true');
      this._resetInactivityTimer();
      return true;
    }
    return false;
  },
  adminLogout() {
    sessionStorage.removeItem(this.KEYS.ADMIN_SESS);
  },
  changeAdminPassword(oldPw, newPw) {
    const stored = localStorage.getItem('luxe_admin_pw') || 'admin1234';
    if (oldPw === stored) {
      localStorage.setItem('luxe_admin_pw', newPw);
      return true;
    }
    return false;
  },
  requireAdmin() {
    if (!this.isAdmin()) {
      const base = this._basePath();
      window.location.href = base + 'admin-login.html';
    }
  },
  _inactivityTimer: null,
  _resetInactivityTimer() {
    clearTimeout(this._inactivityTimer);
    this._inactivityTimer = setTimeout(() => {
      if (this.isAdmin()) {
        this.adminLogout();
        window.location.href = this._basePath() + 'admin-login.html?timeout=1';
      }
    }, 30 * 60 * 1000); // 30 min
    ['click','keydown','mousemove','scroll'].forEach(e =>
      document.addEventListener(e, () => this._resetInactivityTimer(), { once: true })
    );
  },

  // ── Theme ─────────────────────────────────────────────
  _applyTheme() {
    const cfg = this.getConfig();
    const c = cfg.colors || {};
    const r = document.documentElement.style;
    if (c.primary)     r.setProperty('--color-primary',    c.primary);
    if (c.secondary)   r.setProperty('--color-secondary',  c.secondary);
    if (c.background)  r.setProperty('--color-bg',         c.background);
    if (c.header_bg)   r.setProperty('--color-header-bg',  c.header_bg);
    if (c.header_text) r.setProperty('--color-header-text',c.header_text);
    if (c.button_bg)   r.setProperty('--color-btn-bg',     c.button_bg);
    if (c.button_text) r.setProperty('--color-btn-text',   c.button_text);
    if (c.accent)      r.setProperty('--color-accent',     c.accent);

    // dark mode persist
    const dark = localStorage.getItem(this.KEYS.DARK_MODE);
    if (dark === 'true') document.documentElement.classList.add('dark-mode');
  },

  _applyFonts() {
    const cfg = this.getConfig();
    const f = cfg.fonts || {};
    const heading = f.heading || 'Cormorant Garamond';
    const body    = f.body    || 'Jost';
    // inject google fonts link if not present
    const id = 'luxe-gfonts';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id   = id;
      link.rel  = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(heading)}:wght@300;400;600&family=${encodeURIComponent(body)}:wght@300;400;500&display=swap`;
      document.head.appendChild(link);
    }
    document.documentElement.style.setProperty('--font-heading', `'${heading}', serif`);
    document.documentElement.style.setProperty('--font-body',    `'${body}', sans-serif`);
  },

  _applyBranding() {
    const cfg = this.getConfig();
    const s = cfg.store || {};
    // Tab title
    if (s.tab_title) document.title = s.tab_title;
    // Logo text
    document.querySelectorAll('[data-logo]').forEach(el => el.textContent = s.logo_text || s.name || 'LUXE');
    // Logo image override
    if (s.logo_image) {
      document.querySelectorAll('[data-logo-img]').forEach(el => {
        el.src = s.logo_image; el.style.display = 'block';
      });
      document.querySelectorAll('[data-logo]').forEach(el => el.style.display = 'none');
    }
  },

  // ── Banner ────────────────────────────────────────────
  _renderBanner() {
    const cfg = this.getConfig();
    const b = cfg.banner || {};
    const el = document.getElementById('top-banner');
    if (!el) return;
    if (b.visible === false) { el.style.display = 'none'; return; }
    el.style.display = 'block';
    el.style.background = b.bg_color || '#c9a96e';
    el.style.color = b.text_color || '#1a1a1a';
    el.querySelector('#banner-text').textContent = b.text || '';
  },

  // ── Nav ───────────────────────────────────────────────
  _renderNav() {
    const cfg = this.getConfig();
    const pages = cfg.pages || {};
    const navEl = document.getElementById('nav-links');
    if (!navEl) return;
    const base = this._basePath();
    const sorted = Object.entries(pages)
      .filter(([,v]) => v.visible !== false)
      .sort((a,b) => (a[1].order||99) - (b[1].order||99));

    navEl.innerHTML = sorted.map(([key, val]) => {
      let href = '#';
      if (key === 'home')     href = base + 'index.html';
      else if (key === 'products') href = base + 'pages/products.html';
      else if (key === 'about')    href = base + 'pages/about.html';
      else if (key === 'contact')  href = base + 'pages/contact.html';
      else href = base + `pages/${key}.html`;
      return `<li><a href="${href}">${val.label}</a></li>`;
    }).join('');
  },

  // ── Cart ──────────────────────────────────────────────
  addToCart(productId, size, color, qty = 1) {
    const products = this.getProducts();
    const product  = products.find(p => p.id === productId);
    if (!product) return false;
    let cart = this.getCart();
    const existing = cart.find(i => i.id === productId && i.size === size && i.color === color);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.sale_price || product.price,
        image: product.images[0] || '',
        size, color, qty
      });
    }
    this.setCart(cart);
    this._cartFlash();
    return true;
  },
  removeFromCart(index) {
    let cart = this.getCart();
    cart.splice(index, 1);
    this.setCart(cart);
  },
  updateCartQty(index, qty) {
    let cart = this.getCart();
    if (qty <= 0) { cart.splice(index, 1); } else { cart[index].qty = qty; }
    this.setCart(cart);
  },
  cartTotal() {
    return this.getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  },
  clearCart() { this.setCart([]); },
  _updateCartBadge() {
    const count = this.getCart().reduce((s,i) => s + i.qty, 0);
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  },
  _cartFlash() {
    const icon = document.querySelector('.cart-icon-wrap');
    if (icon) { icon.classList.add('flash'); setTimeout(() => icon.classList.remove('flash'), 500); }
  },

  // ── Wishlist ──────────────────────────────────────────
  toggleWishlist(productId) {
    let wl = this.getWishlist();
    const idx = wl.indexOf(productId);
    if (idx >= 0) wl.splice(idx, 1); else wl.push(productId);
    this.setWishlist(wl);
    return idx < 0;
  },
  inWishlist(productId) { return this.getWishlist().includes(productId); },

  // ── Orders ────────────────────────────────────────────
  placeOrder(formData, couponCode) {
    const cart = this.getCart();
    if (!cart.length) return null;
    let discount = 0;
    const cfg = this.getConfig();
    const orders = this.getOrders();
    const id = 'ORD-' + Date.now();
    const subtotal = this.cartTotal();
    const order = {
      id, date: new Date().toISOString(),
      customer: formData,
      items: cart,
      subtotal,
      discount,
      total: subtotal - discount,
      coupon: couponCode || '',
      status: 'pending',
      payment: formData.payment_method || 'cod'
    };
    orders.push(order);
    this.setOrders(orders);
    this.clearCart();
    return order;
  },

  // ── Newsletter ────────────────────────────────────────
  subscribeNewsletter(email) {
    let list = this.getNewsletter();
    if (list.includes(email)) return false;
    list.push(email);
    localStorage.setItem(this.KEYS.NEWSLETTER, JSON.stringify(list));
    return true;
  },

  // ── Dark Mode ─────────────────────────────────────────
  _darkModeToggleInit() {
    const btn = document.getElementById('dark-toggle');
    if (!btn) return;
    const cfg = this.getConfig();
    if (!cfg.dark_mode || cfg.dark_mode.enabled === false) { btn.style.display = 'none'; return; }
    btn.style.display = 'flex';
    const isDark = localStorage.getItem(this.KEYS.DARK_MODE) === 'true';
    btn.innerHTML = isDark ? '☀' : '☾';
    btn.addEventListener('click', () => {
      const now = document.documentElement.classList.toggle('dark-mode');
      localStorage.setItem(this.KEYS.DARK_MODE, now);
      btn.innerHTML = now ? '☀' : '☾';
    });
  },

  // ── Product helpers ───────────────────────────────────
  getFeatured()    { return this.getProducts().filter(p => p.featured); },
  getByCategory(c) { return this.getProducts().filter(p => p.category === c); },
  getById(id)      { return this.getProducts().find(p => p.id === id); },
  search(q)        {
    q = q.toLowerCase();
    return this.getProducts().filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  },

  // ── Helpers ───────────────────────────────────────────
  formatPrice(n) {
    const cfg = this.getConfig();
    const curr = (cfg.store && cfg.store.currency) || '$';
    return curr + parseFloat(n).toFixed(2);
  },
  uid() { return Math.random().toString(36).substr(2,9); },

  // ── WhatsApp Order ────────────────────────────────────
  whatsappOrder() {
    const cfg = this.getConfig();
    const wa = cfg.whatsapp_order || {};
    if (!wa.enabled || !wa.number) return;
    const cart = this.getCart();
    const items = cart.map(i => `${i.name} (${i.size}/${i.color}) x${i.qty} — ${this.formatPrice(i.price * i.qty)}`).join('\n');
    const msg = encodeURIComponent(`${wa.message || 'Hi! I would like to order:'}\n\n${items}\n\nTotal: ${this.formatPrice(this.cartTotal())}`);
    window.open(`https://wa.me/${wa.number.replace(/\D/g,'')}?text=${msg}`, '_blank');
  }
};

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', () => LUXE.init());
