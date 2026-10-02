(function(){
  const config=window.PORTAL_CONFIG,cases=window.PORTAL_DATA.cases,$=(s,r=document)=>r.querySelector(s);
  const auth=$('#auth');
  if(sessionStorage.getItem('w7-facilitator')==='yes')auth.hidden=true;
  $('#authForm').addEventListener('submit',e=>{e.preventDefault();if($('#passcode').value===window.FACILITATOR_DATA.passcode){sessionStorage.setItem('w7-facilitator','yes');auth.hidden=true;}else $('#authError').textContent='Incorrect passcode.';});
  const select=$('#phaseSelect');
  const slideCount=13;
  const phaseStartSlides={1:0,3:1,5:2,7:3,9:4,10:5,11:6,12:7};
  const projectionChannel='BroadcastChannel' in window?new BroadcastChannel('infs5706-w7-presentation'):null;
  let projectorWindow=null,projectionMode='slides',currentSlide=0,projectorConnected=false;
  const instructions=[
    'Choose the authority you would give the agent for each action.',
    'Observe the agent’s goal, process, knowledge and stopping boundary.',
    'Classify AskTelstra using observable evidence from the case.',
    'Complete the eight design decisions before configuring a tool.',
    'Generate, challenge and revise your agent instructions.',
    'Configure the agent and run the representative synthetic case.',
    'Run the challenge variation, revise one instruction and rerun it.',
    'Prepare to show the agent and defend your implementation decision.'
  ];
  select.innerHTML=config.phases.map((p,i)=>`<option value="${i}">${i+1}. ${p.label} · ${p.minutes} min</option>`).join('');
  let remaining=config.phases[0].minutes*60,running=false,timerId=null;
  function timerState(){const index=Number(select.value),p=config.phases[index],m=Math.floor(remaining/60),s=remaining%60;return{phaseIndex:index,phase:p.label,phaseNumber:`Phase ${index+1} of ${config.phases.length}`,clock:`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`,status:running?'Running':remaining===0?'Time is up':'Ready or paused',instruction:instructions[index]};}
  function sendProjection(message){projectionChannel?.postMessage(message);if(projectorWindow&&!projectorWindow.closed)projectorWindow.postMessage({source:'w7-facilitator',...message},location.origin);}
  function syncProjection(){sendProjection({type:'state',mode:projectionMode,slide:currentSlide,timer:timerState()});}
  function updateProjectorStatus(){$('#projectorStatus').textContent=projectorConnected?'Projector window connected':'Projector window not connected';$('#projectorStatusDot').classList.toggle('connected',projectorConnected);$('#consoleSlideNumber').textContent=`Slide ${currentSlide+1} of ${slideCount}`;}
  function draw(){const t=timerState();$('#timer').textContent=t.clock;$('#timerStatus').textContent=t.status;$('#projectedClock').textContent=t.clock;$('#projectedStatus').textContent=t.status;$('#projectedStartPause').textContent=running?'Pause':'Start';sendProjection({type:'timer',timer:t});}
  function setPhase(){const index=Number(select.value),p=config.phases[index];remaining=p.minutes*60;running=false;clearInterval(timerId);$('#timerPhase').textContent=p.label;$('#projectedPhase').textContent=p.label;$('#projectedPhaseNumber').textContent=`Phase ${index+1} of ${config.phases.length}`;$('#projectedInstruction').textContent=instructions[index];$('#startPause').textContent='Start';draw();}
  function tick(){if(remaining>0){remaining--;draw();}else{running=false;clearInterval(timerId);$('#startPause').textContent='Start';draw();}}
  select.addEventListener('change',setPhase);
  function toggleTimer(){running=!running;$('#startPause').textContent=running?'Pause':'Start';clearInterval(timerId);if(running)timerId=setInterval(tick,1000);draw();}
  function closeProjection(){const view=$('#projectedTimer');view.hidden=true;if(document.fullscreenElement)document.exitFullscreen?.();}
  $('#startPause').addEventListener('click',toggleTimer);
  $('#projectedStartPause').addEventListener('click',toggleTimer);
  $('#resetTimer').addEventListener('click',setPhase);$('#addMinute').addEventListener('click',()=>{remaining+=60;draw();});
  $('#fullScreen').addEventListener('click',async()=>{const view=$('#projectedTimer');view.hidden=false;draw();try{await view.requestFullscreen?.();}catch(_){/* The projected view still fills the browser window. */}});
  $('#exitProjection').addEventListener('click',closeProjection);
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)$('#projectedTimer').hidden=true;});
  $('#openProjector').addEventListener('click',()=>{projectorConnected=false;updateProjectorStatus();setTimeout(syncProjection,500);});
  $('#showSlides').addEventListener('click',()=>{projectionMode='slides';sendProjection({type:'mode',mode:'slides'});});
  $('#showTimer').addEventListener('click',()=>{projectionMode='timer';sendProjection({type:'mode',mode:'timer',timer:timerState()});});
  $('#consolePrev').addEventListener('click',()=>{currentSlide=Math.max(0,currentSlide-1);sendProjection({type:'slide',index:currentSlide});updateProjectorStatus();});
  $('#consoleNext').addEventListener('click',()=>{currentSlide=Math.min(slideCount-1,currentSlide+1);if(Object.hasOwn(phaseStartSlides,currentSlide)){select.value=phaseStartSlides[currentSlide];setPhase();}sendProjection({type:'slide',index:currentSlide});updateProjectorStatus();});
  projectionChannel&&(projectionChannel.onmessage=e=>{const message=e.data||{};if(message.type==='ready'){projectorConnected=true;updateProjectorStatus();syncProjection();}if(message.type==='slideChanged'){currentSlide=Math.max(0,Math.min(slideCount-1,Number(message.index)||0));updateProjectorStatus();}});
  addEventListener('message',e=>{if(e.origin!==location.origin||e.data?.source!=='w7-projector')return;if(e.data.type==='ready'){projectorConnected=true;updateProjectorStatus();syncProjection();}if(e.data.type==='slideChanged'){currentSlide=Math.max(0,Math.min(slideCount-1,Number(e.data.index)||0));updateProjectorStatus();}});
  updateProjectorStatus();
  setPhase();
  sendProjection({type:'ping'});
  $('#phaseControls').innerHTML=config.phases.map((p,i)=>`<div class="phase-control"><div><span class="phase-tag">Phase ${i+1}</span><h3 style="margin-top:8px">${p.label}</h3><p>${p.minutes} minutes</p></div><div>${p.code?`<button class="button light reveal-code" data-code="${p.code}">Reveal code</button><span class="code" hidden>${p.code}</span>`:'<span class="code">OPEN</span>'}</div></div>`).join('');
  document.querySelectorAll('.reveal-code').forEach(b=>b.addEventListener('click',()=>{b.hidden=true;b.nextElementSibling.hidden=false;}));
  const base=new URL('index.html',location.href);
  $('#allocationBody').innerHTML=Object.entries(config.teamAssignments).map(([team,id])=>{const c=cases[id],u=new URL(base);u.searchParams.set('team',team);return `<tr><td>Team ${team}</td><td>Case ${c.code} · ${c.title}</td><td><a href="${u.href}" target="_blank" rel="noopener">Open team link</a></td></tr>`}).join('');
  $('#challengeCards').innerHTML=Object.entries(cases).map(([id,c])=>`<article class="card"><div class="case-badge"><span>${c.icon}</span>Case ${c.code}</div><h3>${c.title}</h3><p>${c.challenge}</p><details><summary>Facilitator look-fors</summary><ul>${window.FACILITATOR_DATA.lookFors[id].map(x=>`<li>${x}</li>`).join('')}</ul></details></article>`).join('');
})();
