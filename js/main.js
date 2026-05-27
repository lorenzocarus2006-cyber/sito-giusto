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
    }, { passive: true });
  /* ─────────────────────────────────────────────
     6. FORM MULTI-STEP CONSULENZA
  ───────────────────────────────────────────── */
  var modal = document.getElementById('consultModal');
  var form  = document.getElementById('consultForm');

  if (modal && form) {
    // Apri modale
    function openConsultModal() {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      // Focus trap o primo input
      var firstInput = form.querySelector('input');
      if (firstInput) setTimeout(function() { firstInput.focus(); }, 100);
    }

    // Chiudi modale  
    function closeConsultModal() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }

    // Bottone principale "Prenota consulenza" nella sezione contatti
    var openBtn = document.getElementById('openConsultForm');
    if (openBtn) openBtn.addEventListener('click', openConsultModal);

    // Bottone "PRENOTA CONSULENZA" nella navbar
    var navBtn = document.querySelector('.btn-prenota-nav, .navbar .btn-primary, nav .cta-button');
    if (navBtn) navBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openConsultModal();
    });

    // Chiudi cliccando fuori dalla card
    modal.addEventListener('click', function(e) {
      if (e.target === this) closeConsultModal();
    });

    // Chiudi con ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeConsultModal();
    });

    // Bottone X di chiusura dentro il modale
    var closeBtn = document.getElementById('closeModal');
    if (closeBtn) closeBtn.addEventListener('click', closeConsultModal);

    // Gestione del FAB (se presente sulla pagina)
    var fabBtn = document.getElementById('fabContatti');
    if (fabBtn) {
      fabBtn.addEventListener('click', function(e) {
        var href = fabBtn.getAttribute('href');
        if (href === '#' || !href) {
          e.preventDefault();
          openConsultModal();
        }
      });
    }

    // --- LOGICA MULTI-STEP ---
    var steps        = form.querySelectorAll('.form-step');
    var btnBack      = document.getElementById('btnBack');
    var btnNext      = document.getElementById('btnNext');
    var btnSubmit    = document.getElementById('btnSubmit');
    var progressBar  = document.getElementById('progressBar');
    var stepLabel    = document.getElementById('stepLabel');
    var modalNav     = document.getElementById('modalNav');

    var TOTAL_STEPS = 4;
    var currentStep = 1;
    var formData = {};

    function updateStepUI() {
      steps.forEach(function(s) { s.classList.remove('active'); });
      var current = form.querySelector('[data-step="' + currentStep + '"]');
      if (current) current.classList.add('active');

      // Progress bar
      var pct = (currentStep / TOTAL_STEPS) * 100;
      if (progressBar) progressBar.style.width = pct + '%';

      // Label
      if (stepLabel && currentStep <= TOTAL_STEPS) {
        stepLabel.textContent = 'Passo ' + currentStep + ' di ' + TOTAL_STEPS;
      }

      // Bottoni navigazione
      if (btnBack) btnBack.classList.toggle('hidden', currentStep === 1);
      
      if (currentStep === TOTAL_STEPS) {
        if (btnNext) btnNext.style.display = 'none';
        if (btnSubmit) btnSubmit.style.display = 'inline-flex';
      } else {
        if (btnNext) btnNext.style.display = 'inline-flex';
        if (btnSubmit) btnSubmit.style.display = 'none';
      }

      // Nascondi barra navigazione sullo step di successo/conferma
      if (currentStep === 5) {
        if (modalNav) modalNav.style.display = 'none';
        if (stepLabel) stepLabel.textContent = '';
        if (progressBar) progressBar.style.width = '100%';
      }
    }

    // Navigazione Avanti
    if (btnNext) {
      btnNext.addEventListener('click', function() {
        if (validateStep(currentStep)) {
          currentStep++;
          updateStepUI();
        }
      });
    }

    // Navigazione Indietro
    if (btnBack) {
      btnBack.addEventListener('click', function() {
        if (currentStep > 1) {
          currentStep--;
          updateStepUI();
        }
      });
    }

    // Validazione base
    function validateStep(step) {
      if (step === 1) {
        var nome  = form.querySelector('#f-nome').value.trim();
        var email = form.querySelector('#f-email').value.trim();
        var tel   = form.querySelector('#f-tel').value.trim();
        if (!nome || !email || !tel) {
          alert('Compila tutti i campi per continuare.');
          return false;
        }
      }
      if (step === 2) {
        var tipoAttivita = formData['tipo_attivita'];
        var fase = formData['fase'];
        if (!tipoAttivita || !fase) {
          alert('Seleziona il tipo di attività e la fase del progetto.');
          return false;
        }
      }
      return true;
    }

    // Option Pills (singola)
    form.querySelectorAll('.option-pills:not(.multi)').forEach(function(group) {
      group.querySelectorAll('.pill').forEach(function(pill) {
        pill.addEventListener('click', function() {
          group.querySelectorAll('.pill').forEach(function(p) { p.classList.remove('selected'); });
          pill.classList.add('selected');
          formData[group.getAttribute('data-field')] = pill.getAttribute('data-value');
        });
      });
    });

    // Option Pills (multipla)
    form.querySelectorAll('.option-pills.multi').forEach(function(group) {
      group.querySelectorAll('.pill').forEach(function(pill) {
        pill.addEventListener('click', function() {
          pill.classList.toggle('selected');
          var selected = Array.from(group.querySelectorAll('.pill.selected')).map(function(p) {
            return p.getAttribute('data-value');
          });
          formData[group.getAttribute('data-field')] = selected;
        });
      });
    });

    // Submit
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      formData['nome']     = form.querySelector('#f-nome').value.trim();
      formData['email']    = form.querySelector('#f-email').value.trim();
      formData['telefono'] = form.querySelector('#f-tel').value.trim();
      formData['note']     = form.querySelector('#f-note').value.trim();
      formData['data']     = new Date().toLocaleString('it-IT');

      console.log('Richiesta consulenza ricevuta:', formData);

      currentStep = 5;
      updateStepUI();
    });

    // Inizializza UI
    updateStepUI();
  }

})();

