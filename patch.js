(()=>{
  const originalQuiz=window.quiz;
  window.quiz=function(){
    if(qi>=current.length)return finish();
    const q=current[qi];
    const choices=q.choices.slice();
    const correct=q.a;
    const order=shuffle(choices.map((_,i)=>i));
    q.choices=order.map(i=>choices[i]);
    q.a=order.indexOf(correct);
    originalQuiz();
  };
})();
