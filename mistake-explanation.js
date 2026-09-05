// Detailed mistake explanation support: the existing question data can provide
// a concise explanation with (1) why the correct answer is correct,
// (2) the key point to remember, and (3) the common trap to avoid.
function buildMistakeExplanation(q){
  if(!q)return '';
  const base=q.explanation||q.exp||q.note||'';
  const point=q.point||q.keyPoint||q.tip||'';
  const trap=q.trap||q.commonMistake||'';
  return [base,point?`覚えるポイント：${point}`:'',trap?`ひっかけ注意：${trap}`:''].filter(Boolean).join('\n\n');
}
