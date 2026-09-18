(()=>{'use strict';
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const rank=q=>({重点:5,'計算・判断':4,実戦:3,基礎確認:1,基礎:0}[q.level]??0);
const intro={
'現金預金':'決算日に、金庫実査・銀行残高・小口現金帳を照合する。',
'有価証券':'決算日に保有する有価証券について、保有目的・取得価額・時価・利息を確認する。',
'貸倒引当金':'決算日に債権残高と回収状況を確認し、必要な貸倒引当額を算定する。',
'棚卸資産':'期末棚卸資料と帳簿を照合し、取得原価と期末評価を確認する。',
'有形固定資産':'固定資産台帳と取得・償却・売却資料を照合し、期末処理を行う。',
'減損会計':'固定資産の減損の兆候と回収可能性を確認し、必要な処理を判断する。',
'リース':'契約条件を確認し、リース取引の認識・測定と期末処理を判断する。',
'外貨換算':'外貨建取引の取引日と決算日の為替相場を確認し、換算処理を行う。',
'税効果会計':'会計上の金額と税務上の金額との差異を確認し、繰延税金を処理する。',
'連結・資本連結':'親会社と子会社の個別財務諸表を照合し、投資と資本の相殺消去を行う。',
'連結会社間取引':'連結会社間の債権債務・売上仕入・未実現損益を確認して消去する。',
'連結財務諸表':'個別財務諸表と連結修正事項を確認し、連結精算表を組み立てる。',
'企業結合・事業分離':'取得した事業の対価と識別可能な資産負債を確認し、企業結合の処理を判断する。',
'標準原価計算':'標準原価と実際原価、生産量を照合し、原価差異を分析する。',
'原価差異分析':'材料・労務・製造間接費について、発生した差異の原因を分析する。',
'CVP分析':'販売価格・変動費・固定費・販売量から利益計画と損益分岐点を分析する。',
'直接原価計算':'変動費と固定費を分け、限界利益と営業利益の関係を確認する。',
'差額原価収益分析':'追加受注・内製外注などの意思決定について、関連する収益と原価を比較する。',
'個別原価計算':'製造指図書ごとの材料費・労務費・製造間接費を集計して製品原価を計算する。',
'総合原価計算':'一定期間の投入量・完成量・仕掛品を確認し、完成品原価を計算する。'
};
function makeCases(id){
 const topic=(typeof TOPICS!=='undefined'&&TOPICS.find(t=>t.id===id))||{};
 const name=topic.name||id;
 const base=intro[name]||('ある会社の'+name+'について、決算・原価計算資料を確認し、適切な処理を判断する。');

 // 同じ問題を10問の中で二度使わない。まず当該分野、足りなければ近接分野から未使用問題を補充する。
 const used=new Set();
 const same=QB.filter(q=>q.topicId===id).sort((a,b)=>rank(b)-rank(a));
 const idx=(typeof TOPICS!=='undefined')?TOPICS.findIndex(t=>t.id===id):-1;
 const related=[];
 if(idx>=0){
   for(let d=1;d<=4;d++){
     [idx-d,idx+d].forEach(k=>{
       if(k>=0&&k<TOPICS.length){
         const tid=TOPICS[k].id;
         QB.filter(q=>q.topicId===tid).sort((a,b)=>rank(b)-rank(a)).forEach(q=>related.push(q));
       }
     });
   }
 }
 const pool=[...same,...related].filter((q,n,a)=>a.findIndex(x=>x.q===q.q)===n);

 const take=()=>{
   const arr=[];
   while(arr.length<3){
     const q=pool.find(x=>!used.has(x.q));
     if(!q)break;
     used.add(q.q); arr.push(q);
   }
   return arr;
 };

 const out=[];
 for(let i=0;i<10;i++){
   const s=take();
   if(!s.length)break;
   const vals=s.map(q=>q.choices[q.a]);
   const wrong=q=>shuffle(q.choices.filter((_,j)=>j!==q.a))[0]||vals[0];
   const w=s.map(wrong);
   const opts=[];
   const add=(arr)=>{const key=arr.join(' ／ ');if(!opts.includes(key))opts.push(key)};
   add(vals);
   if(s.length>=2)add([...vals.slice(0,-1),w[s.length-1]]);
   if(s.length>=2)add([vals[0],w[1],...(vals.length>2?[vals[2]]:[])]);
   add([w[0],...(vals.slice(1))]);
   while(opts.length<4){
     const k=opts.length%s.length;
     const v=vals.map((x,j)=>j===k?w[j]:x);
     add(v);
     if(opts.length<4 && opts.length>=s.length+1)break;
   }
   const shuffled=shuffle(opts.slice(0,4));
   const answer=vals.join(' ／ ');
   out.push({
     q:'【資料】'+base+'\n\n'+s.map((q,n)=>'【問'+(n+1)+'】'+q.q).join('\n\n')+'\n\n問1～'+s.length+'の答えの組合せとして正しいものを選びなさい。',
     c:shuffled,
     a:shuffled.indexOf(answer),
     ex:s.map((q,n)=>'【問'+(n+1)+'】'+(q.explain||'')).join('\n')+'\n\n【ポイント】このケースで使った問題は、10ケース内では重複しないようにしています。'
   });
 }
 return out;
}
window.__deepTopicQuiz=function(id,one){
 if(one)return window.__topicQuizOriginal?window.__topicQuizOriginal(id,true):null;
 const cases=makeCases(id);if(!cases.length)return window.__topicQuizOriginal?window.__topicQuizOriginal(id,false):null;
 let i=0,score=0;
 const render=()=>{
  const app=document.getElementById('app');if(!app)return;
  if(i>=10){app.innerHTML='<button class="back" onclick="home()">← 終了</button><div class="card"><h2>🎯 1級型ケース10問 完了</h2><div class="statgrid"><div class="stat"><div class="stat"><div class="big">'+score+' / 10</div><div class="small">正解</div></div></div><p>1つの事例から複数の処理を読み、組合せで答える練習をしました。</p><button class="primary" onclick="home()">分野一覧へ</button></div>';return}
  const x=cases[i];
  app.innerHTML='<button class="back" onclick="home()">← 終了</button><div class="small">'+(i+1)+' / 10　ケース問題　正解 '+score+'問</div><div class="progress"><i style="width:'+i*10+'%"></i></div><div class="card"><span class="tag">1級・資料→処理→判断</span><h2 style="white-space:pre-line;font-size:16px;line-height:1.8">'+esc(x.q)+'</h2><div id="deepChoices">'+x.c.map((v,n)=>'<button class="choice" data-n="'+n+'">'+['①','②','③','④'][n]+'　'+esc(v)+'</button>').join('')+'</div><div id="deepResult"></div></div>';
  app.querySelectorAll('#deepChoices [data-n]').forEach(b=>b.onclick=()=>{
   const n=+b.dataset.n,ok=n===x.a;if(ok)score++;
   app.querySelectorAll('#deepChoices [data-n]').forEach(z=>{z.disabled=true;if(+z.dataset.n===x.a)z.classList.add('correct');if(+z.dataset.n===n&&!ok)z.classList.add('wrong')});
   app.querySelector('#deepResult').innerHTML='<div class="answer"><b>'+(ok?'⭕ 正解！':'❌ 不正解')+'</b><br><br><span style="white-space:pre-line">'+esc(x.ex)+'</span><br><br><button class="primary" id="deepNext">'+(i===9?'結果を見る':'次のケース')+'</button></div>';
   app.querySelector('#deepNext').onclick=()=>{i++;render()};
  });
  window.scrollTo(0,0);
 };
 render();
};
})();