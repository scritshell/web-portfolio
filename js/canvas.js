
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════
     HERO
  ═══════════════════════════════════════════════ */
  const heroCanvas = document.getElementById('demo-canvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let w, h, particles, raf;
    const mouse = { x: -9999, y: -9999 };

    function initHero() {
      w = heroCanvas.width  = heroCanvas.offsetWidth;
      h = heroCanvas.height = heroCanvas.offsetHeight;
      particles = [];
      const count = Math.floor((w * h) / 8500);
      for (let i = 0; i < count; i++) {
        particles.push({
          x:  Math.random() * w,
          y:  Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r:  Math.random() * 1.5 + 0.8
        });
      }
    }

    function loopHero() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(110, 170, 255, 0.9)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(80, 150, 255, ' + ((1 - d / 140) * 0.3) + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
        const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        const md  = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 200) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(140, 200, 255, ' + ((1 - md / 200) * 0.65) + ')';
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(loopHero);
    }

    window.addEventListener('mousemove', function (e) {
      const rect = heroCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', function () {
      mouse.x = -9999; mouse.y = -9999;
    });

    initHero();
    loopHero();

    window.addEventListener('resize', function () {
      cancelAnimationFrame(raf);
      initHero();
      loopHero();
    });
  }

  /* ═══════════════════════════════════════════════
     SECCIONES
  ═══════════════════════════════════════════════ */
  function createSectionCanvas(canvasEl) {
    const ctx = canvasEl.getContext('2d');
    let w, h, particles, raf;

    function init() {
      w = canvasEl.width  = canvasEl.offsetWidth;
      h = canvasEl.height = canvasEl.offsetHeight;
      particles = [];
      const count = Math.floor((w * h) / 10000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x:  Math.random() * w,
          y:  Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r:  Math.random() * 1.2 + 0.6
        });
      }
    }

    function loop() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(110, 170, 255, 0.7)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(80, 150, 255, ' + ((1 - d / 130) * 0.2) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(loop);
    }

    init();
    loop();

    window.addEventListener('resize', function () {
      cancelAnimationFrame(raf);
      init();
      loop();
    });
  }

  document.querySelectorAll('.section-canvas').forEach(function (c) {
    createSectionCanvas(c);
  });

})();
