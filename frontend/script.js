'use strict';
const $ = id => document.getElementById(id);
const translations = {
 en: {skip:'Skip to content',brandSub:'VOICE SECURITY RESEARCH',eyebrow:'LISTEN. ANALYZE. VERIFY.',title:'A voice can sound familiar. Verify the request.',intro:'Explore signs of synthetic speech with window-by-window analysis. A detector cannot prove that a recording is authentic.',connecting:'Checking detector readiness…',uploadTitle:'VOICE ANALYSIS',privacy:'Audio is processed in memory and is not retained by this application. Upload only recordings you own or have permission to analyze.',consent:'I have permission and consent to processing this recording.',choose:'Choose audio or drop it here',record:'Record microphone',stop:'Stop recording',noFile:'No recording selected.',explain:'Include slower occlusion explanation (recordings up to 30 seconds)',analyze:'Analyze recording',resultTitle:'DETECTION RESULTS',fakeScore:'Synthetic class score',scoreNote:'Scores reflect model output, not the probability of fraud. Until validation thresholds are calibrated, the decision remains inconclusive.',timelineTitle:'Window timeline',timelineNote:'Overlapping 5-second windows. Higher synthetic scores appear brighter; a highlighted region is not proof of manipulation.',tableTitle:'Accessible timeline data',start:'Start (s)',end:'End (s)',impact:'Occlusion change (points)',spectrumTitle:'Spectrogram and window overlay',spectrumNote:'0–8 kHz, bottom to top; time runs left to right. Occlusion replaces each selected interval with silence and recomputes overlapping windows. Its score change is a sensitivity check, not a causal explanation.',download:'Download JSON report',adviceTitle:'Suspicious call? Pause before acting.',advice1:'Call back using a number you already trust, not one supplied by the caller.',advice2:'Agree on a private family verification phrase.',advice3:'Never transfer money or share a code based only on a voice call.',research:'Research focus: how reliable are open voice deepfake detectors on Arabic speech and compressed or noisy messaging audio?',footer:'Educational research prototype. Not forensic evidence.',ready:'Detector ready',offline:'Detector unavailable. Check backend model access.',uploading:'Uploading recording…',processing:'Analyzing windows… This may take a minute.',done:'Analysis complete.',real:'REAL (within validation thresholds)',fake:'SYNTHETIC (within validation thresholds)',inconclusive:'INCONCLUSIVE',uncalibrated:'No matching validation calibration is installed.',silence:'Recording is silent or nearly silent.',model_disagreement:'The models disagree.',calibrated_thresholds:'Decision uses validation-derived thresholds.',permission:'Please confirm permission and consent first.',invalid:'Choose a supported audio file within the size and duration limits.',durationError:'The browser could not validate this recording’s duration. Try WAV or MP3.',recording:'Recording… Press Stop when finished.',recordError:'Microphone recording is unavailable or permission was denied.',error:'Analysis failed. ',reset:'Ready to analyze.',duration:'seconds',limit:'Limits',explainLimit:'Occlusion explanation supports recordings up to 30 seconds.'},
 ar: {skip:'انتقل إلى المحتوى',brandSub:'أبحاث أمن الصوت',eyebrow:'استمع. حلّل. تحقّق.',title:'قد يبدو الصوت مألوفاً. تحقّق من الطلب.',intro:'استكشف مؤشرات الصوت الاصطناعي عبر تحليل مقاطع التسجيل. لا يستطيع الكاشف إثبات أصالة الصوت.',connecting:'جارٍ التحقق من جاهزية الكاشف…',uploadTitle:'01 / التسجيل الصوتي',privacy:'تُعالج التسجيلات في الذاكرة ولا يحتفظ بها التطبيق. ارفع فقط التسجيلات التي تملكها أو لديك إذن لتحليلها.',consent:'لدي الإذن وأوافق على معالجة هذا التسجيل.',choose:'اختر تسجيلاً أو اسحبه إلى هنا',record:'التسجيل بالميكروفون',stop:'إيقاف التسجيل',noFile:'لم يتم اختيار تسجيل.',explain:'إضافة تحليل الحساسية الأبطأ (للتسجيلات حتى 30 ثانية)',analyze:'تحليل التسجيل',resultTitle:'02 / تقرير التحليل',fakeScore:'درجة الفئة الاصطناعية',scoreNote:'الدرجات هي مخرجات النموذج وليست احتمال الاحتيال. تبقى النتيجة غير حاسمة حتى معايرة الحدود على بيانات تحقق مستقلة.',timelineTitle:'التسلسل الزمني للمقاطع',timelineNote:'مقاطع متداخلة بطول 5 ثوانٍ. السطوع الأعلى يعني درجة اصطناعية أعلى؛ تظليل المقطع ليس دليلاً على التلاعب.',tableTitle:'بيانات المقاطع القابلة للقراءة',start:'البداية (ث)',end:'النهاية (ث)',impact:'تغير الدرجة عند الحجب (نقطة)',spectrumTitle:'الطيف الترددي مع تظليل المقاطع',spectrumNote:'التردد من 0 إلى 8 كيلوهرتز من الأسفل إلى الأعلى، والزمن من اليسار إلى اليمين. يستبدل الحجب المقطع بالصمت ويعيد حساب المقاطع المتداخلة. تغير الدرجة اختبار حساسية وليس تفسيراً سببياً.',download:'تنزيل التقرير بصيغة JSON',adviceTitle:'مكالمة مشبوهة؟ توقّف قبل التصرف.',advice1:'أعد الاتصال برقم موثوق لديك، وليس برقم يقدمه المتصل.',advice2:'اتفق مع عائلتك على عبارة تحقق سرية.',advice3:'لا تحوّل المال ولا تشارك رمزاً اعتماداً على مكالمة صوتية فقط.',research:'سؤال البحث: ما مدى موثوقية كواشف التزييف الصوتي المفتوحة على الكلام العربي والصوت المضغوط أو المشوّش في تطبيقات المراسلة؟',footer:'نموذج أولي بحثي تعليمي. ليس دليلاً جنائياً.',ready:'الكاشف جاهز',offline:'الكاشف غير متاح. تحقّق من إمكانية تحميل النموذج في الخادم.',uploading:'جارٍ رفع التسجيل…',processing:'جارٍ تحليل المقاطع… قد يستغرق ذلك دقيقة.',done:'اكتمل التحليل.',real:'حقيقي (وفق حدود التحقق)',fake:'اصطناعي (وفق حدود التحقق)',inconclusive:'غير حاسم',uncalibrated:'لم يتم تثبيت معايرة تحقق مطابقة.',silence:'التسجيل صامت أو شبه صامت.',model_disagreement:'يوجد اختلاف بين النموذجين.',calibrated_thresholds:'تستخدم النتيجة حدوداً مشتقة من بيانات التحقق.',permission:'يرجى تأكيد الإذن والموافقة أولاً.',invalid:'اختر ملفاً صوتياً مدعوماً ضمن حدود الحجم والمدة.',durationError:'تعذر التحقق من مدة التسجيل في المتصفح. جرّب WAV أو MP3.',recording:'جارٍ التسجيل… اضغط إيقاف عند الانتهاء.',recordError:'التسجيل غير متاح أو تم رفض إذن الميكروفون.',error:'فشل التحليل. ',reset:'جاهز للتحليل.',duration:'ثانية',limit:'الحدود',explainLimit:'يدعم تحليل الحساسية التسجيلات حتى 30 ثانية.'}
};
let language = 'en', selected = null, selectedDuration = 0, audioURL = null, report = null;
let ready = false, busy = false, recorder = null, recordingTimer = null, choiceVersion = 0;
let limits = {max_bytes:15*1024*1024,max_seconds:120,max_explain_seconds:30};
const t = key => translations[language][key] || key;
function status(key, extra='') { $('status').textContent = t(key) + extra; }
function updateButton(){ $('analyze').disabled = !ready || !selected || !$('consent').checked || busy || !!recorder; }
function showLimits(){ $('limits').textContent = `WAV · MP3 · FLAC · OGG · M4A · WebM — ${t('limit')}: ${(limits.max_bytes/1024/1024).toFixed(0)} MB / ${limits.max_seconds} ${t('duration')}`; }
function setLanguage(){
 $('analysis').lang=language; $('analysis').dir=language==='ar'?'rtl':'ltr';
 document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
 $('language').textContent=language==='en'?'العربية':'English'; $('language').lang=language==='en'?'ar':'en';
 $('health').textContent=t(ready?'ready':'offline'); showLimits();
 $('timeline').setAttribute('aria-label', t('timelineTitle')); $('spectrum').setAttribute('aria-label',t('spectrumTitle'));
 $('progress').setAttribute('aria-label',t('uploading'));
 if(selected) $('selected').textContent=`${selected.name} · ${selectedDuration.toFixed(1)} ${t('duration')} · ${(selected.size/1024).toFixed(0)} KB`;
 if(report){render(report);status('done');}else{resetResult();}
}
$('language').addEventListener('click',()=>{language=language==='en'?'ar':'en';setLanguage();});
$('consent').addEventListener('change',()=>{if(!$('consent').checked && recorder) recorder.stop();updateButton();});
async function choose(file, knownDuration=0){
 if(busy)return;
 const version=++choiceVersion; selected=null; report=null; resetResult(); updateButton();
 if(audioURL){URL.revokeObjectURL(audioURL);audioURL=null;} $('player').hidden=true;
 $('selected').textContent=t('noFile');
 if(!file) return;
 if(!/\.(wav|mp3|flac|ogg|m4a|webm)$/i.test(file.name)||file.size===0||file.size>limits.max_bytes){status('invalid');return;}
 let duration=knownDuration;
 if(!duration){
  const context=new AudioContext();
  try{const decoded=await context.decodeAudioData(await file.arrayBuffer());duration=decoded.duration;}
  catch{status('durationError');return;}
  finally{await context.close();}
 }
 if(version!==choiceVersion) return;
 if(!Number.isFinite(duration)||duration>limits.max_seconds||duration<0.1){status('invalid');return;}
 selected=file;selectedDuration=duration;audioURL=URL.createObjectURL(file);$('player').src=audioURL;$('player').hidden=false;
 $('selected').textContent=`${file.name} · ${duration.toFixed(1)} ${t('duration')} · ${(file.size/1024).toFixed(0)} KB`;
 status('reset');updateButton();
}
$('file').addEventListener('change',()=>choose($('file').files[0]));
for(const event of ['dragenter','dragover']) $('drop').addEventListener(event,e=>{e.preventDefault();$('drop').classList.add('active');});
for(const event of ['dragleave','drop']) $('drop').addEventListener(event,e=>{e.preventDefault();$('drop').classList.remove('active');});
$('drop').addEventListener('drop',e=>{if(e.dataTransfer.files.length===1) choose(e.dataTransfer.files[0]);else status('invalid');});
$('record').addEventListener('click',async()=>{
 if(!$('consent').checked){status('permission');return;}
 try{
  const stream=await navigator.mediaDevices.getUserMedia({audio:true});
  const type=['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/mp4'].find(x=>MediaRecorder.isTypeSupported(x));
  if(!type){stream.getTracks().forEach(track=>track.stop());throw new Error('Unsupported recording format');}
  recorder=new MediaRecorder(stream,{mimeType:type}); const current=recorder, chunks=[];let bytes=0;const start=performance.now();
  current.addEventListener('dataavailable',e=>{chunks.push(e.data);bytes+=e.data.size;if(bytes>limits.max_bytes&&current.state==='recording')current.stop();});
  current.addEventListener('stop',()=>{clearTimeout(recordingTimer);stream.getTracks().forEach(track=>track.stop());recorder=null;$('stop').disabled=true;$('record').disabled=false;const extension=type.includes('ogg')?'ogg':type.includes('mp4')?'m4a':'webm';choose(new File(chunks,`microphone.${extension}`,{type}), (performance.now()-start)/1000);});
  current.start(250);recordingTimer=setTimeout(()=>{if(current.state==='recording')current.stop();},(limits.max_seconds-0.5)*1000);
  $('record').disabled=true;$('stop').disabled=false;status('recording');updateButton();
 }catch{status('recordError');}
});
$('stop').addEventListener('click',()=>{if(recorder?.state==='recording')recorder.stop();});
function canvasChart(data){
 const canvas=$('timeline'),ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);
 const w=canvas.width/data.segments.length;
 data.segments.forEach((s,i)=>{ctx.fillStyle=`hsl(${170-s.fake_score*1.5} 65% ${25+s.fake_score*.35}%)`;const h=s.fake_score;ctx.fillRect(i*w,110-h,Math.max(1,w-2),h);});
 ctx.fillStyle='#e4edff';ctx.font='14px sans-serif';ctx.fillText(`0 s`,8,canvas.height-4);ctx.fillText(`${data.duration} s`,canvas.width-75,canvas.height-4);
 const spec=$('spectrum'),c=spec.getContext('2d'),values=data.spectrogram.values,rows=values.length,cols=values[0].length;
 c.clearRect(0,0,spec.width,spec.height);
 values.forEach((row,y)=>row.forEach((v,x)=>{c.fillStyle=`hsl(${240-v*200} 80% ${8+v*65}%)`;c.fillRect(x*spec.width/cols,(rows-1-y)*spec.height/rows,Math.ceil(spec.width/cols),Math.ceil(spec.height/rows));}));
 data.segments.forEach(s=>{c.fillStyle=`rgba(255,100,90,${s.fake_score/500})`;c.fillRect(s.start/data.duration*spec.width,0,(s.end-s.start)/data.duration*spec.width,spec.height);});
}
function resetResult(){
 $('reportDetails').hidden=true;$('score').textContent='--%';$('verdict').textContent=language==='ar'?'بانتظار التحليل':'AWAITING ANALYSIS';$('reason').textContent=t('noFile');drawScore(null);
}
function drawScore(score){
 const gauge=$('scoreGauge'),ctx=gauge.getContext('2d'),center=95,radius=87;
 ctx.clearRect(0,0,190,190);ctx.lineWidth=15;ctx.strokeStyle='#263454';ctx.beginPath();ctx.arc(center,center,radius,0,Math.PI*2);ctx.stroke();
 if(score!==null){ctx.strokeStyle='#818cf8';ctx.beginPath();ctx.arc(center,center,radius,-Math.PI/2,-Math.PI/2+Math.PI*2*score/100);ctx.stroke();}
 const meter=$('scoreMeter'),m=meter.getContext('2d');m.clearRect(0,0,meter.width,meter.height);m.fillStyle='#818cf8';if(score!==null)m.fillRect(0,0,meter.width*score/100,meter.height);
}
function render(data){
 drawScore(data.scores.fake);
 $('reportDetails').hidden=false;$('score').textContent=`${data.scores.fake.toFixed(2)}%`;$('verdict').textContent=t(data.prediction);$('reason').textContent=t(data.decision_reason);
 $('models').replaceChildren();data.models.forEach(m=>{const p=document.createElement('p');p.textContent=`${m.id}: ${m.fake_score.toFixed(2)}%`;p.dir='ltr';$('models').append(p);});
 $('segments').replaceChildren();data.segments.forEach(s=>{const tr=document.createElement('tr');[s.start,s.end,`${s.fake_score.toFixed(2)}%`,s.occlusion_delta==null?'—':s.occlusion_delta.toFixed(2)].forEach(v=>{const td=document.createElement('td');td.textContent=String(v);tr.append(td);});$('segments').append(tr);});
 $('disclaimer').textContent=language==='ar'?t('footer')+' '+t('scoreNote'):data.disclaimer;canvasChart(data);
}
$('analyze').addEventListener('click',()=>{
 if(!selected||!$('consent').checked||busy)return;
 if($('explain').checked&&selectedDuration>limits.max_explain_seconds){status('explainLimit');return;}
 busy=true;report=null;resetResult();updateButton();$('record').disabled=true;$('file').disabled=true;$('progress').hidden=false;$('progress').value=0;status('uploading');
 const form=new FormData();form.append('file',selected);form.append('consent','true');const xhr=new XMLHttpRequest();
 xhr.open('POST',`/api/v1/analyze?explain=${$('explain').checked}`);xhr.responseType='json';xhr.timeout=600000;
 xhr.upload.addEventListener('progress',e=>{if(e.lengthComputable)$('progress').value=e.loaded/e.total*100;});
 xhr.upload.addEventListener('load',()=>{$('progress').removeAttribute('value');status('processing');});
 xhr.addEventListener('load',()=>{if(xhr.status===200){report={...xhr.response,generated_at:new Date().toISOString()};render(report);status('done');}else{$('status').textContent=t('error')+(typeof xhr.response?.detail==='string'?xhr.response.detail:xhr.status);}});
 xhr.addEventListener('error',()=>status('error'));xhr.addEventListener('timeout',()=>status('error'));
 xhr.addEventListener('loadend',()=>{busy=false;$('progress').hidden=true;$('record').disabled=false;$('file').disabled=false;updateButton();});xhr.send(form);
});
$('download').addEventListener('click',()=>{if(!report)return;const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`voiceguard-${report.sha256.slice(0,12)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
async function checkHealth(){try{const response=await fetch('/health');const data=await response.json();ready=response.ok;if(data.max_bytes)limits=data;}catch{ready=false;}$('health').textContent=t(ready?'ready':'offline');showLimits();updateButton();}
drawScore(null);checkHealth();setInterval(checkHealth,30000);
