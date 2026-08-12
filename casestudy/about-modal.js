// Injects the shared "About Me" modal and wires it to any element with [data-open-about].
(function () {
  const overlay = document.createElement('div');
  overlay.className = 'about-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'About Samuel Eluyera');
  overlay.innerHTML = `
    <div class="about-modal">
      <div class="about-head">
        <h2>About Me</h2>
        <button class="about-close" type="button" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L12 12M12 12L6 18M12 12L18 18M12 12L6 6" stroke="#000" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="about-body">
        <img class="about-portrait" src="images/cases/about-portrait.webp" alt="Samuel Eluyera">
        <div class="about-copy">
          <div class="about-bio">
            <p><strong>Most of my career has been spent inside design agencies</strong>, working across 100+ projects for 56 companies. <strong>Every few months meant learning a new business from scratch</strong>. One month it was commercial lending. The next it was clinical AI, defense software, restaurant technology, sports operations, or enterprise finance.</p>
            <p>After enough projects, you start seeing the patterns that make products succeed or fail. People overwhelmed by information. Software that gets in the way of the work it's supposed to support. <strong>Designing across so many industries has given me the product intuition to find those patterns quickly and build workflows that feel obvious to the people using them.</strong></p>
            <p>Over the last 10 years, I've helped take <strong>15+ products from idea to launch</strong> as the sole product designer, contributing to products that now <strong>serve over 2 million users</strong>, and <strong>generate millions in revenue.</strong></p>
            <p>Outside client work, I'm usually building something of my own with friends. Most ideas fail. A few launch. I'm hoping one becomes the company I spend the next decade building.</p>
          </div>
          <div class="about-cols">
            <div>
              <h3>The Work I Take</h3>
              <p>Founders with a vision and no brief. Companies who value success above process. Products where understanding the business matters as much as designing the interface. Messy workflows. Tight deadlines. Problems that resist obvious answers.</p>
            </div>
            <div>
              <h3>What's Next</h3>
              <p>Given the choice, I'll take a messy workflow over a landing page every time. The next chapter is spending longer with one team, solving one problem, and seeing the product through beyond launch.</p>
            </div>
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
