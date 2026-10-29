(() => {
  'use strict';

  const button = document.getElementById('background-motion');
  if (!button) return;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;

  canvas.id = 'particle-background';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey = 'portfolio-background-motion';
  let preference;
  try { preference = localStorage.getItem(storageKey); } catch {}
  let enabled = !motion.matches && preference !== 'off';
  let frame = null;
  let lastTime = 0;
  let width = 0;
  let height = 0;
  let points = [];
  let pointerX = null;
  let pointerY = null;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const count = Math.max(18, Math.min(width < 768 ? 30 : 80, Math.floor(width * height / 16000)));
    points = Array.from({length: count}, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
    }));
  }

  function line(x1, y1, x2, y2, opacity) {
    context.beginPath();
    context.strokeStyle = `rgba(69, 80, 91, ${opacity})`;
    context.lineWidth = 0.7;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  function draw(time) {
    frame = requestAnimationFrame(draw);
    const elapsed = time - lastTime;
    if (elapsed < 1000 / 30) return;
    const step = Math.min(elapsed, 50) / (1000 / 60);
    lastTime = time;
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'rgba(69, 80, 91, 0.5)';
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      point.x += point.vx * step;
      point.y += point.vy * step;
      if (point.x < 0 || point.x > width) point.vx *= -1;
      if (point.y < 0 || point.y > height) point.vy *= -1;
      point.x = Math.max(0, Math.min(width, point.x));
      point.y = Math.max(0, Math.min(height, point.y));
      context.fillRect(point.x, point.y, 1.5, 1.5);
      for (let j = i + 1; j < points.length; j++) {
        const other = points[j];
        const distance = (point.x - other.x) ** 2 + (point.y - other.y) ** 2;
        if (distance < 150 ** 2) line(point.x, point.y, other.x, other.y, 0.24 * (1 - distance / 150 ** 2));
      }
      if (pointerX !== null) {
        const distance = (point.x - pointerX) ** 2 + (point.y - pointerY) ** 2;
        if (distance < 180 ** 2) line(point.x, point.y, pointerX, pointerY, 0.3 * (1 - distance / 180 ** 2));
      }
    }
  }

  function move(event) {
    if (event.pointerType !== 'mouse') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
  }

  function clearPointer() { pointerX = pointerY = null; }

  function stop() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastTime = 0;
    clearPointer();
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerout', leave);
    window.removeEventListener('blur', clearPointer);
  }

  function leave(event) { if (!event.relatedTarget) clearPointer(); }

  function sync() {
    stop();
    canvas.hidden = !enabled;
    button.setAttribute('aria-pressed', String(enabled));
    button.title = enabled ? 'Pause background animation' : 'Enable background animation';
    button.querySelector('i').className = enabled ? 'bx bx-pause' : 'bx bx-play';
    if (!enabled || document.hidden) return;
    window.addEventListener('pointermove', move, {passive: true});
    window.addEventListener('pointerout', leave, {passive: true});
    window.addEventListener('blur', clearPointer);
    frame = requestAnimationFrame(draw);
  }

  button.addEventListener('click', () => {
    enabled = !enabled;
    preference = enabled ? 'on' : 'off';
    try { localStorage.setItem(storageKey, preference); } catch {}
    sync();
  });
  motion.addEventListener('change', () => {
    enabled = !motion.matches && preference !== 'off';
    try { enabled = !motion.matches && localStorage.getItem(storageKey) !== 'off'; } catch {}
    sync();
  });
  window.addEventListener('resize', resize, {passive: true});
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', sync);
  resize();
  button.hidden = false;
  sync();
})();
