/* =========================================================
   STOP
========================================================= */

function renderStop() {
  const wrap = el(`<div></div>`);

  const scoreState = {
    losses: {},
    roundNumber: 0
  };

  let deck = [];
  let deckPos = 0;

  let activeTimer = null;


  function freshDeck() {
    deck = shuffle(STOP_TEMAS);
    deckPos = 0;
  }


  function drawCard() {
    if (deckPos >= deck.length) {
      freshDeck();
    }

    return deck[deckPos++];
  }


  /*
    Limpeza usada pelo Router quando
    o usuário sai do Stop.
  */
  wrap.cleanup = () => {
    if (activeTimer) {
      activeTimer.cancel();
      activeTimer = null;
    }

    sound.timerStop();
  };


  freshDeck();
  showSetup();

  return wrap;


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  function showSetup() {
    /*
      Caso a configuração seja reaberta
      internamente, garantimos que não exista
      nenhum timer antigo.
    */
    if (activeTimer) {
      activeTimer.cancel();
      activeTimer = null;
    }

    sound.timerStop();


    scoreState.losses = {};
    scoreState.roundNumber = 0;


    const savedPlayers = storageGet(
      'players',
      ['Jogador 1', 'Jogador 2']
    );


    const savedStopPrefs = storageGet(
      'stop.preferences',
      {}
    );


    let playerNames =
      Array.isArray(savedPlayers) &&
      savedPlayers.length >= 2
        ? savedPlayers
        : ['Jogador 1', 'Jogador 2'];


    let temaEscolhido = null;


    let modoEscolhido =
      STOP_MODOS.some(
        m => m.id === savedStopPrefs.modo
      )
        ? savedStopPrefs.modo
        : 'ate-morte';


    const modoInicial =
      modoPorId(modoEscolhido);


    let tempoEscolhido =
      modoInicial.tempos.includes(
        savedStopPrefs.tempo
      )
        ? savedStopPrefs.tempo
        : modoInicial.tempoPadrao;


    wrap.innerHTML = `
      <div id="gameHeader"></div>

      <div class="panel">
        <label class="field-label">
          Modo de jogo
        </label>

        <div
          class="chip-row"
          id="modoChips"
        ></div>

        <p
          class="field-hint"
          id="modoDesc"
        ></p>
      </div>


      <div class="panel">
        <label class="field-label">
          Tema da rodada
        </label>

        <div class="deck-wrap">
          <div
            class="theme-card face-down"
            id="themeCard"
          >
            ?
          </div>

          <div id="drawButtonSlot"></div>
        </div>
      </div>


      <div class="panel">
        <label
          class="field-label"
          id="tempoFieldLabel"
        ></label>

        <div
          class="chip-row"
          id="tempoChips"
        ></div>
      </div>


      <div class="panel">
        <label class="field-label">
          Quem vai jogar
        </label>

        <div id="playersWrap"></div>

        <div id="addPlayerButtonSlot"></div>

        <div
          class="btn-row"
          id="startButtonSlot"
        ></div>
      </div>
    `;


    /* =========================================================
       HEADER
    ========================================================= */

    const gameHeader =
      wrap.querySelector('#gameHeader');


    gameHeader.appendChild(
      createGameHeader({
        title: 'Stop',
        description: 'Uma carta define o tema. O jogador da vez fala uma palavra que caiba no tema, aperta a letra inicial dela e passa a vez. Letras já apertadas saem do jogo. Se o cronômetro acabar na sua vez, você perde a rodada.'
      })
    );


    /* =========================================================
       ELEMENTOS
    ========================================================= */

    const themeCard =
      wrap.querySelector('#themeCard');


    const drawButtonSlot =
      wrap.querySelector('#drawButtonSlot');


    const modoChips =
      wrap.querySelector('#modoChips');


    const modoDesc =
      wrap.querySelector('#modoDesc');


    const tempoFieldLabel =
      wrap.querySelector('#tempoFieldLabel');


    const tempoChips =
      wrap.querySelector('#tempoChips');


    const playersWrap =
      wrap.querySelector('#playersWrap');


    const addPlayerButtonSlot =
      wrap.querySelector('#addPlayerButtonSlot');


    const startButtonSlot =
      wrap.querySelector('#startButtonSlot');


    /* =========================================================
       COMPRAR CARTA
    ========================================================= */

    const drawBtn =
      uiButton({
        text: 'Comprar carta',
        className: 'btn btn-ghost'
      });


    drawButtonSlot.appendChild(
      drawBtn
    );


    drawBtn.addEventListener(
      'click',
      () => {
        temaEscolhido = drawCard();

        themeCard.className =
          'theme-card revealed';

        themeCard.textContent =
          temaEscolhido;

        drawBtn.textContent =
          'Comprar outra carta';

        updateStartBtn();
      }
    );


    /* =========================================================
       MODOS
    ========================================================= */

    STOP_MODOS.forEach(m => {
      const c =
        document.createElement('button');

      c.type = 'button';

      c.className =
        'chip' +
        (
          m.id === modoEscolhido
            ? ' selected'
            : ''
        );

      c.textContent = m.nome;

      c.dataset.modo = m.id;


      c.addEventListener(
        'click',
        () => {
          sound.click();

          modoEscolhido = m.id;


          modoChips
            .querySelectorAll('.chip')
            .forEach(x => {
              x.classList.toggle(
                'selected',
                x.dataset.modo === m.id
              );
            });


          const cfg =
            modoPorId(modoEscolhido);


          modoDesc.textContent =
            cfg.desc;


          tempoEscolhido =
            cfg.tempoPadrao;


          storageSet(
            'stop.preferences',
            {
              modo: modoEscolhido,
              tempo: tempoEscolhido
            }
          );


          renderTempoChips();
        }
      );


      modoChips.appendChild(c);
    });


    modoDesc.textContent =
      modoPorId(modoEscolhido).desc;


    /* =========================================================
       TEMPO
    ========================================================= */

    function renderTempoChips() {
      const cfg =
        modoPorId(modoEscolhido);


      tempoFieldLabel.textContent =
        cfg.tempoLabelCampo;


      tempoChips.innerHTML = '';


      cfg.tempos.forEach(
        (s, si) => {
          const c =
            document.createElement('button');

          c.type = 'button';

          c.className =
            'chip' +
            (
              s === tempoEscolhido
                ? ' selected'
                : ''
            );

          c.textContent =
            cfg.tempoLabels[si];


          c.addEventListener(
            'click',
            () => {
              sound.click();

              tempoEscolhido = s;


              tempoChips
                .querySelectorAll('.chip')
                .forEach(x => {
                  x.classList.remove(
                    'selected'
                  );
                });


              c.classList.add(
                'selected'
              );


              storageSet(
                'stop.preferences',
                {
                  modo: modoEscolhido,
                  tempo: tempoEscolhido
                }
              );
            }
          );


          tempoChips.appendChild(c);
        }
      );
    }


    renderTempoChips();


    /* =========================================================
       JOGADORES
    ========================================================= */

    function renderPlayers() {
      playersWrap.innerHTML = '';


      playerNames.forEach(
        (name, i) => {
          const row =
            document.createElement('div');

          row.className =
            'player-row';


          row.innerHTML = `
            <input
              class="text-input"
              data-i="${i}"
              value="${name}"
              placeholder="Jogador ${i + 1}"
            >

            ${
              playerNames.length > 2
                ? `
                  <button
                    type="button"
                    class="player-remove"
                    data-remove="${i}"
                    aria-label="Remover jogador ${i + 1}"
                  >
                    ×
                  </button>
                `
                : ''
            }
          `;


          playersWrap.appendChild(row);
        }
      );


      playersWrap
        .querySelectorAll('input')
        .forEach(inp => {
          inp.addEventListener(
            'input',
            () => {
              playerNames[
                +inp.dataset.i
              ] = inp.value;


              storageSet(
                'players',
                playerNames
              );
            }
          );
        });


      playersWrap
        .querySelectorAll('[data-remove]')
        .forEach(btn => {
          btn.addEventListener(
            'click',
            () => {
              sound.click();


              playerNames.splice(
                +btn.dataset.remove,
                1
              );


              storageSet(
                'players',
                playerNames
              );


              renderPlayers();
            }
          );
        });


      addPlayerButton.style.display =
        playerNames.length >= 6
          ? 'none'
          : '';
    }


    /* =========================================================
       ADICIONAR JOGADOR
    ========================================================= */

    const addPlayerButton =
      uiButton({
        text: '+ Adicionar jogador',
        className:
          'btn btn-ghost add-player-btn'
      });


    addPlayerButtonSlot.appendChild(
      addPlayerButton
    );


    addPlayerButton.addEventListener(
      'click',
      () => {
        playerNames.push(
          'Jogador ' +
          (playerNames.length + 1)
        );


        storageSet(
          'players',
          playerNames
        );


        renderPlayers();
      }
    );


    /* =========================================================
       COMEÇAR RODADA
    ========================================================= */

    const startBtn =
      uiButton({
        text:
          'Comprem uma carta pra começar',
        className:
          'btn btn-primary btn-block'
      });


    startBtn.disabled = true;


    startButtonSlot.appendChild(
      startBtn
    );


    function updateStartBtn() {
      startBtn.disabled =
        !temaEscolhido;


      startBtn.textContent =
        temaEscolhido
          ? 'Começar rodada'
          : 'Comprem uma carta pra começar';
    }


    startBtn.addEventListener(
      'click',
      () => {
        const names =
          playerNames
            .map(n => n.trim())
            .filter(Boolean);


        if (names.length < 2) {
          return;
        }


        names.forEach(
          (n, i) => {
            if (!(i in scoreState.losses)) {
              scoreState.losses[i] = 0;
            }
          }
        );


        startRound(
          temaEscolhido,
          tempoEscolhido,
          names,
          modoEscolhido
        );
      }
    );


    renderPlayers();
  }


  /* =========================================================
     INÍCIO DA RODADA
  ========================================================= */

  function startRound(
    tema,
    totalTime,
    players,
    modo
  ) {
    scoreState.roundNumber++;


    const startIndex =
      (
        scoreState.roundNumber - 1
      ) % players.length;


    const state =
      createGameState({
        tema,
        totalTime,
        players,
        modo,
        timeLeft: totalTime,
        startedAt: Date.now(),
        used: {},
        history: [],
        turnIndex: startIndex
      });


    startGame(state);

    renderRound(state);
  }


  function colorFor(i) {
    return PLAYER_COLORS[
      i % PLAYER_COLORS.length
    ];
  }


  /* =========================================================
     RODADA
  ========================================================= */

  function renderRound(state) {
    const cfg =
      modoPorId(state.modo);


    let lastTimerWarning =
      null;


    /*
      Se por algum motivo existir
      um timer anterior, encerramos.
    */
    if (activeTimer) {
      activeTimer.cancel();
      activeTimer = null;
    }


    sound.timerStop();


    wrap.innerHTML = `
      <div id="gameHeader"></div>

      <div class="panel">

        <div
          style="
            display:flex;
            justify-content:center;
            margin-bottom:14px;
          "
        >
          <span class="mode-badge">
            Modo: ${cfg.nome}
          </span>
        </div>


        <div
          class="score-row"
          id="scoreRow"
        ></div>


        <p
          class="turn-banner"
          aria-live="polite"
        >
          Na vez de
          <b id="turnName"></b>
          — fale uma palavra do tema e
          aperte a letra inicial
        </p>


        <div class="timer-wrap">
          <div class="timer-bar-track">
            <div
              class="timer-bar-fill"
              id="timerFill"
              style="width:100%"
            ></div>
          </div>
        </div>


        <div
          class="timer-big"
          id="timerBig"
          aria-live="polite"
        ></div>


        <p class="timer-note">
          ${cfg.tempoNota}
        </p>


        <div
          class="letter-grid"
          id="letterGrid"
        ></div>

      </div>
    `;


    /* =========================================================
       HEADER
    ========================================================= */

    const gameHeader =
      wrap.querySelector('#gameHeader');


    gameHeader.appendChild(
      createGameHeader({
        title: 'Stop',
        description: `Tema: ${state.tema}`
      })
    );


    /* =========================================================
       ELEMENTOS
    ========================================================= */

    const scoreRow =
      wrap.querySelector('#scoreRow');


    const turnName =
      wrap.querySelector('#turnName');


    const timerFill =
      wrap.querySelector('#timerFill');


    const timerBig =
      wrap.querySelector('#timerBig');


    const letterGrid =
      wrap.querySelector('#letterGrid');


    /* =========================================================
       LETRAS
    ========================================================= */

    STOP_LETRAS.forEach(l => {
      const b =
        document.createElement('button');


      b.type = 'button';

      b.className =
        'letter-btn';

      b.textContent = l;


      b.setAttribute(
        'aria-label',
        `Usar letra ${l}`
      );


      b.addEventListener(
        'click',
        () => pressLetter(l, b)
      );


      letterGrid.appendChild(b);
    });


    /* =========================================================
       PLACAR
    ========================================================= */

    function drawScoreRow() {
      scoreRow.innerHTML =
        state.players
          .map((name, i) => {
            const active =
              i === state.turnIndex;


            const color =
              colorFor(i);


            return `
              <span
                class="score-chip${active ? ' active' : ''}"
                style="color:var(--${color})"
              >
                <span
                  class="dot"
                  style="
                    background:
                      var(--${color})
                  "
                ></span>

                ${name} ·
                ${scoreState.losses[i] || 0}
              </span>
            `;
          })
          .join('');


      turnName.textContent =
        state.players[state.turnIndex];


      turnName.style.color =
        'var(--' +
        colorFor(state.turnIndex) +
        ')';
    }


    /* =========================================================
       TEMPO
    ========================================================= */

    function formatTime(s) {
      const m =
        Math.floor(s / 60);


      const ss =
        Math.floor(s % 60)
          .toString()
          .padStart(2, '0');


      return m + ':' + ss;
    }


    function drawTimer() {
      timerBig.textContent =
        formatTime(state.timeLeft);


      const pct =
        Math.max(
          0,
          (
            state.timeLeft /
            state.totalTime
          ) * 100
        );


      timerFill.style.width =
        pct + '%';


      timerFill.style.background =
        pct <= 20
          ? 'var(--danger)'
          : 'var(--gold)';


      const secondsLeft =
        Math.ceil(state.timeLeft);


      /*
        Nos últimos 10 segundos,
        toca o áudio contínuo em loop.

        Não chamamos o som a cada segundo.
      */
      if (
        secondsLeft <= 10 &&
        secondsLeft > 0
      ) {
        if (lastTimerWarning === null) {
          lastTimerWarning =
            secondsLeft;

          sound.timer();
        }
      }
      else if (secondsLeft > 10) {
        /*
          Permite que o alerta volte
          quando o cronômetro for reiniciado.
        */
        lastTimerWarning = null;

        sound.timerStop();
      }
    }


    /* =========================================================
       TIMER
    ========================================================= */

    const gameTimer =
      createGameTimer({
        duration: state.totalTime,


        onTick: (timeLeft) => {
          state.timeLeft =
            timeLeft;

          drawTimer();
        },


        onEnd: () => {
          state.timeLeft = 0;

          sound.timerStop();

          drawTimer();

          sound.elimination();

          activeTimer = null;

          endRound(
            state,
            state.turnIndex
          );
        }
      });


    activeTimer =
      gameTimer;


    /* =========================================================
       LETRA PRESSIONADA
    ========================================================= */

    function pressLetter(
      letter,
      btn
    ) {
      if (
        state.ended ||
        letter in state.used
      ) {
        return;
      }


      sound.click();


      state.used[letter] =
        state.turnIndex;


      state.history.push({
        letter,
        player: state.turnIndex
      });


      btn.classList.add('used');


      btn.style.background =
        'var(--' +
        colorFor(state.turnIndex) +
        ')';


      btn.style.opacity = '0.5';


      state.turnIndex =
        (
          state.turnIndex + 1
        ) % state.players.length;


      /*
        No Passa ou Repassa,
        o cronômetro reinicia.
      */
      if (state.modo === 'repassa') {
        gameTimer.restart(
          state.totalTime
        );


        state.timeLeft =
          state.totalTime;


        lastTimerWarning = null;

        sound.timerStop();


        drawTimer();
      }


      drawScoreRow();


      /*
        Todas as letras foram usadas.
      */
      if (
        Object.keys(state.used).length >=
        STOP_LETRAS.length
      ) {
        gameTimer.cancel();

        activeTimer = null;

        sound.timerStop();

        sound.victory();


        return endRound(
          state,
          null
        );
      }
    }


    drawScoreRow();


    state.timeLeft =
      state.totalTime;


    drawTimer();


    gameTimer.start();
  }


  /* =========================================================
     FIM DA RODADA
  ========================================================= */

  function endRound(
    state,
    loserIndex
  ) {
    endGame(state);


    if (activeTimer) {
      activeTimer.cancel();
      activeTimer = null;
    }


    sound.timerStop();


    if (loserIndex !== null) {
      scoreState.losses[loserIndex] =
        (
          scoreState.losses[loserIndex] || 0
        ) + 1;
    }


    const usedCount =
      Object.keys(state.used).length;


    const elapsed =
      Math.round(
        (
          Date.now() -
          state.startedAt
        ) / 1000
      );


    const cfg =
      modoPorId(state.modo);


    wrap.innerHTML = `
      <div id="gameHeader"></div>

      <div class="panel">

        <div
          style="
            display:flex;
            justify-content:center;
            margin-bottom:12px;
          "
        >
          <span class="mode-badge">
            Modo: ${cfg.nome}
          </span>
        </div>


        <div
          class="score-row"
          id="scoreRowEnd"
        ></div>


        <div class="end-stats">

          <div class="end-stat">
            <b>${usedCount}</b>
            <span>letras eliminadas</span>
          </div>


          <div class="end-stat">
            <b>${elapsed}s</b>
            <span>duração da rodada</span>
          </div>

        </div>


        <div class="recap-row">
          ${
            state.history
              .map(h => `
                <span class="recap-chip">
                  <span
                    class="dot"
                    style="
                      background:
                        var(--${colorFor(h.player)})
                    "
                  ></span>

                  ${h.letter} ·
                  ${state.players[h.player]}
                </span>
              `)
              .join('') ||

            `
              <span class="recap-chip">
                Nenhuma letra foi eliminada
              </span>
            `
          }
        </div>


        <div
          class="btn-row"
          id="endButtonSlot"
          style="justify-content:center;"
        ></div>

      </div>
    `;


    /* =========================================================
       HEADER DO RESULTADO
    ========================================================= */

    const gameHeader =
      wrap.querySelector('#gameHeader');


    gameHeader.appendChild(
      createGameHeader({
        title:
          loserIndex !== null
            ? `${state.players[loserIndex]} perdeu a rodada`
            : 'Alfabeto inteiro eliminado!',

        description:
          loserIndex !== null
            ? (
                state.modo === 'ate-morte'
                  ? 'O tempo total da rodada acabou enquanto era a vez dele(a).'
                  : 'O tempo da vez dele(a) acabou antes de apertar uma letra disponível.'
              )
            : `A dupla sobreviveu ao tema "${state.tema}" até a última letra disponível.`
      })
    );


    /* =========================================================
       PLACAR FINAL
    ========================================================= */

    wrap
      .querySelector('#scoreRowEnd')
      .innerHTML =
        state.players
          .map((name, i) => {
            const color =
              colorFor(i);


            return `
              <span
                class="score-chip"
                style="color:var(--${color})"
              >
                <span
                  class="dot"
                  style="
                    background:
                      var(--${color})
                  "
                ></span>

                ${name} ·
                ${scoreState.losses[i] || 0}
              </span>
            `;
          })
          .join('');


    /* =========================================================
       BOTÕES DO RESULTADO
    ========================================================= */

    const endButtonSlot =
      wrap.querySelector(
        '#endButtonSlot'
      );


    const nextRoundBtn =
      uiButton({
        text: 'Próxima rodada',
        className: 'btn btn-primary'
      });


    const backSetupBtn =
      uiButton({
        text:
          'Trocar modo, jogadores ou tempo',
        className: 'btn btn-ghost'
      });


    endButtonSlot.append(
      nextRoundBtn,
      backSetupBtn
    );


    nextRoundBtn.addEventListener(
      'click',
      () => {
        startRound(
          drawCard(),
          state.totalTime,
          state.players,
          state.modo
        );
      }
    );


    backSetupBtn.addEventListener(
      'click',
      showSetup
    );
  }
}