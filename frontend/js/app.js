document.addEventListener('DOMContentLoaded', () => {
  const listContainer      = document.getElementById('list-container');
  const filterBtn          = document.getElementById('filter-shortlist');
  const filterIcon         = document.getElementById('filter-icon');
  let listings             = [];
  let showOnlyShortlisted  = false;

  // 1. Load from backend (or static JSON)
  async function loadListings() {
    const res = await fetch('/api/listings');  // or 'data/listings.json' if not behind Flask
    listings = await res.json();
    renderListings();
  }

  // 2. Render all cards
  function renderListings() {
    listContainer.innerHTML = '';
    const toShow = showOnlyShortlisted
      ? listings.filter(l => l.shortlisted)
      : listings;

    toShow.forEach(item => listContainer.appendChild(createCard(item)));

    // wire up shortlist buttons
    document.querySelectorAll('.action-btn.shortlist')
      .forEach(btn => btn.addEventListener('click', toggleShortlist));
  }

  // 3. Build one card
  function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-info">
        <h2>${item.name}</h2>
        <div class="rating">${starHTML(item.rating)}</div>
        <p class="subtitle">${item.description}</p>
        <div class="stats">
          <div><strong>${item.projects}</strong><span>Projects</span></div>
          <div><strong>${item.years}</strong><span>Years</span></div>
          <div><strong>${'$'.repeat(item.priceLevel)}</strong><span>Price</span></div>
        </div>
        <div class="contacts">
          ${item.contacts.map(n => `<p>${n}</p>`).join('')}
        </div>
      </div>
      <div class="card-actions">
        <button class="action-btn details">
          <img src="assets/icons/arrow-right-short 1.png" alt="Details"/><span>Details</span>
        </button>
        <button class="action-btn hide">
          <img src="assets/icons/eye-slash 1.png" alt="Hide"/><span>Hide</span>
        </button>
        <button class="action-btn shortlist" data-id="${item.id}">
          <img src="assets/icons/${item.shortlisted ? 'Vector' : 'Group 10'}.png" alt="Shortlist"/><span>Shortlist</span>
        </button>
        <button class="action-btn report">
          <img src="assets/icons/exclamation-circle 1.png" alt="Report"/><span>Report</span>
        </button>
      </div>
    `;
    return card;
  }

  // 4. Render star rating
  function starHTML(rating) {
    const full   = Math.floor(rating);
    const half   = rating % 1 >= 0.5;
    const empty  = 5 - full - (half ? 1 : 0);
    let html = '';

    // full stars
    for (let i = 0; i < full; i++) {
      html += '<img src="assets/icons/star.png" alt="★"/>';
    }
    // half star
    if (half) {
      html += '<img src="assets/icons/star-half.png" alt="☆"/>';
    }
    // empty stars
    for (let i = 0; i < empty; i++) {
      html += '<img src="assets/icons/star-outline.png" alt="☆"/>';
    }
    return html;
  }

  // 5. Toggle shortlist
  function toggleShortlist(e) {
    const id   = +e.currentTarget.dataset.id;
    const item = listings.find(x => x.id === id);
    item.shortlisted = !item.shortlisted;
    renderListings();
  }

  // 6. Top-bar filter toggle
  filterBtn.addEventListener('click', () => {
    showOnlyShortlisted = !showOnlyShortlisted;
    filterIcon.src = showOnlyShortlisted
      ? 'assets/icons/Vector.png'
      : 'assets/icons/Group 10.png';
    renderListings();
  });

  loadListings();
});
