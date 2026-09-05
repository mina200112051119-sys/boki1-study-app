(()=>{
function install(){
 if(typeof window.quiz==='function'&&!window.quiz.__randomized){
  const original=window.quiz;
  function randomizedQuiz(){
   if(typeof current!=='undefined'&&current[qi]){
    const q=current[qi], correct=q.choices[q.a];
    q.choices=shuffle(q.choices);
    q.a=q.choices.indexOf(correct);
   }
   return original();
  }
  randomizedQuiz.__randomized=true;window.quiz=randomizedQuiz;
 }
 if(typeof window.answer==='function'&&!window.answer.__enhanced){
  const original=window.answer;
  function enhancedAnswer(n){
   const q=current[qi],wrong=n!==q.a;original(n);
   if(wrong)window.dispatchEvent(new CustomEvent('boki:wrong',{detail:q}));
  }
  enhancedAnswer.__enhanced=true;window.answer=enhancedAnswer;
 }
 if(!window.quiz.__randomized||!window.answer.__enhanced)setTimeout(install,100);
}
setTimeout(install,0);
})();