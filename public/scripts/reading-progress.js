const progress = document.querySelector('.reading-progress > span');

function updateProgress() {
  if (!progress) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
  progress.style.transform = `scaleX(${ratio})`;
}

updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });
