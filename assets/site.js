const mobileMenu = document.querySelector('.mobile-nav');

if (mobileMenu) {
  const navigation = mobileMenu.querySelector('nav');
  navigation?.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    mobileMenu.open = false;
  });
}
