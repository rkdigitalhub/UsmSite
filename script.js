const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((el) => observer.observe(el));

const accordion = document.querySelector('#accordion');
if (accordion) {
  accordion.addEventListener('toggle', (event) => {
    if (!event.target.open) {
      return;
    }

    accordion.querySelectorAll('details').forEach((item) => {
      if (item !== event.target) {
        item.open = false;
      }
    });
  }, true);
}

if (window.TradingView) {
  // Defer chart rendering until library is loaded and container exists.
  new window.TradingView.widget({
    width: '100%',
    height: 540,
    symbol: 'BITSTAMP:EURUSD',
    interval: 'D',
    timezone: 'Etc/UTC',
    theme: 'dark',
    style: '1',
    locale: 'en',
    toolbar_bg: '#0f152f',
    enable_publishing: false,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    show_popup_button: true,
    details: true,
    popup_width: '1000',
    popup_height: '650',
    container_id: 'tradingview_chart'
  });
}
