/* =========================================================
   JOGO DA VELHA
========================================================= */

function renderJogoDaVelha() {
    const wrap = el(`<div></div>`);
  
    let selectedMode =
      JOGO_DA_VELHA_CONFIG.modes.classic.id;
  
  
    showModeSelection();
  
  
    return wrap;
  
  
    /* =========================================================
       SELEÇÃO DE MODO
    ========================================================= */
  
    function showModeSelection() {
      wrap.innerHTML = `
        <div id="gameHeader"></div>
  
        <div class="panel">
          <label class="field-label">
            Modo de jogo
          </label>
  
          <div
            class="chip-row"
            id="modeChips"
          ></div>
  
          <p
            class="field-hint"
            id="modeDescription"
          ></p>
  
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
          title: 'Jogo da Velha',
          description: 'O clássico que vocês já conhecem, com uma variação para quando quiserem uma partida mais estratégica.'
        })
      );
  
  
      /* =========================================================
         ELEMENTOS
      ========================================================= */
  
      const modeChips =
        wrap.querySelector('#modeChips');
  
  
      const modeDescription =
        wrap.querySelector('#modeDescription');
  
  
      const startButtonSlot =
        wrap.querySelector('#startButtonSlot');
  
  
      /* =========================================================
         BOTÃO COMEÇAR
      ========================================================= */
  
      const startGameBtn =
        uiButton({
          text: 'Começar',
          className: 'btn btn-primary btn-block'
        });
  
  
      startButtonSlot.appendChild(
        startGameBtn
      );
  
  
      /* =========================================================
         MODOS
      ========================================================= */
  
      Object.values(
        JOGO_DA_VELHA_CONFIG.modes
      ).forEach(mode => {
        const chip =
          document.createElement('button');
  
  
        chip.type = 'button';
  
  
        chip.className =
          'chip' +
          (
            mode.id === selectedMode
              ? ' selected'
              : ''
          );
  
  
        chip.textContent =
          mode.name;
  
  
        chip.addEventListener(
          'click',
          () => {
            sound.click();
  
  
            selectedMode =
              mode.id;
  
  
            modeChips
              .querySelectorAll('.chip')
              .forEach(button => {
                button.classList.toggle(
                  'selected',
                  button === chip
                );
              });
  
  
            updateModeDescription();
          }
        );
  
  
        modeChips.appendChild(chip);
      });
  
  
      function updateModeDescription() {
        const mode =
          getSelectedMode();
  
  
        modeDescription.textContent =
          mode.description;
      }
  
  
      function getSelectedMode() {
        return Object.values(
          JOGO_DA_VELHA_CONFIG.modes
        ).find(
          mode => mode.id === selectedMode
        );
      }
  
  
      updateModeDescription();
  
  
      startGameBtn.addEventListener(
        'click',
        () => {
          startMatch(
            getSelectedMode()
          );
        }
      );
    }
  
  
    /* =========================================================
       INÍCIO DO JOGO
    ========================================================= */
  
    function startMatch(mode) {
      const state =
        createGameState({
          mode: mode.id,
  
          board: Array(
            JOGO_DA_VELHA_CONFIG.boardSize ** 2
          ).fill(null),
  
          turn: 0,
  
          phase:
            mode.phase,
  
          winner: null,
  
          moves: 0
        });
  
  
      beginMatch(state);
    }
  
  
    function beginMatch(state) {
      startGame(state);
  
      renderBoard(state);
    }
  
  
    /* =========================================================
       TABULEIRO
    ========================================================= */
  
    function renderBoard(state) {
      const mode =
        getModeById(state.mode);
  
  
      wrap.innerHTML = `
        <div id="gameHeader"></div>
  
        <div class="panel">
  
          <div
            class="mode-badge"
            style="
              display:block;
              width:max-content;
              margin:0 auto 14px;
            "
          >
            Modo: ${mode.name}
          </div>
  
  
          <div
            class="score-row"
            id="playersRow"
          ></div>
  
  
          <p
            class="turn-banner"
            id="turnBanner"
            aria-live="polite"
          ></p>
  
  
          <div
            class="tic-board"
            id="ticBoard"
          ></div>
  
  
          <div
            class="btn-row"
            id="restartButtonSlot"
            style="justify-content:center;"
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
          title: 'Jogo da Velha',
          description: mode.description
        })
      );
  
  
      /* =========================================================
         ELEMENTOS
      ========================================================= */
  
      const playersRow =
        wrap.querySelector('#playersRow');
  
  
      const turnBanner =
        wrap.querySelector('#turnBanner');
  
  
      const board =
        wrap.querySelector('#ticBoard');
  
  
      const restartButtonSlot =
        wrap.querySelector('#restartButtonSlot');
  
  
      /* =========================================================
         BOTÃO REINICIAR
      ========================================================= */
  
      const restartBtn =
        uiButton({
          text: 'Reiniciar',
          className: 'btn btn-ghost'
        });
  
  
      restartButtonSlot.appendChild(
        restartBtn
      );
  
  
      /* =========================================================
         PLACAR / JOGADORES
      ========================================================= */
  
      function drawPlayers() {
        playersRow.innerHTML = '';
  
  
        JOGO_DA_VELHA_CONFIG.players
          .forEach((player, index) => {
            const active =
              state.turn === index &&
              state.winner === null;
  
  
            const color =
              index === 0
                ? 'rose'
                : 'teal';
  
  
            const chip =
              document.createElement('span');
  
  
            chip.className =
              'score-chip' +
              (
                active
                  ? ' active'
                  : ''
              );
  
  
            chip.style.color =
              `var(--${color})`;
  
  
            chip.innerHTML = `
              <span
                class="dot"
                style="
                  background:
                    var(--${color})
                "
              ></span>
  
              ${player.name} · ${player.symbol}
            `;
  
  
            playersRow.appendChild(chip);
          });
  
  
        if (state.winner === 'draw') {
          turnBanner.textContent =
            'Empate!';
  
  
          turnBanner.style.color =
            'var(--gold)';
  
  
          return;
        }
  
  
        if (state.winner !== null) {
          const winner =
            JOGO_DA_VELHA_CONFIG.players[
              state.winner
            ];
  
  
          turnBanner.textContent =
            `${winner.name} venceu!`;
  
  
          turnBanner.style.color =
            'var(--gold)';
  
  
          return;
        }
  
  
        const currentPlayer =
          JOGO_DA_VELHA_CONFIG.players[
            state.turn
          ];
  
  
        turnBanner.textContent =
          `É a vez de ${currentPlayer.name} (${currentPlayer.symbol})`;
  
  
        turnBanner.style.color =
          'var(--text)';
      }
  
  
      /* =========================================================
         RENDER DO TABULEIRO
      ========================================================= */
  
      function drawBoard() {
        board.innerHTML = '';
  
  
        state.board.forEach(
          (value, index) => {
            const cell =
              document.createElement('button');
  
  
            cell.type = 'button';
  
  
            cell.className =
              'tic-cell';
  
  
            cell.setAttribute(
              'aria-label',
              `Casa ${index + 1}`
            );
  
  
            if (value) {
              cell.classList.add(
                'filled',
                value.toLowerCase()
              );
  
  
              cell.textContent =
                value;
            }
  
  
            cell.disabled =
              Boolean(value) ||
              state.winner !== null;
  
  
            cell.addEventListener(
              'click',
              () => playCell(index)
            );
  
  
            board.appendChild(cell);
          }
        );
      }
  
  
      /* =========================================================
         JOGADA — MODO CLÁSSICO
      ========================================================= */
  
      function playCell(index) {
        if (
          state.winner !== null ||
          state.board[index]
        ) {
          return;
        }
  
  
        sound.click();
  
  
        const player =
          JOGO_DA_VELHA_CONFIG.players[
            state.turn
          ];
  
  
        state.board[index] =
          player.symbol;
  
  
        state.moves++;
  
  
        const winner =
          checkWinner(
            state.board,
            player.symbol
          );
  
  
        if (winner) {
          state.winner =
            state.turn;
  
  
          endGame(state);
  
          sound.victory();
  
  
          drawBoard();
          drawPlayers();
  
  
          return;
        }
  
  
        if (
          state.moves >=
          state.board.length
        ) {
          state.winner =
            'draw';
  
  
          endGame(state);
  
  
          drawBoard();
          drawPlayers();
  
  
          return;
        }
  
  
        state.turn =
          state.turn === 0
            ? 1
            : 0;
  
  
        drawBoard();
        drawPlayers();
      }
  
  
      /* =========================================================
         REINICIAR
      ========================================================= */
  
      restartBtn.addEventListener(
        'click',
        () => {
          startMatch(
            getModeById(state.mode)
          );
        }
      );
  
  
      drawBoard();
      drawPlayers();
    }
  
  
    /* =========================================================
       VITÓRIA
    ========================================================= */
  
    function checkWinner(
      board,
      symbol
    ) {
      return JOGO_DA_VELHA_CONFIG.winLines
        .some(line => {
          return line.every(
            index =>
              board[index] === symbol
          );
        });
    }
  
  
    /* =========================================================
       UTILITÁRIO
    ========================================================= */
  
    function getModeById(id) {
      return Object.values(
        JOGO_DA_VELHA_CONFIG.modes
      ).find(
        mode => mode.id === id
      );
    }
  }