/**
 * LUXE Store — main.js
 * Handles homepage rendering, interactions, and shared utilities.
 */

/* ── Utilities ─────────────────────────────────────────── */
function showToast(msg, type = '') {
  const tc = document.getElementById('toast-container');
  if (!tc) return;
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  tc.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function observeReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el));
}

function productCardHTML(p, basePath = '') {
  const isSale = p.sale_price && p.sale_price < p.price;
  const inWL   = LUXE.inWishlist(p.id);
  return `
  <div class="product-card reveal" onclick="location.href='${basePath}pages/product.html?id=${p.id}'">
    <div class="product-card-image">
      <img src="${p.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=70'}" alt="${p.name}" loading="lazy">
      ${isSale ? '<span class="badge-sale">Sale</span>' : ''}
      <button class="wish-btn ${inWL ? 'active' : ''}" data-id="${p.id}" aria-label="Wishlist" onclick="event.stopPropagation();">${inWL ? '♥' : '♡'}</button>
      <div class="quick-add" data-id="${p.id}">Quick Add</div>
    </div>
    <div class="product-card-body">
      <div class="category">${p.category || ''}</div>
      <h4>${p.name}</h4>
      <div class="price-row">
        ${isSale
          ? `<span class="price price-sale">${LUXE.formatPrice(p.sale_price)}</span><span class="price price-original">${LUXE.formatPrice(p.price)}</span>`
          : `<span class="price">${LUXE.formatPrice(p.price)}</span>`}
      </div>
    </div>
  </div>`;
}

function bindProductCards(container, basePath = '') {
  container.querySelectorAll('.quick-add').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id   = btn.dataset.id;
      const prod = LUXE.getById(id);
      if (!prod) return;
      LUXE.addToCart(id, prod.sizes?.[0] || 'One Size', prod.colors?.[0] || 'Default');
      showToast(`${prod.name} added to cart!`, 'success');
    });
  });
  container.querySelectorAll('.wish-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation(); e.preventDefault();
      const id    = btn.dataset.id;
      const added = LUXE.toggleWishlist(id);
      btn.classList.toggle('active', added);
      btn.textContent = added ? '♥' : '♡';
      showToast(added ? 'Added to wishlist' : 'Removed from wishlist');
    });
  });
}

/* ── Header / Nav shared ───────────────────────────────── */
function initHeader() {
  // Scroll shadow
  window.addEventListener('scroll', () => {
    const hdr = document.getElementById('site-header');
    if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Hamburger
  const ham   = document.getElementById('hamburger');
  const mnav  = document.getElementById('mobile-nav');
  const mclose= document.getElementById('mobile-nav-close');
  if (ham && mnav) {
    ham.addEventListener('click', () => mnav.classList.add('open'));
    if (mclose) mclose.addEventListener('click', () => mnav.classList.remove('open'));
  }

  // Search
  const stoggle = document.getElementById('search-toggle');
  const sbox    = document.getElementById('search-box');
  const sinput  = document.getElementById('search-input');
  const sbtn    = document.getElementById('search-btn');
  if (stoggle && sbox) {
    stoggle.addEventListener('click', () => {
      sbox.classList.toggle('open');
      if (sbox.classList.contains('open') && sinput) sinput.focus();
    });
    if (sbtn && sinput) {
      const doSearch = () => {
        const q = sinput.value.trim();
        if (q) window.location.href = LUXE._basePath() + 'pages/products.html?search=' + encodeURIComponent(q);
      };
      sbtn.addEventListener('click', doSearch);
      sinput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
    }
  }

  // Cart badge
  LUXE._updateCartBadge();
}

/* ── Footer shared ─────────────────────────────────────── */
function initFooter() {
  const cfg = LUXE.getConfig();
  if (cfg.footer) {
    document.querySelectorAll('[data-footer-brand]').forEach(el => el.textContent = cfg.footer.brand_name || 'LUXE');
    document.querySelectorAll('[data-footer-tagline]').forEach(el => el.textContent = cfg.footer.tagline || '');
    const cr = document.getElementById('footer-copyright');
    if (cr) cr.textContent = cfg.footer.copyright || '';
  }
  if (cfg.contact) {
    const fe = document.getElementById('footer-email');
    const fp = document.getElementById('footer-phone');
    const fa = document.getElementById('footer-address');
    if (fe) fe.textContent = cfg.contact.email   || '';
    if (fp) fp.textContent = cfg.contact.phone   || '';
    if (fa) fa.textContent = cfg.contact.address || '';
    const fi = document.getElementById('footer-instagram');
    const ff = document.getElementById('footer-facebook');
    if (fi && cfg.contact.instagram) fi.href = cfg.contact.instagram;
    if (ff && cfg.contact.facebook)  ff.href = cfg.contact.facebook;
  }

  // WhatsApp
  if (cfg.whatsapp_order && cfg.whatsapp_order.enabled && cfg.whatsapp_order.number) {
    const wa = document.getElementById('wa-btn');
    if (wa) { wa.style.display = 'flex'; wa.href = `https://wa.me/${cfg.whatsapp_order.number.replace(/\D/g,'')}`; }
  }
}

/* ── Newsletter popup ──────────────────────────────────── */
function initNewsletter() {
  const popup = document.getElementById('newsletter-popup');
  if (!popup) return;
  const cfg  = LUXE.getConfig();
  const pcfg = cfg.newsletter_popup;
  if (!pcfg || !pcfg.enabled || sessionStorage.getItem('nl_dismissed')) return;

  if (pcfg.heading) {
    const nh = document.getElementById('newsletter-heading');
    if (nh) nh.textContent = pcfg.heading;
  }
  if (pcfg.subtext) {
    const ns = document.getElementById('newsletter-subtext');
    if (ns) ns.textContent = pcfg.subtext;
  }
  setTimeout(() => popup.classList.add('open'), (pcfg.delay_seconds || 4) * 1000);

  document.getElementById('newsletter-close').addEventListener('click', () => {
    popup.classList.remove('open');
    sessionStorage.setItem('nl_dismissed', '1');
  });
  document.getElementById('newsletter-submit').addEventListener('click', () => {
    const email = document.getElementById('newsletter-email').value.trim();
    if (!email || !email.includes('@')) { showToast('Please enter a valid email.', 'error'); return; }
    LUXE.subscribeNewsletter(email);
    popup.classList.remove('open');
    sessionStorage.setItem('nl_dismissed', '1');
    showToast('Thank you for subscribing!', 'success');
  });
}

/* ── Page Loader ───────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  const cfg = LUXE.getConfig();
  const lt  = document.getElementById('loader-text');
  if (lt && cfg.store) lt.textContent = cfg.store.loading_text || cfg.store.name || 'LUXE';
  setTimeout(() => loader.classList.add('hidden'), 800);
}

/* ── Homepage specific ─────────────────────────────────── */
function renderHomepage() {
  const cfg = LUXE.getConfig();

  // Hero
  if (cfg.hero) {
    const hh = document.getElementById('hero-heading');
    const hs = document.getElementById('hero-subheading');
    const hb = document.getElementById('hero-btn');
    const hi = document.getElementById('hero-bg-img');
    if (hh) hh.innerHTML = (cfg.hero.heading || '').replace(/\n/g, '<br>');
    if (hs) hs.textContent = cfg.hero.subheading || '';
    if (hb) { hb.textContent = cfg.hero.button_text || 'Shop Now'; hb.href = cfg.hero.button_link || 'pages/products.html'; }
    if (hi && cfg.hero.background_image) hi.src = cfg.hero.background_image;
  }

  // About teaser
  if (cfg.about) {
    const ah = document.getElementById('about-heading');
    const at = document.getElementById('about-teaser-text');
    const ai = document.getElementById('about-teaser-img');
    if (ah) ah.textContent = cfg.about.heading || '';
    if (at) at.textContent = cfg.about.content  || '';
    if (ai && cfg.about.image) ai.src = cfg.about.image;
  }

  // Cards
  const cardsGrid = document.getElementById('cards-grid');
  if (cardsGrid) {
    const cards = LUXE.getCards().filter(c => c.visible !== false).sort((a,b) => (a.order||0)-(b.order||0));
    cardsGrid.innerHTML = cards.map(c => `
      <div class="promo-card reveal">
        <img src="${c.image || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80'}" alt="${c.title}" loading="lazy">
        <div class="promo-card-overlay">
          <h3>${c.title}</h3>
          <p>${c.subtitle || ''}</p>
          <a href="${c.button_link || 'pages/products.html'}" class="btn btn-white btn-sm">${c.button_text || 'Shop Now'}</a>
        </div>
      </div>
    `).join('');
  }

  // Featured
  const featGrid = document.getElementById('featured-products');
  if (featGrid) {
    const products = LUXE.getFeatured().slice(0, 4);
    if (!products.length) {
      featGrid.innerHTML = '<p style="color:var(--color-muted);text-align:center;grid-column:1/-1">No featured products yet.</p>';
    } else {
      featGrid.innerHTML = products.map(p => productCardHTML(p)).join('');
      bindProductCards(featGrid);
    }
  }
}

/* ── Bootstrap ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  // Wait for LUXE init (store.js auto-inits on DOMContentLoaded — slight delay to let it finish)
  await new Promise(r => setTimeout(r, 60));

  initLoader();
  initHeader();
  initFooter();
  initNewsletter();

  // Page-specific
  const path = window.location.pathname;
  if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
    renderHomepage();
  }

  observeReveal();
});
