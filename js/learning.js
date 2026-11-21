(function(){
var box=document.querySelector('[data-learning]');
function load(){try{return JSON.parse(localStorage.getItem('lm_enrolments')||'[]');}catch(e){return[];}}
function save(list){localStorage.setItem('lm_enrolments',JSON.stringify(list));}
function render(){var list=load().filter(function(e){return e.status==='active';});
if(!list.length){box.innerHTML='<div class="empty"><h2>No enrolments yet</h2><p>You have not enrolled in any demo course yet.</p><a class="btn" href="courses.html">Browse courses</a></div>';return;}
box.innerHTML='<div class="grid">'+list.map(function(e){var c=LM.courseById(e.courseId);if(!c)return'';var t=LM.totals(c);return '<article class="card"><img src="'+c.img+'" alt="'+c.category+' course photo"><div class="body"><span class="chip">'+e.ref+' · DEMO enrolment</span><h3>'+c.title+'</h3><p class="meta">'+t.lessons+' lessons · '+LM.formatMins(t.mins)+' · Total paid (demo): '+LM.formatPKR(e.total)+'</p><div class="progress" role="progressbar" aria-valuenow="'+e.progress+'" aria-valuemin="0" aria-valuemax="100"><i style="width:'+e.progress+'%"></i></div><p data-progress-text><strong>'+e.progress+'% complete</strong></p><p><button class="btn" type="button" data-progress="'+e.ref+'">Mark progress +10%</button></p><p><a class="btn alt" href="course.html?id='+c.id+'">Continue — view curriculum</a></p><p><button class="btn alt" type="button" data-cancel="'+e.ref+'">Cancel enrolment (free the seat)</button></p></div></article>';}).join('')+'</div>';
box.querySelectorAll('[data-progress]').forEach(function(b){b.addEventListener('click',function(){var list2=load();list2.forEach(function(e){if(e.ref===b.getAttribute('data-progress'))e.progress=Math.min(100,(e.progress||0)+10);});save(list2);render();});});
box.querySelectorAll('[data-cancel]').forEach(function(b){b.addEventListener('click',function(){var list2=load();list2.forEach(function(e){if(e.ref===b.getAttribute('data-cancel'))e.status='cancelled';});save(list2);render();});});}
render();
})();
