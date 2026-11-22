/* Sabaq Academy — Premium checks (separate from tests.js): screenshots 390+1440 every page,
   signature moment (poster rail), rails/quiz/filter functional assertions. */
const { chromium } = require('/home/hatch/workspace/tools/screenshot-engine/node_modules/playwright');
const fs=require('fs'),path=require('path');
const ROOT='/home/hatch/workspace/portfolio-builds/lms-education-demo';
const EXEC='/home/hatch/workspace/tools/screenshot-engine/browsers/chrome-headless-shell-linux64/chrome-headless-shell';
const OUT=path.join(ROOT,'screenshots','premium');
const PAGES=[['index','index.html'],['courses','courses.html'],['course','course.html?id=react-next'],['enrol','enrol.html'],['learning','learning.html']];
const results=[];function t(n,c){results.push({name:n,pass:!!c});console.log((c?'PASS':'FAIL'),n);}
async function audit(page){return page.evaluate(()=>{const vw=window.innerWidth;const bad=[];document.querySelectorAll('body *').forEach(el=>{const r=el.getBoundingClientRect();if(r.width>0&&(r.right>vw+1||r.left<-1)){if(el.closest('.skip'))return;let cl=false;for(let a=el.parentElement;a&&a!==document.body;a=a.parentElement){const ox=getComputedStyle(a).overflowX;if(['hidden','clip','auto','scroll'].includes(ox)){cl=true;break;}}if(!cl)bad.push(el.tagName+'.'+String(el.className).split(' ').join('.'));}});const broken=[...document.querySelectorAll('img')].filter(im=>im.complete&&im.naturalWidth===0).map(im=>im.getAttribute('src'));return{overflowX:document.documentElement.scrollWidth-vw,badEls:bad.slice(0,8),broken};});}
async function humanScroll(page){await page.evaluate(async()=>{const H=document.body.scrollHeight;for(let y=0;y<H;y+=320){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,90));}window.scrollTo(0,0);await new Promise(r=>setTimeout(r,200));});}
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const browser=await chromium.launch({executablePath:EXEC,args:['--proxy-server=http://hatch-egress-proxy:3128','--no-sandbox','--force-color-profile=srgb']});
 const errors=[];
 for(const [name,file] of PAGES){
  for(const [vp,w,h] of [['phone',390,844],['desktop',1440,900]]){
   const ctx=await browser.newContext({viewport:{width:w,height:h}});
   const page=await ctx.newPage();
   page.on('console',m=>{if(m.type()==='error'){const loc=(m.location()&&m.location().url)||'';if(/fonts\.googleapis|fonts\.gstatic/.test(loc))return;errors.push(name+'/'+vp+': '+m.text()+' @'+loc);}});
   page.on('pageerror',e=>errors.push(name+'/'+vp+' PAGEERROR: '+e.message));
   await page.goto('file://'+path.join(ROOT,file),{waitUntil:'load'});
   await page.waitForTimeout(700);
   await humanScroll(page);
   const a=await audit(page);
   t(name+' '+vp+' no overflow/broken',a.overflowX<=1&&a.badEls.length===0&&a.broken.length===0);
   await page.screenshot({path:path.join(OUT,name+'-'+vp+'.png'),fullPage:true});
   await ctx.close();
  }
 }
 /* Index functional: rails + poster cards + quiz */
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});
 const page=await ctx.newPage();
 page.on('pageerror',e=>errors.push('index-func PAGEERROR: '+e.message));
 await page.goto('file://'+path.join(ROOT,'index.html'),{waitUntil:'load'});
 await page.waitForTimeout(900);
 const rails=await page.locator('[data-rail]').count();
 const railCards=await page.locator('[data-rail] .card.poster').count();
 t('5 category rails built ('+rails+')',rails===5);
 t('rails carry all 12 courses as poster cards ('+railCards+')',railCards===12);
 t('all rails Swiper-enhanced',await page.locator('[data-rail].swiper-on').count()===5);
 const ratio=await page.evaluate(()=>{const im=document.querySelector('[data-rail] .card.poster img');const cs=getComputedStyle(im);return cs.aspectRatio;});
 t('poster cards are 4:5 ('+ratio+')',ratio==='4 / 5');
 const meta=await page.textContent('[data-rail] .card.poster .meta');
 t('poster card shows rating + learner count',/★ 4\.\d \(demo\) · [\d,]+ learners \(demo\)/.test(meta||''));
 /* signature moment: first rail, mid-swipe state */
 await page.locator('[data-rail]').first().scrollIntoViewIfNeeded();await page.waitForTimeout(400);
 await page.locator('.rail-nav [data-rail-next]').first().click();await page.waitForTimeout(700);
 await page.locator('[data-rails]').screenshot({path:path.join(OUT,'signature-moment.png')});
 /* Quiz: Web Development + Beginner + Most popular -> WordPress for Client Sites (2,105 learners, the most popular beginner web course in the data) */
 await page.locator('[data-quiz]').scrollIntoViewIfNeeded();
 await page.click('[data-opts="category"] .quiz-opt[data-val="Web Development"]');await page.waitForTimeout(250);
 await page.click('[data-opts="level"] .quiz-opt[data-val="Beginner"]');await page.waitForTimeout(250);
 await page.click('[data-opts="sort"] .quiz-opt[data-val="popular"]');await page.waitForTimeout(400);
 const rec=await page.textContent('[data-quiz-result]');
 t('quiz routes to a recommended course',/WordPress for Client Sites/.test(rec||''));
 await page.locator('[data-quiz]').screenshot({path:path.join(OUT,'quiz-result.png')});
 await ctx.close();
 /* Courses page: filter + URL state still pass under poster cards */
 const ctx2=await browser.newContext({viewport:{width:390,height:844}});
 const p2=await ctx2.newPage();
 p2.on('pageerror',e=>errors.push('courses-func PAGEERROR: '+e.message));
 await p2.goto('file://'+path.join(ROOT,'courses.html'),{waitUntil:'load'});await p2.waitForTimeout(600);
 t('catalogue renders 12 poster cards',await p2.locator('[data-grid] .card.poster').count()===12);
 await p2.selectOption('[data-cat]','Data');await p2.waitForTimeout(300);
 t('filter Data -> 2 poster cards',await p2.locator('[data-grid] .card.poster').count()===2);
 t('URL state carries category',p2.url().includes('category=Data'));
 const cnt=await p2.textContent('[data-count]');t('count line updates',/Showing 2 of 12/.test(cnt||''));
 await ctx2.close();
 /* JS-disabled index: rails degrade to complete grid, quiz fallback present */
 const ctx3=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
 const p3=await ctx3.newPage();
 await p3.goto('file://'+path.join(ROOT,'index.html'),{waitUntil:'load'});
 const nojs=await p3.textContent('body');
 t('no-JS index complete (hero + fallbacks)',/Learn a real skill/.test(nojs)&&/category rails cannot be built/.test(nojs)&&/quiz cannot run/.test(nojs));
 await p3.screenshot({path:path.join(OUT,'index-phone-nojs.png'),fullPage:true});
 await ctx3.close();
 /* JS-disabled courses: filter form still present and labelled */
 const ctx4=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
 const p4=await ctx4.newPage();
 await p4.goto('file://'+path.join(ROOT,'courses.html'),{waitUntil:'load'});
 t('no-JS courses keeps filter form',await p4.locator('[data-filters]').count()===1);
 await ctx4.close();
 t('zero console/page errors',errors.length===0);
 if(errors.length)console.log('ERRORS:',errors.join(' | '));
 const pass=results.filter(r=>r.pass).length;
 console.log('\nPREMIUM CHECKS: '+pass+' PASS / '+(results.length-pass)+' FAIL');
 fs.writeFileSync(path.join(OUT,'premium-checks.json'),JSON.stringify({results,errors},null,2));
 await browser.close();
 process.exit(results.every(r=>r.pass)?0:1);
})();
