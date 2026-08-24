const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const button = contactForm.querySelector('button[type="submit"]');
    button.textContent = 'Mensaje enviado';
    button.disabled = true;
    button.style.opacity = '0.7';
  });
}
