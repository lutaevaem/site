
// Scroll progress
const bar=document.getElementById('scrollbar');
function onScroll(){const h=document.documentElement;const sc=h.scrollTop, max=h.scrollHeight-h.clientHeight;bar.style.width=(sc/max*100)+'%';}
addEventListener('scroll', onScroll, {passive:true}); onScroll();
// Year
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
// Counter animation
function animateNumber(el){ const target=+el.dataset.to; let n=0; const step=Math.max(1, Math.round(target/60));
  const tick=()=>{ n+=step; if(n>=target){n=target} el.textContent=n; if(n<target) requestAnimationFrame(tick)}; tick();}
const io=new IntersectionObserver((entries)=>entries.forEach(e=>{ if(e.isIntersecting){ animateNumber(e.target); io.unobserve(e.target);} }), {threshold:.6});
document.querySelectorAll('[data-to]').forEach(el=>io.observe(el));
// Reveal on scroll (for testimonials if needed)
const revealEls = document.querySelectorAll('.reveal');
const rio = new IntersectionObserver((ents)=>{ ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); rio.unobserve(e.target);} });},{threshold:.25});
revealEls.forEach(el=>rio.observe(el));

// Typewriter effect for subheadline
(function(){
  const el = document.getElementById('typed');
  if(!el) return;
  const lines = [
    'Топ-менеджер международного холдинга 8000+',
    '+281% выручки за 2 года',
    'HR‑системы и BI‑аналитика'
  ];
  let i=0, j=0, dir=1, pause=0;
  function tick(){
    if(pause>0){ pause--; return requestAnimationFrame(tick); }
    const full = lines[i];
    el.textContent = full.slice(0,j);
    j += dir;
    if(j===full.length+1){ dir=-1; pause=35; }
    if(j===0){ dir=1; i=(i+1)%lines.length; pause=10; }
    requestAnimationFrame(tick);
  }
  tick();
})();

// Staggered reveal
const r2 = new IntersectionObserver((ents)=>{
  ents.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      // stagger children
      const kids = e.target.querySelectorAll('.card,.feat,.price-card');
      kids.forEach((k,idx)=>k.style.transitionDelay = (0.05*idx)+'s');
      r2.unobserve(e.target);
    }
  });
},{threshold:.25});
document.querySelectorAll('.reveal').forEach(el=>r2.observe(el));

// Two-step form behavior
document.querySelectorAll('.form.two-step').forEach(form=>{
  const step1=form.querySelector('.step-1');
  const step2=form.querySelector('.step-2');
  const next=form.querySelector('.next');
  const prev=form.querySelector('.prev');
  const dots=form.querySelectorAll('.dots span');
  function setStep(n){
    if(n===1){
      step1.classList.add('active'); step2.hidden=true; step2.classList.remove('active');
      dots[0].classList.add('on'); dots[1].classList.remove('on');
    }else{
      step1.classList.remove('active'); step2.hidden=false; step2.classList.add('active');
      dots[0].classList.remove('on'); dots[1].classList.add('on');
    }
  }
  next&&next.addEventListener('click', ()=>{
    if(form.reportValidity()){ setStep(2); }
  });
  prev&&prev.addEventListener('click', ()=>setStep(1));
  setStep(1);
});

// UTM capture for forms
(function(){
  const params = new URLSearchParams(location.search);
  const utm = {
    utm_source: params.get('utm_source') || 'site',
    utm_medium: params.get('utm_medium') || 'web',
    utm_campaign: params.get('utm_campaign') || 'default',
    utm_content: params.get('utm_content') || ''
  };
  document.querySelectorAll('form[data-utm-capture="true"]').forEach(form=>{
    ['utm_source','utm_medium','utm_campaign','utm_content'].forEach(k=>{
      const input = form.querySelector(`input[name="${k}"]`);
      if(input){ input.value = utm[k] }
    });
  });
})();

// Lightweight event tracking (GA4-compatible dataLayer fallback)
window.dataLayer = window.dataLayer || [];
function track(event, params){ try{ window.dataLayer.push(Object.assign({event}, params||{})); }catch(e){ console.log('track', event, params); } }

// Bind clicks
document.querySelectorAll('.btn-cta,.sticky-cta,a[href*="t.me/"]').forEach(el=>{
  el.addEventListener('click', ()=>track('cta_click', {id: el.textContent.trim() || el.getAttribute('aria-label') || 'cta'}));
});
// Form submit
document.querySelectorAll('form').forEach(f=>f.addEventListener('submit', ()=>track('lead_submit', {form: f.getAttribute('name')||'form'})));
