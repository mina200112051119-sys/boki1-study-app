(()=>{
function install(){
 let qok=typeof window.quiz==='function'&&window.quiz.__randomized;
 if(typeof window.quiz==='function'&&!qok){const original=window.quiz;function randomizedQuiz(){if(typeof current!=='undefined'&&current[qi]){const q=current[qi],correct=q.choices[q.a];q.choices=shuffle(q.choices);q.a=q.choices.indexOf(correct)}return original()}randomizedQuiz.__randomized=true;window.quiz=randomizedQuiz;qok=true}
 let aok=typeof window.answer==='function'&&window.answer.__enhanced;
 if(typeof window.answer==='function'&&!aok){const original=window.answer;function enhancedAnswer(n){const q=current[qi],wrong=n!==q.a;original(n);if(wrong)window.dispatchEvent(new CustomEvent('boki:wrong',{detail:q}))}enhancedAnswer.__enhanced=true;window.answer=enhancedAnswer;aok=true}
 if(!qok||!aok)setTimeout(install,100)
}
setTimeout(install,0)
})();