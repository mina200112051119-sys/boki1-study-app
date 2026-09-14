(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const shuffle=a=>a.slice().sort(()=>Math.random()-.5);
  let active=null, step=0, score=0;

  const genericCalc=[
    '与えられた数字を全部そのまま足す',
    '問題文の条件を整理し、必要な数字だけを使って計算する',
    '正解の選択肢を先に決めて数字を合わせる',
    '前の問題と同じ計算式をそのまま使う'
  ];
  const genericJournal=[
    '借方・貸方を考えず、勘定科目だけ覚える',
    '現金が出たら必ず費用にする',
    '資産・負債・純資産・収益・費用の増減を確認する',
    '問題文に出た科目を全部仕訳に入れる'
  ];

  function hasCalc(q){return /[0-9０-９]+.*(?:[＋+\-−×÷*/＝=]|円|%|kg|個|時間|ドル|年|月)/.test(q.q+' '+q.explain);}
  function makeStep(q){
    const explain=String(q.explain||'正解の理由を確認しよう。');
    const confuse=Array.isArray(q.confuse)?q.confuse.join(' '):String(q.confuse||'似た論点と区別する。');
    if(step===1){
      return {title:'① なぜ、その答えになる？',q:'正解の選択肢を選ぶ理由として、いちばん正しいものはどれ？',choices:[explain,'問題文に数字が出てきたら、数字の大きい選択肢を選ぶ','似た用語でも、名前が同じように見えれば同じ処理にする','正解の選択肢を覚えて、理由は考えない'],answer:0,explain:'ここでは「正解を覚える」のではなく、正解になる理由まで確認する。'};
    }
    if(step===2){
      if(hasCalc(q)) return {title:'② 計算の道筋を確認',q:'この問題を解くときの考え方として正しいものはどれ？',choices:[explain,genericCalc[0],genericCalc[2],genericCalc[3]],answer:0,explain:'数字を使う問題では、式そのものを覚えるより「どの数字を、なぜ使うか」を確認する。'};
      return {title:'② 判断の道筋を確認',q:'この問題を判断するとき、正しい考え方はどれ？',choices:[explain,genericJournal[0],genericJournal[1],genericJournal[3]],answer:0,explain:'1級では、用語だけでなく「何が増えた・減った」「なぜその処理をするか」まで考える。'};
    }
    return {title:'③ 似た論点との違い',q:'この問題で特に気をつけたい「混同ポイント」はどれ？',choices:[confuse,'数字が出てきたら、計算せずに最も大きい金額を選ぶ','問題文に出てくる科目はすべて同じ意味だと考える','一度覚えた処理は、条件が変わっても必ず同じ処理にする'],answer:0,explain:'ここまで確認できれば、「答え」だけでなく「間違えやすい理由」まで覚えられる。'};
  }

  function render(q){
    const r=document.getElementById('result'); if(!r)return;
    const d=makeStep(q);
    r.insertAdjacentHTML('beforeend',`<div id="deepDive" style="margin-top:12px;padding:14px;border:2px solid #222;border-radius:14px;background:#fff"><div style="font-weight:800;margin-bottom:7px">🧠 ${esc(d.title)}</div><div style="font-weight:700;line-height:1.6;margin-bottom:8px">${esc(d.q)}</div><div id="deepChoices">${d.choices.map((c,i)=>`<button data-di="${i}" style="width:100%;padding:12px;margin:5px 0;border:0;border-radius:10px;background:#f1f2f4;text-align:left;font-size:15px">${String.fromCharCode(65+i)}　${esc(c)}</button>`).join('')}</div><div id="deepMsg"></div></div>`);
    document.querySelectorAll('#deepChoices button').forEach(b=>b.addEventListener('click',()=>check(q,+b.dataset.di,d)));
  }
  function check(q,n,d){
    const msg=document.getElementById('deepMsg');
    document.querySelectorAll('#deepChoices button').forEach(b=>b.disabled=true);
    const ok=n===d.answer;
    msg.innerHTML=ok?`<div style="margin-top:10px;padding:10px;border-radius:10px;background:#e5f5e8"><b>⭕ 理由まで正解</b><p style="margin:6px 0">${esc(d.explain)}</p>${step<3?'<button id="deepNext" style="width:100%;padding:12px;border:0;border-radius:10px;background:#222;color:#fff">次の掘り下げへ →</button>':'<b>この問題はここまで。次の問題でまた確認しよう。</b>'}</div>`:`<div style="margin-top:10px;padding:10px;border-radius:10px;background:#fff0f0"><b>❌ ここが今回の確認ポイント</b><p style="margin:6px 0"><b>正解：</b>${esc(d.choices[d.answer])}</p><p style="margin:6px 0">${esc(d.explain)}</p>${step<3?'<button id="deepNext" style="width:100%;padding:12px;border:0;border-radius:10px;background:#222;color:#fff">もう一度考えて次へ →</button>':'<b>この考え方を覚えてから次へ進もう。</b>'}</div>`;
    const next=document.getElementById('deepNext');
    if(next)next.onclick=()=>{step++;render(q)};
  }

  window.addEventListener('boki:wrong',e=>{
    const q=e.detail; if(!q)return;
    setTimeout(()=>{
      if(active===q)return;
      active=q;step=1;
      const r=document.getElementById('result'); if(!r)return;
      r.insertAdjacentHTML('beforeend',`<div id="deepStart" style="margin-top:12px"><button style="width:100%;padding:14px;border:0;border-radius:12px;background:#222;color:#fff;font-size:16px;font-weight:700">🧠 なぜ？を掘り下げる</button></div>`);
      document.getElementById('deepStart').querySelector('button').onclick=()=>{document.getElementById('deepStart')?.remove();render(q)};
    },0);
  });
})();