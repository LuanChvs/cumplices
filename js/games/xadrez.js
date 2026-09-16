/* =========================================================
   XADREZ
   Integração do motor do projeto original ao Cúmplices
========================================================= */

function renderXadrez() {
    const wrap = el(`
      <div>
  
        <div id="gameHeader"></div>
  
        <div class="chess-layout">
  
          <!-- =========================
               CAPTURAS
          ========================= -->
          <section class="panel chess-captured">
            <h2>Capturadas</h2>
  
            <div class="chess-captured-group">
              <p class="chess-label">Por pretas</p>
              <div id="capturedByBlack" class="chess-piece-row"></div>
            </div>
  
            <div class="chess-captured-group">
              <p class="chess-label">Por brancas</p>
              <div id="capturedByWhite" class="chess-piece-row"></div>
            </div>
          </section>
  
  
          <!-- =========================
               TABULEIRO
          ========================= -->
          <section class="chess-board-panel">
  
            <div class="chess-board-frame">
  
              <div class="chess-files" aria-hidden="true">
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
                <span>e</span>
                <span>f</span>
                <span>g</span>
                <span>h</span>
              </div>
  
              <div class="chess-board-row">
  
                <div class="chess-ranks" aria-hidden="true">
                  <span>8</span>
                  <span>7</span>
                  <span>6</span>
                  <span>5</span>
                  <span>4</span>
                  <span>3</span>
                  <span>2</span>
                  <span>1</span>
                </div>
  
                <div
                  id="board"
                  class="chess-board"
                  role="grid"
                  aria-label="Tabuleiro de xadrez"
                ></div>
  
                <div class="chess-ranks" aria-hidden="true">
                  <span>8</span>
                  <span>7</span>
                  <span>6</span>
                  <span>5</span>
                  <span>4</span>
                  <span>3</span>
                  <span>2</span>
                  <span>1</span>
                </div>
  
              </div>
  
              <div class="chess-files" aria-hidden="true">
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
                <span>e</span>
                <span>f</span>
                <span>g</span>
                <span>h</span>
              </div>
  
            </div>
  
          </section>
  
  
          <!-- =========================
               PARTIDA
          ========================= -->
          <section class="panel chess-info">
  
            <div class="chess-status">
              <span class="chess-status-label">Estado</span>
              <strong id="statusPill">Vez das brancas</strong>
            </div>
  
            <p
              id="turnText"
              class="chess-turn-text"
            >
              Brancas começam. Clique numa peça e depois no destino.
            </p>
  
            <div class="btn-row chess-actions">
              <button
                type="button"
                class="btn btn-ghost"
                id="btnUndo"
              >
                Desfazer
              </button>
  
              <button
                type="button"
                class="btn btn-primary"
                id="btnRestart"
              >
                Nova partida
              </button>
            </div>
  
            <div class="chess-moves-section">
              <h2>Lances</h2>
              <ol
                id="moves"
                class="chess-moves"
              ></ol>
            </div>
  
          </section>
  
        </div>
  
  
        <!-- =========================
             MODAL
        ========================= -->
        <div
          id="chessOverlay"
          class="chess-overlay hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chessOverlayTitle"
        >
          <div class="chess-modal">
  
            <h2 id="chessOverlayTitle">
              Promoção
            </h2>
  
            <p id="chessOverlayText">
              Escolha a peça para promover o peão.
            </p>
  
            <div
              id="promoChoices"
              class="chess-promo"
            ></div>
  
            <button
              type="button"
              class="btn btn-primary hidden"
              id="overlayOk"
            >
              Jogar de novo
            </button>
  
          </div>
        </div>
  
      </div>
    `);
    wrap.classList.add('chess-page');   
  
    /* =========================================================
       HEADER
    ========================================================= */
  
    wrap
      .querySelector('#gameHeader')
      .appendChild(
        createGameHeader({
          title: 'Xadrez',
          description:
            'Dois jogadores no mesmo tabuleiro. Roque, en passant, promoção e desfazer estão ativos.'
        })
      );
  
  
    /* =========================================================
       ELEMENTOS
    ========================================================= */
  
    const boardEl =
      wrap.querySelector('#board');
  
    const statusPill =
      wrap.querySelector('#statusPill');
  
    const turnText =
      wrap.querySelector('#turnText');
  
    const movesEl =
      wrap.querySelector('#moves');
  
    const capturedByWhite =
      wrap.querySelector('#capturedByWhite');
  
    const capturedByBlack =
      wrap.querySelector('#capturedByBlack');
  
    const overlay =
      wrap.querySelector('#chessOverlay');
  
    const overlayTitle =
      wrap.querySelector('#chessOverlayTitle');
  
    const overlayText =
      wrap.querySelector('#chessOverlayText');
  
    const promoChoices =
      wrap.querySelector('#promoChoices');
  
    const overlayOk =
      wrap.querySelector('#overlayOk');
  
    const btnRestart =
      wrap.querySelector('#btnRestart');
  
    const btnUndo =
      wrap.querySelector('#btnUndo');
  
  
    /* =========================================================
       PEÇAS
    ========================================================= */
  
    const UNICODE = {
      wK: '♚',
      wQ: '♛',
      wR: '♜',
      wB: '♝',
      wN: '♞',
      wP: '♟',
  
      bK: '♚',
      bQ: '♛',
      bR: '♜',
      bB: '♝',
      bN: '♞',
      bP: '♟'
    };
  
  
    /* =========================================================
       TABULEIRO INICIAL
    ========================================================= */
  
    const clone =
      (value) => structuredClone(value);
  
    function startBoard() {
  
      const empty =
        () =>
          Array.from(
            { length: 8 },
            () => Array(8).fill(null)
          );
  
      const board = empty();
  
      const back =
        (color) =>
          ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
            .map(
              (type) => ({
                c: color,
                t: type
              })
            );
  
      board[0] = back('b');
  
      board[1] =
        Array.from(
          { length: 8 },
          () => ({
            c: 'b',
            t: 'P'
          })
        );
  
      board[6] =
        Array.from(
          { length: 8 },
          () => ({
            c: 'w',
            t: 'P'
          })
        );
  
      board[7] = back('w');
  
      return board;
    }
  
  
    /* =========================================================
       ESTADO
    ========================================================= */
  
    const game = {
      board: startBoard(),
  
      turn: 'w',
  
      castle: {
        wK: true,
        wQ: true,
        bK: true,
        bQ: true
      },
  
      ep: null,
  
      selected: null,
  
      lastMove: null,
  
      history: [],
  
      captured: {
        w: [],
        b: []
      },
  
      moves: [],
  
      over: null,
  
      pendingPromo: null
    };
  
  
    /* =========================================================
       HELPERS
    ========================================================= */
  
    const inBounds =
      (r, c) =>
        r >= 0 &&
        r < 8 &&
        c >= 0 &&
        c < 8;
  
    const pieceAt =
      (r, c) =>
        game.board[r][c];
  
    const enemy =
      (color) =>
        color === 'w' ? 'b' : 'w';
  
    const key =
      (r, c) =>
        `${r},${c}`;
  
  
    /* =========================================================
       REI
    ========================================================= */
  
    function findKing(color) {
  
      for (let r = 0; r < 8; r++) {
  
        for (let c = 0; c < 8; c++) {
  
          const piece =
            pieceAt(r, c);
  
          if (
            piece &&
            piece.c === color &&
            piece.t === 'K'
          ) {
            return {
              r,
              c
            };
          }
        }
      }
  
      return null;
    }
  
  
    /* =========================================================
       ATAQUES
    ========================================================= */
  
    function isAttacked(
      r,
      c,
      byColor,
      board = game.board
    ) {
  
      const knightDirections = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1]
      ];
  
      for (const [dr, dc] of knightDirections) {
  
        const nr = r + dr;
        const nc = c + dc;
  
        if (!inBounds(nr, nc)) {
          continue;
        }
  
        const piece =
          board[nr][nc];
  
        if (
          piece &&
          piece.c === byColor &&
          piece.t === 'N'
        ) {
          return true;
        }
      }
  
  
      const pawnDirection =
        byColor === 'w'
          ? 1
          : -1;
  
      for (const dc of [-1, 1]) {
  
        const nr =
          r + pawnDirection;
  
        const nc =
          c + dc;
  
        if (!inBounds(nr, nc)) {
          continue;
        }
  
        const piece =
          board[nr][nc];
  
        if (
          piece &&
          piece.c === byColor &&
          piece.t === 'P'
        ) {
          return true;
        }
      }
  
  
      const kingDirections = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
      ];
  
      for (const [dr, dc] of kingDirections) {
  
        const nr = r + dr;
        const nc = c + dc;
  
        if (!inBounds(nr, nc)) {
          continue;
        }
  
        const piece =
          board[nr][nc];
  
        if (
          piece &&
          piece.c === byColor &&
          piece.t === 'K'
        ) {
          return true;
        }
      }
  
  
      const rays = [
        {
          directions: [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1]
          ],
          types: ['R', 'Q']
        },
  
        {
          directions: [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
          ],
          types: ['B', 'Q']
        }
      ];
  
  
      for (const ray of rays) {
  
        for (const [dr, dc] of ray.directions) {
  
          let nr = r + dr;
          let nc = c + dc;
  
          while (inBounds(nr, nc)) {
  
            const piece =
              board[nr][nc];
  
            if (piece) {
  
              if (
                piece.c === byColor &&
                ray.types.includes(piece.t)
              ) {
                return true;
              }
  
              break;
            }
  
            nr += dr;
            nc += dc;
          }
        }
      }
  
      return false;
    }
  
  
    /* =========================================================
       XEQUE
    ========================================================= */
  
    function inCheck(
      color,
      board = game.board
    ) {
  
      const king =
        (() => {
  
          for (let r = 0; r < 8; r++) {
  
            for (let c = 0; c < 8; c++) {
  
              const piece =
                board[r][c];
  
              if (
                piece &&
                piece.c === color &&
                piece.t === 'K'
              ) {
                return {
                  r,
                  c
                };
              }
            }
          }
  
          return null;
        })();
  
  
      if (!king) {
        return true;
      }
  
      return isAttacked(
        king.r,
        king.c,
        enemy(color),
        board
      );
    }
  
  
    /* =========================================================
       APLICA MOVIMENTO
    ========================================================= */
  
    function applyMoveOn(
      board,
      from,
      to,
      extra = {}
    ) {
  
      const next =
        clone(board);
  
      const piece =
        next[from.r][from.c];
  
      const captured =
        extra.capturedSquare
          ? next[
              extra.capturedSquare.r
            ][
              extra.capturedSquare.c
            ]
          : next[to.r][to.c];
  
  
      if (extra.capturedSquare) {
  
        next[
          extra.capturedSquare.r
        ][
          extra.capturedSquare.c
        ] = null;
      }
  
  
      next[to.r][to.c] =
        extra.promo
          ? {
              c: piece.c,
              t: extra.promo
            }
          : piece;
  
  
      next[from.r][from.c] =
        null;
  
  
      if (extra.castleRook) {
  
        const {
          from: rookFrom,
          to: rookTo
        } = extra.castleRook;
  
  
        next[
          rookTo.r
        ][
          rookTo.c
        ] =
          next[
            rookFrom.r
          ][
            rookFrom.c
          ];
  
  
        next[
          rookFrom.r
        ][
          rookFrom.c
        ] = null;
      }
  
  
      return {
        next,
        captured
      };
    }
  
  
    /* =========================================================
       EVITAR XEQUE
    ========================================================= */
  
    function wouldLeaveCheck(
      from,
      to,
      extra,
      color
    ) {
  
      const { next } =
        applyMoveOn(
          game.board,
          from,
          to,
          extra
        );
  
      return inCheck(
        color,
        next
      );
    }
  
  
    /* =========================================================
       MOVIMENTOS DESLIZANTES
    ========================================================= */
  
    function addSlide(
      moves,
      r,
      c,
      color,
      directions
    ) {
  
      for (
        const [dr, dc]
        of directions
      ) {
  
        let nr = r + dr;
        let nc = c + dc;
  
        while (
          inBounds(nr, nc)
        ) {
  
          const target =
            pieceAt(nr, nc);
  
  
          if (!target) {
  
            moves.push({
              r: nr,
              c: nc
            });
  
          } else {
  
            if (
              target.c !== color
            ) {
              moves.push({
                r: nr,
                c: nc
              });
            }
  
            break;
          }
  
  
          nr += dr;
          nc += dc;
        }
      }
    }
  
  
    /* =========================================================
       MOVIMENTOS BRUTOS
    ========================================================= */
  
    function rawMoves(
      r,
      c
    ) {
  
      const piece =
        pieceAt(r, c);
  
      if (!piece) {
        return [];
      }
  
  
      const {
        c: color,
        t: type
      } = piece;
  
  
      const moves = [];
  
  
      /* PEÃO */
      if (type === 'P') {
  
        const direction =
          color === 'w'
            ? -1
            : 1;
  
        const start =
          color === 'w'
            ? 6
            : 1;
  
  
        if (
          inBounds(
            r + direction,
            c
          ) &&
          !pieceAt(
            r + direction,
            c
          )
        ) {
  
          moves.push({
            r: r + direction,
            c,
            promo:
              r + direction === 0 ||
              r + direction === 7
          });
  
  
          if (
            r === start &&
            !pieceAt(
              r + 2 * direction,
              c
            )
          ) {
  
            moves.push({
              r:
                r +
                2 * direction,
  
              c,
  
              epTarget: {
                r:
                  r +
                  direction,
  
                c
              }
            });
          }
        }
  
  
        for (
          const dc of [-1, 1]
        ) {
  
          const nr =
            r + direction;
  
          const nc =
            c + dc;
  
  
          if (
            !inBounds(nr, nc)
          ) {
            continue;
          }
  
  
          const target =
            pieceAt(
              nr,
              nc
            );
  
  
          if (
            target &&
            target.c !== color
          ) {
  
            moves.push({
              r: nr,
              c: nc,
              promo:
                nr === 0 ||
                nr === 7
            });
          }
  
  
          if (
            game.ep &&
            game.ep.r === nr &&
            game.ep.c === nc
          ) {
  
            moves.push({
              r: nr,
              c: nc,
  
              capturedSquare: {
                r,
                c: nc
              }
            });
          }
        }
  
  
      /* CAVALO */
      } else if (
        type === 'N'
      ) {
  
        const directions = [
          [-2, -1],
          [-2, 1],
          [-1, -2],
          [-1, 2],
          [1, -2],
          [1, 2],
          [2, -1],
          [2, 1]
        ];
  
  
        for (
          const [dr, dc]
          of directions
        ) {
  
          const nr = r + dr;
          const nc = c + dc;
  
  
          if (
            !inBounds(nr, nc)
          ) {
            continue;
          }
  
  
          const target =
            pieceAt(nr, nc);
  
  
          if (
            !target ||
            target.c !== color
          ) {
  
            moves.push({
              r: nr,
              c: nc
            });
          }
        }
  
  
      /* BISPO */
      } else if (
        type === 'B'
      ) {
  
        addSlide(
          moves,
          r,
          c,
          color,
          [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
          ]
        );
  
  
      /* TORRE */
      } else if (
        type === 'R'
      ) {
  
        addSlide(
          moves,
          r,
          c,
          color,
          [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1]
          ]
        );
  
  
      /* RAINHA */
      } else if (
        type === 'Q'
      ) {
  
        addSlide(
          moves,
          r,
          c,
          color,
          [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1]
          ]
        );
  
  
      /* REI */
      } else if (
        type === 'K'
      ) {
  
        const directions = [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1]
        ];
  
  
        for (
          const [dr, dc]
          of directions
        ) {
  
          const nr = r + dr;
          const nc = c + dc;
  
  
          if (
            !inBounds(nr, nc)
          ) {
            continue;
          }
  
  
          const target =
            pieceAt(nr, nc);
  
  
          if (
            !target ||
            target.c !== color
          ) {
  
            moves.push({
              r: nr,
              c: nc
            });
          }
        }
  
  
        /* ROQUE */
  
        const row =
          color === 'w'
            ? 7
            : 0;
  
  
        if (
          r === row &&
          c === 4 &&
          !inCheck(color)
        ) {
  
          /* ROQUE PEQUENO */
  
          if (
            game.castle[
              `${color}K`
            ] &&
            !pieceAt(row, 5) &&
            !pieceAt(row, 6)
          ) {
  
            if (
              !isAttacked(
                row,
                5,
                enemy(color)
              ) &&
              !isAttacked(
                row,
                6,
                enemy(color)
              )
            ) {
  
              moves.push({
  
                r: row,
                c: 6,
  
                castleRook: {
                  from: {
                    r: row,
                    c: 7
                  },
  
                  to: {
                    r: row,
                    c: 5
                  }
                }
              });
            }
          }
  
  
          /* ROQUE GRANDE */
  
          if (
            game.castle[
              `${color}Q`
            ] &&
            !pieceAt(row, 1) &&
            !pieceAt(row, 2) &&
            !pieceAt(row, 3)
          ) {
  
            if (
              !isAttacked(
                row,
                2,
                enemy(color)
              ) &&
              !isAttacked(
                row,
                3,
                enemy(color)
              )
            ) {
  
              moves.push({
  
                r: row,
                c: 2,
  
                castleRook: {
                  from: {
                    r: row,
                    c: 0
                  },
  
                  to: {
                    r: row,
                    c: 3
                  }
                }
              });
            }
          }
        }
      }
  
  
      return moves;
    }
  
  
    /* =========================================================
       MOVIMENTOS LEGAIS
    ========================================================= */
  
    function legalMoves(
      r,
      c
    ) {
  
      const piece =
        pieceAt(r, c);
  
  
      if (
        !piece ||
        piece.c !== game.turn ||
        game.over
      ) {
        return [];
      }
  
  
      return rawMoves(
        r,
        c
      ).filter(
        (move) =>
          !wouldLeaveCheck(
            {
              r,
              c
            },
  
            {
              r: move.r,
              c: move.c
            },
  
            move,
  
            piece.c
          )
      );
    }
  
  
    /* =========================================================
       TODOS OS MOVIMENTOS LEGAIS
    ========================================================= */
  
    function allLegal(color) {
  
      const list = [];
  
  
      for (
        let r = 0;
        r < 8;
        r++
      ) {
  
        for (
          let c = 0;
          c < 8;
          c++
        ) {
  
          const piece =
            pieceAt(r, c);
  
  
          if (
            piece &&
            piece.c === color
          ) {
  
            const savedTurn =
              game.turn;
  
  
            game.turn =
              color;
  
  
            list.push(
              ...legalMoves(
                r,
                c
              ).map(
                (move) => ({
                  from: {
                    r,
                    c
                  },
                  ...move
                })
              )
            );
  
  
            game.turn =
              savedTurn;
          }
        }
      }
  
  
      return list;
    }
  
  
    /* =========================================================
       NOTAÇÃO
    ========================================================= */
  
    function squareName(
      r,
      c
    ) {
  
      return (
        'abcdefgh'[c] +
        (8 - r)
      );
    }
  
  
    /* =========================================================
       HISTÓRICO
    ========================================================= */
  
    function snapshot() {
  
      game.history.push({
  
        board:
          clone(game.board),
  
        turn:
          game.turn,
  
        castle:
          clone(game.castle),
  
        ep:
          clone(game.ep),
  
        lastMove:
          clone(game.lastMove),
  
        captured:
          clone(game.captured),
  
        moves:
          clone(game.moves),
  
        over:
          game.over
      });
    }
  
  
    /* =========================================================
       FIM DE PARTIDA
    ========================================================= */
  
    function finishIfNeeded() {
  
      const side =
        game.turn;
  
  
      const hasMoves =
        allLegal(side).length > 0;
  
  
      const check =
        inCheck(side);
  
  
      if (
        !hasMoves &&
        check
      ) {
  
        game.over =
          side === 'w'
            ? 'Xeque-mate. Pretas vencem.'
            : 'Xeque-mate. Brancas vencem.';
  
      } else if (
        !hasMoves
      ) {
  
        game.over =
          'Afogamento. Empate.';
      }
    }
  
  
    /* =========================================================
       EXECUTAR LANCE
    ========================================================= */
  
    function play(
      from,
      toMove,
      promo
    ) {
  
      snapshot();
  
  
      const piece =
        pieceAt(
          from.r,
          from.c
        );
  
  
      const extra = {
        ...toMove,
        promo:
          promo || undefined
      };
  
  
      if (
        extra.promo === true
      ) {
        extra.promo =
          undefined;
      }
  
  
      const {
        next,
        captured
      } =
        applyMoveOn(
          game.board,
          from,
          {
            r: toMove.r,
            c: toMove.c
          },
          extra
        );
  
  
      game.board =
        next;
  
  
      if (captured) {
  
        game
          .captured[piece.c]
          .push(captured);
  
        sound.correct();
      }
  
  
      /* DIREITO DE ROQUE */
  
      if (
        piece.t === 'K'
      ) {
  
        game.castle[
          `${piece.c}K`
        ] = false;
  
        game.castle[
          `${piece.c}Q`
        ] = false;
      }
  
  
      if (
        piece.t === 'R' &&
        from.c === 0 &&
        from.r ===
          (
            piece.c === 'w'
              ? 7
              : 0
          )
      ) {
  
        game.castle[
          `${piece.c}Q`
        ] = false;
      }
  
  
      if (
        piece.t === 'R' &&
        from.c === 7 &&
        from.r ===
          (
            piece.c === 'w'
              ? 7
              : 0
          )
      ) {
  
        game.castle[
          `${piece.c}K`
        ] = false;
      }
  
  
      /* TORRE CAPTURADA */
  
      if (
        captured &&
        captured.t === 'R'
      ) {
  
        const row =
          captured.c === 'w'
            ? 7
            : 0;
  
  
        const capC =
          extra.capturedSquare
            ? extra.capturedSquare.c
            : toMove.c;
  
  
        const capR =
          extra.capturedSquare
            ? extra.capturedSquare.r
            : toMove.r;
  
  
        if (
          capR === row &&
          capC === 0
        ) {
  
          game.castle[
            `${captured.c}Q`
          ] = false;
        }
  
  
        if (
          capR === row &&
          capC === 7
        ) {
  
          game.castle[
            `${captured.c}K`
          ] = false;
        }
      }
  
  
      /* EN PASSANT */
  
      game.ep =
        toMove.epTarget ||
        null;
  
  
      game.lastMove = {
  
        from,
  
        to: {
          r: toMove.r,
          c: toMove.c
        }
      };
  
  
      const notation =
        `${UNICODE[piece.c + piece.t]} ` +
        `${squareName(from.r, from.c)}` +
        `→` +
        `${squareName(
          toMove.r,
          toMove.c
        )}` +
        `${
          promo
            ? '=' + promo
            : ''
        }`;
  
  
      if (
        game.turn === 'w'
      ) {
  
        game.moves.push({
          w: notation,
          b: ''
        });
  
      } else {
  
        game.moves[
          game.moves.length - 1
        ].b = notation;
      }
  
  
      game.turn =
        enemy(game.turn);
  
  
      game.selected =
        null;
  
  
      finishIfNeeded();
  
      if (!game.over) {
        sound.click();
      } else {
        sound.victory();
      }
  
      render();
    }
  
  
    /* =========================================================
       TENTAR MOVER
    ========================================================= */
  
    function tryMove(
      from,
      destination
    ) {
  
      const options =
        legalMoves(
          from.r,
          from.c
        ).filter(
          (move) =>
            move.r === destination.r &&
            move.c === destination.c
        );
  
  
      if (!options.length) {
        return;
      }
  
  
      const move =
        options[0];
  
  
      if (move.promo) {
  
        game.pendingPromo = {
          from,
          move
        };
  
        showPromo(
          pieceAt(
            from.r,
            from.c
          ).c
        );
  
        return;
      }
  
  
      play(
        from,
        move
      );
    }
  
  
    /* =========================================================
       PROMOÇÃO
    ========================================================= */
  
    function showPromo(color) {
  
      overlay.classList.remove(
        'hidden'
      );
  
  
      overlayOk.classList.add(
        'hidden'
      );
  
  
      overlayTitle.textContent =
        'Promoção';
  
  
      overlayText.textContent =
        'Escolha a peça para promover o peão.';
  
  
      promoChoices.innerHTML =
        '';
  
  
      for (
        const type
        of ['Q', 'R', 'B', 'N']
      ) {
  
        const button =
          uiButton({
            text:
              UNICODE[
                color + type
              ],
  
            className:
              'chess-promo-btn'
          });
  
  
        button.addEventListener(
          'click',
          () => {
  
            const {
              from,
              move
            } = game.pendingPromo;
  
  
            game.pendingPromo =
              null;
  
  
            overlay.classList.add(
              'hidden'
            );
  
  
            play(
              from,
              move,
              type
            );
          }
        );
  
  
        promoChoices.appendChild(
          button
        );
      }
    }
  
  
    /* =========================================================
       FIM DE PARTIDA
    ========================================================= */
  
    function showEnd() {
  
      overlay.classList.remove(
        'hidden'
      );
  
  
      promoChoices.innerHTML =
        '';
  
  
      overlayOk.classList.remove(
        'hidden'
      );
  
  
      overlayTitle.textContent =
        'Fim de partida';
  
  
      overlayText.textContent =
        game.over;
    }
  
  
    /* =========================================================
       RENDER
    ========================================================= */
  
    function render() {
  
      boardEl.innerHTML =
        '';
  
  
      const legal =
        game.selected
          ? legalMoves(
              game.selected.r,
              game.selected.c
            )
          : [];
  
  
      const legalSet =
        new Set(
          legal.map(
            (move) =>
              key(
                move.r,
                move.c
              )
          )
        );
  
  
      const king =
        findKing(
          game.turn
        );
  
  
      const checked =
        inCheck(
          game.turn
        );
  
  
      for (
        let r = 0;
        r < 8;
        r++
      ) {
  
        for (
          let c = 0;
          c < 8;
          c++
        ) {
  
          const square =
            document.createElement(
              'button'
            );
  
  
          square.type =
            'button';
  
          square.className =
            `chess-square ${
              (r + c) % 2 === 0
                ? 'light'
                : 'dark'
            }`;
  
  
          square.dataset.r =
            r;
  
          square.dataset.c =
            c;
  
  
          const piece =
            pieceAt(r, c);
  
  
          if (piece) {
  
            const glyph =
              document.createElement(
                'span'
              );
  
            glyph.className =
              `chess-piece ${piece.c}`;
  
            glyph.textContent =
              UNICODE[
                piece.c + piece.t
              ];
  
            glyph.setAttribute(
              'aria-hidden',
              'true'
            );
  
            square.appendChild(
              glyph
            );
          }
  
  
          if (
            game.selected &&
            game.selected.r === r &&
            game.selected.c === c
          ) {
  
            square.classList.add(
              'selected'
            );
          }
  
  
          if (
            game.lastMove &&
            (
              (
                game.lastMove.from.r === r &&
                game.lastMove.from.c === c
              ) ||
              (
                game.lastMove.to.r === r &&
                game.lastMove.to.c === c
              )
            )
          ) {
  
            square.classList.add(
              'last'
            );
          }
  
  
          if (
            checked &&
            king &&
            king.r === r &&
            king.c === c
          ) {
  
            square.classList.add(
              'check'
            );
          }
  
  
          if (
            legalSet.has(
              key(r, c)
            )
          ) {
  
            const mark =
              document.createElement(
                'span'
              );
  
  
            mark.className =
              piece
                ? 'chess-ring'
                : 'chess-dot';
  
  
            mark.setAttribute(
              'aria-hidden',
              'true'
            );
  
  
            square.appendChild(
              mark
            );
          }
  
  
          square.addEventListener(
            'click',
            () => onSquare(r, c)
          );
  
  
          boardEl.appendChild(
            square
          );
        }
      }
  
  
      capturedByWhite.innerHTML =
        game.captured.w
          .map(
            (piece) =>
              `<span class="chess-piece ${piece.c}">
                ${UNICODE[piece.c + piece.t]}
              </span>`
          )
          .join('');
  
  
      capturedByBlack.innerHTML =
        game.captured.b
          .map(
            (piece) =>
              `<span class="chess-piece ${piece.c}">
                ${UNICODE[piece.c + piece.t]}
              </span>`
          )
          .join('');
  
  
      movesEl.innerHTML =
        game.moves
          .map(
            (move) =>
              `<li>
                <span>${move.w}</span>
                <span>${move.b}</span>
              </li>`
          )
          .join('');
  
  
      if (game.over) {
  
        statusPill.textContent =
          game.over;
  
        turnText.textContent =
          game.over;
  
        showEnd();
  
      } else {
  
        overlay.classList.add(
          'hidden'
        );
  
  
        const side =
          game.turn === 'w'
            ? 'brancas'
            : 'pretas';
  
  
        statusPill.textContent =
          inCheck(game.turn)
            ? `Xeque — vez das ${side}`
            : `Vez das ${side}`;
  
  
        turnText.textContent =
          inCheck(game.turn)
            ? 'Seu rei está em xeque. Faça um lance legal para sair do xeque.'
            : 'Clique numa peça da vez e depois no destino.';
      }
    }
  
  
    /* =========================================================
       CLIQUE NO TABULEIRO
    ========================================================= */
  
    function onSquare(
      r,
      c
    ) {
  
      if (
        game.over ||
        game.pendingPromo
      ) {
        return;
      }
  
  
      const piece =
        pieceAt(r, c);
  
  
      if (game.selected) {
  
        if (
          game.selected.r === r &&
          game.selected.c === c
        ) {
  
          game.selected =
            null;
  
          render();
  
          return;
        }
  
  
        const destinationIsLegal =
          legalMoves(
            game.selected.r,
            game.selected.c
          ).some(
            (move) =>
              move.r === r &&
              move.c === c
          );
  
  
        if (
          destinationIsLegal
        ) {
  
          tryMove(
            game.selected,
            {
              r,
              c
            }
          );
  
          return;
        }
      }
  
  
      if (
        piece &&
        piece.c === game.turn
      ) {
  
        game.selected = {
          r,
          c
        };
  
        sound.click();
  
        render();
      }
    }
  
  
    /* =========================================================
       NOVA PARTIDA
    ========================================================= */
  
    function reset() {
  
      game.board =
        startBoard();
  
      game.turn =
        'w';
  
      game.castle = {
        wK: true,
        wQ: true,
        bK: true,
        bQ: true
      };
  
      game.ep =
        null;
  
      game.selected =
        null;
  
      game.lastMove =
        null;
  
      game.history =
        [];
  
      game.captured = {
        w: [],
        b: []
      };
  
      game.moves =
        [];
  
      game.over =
        null;
  
      game.pendingPromo =
        null;
  
  
      overlay.classList.add(
        'hidden'
      );
  
  
      sound.click();
  
      render();
    }
  
  
    /* =========================================================
       DESFAZER
    ========================================================= */
  
    function undo() {
  
      const previous =
        game.history.pop();
  
  
      if (!previous) {
        return;
      }
  
  
      Object.assign(
        game,
        previous
      );
  
  
      game.selected =
        null;
  
      game.pendingPromo =
        null;
  
  
      overlay.classList.add(
        'hidden'
      );
  
  
      sound.click();
  
      render();
    }
  
  
    /* =========================================================
       CONTROLES
    ========================================================= */
  
    btnRestart.addEventListener(
      'click',
      reset
    );
  
    btnUndo.addEventListener(
      'click',
      undo
    );
  
    overlayOk.addEventListener(
      'click',
      reset
    );
  
  
    /* =========================================================
       CLEANUP
    ========================================================= */
  
    wrap.cleanup = () => {
  
      game.selected =
        null;
  
      game.pendingPromo =
        null;
  
      overlay.classList.add(
        'hidden'
      );
    };
  
  
    /* =========================================================
       INÍCIO
    ========================================================= */
  
    render();
  
    return wrap;
  }