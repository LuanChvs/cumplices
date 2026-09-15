
/* =========================================================
   VERDADE OU DESAFIO
========================================================= */
function renderVD(){
    const wrap = el(`
      <div>
        <section class="stage-head">
          <h1>Verdade ou desafio</h1>
          <p>Escolham verdade ou desafio, ou deixem o acaso decidir. Sem julgamento — o combinado é responder ou topar.</p>
        </section>
        <div class="panel">
          <div class="vd-card" id="vdCard">
            <p>Toquem em verdade, desafio ou surpresa pra começar.</p>
          </div>
          <p class="vd-hint">Toque no cartão pra pegar outra carta do mesmo tipo.</p>
          <div class="vd-pick">
            <button class="btn btn-ghost" id="btnTruth">Verdade</button>
            <button class="btn btn-ghost" id="btnDare">Desafio</button>
            <button class="btn btn-primary" id="btnRandom">Surpreenda-me</button>
          </div>
        </div>
      </div>
    `);
    const card = wrap.querySelector('#vdCard');
    let lastType = null;
  
    function draw(type){
      lastType = type;
      const isTruth = type === 'truth';
      const text = isTruth ? pick(VERDADES) : pick(DESAFIOS);
      card.className = 'vd-card ' + (isTruth ? 'truth' : 'dare');
      card.innerHTML = `
        <div>
          <p class="kicker">${isTruth ? 'Verdade' : 'Desafio'}</p>
          <p>${text}</p>
        </div>
      `;
    }
    card.addEventListener('click', ()=>{
      if(lastType) draw(lastType);
    });
    wrap.querySelector('#btnTruth').addEventListener('click', ()=>draw('truth'));
    wrap.querySelector('#btnDare').addEventListener('click', ()=>draw('dare'));
    wrap.querySelector('#btnRandom').addEventListener('click', ()=>draw(Math.random()<0.5?'truth':'dare'));
    return wrap;
  }
  