/* Decorative consent prompt only: no analytics APIs are called here. */
(function () {
  const STORAGE_KEY = 'samuel-cookie-banner-choice';
  const previewMode = new URLSearchParams(window.location.search).get('cookie-preview') === '1';
  let hasChoice = false;

  try { hasChoice = !previewMode && Boolean(window.localStorage.getItem(STORAGE_KEY)); }
  catch (_) { /* Storage can be unavailable; the prompt still works. */ }

  if (hasChoice) return;

  function mountBanner() {
    if (document.querySelector('.cookie-banner')) return;

    const banner = document.createElement('section');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    banner.setAttribute('aria-describedby', 'cookie-banner-description');
    banner.innerHTML = `
      <div class="cookie-banner__eyes" aria-hidden="true">
        <div class="cookie-banner__eyes-rig">
          <img class="cookie-banner__eyes-base" src="images/cases/watching-eyes-base.png" alt="" width="1254" height="1254">
          <span class="cookie-banner__pupil cookie-banner__pupil--left"></span>
          <span class="cookie-banner__pupil cookie-banner__pupil--right"></span>
        </div>
      </div>
      <div class="cookie-banner__content">
        <p class="cookie-banner__title" id="cookie-banner-title">Mind if I watch?</p>
        <p class="cookie-banner__body" id="cookie-banner-description">I use anonymous analytics, heatmaps and session recordings to understand what works and what needs fixing on this site.</p>
        <div class="cookie-banner__actions">
          <button class="cookie-banner__button cookie-banner__button--primary" type="button" data-cookie-choice="allow">Allow analytics</button>
          <button class="cookie-banner__button cookie-banner__button--secondary" type="button" data-cookie-choice="decline">No thanks</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rig = banner.querySelector('.cookie-banner__eyes-rig');
    const pupils = [...banner.querySelectorAll('.cookie-banner__pupil')];
    const actions = [...banner.querySelectorAll('[data-cookie-choice]')];
    let removePointerTracking = function () {};

    if (window.gsap) {
      gsap.set(banner, { autoAlpha: 0, y: 28, scale: .98 });
      gsap.to(banner, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: reduceMotion ? 0 : .72,
        delay: reduceMotion ? 0 : .18,
        ease: 'power3.out',
        clearProps: 'transform',
      });

      if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        const pupilX = pupils.map((pupil) => gsap.quickTo(pupil, 'x', { duration: .42, ease: 'power3.out' }));
        const pupilY = pupils.map((pupil) => gsap.quickTo(pupil, 'y', { duration: .42, ease: 'power3.out' }));
        const rigMoveX = gsap.quickTo(rig, 'x', { duration: .62, ease: 'power3.out' });
        const rigMoveY = gsap.quickTo(rig, 'y', { duration: .62, ease: 'power3.out' });
        const rigX = gsap.quickTo(rig, 'rotationY', { duration: .7, ease: 'power3.out' });
        const rigY = gsap.quickTo(rig, 'rotationX', { duration: .7, ease: 'power3.out' });
        let eyeCenter = { x: 0, y: 0 };

        const measureEyes = () => {
          const rect = rig.getBoundingClientRect();
          eyeCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        };
        measureEyes();
        const measureAfterEnter = window.setTimeout(measureEyes, 1000);
        window.addEventListener('resize', measureEyes, { passive: true });

        const trackPointer = (event) => {
          const dx = event.clientX - eyeCenter.x;
          const dy = event.clientY - eyeCenter.y;
          const length = Math.max(1, Math.hypot(dx, dy));
          const reach = Math.min(1, length / 90);

          pupils.forEach((_, index) => {
            pupilX[index]((dx / length) * 7 * reach);
            pupilY[index]((dy / length) * 10 * reach);
          });

          const nx = Math.max(-1, Math.min(1, dx / (window.innerWidth * .42)));
          const ny = Math.max(-1, Math.min(1, dy / (window.innerHeight * .42)));
          rigMoveX((dx / length) * 7 * reach);
          rigMoveY((dy / length) * 6 * reach);
          rigX(nx * 5);
          rigY(ny * -4);
        };

        window.addEventListener('pointermove', trackPointer, { passive: true });
        removePointerTracking = () => {
          window.clearTimeout(measureAfterEnter);
          window.removeEventListener('pointermove', trackPointer);
          window.removeEventListener('resize', measureEyes);
        };
      }
    } else {
      banner.style.visibility = 'visible';
    }

    const dismiss = (choice) => {
      actions.forEach((button) => { button.disabled = true; });
      removePointerTracking();

      try {
        if (!previewMode) window.localStorage.setItem(STORAGE_KEY, choice);
      }
      catch (_) { /* Dismiss for this page even when storage is blocked. */ }

      if (!window.gsap || reduceMotion) {
        banner.remove();
        return;
      }

      gsap.to(banner, {
        autoAlpha: 0,
        y: 20,
        scale: .98,
        duration: .34,
        ease: 'power2.in',
        onComplete: () => banner.remove(),
      });
    };

    actions.forEach((button) => {
      button.addEventListener('click', () => dismiss(button.dataset.cookieChoice));
    });
  }

  if (document.readyState === 'complete') mountBanner();
  else window.addEventListener('load', mountBanner, { once: true });
})();
