// Progressive enhancements: navigation, activity filtering and photo viewing.
// All page content remains available when JavaScript is disabled.
(() => {
  const header = document.querySelector('header');
  const toggle = header?.querySelector('.nav-toggle');
  const nav = header?.querySelector('#primary-nav');
  if (!toggle || !nav) return;

  const mobile = window.matchMedia('(max-width: 760px)');
  const setOpen = open => {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
    const label = toggle.querySelector('.nav-toggle-label');
    if (label) label.textContent = open ? '关闭' : '菜单';
  };

  toggle.hidden = false;
  header.classList.add('nav-ready');
  setOpen(false);
  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setOpen(false);
  });
  const onResize = () => {
    if (!mobile.matches) setOpen(false);
  };
  if (mobile.addEventListener) mobile.addEventListener('change', onResize);
  else mobile.addListener(onResize);
})();

(() => {
  const form = document.querySelector('.archive-tools');
  if (!form) return;
  const cards = [...document.querySelectorAll('.archive .card')];
  const input = form.querySelector('input[type="search"]');
  const year = form.querySelector('select');
  const status = form.querySelector('.result-count');
  const reset = form.querySelector('.filter-reset');
  const empty = document.querySelector('.empty-results');
  if (!input || !year) return;

  const normalize = value => value.normalize('NFKC').toLocaleLowerCase().trim();
  const records = cards.map(card => ({
    card,
    text: normalize(card.textContent),
    year: card.querySelector('.card-meta')?.textContent.trim().slice(0, 4),
  }));

  function syncURL() {
    const url = new URL(window.location.href);
    const query = input.value.trim();
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    if (year.value) url.searchParams.set('year', year.value);
    else url.searchParams.delete('year');
    // Some browsers do not allow history updates for pages opened as local files.
    try {
      if (url.href !== window.location.href) history.replaceState(history.state, '', url.href);
    } catch { /* Filtering still works without a shareable URL. */ }
  }

  function filter(updateURL = true) {
    const terms = normalize(input.value).split(/\s+/).filter(Boolean);
    let count = 0;
    for (const record of records) {
      const matches = (!year.value || record.year === year.value)
        && terms.every(term => record.text.includes(term));
      record.card.hidden = !matches;
      if (matches) count++;
    }
    if (status) status.textContent = `显示 ${count} / ${cards.length} 项活动`;
    if (empty) empty.hidden = count !== 0;
    if (reset) reset.disabled = !input.value && !year.value;
    if (updateURL) syncURL();
  }

  function restore() {
    const params = new URL(window.location.href).searchParams;
    input.value = params.get('q') || '';
    const selectedYear = params.get('year') || '';
    year.value = [...year.options].some(option => option.value === selectedYear)
      ? selectedYear : '';
    filter(false);
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', event => {
    event.preventDefault();
    input.value = '';
    year.value = '';
    filter();
    input.focus();
  });
  input.addEventListener('input', () => filter());
  year.addEventListener('change', () => filter());
  window.addEventListener('popstate', restore);
  window.addEventListener('pageshow', restore);
  restore();
  form.hidden = false;
})();

(() => {
  if (typeof HTMLDialogElement === 'undefined'
      || typeof HTMLDialogElement.prototype.showModal !== 'function') return;
  const photos = [...document.querySelectorAll('.gallery img')]
    .filter(photo => !photo.closest('a, button'));
  if (!photos.length) return;

  const viewer = document.createElement('dialog');
  viewer.className = 'image-viewer';
  viewer.setAttribute('aria-label', '活动照片预览');
  viewer.setAttribute('aria-describedby', 'activity-viewer-caption');
  viewer.innerHTML = `
    <div class="viewer-toolbar">
      <span class="viewer-counter" role="status" aria-live="polite"></span>
      <button class="viewer-close" type="button" aria-label="关闭照片预览" autofocus>关闭 <span aria-hidden="true">×</span></button>
    </div>
    <div class="viewer-stage">
      <button class="viewer-prev" type="button" aria-label="上一张照片"><span aria-hidden="true">←</span></button>
      <figure class="viewer-figure">
        <img class="viewer-image" alt="">
        <figcaption class="viewer-caption" id="activity-viewer-caption"></figcaption>
      </figure>
      <button class="viewer-next" type="button" aria-label="下一张照片"><span aria-hidden="true">→</span></button>
    </div>`;
  document.body.append(viewer);

  const image = viewer.querySelector('.viewer-image');
  const caption = viewer.querySelector('.viewer-caption');
  const counter = viewer.querySelector('.viewer-counter');
  const previous = viewer.querySelector('.viewer-prev');
  const next = viewer.querySelector('.viewer-next');
  let currentIndex = 0;
  let trigger = null;

  function show(index) {
    currentIndex = (index + photos.length) % photos.length;
    const photo = photos[currentIndex];
    image.src = photo.currentSrc || photo.src;
    image.alt = photo.alt;
    caption.textContent = photo.closest('figure')?.querySelector('figcaption')?.textContent.trim()
      || photo.alt;
    counter.textContent = `${currentIndex + 1} / ${photos.length}`;
  }

  photos.forEach((photo, index) => {
    const button = document.createElement('button');
    button.className = 'gallery-open';
    button.type = 'button';
    button.setAttribute('aria-label', `放大查看：${photo.alt.trim() || `活动照片 ${index + 1}`}`);
    button.setAttribute('aria-haspopup', 'dialog');
    photo.before(button);
    button.append(photo);
    button.addEventListener('click', () => {
      trigger = button;
      show(index);
      viewer.showModal();
      document.body.classList.add('viewer-active');
    });
  });

  previous.hidden = next.hidden = photos.length < 2;
  previous.addEventListener('click', () => show(currentIndex - 1));
  next.addEventListener('click', () => show(currentIndex + 1));
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('keydown', event => {
    if (photos.length < 2 || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    event.preventDefault();
    show(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('viewer-active');
    trigger?.focus({ preventScroll: true });
  });
})();
