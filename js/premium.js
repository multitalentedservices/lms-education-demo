/* Sabaq Academy — Premium layer (index only): MasterClass-treatment category rails
   (Swiper, degrading to a complete wrap grid without JS) + onboarding quiz (demo logic)
   routing to a recommended course from the catalogue's own data. */
(function(){
'use strict';
/* Static capture mode (?static=1 / data-static): the rails still BUILD
   (they are the page's content) but Swiper never initialises, so the
   premium.css wrap-grid fallback lays every poster card out in flow.
   The quiz is functional content and runs unchanged. */
var STATIC=/[?&]static=1(?:&|$)/.test(window.location.search)||document.documentElement.hasAttribute('data-static');
if(STATIC)document.documentElement.setAttribute('data-static','');
function posterCard(c){var t=LM.totals(c);return '<article class="card poster"><img src="'+c.img+'" alt="'+c.category+' course photo"><div class="body"><span class="chip">'+c.category+' · '+c.level+'</span><h3>'+c.title+'</h3><p class="instructor">with <b>'+c.instructor+'</b></p><p class="meta">★ '+c.rating+' (demo) · '+c.learners.toLocaleString('en-US')+' learners (demo) · '+t.lessons+' lessons · '+LM.formatMins(t.mins)+'</p><p class="price">'+LM.formatPKR(LM.priceSummary(c).total)+'</p><a class="btn" href="course.html?id='+c.id+'">View course</a></div></article>';}

/* ---------- Category rails ---------- */
var railsBox=document.querySelector('[data-rails]');
if(railsBox){
 var cats=[];LM.COURSES.forEach(function(c){if(cats.indexOf(c.category)===-1)cats.push(c.category);});
 railsBox.innerHTML=cats.map(function(cat,i){
  var list=LM.COURSES.filter(function(c){return c.category===cat;});
  return '<div class="rail-head"><div><p class="chapter">Category '+(i+1)+' of '+cats.length+'</p><h3 class="chapter-h" style="font-size:clamp(1.5rem,3vw,2.1rem)">'+cat+'</h3></div>'
   +'<div class="rail-nav"><button class="rail-btn" type="button" data-rail-prev aria-label="Previous '+cat+' courses">&#8592;</button><button class="rail-btn" type="button" data-rail-next aria-label="Next '+cat+' courses">&#8594;</button></div></div>'
   +'<div class="cat-rail swiper" data-rail><div class="swiper-wrapper">'
   +list.map(function(c){return '<div class="swiper-slide">'+posterCard(c)+'</div>';}).join('')
   +'</div></div>';
 }).join('');
 if(window.Swiper&&!STATIC){
  railsBox.querySelectorAll('[data-rail]').forEach(function(rail){
   rail.classList.add('swiper-on');
   var head=rail.previousElementSibling;
   new Swiper(rail,{slidesPerView:1.2,spaceBetween:16,keyboard:{enabled:true},a11y:{enabled:true},
    breakpoints:{640:{slidesPerView:2.2},1024:{slidesPerView:3.2}},
    navigation:{prevEl:head.querySelector('[data-rail-prev]'),nextEl:head.querySelector('[data-rail-next]')}});
  });
 }
}

/* ---------- Onboarding quiz (demo logic) ---------- */
var quiz=document.querySelector('[data-quiz]');
if(quiz){
 var answers={category:'',level:'',sort:'popular'};
 var catsQ=[];LM.COURSES.forEach(function(c){if(catsQ.indexOf(c.category)===-1)catsQ.push(c.category);});
 function opts(el,values,cb){el.innerHTML=values.map(function(v){return '<button type="button" class="quiz-opt" aria-pressed="false" data-val="'+v.value+'">'+v.label+'</button>';}).join('');
  el.querySelectorAll('.quiz-opt').forEach(function(b){b.addEventListener('click',function(){cb(b.getAttribute('data-val'));});});}
 function show(step){quiz.querySelectorAll('[data-q]').forEach(function(s){s.hidden=s.getAttribute('data-q')!==String(step);});}
 opts(quiz.querySelector('[data-opts="category"]'),catsQ.map(function(c){return{value:c,label:c};}),function(v){answers.category=v;show(2);});
 opts(quiz.querySelector('[data-opts="level"]'),[{value:'Beginner',label:'Beginner — starting out'},{value:'Intermediate',label:'Intermediate — some experience'},{value:'Advanced',label:'Advanced — go deep'}],function(v){answers.level=v;show(3);});
 opts(quiz.querySelector('[data-opts="sort"]'),[{value:'popular',label:'Most popular'},{value:'price-asc',label:'Lowest price first'},{value:'duration',label:'Shortest course'}],function(v){answers.sort=v;recommend();});
 function recommend(){
  var list=LM.filterCourses(LM.COURSES,{category:answers.category,level:answers.level});
  var note='';
  if(!list.length){list=LM.filterCourses(LM.COURSES,{category:answers.category});note='<p class="meta">No '+answers.level+' course in '+answers.category+' yet in this demo catalogue — here is the closest match.</p>';}
  var top=LM.sortCourses(list,answers.sort)[0];
  quiz.querySelector('[data-quiz-result]').innerHTML=note+posterCard(top);
  show('result');
 }
 var restart=quiz.querySelector('[data-quiz-restart]');
 if(restart)restart.addEventListener('click',function(){answers={category:'',level:'',sort:'popular'};show(1);});
}
})();
