(function(){
var sel=document.querySelector('[data-course]');LM.COURSES.forEach(function(c){var o=document.createElement('option');o.value=c.id;o.textContent=c.title;sel.appendChild(o);});
var pre=new URLSearchParams(location.search).get('course');if(pre&&LM.courseById(pre))sel.value=pre;
var summary=document.querySelector('[data-summary]');
function showSummary(){var c=LM.courseById(sel.value);var s=LM.priceSummary(c);summary.textContent='Price: '+LM.formatPKR(s.price)+' · Discount: −'+LM.formatPKR(s.discount)+' · Total due (demo, no payment taken): '+LM.formatPKR(s.total);}
sel.addEventListener('change',showSummary);showSummary();
var form=document.querySelector('[data-form]');
function field(name){return form.querySelector('[data-'+name+']');}
function showErrors(errs){['name','email','phone'].forEach(function(k){form.querySelector('[data-error-for="'+k+'"]').textContent=errs[k]||'';});}
['name','email','phone'].forEach(function(k){field(k).addEventListener('input',function(){var o={name:field('name').value,email:field('email').value,phone:field('phone').value};var errs=LM.validateLearner(o);var cur=form.querySelector('[data-error-for="'+k+'"]');if(cur.textContent)cur.textContent=errs[k]||'';});});
form.addEventListener('submit',function(ev){ev.preventDefault();var o={name:field('name').value.trim(),email:field('email').value.trim(),phone:field('phone').value.trim()};var errs=LM.validateLearner(o);showErrors(errs);if(Object.keys(errs).length)return;
var c=LM.courseById(sel.value);var enrolments=[];try{enrolments=JSON.parse(localStorage.getItem('lm_enrolments')||'[]');}catch(e){}
if(LM.seatsLeft(c,enrolments)<=0){showErrors({});summary.textContent='Sorry — this demo course is full (0 seats left). Pick another course.';return;}
var s=LM.priceSummary(c);var ref=LM.makeRef(o.email,c.id);
enrolments.push({ref:ref,courseId:c.id,name:o.name,email:o.email,phone:o.phone,total:s.total,discount:s.discount,price:s.price,progress:0,status:'active'});
localStorage.setItem('lm_enrolments',JSON.stringify(enrolments));
document.querySelector('[data-enrol]').hidden=true;var conf=document.querySelector('[data-confirmation]');conf.hidden=false;
conf.innerHTML='<div class="notice"><h2>Enrolment confirmed — DEMO</h2><p>Reference: <strong data-ref>'+ref+'</strong></p><p>Course: '+c.title+'<br>Learner: '+o.name+' ('+o.email+')<br>Course price: '+LM.formatPKR(s.price)+'<br>Discount: −'+LM.formatPKR(s.discount)+'<br><strong>Total: '+LM.formatPKR(s.total)+' (demo — no payment was taken)</strong></p><p><a class="btn" href="learning.html">Go to My Learning</a> <a class="btn alt" href="course.html?id='+c.id+'">Back to course</a></p></div>';});
})();
