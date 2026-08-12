// Fullscreen viewer for case-study body images — click any image to open it,
// then step through every other image in the case study from there.
(function () {
  const imgs = [...document.querySelectorAll('.case-content img')];
  if (!imgs.length) return;

  // Prefer the largest variant so fullscreen stays sharp. currentSrc is not
  // usable here — lazy images below the fold have not resolved one yet.
  const items = imgs.map((img) => ({
    src: img.dataset.full || img.currentSrc || img.src,
    alt: img.alt || '',
  }));
  let current = 0;

  const overlay = document.createElement('div');
  overlay.className = 'viewer-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');
  overlay.innerHTML = `
    <button class="viewer-close" type="button" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button class="viewer-arrow viewer-prev" type="button" aria-label="Previous image">
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15.8333L6.66667 10L12.5 4.16667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="viewer-img-wrap"><img src="" alt=""></div>
    <button class="viewer-arrow viewer-next" type="button" aria-label="Next image">
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15.8333L13.3333 10L7.5 4.16667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="viewer-count"></div>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('.viewer-img-wrap img');
  const countEl = overlay.querySelector('.viewer-count');
  const singleImage = items.length < 2;
  overlay.querySelector('.viewer-prev').style.display = singleImage ? 'none' : '';
  overlay.querySelector('.viewer-next').style.display = singleImage ? 'none' : '';

  function render() {
    const item = items[current];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    countEl.textContent = items.length > 1 ? `${current + 1} / ${items.length}` : '';
  }
  function open(i) {
    current = i;
    render();
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function next() { current = (current + 1) % items.length; render(); }
  function prev() { current = (current - 1 + items.length) % items.length; render(); }

  imgs.forEach((img, i) => {
    img.addEventListener('click', () => open(i));
  });
  overlay.querySelector('.viewer-close').addEventListener('click', close);
  overlay.querySelector('.viewer-next').addEventListener('click', next);
  overlay.querySelector('.viewer-prev').addEventListener('click', prev);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
})();
