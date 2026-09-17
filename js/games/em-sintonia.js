/* =========================================================
   EM SINTONIA
   Base adaptada do jogo de espectro de referência.

   Nesta primeira versão a prioridade é:
   - manter a ideia do alvo oculto;
   - marcador/agulha arrastável por mouse ou touch;
   - separar as quatro fases do jogo;
   - deixar a estrutura pronta para competitivo/cooperativo;
   - não alterar nenhum outro jogo.
========================================================= */

function renderEmSintonia() {
  const root = document.createElement('section');
  root.className = 'em-sintonia';
  root.style.color = 'var(--accent, #e9a7bd)';

  const cards = (window.DATA && window.DATA.emSintonia)
    ? window.DATA.emSintonia
    : { base: [], advanced: [] };

  const state = {
    mode: 'competitive',
    phase: 'psychic',
    round: 1,
    currentTeam: 0,
    teams: [
      { name: 'Time 1', score: 0 },
      { name: 'Time 2', score: 0 }
    ],
    deck: [],
    deckIndex: 0,
    spectrum: null,
    target: 0.5,
    guess: 0.5,
    targetVisible: true,
    sideGuess: null,
    lastScore: null
  };

  root.innerHTML = `
    <header class="em-sintonia__header">
      <span class="em-sintonia__eyebrow">Cúmplices · jogo de espectro</span>
      <h1 class="em-sintonia__title">Em Sintonia</h1>
      <p class="em-sintonia__subtitle" data-role="instruction"></p>
    </header>

    <div class="em-sintonia__turn">
      <div class="em-sintonia__phase" data-role="phase"></div>
    </div>

    <div class="em-sintonia__score" data-role="score"></div>

    <div class="em-sintonia__board-wrap">
      <div class="em-sintonia__board" data-role="board" aria-label="Espectro de Em Sintonia">
        <div class="em-sintonia__spectrum"></div>
        <div class="em-sintonia__target is-hidden" data-role="target">
          <span class="em-sintonia__target-slice"></span>
          <span class="em-sintonia__target-slice"></span>
          <span class="em-sintonia__target-slice"></span>
          <span class="em-sintonia__target-slice"></span>
          <span class="em-sintonia__target-slice"></span>
          <span class="em-sintonia__target-center" data-role="target-center"></span>
        </div>
        <div class="em-sintonia__needle" data-role="needle">
          <span class="em-sintonia__needle-line"></span>
          <span class="em-sintonia__needle-knob"></span>
        </div>
        <div class="em-sintonia__reveal" data-role="reveal">
          <div class="em-sintonia__reveal-card">
            <strong data-role="result-title">Alvo revelado</strong>
            <span data-role="result-detail"></span>
          </div>
        </div>
      </div>

      <div class="em-sintonia__labels">
        <span class="em-sintonia__label" data-role="left-label"></span>
        <span class="em-sintonia__label" data-role="right-label"></span>
      </div>
    </div>

    <div class="em-sintonia__clue">
      <small>Pista</small>
      <strong data-role="clue">—</strong>
    </div>

    <div class="em-sintonia__side-buttons" data-role="side-buttons">
      <button type="button" class="em-sintonia__side-button is-left" data-side="left">Esquerda</button>
      <button type="button" class="em-sintonia__side-button is-right" data-side="right">Direita</button>
    </div>

    <div class="em-sintonia__actions">
      <button type="button" class="em-sintonia__button" data-action="toggle-target">Esconder alvo</button>
      <button type="button" class="em-sintonia__button em-sintonia__button--primary" data-action="next">Esconder e continuar</button>
      <button type="button" class="em-sintonia__button" data-action="new">Novo jogo</button>
    </div>

    <div class="em-sintonia__round-info" data-role="round-info"></div>
  `;

  const $ = (role) => root.querySelector(`[data-role="${role}"]`);
  const board = $('board');
  const target = $('target');
  const targetCenter = $('target-center');
  const needle = $('needle');
  const clue = $('clue');
  const instruction = $('instruction');
  const phase = $('phase');
  const score = $('score');
  const sideButtons = $('side-buttons');
  const reveal = $('reveal');
  const resultTitle = $('result-title');
  const resultDetail = $('result-detail');
  const leftLabel = $('left-label');
  const rightLabel = $('right-label');
  const roundInfo = $('round-info');
  const toggleTargetButton = root.querySelector('[data-action="toggle-target"]');
  const nextButton = root.querySelector('[data-action="next"]');
  const newButton = root.querySelector('[data-action="new"]');

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function buildDeck() {
    state.deck = shuffle(cards.base.map(pair => ({ left: pair[0], right: pair[1], advanced: false })));
    state.deckIndex = 0;
  }

  function drawCard() {
    if (!state.deck.length || state.deckIndex >= state.deck.length) buildDeck();
    state.spectrum = state.deck[state.deckIndex++];
  }

  function randomTarget() {
    state.target = 0.15 + Math.random() * 0.70;
    state.guess = 0.5;
  }

  function scoreDistance(distance) {
    const slice = 0.10;
    if (distance <= slice / 2) return 4;
    if (distance <= slice * 1.5) return 3;
    if (distance <= slice * 2.5) return 2;
    return 0;
  }

  function scoreForGuess() {
    return scoreDistance(Math.abs(state.guess - state.target));
  }

  function sideForTarget() {
    return state.target < state.guess ? 'left' : 'right';
  }

  function updateNeedle() {
    const angle = (state.guess - 0.5) * 180;
    needle.style.transform = `rotate(${angle}deg)`;
  }

  function setGuessFromPointer(clientX) {
    if (state.phase !== 'guess') return;
    const rect = board.getBoundingClientRect();
    state.guess = clamp((clientX - rect.left) / rect.width);
    updateNeedle();
  }

  function renderScore() {
    score.innerHTML = state.teams.map((team, index) => `
      <div class="em-sintonia__score-team ${index === state.currentTeam ? 'is-active' : ''}">
        <span class="em-sintonia__score-name">${team.name}</span>
        <span class="em-sintonia__score-value">${team.score}</span>
      </div>
    `).join('');
  }

  function renderPhase() {
    const labels = {
      psychic: '🔮 Psychic',
      guess: '🎯 Palpite',
      side: '👈 👉 Esquerda ou direita',
      scoring: '🏆 Pontuação'
    };
    phase.textContent = labels[state.phase];

    const instructions = {
      psychic: 'O Psychic olha o alvo, guarda a posição e dá uma pista.',
      guess: 'A pista foi dada. Agora o time posiciona a agulha.',
      side: 'O outro time decide de que lado do palpite está o centro real.',
      scoring: 'Hora de revelar o alvo e distribuir os pontos.'
    };
    instruction.textContent = instructions[state.phase];

    sideButtons.style.display = state.phase === 'side' ? 'grid' : 'none';
    toggleTargetButton.style.display = state.phase === 'psychic' || state.phase === 'guess' ? '' : 'none';

    if (state.phase === 'psychic') {
      nextButton.textContent = 'Esconder e continuar';
    } else if (state.phase === 'guess') {
      nextButton.textContent = 'Confirmar palpite';
    } else if (state.phase === 'scoring') {
      nextButton.textContent = 'Próxima rodada';
    } else {
      nextButton.textContent = 'Escolha um lado';
    }
  }

  function renderBoard() {
    if (!state.spectrum) return;
    leftLabel.textContent = state.spectrum.left;
    rightLabel.textContent = state.spectrum.right;

    const targetWidth = 50;
    const left = clamp(state.target * 100 - targetWidth / 2, 0, 100 - targetWidth);
    target.style.left = `${left}%`;
    targetCenter.style.left = `${state.target * 100 - left}%`;
    target.classList.toggle('is-hidden', !state.targetVisible);
    updateNeedle();
  }

  function prepareRound() {
    drawCard();
    randomTarget();
    state.targetVisible = true;
    state.sideGuess = null;
    state.lastScore = null;
    reveal.classList.remove('is-active');
    clue.textContent = 'Dê uma pista em voz alta.';
    state.phase = 'psychic';
    renderPhase();
    renderBoard();
    renderScore();
    roundInfo.textContent = `Rodada ${state.round} · ${state.mode === 'competitive' ? 'competitivo' : 'cooperativo'}`;
  }

  function startGuessPhase() {
    state.targetVisible = false;
    state.phase = 'guess';
    clue.textContent = 'A pista já foi dada. Onde vocês colocariam o marcador?';
    renderPhase();
    renderBoard();
  }

  function confirmGuess() {
    state.phase = 'side';
    renderPhase();
  }

  function chooseSide(side) {
    state.sideGuess = side;
    state.phase = 'scoring';
    renderPhase();
    reveal.classList.add('is-active');
    revealTarget();
  }

  function revealTarget() {
    state.targetVisible = true;
    const teamPoints = scoreForGuess();
    const opponentCorrect = state.sideGuess === sideForTarget();
    const opponentPoints = teamPoints === 4 ? 0 : (opponentCorrect ? 1 : 0);

    state.lastScore = { teamPoints, opponentPoints, opponentCorrect };
    state.teams[state.currentTeam].score += teamPoints;
    state.teams[1 - state.currentTeam].score += opponentPoints;

    const resultText = teamPoints === 4
      ? 'Centro exato!'
      : teamPoints === 3
        ? 'Faixa adjacente.'
        : teamPoints === 2
          ? 'Faixa externa.'
          : 'Fora do alvo.';

    resultTitle.textContent = `${teamPoints} ponto${teamPoints === 1 ? '' : 's'}`;
    resultDetail.textContent = `${resultText} ${opponentPoints ? 'O adversário acertou o lado e ganhou 1.' : ''}`;

    renderBoard();
    renderScore();
    renderPhase();
  }

  function nextRound() {
    if (state.phase === 'psychic') {
      startGuessPhase();
      return;
    }

    if (state.phase === 'guess') {
      confirmGuess();
      return;
    }

    if (state.phase === 'side') return;

    state.round += 1;
    state.currentTeam = 1 - state.currentTeam;
    prepareRound();
  }

  function resetGame() {
    state.round = 1;
    state.currentTeam = 0;
    state.teams.forEach(team => { team.score = 0; });
    buildDeck();
    prepareRound();
  }

  function toggleTarget() {
    if (state.phase !== 'psychic' && state.phase !== 'guess') return;
    state.targetVisible = !state.targetVisible;
    renderBoard();
    renderPhase();
  }

  function onPointerDown(event) {
    if (state.phase !== 'guess') return;
    event.preventDefault();
    board.setPointerCapture?.(event.pointerId);
    setGuessFromPointer(event.clientX);
  }

  function onPointerMove(event) {
    if (state.phase !== 'guess') return;
    if (event.buttons === 0 && event.pointerType !== 'touch') return;
    event.preventDefault();
    setGuessFromPointer(event.clientX);
  }

  board.addEventListener('pointerdown', onPointerDown);
  board.addEventListener('pointermove', onPointerMove);
  toggleTargetButton.addEventListener('click', toggleTarget);
  nextButton.addEventListener('click', nextRound);
  newButton.addEventListener('click', resetGame);

  root.querySelectorAll('[data-side]').forEach(button => {
    button.addEventListener('click', () => chooseSide(button.dataset.side));
  });

  buildDeck();
  prepareRound();

  root.cleanup = () => {
    board.removeEventListener('pointerdown', onPointerDown);
    board.removeEventListener('pointermove', onPointerMove);
  };

  return root;
}
