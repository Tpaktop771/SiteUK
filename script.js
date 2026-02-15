const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealElements = document.querySelectorAll('.reveal, .stagger-grid');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px',
  }
);

revealElements.forEach((element) => observer.observe(element));

const nextField = document.querySelector('input[name="_next"]');
if (nextField) {
  const basePath = window.location.pathname.replace(/\/[^/]*$/, '/');
  nextField.value = `${window.location.origin}${basePath}thanks.html`;
}

const policyModal = document.getElementById('policy-modal');
const policyOpenLinks = document.querySelectorAll('.js-open-policy');
const policyCloseButtons = document.querySelectorAll('[data-close-policy]');
let lastFocusedElement = null;

if (policyModal) {
  const closePolicyModal = () => {
    policyModal.classList.remove('open');
    policyModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  const openPolicyModal = (event) => {
    event.preventDefault();
    lastFocusedElement = document.activeElement;
    policyModal.classList.add('open');
    policyModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const closeButton = policyModal.querySelector('.policy-modal-close');
    if (closeButton instanceof HTMLElement) {
      closeButton.focus();
    }
  };

  policyOpenLinks.forEach((link) => {
    link.addEventListener('click', openPolicyModal);
  });

  policyCloseButtons.forEach((button) => {
    button.addEventListener('click', closePolicyModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && policyModal.classList.contains('open')) {
      closePolicyModal();
    }
  });
}
