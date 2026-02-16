const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealElements = document.querySelectorAll('.reveal, .stagger-grid');
const informationList = document.getElementById('information-list');
const worksList = document.getElementById('works-list');

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

const defaultInformation = [
  {
    title: 'Информация обновляется',
    text: 'Добавьте карточки в файл content-data.js, и они появятся в этом разделе.',
  },
];

const defaultWorks = [
  {
    title: 'Раздел работ обновляется',
    description: 'Добавьте карточки в файл content-data.js для отображения выполненных работ.',
    image: 'assets/logo.jpg',
    date: 'Актуально',
  },
];

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const contentData = window.siteContent ?? {};
const informationItems =
  Array.isArray(contentData.information) && contentData.information.length > 0 ? contentData.information : defaultInformation;
const worksItems = Array.isArray(contentData.works) && contentData.works.length > 0 ? contentData.works : defaultWorks;

if (informationList) {
  informationList.innerHTML = informationItems
    .map(
      (item) => `
        <article class="card info-item stagger-item">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `
    )
    .join('');
}

if (worksList) {
  worksList.innerHTML = worksItems
    .map(
      (item) => `
        <article class="card work-item stagger-item">
          <img src="${escapeHtml(item.image || 'assets/logo.jpg')}" alt="${escapeHtml(item.title || 'Выполненные работы')}" loading="lazy" />
          ${item.date ? `<time class="work-meta">${escapeHtml(item.date)}</time>` : ''}
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `
    )
    .join('');
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
