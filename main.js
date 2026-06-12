/* ============================================================
   DecodeLabs — main.js
   Minimal JS for: mobile nav, active link highlight, scroll effects.
   No frameworks. Vanilla JS only.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── MOBILE NAV TOGGLE ────────────────────────────────────── */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('nav-links--open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close nav when a link is clicked */
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('nav-links--open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── HEADER SCROLL SHADOW ─────────────────────────────────── */
  var header = document.querySelector('.site-header');

  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 32px rgba(0,0,0,0.5)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  /* ── ACTIVE NAV LINK ON SCROLL ────────────────────────────── */
  var sections = document.querySelectorAll('section[id], footer[id]');
  var navLinkEls = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

  var observerOptions = {
    root: null,
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  };

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinkEls.forEach(function (link) {
          link.classList.remove('nav-link--active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('nav-link--active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* ── FADE-IN ON SCROLL ────────────────────────────────────── */
  var revealEls = document.querySelectorAll(
    '.concept-card, .project-card, .checklist-item, .pillar, .stat-card'
  );

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, index) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    revealObserver.observe(el);
  });

});
