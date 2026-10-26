const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
const nodes = [...document.querySelectorAll('[data-project-node]')];

const setFolder = (folder) => {
  tabs.forEach((tab) => {
    const selected = tab.dataset.folderTab === folder;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    tab.classList.toggle('active', selected);
  });

  panels.forEach((panel) => {
    panel.hidden = panel.dataset.folderPanel !== folder;
  });
};

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setFolder(tab.dataset.folderTab));
  tab.addEventListener('keydown', (event) => {
    const key = event.key;
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(key)) return;
    event.preventDefault();
    const nextIndex = key === 'Home' ? 0 : key === 'End' ? tabs.length - 1 : (index + (key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    setFolder(tabs[nextIndex].dataset.folderTab);
  });
});

if (tabs[0]) setFolder(tabs[0].dataset.folderTab);

nodes.forEach((node) => {
  node.addEventListener('click', () => {
    nodes.forEach((item) => {
      const selected = item === node;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    const detail = document.querySelector(`[data-project-detail="${node.dataset.projectNode}"]`);
    document.querySelectorAll('[data-project-detail]').forEach((item) => {
      item.hidden = item !== detail;
      item.classList.toggle('is-active', item === detail);
    });

    const stage = node.closest('.pulse-console')?.querySelector('.pulse-stage');
    const status = stage?.querySelector('[data-stage-status]');
    const year = stage?.querySelector('[data-stage-year]');
    const caption = stage?.querySelector('[data-stage-caption]');
    const artwork = stage?.querySelector('.procedural-art');
    if (status) status.textContent = node.dataset.status ?? '';
    if (year) year.textContent = node.dataset.year ?? '';
    if (caption) caption.textContent = `${node.dataset.category ?? 'project signal'} · selected signal`;
    if (artwork && node.dataset.accent) {
      artwork.classList.remove('blue', 'violet', 'rose', 'amber', 'teal', 'gold');
      artwork.classList.add(node.dataset.accent);
    }
    stage?.querySelectorAll('[data-rhythm]').forEach((rhythm) => {
      rhythm.classList.toggle('is-focused', rhythm.dataset.rhythm === node.dataset.projectNode);
    });

  });
});
