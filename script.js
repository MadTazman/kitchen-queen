/* ==========================
   Kitchen Queen - script.js
   ==========================
   - Mobile nav toggle
   - Close mobile nav on link click
   - Sticky navbar shadow toggle on scroll
   - Close mobile nav on outside click / escape key
   - Scroll reveal using IntersectionObserver
*/

/* Helpers */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = $('#hamburger');
  const navLinks = $('#navLinks');
  const navbar = document.querySelector('.navbar');

  // Accessibility: set attributes if hamburger exists
  if (hamburger && navLinks) {
    hamburger.setAttribute('aria-controls', 'navLinks');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');

    hamburger.addEventListener('click', (e) => {
      const isOpen = navLinks.classList.toggle('show');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      // prevent body scroll when menu open on small screens
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close the mobile menu when a nav link is clicked
    navLinks.addEventListener('click', (e) => {
      const target = e.target;
      if (target.tagName === 'A' && navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Add shadow/background change when scrolling
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 12) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Smooth in-page anchor scrolling fallback for older browsers
  // (modern browsers use CSS scroll-behavior)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // update URL hash without jumping
          history.pushState(null, '', href);
        }
      }
    });
  });

  // ================
  // Scroll reveal (IntersectionObserver)
  // ================
  const revealElements = $$('.reveal');
  if ('IntersectionObserver' in window && revealElements.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // optional: unobserve after reveal
          io.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -8% 0px', // trigger slightly before element fully in view
      threshold: 0.12
    });

    revealElements.forEach(el => io.observe(el));
  } else {
    // Fallback: simply make them visible
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // Optional: close mobile nav on window resize to ensure consistent state
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (navLinks && window.innerWidth > 768) {
        // ensure menu shown state reset
        navLinks.classList.remove('show');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }, 150);
  });
});
