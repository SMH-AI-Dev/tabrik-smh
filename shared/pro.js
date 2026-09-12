// ===== تبریک‌ساز SMH — فاز ۲: ویرایش قدرتمند + نظم + گالری‌ها =====
// (به توابع app.js دسترسی دارد: applyTheme, addSticker, syncText, toast, THEMES)

// ---------- ۱) آکاردئونی شدن پنل‌ها (نظم) ----------
document.querySelectorAll('.card-box h3').forEach(h => {
  h.title = 'بزن باز/بسته شود';
  h.onclick = () => h.parentElement.classList.toggle('collapsed');
});

// ---------- ۲) کنترل‌های جدید متن ----------
$('#textShadow').onchange = e => {
  const t = $('#cardTitle');
  t.style.textShadow = e.target.checked ? '0 3px 14px #000' : 'none';
};
$('#textHalo').onchange = e => {
  $('#cardTitle').style.filter = e.target.checked ? 'drop-shadow(0 0 12px #fbbf24)' : 'none';
};
$('#textHi').onchange = e => {
  const m = $('#cardMsg');
  m.style.background = e.target.checked ? '#fbbf24' : '';
  m.style.color = e.target.checked ? '#1a1033' : '';
};
$('#textStroke').oninput = e => {
  $('#cardTitle').style.webkitTextStroke = e.target.value + 'px #1a1033';
};
$('#textLH').oninput = e => {
  $('#cardMsg').style.lineHeight = e.target.value / 10;
};

// ---------- ۳) کنترل‌های جدید عکس ----------
$('#photoRot').oninput = e => {
  const cur = $('#frameStyle').value === 'heart' ? -3 : 0;
  $('#cardPhoto').style.transform = `rotate(${cur + (+e.target.value)}deg)`;
};
$('#photoOp').oninput = e => {
  $('#cardPhoto').style.opacity = e.target.value / 100;
};

// ---------- ۴) انتخاب و جابه‌جایی دقیق استیکر ----------
let selEl = null, zTop = 20;
function selectSticker(el) {
  document.querySelectorAll('.sticker.sel').forEach(s => s.classList.remove('sel'));
  selEl = el;
  if (!el) { $('#selPanel').classList.add('hidden'); renderLayers(); return; }
  el.classList.add('sel');
  $('#selTitle').textContent = 'انتخاب‌شده: ' + el.textContent;
  const layer = $('#stickerLayer').getBoundingClientRect();
  const r = el.getBoundingClientRect();
  $('#selX').value = Math.round((r.left - layer.left) / layer.width * 100);
  $('#selY').value = Math.round((r.top - layer.top) / layer.height * 100);
  $('#selS').value = Math.round(parseFloat(el.style.fontSize) || 34);
  $('#selPanel').classList.remove('hidden');
  renderLayers();
}
$('#stickerLayer').addEventListener('click', e => {
  const st = e.target.closest('.sticker');
  selectSticker(st);
});
$('#selX').oninput = e => { if (selEl) selEl.style.left = e.target.value + '%'; };
$('#selY').oninput = e => { if (selEl) selEl.style.top = e.target.value + '%'; };
$('#selS').oninput = e => { if (selEl) selEl.style.fontSize = e.target.value + 'px'; };
$('#selUp').onclick = () => { if (selEl) selEl.style.zIndex = (++zTop); };
$('#selDown').onclick = () => { if (selEl) selEl.style.zIndex = (--zTop); };
$('#selDup').onclick = () => {
  if (!selEl) return;
  const c = selEl.cloneNode(true); c.classList.remove('sel');
  c.style.left = Math.min(90, parseFloat(selEl.style.left) + 6) + '%';
  c.style.top = Math.min(85, parseFloat(selEl.style.top) + 6) + '%';
  $('#stickerLayer').appendChild(c); renderLayers(); toast('📋 تکثیر شد!');
};
$('#selDel').onclick = () => { if (selEl) { selEl.remove(); selectSticker(null); toast('🗑️ حذف شد'); } };

// ---------- ۵) پنل لایه‌ها ----------
function renderLayers() {
  const box = $('#layerList'); if (!box) return; box.innerHTML = '';
  const rows = [
    ['🖼️ پس‌زمینه', $('#cardBg')],
    ['👤 عکس', $('#cardPhoto')],
    ['🔠 تیتر', $('#cardTitle')],
    ['📝 متن', $('#cardMsg')],
    ['✍️ امضا', $('#cardSign')],
  ];
  rows.forEach(([name, el]) => {
    const d = document.createElement('div'); d.className = 'layer-row';
    const vis = el.style.display !== 'none';
    d.innerHTML = `<span>${name}</span><span class="grow"></span>`;
    const b = document.createElement('button');
    b.textContent = vis ? '👁️' : '🚫'; b.title = 'نمایش/پنهان';
    b.onclick = () => { el.style.display = vis ? 'none' : ''; renderLayers(); };
    d.appendChild(b); box.appendChild(d);
  });
  document.querySelectorAll('#stickerLayer .sticker').forEach(st => {
    const d = document.createElement('div');
    d.className = 'layer-row' + (st === selEl ? ' sel' : '');
    d.innerHTML = `<span>${st.textContent} استیکر</span><span class="grow"></span>`;
    d.onclick = () => selectSticker(st);
    const del = document.createElement('button'); del.textContent = '🗑️';
    del.onclick = e => { e.stopPropagation(); st.remove(); if (st === selEl) selectSticker(null); else renderLayers(); };
    d.appendChild(del); box.appendChild(d);
  });
}

// ---------- ۶) تب ۱۰۰ نمونه‌کارت ----------
const OCC_FA = { birthday: '🎂 تولد', nowruz: '🌸 نوروز', yalda: '🍉 یلدا', valentine: '❤️ عشق', wedding: '💍 عروسی', mother: '🤱 مادر', father: '👨‍👧 پدر', teacher: '📚 معلم', grad: '🎓 فارغ‌التحصیلی', baby: '👶 نوزاد', eid: '🌙 عید', thanks: '🙏 تشکر', getwell: '🌿 سلامتی', condolence: '🕊️ تسلیت' };
(function fillOcc() {
  const s = $('#sampleOcc');
  Object.entries(OCC_FA).forEach(([k, v]) => { const o = document.createElement('option'); o.value = k; o.textContent = v; s.appendChild(o); });
})();
function renderSamples() {
  const g = $('#samplesGrid'); g.innerHTML = '';
  const q = ($('#sampleSearch').value || '').trim(), oc = $('#sampleOcc').value;
  SAMPLES.forEach((s, i) => {
    if (oc && s.o !== oc) return;
    if (q && !(s.t + s.m).includes(q)) return;
    const d = document.createElement('div'); d.className = 'tpl';
    d.innerHTML = `<div style="position:relative"><img src="${s.ph}" loading="lazy" style="width:100%;height:150px;object-fit:cover;display:block">` +
      (s.premium ? `<div class="lock-veil">🔒</div>` : '') + `</div>` +
      `<p>${s.t}<br><small class="sample-oc">${OCC_FA[s.o]} • نمونه ${i + 1}</small></p>`;
    d.onclick = () => {
      if (s.premium && !Premium.isVIP()) { Premium.open(); toast('🔒 این نمونه پرمیوم است!'); return; }
      loadSample(s);
    };
    g.appendChild(d);
  });
  if (!g.children.length) g.innerHTML = '<p class="hint">نمونه‌ای پیدا نشد 🔍</p>';
}
function loadSample(s) {
  $('#occasion').value = s.o; applyTheme(s.o);
  $('#inTitle').value = s.t; $('#inMsg').value = s.m; $('#inSign').value = s.s; syncText();
  if (s.mode === 'bg') {
    const im = $('#cardBgImg'); im.src = s.ph; im.classList.add('show');
    $('#cardPhoto').classList.add('hidden');
  } else {
    const im = $('#cardPhoto'); im.src = s.ph; im.classList.remove('hidden');
    $('#cardBgImg').classList.remove('show');
  }
  $('#stickerLayer').innerHTML = ''; selectSticker(null);
  s.st.forEach(e => addSticker(e));
  renderLayers();
  document.querySelector('[data-tab="maker"]').click();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  toast('✅ نمونه‌کارت باز شد — حالا ویرایشش کن! 🎨');
}
$('#sampleSearch').oninput = renderSamples;
$('#sampleOcc').onchange = renderSamples;

// ---------- ۷) تب ۱۰۰ عکس ----------
function renderPhotos() {
  const g = $('#photosGrid'); g.innerHTML = '';
  PHOTOS.forEach((p, i) => {
    const d = document.createElement('div'); d.className = 'photo-item';
    d.innerHTML = `<div style="position:relative"><img src="${p.f}" loading="lazy" alt="${p.t}">` +
      (p.premium ? `<div class="lock-veil" title="پرمیوم">🔒</div>` : '') + `</div>` +
      `<div class="pname">${p.t}</div>` +
      `<div class="prow"><button class="btn sm" data-a="bg">🖼️ پس‌زمینه</button><button class="btn sm" data-a="ph">👤 قاب‌عکس</button></div>`;
    const use = a => {
      if (p.premium && !Premium.isVIP()) { Premium.open(); toast('🔒 این عکس پرمیوم است!'); return; }
      if (a === 'bg') { const im = $('#cardBgImg'); im.src = p.f; im.classList.add('show'); }
      else { const im = $('#cardPhoto'); im.src = p.f; im.classList.remove('hidden'); }
      document.querySelector('[data-tab="maker"]').click();
      window.scrollTo({ top: 0, behavior: 'smooth' }); toast('🖼️ عکس روی کارت نشست!');
    };
    d.querySelectorAll('button').forEach(b => b.onclick = () => use(b.dataset.a));
    const veil = d.querySelector('.lock-veil');
    if (veil) veil.onclick = () => use('bg');
    g.appendChild(d);
  });
}

// شروع فاز ۲
renderLayers(); renderSamples(); renderPhotos();
