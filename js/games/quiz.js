/* =========================================================
   QUIZ — QUEM CONHECE MELHOR
========================================================= */
function renderQuiz(){
    const wrap = el(`<div></div>`);
    startRound();
    return wrap;
  
    function startRound(){
      const order = shuffle(QUIZ_PERGUNTAS);
      const state = { order, idx:0, score:{p1:0,p2:0}, turn:0, names:['Jogador 1','Jogador 2'] };
      draw(state);
    }
  
    function draw(state){
      const q = state.order[state.idx];
      wrap.innerHTML = `
        <section class="stage-head">
          <h1>Quem conhece melhor</h1>
          <p>Leiam a pergunta em voz alta. Quem está respondendo tenta acertar sobre o outro — a dupla decide se acertou.</p>
        </section>
        <div class="panel">
          <p class="quiz-progress">Pergunta ${state.idx+1} de ${state.order.length} · vez de ${state.names[state.turn % 2]}</p>
          <div class="quiz-q"><p>${q}</p></div>
          <div class="quiz-score">
            <div class="who"><b>${state.score.p1}</b><span>${state.names[0]}</span></div>
            <div class="who"><b>${state.score.p2}</b><span>${state.names[1]}</span></div>
          </div>
          <div class="quiz-buttons">
            <button class="btn btn-ok" id="rightBtn">Acertou</button>
            <button class="btn btn-miss" id="wrongBtn">Errou</button>
          </div>
        </div>
      `;
      wrap.querySelector('#rightBtn').addEventListener('click', ()=>advance(state,true));
      wrap.querySelector('#wrongBtn').addEventListener('click', ()=>advance(state,false));
    }
  
    function advance(state, correct){
      if(correct){
        if(state.turn % 2 === 0) state.score.p1++; else state.score.p2++;
      }
      state.idx++;
      state.turn++;
      if(state.idx >= state.order.length){ return finish(state); }
      draw(state);
    }
  
    function finish(state){
      const winner = state.score.p1 === state.score.p2
        ? 'Empate — vocês se conhecem igualmente bem.'
        : (state.score.p1 > state.score.p2 ? state.names[0] : state.names[1]) + ' conhece melhor o outro dessa vez.';
      wrap.innerHTML = `
        <section class="stage-head">
          <h1>Resultado</h1>
          <p>${winner}</p>
        </section>
        <div class="panel">
          <div class="quiz-score">
            <div class="who"><b>${state.score.p1}</b><span>${state.names[0]}</span></div>
            <div class="who"><b>${state.score.p2}</b><span>${state.names[1]}</span></div>
          </div>
          <div class="btn-row" style="justify-content:center;">
            <button class="btn btn-primary" id="restartBtn">Jogar outra rodada</button>
          </div>
        </div>
      `;
      wrap.querySelector('#restartBtn').addEventListener('click', startRound);
    }
  }