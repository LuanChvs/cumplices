/* =========================================================
   QUIZ — QUEM CONHECE MELHOR
========================================================= */

function renderQuiz() {
  const wrap = el(`<div></div>`);

  startRound();

  return wrap;


  function startRound() {
    const order = shuffle(QUIZ_PERGUNTAS);

    const state = createGameState({
      order,
      idx: 0,
      score: {
        p1: 0,
        p2: 0
      },
      turn: 0,
      names: [
        'Jogador 1',
        'Jogador 2'
      ]
    });

    startGame(state);
    draw(state);
  }


  function draw(state) {
    const q = state.order[state.idx];

    wrap.innerHTML = `
      <div id="gameHeader"></div>

      <div class="panel">
        <p class="quiz-progress" aria-live="polite">
          Pergunta ${state.idx + 1} de ${state.order.length}
          · vez de ${state.names[state.turn % 2]}
        </p>

        <div class="quiz-q">
          <p>${q}</p>
        </div>

        <div class="quiz-score">
          <div class="who">
            <b>${state.score.p1}</b>
            <span>${state.names[0]}</span>
          </div>

          <div class="who">
            <b>${state.score.p2}</b>
            <span>${state.names[1]}</span>
          </div>
        </div>

        <div class="quiz-buttons" id="quizButtons"></div>
      </div>
    `;

    const gameHeader = wrap.querySelector('#gameHeader');

    gameHeader.appendChild(
      createGameHeader({
        title: 'Quem conhece melhor',
        description: 'Leiam a pergunta em voz alta. Quem está respondendo tenta acertar sobre o outro — a dupla decide se acertou.'
      })
    );

    const quizButtons = wrap.querySelector('#quizButtons');

    const rightBtn = uiButton({
      text: 'Acertou',
      className: 'btn btn-ok'
    });

    const wrongBtn = uiButton({
      text: 'Errou',
      className: 'btn btn-miss'
    });

    rightBtn.addEventListener('click', () => {
      advance(state, true);
    });

    wrongBtn.addEventListener('click', () => {
      advance(state, false);
    });

    quizButtons.append(
      rightBtn,
      wrongBtn
    );
  }


  function advance(state, correct) {
    if (correct) {
      if (state.turn % 2 === 0) {
        state.score.p1++;
      } else {
        state.score.p2++;
      }
    }

    state.idx++;
    state.turn++;

    if (state.idx >= state.order.length) {
      return finish(state);
    }

    draw(state);
  }


  function finish(state) {
    endGame(state);

    const winner =
      state.score.p1 === state.score.p2
        ? 'Empate — vocês se conhecem igualmente bem.'
        : (
            state.score.p1 > state.score.p2
              ? state.names[0]
              : state.names[1]
          ) + ' conhece melhor o outro dessa vez.';

    wrap.innerHTML = `
      <div id="gameHeader" aria-live="polite"></div>

      <div class="panel">
        <div class="quiz-score">
          <div class="who">
            <b>${state.score.p1}</b>
            <span>${state.names[0]}</span>
          </div>

          <div class="who">
            <b>${state.score.p2}</b>
            <span>${state.names[1]}</span>
          </div>
        </div>

        <div
          class="btn-row"
          id="restartSlot"
          style="justify-content:center;"
        ></div>
      </div>
    `;

    const gameHeader = wrap.querySelector('#gameHeader');

    gameHeader.appendChild(
      createGameHeader({
        title: 'Resultado',
        description: winner
      })
    );

    const restartSlot = wrap.querySelector('#restartSlot');

    const restartBtn = uiButton({
      text: 'Jogar outra rodada',
      className: 'btn btn-primary'
    });

    restartSlot.appendChild(restartBtn);

    restartBtn.addEventListener('click', startRound);
  }
}