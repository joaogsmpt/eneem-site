/* ================================
   X ENEEM — main.js
   Interações: parallax leve, revelações on-scroll, smooth scroll, scroll-spy.
   GSAP opcional (melhora as animações). Fallback completo em JS puro.
   ================================ */

(function(){
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    setYear();
    splitHeroTitle();
    initSmoothScroll();
    initScrollReveal();
    initParallax();
    initNavSpy();
    initScrollCue();
    enhanceWithGSAP(); // tenta usar GSAP se disponível
  });

  function setYear(){
    const y = document.querySelector('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ===== Smooth Scroll ===== */
  function initSmoothScroll(){
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
        const rect = target.getBoundingClientRect();
        const offset = window.scrollY + rect.top - (headerOffset + 12);
        if (reducedMotion) {
          window.scrollTo(0, offset);
        } else {
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
        history.replaceState(null, '', id);
      });
    });
  }

  /* ===== Scroll Cue ===== */
  function initScrollCue(){
    const cue = document.querySelector('.scroll-cue');
    if (!cue) return;
    cue.addEventListener('click', () => {
      const target = document.querySelector(cue.dataset.scrollTo || '#sobre');
      if (!target) return;
      const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
      const rect = target.getBoundingClientRect();
      const offset = window.scrollY + rect.top - (headerOffset + 12);
      if (reducedMotion) window.scrollTo(0, offset);
      else window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  }

  /* ===== Split hero title in words for stagger animation ===== */
  function splitHeroTitle(){
    const title = document.querySelector('[data-animate="stagger-words"]');
    if (!title) return;
    const spans = title.querySelectorAll('span');
    const stagger = 50; // 0.05s
    const duration = 700; // 0.7s
    spans.forEach((s, i) => {
      s.style.transition = `opacity ${duration}ms linear`;
      s.style.transitionDelay = `${i * stagger}ms`;
      requestAnimationFrame(() => { s.style.opacity = 1; });
    });
  }

  /* ===== IntersectionObserver reveal ===== */
  function initScrollReveal(){
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reducedMotion) {
      els.forEach(el => el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    els.forEach(el => io.observe(el));
  }

  /* ===== Parallax leve ===== */
  function initParallax(){
    if (reducedMotion) return;
    const layers = document.querySelectorAll('[data-depth]');
    if (!layers.length) return;

    const onScroll = debounce(() => {
      const y = window.scrollY || window.pageYOffset;
      layers.forEach(layer => {
        const depth = parseFloat(layer.dataset.depth || '0');
        // deslocamento máximo ~15% da altura do elemento
        const maxOffset = (layer.clientHeight || 800) * 0.15;
        const translate = Math.max(-maxOffset, Math.min(maxOffset, y * depth));
        layer.style.transform = `translateY(${translate}px)`;
      });
    }, 16);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ===== Scroll-Spy (nav ativa por secção) ===== */
  function initNavSpy(){
    const links = Array.from(document.querySelectorAll('[data-spy]'));
    const map = new Map(links.map(link => [link.getAttribute('href'), link]));

    const sections = links
      .map(l => document.querySelector(l.getAttribute('href')))
      .filter(Boolean);

    function setActive(id){
      map.forEach((link, href) => {
        if (href === id) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    }

    if (!('IntersectionObserver' in window)) {
      window.addEventListener('scroll', () => {
        const fromTop = window.scrollY + (document.querySelector('.site-header')?.offsetHeight || 0) + 20;
        let current = sections[0]?.id ? '#' + sections[0].id : null;
        sections.forEach(sec => {
          if (sec.offsetTop <= fromTop) current = '#' + sec.id;
        });
        if (current) setActive(current);
      }, { passive: true });
      return;
    }

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive('#' + entry.target.id);
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });

    sections.forEach(sec => obs.observe(sec));
  }

  /* ===== GSAP enhancements (opcional) ===== */
  function enhanceWithGSAP(){
    if (typeof window.gsap === 'undefined') return;
    const gsap = window.gsap;
    if (reducedMotion) return;

    // Animação do título (stagger suave)
    const titleSpans = document.querySelectorAll('.hero-title span');
    gsap.fromTo(titleSpans, { autoAlpha: 0, filter: 'blur(6px)' }, {
      autoAlpha: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out', stagger: 0.08
    });

    // Revelações on-scroll
    if (window.ScrollTrigger) {
      document.querySelectorAll('.reveal').forEach(el => {
        gsap.from(el, {
          y: 20, autoAlpha: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
      });
    }
  }

  /* ===== Debounce util ===== */
  function debounce(fn, wait){
    let t;
    return function(...args){
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

})();