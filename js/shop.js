/* =====================================================
   KREA GLOBAL CONTRACT — Shop Controller
   Filters · Lazy Loading · Reveal Animations · Dialog
===================================================== */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. CATEGORY FILTERS
  ───────────────────────────────────────────── */
  const filterPills = document.querySelectorAll('.filter-pill');
  const productCards = document.querySelectorAll('.product-card');

  if (filterPills.length > 0 && productCards.length > 0) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        // Rimuove la classe active da tutte le pill
        filterPills.forEach(p => p.classList.remove('active'));
        // Aggiunge la classe active alla pill cliccata
        pill.classList.add('active');

        const filterVal = pill.getAttribute('data-filter');

        productCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');

          if (filterVal === 'tutti' || cardCat === filterVal) {
            // Rende visibile la card prima del fade-in
            card.classList.remove('hidden');
            // Ritardo millimetrico per avviare la transizione CSS
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            // Effetto fade-out prima di nascondere
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.addEventListener('transitionend', function handler(e) {
              if (e.propertyName === 'opacity' && card.style.opacity === '0') {
                card.classList.add('hidden');
                card.removeEventListener('transitionend', handler);
              }
            });
          }
        });

        // Trigger manuale di ScrollTrigger/Resize per ricalcolare posizioni se necessario
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      });
    });
  }

  /* ─────────────────────────────────────────────
     2. REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  ───────────────────────────────────────────── */
  if ('IntersectionObserver' in window && productCards.length > 0) {
    const shopObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Staggering delle card
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 60);
          shopObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15
    });

    productCards.forEach(card => shopObserver.observe(card));
  } else {
    // Fallback
    productCards.forEach(card => card.classList.add('visible'));
  }

  /* ─────────────────────────────────────────────
     3. INFO REQUEST DIALOG (MODAL)
  ───────────────────────────────────────────── */
  const dialog = document.getElementById('infoDialog');
  const dialogClose = document.getElementById('dialogClose');
  const productNameInput = document.getElementById('dialogProductName');
  const dialogTitleProd = document.getElementById('dialogProductTitle');
  const consultBtns = document.querySelectorAll('.btn-consult');

  if (dialog && consultBtns.length > 0) {
    consultBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.product-card');
        const prodName = card ? card.querySelector('.product-name').textContent : 'Prodotto';

        // Precompila il form della dialog
        if (productNameInput) productNameInput.value = prodName;
        if (dialogTitleProd) dialogTitleProd.textContent = prodName;

        // Apri dialog
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      });
    });

    // Chiudi dialog
    function closeDialog() {
      dialog.close();
      document.body.style.overflow = '';
    }

    if (dialogClose) {
      dialogClose.addEventListener('click', closeDialog);
    }

    // Chiudi cliccando sullo sfondo
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        closeDialog();
      }
    });

    // Submit del form
    const form = dialog.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const prod = productNameInput ? productNameInput.value : '';
        alert(`Richiesta inviata con successo per: ${prod}. Ti contatteremo entro 24 ore.`);
        closeDialog();
        form.reset();
      });
    }
  }

})();
