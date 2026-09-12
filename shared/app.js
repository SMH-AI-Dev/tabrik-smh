// ===== تبریک‌ساز SMH — منطق کامل برنامه =====
const $=s=>document.querySelector(s);
const card=$('#card'),fxCanvas=$('#fxCanvas'),fctx=fxCanvas.getContext('2d');
function sizeFx(){const r=card.getBoundingClientRect(); // افکت فقط داخل قاب کارت
  fxCanvas.width=Math.max(1,Math.round(r.width));fxCanvas.height=Math.max(1,Math.round(r.height))}
sizeFx();addEventListener('resize',sizeFx);addEventListener('load',sizeFx);
if(window.ResizeObserver){new ResizeObserver(sizeFx).observe(card)}
let particles=[],fxType='confetti',fxOn=true,intensity=90;

// ---------- ناوبری تب‌ها ----------
document.querySelectorAll('.nav-btn[data-tab]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.nav-btn[data-tab]').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  $('#tab-'+b.dataset.tab).classList.add('active');
  if(b.dataset.tab==='gallery')renderGallery();
});

// ---------- قالب‌ها ----------
const THEMES={
  birthday:{name:'🎂 تولد شاد',bg:'linear-gradient(135deg,#7c3aed,#ec4899,#f59e0b)',title:'تولدت مبارک! 🎂',msg:'امروز، روز توست! بدرخش، بخند و بهترین‌ها را زندگی کن. 🎈',fx:'confetti'},
  nowruz:{name:'🌸 نوروز',bg:'linear-gradient(135deg,#059669,#84cc16,#fbbf24)',title:'نوروز پیروز! 🌸',msg:'سال نو، دل نو، آرزوهای نو! هفت‌سین دلت همیشه پر باشد. 🌷',fx:'petals'},
  yalda:{name:'🍉 یلدا',bg:'linear-gradient(135deg,#7f1d1d,#b91c1c,#1e1b4b)',title:'یلدات مبارک! 🍉',msg:'بلندترین شب سال، کوتاه‌ترین غم‌هایت باشد. انار دلت همیشه دانه‌دانه شادی! ❤️',fx:'hearts'},
  valentine:{name:'❤️ عشق',bg:'linear-gradient(135deg,#881337,#e11d48,#fb7185)',title:'دوستت دارم! ❤️',msg:'تو قشنگ‌ترین اتفاق زندگی منی. روز عشق مبارک! 💕',fx:'hearts'},
  wedding:{name:'💍 عروسی',bg:'linear-gradient(135deg,#6d28d9,#c026d3,#f9a8d4)',title:'پیوندتان مبارک! 💍',msg:'آرزوی خوشبختی ابدی برای عروس و داماد عزیز! 🕊️',fx:'sparkle'},
  mother:{name:'🤱 مادر',bg:'linear-gradient(135deg,#be185d,#f472b6,#fde68a)',title:'روزت مبارک مامان! 🤱',msg:'بهشت زیر پای توست. ممنون که هستی، فرشته زمینی من! 🌹',fx:'petals'},
  father:{name:'👨‍👧 پدر',bg:'linear-gradient(135deg,#1e3a8a,#0369a1,#22d3ee)',title:'روزت مبارک بابا! 👨‍👧',msg:'کوه پشت و پناه من! سایه‌ات مستدام. 💙',fx:'confetti'},
  teacher:{name:'📚 معلم',bg:'linear-gradient(135deg,#92400e,#d97706,#fde68a)',title:'سپاس معلم عزیزم! 📚',msg:'الفبای زندگی را از تو آموختم. روزت مبارک! ✏️',fx:'sparkle'},
  grad:{name:'🎓 فارغ‌التحصیلی',bg:'linear-gradient(135deg,#111827,#4b5563,#fbbf24)',title:'فارغ‌التحصیلی مبارک! 🎓',msg:'این تازه اول راه است! به سوی قله‌ها! 🚀',fx:'fireworks'},
  baby:{name:'👶 نوزاد',bg:'linear-gradient(135deg,#0ea5e9,#bae6fd,#fef9c3)',title:'قدم نو رسیده مبارک! 👶',msg:'فرشته کوچولو به جمع‌مان خوش آمد! 🍼',fx:'bubbles'},
  eid:{name:'🌙 عید',bg:'linear-gradient(135deg,#065f46,#0d9488,#fbbf24)',title:'عید مبارک! 🌙',msg:'طاعاتت قبول! عید سعید بر تو و خانواده مبارک. 🕌',fx:'sparkle'},
  thanks:{name:'🙏 تشکر',bg:'linear-gradient(135deg,#4d7c0f,#65a30d,#fde68a)',title:'ممنونم! 🙏',msg:'از صمیم قلب سپاسگزارم. خوبی‌ات را هرگز فراموش نمی‌کنم. 🌿',fx:'petals'},
  getwell:{name:'🌿 سلامتی',bg:'linear-gradient(135deg,#0f766e,#34d399,#ecfdf5)',title:'بهبودی کامل! 🌿',msg:'آرزوی سلامتی و شفای عاجل. زود خوب شو! 💪',fx:'bubbles'},
  condolence:{name:'🕊️ تسلیت',bg:'linear-gradient(135deg,#1f2937,#374151,#6b7280)',title:'تسلیت عرض می‌کنم 🕊️',msg:'در غم شما شریکم. روحش شاد و یادش گرامی. 🤍',fx:'none'}
};
function applyTheme(key){
  const t=THEMES[key];if(!t)return;
  $('#cardBg').style.background=t.bg;
  $('#inTitle').value=t.title;$('#inMsg').value=t.msg;syncText();
  setFx(t.fx==='none'?null:t.fx);
  document.querySelectorAll('#templateRow .chip').forEach(c=>c.classList.toggle('on',c.dataset.k===key));
}
$('#occasion').onchange=e=>applyTheme(e.target.value);

// چیپ‌های قالب + گالری
const tplRow=$('#templateRow'),galT=$('#galleryTemplates');
Object.entries(THEMES).forEach(([k,t])=>{
  const c=document.createElement('button');c.className='chip';c.dataset.k=k;c.textContent=t.name;
  c.onclick=()=>{$('#occasion').value=k;applyTheme(k)};tplRow.appendChild(c);
  const d=document.createElement('div');d.className='tpl';
  d.innerHTML=`<div class="swatch" style="background:${t.bg}"></div><p>${t.name}<br><small>${t.title}</small></p>`;
  d.onclick=()=>{$('#occasion').value=k;applyTheme(k);document.querySelector('[data-tab=maker]').click();window.scrollTo({top:0,behavior:'smooth'})};
  galT.appendChild(d);
});

// ---------- پس‌زمینه ----------
const GRADS=['linear-gradient(135deg,#7c3aed,#ec4899,#f59e0b)','linear-gradient(135deg,#06b6d4,#3b82f6,#8b5cf6)','linear-gradient(135deg,#059669,#84cc16,#fbbf24)','linear-gradient(135deg,#7f1d1d,#db2777,#1e1b4b)','linear-gradient(135deg,#111827,#f59e0b,#ef4444)','linear-gradient(135deg,#0f766e,#34d399,#fef9c3)'];
GRADS.forEach(g=>{const b=document.createElement('button');b.className='chip';b.textContent='🎨';b.title=g;b.onclick=()=>{$('#cardBg').style.background=g;$('#cardBgImg').classList.remove('show')};$('#bgRow').appendChild(b)});
$('#bgColor').oninput=e=>{$('#cardBg').style.background=e.target.value;$('#cardBgImg').classList.remove('show')};
$('#btnBgUp').onclick=()=>$('#bgInput').click();
$('#bgInput').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{const im=$('#cardBgImg');im.src=ev.target.result;im.classList.add('show')};r.readAsDataURL(f)};

// ---------- عکس ----------
$('#btnPhotoUp').onclick=()=>$('#photoInput').click();
$('#photoInput').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{const im=$('#cardPhoto');im.src=ev.target.result;im.classList.remove('hidden')};r.readAsDataURL(f)};
$('#photoSize').oninput=e=>{const im=$('#cardPhoto');im.style.width=im.style.height=e.target.value+'px'};
$('#frameStyle').onchange=e=>{const im=$('#cardPhoto');im.className='card-photo '+e.target.value};
$('#btnClearImg').onclick=()=>{$('#cardPhoto').classList.add('hidden');$('#cardBgImg').classList.remove('show')};

// ---------- متن ----------
function syncText(){$('#cardTitle').textContent=$('#inTitle').value;$('#cardMsg').textContent=$('#inMsg').value;$('#cardSign').textContent=$('#inSign').value}
['inTitle','inMsg','inSign'].forEach(id=>$('#'+id).oninput=syncText);
$('#fontSel').onchange=e=>{$('#cardTitle').style.fontFamily=e.target.value;$('#cardMsg').style.fontFamily=e.target.value};
$('#textColor').oninput=e=>{$('#cardTitle').style.color=e.target.value};
$('#textSize').oninput=e=>{$('#cardTitle').style.fontSize=e.target.value+'px'};
$('#textAnim').onchange=e=>{const t=$('#cardTitle');t.className='card-title '+e.target.value};
$('#btnTTS').onclick=()=>{try{const u=new SpeechSynthesisUtterance($('#inTitle').value+'. '+$('#inMsg').value);u.lang='fa-IR';speechSynthesis.cancel();speechSynthesis.speak(u)}catch{alert('خوانش صوتی در این مرورگر پشتیبانی نمی‌شود')}};

// ---------- استیکر ----------
const STICKERS=['🎂','🎈','🎁','❤️','🌸','🍉','💍','🕊️','⭐','🎉','🦋','🐣','🌙','🕌','🎓','👶','🧸','🍰','💐','🔥','✨','🎆','🍎','🌹','☃️','🎄','🐟','🍀','💜','🚀'];
STICKERS.forEach(s=>{const b=document.createElement('button');b.className='chip';b.textContent=s;b.onclick=()=>addSticker(s);$('#stickerRow').appendChild(b)});
function addSticker(s,x,y){const d=document.createElement('div');d.className='sticker';d.textContent=s;
  d.style.left=(x??(8+Math.random()*80))+'%';d.style.top=(y??(8+Math.random()*70))+'%';
  d.style.fontSize=(26+Math.random()*26)+'px';d.style.animationDelay=(Math.random()*2)+'s';
  $('#stickerLayer').appendChild(d)}
$('#btnClearSticker').onclick=()=>$('#stickerLayer').innerHTML='';

// ---------- افکت‌ها ----------
const FXS=[['confetti','🎊 بارش'],['hearts','💜 قلب'],['snow','❄️ برف'],['petals','🌸 گلبرگ'],['fireworks','🎆 آتش‌بازی'],['sparkle','✨ جرقه'],['bubbles','🫧 حباب'],['balloons','🎈 بادکنک']];
FXS.forEach(([k,n])=>{const b=document.createElement('button');b.className='chip';b.textContent=n;b.onclick=()=>setFx(k);$('#fxRow').appendChild(b)});
function setFx(k){fxType=k;fxOn=!!k;particles=[]}
$('#fxIntensity').oninput=e=>intensity=+e.target.value;
const EMOJI={confetti:['🎊','🎉','⭐','💜','🎈'],hearts:['❤️','💜','💕','💖','🤍'],snow:['❄️','🤍','❅','⛄'],petals:['🌸','🌹','💮','🏵️'],fireworks:['🎆','🎇','✨','💥'],sparkle:['✨','⭐','💫','🌟'],bubbles:['🫧','⭕','💧'],balloons:['🎈','🎈','🎈','💜']};
function spawn(n){if(!fxOn||!fxType)return;const set=EMOJI[fxType]||EMOJI.confetti;
  for(let i=0;i<n;i++)particles.push({x:Math.random()*fxCanvas.width,y:-20,vx:(Math.random()-.5)*1.6,vy:1+Math.random()*2.4,s:14+Math.random()*22,e:set[Math.floor(Math.random()*set.length)],r:Math.random()*6.28,vr:(Math.random()-.5)*.1,life:1})}
function boom(x,y){for(let i=0;i<70;i++){const a=Math.random()*6.28,sp=1+Math.random()*4;
  particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1,s:12+Math.random()*16,e:['🎆','✨','💥','⭐'][i%4],r:0,vr:.2,life:1,boom:true})}}
function loop(){fctx.clearRect(0,0,fxCanvas.width,fxCanvas.height);
  if(fxOn&&fxType&&particles.length<intensity*3&&Math.random()<.6)spawn(2);
  particles=particles.filter(p=>p.y<fxCanvas.height+40&&p.life>0);
  for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;if(p.boom){p.vy+=.06;p.life-=.008}
    fctx.save();fctx.translate(p.x,p.y);fctx.rotate(p.r);fctx.globalAlpha=Math.max(p.life,0);fctx.font=p.s+'px serif';fctx.fillText(p.e,0,0);fctx.restore()}
  requestAnimationFrame(loop)}loop();
$('#btnFire').onclick=()=>boom(fxCanvas.width/2,fxCanvas.height/3);
fxCanvas.onclick=e=>{const r=fxCanvas.getBoundingClientRect();boom(e.clientX-r.left,e.clientY-r.top)};
$('#btnSurprise').onclick=()=>{boom(fxCanvas.width/2,fxCanvas.height/3);addSticker(STICKERS[Math.floor(Math.random()*STICKERS.length)]);try{navigator.vibrate&&navigator.vibrate(80)}catch{}};
$('#btnPresent').onclick=()=>{const el=$('#card');el.requestFullscreen&&el.requestFullscreen()};

// ---------- موسیقی ----------
const audio=$('#audioEl');
$('#btnMusicFile').onclick=()=>$('#musicInput').click();
$('#musicInput').onchange=e=>{const f=e.target.files[0];if(!f)return;audio.src=URL.createObjectURL(f);if($('#musicOn').checked)audio.play()};
$('#musicOn').onchange=e=>{e.target.checked?audio.play().catch(()=>{}):audio.pause()};
$('#vol').oninput=e=>audio.volume=e.target.value/100;audio.volume=.7;
let actx=null;
$('#btnMelody').onclick=()=>{ // ملودی «تولدت مبارک» با WebAudio (بدون فایل)
  try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();
  const notes=[262,262,294,330,330,294,262,294,330,330,294,392,392,370,330,294,262];
  let t=actx.currentTime;notes.forEach((f,i)=>{const o=actx.createOscillator(),g=actx.createGain();
    o.type=i%4===3?'triangle':'sine';o.frequency.value=f;g.gain.value=.0001;
    o.connect(g);g.connect(actx.destination);o.start(t);g.exponentialRampToValueAtTime(.5,t+.05);
    g.exponentialRampToValueAtTime(.0001,t+.42);o.stop(t+.45);t+=.34});
  toast('🎹 ملودی تولد در حال پخش است…')}catch{toast('پخش ملودی ممکن نیست')}};
let mr=null,chunks=[];
$('#btnRecord').onclick=async e=>{try{
  if(mr&&mr.state==='recording'){mr.stop();e.target.textContent='🎤 ضبط وویس تبریک';return}
  const s=await navigator.mediaDevices.getUserMedia({audio:true});mr=new MediaRecorder(s);chunks=[];
  mr.ondataavailable=ev=>chunks.push(ev.data);
  mr.onstop=()=>{audio.src=URL.createObjectURL(new Blob(chunks,{type:'audio/webm'}));audio.play();toast('✅ وویس تو روی کارت نشست!')};
  mr.start();e.target.textContent='⏹️ توقف ضبط'}catch{alert('دسترسی به میکروفون داده نشد')}};

// ---------- گنجینه متن ----------
const QUOTES={birthday:['امروز فقط مال توئه! تولدت مبارک عزیزترینم 🎂','یک سال قشنگ‌تر شدی! تولدت مبارک 🎈','آرزومه امسال همه آرزوهات برآورده بشه ✨'],
nowruz:['نوروز پیروز! سالی پر از شادی و سلامتی 🌸','هفت‌سین دلت آباد! عیدت مبارک 🌷','بهار آمد… دلت همیشه بهاری 🌿'],
love:['تو دلیل لبخند هر روز منی ❤️','عشق یعنی تو… روزت مبارک 💕','قلبم پیش توئه، مواظبش باش 💖'],
thanks:['ممنون که هستی 🙏','خوبی‌ات را هرگز فراموش نمی‌کنم 🌿','از ته قلبم سپاسگزارم ✨'],
religious:['عید سعید بر شما مبارک 🌙','طاعاتتان قبول 🕌','در پناه حق باشید 🤍'],
funny:['پیر شدی ولی هنوز دوست‌داشتنی! 😂🎂','شمع‌ها را فوت کن، آرزویت مال من! 😜','سنت رفت بالا، عقلت سر جاش! 😅']};
let curQuote='';
$('#btnRandomText').onclick=()=>{const c=$('#textCat').value,q=QUOTES[c];curQuote=q[Math.floor(Math.random()*q.length)];$('#quoteBox').textContent='“'+curQuote+'”'};
$('#btnUseText').onclick=()=>{if(!curQuote)return;$('#inMsg').value=curQuote;syncText();document.querySelector('[data-tab=maker]').click()};

// ---------- ذخیره / گالری / خروجی ----------
function state(){return{title:$('#inTitle').value,msg:$('#inMsg').value,sign:$('#inSign').value,bg:$('#cardBg').style.background,photo:$('#cardPhoto').src||'',stickers:$('#stickerLayer').innerHTML}}
function loadState(s){$('#inTitle').value=s.title;$('#inMsg').value=s.msg;$('#inSign').value=s.sign;syncText();
  if(s.bg)$('#cardBg').style.background=s.bg;
  if(s.photo){$('#cardPhoto').src=s.photo;$('#cardPhoto').classList.remove('hidden')}
  $('#stickerLayer').innerHTML=s.stickers||''}
$('#btnSave').onclick=()=>{const all=JSON.parse(localStorage.getItem('smh_cards')||'[]');all.push({...state(),date:new Date().toLocaleString('fa-IR')});localStorage.setItem('smh_cards',JSON.stringify(all));toast('💾 کارت ذخیره شد!');renderGallery()};
function renderGallery(){const g=$('#myGallery');g.innerHTML='';const all=JSON.parse(localStorage.getItem('smh_cards')||'[]');
  if(!all.length){g.innerHTML='<p class="hint">هنوز کارتی ذخیره نشده — بساز و ذخیره کن! 🎨</p>';return}
  all.forEach((s,i)=>{const d=document.createElement('div');d.className='tpl';
    d.innerHTML=`<div class="swatch" style="background:${s.bg}"></div><p>${s.title}<br><small>${s.date}</small></p>`;
    d.onclick=()=>{loadState(s);document.querySelector('[data-tab=maker]').click()};
    const del=document.createElement('button');del.className='btn sm danger';del.textContent='🗑️ حذف';
    del.onclick=ev=>{ev.stopPropagation();const a=JSON.parse(localStorage.getItem('smh_cards')||'[]');a.splice(i,1);localStorage.setItem('smh_cards',JSON.stringify(a));renderGallery()};
    d.appendChild(del);g.appendChild(d)})}
$('#btnPNG').onclick=()=>{ // خروجی PNG بدون کتابخانه (SVG foreignObject)
  try{const node=$('#card').cloneNode(true);node.style.transform='none';
  const xml=new XMLSerializer().serializeToString(node);
  const Q=window.SMH_Q||800, QH=Math.round(Q*1.25);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${Q}" height="${QH}"><foreignObject width="100%" height="100%">${xml}</foreignObject></svg>`;
  const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=Q;c.height=QH;
    c.getContext('2d').drawImage(img,0,0,Q,QH);const a=document.createElement('a');
    a.download='tabrik-card.png';a.href=c.toDataURL('image/png');a.click();toast('⬇️ خروجی PNG دانلود شد!')};
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}catch{window.print()}};
$('#btnPrint').onclick=()=>window.print();
$('#btnShare').onclick=async()=>{const d={title:'کارت تبریک من 🎉',text:$('#inTitle').value+' — '+$('#inMsg').value,url:location.href};
  try{if(navigator.share){await navigator.share(d)}else{await navigator.clipboard.writeText(d.text);toast('📋 متن کارت کپی شد!')}}catch{}};
function toast(m){const t=document.createElement('div');t.textContent=m;
  t.style.cssText='position:fixed;bottom:24px;right:50%;transform:translateX(50%);background:#111827ee;color:#fff;padding:12px 22px;border-radius:999px;z-index:99;border:1px solid #fbbf24;animation:fadeUp .4s';
  document.body.appendChild(t);setTimeout(()=>t.remove(),2600)}
// شروع
applyTheme('birthday');addSticker('🎈',12,12);addSticker('🎂',80,20);addSticker('✨',70,75);
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{})}
