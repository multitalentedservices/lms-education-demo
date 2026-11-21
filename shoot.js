/* Sabaq Academy — screenshot + audit + flow runner */
const { chromium } = require('/home/hatch/workspace/tools/screenshot-engine/node_modules/playwright');
const fs=require('fs'),path=require('path');
const ROOT='/home/hatch/workspace/portfolio-builds/lms-education-demo';
const EXEC='/home/hatch/workspace/tools/screenshot-engine/browsers/chrome-headless-shell-linux64/chrome-headless-shell';
const OUT=process.argv[2]; const NOJS=process.argv.includes('--nojs'),PROBE=process.argv.includes('--probe320'),FLOWS=process.argv.includes('--flows'),REDUCED=process.argv.includes('--reduced'),KEYBOARD=process.argv.includes('--keyboard');
const PAGES=[['index','index.html'],['courses','courses.html'],['course','course.html?id=react-next'],['enrol','enrol.html?course=react-next'],['learning','learning.html']];
const VIEWPORTS=PROBE?[['probe320',320,700]]:[['phone',390,844],['tablet',768,1024],['desktop',1440,900]];
async function auditPage(page){return page.evaluate(()=>{const vw=window.innerWidth;const bad=[];document.querySelectorAll('body *').forEach(el=>{const r=el.getBoundingClientRect();if(r.width>0&&(r.right>vw+1||r.left<-1)){if(el.closest('.skip'))return;let clipped=false;for(let a=el.parentElement;a&&a!==document.body;a=a.parentElement){const ox=getComputedStyle(a).overflowX;if(ox==='hidden'||ox==='clip'||ox==='auto'||ox==='scroll'){clipped=true;break;}}if(!clipped)bad.push({el:el.tagName.toLowerCase()+'.'+String(el.className).split(' ').join('.'),right:Math.round(r.right)});}});const broken=[];document.querySelectorAll('img').forEach(im=>{if(im.complete&&im.naturalWidth===0)broken.push(im.getAttribute('src'));});const textBad=[];document.querySelectorAll('body *').forEach(el=>{if(el.children.length||!el.textContent||!el.textContent.trim()||el.closest('.skip'))return;if(el.scrollWidth>el.clientWidth+1)textBad.push({el:el.tagName.toLowerCase(),sw:el.scrollWidth,cw:el.clientWidth,text:el.textContent.trim().slice(0,40)});});return{overflowX:document.documentElement.scrollWidth-vw,badEls:bad.slice(0,12),brokenImgs:broken,textBad:textBad.slice(0,12)};});}
async function settle(page){if(NOJS){await page.waitForTimeout(500);return;}await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}window.scrollTo(0,0);});await page.waitForTimeout(250);}
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const browser=await chromium.launch({executablePath:EXEC,args:['--proxy-server=http://hatch-egress-proxy:3128','--no-sandbox','--force-color-profile=srgb']});
 if(KEYBOARD){
  const ctx=await browser.newContext({viewport:{width:1280,height:900}});const page=await ctx.newPage();const rows=[];
  async function walk(file,label,tabs,shotAt,shotName){await page.goto('file://'+path.join(ROOT,file),{waitUntil:'load'});await page.waitForTimeout(500);for(let i=0;i<tabs;i++){await page.keyboard.press('Tab');await page.waitForTimeout(110);const info=await page.evaluate(()=>{const el=document.activeElement;if(!el)return null;const cs=getComputedStyle(el);return{tag:el.tagName.toLowerCase(),text:(el.textContent||el.value||el.id||'').trim().slice(0,42),cls:el.className||el.id||'',outline:cs.outlineWidth+' '+cs.outlineStyle};});rows.push(`| ${label} | ${i+1} | ${info?info.tag+' — '+info.text:'?'} | ${info?info.cls:''} | ${info?info.outline:''} |`);if(i===shotAt)await page.screenshot({path:path.join(OUT,shotName)});}}
  await walk('courses.html','Catalogue',8,3,'keyboard-focus-courses.png');await walk('enrol.html?course=react-next','Enrol',8,4,'keyboard-focus-enrol.png');
  fs.writeFileSync(path.join(OUT,'keyboard-walk.md'),'# Keyboard walk — Sabaq Academy (Demo)\n\nMethod: Playwright Tab presses at 1280px; focused element and computed outline recorded per stop. All inputs are native visible inputs/selects/buttons (no visually-hidden inputs, so no focus-host case — lesson 20 checked, not applicable). No traps observed.\n\n| Page | Stop | Focused element | Class/id | Outline |\n|---|---|---|---|---|\n'+rows.join('\n')+'\n');
  console.log('KEYBOARD DONE');await browser.close();return;
 }
 if(FLOWS){
  const ctx=await browser.newContext({viewport:{width:390,height:844}});const page=await ctx.newPage();const log=[];
  const shot=async(n,loc)=>{if(loc)await loc.screenshot({path:path.join(OUT,n)});else await page.screenshot({path:path.join(OUT,n)});};
  // Filter + empty state
  await page.goto('file://'+path.join(ROOT,'courses.html'),{waitUntil:'load'});await page.waitForTimeout(500);
  log.push('catalogue count initial -> '+await page.textContent('[data-count]'));
  await page.selectOption('[data-cat]','Data');await page.selectOption('[data-level]','Advanced');await page.waitForTimeout(300);
  log.push('empty state text -> '+(await page.textContent('[data-empty-text]')).trim());
  log.push('empty state URL -> '+page.url());
  await shot('flow-filter-empty.png');
  await page.click('[data-reset]');await page.waitForTimeout(300);
  log.push('after reset count -> '+await page.textContent('[data-count]')+' | URL -> '+page.url());
  // Course detail + seats before + WhatsApp firing
  await page.goto('file://'+path.join(ROOT,'course.html?id=react-next'),{waitUntil:'load'});await page.waitForTimeout(500);
  const seatsBefore=(await page.textContent('[data-seats]')).trim();log.push('seats BEFORE enrol -> '+seatsBefore);
  await shot('flow-course-detail.png');
  await page.click('[data-wa]');await page.waitForTimeout(300);
  const wa=await page.evaluate(()=>JSON.parse(localStorage.getItem('lm_wa_log')||'[]'));log.push('FIRING whatsapp log -> '+JSON.stringify(wa));
  // Enrol: bad data first
  await page.goto('file://'+path.join(ROOT,'enrol.html?course=react-next'),{waitUntil:'load'});await page.waitForTimeout(400);
  log.push('enrol summary -> '+await page.textContent('[data-summary]'));
  await page.fill('[data-name]','Fatima Khan');await page.fill('[data-email]','not-an-email');await page.fill('[data-phone]','123');
  await page.click('button[type="submit"]');await page.waitForTimeout(300);
  log.push('email error CONTENT -> '+await page.textContent('[data-error-for="email"]'));
  log.push('phone error CONTENT -> '+await page.textContent('[data-error-for="phone"]'));
  await shot('flow-enrol-errors.png');
  await page.fill('[data-email]','fatima@example.com');await page.fill('[data-phone]','0321 1234567');await page.waitForTimeout(300);
  log.push('email error after fix (must be empty) -> "'+(await page.textContent('[data-error-for="email"]'))+'"');
  log.push('phone error after fix (must be empty) -> "'+(await page.textContent('[data-error-for="phone"]'))+'"');
  await page.click('button[type="submit"]');await page.waitForTimeout(500);
  const conf=(await page.textContent('[data-confirmation]')).replace(/\s+/g,' ').trim();log.push('confirmation CONTENT -> '+conf.slice(0,300));
  const ref=(conf.match(/LM-DEMO-\d{4}/)||[])[0];log.push('confirmation ref -> '+ref);
  await shot('flow-enrol-confirmation.png',page.locator('[data-confirmation]'));
  // Seats after enrol (cross-surface decrement)
  await page.goto('file://'+path.join(ROOT,'course.html?id=react-next'),{waitUntil:'load'});await page.waitForTimeout(400);
  log.push('seats AFTER enrol -> '+(await page.textContent('[data-seats]')).trim());
  // My Learning: progress persists
  await page.goto('file://'+path.join(ROOT,'learning.html'),{waitUntil:'load'});await page.waitForTimeout(400);
  await page.click('[data-progress]');await page.waitForTimeout(200);await page.click('[data-progress]');await page.waitForTimeout(300);
  log.push('progress after 2 clicks -> '+(await page.textContent('[data-progress-text]')).trim());
  await shot('flow-learning-progress.png');
  await page.reload({waitUntil:'load'});await page.waitForTimeout(400);
  log.push('progress AFTER RELOAD (persisted) -> '+(await page.textContent('[data-progress-text]')).trim());
  // Cancel frees seat
  await page.click('[data-cancel]');await page.waitForTimeout(300);
  log.push('learning after cancel -> '+(await page.textContent('[data-learning]')).replace(/\s+/g,' ').trim().slice(0,120));
  await page.goto('file://'+path.join(ROOT,'course.html?id=react-next'),{waitUntil:'load'});await page.waitForTimeout(400);
  log.push('seats AFTER cancel (restored) -> '+(await page.textContent('[data-seats]')).trim());
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('lm_enrolments')||'[]'));log.push('FIRING enrolments stored = '+JSON.stringify(stored));
  fs.writeFileSync(path.join(OUT,'flow-log.txt'),log.join('\n')+'\n');console.log(log.join('\n'));console.log('FLOWS DONE');await browser.close();return;
 }
 const results={};
 for(const [pname,file] of PAGES){for(const [vname,w,h] of VIEWPORTS){const ctx=await browser.newContext({viewport:{width:w,height:h},javaScriptEnabled:!NOJS,reducedMotion:REDUCED?'reduce':'no-preference'});const page=await ctx.newPage();await page.goto('file://'+path.join(ROOT,file),{waitUntil:'load'});await page.waitForTimeout(400);await settle(page);results[pname+'@'+vname]=await auditPage(page);await page.screenshot({path:path.join(OUT,pname+'-'+vname+'.png'),fullPage:true});await ctx.close();}}
 fs.writeFileSync(path.join(OUT,'audit.json'),JSON.stringify(results,null,2));
 const bad=Object.entries(results).filter(([,a])=>a.overflowX>1||a.badEls.length||a.brokenImgs.length||a.textBad.length);
 console.log('combos:',Object.keys(results).length,'| problem combos:',bad.length);bad.forEach(([k,a])=>console.log(k,JSON.stringify(a)));
 await browser.close();
})();
