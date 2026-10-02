(function(){
  const id=document.body.dataset.case,c=window.PORTAL_DATA.cases[id],config=window.PORTAL_CONFIG;
  if(!c){document.body.innerHTML='<main class="public-guide"><h1>Case guidance unavailable</h1></main>';return;}
  const esc=v=>String(v).replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
  const list=items=>`<ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  document.title=`Case ${c.code} Guidance · ${c.title}`;
  document.querySelector('.public-guide').innerHTML=`
    <header><div class="eyebrow">INFS5706 · Week 7 synthetic knowledge source</div><h1>Case ${c.code} · ${esc(c.title)}</h1><p class="lead">Approved seminar guidance for the simple-agent prototype.</p></header>
    <div class="notice danger"><strong>Seminar simulation notice</strong><p>${esc(config.seminarNotice)}</p><p>This page contains guidance only. It does not contain the customer case or challenge variation.</p></div>
    <section><h2>Purpose of the agent</h2><p>${esc(c.outcome)}</p></section>
    <section><h2>Information the employee may need</h2>${list(c.gather)}</section>
    <section><h2>Approved guidance</h2>${list(c.guidance)}</section>
    <section><h2>Required output</h2>${list(c.output)}</section>
    <section><h2>Prohibited decisions and actions</h2>${list(c.prohibited)}</section>
    <section><h2>Human responsibility</h2><p>The agent prepares and recommends. An authorised employee reviews the output, communicates with the customer and initiates any permitted organisational action.</p></section>
    <p class="copyright">© Xavier Jusay, created with Codex. For enrolled-student use. Do not republish, reproduce or share externally without permission.</p>`;
})();
