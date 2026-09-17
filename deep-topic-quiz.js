(()=>{
'use strict';
// 「分野を10問解く」を、単純な4択の並びではなく「資料→複数処理→判断」の1級型ミニ問題にする。
function mount(){
  if(window.__deepTopicQuizInstalled)return;
  if(!Array.isArray(window.QB)||typeof window.topicQuiz!=='function')return false;
  window.__deepTopicQuizInstalled=true;
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const pool=id=>QB.filter(q=>q.topicId===id);
  const rank=q=>({重点:5,'計算・判断':4,実戦:3,基礎確認:1,基礎:0}[q.level]??0);
  function pick(id,n){
    const all=shuffle(pool(id));
    const used=new Set(); const out=[];
    const add=q=>{if(q&&!used.has(q.id)){used.add(q.id);out.push(q)}};
    // 1級らしい計算・判断／重点を先に確保する。
    shuffle(all.filter(q=>rank(q)>=5)).forEach(add);
    shuffle(all.filter(q=>rank(q)===4)).forEach(add);
    shuffle(all.filter(q=>rank(q)===3)).forEach(add);
    shuffle(all.filter(q=>rank(q)<=1)).forEach(add);
    return out.slice(0,n);
  }
  function makeSingle(q,i){
    return {kind:'single',title:'資料問題 '+(i+1),sources:[q],q:'次の資料にもとづき、最も適切な処理・金額を選びなさい。\\n\\n【資料】'+q.q,c:q.choices,a:q.a,ex:'【解答のポイント】'+(q.explain||'')+'\\n【ひっかけ】'+(q.confuse||'')};
  }
  function makePair(a,b,i){
    const aa=a.choices[a.a], bb=b.choices[b.a];
    const wrongA=shuffle(a.choices.filter((_,j)=>j!==a.a))[0]||aa;
    const wrongB=shuffle(b.choices.filter((_,j)=>j!==b.a))[0]||bb;
    const choices=[aa+' ／ '+bb,aa+' ／ '+wrongB,wrongA+' ／ '+bb,wrongA+' ／ '+wrongB];
    return {kind:'pair',title:'複合資料問題 '+(i+1),sources:[a,b],q:'次の資料A・Bについて、それぞれ最も適切な答えの組合せを選びなさい。\\n\\n【資料A】'+a.q+'\\n\\n【資料B】'+b.q,c:choices,a:0,ex:'【資料A】'+(a.explain||'')+'\\n【資料B】'+(b.explain||'')+'\\n【注意】2つの処理を別々に判断してから組み合わせる。'};
  }
  function makeTriple(a,b,c,i){
    const vals=[a,b,c].map(x=>x.choices[x.a]);
    const wrongs=[a,b,c].map(x=>shuffle(x.choices.filter((_,j)=>j!==x.a))[0]||x.choices[x.a]);
    const choices=[vals.join(' ／ '),[vals[0],vals[1],wrongs[2]].join(' ／ '),[vals[0],wrongs[1],vals[2]].join(' ／ '),wrongs.join(' ／ ')];
    return {kind:'triple',title:'総合資料問題 '+(i+1),sources:[a,b,c],q:'次の3つの資料について、それぞれ最も適切な処理・判断の組合せを選びなさい。\\n\\n【資料A】'+a.q+'\\n\\n【資料B】'+b.q+'\\n\\n【資料C】'+c.q,c:choices,a:0,ex:'【A】'+(a.explain||'')+'\\n【B】'+(b.explain||'')+'\\n【C】'+(c.explain||'')+'\\n【本試験のコツ】資料ごとに条件を切り分け、最後に解答欄へまとめる。'};
  }
  window.__deepTopicQuiz=function(id,one){
    const qs=pick(id,10);
    if(one){
      // 1問確認は従来どおり。ただし「重点・計算・判断」を優先。
      const q=qs[0]||pool(id)[0];
      if(q){return window.__topicQuizOriginal?window.__topicQuizOriginal(id,true):null;}
      return window.__topicQuizOriginal?window.__topicQuizOriginal(id,true):null;
    }
    if(qs.length<2)return window.__topicQuizOriginal?window.__topicQuizOriginal(id,false):null;
    const session=[];
    // 1～3問目：単独の計算・判断。4～7問目：2資料を組み合わせる。8～10問目：3資料を組み合わせる。
    session.push(...qs.slice(0,3).map((q,i)=>makeSingle(q,i)));
    for(let i=3;i<7;i++)session.push(makePair(qs[i],qs[(i+1)%qs.length],i));
    for(let i=7;i<10&&qs.length>=3;i++)session.push(makeTriple(qs[i%qs.length],qs[(i+1)%qs.length],qs[(i+2)%qs.length],i));
    let i=0,score=0;
    const render=()=>{
      if(i>=session.length){
        document.getElementById('app').innerHTML='<button class="back" onclick="home()">← 終了</button><div class="card"><h2>🎯 1級型10問 完了</h2><div class="statgrid"><div class="stat"><div class="big">'+score+' / '+session.length+'</div><div class="small">正解</div></div><div class="stat"><div class="big">'+Math.round(score/session.length*100)+'%</div><div class="small">正答率</div></div><div class="stat"><div class="big">'+session.length+'</div><div class="small">問題数</div></div></div><p>単純な用語4択ではなく、資料を分けて処理し、最後に組み合わせる形式で練習しました。</p><button class="primary" onclick="home()">分野一覧へ</button></div>';return;
      }
      const x=session[i];
      window.app.innerHTML='<button class="back" onclick="home()">← 終了</button><div class="small">'+(i+1)+' / '+session.length+'　'+esc(x.title)+'　正解 '+score+'問</div><div class="progress"><i style="width:'+Math.round(i/session.length*100)+'%"></i></div><div class="card"><span class="tag">1級実戦型</span><h2 style="white-space:pre-line">'+esc(x.q)+'</h2><div id="deepChoices">'+x.c.map((v,n)=>'<button class="choice" data-n="'+n+'">'+['①','②','③','④'][n]+'　'+esc(v)+'</button>').join('')+'</div><div id="deepResult"></div></div>';
      document.getElementById('app').querySelectorAll('#deepChoices [data-n]').forEach(b=>b.onclick=()=>{
        const n=+b.dataset.n,ok=n===x.a;if(ok)score++;
        window.app.querySelectorAll('#deepChoices [data-n]').forEach(z=>{z.disabled=true;if(+z.dataset.n===x.a)z.classList.add('correct');if(+z.dataset.n===n&&!ok)z.classList.add('wrong')});
        const r=document.getElementById('app').querySelector('#deepResult');r.innerHTML='<div class="answer"><b>'+(ok?'⭕ 正解！':'❌ 不正解')+'</b><br><br><span style="white-space:pre-line">'+esc(x.ex)+'</span><br><br><button class="primary" id="deepNext">'+(i+1===session.length?'結果を見る':'次の1級型問題')+'</button></div>';
        r.querySelector('#deepNext').onclick=()=>{i++;render()};
      });
    };
    render();
  };
  return true;
}
if(!mount()){let n=0;const t=setInterval(()=>{if(mount()||++n>60)clearInterval(t)},50)}
})();