/* ===================================================
   KREA Global Contract — gsap-scroll.js
   GSAP 3 + ScrollTrigger · Canvas Scroll Sequence
   Hero: 288 frame JPG scrubbed via scroll progress
=================================================== */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     0. GUARD
  ───────────────────────────────────────────── */
  if (typeof gsap === 'undefined') {
    console.warn('[krea] GSAP not found — scroll animations disabled.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ─────────────────────────────────────────────
     1. CANVAS SEQUENCE — 288 frame scroll-scrub
  ───────────────────────────────────────────── */
  const FRAME_DIR   = 'assets/videos/ffffff-ezgif-1f1a4f3ee7716729-webp-jpg/';
  const FRAME_COUNT = 288;          // frame_000 … frame_287
  const FRAME_PAD   = 3;            // zero-padding (000)

  // Genera tutti i path delle immagini
  const framePaths = Array.from({ length: FRAME_COUNT }, (_, i) => {
    const n = String(i).padStart(FRAME_PAD, '0');
    return `${FRAME_DIR}frame_${n}_delay-0.055s.jpg`;
  });

  const canvas = document.getElementById('heroCanvas');
  const ctx    = canvas ? canvas.getContext('2d') : null;

  if (!canvas || !ctx) {
    console.warn('[krea] #heroCanvas not found — sequence disabled.');
    return;
  }

  /* ── Canvas sizing (adatta per schermi Retina) ── */
  function resizeCanvas() {
    canvas.width  = window.innerWidth  * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  /* ── Image Cache ── */
  const images = new Array(FRAME_COUNT).fill(null);
  let   currentFrame = 0;

  function drawFrame(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const cW = canvas.width  / window.devicePixelRatio;
    const cH = canvas.height / window.devicePixelRatio;
    const iW = img.naturalWidth;
    const iH = img.naturalHeight;

    // Object-fit: cover centrato
    const scale  = Math.max(cW / iW, cH / iH);
    const dw     = iW * scale;
    const dh     = iH * scale;
    const dx     = (cW - dw) / 2;
    const dy     = (cH - dh) / 2;

    ctx.clearRect(0, 0, cW, cH);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function loadFrame(idx) {
    if (images[idx]) return; // Già caricato
    const img = new Image();
    img.src = framePaths[idx];
    img.onload = () => {
      images[idx] = img;
      if (idx === currentFrame) {
        drawFrame(img);
      }
    };
    images[idx] = img; // Segna come in caricamento
  }

  /* ── Preload Strategy:
        Carica subito i primi 36 frame per la visualizzazione immediata,
        poi carica gli altri in background. ── */
  function preloadAll() {
    // Priorità alta: primi 36 frame
    for (let i = 0; i <= 35; i++) loadFrame(i);
    // Background load: resto dei frame
    setTimeout(() => {
      for (let i = 36; i < FRAME_COUNT; i++) loadFrame(i);
    }, 500);
  }
  preloadAll();

  // Forza il disegno del primo frame all'inizio
  const firstImg = new Image();
  firstImg.src = framePaths[0];
  firstImg.onload = () => {
    images[0] = firstImg;
    drawFrame(firstImg);
  };

  /* ── Scroll progress -> frame render ── */
  function updateFrame(progress) {
    const idx = Math.min(
      Math.floor(progress * (FRAME_COUNT - 1)),
      FRAME_COUNT - 1
    );
    if (idx === currentFrame) return;
    currentFrame = idx;
    if (images[idx] && images[idx].complete) {
      drawFrame(images[idx]);
    } else {
      // Se non è pronto in cache, carica on-demand e renderizza appena possibile
      loadFrame(idx);
    }
  }

  /* ── ScrollTrigger per il Canvas ── */
  ScrollTrigger.create({
    trigger:  '#hero',
    start:    'top top',
    end:      'bottom bottom',
    scrub:    1.5, // scrub fluido con leggero ritardo
    onUpdate: (self) => updateFrame(self.progress),
  });

  // Re-draw sul resize
  window.addEventListener('resize', () => {
    if (images[currentFrame] && images[currentFrame].complete) {
      drawFrame(images[currentFrame]);
    }
  }, { passive: true });


  /* ─────────────────────────────────────────────
     2. NARRATIVE BEATS TIMELINE
     Gestiamo l'entrata/uscita dei 4 beat
  ───────────────────────────────────────────── */

  function beatTimeline(el, startPct, endPct) {
    if (!el) return;
    const fadeWindow = 0.08; // Finestra di transizione (8% dello scroll)

    // Animazione di Fade-In
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#hero',
          start:   `${startPct}% top`,
          end:     `${startPct + fadeWindow * 100}% top`,
          scrub:   1,
        },
      }
    );

    // Animazione di Fade-Out
    gsap.to(el, {
      opacity: 0, y: -30,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: '#hero',
        start:   `${endPct - fadeWindow * 100}% top`,
        end:     `${endPct}% top`,
        scrub:   1,
      },
    });
  }

  // Beat A: 0% – 22%
  beatTimeline(document.getElementById('beatA'), 0, 22);

  // Beat B: 25% – 48%
  beatTimeline(document.getElementById('beatB'), 25, 48);

  // Beat C: 50% – 72%
  beatTimeline(document.getElementById('beatC'), 50, 72);

  // Beat D: 75% – 97%
  beatTimeline(document.getElementById('beatD'), 75, 97);

  // Staggering delle card all'interno del Beat C
  const beatCCards = document.querySelectorAll('#beatC .hero-beat__card');
  if (beatCCards.length) {
    gsap.fromTo(
      beatCCards,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        stagger: 0.12,
        ease:    'power2.out',
        scrollTrigger: {
          trigger: '#hero',
          start:   '52% top',
          end:     '60% top',
          scrub:   1,
        },
      }
    );
  }

  /* ─────────────────────────────────────────────
     3. SCROLL HINT (scompare a 10% scroll progress)
  ───────────────────────────────────────────── */
  const scrollHint = document.getElementById('heroScrollHint');
  if (scrollHint) {
    gsap.to(scrollHint, {
      opacity: 0,
      y: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start:   'top top',
        end:     '10% top',
        scrub:   1,
        onLeave: () => { scrollHint.style.pointerEvents = 'none'; },
      },
    });
  }

})();
