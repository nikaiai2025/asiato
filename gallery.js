// Choose order and composition once, preserving each section while the page is in use.
function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
document.querySelectorAll('.project-wall, .experiment-wall').forEach(wall => {
  const cards = shuffle([...wall.children]);
  wall.dataset.layout = Math.random() < .5 ? 'a' : 'b';
  cards.forEach(card => wall.append(card));
  if (wall.classList.contains('project-wall')) {
    cards.slice(0, 2).forEach(card => {
      const image = card.querySelector('img');
      if (image) {
        image.loading = 'eager';
        image.fetchPriority = 'high';
      }
    });
  }
});
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const cards = [...document.querySelectorAll('.project-card')];
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  function reveal(card) {
    if (card.dataset.reveal !== 'pending') return;
    const wall = card.parentElement;
    const pairPosition = [...wall.children].indexOf(card) % 2;
    card.style.setProperty('--reveal-delay', `${pairPosition * 70}ms`);
    card.dataset.reveal = 'visible';
    observer.unobserve(card);
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) reveal(entry.target);
    });
  }, { rootMargin: '0px 0px -32px 0px', threshold: 0.08 });
  cards.forEach(card => {
    card.dataset.reveal = 'pending';
    observer.observe(card);
  });
  document.addEventListener('focusin', event => {
    const card = event.target.closest('.project-card');
    if (card) reveal(card);
  });
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    cards.forEach(card => card.removeAttribute('data-reveal'));
  });
}
