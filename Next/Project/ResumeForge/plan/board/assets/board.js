// ResumeForge Delivery Plan Tracker — rendering, progress persistence, filters, CSV export.
(function () {
  'use strict';
  const DATA = window.PLAN_DATA;
  const STORAGE_KEY = 'resumeforge-plan-progress-v1';
  const progress = loadProgress();

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  }
  function saveProgress() { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }

  function allTasks() {
    return DATA.sprints.flatMap((s) => s.stories.flatMap((st) => st.tasks.map((t) => ({ ...t, storyId: st.id, sprintId: s.id }))));
  }
  function taskDone(taskId) { return !!progress[taskId]; }
  function storyTasksDone(story) { return story.tasks.filter((t) => taskDone(t.id)).length; }
  function storyDone(story) { return storyTasksDone(story) === story.tasks.length; }
  function sprintStats(sprint) {
    const tasks = sprint.stories.flatMap((s) => s.tasks);
    const done = tasks.filter((t) => taskDone(t.id)).length;
    const storiesDone = sprint.stories.filter(storyDone).length;
    const ptsDone = sprint.stories.filter(storyDone).reduce((sum, s) => sum + s.points, 0);
    return { tasksTotal: tasks.length, tasksDone: done, storiesTotal: sprint.stories.length, storiesDone, ptsTotal: sprint.capacityPts, ptsDone };
  }
  function overallStats() {
    const tasks = allTasks();
    const done = tasks.filter((t) => taskDone(t.id)).length;
    const allStories = DATA.sprints.flatMap((s) => s.stories);
    const storiesDone = allStories.filter(storyDone).length;
    const ptsTotal = allStories.reduce((sum, s) => sum + s.points, 0);
    const ptsDone = allStories.filter(storyDone).reduce((sum, s) => sum + s.points, 0);
    return { tasksTotal: tasks.length, tasksDone: done, storiesTotal: allStories.length, storiesDone, ptsTotal, ptsDone };
  }

  function pct(done, total) { return total === 0 ? 0 : Math.round((done / total) * 100); }
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    });
    children.flat().forEach((c) => { if (c != null) node.append(c.nodeType ? c : document.createTextNode(c)); });
    return node;
  }
  function progressBar(donePct) {
    return el('div', { class: 'rf-progressbar' }, el('span', { style: `width:${donePct}%` }));
  }

  // ---------- Header ----------
  function renderHeader() {
    const o = overallStats();
    document.getElementById('overall-stats').replaceChildren(
      el('div', { class: 'rf-stat' }, el('strong', {}, `${pct(o.tasksDone, o.tasksTotal)}%`), el('span', {}, `${o.tasksDone}/${o.tasksTotal} tasks done`)),
      el('div', { class: 'rf-stat' }, el('strong', {}, `${o.storiesDone}/${o.storiesTotal}`), el('span', {}, 'stories done')),
      el('div', { class: 'rf-stat' }, el('strong', {}, `${o.ptsDone}/${o.ptsTotal}`), el('span', {}, 'points delivered')),
      el('div', { class: 'rf-stat', style: 'flex:1;min-width:220px' }, progressBar(pct(o.tasksDone, o.tasksTotal))),
    );
  }

  // ---------- Overview tab ----------
  function renderOverview() {
    const grid = el('div', { class: 'rf-grid cols-3' });
    DATA.sprints.forEach((sprint) => {
      const s = sprintStats(sprint);
      const card = el('div', { class: 'rf-card rf-sprint-card', onclick: () => activateTab('sprint-' + sprint.id) },
        el('p', { class: 'rf-badge' }, sprint.dateRange),
        el('h3', {}, `${sprint.id} — ${sprint.title}`),
        el('p', { class: 'rf-muted' }, sprint.goal),
        el('div', { class: 'rf-row', style: 'justify-content:space-between;margin-top:8px' },
          el('span', { class: 'rf-muted', style: 'font-size:.8rem' }, `${s.storiesDone}/${s.storiesTotal} stories`),
          el('span', { class: 'rf-muted', style: 'font-size:.8rem' }, `${s.ptsDone}/${s.ptsTotal} pts`)),
        progressBar(pct(s.tasksDone, s.tasksTotal)),
      );
      grid.append(card);
    });

    const epicList = el('div', { class: 'rf-grid cols-3 rf-mt' });
    DATA.epics.forEach((ep) => {
      epicList.append(el('div', { class: 'rf-card' }, el('h3', {}, `${ep.id} — ${ep.name}`), el('p', { class: 'rf-muted' }, ep.outcome)));
    });

    document.getElementById('panel-overview').replaceChildren(
      el('h2', {}, 'Sprints'), grid,
      el('h2', { class: 'rf-mt' }, 'Epics'), epicList,
    );
  }

  // ---------- Sprint tab ----------
  function renderSprint(sprint) {
    const s = sprintStats(sprint);
    const head = el('div', { class: 'rf-card rf-sprint-head' },
      el('div', { class: 'rf-row', style: 'justify-content:space-between' },
        el('h2', {}, `${sprint.id} — ${sprint.title}`),
        el('span', { class: 'rf-badge' }, sprint.dateRange)),
      el('p', { class: 'rf-muted' }, sprint.goal),
      el('div', { class: 'rf-row', style: 'gap:16px' },
        el('span', { class: 'rf-muted' }, `Capacity: ${sprint.capacityPts} pts / 50h`),
        el('span', { class: 'rf-muted' }, `${s.storiesDone}/${s.storiesTotal} stories · ${s.ptsDone}/${s.ptsTotal} pts · ${s.tasksDone}/${s.tasksTotal} tasks`)),
      progressBar(pct(s.tasksDone, s.tasksTotal)),
    );

    const stories = el('div', {});
    sprint.stories.forEach((story) => stories.append(renderStory(story)));

    const panel = document.getElementById('panel-sprint-' + sprint.id);
    panel.replaceChildren(head, stories);
  }

  function renderStory(story) {
    const done = storyTasksDone(story);
    const isDone = done === story.tasks.length;
    const card = el('div', { class: 'rf-story', 'data-open': 'false', id: 'story-' + story.id });
    const head = el('div', {
      class: 'rf-story-head', onclick: () => {
        const open = card.getAttribute('data-open') === 'true';
        card.setAttribute('data-open', open ? 'false' : 'true');
      },
    },
      el('span', { class: 'rf-story-caret', 'aria-hidden': 'true' }, '▶'),
      el('span', { class: 'rf-story-id' }, story.id),
      el('span', { class: 'rf-story-title' }, story.title),
      el('span', { class: 'rf-badge' }, `${story.epic}.${story.feature}`),
      el('span', { class: 'rf-badge' }, `${story.points} pts`),
      el('span', { class: `rf-badge rf-badge--priority-${story.priority}` }, story.priority),
      isDone ? el('span', { class: 'rf-badge rf-badge--done' }, '✓ Done') : null,
      el('span', { class: 'rf-story-progress' },
        progressBar(pct(done, story.tasks.length)),
        el('span', { class: 'pct' }, `${done}/${story.tasks.length} tasks`)),
    );

    const dependsChips = story.dependsOn.length
      ? story.dependsOn.map((d) => el('span', { class: 'rf-badge' }, d))
      : [el('span', { class: 'rf-muted' }, 'none')];

    const taskList = el('div', {});
    story.tasks.forEach((t) => {
      const rowDone = taskDone(t.id);
      const cb = el('input', {
        type: 'checkbox', id: 'cb-' + t.id, ...(rowDone ? { checked: 'checked' } : {}),
        onchange: (e) => {
          progress[t.id] = e.target.checked;
          saveProgress();
          renderStory.rerenderHost(story, card);
          renderSprintOwnerOf(t.sprintId || currentSprintIdOf(story));
          renderHeader();
          renderBacklog();
          renderOverview();
        },
      });
      const row = el('div', { class: 'rf-task-row' + (rowDone ? ' done' : '') },
        cb,
        el('label', { for: 'cb-' + t.id }, `${t.id} — ${t.title}`),
        el('span', { class: 'rf-task-meta' }, `${t.hours}h · ${t.day}`),
      );
      taskList.append(row);
    });

    const body = el('div', { class: 'rf-story-body' },
      el('p', {}, el('em', {}, story.userStory)),
      el('h4', {}, 'Acceptance criteria'),
      el('ul', { class: 'rf-ac-list' }, story.ac.map((line) => el('li', { class: 'rf-muted' }, line))),
      el('h4', {}, 'Depends on'),
      el('div', { class: 'rf-depends' }, dependsChips),
      el('h4', {}, `Tasks (${story.tasks.length})`),
      taskList,
    );

    card.append(head, body);
    return card;
  }
  // keep a reference so the checkbox handler above can trigger a targeted re-render
  renderStory.rerenderHost = (story, oldCard) => {
    const wasOpen = oldCard.getAttribute('data-open');
    const fresh = renderStory(story);
    fresh.setAttribute('data-open', wasOpen);
    oldCard.replaceWith(fresh);
  };
  function currentSprintIdOf(story) {
    const sprint = DATA.sprints.find((s) => s.stories.includes(story));
    return sprint ? sprint.id : null;
  }
  function renderSprintOwnerOf(sprintId) {
    const sprint = DATA.sprints.find((s) => s.id === sprintId);
    if (sprint) renderSprint(sprint);
  }

  // ---------- Backlog tab ----------
  function flatBacklog() {
    return DATA.sprints.flatMap((sprint) => sprint.stories.map((story) => ({ story, sprint })));
  }
  function renderBacklog() {
    const search = (document.getElementById('backlog-search') || {}).value || '';
    const sprintFilter = (document.getElementById('backlog-sprint-filter') || {}).value || '';
    const priorityFilter = (document.getElementById('backlog-priority-filter') || {}).value || '';

    const rows = flatBacklog().filter(({ story, sprint }) => {
      if (sprintFilter && sprint.id !== sprintFilter) return false;
      if (priorityFilter && story.priority !== priorityFilter) return false;
      if (search) {
        const hay = `${story.id} ${story.title} ${story.epic}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });

    const tbody = el('tbody', {});
    rows.forEach(({ story, sprint }) => {
      const done = storyTasksDone(story);
      const total = story.tasks.length;
      const statusClass = done === total ? 'done' : done > 0 ? 'partial' : '';
      const statusLabel = done === total ? 'Done' : done > 0 ? `${done}/${total} tasks` : 'Not started';
      tbody.append(el('tr', {},
        el('td', {}, el('a', { href: '#', onclick: (e) => { e.preventDefault(); activateTab('sprint-' + sprint.id); setTimeout(() => document.getElementById('story-' + story.id)?.setAttribute('data-open', 'true'), 0); } }, story.id)),
        el('td', {}, story.epic), el('td', {}, story.feature), el('td', {}, story.title),
        el('td', {}, String(story.points)), el('td', {}, sprint.id),
        el('td', {}, el('span', { class: `rf-badge rf-badge--priority-${story.priority}` }, story.priority)),
        el('td', {}, story.dependsOn.join(', ') || '—'),
        el('td', {}, el('span', { class: 'rf-status-dot ' + statusClass, 'aria-hidden': 'true' }), statusLabel),
      ));
    });

    const totalPts = flatBacklog().reduce((sum, r) => sum + r.story.points, 0);
    const totalHours = flatBacklog().reduce((sum, r) => sum + r.story.tasks.reduce((h, t) => h + t.hours, 0), 0);

    document.getElementById('backlog-table-body-wrap').replaceChildren(
      el('table', { class: 'rf-table' },
        el('thead', {}, el('tr', {}, ['ID', 'Epic', 'Feature', 'Title', 'Pts', 'Sprint', 'Priority', 'Depends On', 'Status'].map((h) => el('th', {}, h)))),
        tbody,
      ),
    );
    document.getElementById('backlog-totals').textContent =
      `${flatBacklog().length} stories shown: ${rows.length} · ${totalPts} total points · ~${totalHours} total hours`;
  }

  function exportCsv() {
    const header = ['ID', 'Epic', 'Feature', 'Title', 'Points', 'Sprint', 'Priority', 'Depends On', 'Status'];
    const lines = [header.join(',')];
    flatBacklog().forEach(({ story, sprint }) => {
      const done = storyTasksDone(story);
      const status = done === story.tasks.length ? 'Done' : done > 0 ? `${done}/${story.tasks.length}` : 'Not started';
      const row = [story.id, story.epic, story.feature, `"${story.title.replace(/"/g, '""')}"`, story.points, sprint.id, story.priority, `"${story.dependsOn.join('; ')}"`, status];
      lines.push(row.join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'resumeforge-backlog.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ---------- Tabs ----------
  function activateTab(id) {
    document.querySelectorAll('.rf-tab').forEach((btn) => btn.setAttribute('aria-selected', String(btn.dataset.tab === id)));
    document.querySelectorAll('.rf-panel').forEach((p) => p.setAttribute('data-active', String(p.dataset.panel === id)));
    location.hash = id;
  }

  function buildTabs() {
    const tabs = document.getElementById('rf-tabs');
    const panels = document.getElementById('rf-panels');
    const makeTab = (id, label, count) => el('button', { class: 'rf-tab', 'data-tab': id, 'aria-selected': 'false', onclick: () => activateTab(id) },
      label, count != null ? el('span', { class: 'rf-tab-count' }, `(${count})`) : null);

    tabs.append(makeTab('overview', 'Overview'));
    panels.append(el('div', { class: 'rf-panel', id: 'panel-overview', 'data-panel': 'overview' }));

    DATA.sprints.forEach((sprint) => {
      tabs.append(makeTab('sprint-' + sprint.id, sprint.id, sprint.stories.length));
      panels.append(el('div', { class: 'rf-panel', id: 'panel-sprint-' + sprint.id, 'data-panel': 'sprint-' + sprint.id }));
    });

    tabs.append(makeTab('backlog', 'Backlog', flatBacklog().length));
    panels.append(el('div', { class: 'rf-panel', id: 'panel-backlog', 'data-panel': 'backlog' },
      el('div', { class: 'rf-backlog-filters' },
        el('input', { type: 'search', id: 'backlog-search', placeholder: 'Search ID, title, epic…', oninput: renderBacklog }),
        el('select', { id: 'backlog-sprint-filter', onchange: renderBacklog }, el('option', { value: '' }, 'All sprints'), ...DATA.sprints.map((s) => el('option', { value: s.id }, s.id))),
        el('select', { id: 'backlog-priority-filter', onchange: renderBacklog }, el('option', { value: '' }, 'All priorities'), ...['P0', 'P1', 'P2'].map((p) => el('option', { value: p }, p))),
        el('button', { class: 'rf-btn', onclick: exportCsv }, '⬇ Export CSV'),
      ),
      el('div', { class: 'rf-backlog-table-wrap', id: 'backlog-table-body-wrap' }),
      el('p', { class: 'rf-muted rf-mt', id: 'backlog-totals' }),
    ));
  }

  function resetProgress() {
    if (!confirm('Reset all tracked progress? This clears every checked task on this device.')) return;
    Object.keys(progress).forEach((k) => delete progress[k]);
    saveProgress();
    renderAll();
  }

  function renderAll() {
    renderHeader();
    renderOverview();
    DATA.sprints.forEach(renderSprint);
    renderBacklog();
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildTabs();
    renderAll();
    document.getElementById('reset-progress').addEventListener('click', resetProgress);
    document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('rf-theme', next);
    }));
    document.documentElement.setAttribute('data-theme', localStorage.getItem('rf-theme') || 'dark');

    const initial = (location.hash || '#overview').slice(1);
    activateTab(document.querySelector(`[data-tab="${initial}"]`) ? initial : 'overview');
  });
})();
