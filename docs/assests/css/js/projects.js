(async function () {
  const cardsEl = document.getElementById('cards');
  const filtersEl = document.getElementById('filters');

  function el(tag, attrs = {}, html = "") {
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    if (html) n.innerHTML = html;
    return n;
  }

  async function load() {
    const res = await fetch('assets/data/projects.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load projects.json');
    return res.json();
  }

  function renderFilters(allTags) {
    // Keep existing "All" button if present, then append unique tags
    const existingAll = filtersEl.querySelector('[data-tag="all"]');
    if (!existingAll) {
      filtersEl.appendChild(el('button', { class: 'tag', 'data-tag': 'all' }, 'All'));
    }
    [...allTags].sort().forEach(t => {
      const b = el('button', { class: 'tag', 'data-tag': t }, t[0].toUpperCase() + t.slice(1));
      filtersEl.appendChild(b);
    });
  }

  function renderCards(items) {
    cardsEl.innerHTML = '';
    items.forEach(p => {
      const card = el('article', { class: 'card', 'data-tags': p.tags.join(' ') });
      const cover = p.cover ? `<img class="cover" src="${p.cover}" alt="Cover for ${p.title}">` : '';
      const tagsHtml = (p.stack || []).map(s => `<span class="tag">${s}</span>`).join('');
      const linksHtml = (p.links || [{ label: 'Repository', url: p.repo }])
        .map(l => `<a class="btn-secondary" href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join(' ');
      card.innerHTML = `
        ${cover}
        <h3>${p.title}</h3>
        <p>${p.summary}</p>
        <div class="tags">${tagsHtml}</div>
        <p>${linksHtml}</p>
      `;
      cardsEl.appendChild(card);
    });
  }

  function wireFiltering() {
    const allCards = [...cardsEl.querySelectorAll('.card')];
    filtersEl.addEventListener('click', e => {
      const tag = e.target?.dataset?.tag;
      if (!tag) return;
      allCards.forEach(c => {
        const ok = tag === 'all' || c.dataset.tags.split(' ').includes(tag);
        c.style.display = ok ? '' : 'none';
      });
    });
  }

  try {
    const data = await load();

    // Derive tag set from data
    const tags = new Set();
    data.forEach(p => (p.tags || []).forEach(t => tags.add(t)));

    renderFilters(tags);
    renderCards(data);
    wireFiltering();
  } catch (err) {
    console.error(err);
    cardsEl.innerHTML = '<p class="muted">Projects failed to load. Please refresh.</p>';
  }
})();
