/* =============================================
   THE LONDON CODER — Main JS
   ============================================= */

// ── Particle / dot-grid canvas background ──
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const COUNT = 80;
  const ACCENT = '0, 255, 180';
  const ACCENT2 = '108, 99, 255';
  const MAX_DIST = 140;
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    const colors = [ACCENT, ACCENT2, '255, 255, 255'];
    const c = colors[Math.floor(Math.random() * colors.length)];
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - 0.5) * 0.35,
      vy:  (Math.random() - 0.5) * 0.35,
      r:   Math.random() * 1.5 + 0.5,
      col: c,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update + draw dots
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col}, 0.7)`;
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // Mouse interaction
      const mdx = a.x - mouse.x;
      const mdy = a.y - mouse.y;
      const md  = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 160) {
        const alpha = (1 - md / 160) * 0.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  init();
  draw();
})();


// ── Typewriter effect ──
(function () {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'software developer',
    'problem solver',
    'london based',
    'always learning',
    'everything from web to mobile'
  ];

  let pi = 0, ci = 0, deleting = false;
  const DELAY_TYPE = 80;
  const DELAY_DELETE = 40;
  const DELAY_PAUSE = 1800;
  const DELAY_NEXT = 300;

  function tick() {
    const current = phrases[pi];

    if (!deleting) {
      el.textContent = current.slice(0, ci + 1);
      ci++;
      if (ci === current.length) {
        deleting = true;
        setTimeout(tick, DELAY_PAUSE);
        return;
      }
      setTimeout(tick, DELAY_TYPE);
    } else {
      el.textContent = current.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, DELAY_NEXT);
        return;
      }
      setTimeout(tick, DELAY_DELETE);
    }
  }

  setTimeout(tick, 800);
})();


// ── Card index labels ──
// Replace the static "length" with 01, 02, 03 etc.
(function () {
  const cards = document.querySelectorAll('.project-card');
  const labels = document.querySelectorAll('.card-index');
  labels.forEach((label, i) => {
    label.textContent = String(i + 1).padStart(2, '0');
  });
})();


// ── Staggered card reveal on scroll ──
(function () {
  const cards = document.querySelectorAll('.project-card');
  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => c.style.opacity = '1');
    return;
  }

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity 0.5s ${i * 0.1}s ease, transform 0.5s ${i * 0.1}s ease, border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease`;
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => obs.observe(card));
})();
