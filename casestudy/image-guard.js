// Casual deterrent only — removes easy right-click-save / drag-save / Ctrl+S.
// This cannot stop a determined visitor (view-source, devtools, disabling JS)
// and cannot block screenshots or screen recording; no website can.
(function () {
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (k === 's' || k === 'p')) e.preventDefault();
  });
})();
