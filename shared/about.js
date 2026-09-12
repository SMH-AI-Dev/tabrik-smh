// ===== About — باران ایموجی، ستاره، تایپ، شمارنده، تیلت =====
// باران ایموجی متحرک
const rain=document.getElementById('emojiRain');
const EM=['🎉','✨','💜','🎂','🎈','🌸','❤️','⭐','🎁','🦋','🍉','💍','🕊️','🌙','🔥','🚀'];
for(let i=0;i<36;i++){const s=document.createElement('span');s.textContent=EM[i%EM.length];
  s.style.left=Math.random()*100+'%';s.style.fontSize=(16+Math.random()*30)+'px';
  s.style.animationDuration=(5+Math.random()*7)+'s';s.style.animationDelay=(-Math.random()*8)+'s';
  s.style.opacity=.5+Math.random()*.5;rain.appendChild(s)}
// آسمان ستاره
const cv=document.getElementById('stars'),cx=cv.getContext('2d');let stars=[];
function sizeCv(){cv.width=innerWidth;cv.height=innerHeight;
  stars=Array.from({length:140},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.8+.3,p:Math.random()*6.28}))}
sizeCv();addEventListener('resize',sizeCv);
(function loop(){cx.clearRect(0,0,cv.width,cv.height);
  for(const s of stars){s.p+=.03;cx.globalAlpha=.4+Math.abs(Math.sin(s.p))*.6;cx.fillStyle='#fff';
    cx.beginPath();cx.arc(s.x,s.y,s.r,0,6.28);cx.fill()}
  cx.globalAlpha=1;requestAnimationFrame(loop)})();
// تایپ روحیه‌دهنده
const LINES=['تو امروز می‌تونی یک نفر را خوشحال کنی… ✨','هر کارت، یک لبخند جدید می‌سازد 💜','تو خالق شادی هستی، ادامه بده! 🚀','دنیا به مهربانی تو نیاز دارد 🌍❤️','بدرخش رفیق! بهترین‌ها در راه‌اند 🌟'];
let li=0,ci=0,del=false;const tw=document.getElementById('typewriter');
(function type(){const line=LINES[li];
  tw.textContent=line.slice(0,ci);
  if(!del){ci++;if(ci>line.length){del=true;setTimeout(type,1600);return;setTimeout(type,60)}}
  else{ci--;if(ci===0){del=false;li=(li+1)%LINES.length}}
  setTimeout(type,del?28:70)})();
// شمارنده
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);
  const n=+e.target.dataset.n;let c=0;const step=Math.max(1,Math.floor(n/60));
  const t=setInterval(()=>{c+=step;if(c>=n){c=n;clearInterval(t)}e.target.textContent=c+(n===100?'٪':'٪'.replace('٪','+'))},30)}));
document.querySelectorAll('.count').forEach(el=>io.observe(el));
// تیلت سه‌بعدی کارت سازنده
const tilt=document.getElementById('tiltCard');
tilt.addEventListener('mousemove',e=>{const r=tilt.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  tilt.style.transform=`perspective(900px) rotateY(${x*10}deg) rotateX(${-y*10}deg)`});
tilt.addEventListener('mouseleave',()=>tilt.style.transform='perspective(900px)');
// جشن کانفتی
document.getElementById('celebrateBtn').onclick=()=>{for(let i=0;i<24;i++)setTimeout(()=>{
  const s=document.createElement('span');s.textContent=EM[Math.floor(Math.random()*EM.length)];
  s.style.cssText=`position:fixed;left:${20+Math.random()*60}%;top:30%;font-size:${20+Math.random()*30}px;z-index:99;pointer-events:none;transition:2s`;
  document.body.appendChild(s);requestAnimationFrame(()=>{s.style.transform=`translate(${(Math.random()-.5)*400}px,${300+Math.random()*300}px) rotate(720deg)`;s.style.opacity=0});
  setTimeout(()=>s.remove(),2100)},i*70);
  try{navigator.vibrate&&navigator.vibrate([80,40,80])}catch{}};
// کپی ایمیل
document.getElementById('copyEmail').onclick=async()=>{try{await navigator.clipboard.writeText('dev.smh.ai@gmail.com');
  document.getElementById('copyEmail').querySelector('span').textContent='✅ کپی شد!'}catch{alert('dev.smh.ai@gmail.com')}};
