(()=>{
  // 「勉強する」では、総まとめを確認してから問題へ進む
  const wait=()=>new Promise(r=>setTimeout(r,0));
  function install(){
    const original=window.topicQuiz;
    if(typeof original!=='function' || typeof window.lesson!=='function') return false;
    if(window.__studyFlowInstalled) return true;
    window.__studyFlowInstalled=true;
    window.__topicQuizOriginal=original;
    window.topicQuiz=function(id,one){
      if(window.__studyFlowOpening) return original.apply(this,arguments);
      window.__studyFlowOpening=true;
      try{
        window.lesson(id);
        wait().then(()=>{
          // 総まとめ画面にある既存の1問ボタンを整理して、問題数を選べるようにする
          [...document.querySelectorAll('button')].filter(b=>String(b.getAttribute('onclick')||'').includes('topicQuiz(')).forEach(b=>b.remove());
          const card=document.querySelector('#app .card:last-child');
          if(card){
            const oneBtn=document.createElement('button');
            oneBtn.className='primary';
            oneBtn.textContent='✏️ まず1問だけ確認する';
            oneBtn.onclick=()=>{(window.__deepTopicQuiz||window.__topicQuizOriginal)(id,true)};
            card.appendChild(oneBtn);
            const tenBtn=document.createElement('button');
            tenBtn.className='primary';
            tenBtn.textContent='🔥 この分野を10問解く';
            tenBtn.onclick=()=>{(window.__deepTopicQuiz||window.__topicQuizOriginal)(id,false)};
            card.appendChild(tenBtn);
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
    const timer=setInterval(()=>{if(install()||++n>40) clearInterval(timer)},50);
  }
})();