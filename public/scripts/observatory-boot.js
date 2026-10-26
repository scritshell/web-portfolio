const boot = document.getElementById('observatory-boot');
const chrome = document.getElementById('page-chrome');

if (boot && chrome) {
  const progressLabel = document.getElementById('boot-progress-label');
  const progressBar = document.getElementById('boot-progress-bar');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startedAt = performance.now();
  const minimumDuration = reducedMotion ? 80 : 900;
  const maximumDuration = reducedMotion ? 160 : 2200;
  let finished = false;

  const setProgress = (value) => {
    if (progressLabel) progressLabel.textContent = `${value}%`;
    if (progressBar) progressBar.className = `boot-progress-${value}`;
  };

  const finish = () => {
    if (finished) return;
    finished = true;
    const wait = Math.max(0, minimumDuration - (performance.now() - startedAt));
    window.setTimeout(() => {
      setProgress(100);
      chrome.removeAttribute('inert');
      boot.classList.add('is-leaving');
      window.setTimeout(() => boot.classList.add('is-hidden'), reducedMotion ? 40 : 520);
    }, wait);
  };

  try {
    boot.classList.add('is-visible');
    chrome.setAttribute('inert', '');
    const assets = JSON.parse(boot.dataset.bootAssets ?? '[]');
    const loadAsset = (source) => new Promise((resolve) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = resolve;
      image.src = source;
    });
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const timer = window.setTimeout(finish, maximumDuration);

    Promise.all([fontsReady, ...assets.map(loadAsset)]).then(() => {
      window.clearTimeout(timer);
      setProgress(82);
      finish();
    }, finish);
  } catch {
    chrome.removeAttribute('inert');
    boot.classList.remove('is-visible');
  }
}
