// Cross-page fade. Fade-in is handled declaratively by the `pageFadeIn` CSS
// animation (case-study.css / index.html) — this script only fades the page
// out before following an internal link, so the transition feels intentional
// instead of an abrupt browser navigation.
(function () {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    if (/^(https?:|mailto:|tel:)/i.test(href)) return;

    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(() => { window.location.href = href; }, 180);
  });
})();
