// Randomize once on load; links stay in place while someone uses the page.
function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

document.querySelectorAll('.project-wall, .experiment-wall').forEach(wall => {
  const cards = shuffle([...wall.children]);
  const sizes = shuffle([280, 325, 370, 415]);
  cards.forEach((card, i) => {
    card.style.setProperty('--card-width', `${sizes[i % sizes.length]}px`);
    card.style.setProperty('--image-height', `${220 + Math.floor(Math.random() * 130)}px`);
    card.style.setProperty('--mobile-height', `${230 + Math.floor(Math.random() * 80)}px`);
    card.style.setProperty('--angle', `${(Math.random() * 5 - 2.5).toFixed(2)}deg`);
    card.style.setProperty('--duration', `${7 + Math.random() * 6}s`);
    card.style.setProperty('--delay', `${-Math.random() * 12}s`);
    card.style.setProperty('--lift', `${-4 - Math.random() * 5}px`);
    wall.append(card);
  });
  const firstImage = cards[0]?.querySelector('img');
  if (firstImage && wall.classList.contains('project-wall')) {
    firstImage.loading = 'eager';
    firstImage.fetchPriority = 'high';
  }
});
