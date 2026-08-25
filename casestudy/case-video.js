(() => {
  const videos = [...document.querySelectorAll('.js-autoplay-video')];
  if (!videos.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const suspendedAt = new WeakMap();

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

    const pausedAt = suspendedAt.get(video);
    if (pausedAt && Number.isFinite(video.duration) && video.duration > 0) {
      const elapsed = (performance.now() - pausedAt) / 1000;
      video.currentTime = (video.currentTime + elapsed) % video.duration;
      suspendedAt.delete(video);
    }

    video.play().catch(() => {
      // The poster remains visible if a browser blocks autoplay.
    });
  };

  const suspendVideo = (video) => {
    if (!video.dataset.loaded || suspendedAt.has(video)) return;

    suspendedAt.set(video, performance.now());
    if (!video.paused) video.pause();
  };

  if (reducedMotion.matches) return;

  if (!('IntersectionObserver' in window)) {
    videos.forEach(playVideo);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) playVideo(entry.target);
      else suspendVideo(entry.target);
    });
  }, { rootMargin: '480px 0px', threshold: 0.01 });

  videos.forEach((video) => observer.observe(video));
})();
