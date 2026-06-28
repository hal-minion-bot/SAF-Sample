/**
 * nav-mobile.js — Senior Accessibility Enhancements
 * Seniors Aging Forward · 2026
 *
 * Provides:
 *   1. Skip-to-main-content link (keyboard / screen reader)
 *   2. ARIA labels on nav landmark
 *   3. Mobile hamburger menu with full keyboard support
 *   4. Escape key closes menu, focus returns to trigger
 *
 * Icons: Phosphor Icons (MIT) via icons.js sprite.
 *   Open state  → ph-list  (three horizontal bars)
 *   Close state → ph-x     (diagonal cross)
 */
(function () {
  'use strict';

  /* ── Phosphor icon SVG strings (embedded for reliability) ── */
  var ICON_LIST = '<svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false">' +
    '<path d="M228,128a12,12,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12,12,0,0,1,228,128Z' +
    'M40,76H216a12,12,0,0,0,0-24H40a12,12,0,0,0,0,24Z' +
    'M216,180H40a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Z"/>' +
    '</svg>';
  var ICON_X = '<svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false">' +
    '<path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,' +
    '47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"/>' +
    '</svg>';

  /* ────────────────────────────────────────────────────────
     1. SKIP TO MAIN CONTENT
  ──────────────────────────────────────────────────────── */
  var skip = document.createElement('a');
  skip.href = '#main-content';
  skip.className = 'skip-to-main';
  skip.textContent = 'Skip to main content';
  document.body.insertBefore(skip, document.body.firstChild);

  // Tag the first major content block as the skip target
  var target = document.querySelector(
    '.hero, .page-hero, section, main, [role="main"]'
  );
  if (target && !target.id) {
    target.id = 'main-content';
    target.setAttribute('tabindex', '-1');
  }

  /* ────────────────────────────────────────────────────────
     2. ARIA LANDMARKS
  ──────────────────────────────────────────────────────── */
  var navEl = document.querySelector('nav');
  if (navEl) {
    if (!navEl.getAttribute('aria-label')) {
      navEl.setAttribute('aria-label', 'Main navigation');
    }
    navEl.setAttribute('role', 'navigation');
  }

  /* ────────────────────────────────────────────────────────
     3. MOBILE HAMBURGER MENU
  ──────────────────────────────────────────────────────── */
  var navLinks = document.querySelector('.nav-links');

  if (navEl && navLinks) {
    navLinks.id = navLinks.id || 'main-nav-list';

    // Build button
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-hamburger';
    btn.setAttribute('aria-label', 'Open navigation menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', navLinks.id);
    btn.innerHTML = ICON_LIST;
    navEl.appendChild(btn);

    function openMenu() {
      navLinks.classList.add('nav-open');
      document.body.classList.add('nav-menu-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Close navigation menu');
      btn.innerHTML = ICON_X;
      var firstLink = navLinks.querySelector('a');
      if (firstLink) firstLink.focus();
    }

    function closeMenu() {
      navLinks.classList.remove('nav-open');
      document.body.classList.remove('nav-menu-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open navigation menu');
      btn.innerHTML = ICON_LIST;
    }

    btn.addEventListener('click', function () {
      navLinks.classList.contains('nav-open') ? closeMenu() : openMenu();
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navEl.contains(e.target) && navLinks.classList.contains('nav-open')) {
        closeMenu();
      }
    });

    // Close on Escape key — return focus to button
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('nav-open')) {
        closeMenu();
        btn.focus();
      }
    });

    // Close automatically when a menu link is activated on mobile
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 640) closeMenu();
      });
    });
  }

})();
