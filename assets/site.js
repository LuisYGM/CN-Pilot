const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');

if (menuButton && navigation) {
  const icon = menuButton.querySelector('span');
  const closeMenu = ({ restoreFocus = false } = {}) => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    if (icon) icon.textContent = '＋';
    navigation.classList.remove('is-open');
    if (restoreFocus) menuButton.focus();
  };
  menuButton.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.setAttribute('aria-label', willOpen ? 'Cerrar menú' : 'Abrir menú');
    if (icon) icon.textContent = willOpen ? '−' : '＋';
    navigation.classList.toggle('is-open', willOpen);
    if (willOpen) navigation.querySelector('a')?.focus();
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu({ restoreFocus: true });
    }
  });
  document.addEventListener('click', (event) => {
    if (menuButton.getAttribute('aria-expanded') === 'true' &&
        !navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', () => closeMenu());
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');
  const hero = document.querySelector('.hero');
  const routePulse = document.querySelector('.route-pulse');
  if (hero && routePulse) {
    const routeObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        routePulse.classList.add('is-animating');
        routePulse.addEventListener('animationend', () => routePulse.classList.remove('is-animating'), { once: true });
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    routeObserver.observe(hero);
  }
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.intro, .workflow, .human-first, .journey, .modes, .compat, .start, .architecture, .transparency, .closing').forEach((section) => {
    section.dataset.reveal = '';
    revealObserver.observe(section);
  });
}
