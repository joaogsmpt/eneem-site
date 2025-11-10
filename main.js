/* ================================
   ENEEM — main.js (simplified clean build)
   ================================ */
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setYear(){
    const y = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach(el => el.textContent = y);
  }

  function revealOnLoad(){
    const els = document.querySelectorAll('.reveal');
    els.forEach((el, i) => {
      if (prefersReduced) {
        el.classList.add('is-visible');
        return;
      }
      const delay = Math.min(i * 60, 600);
      el.style.transitionDelay = delay + 'ms';
      requestAnimationFrame(() => el.classList.add('is-visible'));
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
    revealOnLoad();
    smoothScroll();
    navSpy();
  });
})();