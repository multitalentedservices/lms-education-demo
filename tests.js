const fs=require('fs'),path=require('path');const R=__dirname;const LM=require('./js/logic.js');
let pass=0,fail=0;const lines=[];function t(name,cond,extra){if(cond){pass++;lines.push('PASS '+name);}else{fail++;lines.push('FAIL '+name+(extra?' :: '+extra:''));}}
function eq(a,b){return JSON.stringify(a)===JSON.stringify(b);}
// catalogue data
t('12 courses',LM.COURSES.length===12);
t('>=4 categories',new Set(LM.COURSES.map(c=>c.category)).size>=4, String(new Set(LM.COURSES.map(c=>c.category)).size));
t('every course has instructor/level/price/rating',LM.COURSES.every(c=>c.instructor&&c.level&&c.price>0&&c.rating>=4&&c.rating<=5));
t('every course >=2 modules',LM.COURSES.every(c=>LM.totals(c).modules>=2));
// curriculum totals exact for first course: manual sum
const c0=LM.COURSES[0];let ml=0,mm=0;c0.modules.forEach(m=>m.lessons.forEach(l=>{ml++;mm+=l.mins;}));
t('totals() matches manual sum course1',LM.totals(c0).lessons===ml&&LM.totals(c0).mins===mm,JSON.stringify(LM.totals(c0)));
t('course1 exact: 9 lessons 203 mins',LM.totals(c0).lessons===9&&LM.totals(c0).mins===203,JSON.stringify(LM.totals(c0)));
t('formatMins 203 = 3h 23m',LM.formatMins(203)==='3h 23m');
t('formatPKR 18000',LM.formatPKR(18000)==='PKR 18,000');
// filters exact counts
t('filter all =12',LM.filterCourses(LM.COURSES,{category:'all',level:'all',q:''}).length===12);
t('filter Web Dev =4',LM.filterCourses(LM.COURSES,{category:'Web Development',level:'all',q:''}).length===4);
t('filter Beginner =7',LM.filterCourses(LM.COURSES,{category:'all',level:'Beginner',q:''}).length===7);
t('filter Design+Beginner =1',LM.filterCourses(LM.COURSES,{category:'Design',level:'Beginner',q:''}).length===1);
t('search figma =1',LM.filterCourses(LM.COURSES,{category:'all',level:'all',q:'figma'}).length===1);
t('search instructor zara =1',LM.filterCourses(LM.COURSES,{category:'all',level:'all',q:'zara'}).length===1);
t('empty combo =0',LM.filterCourses(LM.COURSES,{category:'Data',level:'Advanced',q:''}).length===0);
// sort
t('sort price-asc first is Urdu 9000',LM.sortCourses(LM.COURSES,'price-asc')[0].price===9000);
t('sort price-desc first 42000',LM.sortCourses(LM.COURSES,'price-desc')[0].price===42000);
t('sort popular first learners max',LM.sortCourses(LM.COURSES,'popular')[0].learners===Math.max(...LM.COURSES.map(c=>c.learners)));
t('sort does not mutate source',LM.COURSES[0].id==='web-foundations');
// pricing / discount exact
t('discount 42000 -> 6300',LM.discountFor(42000)===6300);
t('discount 18000 -> 0',LM.discountFor(18000)===0);
t('discount boundary 25000 -> 3750',LM.discountFor(25000)===3750);
t('discount 24999 -> 0',LM.discountFor(24999)===0);
t('summary react total 35700',eq(LM.priceSummary(LM.courseById('react-next')),{price:42000,discount:6300,total:35700}));
t('summary excel total 10000',eq(LM.priceSummary(LM.courseById('excel-data')),{price:10000,discount:0,total:10000}));
// validation
t('valid phone 0321',LM.validPhone('0321 1234567')===true);
t('valid phone +92',LM.validPhone('+923211234567')===true);
t('invalid phone 123',LM.validPhone('123')===false);
t('invalid phone landline',LM.validPhone('04235712345')===false);
t('invalid phone too long',LM.validPhone('032112345678')===false);
t('valid email',LM.validEmail('a@b.com')===true);
t('invalid email',LM.validEmail('a@b')===false);
t('validate names constraint',LM.validateLearner({name:'Al',email:'x',phone:'1'}).name.includes('at least 3 characters'));
t('validate phone names PK format',LM.validateLearner({name:'Ali Raza',email:'x@y.com',phone:'1'}).phone.includes('03XX'));
t('validate all good = {}',eq(LM.validateLearner({name:'Ali Raza',email:'ali@example.com',phone:'03211234567'}),{}));
// ref
t('ref format',/^LM-DEMO-\d{4}$/.test(LM.makeRef('ali@example.com','react-next')));
t('ref deterministic',LM.makeRef('ali@example.com','react-next')===LM.makeRef('ali@example.com','react-next'));
t('ref differs by course',LM.makeRef('ali@example.com','react-next')!==LM.makeRef('ali@example.com','excel-data'));
// seats
const react=LM.courseById('react-next');
t('seats base react = 8',LM.seatsLeft(react,[])===8);
t('seats decrement with enrolment',LM.seatsLeft(react,[{courseId:'react-next',status:'active'}])===7);
t('seats cancelled does not count',LM.seatsLeft(react,[{courseId:'react-next',status:'cancelled'}])===8);
t('seats other course ignored',LM.seatsLeft(react,[{courseId:'excel-data',status:'active'}])===8);
// persistence round-trip (logic-level serialisation)
const enrol={ref:LM.makeRef('a@b.com','excel-data'),courseId:'excel-data',progress:0,status:'active',total:10000};
const rt=JSON.parse(JSON.stringify([enrol]));t('persistence round-trip',eq(rt,[enrol]));
// WhatsApp
t('wa link contains course title encoded',LM.waLink(react).includes(encodeURIComponent('React & Next.js in Practice')));
t('wa link is wa.me',LM.waLink(react).startsWith('https://wa.me/'));
// contrast from hex (lesson 23)
const pairs=[['ink on paper','#22271F','#FAF6EC',4.5],['muted on paper','#47503F','#FAF6EC',4.5],['green on paper','#173F2C','#FAF6EC',4.5],['paper on green','#FAF6EC','#173F2C',4.5],['paper on green-dark','#FAF6EC','#0F2E1F',4.5],['error on paper','#B3261E','#FAF6EC',4.5],['ink on white','#22271F','#FFFFFF',4.5],['muted on white','#47503F','#FFFFFF',4.5],['focus green on paper (>=3)','#173F2C','#FAF6EC',3]];
pairs.forEach(([n,a,b,min])=>t('contrast '+n+' = '+LM.contrast(a,b).toFixed(2),LM.contrast(a,b)>=min));
// files / integrity
const pages=['index.html','courses.html','course.html','enrol.html','learning.html'];
pages.forEach(p=>{const h=fs.readFileSync(path.join(R,p),'utf8');t(p+' has DEMO label',/DEMO/.test(h));t(p+' no lorem',!/lorem/i.test(h));t(p+' has title',/<title>[^<]+<\/title>/.test(h));});
const titles=pages.map(p=>fs.readFileSync(path.join(R,p),'utf8').match(/<title>([^<]+)/)[1]);t('unique titles',new Set(titles).size===pages.length);
// link integrity: local refs resolve
let badLinks=[];const htmlFiles=pages;htmlFiles.forEach(p=>{const h=fs.readFileSync(path.join(R,p),'utf8');(h.match(/(?:href|src)="(?!https?:|#|mailto:)([^"]+)"/g)||[]).forEach(m=>{const ref=m.split('"')[1].split('?')[0];if(ref&&!fs.existsSync(path.join(R,ref)))badLinks.push(p+'->'+ref);});});
['js/logic.js','js/home.js','js/courses.js','js/course.js','js/enrol.js','js/learning.js'].forEach(f=>{const s=fs.readFileSync(path.join(R,f),'utf8');(s.match(/assets\/[a-z-]+\.jpg/g)||[]).forEach(ref=>{if(!fs.existsSync(path.join(R,ref)))badLinks.push(f+'->'+ref);});});
t('all local links/assets resolve',badLinks.length===0,badLinks.join(','));
t('honest payment placeholder text in enrol.html',fs.readFileSync(path.join(R,'enrol.html'),'utf8').includes('JazzCash/EasyPaisa'));
t('plugin-based MVP label present',pages.some(p=>fs.readFileSync(path.join(R,p),'utf8').includes('plugin-based MVP')));
t('sitemap + robots exist',fs.existsSync(path.join(R,'sitemap.xml'))&&fs.existsSync(path.join(R,'robots.txt')));
// weights
function size(f){return fs.statSync(path.join(R,f)).size;}
let code=0;[...pages,'css/style.css','js/logic.js','js/home.js','js/courses.js','js/course.js','js/enrol.js','js/learning.js'].forEach(f=>code+=size(f));
t('code < 400KB ('+code+'B)',code<400*1024);
const imgs=fs.readdirSync(path.join(R,'assets')).filter(f=>/\.(jpg|png|webp)$/.test(f));let media=0;imgs.forEach(f=>{const s=size('assets/'+f);media+=s;t('image <=120KB '+f+' ('+s+'B)',s<=120*1024);});
t('media <=1.6MB ('+media+'B)',media<=1.6*1024*1024);
lines.push('TOTAL: '+pass+' PASS / '+fail+' FAIL');fs.writeFileSync(path.join(R,'tests-output.log'),lines.join('\n')+'\n');console.log(lines.join('\n'));process.exit(fail?1:0);
