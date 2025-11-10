/* ================================
   ENEEM — main.js (clean + hero effect)
   ================================ */
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setYear(){
    const y = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach(el => el.textContent = y);
  }

  // Restore reveal behavior (opacity + unblur). Works even without hero split.
  function revealOnLoad(){
    const els = document.querySelectorAll('.reveal');
    els.forEach((el, i) => {
      const delay = prefersReduced ? 0 : Math.min(i * 60, 700);
      el.style.transition = 'opacity .9s ease, filter .9s ease, transform .9s ease';
      el.style.transitionDelay = delay + 'ms';
      // ensure starting state
      if (!prefersReduced) {
        el.style.opacity = 0;
        el.style.filter = 'blur(6px)';
      }
      requestAnimationFrame(() => {
        el.classList.add('is-visible');
        el.style.opacity = 1;
        el.style.filter = 'blur(0px)';
      });
    });
  }

  // Letter-by-letter stagger for the hero title
  function splitHeroTitle(){
    const container = document.querySelector('.hero-title .reveal');
    if (!container) return;
    const original = container.textContent.trim();
    if (!original || container.dataset.enhanced === '1') return;

    // keep accessible name via aria-label on parent
    const parent = container.closest('.hero-title');
    if (parent && !parent.hasAttribute('aria-label')) {
      parent.setAttribute('aria-label', original);
    }

    container.textContent = '';
    let delay = 0;
    for (const ch of original){
      const span = document.createElement('span');
      span.textContent = ch;
      span.setAttribute('aria-hidden', 'true');
      span.style.opacity = 0;
      span.style.filter = 'blur(8px)';
      span.style.transition = 'opacity .9s ease, filter .9s ease';
      span.style.transitionDelay = delay + 'ms';
      container.appendChild(span);
      delay += 70; // stagger
    }
    container.dataset.enhanced = '1';
    requestAnimationFrame(() => {
      container.querySelectorAll('span').forEach(s => {
        s.style.opacity = 1;
        s.style.filter = 'blur(0px)';
      });
    });
  }

  function smoothScroll(){
    const header = document.querySelector('.site-header');
    const offset = header ? header.offsetHeight : 0;
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
        window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
        target.setAttribute('tabindex','-1');
        target.focus({ preventScroll: true });
        setTimeout(() => target.removeAttribute('tabindex'), 1000);
      });
    });
  }

  function navSpy(){
    const links = Array.from(document.querySelectorAll('nav [data-spy]'));
    const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    if (!('IntersectionObserver' in window) || !sections.length) return;

    const header = document.querySelector('.site-header');
    const offset = (header ? header.offsetHeight : 0) + 12;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = '#' + entry.target.id;
        const link = links.find(a => a.getAttribute('href') === id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: `-${offset}px 0px -70% 0px`, threshold: 0.01 });

    sections.forEach(sec => io.observe(sec));
  }

  document.addEventListener('DOMContentLoaded', () => {
    setYear();
    splitHeroTitle();
    revealOnLoad();
    smoothScroll();
    navSpy();
  });
})();