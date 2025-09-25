/* Bootstrap de interações, acessibilidade e animações leves (vanilla) */

const qs = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => [...r.querySelectorAll(s)];

/* Header sticky */
(() => {
  const header = qs('[data-js="header"]');
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 32) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* Menu móvel acessível com focus trap */
(() => {
  const btn = qs('[data-js="menu-toggle"]');
  const drawer = qs('#mobile-drawer');
  const panel = qs('.drawer__panel', drawer);
  const overlay = qs('[data-js="drawer-overlay"]', drawer);
  const closeBtn = qs('[data-js="drawer-close"]', drawer);
  const links = qsa('[data-js="drawer-link"]', drawer);
  if (!btn || !drawer || !panel) return;

  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    const focusables = panel.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
    (focusables[0] || panel).focus();
    document.addEventListener('keydown', onKeydown);
  }
  function close() {
    drawer.hidden = true;
    drawer.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocus) lastFocus.focus();
  }
  function onKeydown(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const focusables = [...panel.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')];
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  btn.addEventListener('click', () => (drawer.hidden ? open() : close()));
  overlay?.addEventListener('click', close);
  closeBtn?.addEventListener('click', close);
  links.forEach(a => a.addEventListener('click', close));
})();

/* Smooth scroll para âncoras */
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const top = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  });
})();

/* Reveal on scroll */
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.2 });
  qsa('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-up').forEach(el => io.observe(el));
})();

/* Parallax subtil */
(() => {
  const els = qsa('[data-parallax]');
  if (!els.length) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    els.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax-speed') || '0.1');
      const rect = el.getBoundingClientRect();
      const progress = (rect.top - vh) / vh;
      const y = progress * speed * 60;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    });
    ticking = false;
  };
  const onScroll = () => { if (!ticking) { window.requestAnimationFrame(update); ticking = true; } };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();

/* Carrossel de citações */
(() => {
  const root = qs('[data-js="quotes"]');
  if (!root) return;
  const track = qs('.quotes__track', root);
  const dotsWrap = qs('.quotes__dots', root);
  const items = qsa('.quote', track);
  let idx = 0, timer = null;

  function go(i, user = false) {
    idx = (i + items.length) % items.length;
    track.style.transform = `translate3d(${-idx * 100}%,0,0)`;
    dotsWrap.querySelectorAll('button').forEach((b, bi) => b.setAttribute('aria-current', String(bi === idx)));
    if (user) restart();
  }
  function start(){ timer = setInterval(() => go(idx + 1), 5000); }
  function stop(){ clearInterval(timer); timer = null; }
  function restart(){ stop(); start(); }

  items.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Ir para citação ${i+1}`);
    b.addEventListener('click', () => go(i, true));
    dotsWrap.appendChild(b);
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  go(0); start();
})();

/* Validação newsletter */
(() => {
  const form = qs('#newsletterForm');
  if (!form) return;
  const email = form.querySelector('input[name="email"]');
  const msg = qs('.form-msg', form);

  function isEmail(v){ return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v); }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = email.value.trim();
    if (!isEmail(v)) {
      email.setAttribute('aria-invalid', 'true');
      msg.textContent = 'Por favor, insere um email válido.';
      msg.style.color = 'var(--warn)';
      return;
    }
    email.removeAttribute('aria-invalid');
    msg.textContent = 'Obrigado! Confirmaremos por email.';
    msg.style.color = 'var(--ok)';
    form.reset();
  });
})();

(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


/* Watermark fade-out on scroll */
(() => {
  const wm = document.querySelector('.hero__watermark');
  const hero = document.querySelector('.hero');
  if (!wm || !hero) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (n, a, b) => Math.min(Math.max(n, a), b);

  const update = () => {
    const heroHeight = hero.offsetHeight || window.innerHeight;
    const end = Math.max(200, Math.min(heroHeight, window.innerHeight) * 0.6);
    const y = window.scrollY;
    const t = clamp(y / end, 0, 1); // 0 -> 1
    // Fade out + micro translate
    wm.style.opacity = String(clamp(0.12 * (1 - t), 0, 0.12));
    wm.style.transform = `translateY(${t*12}px) scale(${1 - t*0.03})`;
  };

  if (prefersReduced){
    wm.style.opacity = '.1';
    return;
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();
