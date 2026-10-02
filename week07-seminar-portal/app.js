(function(){
  const config = window.PORTAL_CONFIG;
  const cases = window.PORTAL_DATA.cases;
  const state = { team:null, caseId:null, members:"", unlocked:0, responses:{}, votes:{}, generated:"" };
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const list = items => `<ul>${items.map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul>`;
  const phaseGuidance=[
    {do:'Classify each action as Act, Check or Stop, then discuss one response your team disagreed about.',good:'You can explain each choice using consequence, reversibility, information access or human authority.'},
    {do:'Observe the demonstration and identify the agent’s goal, process, knowledge and stopping boundary.',good:'Your diagnosis refers to behaviour you observed, rather than the quality of the final answer alone.'},
    {do:'Classify current AskTelstra and examine the customer scenario allocated to your team.',good:'Your classification separates reported evidence from assumptions and identifies evidence that is still missing.'},
    {do:'Complete all eight design decisions before opening an agent-building tool.',good:'The user, bounded goal, inputs, process, knowledge, output, prohibitions and human responsibility fit together.'},
    {do:'Generate the instructions, challenge their ambiguity and revise at least one weakness.',good:'The instructions tell the agent what to do, what evidence it may use, when to stop and when to escalate.'},
    {do:'Configure the agent, add the approved knowledge source and run the representative synthetic case.',good:'The agent gathers important gaps, uses approved guidance, produces the required output and stays within its boundary.'},
    {do:'Run the challenge variation, compare expected and observed behaviour, revise one instruction and rerun it.',good:'Your recorded evidence shows whether the revision changed the relevant behaviour.'},
    {do:'Show the agent briefly, defend your implementation judgement, then download and submit the team record.',good:'Your defence uses observed behaviour to explain value, limitation, revision and continuing human responsibility.'}
  ];

  function storageKey(){ return state.team ? `infs5706-w7-team-${state.team}` : "infs5706-w7-unassigned"; }
  function load(team){
    const raw = localStorage.getItem(`infs5706-w7-team-${team}`);
    if(!raw) return;
    try { Object.assign(state, JSON.parse(raw), {team:Number(team)}); } catch(e) { console.warn("Saved state could not be loaded", e); }
  }
  let saveTimer;
  function save(){
    if(!state.team) return;
    clearTimeout(saveTimer);
    $("#saveState").textContent="Saving…";
    saveTimer=setTimeout(()=>{
      localStorage.setItem(storageKey(), JSON.stringify(state));
      $("#saveState").textContent="Saved on this device";
    },180);
  }
  function field(id,label,help="",rows=3){
    return `<label for="${id}">${label}</label><textarea id="${id}" data-field="${id}" rows="${rows}">${escapeHtml(state.responses[id]||"")}</textarea>${help?`<div class="field-help">${help}</div>`:""}`;
  }
  function gate(index){
    const phase=config.phases[index];
    if(index<=state.unlocked) return "";
    return `<div class="gate" data-gate="${index}"><div class="icon" style="margin-inline:auto">🔒</div><h3>${escapeHtml(phase.label)} is locked</h3><p>Enter the release code announced by your facilitator.</p><form><label for="code-${index}">Release code</label><input id="code-${index}" type="text" autocomplete="off"><div class="controls" style="justify-content:center"><button class="button yellow" type="submit">Unlock phase</button></div><div class="gate-error" aria-live="polite"></div></form></div>`;
  }
  function publicGuideUrl(c){ return new URL(`knowledge/${c.slug}`, location.href).href; }
  function panel(index,id,title,body){
    const locked=index>state.unlocked;
    const guide=phaseGuidance[index];
    return `<section class="panel seminar-phase" id="${id}" data-phase="${index}"><div class="phase-tag">Phase ${index+1} · ${config.phases[index].minutes} min</div><h2>${title}</h2><div class="phase-brief"><div><strong>Do this</strong><span>${escapeHtml(guide.do)}</span></div><div><strong>Good looks like</strong><span>${escapeHtml(guide.good)}</span></div></div>${locked?gate(index):body}</section>`;
  }
  function renderJourney(){
    const c=cases[state.caseId];
    const warmup=panel(0,"warmup","Would you let an agent do this before coffee?",`
      <p>Choose the level of authority you would give the agent for each action.</p>
      <div id="warmupItems"></div>
      ${field("warmupReflection","What changed across your decisions?","Consider consequence, reversibility, information access and human authority.",2)}`);
    const observe=panel(1,"observe","Watch a simple agent work",`
      <p>During the facilitator demonstration, observe the complete run.</p><div class="grid">
      <div class="card"><div class="icon">◎</div><h3>Goal</h3><p>What outcome is the agent pursuing?</p></div>
      <div class="card"><div class="icon">↻</div><h3>Process</h3><p>What steps does it manage?</p></div>
      <div class="card"><div class="icon">▤</div><h3>Knowledge</h3><p>What approved information does it use?</p></div>
      <div class="card"><div class="icon">■</div><h3>Boundary</h3><p>Where does it stop and hand responsibility to a person?</p></div></div>
      ${field("demoDiagnosis","What made the experience agentic?","Identify observable behaviour rather than describing only the final answer.",3)}
      <div class="notice"><strong>Working classification:</strong> a bounded conversational agent with limited autonomy.</div>`);
    const transfer=panel(2,"transfer","Transfer the design test to AskTelstra",`
      <div class="scenario"><h3>Today’s organisational case</h3><p>Frontline employees must navigate extensive internal information while assisting customers. Telstra has reported that AskTelstra uses generative AI and internal knowledge resources to help employees find and formulate information.</p></div>
      <div class="grid"><div class="card blue"><h3>What has been reported?</h3><ul><li>Faster access to relevant information</li><li>Positive employee perceptions</li><li>Deployment beyond the initial pilot</li></ul></div><div class="card pink"><h3>What remains unestablished?</h3><ul><li>Consistent answer accuracy</li><li>Improved customer outcomes</li><li>How failures and uncertainty are handled</li><li>Independent workflow management</li></ul></div></div>
      <label for="classification">Based on the available evidence, how should current AskTelstra be classified?</label><select id="classification" data-field="classification"><option value="">Choose…</option><option>Search tool</option><option>AI assistant</option><option>Bounded agent</option><option>Autonomous customer-service system</option></select>
      ${field("classificationReason","What observable behaviour supports your answer?","State the evidence you have and one piece of evidence you would still seek.",2)}
      <div class="scenario"><div class="case-badge"><span>${c.icon}</span> Team ${state.team} · Case ${c.code}</div><h3>${escapeHtml(c.title)}</h3><blockquote>${escapeHtml(c.opening)}</blockquote><p><strong>Bounded outcome:</strong> ${escapeHtml(c.outcome)}</p></div>`);
    const design=panel(3,"design","Design before you build",`
      <div class="notice"><strong>Your public knowledge source:</strong> <a href="${publicGuideUrl(c)}" target="_blank" rel="noopener">${escapeHtml(publicGuideUrl(c))}</a></div>
      <div class="form-grid">${field("user","1. User","Who will use the agent?")}${field("goal","2. Goal","What single outcome will it support?")}${field("inputs","3. Inputs","What information will it receive or gather?")}${field("process","4. Process","What steps should it follow?",5)}${field("knowledge","5. Knowledge","What approved information may it use?")}${field("output","6. Output","What response, recommendation or handover will it produce?")}${field("boundaries","7. Boundaries","What must it not decide or do?",4)}${field("human","8. Human responsibility","Where must the employee review, decide or act?",4)}</div>
      <div class="notice"><strong>Design check:</strong> Could the agent complete the task without exceeding the authority you have defined?</div>`);
    const instructions=panel(4,"instructions","Turn your design into instructions",`
      <p>The composer organises your design decisions into an instruction. It does not repair missing or weak decisions.</p>
      <div class="controls"><button class="button yellow" id="generateInstructions">Generate instructions</button><button class="button light" id="copyInstructions">Copy instructions</button></div>
      <label for="generatedInstructions">Editable agent instructions</label><textarea id="generatedInstructions" class="generated" data-field="generatedInstructions" rows="20">${escapeHtml(state.responses.generatedInstructions||"")}</textarea>
      ${field("peerAmbiguity","Peer challenge: one ambiguous instruction","What could the agent interpret in more than one way?",2)}
      ${field("peerMissing","Peer challenge: one missing rule","Identify a missing-information, stopping or escalation condition.",2)}
      ${field("peerHuman","Peer challenge: one unclear human responsibility","Where could the agent exceed the intended boundary?",2)}
      ${field("instructionRevision","Revision made before configuration","State the change and the design weakness it addresses.",2)}`);
    const build=panel(5,"build","Configure and run the representative case",`
      <div class="grid"><div class="card"><h3>1. Configure</h3><p>Paste the instructions into Microsoft Copilot Agent Builder or ChatGPT GPT Builder.</p></div><div class="card"><h3>2. Add knowledge</h3><p>Use the public case guidance URL supplied in Phase 4.</p></div><div class="card"><h3>3. Run</h3><p>Begin with the customer opening message. Supply additional synthetic facts only when the agent asks appropriately.</p></div><div class="card"><h3>4. Observe</h3><p>Record evidence about the process, output, uncertainty and boundary.</p></div></div>
      <div class="scenario"><h3>Representative customer message</h3><blockquote>${escapeHtml(c.opening)}</blockquote></div>
      <details><summary>Open the synthetic facts when the agent asks</summary><div class="notice">${list(c.facts)}</div></details>
      ${field("buildWorked","One behaviour that worked as intended","Describe what the agent did and the evidence you observed.",3)}
      ${field("buildFailed","One behaviour that did not work as intended","Describe the behaviour and why it matters.",3)}
      ${field("buildOutput","What useful output did the agent produce?","Summarise rather than pasting customer information.",3)}`);
    const challenge=panel(6,"challenge","Challenge and refine the agent",`
      <div class="scenario"><h3>Challenge variation</h3><blockquote>${escapeHtml(c.challenge)}</blockquote></div>
      ${field("challengeExpected","What did you expect the agent to do?","Refer to the intended process, boundary or stopping condition.",2)}
      ${field("challengeObserved","What did it actually do?","Record observable behaviour.",3)}
      ${field("challengeCause","Which instruction produced, or failed to prevent, the behaviour?","Identify the relevant wording or omission.",2)}
      ${field("challengeChange","What did you change?","Improve the process, evidence use, boundary or stopping behaviour.",2)}
      ${field("challengeRetest","What happened after the change?","Record the result of the rerun.",3)}`);
    const defend=panel(7,"defend","Show, tell and defend",`
      <div class="grid three"><div class="card"><h3>The job</h3><p>Who does the agent support and what bounded outcome does it pursue?</p></div><div class="card"><h3>The behaviour</h3><p>What did it do across the task?</p></div><div class="card"><h3>The output</h3><p>What useful recommendation or handover did it produce?</p></div><div class="card"><h3>The boundary</h3><p>Where must a person review, decide or act?</p></div><div class="card"><h3>The revision</h3><p>What did the challenge case cause you to change?</p></div><div class="card"><h3>The decision</h3><p>Retain, revise or reject the design?</p></div></div>
      <label for="finalDecision">Final design judgement</label><select id="finalDecision" data-field="finalDecision"><option value="">Choose…</option><option>Retain</option><option>Revise</option><option>Reject</option></select>
      ${field("finalReason","Defend your decision","Refer to observed behaviour, value, limitation and human responsibility.",3)}
      <div class="controls"><button class="button yellow" id="downloadDocx">Download team record (.docx)</button><button class="button light" id="resetTeam">Reset this team workspace</button></div>
      <div class="submission-callout final-submission"><div class="submission-callout__label">Required participation hand-up</div><h3>Download and submit this team’s Word record</h3><p>The nominated recorder must download the record before leaving and submit it using the method announced by the facilitator. Check that the file identifies your team and contains the team’s final design, observed behaviours, revision and implementation judgement.</p></div>`);
    $("#journey").innerHTML=warmup+observe+transfer+design+instructions+build+challenge+defend;
    $("#journey").hidden=false;
    renderWarmup(); bindJourney(); renderNav(); updateNav();
  }
  function renderWarmup(){
    const items=["Find the nearest café that is currently open.","Order your usual coffee for collection.","Message your tutor that you will be late.","Explain your absence using a plausible excuse.","Withdraw you from today’s class because your calendar looks busy.","Accept a graduate job offer because it matches your preferences."];
    const host=$("#warmupItems"); if(!host) return;
    host.innerHTML=items.map((item,i)=>`<div class="card" style="margin:12px 0"><strong>${i+1}. ${item}</strong><div class="choice-row" data-vote="${i}">${["ACT","CHECK","STOP"].map(v=>`<button type="button" class="choice ${state.votes[i]===v?"selected":""}" data-value="${v}">${v}</button>`).join("")}</div></div>`).join("");
    $$("[data-vote]").forEach(row=>row.addEventListener("click",e=>{const b=e.target.closest("button[data-value]");if(!b)return;state.votes[row.dataset.vote]=b.dataset.value;$$('button',row).forEach(x=>x.classList.toggle('selected',x===b));save();}));
  }
  function renderNav(){
    $("#phaseNav").innerHTML=config.phases.map((p,i)=>`<a href="#${p.id}" data-nav="${i}">${i+1}. ${escapeHtml(p.label)}</a>`).join("");
  }
  function updateNav(){
    $$("[data-nav]").forEach(a=>a.classList.toggle("locked",Number(a.dataset.nav)>state.unlocked));
  }
  function bindJourney(){
    $$('[data-field]').forEach(el=>{
      const event=el.tagName==="SELECT"?"change":"input";
      el.addEventListener(event,()=>{state.responses[el.dataset.field]=el.value;save();});
    });
    $$('[data-gate] form').forEach(form=>form.addEventListener('submit',e=>{
      e.preventDefault(); const box=form.closest('[data-gate]'); const index=Number(box.dataset.gate); const entered=$('input',form).value.trim().toUpperCase(); const expected=config.phases[index].code.toUpperCase();
      if(entered===expected){state.unlocked=Math.max(state.unlocked,index);save();renderJourney();setTimeout(()=>document.getElementById(config.phases[index].id)?.scrollIntoView(),50);}else{$('.gate-error',form).textContent='That code does not unlock this phase. Check it with your facilitator.';}
    }));
    $('#generateInstructions')?.addEventListener('click',()=>{const text=composeInstructions();state.responses.generatedInstructions=text;$('#generatedInstructions').value=text;save();});
    $('#copyInstructions')?.addEventListener('click',async()=>{const text=$('#generatedInstructions').value;await navigator.clipboard.writeText(text);$('#copyInstructions').textContent='Copied';setTimeout(()=>$('#copyInstructions').textContent='Copy instructions',1300);});
    $('#downloadDocx')?.addEventListener('click',downloadDocx);
    $('#resetTeam')?.addEventListener('click',()=>{if(confirm('Delete this team’s responses from this browser?')){localStorage.removeItem(storageKey());location.href=location.pathname;}});
  }
  function composeInstructions(){
    const c=cases[state.caseId], r=state.responses;
    const missing=["user","goal","inputs","process","knowledge","output","boundaries","human"].filter(k=>!String(r[k]||"").trim());
    if(missing.length){alert(`Complete these design fields first: ${missing.join(', ')}`);}
    return `ROLE AND USER\nYou are a simple AI agent supporting ${r.user||'[define the user]'}.\n\nGOAL\nWork towards this single bounded outcome: ${r.goal||'[define the outcome]'}.\n\nREQUIRED INFORMATION\nReceive or gather: ${r.inputs||'[define the required information]'}. Ask focused questions when essential information is missing. Do not invent missing facts.\n\nPROCESS\n${r.process||'[define the required process]'}. Reassess the case after receiving new information.\n\nAPPROVED KNOWLEDGE\nApproved sources and information: ${r.knowledge||'[define the approved knowledge]'}. Also use the seminar guidance at ${publicGuideUrl(c)}. If sources are silent, unclear or conflicting, state the uncertainty and stop or escalate.\n\nREQUIRED OUTPUT\nProduce ${r.output||'[define the required output]'}. Separate confirmed facts, customer statements, uncertainty and recommendations.\n\nBOUNDARIES\nProhibited decisions and actions: ${r.boundaries||'[define prohibited decisions and actions]'}. Do not access real systems, make account changes, contact another organisation or present a recommendation as a final organisational decision.\n\nHUMAN RESPONSIBILITY AND ESCALATION\n${r.human||'[define where a person reviews, decides or acts]'}. Hand consequential decisions and actions to an authorised employee. Stop when the required output is complete, when essential information cannot be obtained, when guidance is insufficient or conflicting, or when the case requires authority outside these boundaries.`;
  }
  function teamSetup(team,members=""){
    state.team=Number(team); load(team); state.team=Number(team); state.members=members||state.members||""; state.caseId=config.teamAssignments[state.team]; state.unlocked=Math.max(0,state.unlocked||0); save();
    const c=cases[state.caseId]; $('#teamNumber').value=state.team; $('#teamMembers').value=state.members; $('#teamSummary').hidden=false; $('#teamSummary').innerHTML=`<strong>Team ${state.team}: Case ${c.code} · ${escapeHtml(c.title)}</strong><br>One recorder should continue on this device. Other members may open the same team workspace for reference.`; renderJourney();
  }
  $('#teamForm').addEventListener('submit',e=>{e.preventDefault();teamSetup($('#teamNumber').value,$('#teamMembers').value.trim());});
  const queryTeam=new URLSearchParams(location.search).get('team'); if(queryTeam&&config.teamAssignments[queryTeam]) teamSetup(queryTeam);
  addEventListener('scroll',()=>{const d=document.documentElement;$('#progressBar').style.width=`${Math.min(100,(d.scrollTop/(d.scrollHeight-d.clientHeight))*100)||0}%`;const sections=$$('.seminar-phase');let current=0;sections.forEach(s=>{if(s.getBoundingClientRect().top<180)current=Number(s.dataset.phase)});$$('[data-nav]').forEach(a=>a.classList.toggle('active',Number(a.dataset.nav)===current));},{passive:true});

  function xmlEscape(v){return String(v??"").replace(/[<>&'\"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"}[c]));}
  function crc32(bytes){let table=crc32.table||(crc32.table=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0;}));let c=0xffffffff;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
  function u16(n){return [n&255,(n>>>8)&255]}
  function u32(n){return [n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]}
  function zipStore(files){const enc=new TextEncoder(),locals=[],central=[];let offset=0;for(const [name,content] of Object.entries(files)){const nb=enc.encode(name),db=enc.encode(content),crc=crc32(db);const local=new Uint8Array([0x50,0x4b,0x03,0x04,...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(db.length),...u32(db.length),...u16(nb.length),...u16(0),...nb,...db]);locals.push(local);const cen=new Uint8Array([0x50,0x4b,0x01,0x02,...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(db.length),...u32(db.length),...u16(nb.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...nb]);central.push(cen);offset+=local.length;}const centralSize=central.reduce((a,b)=>a+b.length,0),end=new Uint8Array([0x50,0x4b,0x05,0x06,...u16(0),...u16(0),...u16(central.length),...u16(central.length),...u32(centralSize),...u32(offset),...u16(0)]);return new Blob([...locals,...central,end],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});}
  function p(text,style=""){return `<w:p>${style?`<w:pPr><w:pStyle w:val="${style}"/></w:pPr>`:""}<w:r><w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r></w:p>`;}
  function downloadDocx(){
    const c=cases[state.caseId],r=state.responses;
    const sections=[['Team',`Team ${state.team}${state.members?` · ${state.members}`:''}`],['Allocated case',`Case ${c.code} · ${c.title}`],['User',r.user],['Goal',r.goal],['Inputs',r.inputs],['Process',r.process],['Knowledge',r.knowledge],['Output',r.output],['Boundaries',r.boundaries],['Human responsibility',r.human],['Final agent instructions',r.generatedInstructions],['Representative run: behaviour that worked',r.buildWorked],['Representative run: behaviour that did not work',r.buildFailed],['Representative run: useful output',r.buildOutput],['Challenge: expected behaviour',r.challengeExpected],['Challenge: observed behaviour',r.challengeObserved],['Challenge: instruction responsible or missing',r.challengeCause],['Challenge: change made',r.challengeChange],['Challenge: retest result',r.challengeRetest],['Final judgement',r.finalDecision],['Decision rationale',r.finalReason]];
    const body=[p('Week 7 Simple Agent Design and Build Record','Title'),p('AskTelstra seminar simulation','Subtitle'),...sections.flatMap(([h,v])=>[p(h,'Heading1'),p(v||'No response recorded.')]),p('Generated from the Week 7 seminar portal. All case information is synthetic.')].join('');
    const files={
      '[Content_Types].xml':'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>',
      '_rels/.rels':'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
      'word/_rels/document.xml.rels':'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
      'word/styles.xml':'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="22"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:rPr><w:b/><w:sz w:val="36"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:rPr><w:i/><w:sz w:val="24"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="240" w:after="80"/></w:pPr><w:rPr><w:b/><w:sz w:val="26"/></w:rPr></w:style></w:styles>',
      'word/document.xml':`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`
    };
    const blob=zipStore(files),a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=`Week_07_Team_${state.team}_Simple_Agent_Record.docx`;
    a.hidden=true;
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);
  }
})();
