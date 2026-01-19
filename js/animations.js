/* ============================================
   AS ROME BURNS - ANIMATIONS JS
   Scroll animations, parallax, custom cursor
   ============================================ */

(function() {
  'use strict';

  // Add JS-enabled class for progressive enhancement
  document.documentElement.classList.add('js-enabled');

  /* --------------------------------------------
     Smooth Scroll (Lenis-like)
     -------------------------------------------- */
  class SmoothScroll {
    constructor() {
      this.current = 0;
      this.target = 0;
      this.ease = 0.075;
      this.rafId = null;
      this.init();
    }

    init() {
      // Only enable on desktop with mouse
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.documentElement.classList.add('lenis');
        this.addListeners();
        this.animate();
      }
    }

    addListeners() {
      window.addEventListener('scroll', () => {
        this.target = window.scrollY;
      }, { passive: true });
    }

    animate() {
      this.current += (this.target - this.current) * this.ease;

      // Update parallax elements
      document.querySelectorAll('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = this.current * speed;
        el.style.transform = `translateY(${yPos}px)`;
      });

      this.rafId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
    }
  }

  /* --------------------------------------------
     Scroll Animation Observer
     -------------------------------------------- */
  class ScrollAnimator {
    constructor(options = {}) {
      this.threshold = options.threshold || 0.15;
      this.rootMargin = options.rootMargin || '0px 0px -100px 0px';
      this.observer = null;
      this.init();
    }

    init() {
      if (!('IntersectionObserver' in window)) {
        // Fallback: show all elements immediately
        document.querySelectorAll('.animate-on-scroll, .social__link, .tracklist__item, .show-card, .streaming-link, .section__title, .newsletter, .player, .band-image, .band-text').forEach(el => {
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

    const scrollThreshold = 50;

    function updateNav() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > scrollThreshold) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
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
     Custom Cursor (Desktop only)
     -------------------------------------------- */
  class CustomCursor {
    constructor() {
      this.dot = null;
      this.outline = null;
      this.cursorX = 0;
      this.cursorY = 0;
      this.outlineX = 0;
      this.outlineY = 0;
      this.init();
    }

    init() {
      // Only on desktop with mouse
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      // Create cursor elements
      this.dot = document.createElement('div');
      this.dot.className = 'cursor-dot';
      document.body.appendChild(this.dot);

      this.outline = document.createElement('div');
      this.outline.className = 'cursor-outline';
      document.body.appendChild(this.outline);

      // Track mouse
      document.addEventListener('mousemove', (e) => {
        this.cursorX = e.clientX;
        this.cursorY = e.clientY;
      });

      // Hover effects on interactive elements
      const hoverTargets = document.querySelectorAll('a, button, .btn, .social__link, .tracklist__item');
      hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => this.outline.classList.add('cursor--hover'));
        el.addEventListener('mouseleave', () => this.outline.classList.remove('cursor--hover'));
      });

      this.animate();
    }

    animate() {
      // Dot follows cursor exactly
      this.dot.style.left = `${this.cursorX}px`;
      this.dot.style.top = `${this.cursorY}px`;

      // Outline follows with lag
      this.outlineX += (this.cursorX - this.outlineX) * 0.15;
      this.outlineY += (this.cursorY - this.outlineY) * 0.15;
      this.outline.style.left = `${this.outlineX}px`;
      this.outline.style.top = `${this.outlineY}px`;

      requestAnimationFrame(() => this.animate());
    }
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
     Magnetic Buttons (Desktop)
     -------------------------------------------- */
  function initMagneticButtons() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.querySelectorAll('.btn--magnetic, .btn--filled').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* --------------------------------------------
     Parallax on Scroll
     -------------------------------------------- */
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    function updateParallax() {
      const scrollY = window.pageYOffset;

      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const elementVisible = scrollY + window.innerHeight > elementTop;

        if (elementVisible) {
          const yPos = (scrollY - elementTop) * speed;
          el.style.transform = `translateY(${yPos}px)`;
        }
      });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* --------------------------------------------
     Tilt Effect on Cards
     -------------------------------------------- */
  function initTiltEffect() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.querySelectorAll('.show-card, .streaming-link').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.01)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* --------------------------------------------
     Hero Spotlight + Wiggle Effect
     -------------------------------------------- */
  function initHeroSpotlight() {
    const videoContainer = document.getElementById('heroVideoContainer');
    const spotlight = document.getElementById('heroSpotlight');
    const video = videoContainer?.querySelector('video');

    if (!videoContainer || !spotlight) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    videoContainer.addEventListener('mousemove', (e) => {
      const rect = videoContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spotlight follows cursor
      spotlight.style.left = `${x}px`;
      spotlight.style.top = `${y}px`;

      // Calculate mouse position relative to center (-1 to 1)
      mouseX = (x / rect.width - 0.5) * 2;
      mouseY = (y / rect.height - 0.5) * 2;
    });

    videoContainer.addEventListener('mouseleave', () => {
      mouseX = 0;
      mouseY = 0;
    });

    // Store current scale for combining with wiggle
    videoContainer.currentScale = 1.8;

    // Smooth wiggle animation
    function animateWiggle() {
      // Ease towards target
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      if (video) {
        // Subtle rotation and translation based on mouse
        const rotateY = currentX * 4; // Max 4 degrees
        const rotateX = -currentY * 3; // Max 3 degrees
        const translateX = currentX * 15; // Max 15px
        const translateY = currentY * 12; // Max 12px
        const scale = videoContainer.currentScale || 1.8;

        video.style.transform = `
          perspective(1000px)
          rotateY(${rotateY}deg)
          rotateX(${rotateX}deg)
          translateX(${translateX}px)
          translateY(${translateY}px)
          scale(${scale})
        `;
      }

      requestAnimationFrame(animateWiggle);
    }

    // Only enable wiggle on desktop
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      animateWiggle();
    }
  }

  /* --------------------------------------------
     Hero Scroll Animation (Video zooms out, text appears)
     -------------------------------------------- */
  function initHeroScrollAnimation() {
    const heroScroll = document.getElementById('heroScroll');
    const videoContainer = document.getElementById('heroVideoContainer');
    const videoContent = document.getElementById('heroVideoContent');
    const heroText = document.getElementById('heroText');

    if (!heroScroll || !videoContainer || !heroText) return;

    // Check if on mobile
    const isMobile = window.innerWidth <= 900;

    function updateHeroScroll() {
      const rect = heroScroll.getBoundingClientRect();
      const scrollProgress = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight)));

      if (isMobile) {
        // Mobile: Video shrinks and moves up, text appears below
        const scale = 1 - (scrollProgress * 0.3); // Scale from 1 to 0.7
        const translateY = scrollProgress * -20; // Move up

        videoContainer.style.transform = `scale(${scale}) translateY(${translateY}%)`;
        videoContainer.style.width = '100%';
        videoContainer.style.height = `${100 - scrollProgress * 40}%`;
        videoContainer.style.borderRadius = `${scrollProgress * 20}px`;
        videoContainer.style.top = '0';
        videoContainer.style.left = '0';

      } else {
        // Desktop: Container shrinks and moves to left
        const width = 100 - (scrollProgress * 65); // Shrink width from 100% to 35%
        const height = 100 - (scrollProgress * 10); // Keep height mostly tall
        const borderRadius = scrollProgress * 24; // Add border radius
        const left = scrollProgress * 5; // Move left

        videoContainer.style.width = `${width}%`;
        videoContainer.style.height = `${height}%`;
        videoContainer.style.left = `${left}%`;
        videoContainer.style.top = `${scrollProgress * 5}%`;
        videoContainer.style.borderRadius = `${borderRadius}px`;

        // Smoothly zoom out video to reveal more of portrait frame
        // Start zoomed in (scale 1.8), end at normal (scale 1.05 for wiggle room)
        const videoScale = 1.8 - (scrollProgress * 0.75);
        videoContainer.currentScale = Math.max(videoScale, 1.05);
      }

      // Fade out video content, fade in text
      if (videoContent) {
        videoContent.style.opacity = 1 - (scrollProgress * 2); // Fade out faster
      }

      // Show text when scrolled enough
      if (scrollProgress > 0.3) {
        heroText.classList.add('is-visible');
      } else {
        heroText.classList.remove('is-visible');
      }
    }

    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateHeroScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial update
    updateHeroScroll();

    // Update on resize
    window.addEventListener('resize', () => {
      updateHeroScroll();
    });
  }

  /* --------------------------------------------
     Initialize All Animations
     -------------------------------------------- */
  function init() {
    const animator = new ScrollAnimator();

    // Initialize smooth scroll (optional - can be heavy)
    // new SmoothScroll();

    // Initialize nav scroll effect
    initNavScroll();

    // Initialize hero spotlight
    initHeroSpotlight();

    // Initialize hero scroll animation
    initHeroScrollAnimation();

    // Initialize custom cursor
    new CustomCursor();

    // Initialize magnetic buttons
    initMagneticButtons();

    // Initialize parallax
    initParallax();

    // Initialize tilt effect
    initTiltEffect();

    // Hero page specific
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
      splitTextIntoLines(heroTitle);
      // Trigger animation after a brief delay
      setTimeout(() => {
        heroTitle.classList.add('is-visible');
      }, 300);
    }

    // Observe scroll animations
    animator.observe('.animate-on-scroll');
    animator.observe('.section__title');
    animator.observe('.band-image');
    animator.observe('.band-text');
    animator.observe('.player');
    animator.observe('.newsletter');

    // Staggered animations
    animator.observeStaggered('.social__link', 100);
    animator.observeStaggered('.tracklist__item', 80);
    animator.observeStaggered('.show-card', 150);
    animator.observeStaggered('.streaming-link', 100);

    // Player animations (if on music page)
    initPlayerAnimations();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
