(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════════════════════════════════════════
     SCROLL REVEAL
  ═══════════════════════════════════════════════ */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (reduceMotion) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el, i) => {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 0.08) + 's';
      observer.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════
     TERMINAL DEMO (tarjeta "Programas Java")
  ═══════════════════════════════════════════════ */
  function initTerminalDemo() {
    const el = document.getElementById('term-line');
    if (!el || reduceMotion) {
      if (el) el.textContent = 'factura_2026_0041.pdf generada';
      return;
    }
    const phrases = ['generando factura...', 'factura_2026_0041.pdf ✓', 'inventario actualizado ✓'];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = phrases[phraseIndex];
      el.textContent = deleting ? current.slice(0, charIndex--) : current.slice(0, charIndex++);

      let delay = deleting ? 35 : 55;
      if (!deleting && charIndex === current.length + 1) { delay = 1400; deleting = true; }
      if (deleting && charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 400; }

      setTimeout(tick, delay);
    }
    tick();
  }

  function start() {
    initReveal();
    initTerminalDemo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
