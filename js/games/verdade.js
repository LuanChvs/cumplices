
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
          <div class="vd-pick" id="vdPick"></div>
        </div>
      </div>
    `);
    const vdPick = wrap.querySelector('#vdPick');

    const btnTruth = uiButton({
      text: 'Verdade',
      className: 'btn btn-ghost'
    });

    const btnDare = uiButton({
      text: 'Desafio',
      className: 'btn btn-ghost'
    });

    const btnRandom = uiButton({
      text: 'Surpreenda-me',
      className: 'btn btn-primary'
    });

    vdPick.append(btnTruth, btnDare, btnRandom);
    
    const card = wrap.querySelector('#vdCard');
    const game = createGameState({
      lastType: null
    });
    
    startGame(game);
  
    function draw(type){
      game.lastType = type;
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
      if(game.lastType) draw(game.lastType);
    });
    btnTruth.addEventListener('click', ()=>draw('truth'));
    btnDare.addEventListener('click', ()=>draw('dare'));
    btnRandom.addEventListener('click', ()=>draw(Math.random()<0.5?'truth':'dare'));
    return wrap;
  }
  