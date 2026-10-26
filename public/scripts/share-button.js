document.querySelectorAll('.share-button').forEach((button) => {
  button.addEventListener('click', async () => {
    const title = button.dataset.shareTitle ?? document.title;
    const url = window.location.href;
    const status = button.parentElement?.querySelector('.share-status');

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      if (status) status.textContent = 'Link copied.';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      if (status) status.textContent = 'Unable to copy the link.';
    }
  });
});
