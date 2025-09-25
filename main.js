/* ================================
   ENEEM — main.js
   Interações: smooth scroll, reveal on-scroll, scroll-spy, hero stagger.
   GSAP opcional (ScrollTrigger) com fallback completo.
   ================================ */
(function(){
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    setYear();
    splitHeroTitle();
    initSmoothScroll();
    initScrollReveal();
    initNavSpy();
    initScrollCue();
    enhanceWithGSAP();
  });

  /* Util: ano no footer */
  function setYear(){
    const y = document.querySelector('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* Stagger simples (hero) — sem GSAP */
  function splitHeroTitle(){
    const title = document.querySelector('[data-animate="stagger-words"]');
    if (!title) return;
    const spans = title.querySelectorAll('span');
    if (reducedMotion){
      spans.forEach(s => { s.style.opacity = 1; s.style.filter = 'none'; });
      return;
    }
    let delay = 0;
    spans.forEach(s => {
      s.style.transition = 'opacity .9s ease, filter .9s ease';
      s.style.transitionDelay = `${delay}ms`;
      requestAnimationFrame(() => { s.style.opacity = 1; s.style.filter = 'blur(0px)'; });
      delay += 80;
    });
  }

  /* Smooth scroll com offset do header + URL update */
  function initSmoothScroll(){
    const header = document.querySelector('.site-header');
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const headerOffset = header ? header.offsetHeight : 0;
        const rect = target.getBoundingClientRect();
        const y = window.scrollY + rect.top - (headerOffset + 12);
        if (reducedMotion) window.scrollTo(0, y);
        else window.scrollTo({ top: y, behavior: 'smooth' });
        // Atualiza hash (sem saltar)
        history.pushState(null, '', id);
      });
    });
  }

  /* Revelação com IntersectionObserver (fallback principal) */
  function initScrollReveal(){
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if ('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting){
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
      els.forEach(el => io.observe(el));
    } else {
      // Fallback muito básico
      els.forEach(el => el.classList.add('is-visible'));
    }
  }

  /* Scroll-Spy: marca link ativo conforme secção visível */
  function initNavSpy(){
    const navLinks = Array.from(document.querySelectorAll('[data-spy]'));
    if (!navLinks.length) return;
    const sections = navLinks.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
    const map = new Map(navLinks.map(l => [l.getAttribute('href'), l]));

    function setActive(id){
      map.forEach((link, href) => {
        if (href === id) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    }

    const opts = { rootMargin: '-40% 0px -50% 0px', threshold: 0.0 };
    if ('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting){
            setActive(`#${entry.target.id}`);
          }
        });
      }, opts);
      sections.forEach(s => io.observe(s));
    } else {
      // Fallback
      function onScroll(){
        let best = sections[0];
        const fromTop = window.scrollY + (window.innerHeight * 0.4);
        for (const s of sections){
          if (s.offsetTop <= fromTop) best = s;
        }
        if (best) setActive(`#${best.id}`);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  /* Botão cue no hero para saltar para #sobre */
  function initScrollCue(){
    const cue = document.querySelector('.scroll-cue');
    if (!cue) return;
    cue.addEventListener('click', () => {
      const target = document.querySelector(cue.dataset.scrollTo || '#sobre');
      if (!target) return;
      const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
      const rect = target.getBoundingClientRect();
      const y = window.scrollY + rect.top - (headerOffset + 12);
      if (reducedMotion) window.scrollTo(0, y);
      else window.scrollTo({ top: y, behavior: 'smooth' });
    });
  }

  /* GSAP (opcional) — realces adicionais se existir */
  function enhanceWithGSAP(){
    if (typeof window.gsap === 'undefined') return;
    if (reducedMotion) return;
    const gsap = window.gsap;
    if (window.ScrollTrigger) {
      // Evita duplicar: aplica GSAP nas .reveal excepto quando já visíveis
      document.querySelectorAll('.reveal:not(#sobre .reveal)').forEach(el => {
        gsap.from(el, {
          y: 20, autoAlpha: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
      });
      // Realce pedido para #sobre
      document.querySelectorAll('#sobre .reveal').forEach(el => {
        gsap.from(el, {
          y: 16, autoAlpha: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        });
      });
    }
  }

})();