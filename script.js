const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const carousel = document.querySelector('#banner-carousel');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'Open main menu' : 'Close main menu');
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open main menu');
    });
  });
}

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const dots = Array.from(document.querySelectorAll('.carousel-dot'));
  const swipeThresholdPx = 50;
  const transitionDurationMs = 700;
  let activeIndex = 0;
  let autoplayId;
  let exitTimeoutId;
  let touchStartX = 0;
  let touchStartY = 0;
  let isTrackingSwipe = false;

  const setActiveSlide = (nextIndex, direction = 'next') => {
    if (nextIndex === activeIndex) {
      return;
    }

    const previousIndex = activeIndex;
    const previousSlide = slides[previousIndex];
    const nextSlide = slides[nextIndex];

    clearTimeout(exitTimeoutId);
    carousel.classList.toggle('is-direction-prev', direction === 'prev');
    carousel.classList.toggle('is-direction-next', direction !== 'prev');

    if (previousSlide) {
      previousSlide.classList.remove('is-active');
      previousSlide.classList.add('is-exiting');
      previousSlide.setAttribute('aria-hidden', 'true');
    }

    if (nextSlide) {
      nextSlide.classList.remove('is-exiting');
      nextSlide.classList.add('is-active');
      nextSlide.setAttribute('aria-hidden', 'false');
    }

    exitTimeoutId = setTimeout(() => {
      slides.forEach((slide, index) => {
        if (index !== activeIndex && index !== previousIndex) {
          slide.classList.remove('is-exiting');
        }

        if (index === previousIndex) {
          slide.classList.remove('is-exiting');
        }
      });
    }, transitionDurationMs);

    slides.forEach((slide, index) => {
      if (index !== nextIndex && index !== activeIndex) {
        slide.classList.remove('is-active', 'is-exiting');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    dots.forEach((dot, index) => {
      const isActive = index === nextIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
      dot.tabIndex = isActive ? 0 : -1;
    });

    activeIndex = nextIndex;
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayId = setInterval(() => {
      const nextIndex = (activeIndex + 1) % slides.length;
      setActiveSlide(nextIndex, 'next');
    }, 3000);
  };

  const stopAutoplay = () => {
    clearInterval(autoplayId);
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const nextIndex = Number(dot.dataset.target);
      if (!Number.isNaN(nextIndex)) {
        const direction = nextIndex > activeIndex ? 'next' : 'prev';
        setActiveSlide(nextIndex, direction);
        startAutoplay();
      }
    });

    dot.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
        return;
      }

      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (activeIndex + direction + dots.length) % dots.length;
      setActiveSlide(nextIndex, direction === 1 ? 'next' : 'prev');
      dots[nextIndex].focus();
      startAutoplay();
    });
  });

  carousel.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) {
      isTrackingSwipe = false;
      return;
    }

    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isTrackingSwipe = true;
    stopAutoplay();
  }, { passive: true });

  carousel.addEventListener('touchend', (event) => {
    if (!isTrackingSwipe || event.changedTouches.length !== 1) {
      startAutoplay();
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    isTrackingSwipe = false;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= swipeThresholdPx) {
      if (deltaX < 0) {
        setActiveSlide((activeIndex + 1) % slides.length, 'next');
      } else {
        setActiveSlide((activeIndex - 1 + slides.length) % slides.length, 'prev');
      }
    }

    startAutoplay();
  }, { passive: true });

  carousel.addEventListener('touchcancel', () => {
    isTrackingSwipe = false;
    startAutoplay();
  }, { passive: true });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.classList.add('is-direction-next');
  startAutoplay();
}

const revealItems = document.querySelectorAll('.reveal');

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((el) => observer.observe(el));
}
