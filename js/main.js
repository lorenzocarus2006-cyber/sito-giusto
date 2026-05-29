/* =====================================================
   KREA GLOBAL CONTRACT — Main Website Controller
   Powered by Motion (Local ESM)
===================================================== */

import { animate, inView } from "./motion.js";

// Declare global form data state
const kreaFormData = {};

// Keep a record of the direction
let kreaGoDir = 'next';

/* ─────────────────────────────────────────────
   1. MOBILE NAVIGATION DRAWER
───────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta');

if (hamburger && mobileDrawer) {
  function toggleMenu() {
    const active = hamburger.classList.toggle('active');
    mobileDrawer.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', active);
    mobileDrawer.setAttribute('aria-hidden', !active);
    document.body.style.overflow = active ? 'hidden' : '';

    // Premium slide & fade using Motion
    if (active) {
      animate(mobileDrawer, { x: [300, 0], opacity: [0, 1] }, { duration: 0.5, easing: [0.16, 1, 0.3, 1] });
    } else {
      animate(mobileDrawer, { x: [0, 300], opacity: [1, 0] }, { duration: 0.4, easing: [0.16, 1, 0.3, 1] });
    }
  }

  hamburger.addEventListener('click', toggleMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/* ─────────────────────────────────────────────
   2. REVEAL ANIMATIONS (NATIVE INTERSECTION OBSERVER)
───────────────────────────────────────────── */
const revealElements = document.querySelectorAll('.reveal-up');
if ('IntersectionObserver' in window && revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.15
  });
  revealElements.forEach(el => revealObserver.observe(el));
} else if (revealElements.length > 0) {
  revealElements.forEach(el => el.classList.add('visible'));
}

/* ─────────────────────────────────────────────
   3. LAZY LOADING IMAGES WITH OBSERVER
───────────────────────────────────────────── */
const lazyImages = document.querySelectorAll('img[data-src]');
if ('IntersectionObserver' in window && lazyImages.length > 0) {
  const lazyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.onload = () => {
          img.removeAttribute('data-src');
          // Smooth fade in once loaded
          animate(img, { opacity: [0, 1] }, { duration: 0.4 });
        };
        lazyObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px 0px',
    threshold: 0.01
  });
  lazyImages.forEach(img => lazyObserver.observe(img));
} else {
  lazyImages.forEach(img => {
    img.src = img.getAttribute('data-src');
  });
}

/* ─────────────────────────────────────────────
   4. COUNT UP ANIMATION FOR STATS (CHI SIAMO)
───────────────────────────────────────────── */
const statsContainer = document.getElementById('statsContainer');
const statNumbers = document.querySelectorAll('.stat-number');

if (statsContainer && statNumbers.length > 0) {
  let hasCounted = false;

  function countUp(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2; // secondi per Motion

    animate((progress) => {
      const currentVal = Math.floor(progress * target);
      if (target === 850 || target === 500) {
        el.textContent = currentVal + '+';
      } else {
        el.textContent = currentVal;
      }
    }, {
      duration: duration,
      easing: [0.16, 1, 0.3, 1],
      onComplete: () => {
        if (target === 850) el.textContent = '850+';
        else if (target === 500) el.textContent = '500+';
        else el.textContent = target;
      }
    });
  }

  // Use Motion's inView for stats counting trigger
  inView('#statsContainer', () => {
    if (!hasCounted) {
      hasCounted = true;
      statNumbers.forEach(num => countUp(num));
    }
  });
}

/* ─────────────────────────────────────────────
   5. DYNAMIC NAVBAR SCROLL CLASS
───────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   6. MULTI-STEP CONSULTATION FORM DIALOG / MODAL
───────────────────────────────────────────── */
function apriModale() {
  const m = document.getElementById('consultModal');
  if (!m) return;
  
  m.style.display = 'block';
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
  kreaGoAnimated(1, 'next');

  // Smooth fade-in modal container using Motion
  animate(m, { opacity: [0, 1] }, { duration: 0.4, easing: [0.16, 1, 0.3, 1] });

  // Slide up and scale the card container for a premium feel
  const card = m.querySelector('.modal-form-card');
  if (card) {
    animate(card, { scale: [0.96, 1], y: [30, 0] }, { duration: 0.5, easing: [0.16, 1, 0.3, 1] });
  }

  // Create progress dots if they do not exist
  if (!document.getElementById('kreaDots')) {
    const dots = document.createElement('div');
    dots.id = 'kreaDots';
    dots.className = 'krea-dots';
    dots.innerHTML = '<div class="krea-dot active" id="kd1"></div><div class="krea-dot" id="kd2"></div><div class="krea-dot" id="kd3"></div><div class="krea-dot" id="kd4"></div>';
    m.appendChild(dots);
  }
  updateDots(1);
}

function chiudiModale() {
  const m = document.getElementById('consultModal');
  if (!m) return;

  document.body.style.overflow = '';

  const card = m.querySelector('.modal-form-card');
  if (card) {
    animate(card, { scale: 0.96, y: 30 }, { duration: 0.3, easing: [0.16, 1, 0.3, 1] });
  }

  animate(m, { opacity: 0 }, { duration: 0.3, easing: [0.16, 1, 0.3, 1] }).then(() => {
    m.classList.remove('open');
    m.style.display = 'none';
  });
}

function updateDots(n) {
  for (let i = 1; i <= 4; i++) {
    const d = document.getElementById('kd' + i);
    if (!d) continue;
    d.classList.remove('active', 'done');
    if (i === n) d.classList.add('active');
    else if (i < n) d.classList.add('done');
  }
}

function kreaGoAnimated(n, dir) {
  for (let i = 1; i <= 5; i++) {
    const s = document.getElementById('ks' + i);
    if (!s) continue;
    if (i === n) {
      s.style.display = 'block';
      // High-end slide and opacity transitions using Motion
      animate(s, {
        opacity: [0, 1],
        x: dir === 'back' ? [-30, 0] : [30, 0]
      }, {
        duration: 0.45,
        easing: [0.16, 1, 0.3, 1]
      });
    } else {
      s.style.display = 'none';
    }
  }
  if (n <= 4) updateDots(n);
  const modal = document.getElementById('consultModal');
  if (modal) modal.scrollTop = 0;
}

function kreaValidateStep1() {
  const nome  = document.getElementById('k-nome').value.trim();
  const email = document.getElementById('k-email').value.trim();
  const tel   = document.getElementById('k-tel').value.trim();
  if (!nome || !email || !tel) {
    if (!nome)  document.getElementById('k-nome').style.borderColor  = 'rgba(255,120,120,0.8)';
    if (!email) document.getElementById('k-email').style.borderColor = 'rgba(255,120,120,0.8)';
    if (!tel)   document.getElementById('k-tel').style.borderColor   = 'rgba(255,120,120,0.8)';
    setTimeout(function() {
      ['k-nome','k-email','k-tel'].forEach(function(id) {
        document.getElementById(id).style.borderColor = '';
      });
    }, 2500);
    return;
  }
  kreaFormData.nome     = nome;
  kreaFormData.email    = email;
  kreaFormData.telefono = tel;
  kreaGoAnimated(2, 'next');
}

function kreaSelectPill(btn, group) {
  const container = btn.parentElement;
  container.querySelectorAll('.kpill').forEach(function(p) { p.classList.remove('on'); });
  btn.classList.add('on');
  kreaFormData[group] = btn.dataset.value;

  // Tiny scale bounce effect on click for premium interaction
  animate(btn, { scale: [1, 0.95, 1] }, { duration: 0.2 });
}

function kreaTogglePill(btn) {
  btn.classList.toggle('on');
  const group = btn.dataset.group;
  const selected = Array.from(btn.parentElement.querySelectorAll('.kpill.on')).map(p => p.dataset.value);
  kreaFormData[group] = selected;

  // Tiny scale bounce effect on click
  animate(btn, { scale: [1, 0.95, 1] }, { duration: 0.2 });
}

function kreaSubmitForm() {
  kreaFormData.note    = document.getElementById('k-note').value.trim();
  kreaFormData.data    = new Date().toLocaleString('it-IT');
  console.log('Krea lead:', kreaFormData);
  kreaGoAnimated(5, 'next');
}

// Expose functions to window object for inline HTML event handling
window.apriModale = apriModale;
window.chiudiModale = chiudiModale;
window.kreaGoAnimated = kreaGoAnimated;
window.kreaValidateStep1 = kreaValidateStep1;
window.kreaSelectPill = kreaSelectPill;
window.kreaTogglePill = kreaTogglePill;
window.kreaSubmitForm = kreaSubmitForm;

// Click listeners for Consultation Buttons
document.querySelectorAll('#openConsultForm, .nav-cta, .drawer-cta, #heroCta, #fabContatti').forEach(function(b) {
  b.addEventListener('click', function(e) { 
    e.preventDefault(); 
    e.stopPropagation(); 
    apriModale(); 
  });
});

document.addEventListener('keydown', function(e) { 
  if (e.key === 'Escape') chiudiModale(); 
});
