// Shared UI behaviors for the NexusDesk static reference site.
(function () {
  const KEY = 'nd-theme';
  const root = document.documentElement;
  const saved = localStorage.getItem(KEY) || 'dark';
  root.setAttribute('data-theme', saved);

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const action = t.getAttribute('data-action');

    if (action === 'toggle-theme') {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(KEY, next);
    }

    if (action === 'stream-suggest') {
      const target = document.getElementById(t.dataset.target);
      const stopBtn = document.getElementById('stop-stream');
      if (!target) return;
      target.classList.add('stream-caret');
      target.textContent = '';
      const draft = "Hi Aisha, thanks for reaching out! I've checked your order #A-2941 and it shipped this morning via DHL. You should receive tracking updates shortly. Let me know if there's anything else I can help with.";
      let i = 0;
      const timer = setInterval(() => {
        if (i >= draft.length || target.dataset.cancelled === '1') {
          clearInterval(timer);
          target.classList.remove('stream-caret');
          if (target.dataset.cancelled === '1') target.dataset.cancelled = '0';
          if (stopBtn) stopBtn.setAttribute('disabled', '');
          return;
        }
        target.textContent += draft[i++];
      }, 18);
      if (stopBtn) {
        stopBtn.removeAttribute('disabled');
        stopBtn.onclick = () => { target.dataset.cancelled = '1'; };
      }
    }

    if (action === 'open-drawer') {
      const d = document.getElementById(t.dataset.target);
      d && d.classList.remove('hidden');
    }
    if (action === 'close-drawer') {
      const d = e.target.closest('[data-drawer]');
      d && d.classList.add('hidden');
    }

    if (action === 'open-palette') {
      const p = document.getElementById('cmdk');
      p && p.classList.remove('hidden');
      p && p.querySelector('input')?.focus();
    }
    if (action === 'close-palette') {
      document.getElementById('cmdk')?.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      document.getElementById('cmdk')?.classList.remove('hidden');
      document.getElementById('cmdk')?.querySelector('input')?.focus();
    }
    if (e.key === 'Escape') document.getElementById('cmdk')?.classList.add('hidden');
  });
})();
