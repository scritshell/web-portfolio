(function () {
  'use strict';

  const links = Array.from(document.querySelectorAll('.sidebar-link'));
  if (!links.length) return;

  const sections = links
    .map((link) => ({ link, el: document.getElementById(link.dataset.target) }))
    .filter((s) => s.el);

  function setActive(id) {
    links.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.target === id);
    });
  }

  links.forEach(({ dataset }, i) => {
    sections[i]?.link.addEventListener('click', () => {
      const target = sections[i].el;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { threshold: 0, rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach((s) => observer.observe(s.el));
  setActive(sections[0].el.id);
})();
