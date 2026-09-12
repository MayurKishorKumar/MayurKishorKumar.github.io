const coinCount=document.getElementById('coinCount');
const worldNumber=document.getElementById('worldNumber');
const levelPercent=document.getElementById('levelPercent');
const popup=document.getElementById('coinPopup');
let coins=Number(localStorage.getItem('mayurCoins')||0);
coinCount.textContent=String(coins).padStart(2,'0');

function goTo(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});}
document.querySelectorAll('.level-link,.map-node').forEach(btn=>btn.addEventListener('click',()=>goTo(btn.dataset.target)));

const collected=new Set(JSON.parse(localStorage.getItem('mayurCollected')||'[]'));
document.querySelectorAll('.coin-trigger').forEach((block,index)=>{
  const key=`coin-${index}`;
  if(collected.has(key)){block.classList.add('used');block.textContent='✓';block.disabled=true;return;}
  block.addEventListener('click',e=>{
    coins++;collected.add(key);localStorage.setItem('mayurCoins',coins);localStorage.setItem('mayurCollected',JSON.stringify([...collected]));
    coinCount.textContent=String(coins).padStart(2,'0');block.classList.add('used');block.textContent='✓';block.disabled=true;
    popup.style.left=`${e.clientX}px`;popup.style.top=`${e.clientY}px`;popup.classList.remove('show');void popup.offsetWidth;popup.classList.add('show');setTimeout(()=>popup.classList.remove('show'),650);
  });
});

const dialogue=document.getElementById('dialogue');
document.querySelectorAll('.info-trigger').forEach(block=>block.addEventListener('click',()=>{
  dialogue.querySelector('.dialogue-title').textContent=block.dataset.title;
  dialogue.querySelector('.dialogue-text').textContent=block.dataset.text;
  dialogue.classList.add('show');
}));
dialogue.querySelector('.dialogue-close').addEventListener('click',()=>dialogue.classList.remove('show'));

const checkpoints=document.querySelectorAll('.checkpoint');
const checkpointObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.12});
checkpoints.forEach(x=>checkpointObserver.observe(x));

const levels=[...document.querySelectorAll('[data-world]')];
const mapNodes=[...document.querySelectorAll('.map-node')];
const worldObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  const world=entry.target.dataset.world;worldNumber.textContent=world;
  const node=mapNodes.find(x=>x.dataset.target===entry.target.id);mapNodes.forEach(x=>x.classList.toggle('active',x===node));
  const index=['1-1','1-2','1-3','1-4'].indexOf(world);levelPercent.textContent=String(Math.max(1,index+1)).padStart(2,'0');
}),{threshold:.35});
levels.forEach(x=>worldObserver.observe(x));

const themeToggle=document.getElementById('themeToggle');
let night=localStorage.getItem('mayurTheme')==='night';
function setTheme(){document.body.classList.toggle('night',night);themeToggle.textContent=night?'☾ NIGHT':'☀ DAY';themeToggle.setAttribute('aria-label',night?'Switch to day':'Switch to night');}
setTheme();
themeToggle.addEventListener('click',()=>{night=!night;localStorage.setItem('mayurTheme',night?'night':'day');setTheme();});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape')dialogue.classList.remove('show');
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();window.scrollBy({top:e.key==='ArrowDown'?innerHeight*.78:-innerHeight*.78,behavior:'smooth'});}
});

window.addEventListener('scroll',()=>document.body.style.setProperty('--scroll-y',`${window.scrollY}px`),{passive:true});
