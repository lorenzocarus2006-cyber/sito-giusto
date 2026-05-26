// ============================================
// GLOBAL-CONTRACT — Homepage JS
// ============================================

const featuredProducts = [
  { id: 1, category: 'forni', name: 'Forno a Convezione GC-500', description: 'Forno professionale con vapore integrato, 10 teglie GN 1/1. Ideale per volumi elevati.', price: 3500, originalPrice: 4200, badge: 'Best Seller', rating: 4.8, reviews: 124, emoji: '🔥' },
  { id: 4, category: 'cucine', name: 'Piano Cottura 6 Fuochi', description: 'Linea cottura professionale in acciaio inox con 6 bruciatori ad alta potenza.', price: 2800, originalPrice: 3200, badge: 'Offerta', rating: 4.7, reviews: 89, emoji: '👨‍🍳' },
  { id: 7, category: 'frigoriferi', name: 'Banco Refrigerato BF-200', description: 'Banco refrigerato a vetrina con illuminazione LED. Temperatura 0-4°C regolabile.', price: 2100, originalPrice: 2400, badge: 'Offerta', rating: 4.6, reviews: 67, emoji: '❄️' }
];

function formatPrice(n) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function getCategoryLabel(cat) {
  return { forni: 'Forni', cucine: 'Cucine', frigoriferi: 'Frigoriferi' }[cat] || cat;
}

function getBadgeClass(b) {
  if (b === 'Nuovo') return 'new';
  if (b === 'Offerta') return 'sale';
  return '';
}

function renderStars(r) {
  return '★'.repeat(Math.floor(r)) + (r % 1 >= 0.5 ? '½' : '');
}

// Render featured products on homepage
const featuredEl = document.getElementById('featuredProducts');
if (featuredEl) {
  featuredEl.innerHTML = featuredProducts.map((p, i) => `
    <div class="product-card fade-in fade-in-d${i + 1}">
      <div class="product-img">
        <span>${p.emoji}</span>
        ${p.badge ? `<div class="product-badge ${getBadgeClass(p.badge)}">${p.badge}</div>` : ''}
      </div>
      <div class="product-body">
        <div class="product-category">${getCategoryLabel(p.category)}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description}</div>
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
            <a href="shop.html" class="btn btn-accent btn-sm">Acquista</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// Scroll animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in, .category-card, .mission-card').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
