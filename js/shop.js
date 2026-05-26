// ============================================
// GLOBAL-CONTRACT — Shop & Cart JS
// ============================================

const PRODUCTS = [
  { id: 1,  category: 'forni',       name: 'Forno a Convezione GC-500',   description: 'Forno professionale a convezione con vapore integrato, 10 teglie GN 1/1. Ideale per ristoranti e panetterie ad alto volume produttivo.',   price: 3500,  originalPrice: 4200, badge: 'Best Seller', rating: 4.8, reviews: 124, emoji: '🔥', features: ['10 teglie GN 1/1','Vapore integrato','Controllo digitale','Classe A++','Acciaio INOX 304'] },
  { id: 2,  category: 'forni',       name: 'Forno Combinato GC-Pro',       description: 'Forno combinato calore secco/vapore con 6 funzioni di cottura. Display touch screen 7" e connettività WiFi inclusa.',                         price: 5800,  originalPrice: null, badge: 'Nuovo',       rating: 4.9, reviews: 48,  emoji: '🔥', features: ['6 funzioni cottura','Touch screen 7"','WiFi incluso','Autopulizia','20 teglie GN 2/1'] },
  { id: 3,  category: 'forni',       name: 'Forno Rotativo GC-Baker',      description: 'Forno rotativo professionale per panifici e pasticcerie. 8 teglie 60x80 cm con rotazione automatica e timer digitale.',                          price: 8900,  originalPrice: null, badge: null,          rating: 4.7, reviews: 35,  emoji: '🔥', features: ['8 teglie 60x80cm','Rotazione automatica','Timer digitale','Vapore a pressione'] },
  { id: 4,  category: 'cucine',      name: 'Piano Cottura 6 Fuochi',       description: 'Linea cottura professionale in acciaio inox con 6 bruciatori ad alta potenza. Griglie in ghisa, perfetta per ristoranti e catering.',             price: 2800,  originalPrice: 3200, badge: 'Offerta',      rating: 4.7, reviews: 89,  emoji: '👨‍🍳', features: ['6 bruciatori 3.5kW','Acciaio INOX','Griglie ghisa','Facile pulizia'] },
  { id: 5,  category: 'cucine',      name: 'Cucina Modulare GC-Line',      description: 'Sistema modulare configurabile con piastre, friggitrice e bagnomaria integrati. Soluzione completa per grandi cucine professionali.',             price: 7500,  originalPrice: null, badge: null,          rating: 4.8, reviews: 31,  emoji: '👨‍🍳', features: ['Sistema modulare','Piastre + friggitrice','Acciaio INOX 316','Garanzia 3 anni'] },
  { id: 6,  category: 'cucine',      name: 'Friggitrice Professionale FP-40', description: 'Friggitrice a gas da 40 litri con cestelli a sollevamento automatico. Ideale per fast food e ristoranti ad alto traffico.',                  price: 1800,  originalPrice: 2100, badge: 'Offerta',      rating: 4.5, reviews: 112, emoji: '👨‍🍳', features: ['40 litri','Sollevamento automatico','Temp. 50-190°C','Vasca removibile'] },
  { id: 7,  category: 'frigoriferi', name: 'Banco Refrigerato BF-200',     description: 'Banco refrigerato a vetrina per pasticcerie e gastronomie. Illuminazione LED, temperatura 0-4°C regolabile digitalmente.',                      price: 2100,  originalPrice: 2400, badge: 'Offerta',      rating: 4.6, reviews: 67,  emoji: '❄️', features: ['Temp. 0-4°C','Illuminazione LED','200 cm lunghezza','Sbrinamento auto'] },
  { id: 8,  category: 'frigoriferi', name: 'Abbattitore Rapido AR-10',     description: 'Abbattitore di temperatura rapido da 10 teglie. Abbattimento positivo e negativo con sonda al cuore. HACCP integrato.',                          price: 4200,  originalPrice: null, badge: 'Nuovo',       rating: 4.9, reviews: 28,  emoji: '❄️', features: ['10 teglie GN 1/1','Abbattimento +/-','Sonda al cuore','HACCP integrato'] },
  { id: 9,  category: 'frigoriferi', name: 'Cella Frigorifera Walk-In',    description: 'Cella frigorifera walk-in con pannelli modulari in poliuretano da 100mm. Volume personalizzabile da 8 a 40 m³. Installazione inclusa.',          price: 12000, originalPrice: null, badge: 'Premium',      rating: 4.9, reviews: 22,  emoji: '❄️', features: ['8-40 m³ personalizzabile','Pannelli 100mm','Temp. -18/+4°C','Installazione inclusa'] }
];

// ── Utilities ──
function formatPrice(n) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}
function renderStars(r) { return '★'.repeat(Math.floor(r)) + (r % 1 >= 0.5 ? '½' : ''); }
function getBadgeClass(b) { return { Nuovo: 'new', Offerta: 'sale', Premium: 'premium' }[b] || ''; }
function getCategoryLabel(c) { return { forni: '🔥 Forni', cucine: '👨‍🍳 Cucine', frigoriferi: '❄️ Frigoriferi' }[c] || c; }

// ── Cart State ──
let cart = JSON.parse(localStorage.getItem('gc_cart') || '[]');

function saveCart() { localStorage.setItem('gc_cart', JSON.stringify(cart)); updateCartUI(); }

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty++; } else { cart.push({ ...product, qty: 1 }); }
  saveCart();
  showToast(`${product.name.slice(0, 28)}… aggiunto al carrello ✓`);
}

function removeFromCart(id) { cart = cart.filter(i => i.id !== id); saveCart(); }

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  saveCart();
}

function cartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function cartCount() { return cart.reduce((s, i) => s + i.qty, 0); }

// ── Cart UI ──
function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const checkBtn = document.getElementById('checkoutBtn');

  if (countEl) {
    const n = cartCount();
    countEl.textContent = n;
    countEl.style.display = n > 0 ? 'flex' : 'none';
  }

  if (itemsEl) {
    if (cart.length === 0) {
      itemsEl.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Il carrello è vuoto.<br>Aggiungi i tuoi macchinari!</p></div>`;
    } else {
      itemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-img">${item.emoji}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Rimuovi">✕</button>
        </div>
      `).join('');
    }
  }

  if (totalEl) totalEl.textContent = formatPrice(cartTotal());
  if (checkBtn) checkBtn.disabled = cart.length === 0;
}

// ── Cart Sidebar ──
function openCart() {
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('cartToggle')?.addEventListener('click', openCart);
document.getElementById('cartClose')?.addEventListener('click', closeCart);
document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
  closeCart();
  window.location.href = 'contact.html#booking';
});

// ── Toast notification ──
function showToast(msg) {
  document.querySelector('.gc-toast')?.remove();
  const t = document.createElement('div');
  t.className = 'gc-toast';
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '104px', right: '32px',
    background: '#38A169', color: '#fff', padding: '12px 20px',
    borderRadius: '8px', fontSize: '0.86rem', fontWeight: '600',
    zIndex: '9999', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    maxWidth: '320px', lineHeight: '1.4',
    animation: 'none', opacity: '1', transition: 'opacity 0.3s'
  });
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2800);
}

// ── Render Products ──
let currentFilter = 'all';

function renderProducts(filter) {
  currentFilter = filter || currentFilter;
  const container = document.getElementById('productsGrid');
  if (!container) return;

  const list = currentFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === currentFilter);

  const countEl = document.getElementById('resultsCount');
  if (countEl) countEl.textContent = `${list.length} prodott${list.length === 1 ? 'o' : 'i'} trovati`;

  container.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-img">
        <span>${p.emoji}</span>
        ${p.badge ? `<div class="product-badge ${getBadgeClass(p.badge)}">${p.badge}</div>` : ''}
      </div>
      <div class="product-body">
        <div class="product-category">${getCategoryLabel(p.category)}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description}</div>
        <ul style="margin-bottom:12px;padding-left:0;list-style:none;display:flex;flex-wrap:wrap;gap:4px;">
          ${p.features.map(f => `<li style="font-size:0.72rem;background:var(--light);color:var(--dark-gray);padding:3px 8px;border-radius:50px;border:1px solid var(--border);">${f}</li>`).join('')}
        </ul>
        <div class="product-rating">
          <span class="stars">${renderStars(p.rating)}</span>
          <span>${p.rating}</span>
          <span class="rating-count">(${p.reviews} recensioni)</span>
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-current">${formatPrice(p.price)}</span>
            ${p.originalPrice ? `<span class="price-original">${formatPrice(p.originalPrice)}</span>` : ''}
          </div>
          <div class="product-actions">
            <button class="btn btn-accent btn-sm" onclick="addToCart(${p.id})">+ Carrello</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── Category Tabs ──
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.filter);
  });
});

// ── Sort ──
document.getElementById('sortSelect')?.addEventListener('change', e => {
  const val = e.target.value;
  const list = currentFilter === 'all' ? [...PRODUCTS] : PRODUCTS.filter(p => p.category === currentFilter);
  if (val === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (val === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (val === 'rating') list.sort((a, b) => b.rating - a.rating);
  const container = document.getElementById('productsGrid');
  if (container) {
    container.innerHTML = list.map(p => {
      const tmp = document.createElement('div');
      tmp.innerHTML = `<div data-id="${p.id}"></div>`;
      return tmp.innerHTML;
    }).join('');
    renderProducts(currentFilter);
  }
});

// ── Navbar ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar?.classList.toggle('scrolled', window.scrollY > 60));

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
}));

// ── Init ──
renderProducts('all');
updateCartUI();

// Auto-open filter from URL
const urlCat = new URLSearchParams(window.location.search).get('cat');
if (urlCat) {
  const btn = document.querySelector(`.tab-btn[data-filter="${urlCat}"]`);
  if (btn) { btn.click(); }
}
