/* =====================================================
   KREA GLOBAL CONTRACT — Main Website Controller
===================================================== */

(function () {
  'use strict';

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
     2. REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  ───────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Ferma l'ascolto per performance
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -8% 0px', // Attiva l'animazione leggermente prima di entrare nel viewport
      threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback se l'observer non è supportato
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
          img.onload = () => img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px', // Precarica 200px prima di scorrere alla vista
      threshold: 0.01
    });

    lazyImages.forEach(img => lazyObserver.observe(img));
  } else {
    // Fallback
    lazyImages.forEach(img => {
      img.src = img.getAttribute('data-src');
    });
  }

  /* ─────────────────────────────────────────────
     4. COUNT UP ANIMATION FOR STATS (CHI SIAMO)
  ───────────────────────────────────────────── */
  const statsContainer = document.getElementById('statsContainer');
  const statNumbers = document.querySelectorAll('.stat-number');

  if ('IntersectionObserver' in window && statsContainer && statNumbers.length > 0) {
    let hasCounted = false;

    function countUp(el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 2000; // millisecondi
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out quadratico
        const easeProgress = progress * (2 - progress);
        const currentVal = Math.floor(easeProgress * target);

        // Aggiunge il segno "+" se presente nel valore target originale
        if (target === 850) {
          el.textContent = currentVal + '+';
        } else if (target === 500) {
          el.textContent = currentVal + '+';
        } else {
          el.textContent = currentVal;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          // Valore finale per precisione
          if (target === 850) {
            el.textContent = '850+';
          } else if (target === 500) {
            el.textContent = '500+';
          } else {
            el.textContent = target;
          }
        }
      }

      requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasCounted) {
          hasCounted = true;
          statNumbers.forEach(num => countUp(num));
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    statsObserver.observe(statsContainer);
  } else {
    // Fallback se non supportato
    statNumbers.forEach(el => {
      const target = el.getAttribute('data-target');
      el.textContent = (target === '850' || target === '500') ? target + '+' : target;
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
    });
  }

  /* FORM MODALE */
  function apriModale() {
    var m = document.getElementById('consultModal');
    if (!m) return;
    m.removeAttribute('style');
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (typeof kreaGo === 'function') {
      kreaGo(1);
    } else {
      for (var i = 1; i <= 5; i++) {
        var s = document.getElementById('ks' + i);
        if (s) s.style.display = i === 1 ? 'block' : 'none';
      }
    }
  }
  function chiudiModale() {
    var m = document.getElementById('consultModal');
    if (!m) return;
    m.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('#openConsultForm, .nav-cta, .drawer-cta, #heroCta, #fabContatti').forEach(function(b) {
    b.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); apriModale(); });
  });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') chiudiModale(); });

})();

