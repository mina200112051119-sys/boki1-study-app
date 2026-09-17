(()=>{
  // 「勉強する」から問題へ進む前に、総まとめを必ず読む流れにする
  const wait=()=>new Promise(r=>setTimeout(r,0));
  function install(){
    const original=window.topicQuiz;
    if(typeof original!=='function' || typeof window.lesson!=='function') return false;
    if(window.__studyFlowInstalled) return true;
    window.__studyFlowInstalled=true;
    window.__topicQuizOriginal=original;
    window.topicQuiz=function(id,one){
      if(window.__studyFlowOpening){ return original.apply(this,arguments); }
      window.__studyFlowOpening=true;
      try{
        window.lesson(id);
        wait().then(()=>{
          const buttons=[...document.querySelectorAll('button')].filter(b=>String(b.getAttribute('onclick')||'').includes('topicQuiz('));
          buttons.forEach(b=>b.remove());
          const card=document.querySelector('#app .card:last-child');
          if(card){
            const b=document.createElement('button');
            b.className='primary';
            b.textContent=one?'✏️ この1問を解く':'✏️ この分野の問題へ';
            b.onclick=()=>{
              window.__studyFlowOpening=true;
              window.__topicQuizOriginal(id,!!one);
              window.__studyFlowOpening=false;
            };
            card.appendChild(b);
          }
          window.__studyFlowOpening=false;
          window.scrollTo(0,0);
        });
      }catch(e){
        window.__studyFlowOpening=false;
        original.apply(this,arguments);
      }
    };
    return true;
  }
  if(!install()){
    let n=0;
    const timer=setInterval(()=>{ if(install()||++n>40) clearInterval(timer); },50);
  }
})();