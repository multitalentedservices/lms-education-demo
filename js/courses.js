(function(){
var cats=[];LM.COURSES.forEach(function(c){if(cats.indexOf(c.category)===-1)cats.push(c.category);});
var sel=document.querySelector('[data-cat]');cats.forEach(function(c){var o=document.createElement('option');o.textContent=c;sel.appendChild(o);});
var q=document.querySelector('[data-q]'),lv=document.querySelector('[data-level]'),so=document.querySelector('[data-sort]'),grid=document.querySelector('[data-grid]'),count=document.querySelector('[data-count]'),empty=document.querySelector('[data-empty]'),emptyText=document.querySelector('[data-empty-text]');
var params=new URLSearchParams(location.search);
if(params.get('category'))sel.value=params.get('category');if(params.get('level'))lv.value=params.get('level');if(params.get('q'))q.value=params.get('q');if(params.get('sort'))so.value=params.get('sort');
function render(){
 var f={category:sel.value,level:lv.value,q:q.value};
 var list=LM.sortCourses(LM.filterCourses(LM.COURSES,f),so.value);
 count.textContent='Showing '+list.length+' of '+LM.COURSES.length+' courses';
 grid.innerHTML=list.map(function(c){var t=LM.totals(c);return '<article class="card poster"><img src="'+c.img+'" alt="'+c.category+' course photo"><div class="body"><span class="chip">'+c.category+' · '+c.level+'</span><h3>'+c.title+'</h3><p class="instructor">with <b>'+c.instructor+'</b></p><p class="meta">★ '+c.rating+' (demo) · '+c.learners.toLocaleString('en-US')+' learners (demo) · '+t.lessons+' lessons · '+LM.formatMins(t.mins)+'</p><p class="price">'+LM.formatPKR(LM.priceSummary(c).total)+'</p><a class="btn" href="course.html?id='+c.id+'">View course</a></div></article>';}).join('');
 empty.hidden=list.length>0;grid.hidden=list.length===0;
 if(!list.length){var parts=[];if(sel.value!=='all')parts.push('category = '+sel.value);if(lv.value!=='all')parts.push('level = '+lv.value);if(q.value)parts.push('search = "'+q.value+'"');emptyText.textContent='No course matches '+parts.join(', ')+'. Try widening a filter or reset everything.';}
 var p=new URLSearchParams();if(sel.value!=='all')p.set('category',sel.value);if(lv.value!=='all')p.set('level',lv.value);if(q.value)p.set('q',q.value);if(so.value!=='popular')p.set('sort',so.value);
 history.replaceState(null,'',location.pathname+(p.toString()?'?'+p:''));
}
[q,sel,lv,so].forEach(function(el){el.addEventListener('input',render);el.addEventListener('change',render);});
document.querySelector('[data-reset]').addEventListener('click',function(){q.value='';sel.value='all';lv.value='all';so.value='popular';render();});
render();
})();
