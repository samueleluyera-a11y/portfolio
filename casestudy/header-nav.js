/* Auto-hiding site header: slides out while scrolling down, back in on
   scroll-up, and is always shown near the top of the page. Shared by the hub
   and the detail pages. No-ops on any page without a .site-header. */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const root = document.documentElement;
  let lastY = window.scrollY;
  let ticking = false;
  const JITTER = 6;   // ignore sub-pixel / trackpad jitter
  const TOP = 8;      // always reveal within this band of the top

  // When the header is out of view, `.nav-up` lets the sticky rail reclaim its
  // height so no empty band is left behind (see the rail rules in CSS).
  function setHidden(hidden) {
    header.classList.toggle('is-hidden', hidden);
    root.classList.toggle('nav-up', hidden);
  }

  function update() {
    const y = Math.max(0, window.scrollY);
    const dy = y - lastY;

    if (Math.abs(dy) >= JITTER) {
      if (y <= TOP || dy < 0) {
        setHidden(false);   // near top, or scrolling up
      } else if (y > header.offsetHeight) {
        setHidden(true);    // scrolling down, past the bar
      }
      lastY = y;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();
