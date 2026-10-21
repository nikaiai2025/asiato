// Choose the order once per visit, so no work stays in front.
function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
const deck = document.querySelector('.deck');
const labList = document.querySelector('.lab-list');
[deck, labList].forEach(list => shuffle([...list.children]).forEach(item => list.append(item)));
deck.querySelectorAll('li:nth-child(-n+2) img').forEach(image => {
  image.loading = 'eager';
  image.fetchPriority = 'high';
});

// Each card shrinks back while the next card slides over it.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && CSS.supports('animation-timeline: view()')) {
  const cards = [...deck.children];
  deck.style.setProperty('timeline-scope', cards.map((_, i) => `--card-${i}`).join(', '));
  cards.forEach((card, i) => {
    card.style.setProperty('view-timeline', `--card-${i} block`);
    if (i === 0) return;
    const covered = cards[i - 1].querySelector('.work');
    covered.style.setProperty('--tl', `--card-${i}`);
    covered.dataset.tuck = '';
  });
}

// With a fine pointer, the hovered or focused row fills one large preview.
const lab = document.querySelector('.lab');
const preview = document.createElement('div');
preview.className = 'lab-preview';
preview.setAttribute('aria-hidden', 'true');
const rows = [...labList.querySelectorAll('.lab-item')];
const frames = rows.map(row => preview.appendChild(row.querySelector('.thumb').cloneNode(true)));
function activate(index) {
  rows.forEach((row, i) => row.toggleAttribute('data-active', i === index));
  frames.forEach((frame, i) => frame.toggleAttribute('data-active', i === index));
}
rows.forEach((row, i) => {
  row.addEventListener('pointerenter', () => activate(i));
  row.addEventListener('focus', () => activate(i));
});
lab.append(preview);
lab.classList.add('has-preview');
activate(0);
