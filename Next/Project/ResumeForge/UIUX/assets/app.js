// ResumeForge UI/UX reference — shared JS: theme toggle, streaming demo, command palette, drawer.
(function () {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Theme (dark default, persisted) ----
  const saved = localStorage.getItem('rf-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rf-theme', next);
  }

  // ---- Streaming demo (token-by-token append with rAF, Stop preserves partial) ----
  // Mirrors the SSE behaviour spec'd in plan/13-AI-Features.md.
  function initStreamingDemo(root) {
    const out = root.querySelector('[data-stream-out]');
    const startBtn = root.querySelector('[data-stream-start]');
    const stopBtn = root.querySelector('[data-stream-stop]');
    const acceptBtn = root.querySelector('[data-stream-accept]');
    if (!out || !startBtn) return;

    const SCRIPT = (out.getAttribute('data-script') ||
      'Senior Frontend Engineer with 6+ years building micro-frontend platforms in React and TypeScript, ' +
      'specializing in streaming AI interfaces, performance budgets, and accessible design systems.').split(/(\s+)/);
    let i = 0, running = false, rafId = null, queue = [];

    function caret(on) {
      let c = out.querySelector('.rf-caret');
      if (on && !c) { c = document.createElement('span'); c.className = 'rf-caret'; c.setAttribute('aria-hidden', 'true'); out.appendChild(c); }
      if (!on && c) c.remove();
    }
    function flush() {
      if (!running) return;
      if (queue.length) {
        const c = out.querySelector('.rf-caret');
        const node = document.createTextNode(queue.shift());
        c ? out.insertBefore(node, c) : out.appendChild(node);
      }
      if (i < SCRIPT.length) { queue.push(SCRIPT[i++]); rafId = requestAnimationFrame(flush); }
      else finish();
    }
    function start() {
      out.textContent = ''; i = 0; queue = []; running = true;
      caret(true);
      startBtn.disabled = true; if (stopBtn) stopBtn.hidden = false;
      if (acceptBtn) acceptBtn.hidden = true;
      if (reduceMotion) { out.textContent = SCRIPT.join(''); finish(); return; }
      rafId = requestAnimationFrame(flush);
    }
    function stop() { running = false; cancelAnimationFrame(rafId); finish(); } // partial text kept
    function finish() {
      running = false; cancelAnimationFrame(rafId); caret(false);
      startBtn.disabled = false; if (stopBtn) stopBtn.hidden = true;
      if (acceptBtn && out.textContent.trim()) acceptBtn.hidden = false;
    }
    startBtn.addEventListener('click', start);
    stopBtn && stopBtn.addEventListener('click', stop);
    acceptBtn && acceptBtn.addEventListener('click', () => {
      acceptBtn.hidden = true;
      const note = root.querySelector('[data-stream-note]');
      if (note) { note.textContent = 'Applied to resume (undoable) · ATS score +6'; note.hidden = false; }
    });
  }

  // ---- Command palette (Ctrl/Cmd+K) with focus trap + restore ----
  function initCmdK() {
    const backdrop = document.getElementById('rf-cmdk');
    if (!backdrop) return;
    const input = backdrop.querySelector('input');
    let lastFocus = null;
    function open() { lastFocus = document.activeElement; backdrop.setAttribute('open', ''); input.value = ''; input.focus(); }
    function close() { backdrop.removeAttribute('open'); lastFocus && lastFocus.focus(); }
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); backdrop.hasAttribute('open') ? close() : open(); }
      if (e.key === 'Escape' && backdrop.hasAttribute('open')) close();
    });
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  }

  // ---- RTL toggle (Arabic preview) ----
  function toggleRTL() {
    const el = document.documentElement;
    const rtl = el.getAttribute('dir') === 'rtl';
    el.setAttribute('dir', rtl ? 'ltr' : 'rtl');
    el.setAttribute('lang', rtl ? 'en' : 'ar');
  }

  // ---- Wire up on load ----
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.addEventListener('click', toggleTheme));
    document.querySelectorAll('[data-rtl-toggle]').forEach((b) => b.addEventListener('click', toggleRTL));
    document.querySelectorAll('[data-streaming-demo]').forEach(initStreamingDemo);
    initCmdK();
  });
})();

