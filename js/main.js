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
  const modal        = document.getElementById('consultModal');
  const openBtn      = document.getElementById('openConsultForm');
  const fabBtn       = document.getElementById('fabContatti');
  const closeBtn     = document.getElementById('closeModal');
  const form         = document.getElementById('consultForm');

  if (modal && form) {
    const steps        = form.querySelectorAll('.form-step');
    const btnBack      = document.getElementById('btnBack');
    const btnNext      = document.getElementById('btnNext');
    const btnSubmit    = document.getElementById('btnSubmit');
    const progressBar  = document.getElementById('progressBar');
    const stepLabel    = document.getElementById('stepLabel');
    const modalNav     = document.getElementById('modalNav');

    const TOTAL_STEPS = 4;
    let currentStep = 1;
    const formData = {};

    function openModal(e) {
      if (e) e.preventDefault();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Focus trap o primo input
      const firstInput = form.querySelector('input');
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (fabBtn) {
      fabBtn.addEventListener('click', (e) => {
        // Se siamo sulla homepage apriamo la modale, altrimenti se ha un href (tipo su altre pagine) segue il link
        const href = fabBtn.getAttribute('href');
        if (href === '#' || !href) {
          openModal(e);
        }
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // ESC per chiudere
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // Aggiorna UI step
    function updateStepUI() {
      steps.forEach(s => s.classList.remove('active'));
      const current = form.querySelector(`[data-step="${currentStep}"]`);
      if (current) current.classList.add('active');

      // Progress bar
      const pct = (currentStep / TOTAL_STEPS) * 100;
      if (progressBar) progressBar.style.width = pct + '%';

      // Label
      if (stepLabel && currentStep <= TOTAL_STEPS) {
        stepLabel.textContent = `Passo ${currentStep} di ${TOTAL_STEPS}`;
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
      btnNext.addEventListener('click', () => {
        if (validateStep(currentStep)) {
          currentStep++;
          updateStepUI();
        }
      });
    }

    // Navigazione Indietro
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          updateStepUI();
        }
      });
    }

    // Validazione base dei campi dello step
    function validateStep(step) {
      if (step === 1) {
        const nome  = form.querySelector('#f-nome').value.trim();
        const email = form.querySelector('#f-email').value.trim();
        const tel   = form.querySelector('#f-tel').value.trim();
        if (!nome || !email || !tel) {
          alert('Compila tutti i campi per continuare.');
          return false;
        }
      }
      if (step === 2) {
        const tipoAttivita = formData['tipo_attivita'];
        const fase = formData['fase'];
        if (!tipoAttivita || !fase) {
          alert('Seleziona il tipo di attività e la fase del progetto.');
          return false;
        }
      }
      return true;
    }

    // Gestione Pill Selection (Scelta singola)
    form.querySelectorAll('.option-pills:not(.multi)').forEach(group => {
      group.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
          group.querySelectorAll('.pill').forEach(p => p.classList.remove('selected'));
          pill.classList.add('selected');
          formData[group.getAttribute('data-field')] = pill.getAttribute('data-value');
        });
      });
    });

    // Gestione Pill Selection (Scelta multipla)
    form.querySelectorAll('.option-pills.multi').forEach(group => {
      group.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
          pill.classList.toggle('selected');
          const selected = Array.from(group.querySelectorAll('.pill.selected')).map(p => p.getAttribute('data-value'));
          formData[group.getAttribute('data-field')] = selected;
        });
      });
    });

    // Submit del form
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Raccogli dati finali dai campi di testo
      formData['nome']     = form.querySelector('#f-nome').value.trim();
      formData['email']    = form.querySelector('#f-email').value.trim();
      formData['telefono'] = form.querySelector('#f-tel').value.trim();
      formData['note']     = form.querySelector('#f-note').value.trim();
      formData['data']     = new Date().toLocaleString('it-IT');

      // Console log per simulare invio dati
      console.log('Richiesta consulenza ricevuta:', formData);

      // Mostra schermata successo
      currentStep = 5;
      updateStepUI();
    });

    // Inizializza UI
    updateStepUI();
  }

})();

