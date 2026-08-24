(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let w, h, stars, raf;

  function init() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    // rastro disperso, no un campo denso: unas pocas "estrellas" con líneas ocasionales
    const count = Math.max(14, Math.floor((w * h) / 42000));
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.6,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }

  function connections() {
    // solo une vecinos cercanos, con muy baja opacidad
    const pairs = [];
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) pairs.push([stars[i], stars[j], d]);
      }
    }
    return pairs;
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const pairs = connections();
    pairs.forEach(([a, b, d]) => {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = 'rgba(232, 179, 74, ' + ((1 - d / 160) * 0.12) + ')';
      ctx.lineWidth = 0.6;
      ctx.stroke();
    });
    stars.forEach((s) => {
      const flicker = reduceMotion ? 1 : 0.6 + Math.sin(t / 900 + s.twinkle) * 0.4;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(232, 179, 74, ' + (0.55 * flicker) + ')';
      ctx.fill();
    });
    if (!reduceMotion) raf = requestAnimationFrame(draw);
  }

  init();
  draw(0);

  window.addEventListener('resize', function () {
    if (raf) cancelAnimationFrame(raf);
    init();
    draw(0);
  });
})();