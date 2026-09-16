/* =========================================================
   JOGO DA VELHA
========================================================= */

function renderJogoDaVelha() {
    const wrap = el(`<div></div>`);
  
  
    /*
      =========================================================
      ESTADO DA SESSÃO
      =========================================================
  
      O placar continua enquanto o usuário estiver
      dentro desta tela do Jogo da Velha.
  
      Ao sair para outro jogo e voltar, a sessão começa
      novamente do zero.
    */
  
    const sessionScore = {
      0: 0,
      1: 0
    };
  
  
    /*
      Nomes persistidos no localStorage.
    */
  
    let playerNames = storageGet(
      'jogo-da-velha.players',
      ['Jogador 1', 'Jogador 2']
    );
  
  
    if (
      !Array.isArray(playerNames) ||
      playerNames.length !== 2
    ) {
      playerNames = [
        'Jogador 1',
        'Jogador 2'
      ];
    }
  
  
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
            Quem vai jogar
          </label>
  
          <div class="player-row">
            <input
              class="text-input"
              id="player1Name"
              value=""
              placeholder="Jogador 1"
              autocomplete="off"
              maxlength="30"
            >
          </div>
  
          <div class="player-row">
            <input
              class="text-input"
              id="player2Name"
              value=""
              placeholder="Jogador 2"
              autocomplete="off"
              maxlength="30"
            >
          </div>
  
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
  
      const player1Input =
        wrap.querySelector('#player1Name');
  
  
      const player2Input =
        wrap.querySelector('#player2Name');
  
  
      const modeChips =
        wrap.querySelector('#modeChips');
  
  
      const modeDescription =
        wrap.querySelector('#modeDescription');
  
  
      const startButtonSlot =
        wrap.querySelector('#startButtonSlot');
  
  
      player1Input.value =
        playerNames[0];
  
  
      player2Input.value =
        playerNames[1];
  
  
      /* =========================================================
         PERSISTÊNCIA DOS NOMES
      ========================================================= */
  
      player1Input.addEventListener(
        'input',
        () => {
          playerNames[0] =
            player1Input.value;
  
          savePlayerNames();
        }
      );
  
  
      player2Input.addEventListener(
        'input',
        () => {
          playerNames[1] =
            player2Input.value;
  
          savePlayerNames();
        }
      );
  
  
      function savePlayerNames() {
        storageSet(
          'jogo-da-velha.players',
          playerNames
        );
      }
  
  
      /* =========================================================
         BOTÃO COMEÇAR
      ========================================================= */
  
      const startGameBtn =
        uiButton({
          text: 'Começar',
          className:
            'btn btn-primary btn-block'
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
          const names = [
            player1Input.value.trim(),
            player2Input.value.trim()
          ];
  
  
          /*
            Evita iniciar com nome vazio.
          */
  
          if (
            !names[0] ||
            !names[1]
          ) {
            return;
          }
  
  
          playerNames =
            names;
  
  
          savePlayerNames();
  
  
          startMatch(
            getSelectedMode(),
            names
          );
        }
      );
    }
  
  
    /* =========================================================
       INÍCIO DA PARTIDA
    ========================================================= */
  
    function startMatch(
      mode,
      names = playerNames
    ) {
      const players =
        JOGO_DA_VELHA_CONFIG.players
          .map((player, index) => ({
            ...player,
            name:
              names[index] ||
              player.name
          }));
  
  
      const state =
        createGameState({
          mode: mode.id,
  
          players,
  
          board: Array(
            JOGO_DA_VELHA_CONFIG.boardSize ** 2
          ).fill(null),
  
          turn: 0,
  
          phase: 'placement',
  
          winner: null,
  
          moves: 0,
  
          pieces: {
            0: [],
            1: []
          },
  
          selectedCell: null
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
            id="actionButtonSlot"
            style="
              justify-content:center;
            "
          ></div>
  
        </div>
      `;
  
  
      /* =========================================================
         HEADER
      ========================================================= */
  
      const gameHeader =
        wrap.querySelector(
          '#gameHeader'
        );
  
  
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
        wrap.querySelector(
          '#playersRow'
        );
  
  
      const turnBanner =
        wrap.querySelector(
          '#turnBanner'
        );
  
  
      const board =
        wrap.querySelector(
          '#ticBoard'
        );
  
  
      const actionButtonSlot =
        wrap.querySelector(
          '#actionButtonSlot'
        );
  
  
      /* =========================================================
         BOTÃO REINICIAR
      ========================================================= */
  
      const actionBtn =
        uiButton({
          text: 'Reiniciar',
          className: 'btn btn-ghost'
        });
  
  
      actionButtonSlot.appendChild(
        actionBtn
      );
  
  
      /* =========================================================
         PLACAR / INSTRUÇÃO
      ========================================================= */
  
      function drawPlayers() {
        playersRow.innerHTML = '';
  
  
        state.players.forEach(
          (player, index) => {
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
  
              ${player.name} ·
              ${player.symbol} ·
              ${sessionScore[index]}
            `;
  
  
            playersRow.appendChild(
              chip
            );
          }
        );
  
  
        /* =======================================================
           RESULTADO
        ======================================================= */
  
        if (
          state.winner === 'draw'
        ) {
          turnBanner.textContent =
            'Empate!';
  
  
          turnBanner.style.color =
            'var(--gold)';
  
  
          return;
        }
  
  
        if (
          state.winner !== null
        ) {
          const winner =
            state.players[
              state.winner
            ];
  
  
          turnBanner.textContent =
            `${winner.name} venceu!`;
  
  
          turnBanner.style.color =
            'var(--gold)';
  
  
          return;
        }
  
  
        /* =======================================================
           MATE OU MORRA — MOVIMENTO
        ======================================================= */
  
        const currentPlayer =
          state.players[
            state.turn
          ];
  
  
        if (
          state.mode === 'mate-ou-morra' &&
          state.phase === 'movement'
        ) {
          if (
            state.selectedCell === null
          ) {
            turnBanner.textContent =
              `${currentPlayer.name}: escolha uma peça ${currentPlayer.symbol}.`;
          } else {
            turnBanner.textContent =
              `${currentPlayer.name}: escolha uma casa vazia para mover ${currentPlayer.symbol}.`;
          }
        }
  
  
        /*
          COLOCAÇÃO / CLÁSSICO
        */
  
        else {
          turnBanner.textContent =
            `É a vez de ${currentPlayer.name} (${currentPlayer.symbol})`;
        }
  
  
        turnBanner.style.color =
          'var(--text)';
      }
  
  
      /* =========================================================
         TABULEIRO
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
  
  
            /*
              Destaque da peça selecionada.
            */
  
            if (
              state.mode === 'mate-ou-morra' &&
              state.phase === 'movement' &&
              state.selectedCell === index
            ) {
              cell.classList.add(
                'selected'
              );
            }
  
  
            /*
              =====================================================
              CLÁSSICO
              =====================================================
            */
  
            if (
              state.mode === 'classic'
            ) {
              cell.disabled =
                Boolean(value) ||
                state.winner !== null;
            }
  
  
            /*
              =====================================================
              MATE OU MORRA — COLOCAÇÃO
              =====================================================
            */
  
            else if (
              state.phase === 'placement'
            ) {
              cell.disabled =
                Boolean(value) ||
                state.winner !== null;
            }
  
  
            /*
              =====================================================
              MATE OU MORRA — MOVIMENTO
              =====================================================
            */
  
            else {
              cell.disabled =
                state.winner !== null;
            }
  
  
            cell.addEventListener(
              'click',
              () => {
                playCell(index);
              }
            );
  
  
            board.appendChild(cell);
          }
        );
      }
  
  
      /* =========================================================
         JOGADA
      ========================================================= */
  
      function playCell(index) {
        if (
          state.winner !== null
        ) {
          return;
        }
  
  
        if (
          state.mode === 'classic'
        ) {
          playClassic(index);
  
          return;
        }
  
  
        playMateOuMorra(index);
      }
  
  
      /* =========================================================
         CLÁSSICO
      ========================================================= */
  
      function playClassic(index) {
        if (
          state.board[index]
        ) {
          return;
        }
  
  
        sound.click();
  
  
        const player =
          state.players[
            state.turn
          ];
  
  
        state.board[index] =
          player.symbol;
  
  
        state.moves++;
  
  
        if (
          checkWinner(
            state.board,
            player.symbol
          )
        ) {
          state.winner =
            state.turn;
  
  
          sessionScore[state.turn]++;
  
  
          endGame(state);
  
          sound.victory();
  
  
          drawBoard();
          drawPlayers();
  
          showEndActions();
  
  
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
  
          showEndActions();
  
  
          return;
        }
  
  
        changeTurn();
  
  
        drawBoard();
        drawPlayers();
      }
  
  
      /* =========================================================
         MATE OU MORRA
      ========================================================= */
  
      function playMateOuMorra(index) {
        const player =
          state.players[
            state.turn
          ];
  
  
        /* =======================================================
           FASE 1 — COLOCAÇÃO
        ======================================================= */
  
        if (
          state.phase === 'placement'
        ) {
          if (
            state.board[index] !== null
          ) {
            return;
          }
  
  
          if (
            state.pieces[state.turn]
              .length >= 3
          ) {
            return;
          }
  
  
          sound.click();
  
  
          state.board[index] =
            player.symbol;
  
  
          state.pieces[
            state.turn
          ].push(index);
  
  
          state.moves++;
  
  
          /*
            Verifica vitória imediatamente.
          */
  
          if (
            checkWinner(
              state.board,
              player.symbol
            )
          ) {
            state.winner =
              state.turn;
  
  
            sessionScore[state.turn]++;
  
  
            endGame(state);
  
            sound.victory();
  
  
            drawBoard();
            drawPlayers();
  
            showEndActions();
  
  
            return;
          }
  
  
          /*
            Os dois jogadores
            chegaram a 3 peças.
          */
  
          if (
            state.pieces[0].length === 3 &&
            state.pieces[1].length === 3
          ) {
            state.phase =
              'movement';
          }
  
  
          changeTurn();
  
  
          drawBoard();
          drawPlayers();
  
  
          return;
        }
  
  
        /* =======================================================
           FASE 2 — MOVIMENTO
        ======================================================= */
  
        /*
          PRIMEIRO CLIQUE:
          escolher uma peça própria.
        */
  
        if (
          state.selectedCell === null
        ) {
          if (
            state.board[index] !==
            player.symbol
          ) {
            return;
          }
  
  
          sound.click();
  
  
          state.selectedCell =
            index;
  
  
          drawBoard();
          drawPlayers();
  
  
          return;
        }
  
  
        /*
          Clicar novamente na mesma peça
          cancela a seleção.
        */
  
        if (
          state.selectedCell === index
        ) {
          sound.click();
  
  
          state.selectedCell =
            null;
  
  
          drawBoard();
          drawPlayers();
  
  
          return;
        }
  
  
        /*
          SEGUNDO CLIQUE:
          destino precisa estar vazio.
        */
  
        if (
          state.board[index] !== null
        ) {
          return;
        }
  
  
        sound.click();
  
  
        const from =
          state.selectedCell;
  
  
        state.board[from] =
          null;
  
  
        state.board[index] =
          player.symbol;
  
  
        /*
          Atualiza a posição da peça.
        */
  
        const pieceList =
          state.pieces[state.turn];
  
  
        const pieceIndex =
          pieceList.indexOf(from);
  
  
        if (
          pieceIndex !== -1
        ) {
          pieceList[pieceIndex] =
            index;
        }
  
  
        state.selectedCell =
          null;
  
  
        /*
          Verifica vitória.
        */
  
        if (
          checkWinner(
            state.board,
            player.symbol
          )
        ) {
          state.winner =
            state.turn;
  
  
          sessionScore[state.turn]++;
  
  
          endGame(state);
  
          sound.victory();
  
  
          drawBoard();
          drawPlayers();
  
          showEndActions();
  
  
          return;
        }
  
  
        changeTurn();
  
  
        drawBoard();
        drawPlayers();
      }
  
  
      /* =========================================================
         TROCA DE TURNO
      ========================================================= */
  
      function changeTurn() {
        state.turn =
          state.turn === 0
            ? 1
            : 0;
      }
  
  
      /* =========================================================
         AÇÕES DO FIM
      ========================================================= */
  
      function showEndActions() {
        actionButtonSlot.innerHTML = '';
  
  
        const replayBtn =
          uiButton({
            text: 'Jogar novamente',
            className:
              'btn btn-primary'
          });
  
  
        const modeBtn =
          uiButton({
            text: 'Escolher outro modo',
            className:
              'btn btn-ghost'
          });
  
  
        actionButtonSlot.append(
          replayBtn,
          modeBtn
        );
  
  
        replayBtn.addEventListener(
          'click',
          () => {
            startMatch(
              getModeById(
                state.mode
              ),
              state.players.map(
                player => player.name
              )
            );
          }
        );
  
  
        modeBtn.addEventListener(
          'click',
          () => {
            showModeSelection();
          }
        );
      }
  
  
      /* =========================================================
         REINICIAR
      ========================================================= */
  
      actionBtn.addEventListener(
        'click',
        () => {
          startMatch(
            getModeById(
              state.mode
            ),
            state.players.map(
              player => player.name
            )
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
      return JOGO_DA_VELHA_CONFIG
        .winLines
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