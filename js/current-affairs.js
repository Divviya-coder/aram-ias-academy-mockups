(() => {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Header state + mobile menu
  const header = qs('#siteHeader');
  const mobileBtn = qs('#mobileMenuBtn');
  const mainNav = qs('#mainNav');
  if (header) {
    const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 16);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }
  if (mobileBtn && mainNav) {
    mobileBtn.addEventListener('click', () => {
      const open = mainNav.classList.toggle('is-open');
      mobileBtn.setAttribute('aria-expanded', String(open));
      mobileBtn.textContent = open ? '×' : '☰';
    });
  }

  // Search focus shortcut
  const searchInput = qs('#caGlobalSearch');
  const searchWrap = qs('.ca-search-wrap');
  const focusSearch = () => searchInput?.focus();
  qsa('[data-focus-search]').forEach(btn => btn.addEventListener('click', focusSearch));
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      e.preventDefault(); focusSearch();
    }
  });
  searchInput?.addEventListener('focus', () => searchWrap?.classList.add('is-focused'));
  searchInput?.addEventListener('blur', () => searchWrap?.classList.remove('is-focused'));

  // News Navigator filtering
  const filterState = { gs: 'all', subject: 'all', lens: 'all' };
  const newsCards = qsa('.ca-news-card');
  const importantRows = qsa('.ca-important-list [data-searchable]');
  const leadStory = qs('.ca-lead-story[data-searchable]');
  const resultCount = qs('#newsResultCount');
  const empty = qs('#newsEmpty');

  const tokenMatch = (haystack, needle) => {
    if (!needle || needle === 'all') return true;
    return String(haystack || '').toLowerCase().split(/\s+/).includes(needle.toLowerCase());
  };

  const applyFilters = () => {
    const query = (searchInput?.value || '').trim().toLowerCase();
    let visible = 0;
    newsCards.forEach(card => {
      const matchesGs = tokenMatch(card.dataset.gs, filterState.gs);
      const matchesSubject = tokenMatch(card.dataset.subject, filterState.subject);
      let matchesLens = true;
      if (filterState.lens !== 'all') {
        const cardLens = card.dataset.lens;
        matchesLens = cardLens === filterState.lens || cardLens === 'both';
      }
      const text = (card.dataset.searchable || card.textContent).toLowerCase();
      const matchesSearch = !query || text.includes(query);
      const show = matchesGs && matchesSubject && matchesLens && matchesSearch;
      card.classList.toggle('ca-search-hidden', !show);
      if (show) visible += 1;
    });

    // Global search also dims/filters today's lead/list to make the search feel useful.
    [leadStory, ...importantRows].filter(Boolean).forEach(item => {
      const text = (item.dataset.searchable || item.textContent).toLowerCase();
      item.classList.toggle('ca-search-hidden', Boolean(query) && !text.includes(query));
    });

    if (resultCount) resultCount.textContent = `${visible} item${visible === 1 ? '' : 's'}`;
    if (empty) empty.hidden = visible !== 0;
  };

  // Which subjects each GS paper covers. Used to enable/disable subject chips
  // when a specific GS paper is selected. Update alongside production taxonomy.
  const gsSubjectMap = {
    gs1: ['history', 'geography', 'society'],
    gs2: ['polity', 'governance', 'ir'],
    gs3: ['economy', 'environment', 'science'],
    gs4: ['ethics'],
  };

  const subjectGroup = qs('[data-filter-group="subject"]');

  // Enable only the subjects relevant to the selected GS paper.
  // When GS = "all", every subject is enabled again.
  const syncSubjectAvailability = () => {
    if (!subjectGroup) return;
    const gs = filterState.gs;
    const allowed = gs === 'all' ? null : (gsSubjectMap[gs] || []);
    qsa('button[data-filter]', subjectGroup).forEach(btn => {
      const subj = btn.dataset.filter;
      if (subj === 'all') { btn.disabled = false; return; }
      const enabled = allowed === null || allowed.includes(subj);
      btn.disabled = !enabled;
      // If the currently selected subject becomes disabled, reset to "All".
      if (!enabled && btn.classList.contains('is-active')) {
        btn.classList.remove('is-active');
        const allBtn = qs('button[data-filter="all"]', subjectGroup);
        allBtn?.classList.add('is-active');
        filterState.subject = 'all';
      }
    });
  };

  qsa('[data-filter-group]').forEach(group => {
    const name = group.dataset.filterGroup;
    qsa('button[data-filter]', group).forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        qsa('button[data-filter]', group).forEach(b => b.classList.toggle('is-active', b === btn));
        filterState[name] = btn.dataset.filter;
        if (name === 'gs') syncSubjectAvailability();
        applyFilters();
      });
    });
  });
  searchInput?.addEventListener('input', applyFilters);
  syncSubjectAvailability();

  // Save lead story — prototype only. Replace with logged-in API later.
  qsa('.ca-save-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const saved = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!saved));
      btn.classList.toggle('is-saved', !saved);
      btn.textContent = saved ? '☆ Save' : '★ Saved';
    });
  });

  // ---- Card 1: News-deck date navigation ----
  // Prototype only. In production, change route/query and fetch date-specific news.
  const dateLabel = qs('[data-current-date]');
  const deckPrev = qs('[data-deck-prev]');
  const deckNext = qs('[data-deck-next]');
  let currentDate = new Date(2026, 8, 9); // sample date: 9 Sep 2026
  const renderDate = () => {
    if (!dateLabel) return;
    dateLabel.textContent = new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(currentDate);
  };
  deckPrev?.addEventListener('click', () => { currentDate.setDate(currentDate.getDate() - 1); renderDate(); });
  deckNext?.addEventListener('click', () => { currentDate.setDate(currentDate.getDate() + 1); renderDate(); });
  renderDate();

  // ---- Card 2: Themed month calendar with Prelims / Mains / PIB markers ----
  // Marker data is prototype/sample. Replace with real per-day CA availability from the API.
  const calGrid = qs('[data-cal-grid]');
  if (calGrid) {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const monthLabel = qs('[data-cal-month]');
    const monthSelect = qs('[data-cal-month-select]');
    const yearSelect = qs('[data-cal-year-select]');
    const calPrev = qs('[data-cal-prev]');
    const calNext = qs('[data-cal-next]');
    const today = new Date(2026, 8, 9); // sample "today"
    let view = new Date(today.getFullYear(), today.getMonth(), 1);

    // Populate month + year pickers.
    monthNames.forEach((m, i) => {
      const o = document.createElement('option'); o.value = i; o.textContent = m; monthSelect?.appendChild(o);
    });
    const startYear = today.getFullYear() - 2;
    for (let y = startYear; y <= today.getFullYear() + 1; y += 1) {
      const o = document.createElement('option'); o.value = y; o.textContent = y; yearSelect?.appendChild(o);
    }

    // Deterministic sample markers so the same day always shows the same tags.
    // Some days carry the full set (Prelims + Mains + PIB) stacked together.
    const markersFor = (year, month, day) => {
      const seed = (year + month * 31 + day * 7) % 10;
      const out = [];
      let hasPrelims = seed % 3 !== 2;
      const hasMains = seed % 2 === 0;
      const hasPib = seed % 5 === 1 || seed % 5 === 4;
      // Guarantee every desk day has at least one item.
      if (!hasPrelims && !hasMains && !hasPib) hasPrelims = true;
      // Full days: Prelims + Mains + PIB all together.
      if (hasPrelims) out.push(['Prelims', 'ca-tag-prelims']);
      if (hasMains) out.push(['Mains', 'ca-tag-mains']);
      if (hasPib) out.push(['PIB', 'ca-tag-pib']);
      return out;
    };

    const renderCalendar = () => {
      const year = view.getFullYear();
      const month = view.getMonth();
      if (monthLabel) monthLabel.textContent = `${monthNames[month]} ${year}`;
      if (monthSelect) monthSelect.value = String(month);
      if (yearSelect) yearSelect.value = String(year);

      calGrid.innerHTML = '';
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let i = 0; i < firstDay; i += 1) {
        const empty = document.createElement('div');
        empty.className = 'ca-cal-cell is-empty';
        calGrid.appendChild(empty);
      }
      for (let d = 1; d <= daysInMonth; d += 1) {
        const cell = document.createElement('div');
        cell.className = 'ca-cal-cell';
        const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
        if (isToday) cell.classList.add('is-today');
        const num = document.createElement('span');
        num.className = 'ca-cal-daynum';
        num.textContent = d;
        cell.appendChild(num);
        // Only show markers up to "today" in the sample (past + present desks exist).
        const cellDate = new Date(year, month, d);
        if (cellDate <= today) {
          markersFor(year, month, d).forEach(([label, cls]) => {
            const m = document.createElement('span');
            m.className = `ca-cal-marker ${cls}`;
            m.textContent = label;
            cell.appendChild(m);
          });
        }
        calGrid.appendChild(cell);
      }
    };

    calPrev?.addEventListener('click', () => { view.setMonth(view.getMonth() - 1); renderCalendar(); });
    calNext?.addEventListener('click', () => { view.setMonth(view.getMonth() + 1); renderCalendar(); });
    monthSelect?.addEventListener('change', () => { view.setMonth(Number(monthSelect.value)); renderCalendar(); });
    yearSelect?.addEventListener('change', () => { view.setFullYear(Number(yearSelect.value)); renderCalendar(); });
    renderCalendar();
  }

  // Sticky subnav active state based on scroll position.
  const subLinks = qsa('.ca-subnav a[href^="#"]');
  const sectionMap = subLinks
    .map(link => ({ link, section: qs(link.getAttribute('href')) }))
    .filter(x => x.section);
  const activateLink = () => {
    const y = window.scrollY + 160;
    let active = sectionMap[0];
    sectionMap.forEach(item => { if (item.section.offsetTop <= y) active = item; });
    subLinks.forEach(link => link.classList.toggle('is-active', active?.link === link));
  };
  activateLink();
  window.addEventListener('scroll', activateLink, { passive: true });

  applyFilters();
})();
