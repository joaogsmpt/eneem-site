/* ================================
   ENEEM — main.js
   ================================ */
(function(){
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    setYear();
    syncHeaderOffset();
    splitHeroTitle();
    initSmoothScroll();
    initScrollReveal();
    initNavSpy();
    initScrollCue();
    initProgramTabs();
    enhanceWithGSAP();
  });

  function setYear(){
    const y = document.querySelector('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* Header: sincroniza padding-top com altura real */
  function syncHeaderOffset(){
    const header = document.querySelector('.site-header');
    if (!header) return;
    const apply = () => {
      const h = header.offsetHeight || 64;
      document.documentElement.style.setProperty('--header-offset', h + 'px');
    };
    apply();
    if (window.ResizeObserver){
      const ro = new ResizeObserver(apply);
      ro.observe(header);
    } else {
      window.addEventListener('resize', apply, { passive: true });
    }
  }

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
        history.pushState(null, '', id);
      });
    });
  }

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
      els.forEach(el => el.classList.add('is-visible'));
    }
  }

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

  function initProgramTabs(){
    const tablist = document.querySelector('.program-tabs');
    if (!tablist) return;
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls'))).filter(Boolean);

    function activateTab(idx){
      tabs.forEach((t,i)=>{
        const selected = i===idx;
        t.setAttribute('aria-selected', selected ? 'true' : 'false');
        panels[i].hidden = !selected;
        panels[i].classList.toggle('is-active', selected);
      });
      tabs[idx].focus();
    }

    tabs.forEach((tab, idx)=>{
      tab.addEventListener('click', ()=> activateTab(idx));
      tab.addEventListener('keydown', (e)=>{
        const key = e.key;
        let newIdx = idx;
        if (key === 'ArrowRight') newIdx = (idx+1) % tabs.length;
        else if (key === 'ArrowLeft') newIdx = (idx-1+tabs.length) % tabs.length;
        else if (key === 'Home') newIdx = 0;
        else if (key === 'End') newIdx = tabs.length-1;
        else if (key === 'Enter' || key === ' ') { e.preventDefault(); activateTab(idx); return; }
        else return;
        e.preventDefault();
        activateTab(newIdx);
      });
    });
  }

  function enhanceWithGSAP(){
    if (typeof window.gsap === 'undefined') return;
    if (reducedMotion) return;
    const gsap = window.gsap;
    if (window.ScrollTrigger) {
      document.querySelectorAll('.reveal:not(#sobre .reveal)').forEach(el => {
        gsap.from(el, {
          y: 20, autoAlpha: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
      });
      document.querySelectorAll('#sobre .reveal').forEach(el => {
        gsap.from(el, {
          y: 16, autoAlpha: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        });
      });
      document.querySelectorAll('#programa .event-card').forEach(el => {
        gsap.from(el, {
          y: 18, autoAlpha: 0, duration: 0.55, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        });
      });
    }
  }

})();