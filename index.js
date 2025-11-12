helpers.bindHeaderSearch('globalSearch', 'globalQuery');

$(function () {
  // Карусель
  const $slides = $('#carousel img'); let i = 0;
  setInterval(() => { $slides.removeClass('active'); i = (i + 1) % $slides.length; $slides.eq(i).addClass('active'); }, 3000);

  // Автор дня (без внешних API)
  (function () {
    const box = document.getElementById('authorDay');
    if (!box || !window.DB) return;

    const authors = [...new Set(DB.map(b => b.author))];
    if (!authors.length) return;

    const t = new Date(); // фиксируется по дате (каждый день новый автор)
    const seed = t.getUTCFullYear() * 10000 + (t.getUTCMonth() + 1) * 100 + t.getUTCDate();
    const pick = authors[seed % authors.length];

    const books = DB.filter(b => b.author === pick)
      .sort((a, b) => (b.rating - a.rating) || (b.reviews - a.reviews) || (b.year - a.year));
    const top = books[0];

    box.innerHTML = `
    <h3 style="margin:0 0 8px">Автор дня</h3>
    <div class="row" style="align-items:center;gap:12px">
      ${top ? `<img src="${top.cover}" alt="" style="width:64px;height:90px;object-fit:cover;border-radius:8px;border:1px solid var(--line)">` : ''}
      <div>
        <strong>${pick}</strong>
        <div class="meta">${books.length} книг в каталоге${top ? ` • лучшая: <a href="books.html?id=${top.id}">${top.title}</a>` : ''}</div>
        <div class="row" style="margin-top:8px">
          <a class="btn btn-light" href="search.html?q=${encodeURIComponent(pick)}">Смотреть автора</a>
        </div>
      </div>
    </div>
  `;
  })();

  // Новинки (по году)
  const $list = $('#homeList');
  [...DB].sort((a, b) => b.year - a.year).slice(0, 12).forEach(b => {
    $list.append(`
      <article class="card book-card">
        <img src="${b.cover}" alt="">
        <div class="p-3">
          <div class="meta">${b.author} • ${b.genre} • ${b.year}</div>
          <strong>${b.title}</strong>
          <div class="meta">${helpers.stars(b.rating)} • ${b.reviews} reviews</div>
          <div class="row row--bottom">
            <div class="price">${helpers.money(b.price)}</div>
            <div class="row">
              <a class="btn btn-light" href="books.html?id=${b.id}">Details</a>
              <button class="btn btn-primary" onclick="helpers.addToCart('${b.id}')">Buy</button>
            </div>
          </div>
        </div>
      </article>
    `);
  });
});
