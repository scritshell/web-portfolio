const enterButton = document.getElementById('enter-btn');
const welcomeOverlay = document.getElementById('welcome-overlay');
const contactForm = document.querySelector('.contact-form');

if (enterButton && welcomeOverlay) {
  enterButton.addEventListener('click', () => {
    const removeWelcomeOverlay = () => {
      welcomeOverlay.remove();
      document.documentElement.classList.remove('welcome-locked');
      document.body.classList.remove('welcome-locked');
    };

    welcomeOverlay.addEventListener('transitionend', removeWelcomeOverlay, { once: true });
    welcomeOverlay.classList.add('hidden');
    setTimeout(removeWelcomeOverlay, 800);
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const button = contactForm.querySelector('button[type="submit"]');
    button.textContent = 'Mensaje enviado';
    button.disabled = true;
    button.style.opacity = '0.7';
  });
}
