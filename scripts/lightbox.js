/* Lightbox acessível sem dependências */
(() => {
  const gallery = document.querySelector('[data-js="gallery"]');
  if (!gallery) return;

  const links = [...gallery.querySelectorAll('a[data-lightbox]')];
  if (!links.length) return;

  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.hidden = true;
  lb.innerHTML = `
    <div class="lb__dialog" role="dialog" aria-modal="true" aria-label="Imagem em destaque">
      <img class="lb__img" alt="">
      <p class="lb__caption"></p>
      <button class="lb__close" aria-label="Fechar">✕</button>
      <button class="lb__prev" aria-label="Anterior">◀</button>
      <button class="lb__next" aria-label="Seguinte">▶</button>
    </div>
  `;
  document.body.appendChild(lb);

  const img = lb.querySelector('.lb__img');
  const caption = lb.querySelector('.lb__caption');
  const btnClose = lb.querySelector('.lb__close');
  const btnPrev = lb.querySelector('.lb__prev');
  const btnNext = lb.querySelector('.lb__next');

  let idx = 0;
  let lastFocus = null;

  function open(i){
    idx = i;
    const a = links[idx];
    img.src = a.getAttribute('href');
    img.alt = a.dataset.title || a.getAttribute('data-title') || a.querySelector('img')?.alt || '';
    caption.textContent = a.dataset.title || a.getAttribute('data-title') || '';
    lb.hidden = false;
    lastFocus = document.activeElement;
    btnClose.focus();
    document.addEventListener('keydown', onKey);
  }
  function close(){
    lb.hidden = true;
    document.removeEventListener('keydown', onKey);
    if (lastFocus) lastFocus.focus();
  }
  function prev(){ open((idx - 1 + links.length) % links.length); }
  function next(){ open((idx + 1) % links.length); }
  function onKey(e){
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
  }

  links.forEach((a, i) => {
    a.addEventListener('click', (e) => { e.preventDefault(); open(i); });
  });
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
})();
