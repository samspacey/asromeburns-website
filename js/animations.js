/* ============================================
   AS ROME BURNS - ANIMATIONS JS
   Scroll animations & interactive effects
   ============================================ */

(function() {
  'use strict';

  // Add JS-enabled class for progressive enhancement
  document.documentElement.classList.add('js-enabled');

  /* --------------------------------------------
     Scroll Animation Observer
     -------------------------------------------- */
  class ScrollAnimator {
    constructor(options = {}) {
      this.threshold = options.threshold || 0.15;
      this.rootMargin = options.rootMargin || '0px 0px -50px 0px';
      this.observer = null;
      this.init();
    }

    init() {
      if (!('IntersectionObserver' in window)) {
        // Fallback: show all elements immediately
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
          el.classList.add('is-visible');
        });
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          threshold: this.threshold,
          rootMargin: this.rootMargin
        }
      );
    }

    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve after animation (one-time animation)
          this.observer.unobserve(entry.target);
        }
      });
    }

    observe(selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (this.observer) {
          this.observer.observe(el);
        }
      });
    }

    // Observe with staggered delays
    observeStaggered(selector, delayIncrement = 100) {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
        el.style.transitionDelay = `${index * delayIncrement}ms`;
        if (this.observer) {
          this.observer.observe(el);
        }
      });
    }
  }

  /* --------------------------------------------
     Navigation Scroll Effect
     -------------------------------------------- */
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    function updateNav() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > scrollThreshold) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }

      lastScroll = currentScroll;
    }

    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateNav();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateNav();
  }

  /* --------------------------------------------
     Split Text Animation
     -------------------------------------------- */
  function splitTextIntoLines(element) {
    if (!element) return;

    const text = element.innerHTML;
    // Split by <br> tags
    const lines = text.split(/<br\s*\/?>/i);

    element.innerHTML = lines.map(line =>
      `<span class="line"><span class="line-inner">${line.trim()}</span></span>`
    ).join('');

    element.classList.add('split-text');
  }

  /* --------------------------------------------
     Player Animation Enhancements
     -------------------------------------------- */
  function initPlayerAnimations() {
    const playBtn = document.querySelector('.player__play-btn');
    const audio = document.querySelector('audio');

    if (!playBtn || !audio) return;

    // Add playing class for pulse animation
    audio.addEventListener('play', () => {
      playBtn.classList.add('is-playing');
    });

    audio.addEventListener('pause', () => {
      playBtn.classList.remove('is-playing');
    });

    audio.addEventListener('ended', () => {
      playBtn.classList.remove('is-playing');
    });
  }

  /* --------------------------------------------
     Initialize All Animations
     -------------------------------------------- */
  function init() {
    const animator = new ScrollAnimator();

    // Initialize nav scroll effect
    initNavScroll();

    // Hero page specific
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
      splitTextIntoLines(heroTitle);
      // Trigger animation after a brief delay
      setTimeout(() => {
        heroTitle.classList.add('is-visible');
      }, 100);
    }

    // Observe scroll animations
    animator.observe('.animate-on-scroll');
    animator.observe('.section__title');
    animator.observe('.band-image');
    animator.observe('.band-text');

    // Staggered animations
    animator.observeStaggered('.social__link', 100);
    animator.observeStaggered('.tracklist__item', 80);
    animator.observeStaggered('.show-card', 100);
    animator.observeStaggered('.streaming-link', 80);

    // Player animations (if on music page)
    initPlayerAnimations();

    // Newsletter section
    const newsletter = document.querySelector('.newsletter');
    if (newsletter) {
      newsletter.classList.add('animate-on-scroll');
      animator.observe('.newsletter');
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
