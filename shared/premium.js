// ===== تبریک‌ساز SMH — سیستم درآمدی (پرمیوم • تبلیغات • واترمارک) =====
// نقطه‌های اتصال واقعی بازار/مایکت/تپسل/زرین‌پال اینجاست — مستندات: MONETIZATION_FA.md
const Premium = {
  // شناسه‌های واقعی پنل کافه‌بازار/مایکت را اینجا می‌گذاریم (از کاربر گرفته می‌شود)
  SKUS: { monthly: 'vip_monthly', yearly: 'vip_yearly', forever: 'vip_forever' },
  isVIP() { return localStorage.getItem('smh_vip') === '1'; },
  open() { $('#vipModal').classList.remove('hidden'); },
  close() { $('#vipModal').classList.add('hidden'); },
  _unlock(msg) {
    localStorage.setItem('smh_vip', '1');
    this.close(); this.badge();
    toast(msg || '👑 پرمیوم فعال شد! خوش بگذره! 🎉');
  },

  // --- درگاه‌های پرداخت (استاب؛ در WebView فروشگاهی با کتابخانه بازار/مایکت پر می‌شود) ---
  async pay(via, plan) {
    plan = plan || 'yearly';
    const sku = this.SKUS[plan];
    const PRICES = { monthly: '۳۹٬۰۰۰', yearly: '۲۹۹٬۰۰۰', forever: '۴۹۹٬۰۰۰' };
    console.log('[PAY]', { via, plan, sku, price: PRICES[plan] });
    // مسیر نیتیو بازار (وقتی پلاگین Capacitor وصل شد)
    if (via === 'bazaar' && window.BazaarBilling && window.BazaarBilling.purchase) {
      toast('💳 اتصال به پرداخت بازار…');
      try {
        const r = await window.BazaarBilling.purchase(sku);
        if (r && r.ok) { this._unlock('✅ خرید بازار تأیید شد! 👑'); return; }
      } catch (e) { toast('❌ خرید انجام نشد.'); return; }
    }
    // بازار:  CafeBazaar IAB  → BillingClient.purchase(sku)
    // مایکت:  Myket IAB       → MyketBilling.purchase(sku)
    // وب:     ZarinPal        → window.open('https://www.zarinpal.com/...')
    toast(`💳 اتصال به درگاه «${via}» — پلن ${plan} (${PRICES[plan]} تومان)…`);
    setTimeout(() => toast('ℹ️ پرداخت واقعی در نسخه فروشگاهی (بازار/مایکت) فعال می‌شود. برای تست، کد SMH-VIP-2026 را بزن.'), 1800);
  },
  activate(code) {
    if ((code || '').trim().toUpperCase() === 'SMH-VIP-2026') {
      localStorage.setItem('smh_vip', '1');
      this.close(); this.badge();
      toast('👑 پرمیوم فعال شد! خوش بگذره! 🎉');
    } else toast('❌ کد نامعتبر است.');
  },
  badge() {
    const b = $('#btnVipTop'); if (!b) return;
    if (this.isVIP()) { b.textContent = '👑 پرمیوم فعال'; b.classList.add('gold'); }
  },

  // --- تبلیغ جایزه‌ای/بین‌ابینی خانگی (جای تپسل): هر ۳ خروجی، یک‌بار ---
  beforeExport(run) {
    let n = +(localStorage.getItem('smh_exp') || 0) + 1;
    localStorage.setItem('smh_exp', n);
    if (this.isVIP() || n % 3 !== 0) { run(); return; }
    // TODO واقعی: TapsellPlus.showInterstitialAd(zoneId, ...)
    const d = document.createElement('div'); d.className = 'ad-full';
    d.innerHTML = `<div class="in">
      <h2 class="anim-text-rainbow">💎 از تبلیغ خسته شدی؟</h2>
      <p class="anim-fade">با پرمیوم: بدون تبلیغ، بدون واترمارک، خروجی 4K!</p>
      <p>دانلود تا <b id="adCount">۵</b> ثانیه دیگر… (جای تبلیغ تپسل/یکتانت)</p>
      <button class="btn primary" id="adGo" disabled>⏳ صبر کن…</button>
      <button class="btn gold" id="adVip">💎 خرید پرمیوم</button></div>`;
    document.body.appendChild(d);
    let c = 5;
    const t = setInterval(() => {
      c--; $('#adCount').textContent = c;
      if (c <= 0) {
        clearInterval(t);
        const g = $('#adGo'); g.disabled = false; g.textContent = '⬇️ ادامه دانلود';
        g.onclick = () => { d.remove(); run(); };
      }
    }, 1000);
    $('#adVip').onclick = () => { d.remove(); this.open(); };
  }
};

$('#btnVipTop').onclick = () => Premium.open();
$('#vipClose').onclick = () => Premium.close();
$('#vipModal').addEventListener('click', e => { if (e.target.id === 'vipModal') Premium.close(); });
$('#vipActivate').onclick = () => Premium.activate($('#vipCode').value);
document.querySelectorAll('.plan').forEach(p => p.onclick = () => {
  document.querySelectorAll('.plan').forEach(x => x.classList.remove('hot'));
  p.classList.add('hot'); Premium._plan = p.dataset.plan;
  toast('✅ پلن انتخاب شد: ' + p.querySelector('b').textContent);
});
document.querySelectorAll('[data-pay]').forEach(b => b.onclick = () => Premium.pay(b.dataset.pay, Premium._plan || 'yearly'));

// پیچیدن دور دکمه خروجی PNG: واترمارک + کیفیت + تبلیغ (رایگان‌ها)
(function wrapExport() {
  const btn = $('#btnPNG'); if (!btn || !btn.onclick) return;
  const orig = btn.onclick;
  window.SMH_Q = 800; // کیفیت پایه رایگان
  btn.onclick = e => Premium.beforeExport(() => {
    window.SMH_Q = Premium.isVIP() ? 1600 : 800; // پرمیوم = 4K
    if (!Premium.isVIP()) {
      // واترمارک موقت فقط برای لحظه رندر خروجی
      const w = document.createElement('div');
      w.className = 'watermark-tag'; w.id = 'tmpWm';
      w.textContent = 'ساخته‌شده با تبریک‌ساز SMH 💜';
      $('#card').appendChild(w);
      try { orig(e); } finally { setTimeout(() => w.remove(), 500); }
    } else orig(e);
  });
})();
Premium.badge();
