/* ================================
   ENEEM — main.js (refactor)
   ================================ */
(function(){
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Info das empresas (placeholder; podes editar livremente) ---
  const empresaInfo = {
    1: "A empresa 1 é fixe",
    2: "A empresa 2 é fixe",
    3: "A empresa 3 é fixe",
    4: "A empresa 4 é fixe",
    5: "A empresa 5 é fixe",
    6: "A empresa 6 é fixe",
    7: "A empresa 7 é fixe",
    8: "A empresa 8 é fixe",
    9: "A empresa 9 é fixe",
    10: "A empresa 10 é fixe",
    11: "A empresa 11 é fixe",
    12: "A empresa 12 é fixe",
    13: "A empresa 13 é fixe",
    14: "A empresa 14 é fixe",
    15: "A empresa 15 é fixe",
    16: "A empresa 16 é fixe",
    17: "A empresa 17 é fixe",
    18: "A empresa 18 é fixe",
    19: "A empresa 19 é fixe",
    20: "A empresa 20 é fixe"
  };

  // --- Modal helpers & focus trap ---
  let lastFocused = null;
  let disableScrollPrev = "";
  let inertTargets = [];
  function getModalEls(){
    const modalEl = document.getElementById('empresa-modal');
    return {
      modalEl,
      modalDialog: modalEl ? modalEl.querySelector('.modal-dialog') : null,
      modalTitle: modalEl ? modalEl.querySelector('#empresa-modal-title') : null,
      modalText:  modalEl ? modalEl.querySelector('#empresa-modal-text')  : null,
    };
  }
  function getFocusable(container){
    if (!container) return [];
    return Array.from(container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )).filter(el => el.offsetParent !== null);
  }
  function setInert(on){
    // inert/aria-hidden em tudo menos o modal
    const { modalEl } = getModalEls();
    const kids = Array.from(document.body.children);
    inertTargets = kids.filter(el => el !== modalEl);
    inertTargets.forEach(el => {
      if (on){
        el.setAttribute('aria-hidden', 'true');
        el.inert = true;
      } else {
        el.removeAttribute('aria-hidden');
        el.inert = false;
      }
    });
  }
  function trapTab(e, list){
    if (e.key !== 'Tab' || !list.length) return;
    const first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }

  function openEmpresaModal(n){
    const { modalEl, modalDialog, modalTitle, modalText } = getModalEls();
    if(!modalEl || !modalDialog) return;
    lastFocused = document.activeElement;
    modalTitle && (modalTitle.textContent = "Empresa " + n);
    const txt = empresaInfo[n] || ("A empresa " + n + " é fixe");
    modalText && (modalText.textContent = txt);

    // focus trap + inert + disable scroll
    setInert(true);
    disableScrollPrev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    modalEl.setAttribute('aria-hidden','false');
    setTimeout(() => {
      const focusables = getFocusable(modalDialog);
      (focusables[0] || modalDialog).focus();
      function onKey(e){ trapTab(e, focusables); if(e.key === 'Escape') closeEmpresaModal(); }
      modalEl._trapHandler = onKey;
      document.addEventListener('keydown', onKey);
    }, 0);
  }

  function closeEmpresaModal(){
    const { modalEl } = getModalEls();
    if(!modalEl) return;
    modalEl.setAttribute('aria-hidden','true');
    // restore inert & scrolling
    setInert(false);
    document.documentElement.style.overflow = disableScrollPrev || '';
    if (modalEl._trapHandler){ document.removeEventListener('keydown', modalEl._trapHandler); modalEl._trapHandler = null; }
    if (lastFocused && typeof lastFocused.focus === 'function') setTimeout(() => lastFocused.focus(), 0);
  }

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target && (target.matches('#empresa-modal [data-close]') || target.classList.contains('modal-backdrop'))) {
      closeEmpresaModal();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    setYear();
    syncHeaderOffset();
    initHeaderScrollState();
    splitHeroTitle();
    initSmoothScroll();
    initScrollReveal();
    initNavSpy();
    initScrollCue();
    initProgramTabs();
    initExpositoresMap();
    syncExpositoresHeight();
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

  function initHeaderScrollState(){
    const header = document.querySelector('.site-header');
    if(!header) return;
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
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
        entries.forEach(entry => { if (entry.isIntersecting){ setActive(`#${entry.target.id}`); } });
      }, opts);
      sections.forEach(s => io.observe(s));
    } else {
      function onScroll(){
        let best = sections[0];
        const fromTop = window.scrollY + (window.innerHeight * 0.4);
        for (const s of sections){ if (s.offsetTop <= fromTop) best = s; }
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

  // Delegation for expositores
  document.addEventListener('click', (e) => {
    const el = e.target.closest('#expositores .stand, #expositores .expositores-list li');
    if (el) {
      const n = el.dataset.stand;
      if (n) openEmpresaModal(n);
    }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.closest('#expositores .stand, #expositores .expositores-list li')) {
      const el = e.target.closest('#expositores .stand, #expositores .expositores-list li');
      const n = el && el.dataset.stand;
      if (n){ e.preventDefault(); openEmpresaModal(n); }
    }
  });

  // Expositores helpers
  window.syncExpositoresHeight = function(){
    const map = document.querySelector('#expositores .stand-map');
    if (!map) return;
    const apply = () => {
      const h = map.offsetHeight;
      document.documentElement.style.setProperty('--expo-map-h', h ? h + 'px' : 'auto');
    };
    apply();
    window.addEventListener('resize', apply, { passive: true });
  }

  window.initExpositoresMap = function(){
    const map = document.querySelector('#expositores .stand-map');
    const list = document.querySelector('#expositores .expositores-list');
    if (!map || !list) return;

    const stands = Array.from(map.querySelectorAll('.stand'));
    const items  = Array.from(list.querySelectorAll('li'));

    function highlight(n, on){
      stands.filter(s => s.dataset.stand === n).forEach(s => s.classList.toggle('is-highlighted', on));
      items.filter(li => li.dataset.stand === n).forEach(li => li.classList.toggle('is-highlighted', on));
    }

    function wire(el, n){
      ['mouseenter','focus'].forEach(evt => el.addEventListener(evt, () => highlight(n, true)));
      ['mouseleave','blur'].forEach(evt => el.addEventListener(evt, () => highlight(n, false)));
    }

    stands.forEach(s => wire(s, s.dataset.stand));
    items.forEach(li => wire(li, li.dataset.stand));

    function makeClickable(el, n){
      el.setAttribute('role', 'button');
      if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      el.addEventListener('click', () => openEmpresaModal(n));
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openEmpresaModal(n); }
      });
    }
    stands.forEach(s => makeClickable(s, s.dataset.stand));
    items.forEach(li => makeClickable(li, li.dataset.stand));
  }
})();