// Injects the shared "About" modal and wires it to any element with [data-open-about].
(function () {
  const overlay = document.createElement('div');
  overlay.className = 'about-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'About Samuel Eluyera');
  overlay.innerHTML = `
    <div class="about-modal">
      <div class="about-head">
        <h2>About</h2>
        <button class="about-close" type="button" aria-label="Close">
          <img src="images/cases/icon-x.svg" alt="" width="20" height="20">
        </button>
      </div>
      <div class="about-body">
        <div class="about-portrait-col">
          <img class="about-portrait" src="images/cases/about-portrait.webp" alt="Samuel Eluyera">
        </div>
        <div class="about-copy">
          <div class="about-section">
            <h3>How I Got Here</h3>
            <p>I've spent most of my career in design agencies, working across 100+ projects for 56 companies. Moving between industries taught me to learn unfamiliar businesses quickly and spot patterns in complex products.</p>
            <p>I've been designing for 10 years and moved fully into product design in 2019. Since then, I've taken 15+ products from idea to launch as the sole product designer, contributing to products used by 2M+ people and generating millions in revenue.</p>
          </div>
          <div class="about-section">
            <h3>The Work I Take</h3>
            <p>I like messy workflows, tight deadlines, and products where understanding the business matters as much as designing the interface.</p>
            <p>Give me a problem without a neat brief. That's usually where I do my best work.</p>
          </div>
          <div class="about-section">
            <h3>Outside Client Work</h3>
            <p>I'm usually building something with friends. Most ideas fail. A few make it into the world. I'm still hoping one becomes the company I spend the next decade building.</p>
          </div>
          <div class="about-section">
            <h3>What's Next</h3>
            <p>I'd take a complex workflow over a landing page any day.</p>
            <p>The next chapter is spending longer with one team, solving one problem, and staying close to the product well beyond launch.</p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  function open() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-about]').forEach((el) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => { e.preventDefault(); open(); });
  });
  overlay.querySelector('.about-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
