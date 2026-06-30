/* MenuAmbition — minimal vanilla JS
   - mobile nav toggle (hamburger)
   - reusable Vimeo video modal
   - inert form handlers (contact + newsletter render but never submit)
   - header shadow on scroll
   No frameworks. No dependencies. */
(function () {
  'use strict';

  /* ---------- Mobile nav toggle --------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close the panel after a nav link is tapped
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Header shadow on scroll --------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reusable video modal ------------------------------------ */
  // Build the modal once and reuse it for any [data-video] trigger.
  var modal, frame, closeBtn, lastFocused;

  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Video player');
    modal.innerHTML =
      '<div class="video-modal__dialog">' +
        '<button type="button" class="video-modal__close" aria-label="Close video">&times;</button>' +
        '<div class="video-modal__frame"></div>' +
      '</div>';
    document.body.appendChild(modal);
    frame = modal.querySelector('.video-modal__frame');
    closeBtn = modal.querySelector('.video-modal__close');

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  function openModal(videoId, title) {
    if (!modal) buildModal();
    lastFocused = document.activeElement;
    frame.innerHTML =
      '<iframe src="https://player.vimeo.com/video/' + encodeURIComponent(videoId) +
        '?dnt=1&autoplay=1" ' +
        'allow="autoplay; fullscreen; picture-in-picture" allowfullscreen ' +
        'title="' + (title || 'Video') + '"></iframe>';
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    frame.innerHTML = '';            // stop playback
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  // Wire up any element with data-video="<vimeoId>"
  document.querySelectorAll('[data-video]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(el.getAttribute('data-video'), el.getAttribute('data-video-title') || 'Video');
    });
  });

  // expose for any inline callers / later pages
  window.MA = window.MA || {};
  window.MA.openVideo = openModal;

  /* ---------- Inert forms (no backend by design) ---------------------- */
  document.querySelectorAll('form[data-inert]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();                                  // never submits
      var note = form.querySelector('.form-note, .newsletter-feedback');
      var msg = form.getAttribute('data-inert-msg') ||
                'Thanks! (preview only — signup is not active)';
      if (note) note.textContent = msg;
      // Clear the newsletter field after "subscribing"; leave the contact
      // form's typed content in place so the preview note makes sense.
      if (form.classList.contains('newsletter-form')) form.reset();
    });
  });
})();
