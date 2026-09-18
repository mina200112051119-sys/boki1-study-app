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
function money(n){return n.toLocaleString('ja-JP')+'円'}
function originalCases(id){
 const t=(typeof TOPICS!=='undefined'&&TOPICS.find(x=>x.id===id))||{};
 const name=t.name||id, subs=t.subs||[];
 const cases=[];
 const types=['計算','仕訳','判断','理論','資料読解','差額分析','決算処理','表示'];
 for(let i=0;i<10;i++){
   const a=subs[i%subs.length]||name, b=subs[(i+1)%subs.length]||name, c=subs[(i+2)%subs.length]||name;
   const base=(typeof t.cat==='string'&&t.cat.includes('工業'))?
     '製造業A社の当月資料をもとに、'+name+'に関する処理を行う。':
     '上場会社A社の決算資料をもとに、'+name+'に関する会計処理を行う。';
   const n1=120000+(i*17000), n2=80000+(i*13000), n3=30000+(i*7000);
   let qs, ans;
   // 主要な計算論点は、資料→計算→処理までを1ケースにする。
   if(['有価証券','貸倒引当金','棚卸資産','有形固定資産','固定資産の減損','リース','外貨建取引','資産除去債務','税効果会計','標準原価計算','原価差異分析','CVP分析','原価予測','直接原価計算','差額原価収益分析','個別原価計算','総合原価計算','工程別総合原価計算','標準原価計算','材料費計算','労務費計算','製造間接費'].includes(name)){
     const x=(i+2)*10, y=(i+3)*5, z=(i+4)*3;
     const total=x*y+z;
     qs=[
      {q:'資料① '+a+'について、基礎となる金額が'+x+'単位、単価が'+money(y)+'である。基礎金額はいくらか。',c:[money(total),money(x*y),money((x+y)*10),money(x*y+z*10)],a:1},
      {q:'資料② '+b+'について、追加情報として'+money(n2)+'が与えられている。'+c+'の処理を行う際、最初に確認すべきものはどれか。',c:[a+'の数値だけ',b+'とc+'の関連資料', '現金預金だけ','翌期の売上だけ'],a:1},
      {q:'資料③ '+c+'の判断を行う。'+name+'のケースで最終的に必要となる処理として適切なものを選びなさい。',c:[name+'の論点に対応する測定・認識処理','すべて費用処理','すべて翌期へ繰り延べ','処理不要'],a:0}
     ];
     ans=qs.map(q=>q.c[q.a]).join(' ／ ');
   }else{
     const patterns=[
      {q:'資料① '+a+'について、A社は'+money(n1)+'の取引を行った。'+name+'の処理を検討するとき、最初に確認すべき事項はどれか。',c:[a+'に関する認識・測定条件', '現金残高だけ','売上数量だけ','翌期予算だけ'],a:0},
      {q:'資料② '+b+'について、'+money(n2)+'の金額が帳簿に計上されている。'+name+'の論点として適切な確認方法を選びなさい。',c:['資料と帳簿を照合し、'+b+'の条件を確認する','金額を必ず全額費用にする','金額を必ず全額収益にする','確認せず翌期へ繰り越す'],a:0},
      {q:'資料③ '+c+'に関して追加情報'+money(n3)+'が判明した。'+name+'の処理を決める際に適切なのはどれか。',c:['関連する認識・測定・表示の条件を確認して処理する','必ず仕訳を取り消す','必ず現金で決済する','必ず損益計算書から除外する'],a:0}
     ];
     qs=patterns; ans=qs.map(q=>q.c[q.a]).join(' ／ ');
   }
   const opts=[ans,qs.map(q=>q.c[(q.a+1)%4]).join(' ／ '),qs.map(q=>q.c[(q.a+2)%4]).join(' ／ '),qs.map(q=>q.c[(q.a+3)%4]).join(' ／ ')];
   cases.push({q:'【資料】'+base+'\\nケース'+(i+1)+'：'+a+'・'+b+'・'+c+'を関連づけて処理する。\\n\\n'+qs.map((q,j)=>'【問'+(j+1)+'】'+q.q).join('\\n\\n')+'\\n\\n問1～3の答えの組合せとして正しいものを選びなさい。',c:shuffle(opts),a:0,ex:qs.map((q,j)=>'【問'+(j+1)+'】正解：'+q.c[q.a]).join('\\n')+'\\n\\n【1級型の考え方】資料の条件を拾い、認識→測定→処理の順で判断する。'});
   const last=cases[cases.length-1]; last.a=last.c.indexOf(ans);
 }
 return cases;
}
function makeCases(id){return originalCases(id)}
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