(() => {
  const videos = [...document.querySelectorAll('.js-autoplay-video')];
  if (!videos.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const loadVideo = (video) => {
    if (video.dataset.loaded) return;

    video.querySelectorAll('source[data-src]').forEach((source) => {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });
    video.dataset.loaded = 'true';
    video.load();
  };

  const playVideo = (video) => {
    loadVideo(video);
    video.play().catch(() => {
      // The poster remains visible if a browser blocks autoplay.
    });
  };

  if (reducedMotion.matches) return;

  if (!('IntersectionObserver' in window)) {
    videos.forEach(playVideo);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) playVideo(entry.target);
      else if (!entry.target.paused) entry.target.pause();
    });
  }, { rootMargin: '240px 0px', threshold: 0.01 });

  videos.forEach((video) => observer.observe(video));
})();
