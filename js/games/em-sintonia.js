/* =========================================================
   EM SINTONIA
   Mecânica fiel ao Wavelength de referência.
   Integração visual/armazenamento adaptada ao Cúmplices.
========================================================= */

function renderEmSintonia() {
  const root = document.createElement('section');
  root.className = 'em-sintonia';

  const cards = window.DATA?.emSintonia?.base || [];
  const STORAGE_NAME = 'em-sintonia.game';

  const state = {
    mode: 'teams',
    teams: [],
    players: [],
    currentTeamIndex: 0,
    currentPlayerIndex: 0,
    currentClueIndex: -1,
    targetAngle: 0,
    currentNeedleAngle: 0,
    isTargetVisible: true,
    isPostGuessPhase: false
  };

  root.innerHTML = `
    <header class="em-sintonia__header">
      <span class="em-sintonia__eyebrow">Cúmplices · jogo de espectro</span>
      <h1 class="em-sintonia__title">Em Sintonia</h1>
      <p class="em-sintonia__subtitle" data-role="instruction"></p>
    </header>
    <div class="em-sintonia__mode" data-role="mode"></div>
    <div class="em-sintonia__turn"><div class="em-sintonia__phase" data-role="phase"></div></div>
    <div class="em-sintonia__round-turn" data-role="round-turn"></div>
    <div class="em-sintonia__score" data-role="score"></div>
    <div class="em-sintonia__board-wrap">
      <div class="em-sintonia__board" data-role="board" aria-label="Espectro de Em Sintonia">
        <div class="em-sintonia__target" data-role="target"></div>
        <div class="em-sintonia__needle" data-role="needle"><span class="em-sintonia__needle-line"></span></div>
        <div class="em-sintonia__reveal" data-role="overlay">
          <div class="em-sintonia__reveal-card"><strong>Toque para começar</strong><span>Veja o alvo e dê uma pista.</span></div>
        </div>
      </div>
      <div class="em-sintonia__labels">
        <span class="em-sintonia__label" data-role="left-label"></span>
        <span class="em-sintonia__arrow" aria-hidden="true">↔</span>
        <span class="em-sintonia__label" data-role="right-label"></span>
      </div>
    </div>
    <div class="em-sintonia__clue"><small>Pista</small><strong data-role="clue"></strong></div>
    <div class="em-sintonia__actions">
      <button type="button" class="em-sintonia__button" data-action="toggle">Esconder para os palpites</button>
      <button type="button" class="em-sintonia__button" data-action="skip">Pular pista</button>
      <button type="button" class="em-sintonia__button em-sintonia__button--primary" data-action="next">Próxima rodada</button>
      <button type="button" class="em-sintonia__button" data-action="new">Novo jogo</button>
    </div>
    <div class="em-sintonia__round-info" data-role="round-info"></div>
  `;

  const $ = role => root.querySelector(`[data-role="${role}"]`);
  const board = $('board'), target = $('target'), needle = $('needle'), overlay = $('overlay');
  const clue = $('clue'), instruction = $('instruction'), phase = $('phase'), score = $('score');
  const roundTurn = $('round-turn'), mode = $('mode');
  const leftLabel = $('left-label'), rightLabel = $('right-label'), roundInfo = $('round-info');
  const toggleButton = root.querySelector('[data-action="toggle"]');
  const skipButton = root.querySelector('[data-action="skip"]');
  const nextButton = root.querySelector('[data-action="next"]');
  const newButton = root.querySelector('[data-action="new"]');

  let isDragging = false;
  let canMoveNeedle = false;

  const clampAngle = angle => Math.max(-90, Math.min(90, angle));

  function calculateScore(angle) {
    const diff = Math.abs(angle - state.targetAngle);
    if (diff <= 4.5) return 5;
    if (diff <= 13.5) return 3;
    if (diff <= 22.5) return 1;
    return 0;
  }

  function getCurrentName() {
    if (state.mode === 'free') return state.players[state.currentPlayerIndex]?.name || 'Jogador';
    return state.teams[state.currentTeamIndex]?.name || 'Time';
  }

  function getCurrentCollection() {
    return state.mode === 'free' ? state.players : state.teams;
  }

  function saveGameState() {
    storageSet(STORAGE_NAME, {
      mode: state.mode,
      teams: state.teams,
      players: state.players,
      currentTeamIndex: state.currentTeamIndex,
      currentPlayerIndex: state.currentPlayerIndex,
      currentClueIndex: state.currentClueIndex,
      targetAngle: state.targetAngle,
      currentNeedleAngle: state.currentNeedleAngle,
      isTargetVisible: state.isTargetVisible,
      isPostGuessPhase: state.isPostGuessPhase
    });
  }

  function loadGameState() {
    return storageGet(STORAGE_NAME, null);
  }

  function setTargetArea() {
    const angle1 = Math.max(0, Math.min(180, state.targetAngle - 22.5 + 90));
    const angle2 = Math.max(0, Math.min(180, state.targetAngle - 13.5 + 90));
    const angle3 = Math.max(0, Math.min(180, state.targetAngle - 4.5 + 90));
    const angle4 = Math.max(0, Math.min(180, state.targetAngle + 4.5 + 90));
    const angle5 = Math.max(0, Math.min(180, state.targetAngle + 13.5 + 90));
    const angle6 = Math.max(0, Math.min(180, state.targetAngle + 22.5 + 90));
    target.style.background = `conic-gradient(from -90deg at 50% 100%,
      #a4b0be 0deg ${angle1}deg,
      #ff6b6b ${angle1}deg ${angle2}deg,
      #feca57 ${angle2}deg ${angle3}deg,
      #48dbfb ${angle3}deg ${angle4}deg,
      #feca57 ${angle4}deg ${angle5}deg,
      #ff6b6b ${angle5}deg ${angle6}deg,
      #a4b0be ${angle6}deg 180deg)`;
  }

  function updateNeedle() {
    needle.style.transform = `rotate(${state.currentNeedleAngle}deg)`;
  }

  function displayClue() {
    if (state.currentClueIndex < 0 || !cards.length) return;
    const [left, right] = cards[state.currentClueIndex];
    leftLabel.textContent = left;
    rightLabel.textContent = right;
  }

  function setRandomClues() {
    if (!cards.length) return;
    state.currentClueIndex = Math.floor(Math.random() * cards.length);
  }

  function initializeNewTargetArea() {
    state.targetAngle = Math.random() * 180 - 90;
    setTargetArea();
  }

  function escapeHtml(value) {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }

  function updateModeDisplay() {
    mode.innerHTML = `
      <div class="em-sintonia__mode-switch" role="tablist" aria-label="Modo de jogo">
        <button type="button" class="em-sintonia__mode-button ${state.mode === 'teams' ? 'is-active' : ''}" data-mode="teams">👥 Times</button>
        <button type="button" class="em-sintonia__mode-button ${state.mode === 'free' ? 'is-active' : ''}" data-mode="free">🧑 Livre</button>
      </div>`;

    mode.querySelectorAll('[data-mode]').forEach(button => {
      button.addEventListener('click', () => switchMode(button.dataset.mode));
    });
  }

  function renderRosterItem(item, index, type) {
    const label = type === 'player' ? 'Jogador' : 'Time';
    return `
      <div class="em-sintonia__score-team ${index === (type === 'player' ? state.currentPlayerIndex : state.currentTeamIndex) ? 'is-active' : ''}" data-roster-index="${index}">
        <button type="button" class="em-sintonia__team-name" data-edit-roster="${index}">${escapeHtml(item.name)} <span>✏️</span></button>
        <strong>${item.score}</strong>
        <button type="button" class="em-sintonia__team-delete" data-delete-roster="${index}" ${getCurrentCollection().length === 1 ? 'disabled' : ''}>🗑️</button>
      </div>`;
  }

  function updateScoreDisplay() {
    const isFree = state.mode === 'free';
    const collection = getCurrentCollection();
    const type = isFree ? 'player' : 'team';
    const label = isFree ? 'jogador' : 'time';
    const addLabel = isFree ? '+ Adicionar jogador' : '+ Adicionar time';

    score.innerHTML = `
      <div class="em-sintonia__score-management">Toque no nome para editar.</div>
      ${collection.map((item, index) => renderRosterItem(item, index, type)).join('')}
      <button type="button" class="em-sintonia__add-team" data-add-roster>${addLabel}</button>`;

    score.querySelectorAll('[data-edit-roster]').forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.editRoster);
        const input = document.createElement('input');
        input.className = 'em-sintonia__team-input';
        input.value = collection[index].name;
        button.replaceWith(input);
        input.focus(); input.select();
        const finish = () => {
          const name = input.value.trim();
          if (name) collection[index].name = name;
          updateScoreDisplay();
          updateCurrentPhase();
          updateRoundTurn();
          saveGameState();
        };
        input.addEventListener('blur', finish, { once: true });
        input.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === 'Escape') input.blur(); });
      });
    });

    score.querySelectorAll('[data-delete-roster]').forEach(button => {
      button.addEventListener('click', () => {
        if (collection.length <= 1) return;
        const index = Number(button.dataset.deleteRoster);
        collection.splice(index, 1);
        if (isFree) {
          if (state.currentPlayerIndex >= collection.length) state.currentPlayerIndex = 0;
        } else if (state.currentTeamIndex >= collection.length) {
          state.currentTeamIndex = 0;
        }
        updateScoreDisplay();
        updateCurrentPhase();
        updateRoundTurn();
        saveGameState();
      });
    });

    score.querySelector('[data-add-roster]')?.addEventListener('click', () => {
      collection.push({ name: isFree ? `Jogador ${collection.length + 1}` : `Time ${collection.length + 1}`, score: 0 });
      updateScoreDisplay();
      saveGameState();
    });
  }

  function updateCurrentPhase() {
    const postGuess = state.isPostGuessPhase;
    const psychic = state.isTargetVisible && !postGuess;
    const currentName = getCurrentName();
    const subject = state.mode === 'free' ? currentName : currentName;

    phase.textContent = postGuess ? '🏆 Alvo revelado' : psychic ? '🔮 Dica' : '🎯 Palpite';
    instruction.textContent = postGuess
      ? `${subject} marcou ${calculateScore(state.currentNeedleAngle)} ponto(s).`
      : psychic
        ? `${subject} dá a dica. Veja o alvo e depois esconda-o para os palpites.`
        : state.mode === 'free'
          ? `${subject} está dando a dica. O grupo tenta adivinhar onde está o alvo.`
          : `${subject} tenta adivinhar. Posicionem a agulha onde acharem que está o alvo.`;

    toggleButton.style.display = postGuess ? 'none' : '';
    toggleButton.textContent = psychic ? 'Esconder para os palpites' : 'Revelar alvo';
    skipButton.style.display = psychic ? '' : 'none';
    nextButton.style.display = postGuess ? '' : 'none';
    board.classList.toggle('is-psychic', psychic);
    board.classList.toggle('is-guessing', !psychic && !postGuess);
    board.classList.toggle('is-revealed', postGuess);
  }

  function updateRoundTurn() {
    const currentName = getCurrentName();
    const role = state.isPostGuessPhase
      ? 'Resultado da rodada'
      : state.isTargetVisible
        ? 'Quem dá a dica'
        : 'Quem adivinha';
    roundTurn.innerHTML = `<strong>Rodada de ${escapeHtml(currentName)}</strong><span>${role}</span>`;
  }

  function render() {
    displayClue();
    setTargetArea();
    updateNeedle();
    target.style.display = state.isTargetVisible || state.isPostGuessPhase ? 'block' : 'none';
    needle.style.display = state.isPostGuessPhase || state.isTargetVisible ? 'none' : 'block';
    const currentName = getCurrentName();
    clue.textContent = state.isPostGuessPhase
      ? `${currentName} marcou ${calculateScore(state.currentNeedleAngle)} ponto(s).`
      : state.isTargetVisible ? 'Dê uma dica em voz alta.' : 'A dica foi dada. Posicionem a agulha.';
    roundInfo.textContent = state.currentClueIndex >= 0 ? `Pista ${state.currentClueIndex + 1}` : '';
    updateModeDisplay();
    updateScoreDisplay();
    updateCurrentPhase();
    updateRoundTurn();
  }

  function setPsychicView() {
    canMoveNeedle = false;
    state.isPostGuessPhase = false;
    if (state.currentClueIndex === -1) {
      initializeNewTargetArea();
      setRandomClues();
    } else {
      setTargetArea();
    }
    state.isTargetVisible = true;
    state.currentNeedleAngle = 0;
    render();
    saveGameState();
  }

  function setGuesserView() {
    canMoveNeedle = true;
    state.isPostGuessPhase = false;
    state.isTargetVisible = false;
    state.currentNeedleAngle = 0;
    render();
    saveGameState();
  }

  function revealTarget() {
    canMoveNeedle = false;
    state.isTargetVisible = true;
    state.isPostGuessPhase = true;
    const collection = getCurrentCollection();
    if (collection[state.mode === 'free' ? state.currentPlayerIndex : state.currentTeamIndex]) {
      const index = state.mode === 'free' ? state.currentPlayerIndex : state.currentTeamIndex;
      collection[index].score += calculateScore(state.currentNeedleAngle);
    }
    render();
    saveGameState();
  }

  function nextRound() {
    if (state.mode === 'free') {
      state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    } else {
      state.currentTeamIndex = (state.currentTeamIndex + 1) % state.teams.length;
    }
    state.currentClueIndex = -1;
    state.currentNeedleAngle = 0;
    setPsychicView();
  }

  function resetGame() {
    state.teams.forEach(team => team.score = 0);
    state.players.forEach(player => player.score = 0);
    state.currentTeamIndex = 0;
    state.currentPlayerIndex = 0;
    state.currentClueIndex = -1;
    state.targetAngle = 0;
    state.currentNeedleAngle = 0;
    state.isTargetVisible = true;
    state.isPostGuessPhase = false;
    render();
    showOverlay();
    saveGameState();
  }

  function switchMode(nextMode) {
    if (nextMode !== 'teams' && nextMode !== 'free') return;
    if (state.mode === nextMode) return;
    state.mode = nextMode;
    state.currentClueIndex = -1;
    state.currentNeedleAngle = 0;
    state.currentTeamIndex = 0;
    state.currentPlayerIndex = 0;
    state.isTargetVisible = true;
    state.isPostGuessPhase = false;
    render();
    showOverlay();
    saveGameState();
  }

  function showOverlay() {
    overlay.classList.add('is-active');
    canMoveNeedle = false;
  }

  function hideOverlay() {
    overlay.classList.remove('is-active');
    if (state.currentClueIndex === -1) setPsychicView();
  }

  function handleStart(event) {
    if (!canMoveNeedle) return;
    isDragging = true;
    event.preventDefault();
    handleMove(event);
  }

  function handleMove(event) {
    if (!isDragging || !canMoveNeedle) return;
    event.preventDefault();
    const point = event.touches?.[0] || event;
    const rect = board.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.bottom;
    const angle = Math.atan2(point.clientX - centerX, centerY - point.clientY) * 180 / Math.PI;
    state.currentNeedleAngle = clampAngle(angle);
    updateNeedle();
  }

  function handleEnd() {
    isDragging = false;
    saveGameState();
  }

  overlay.addEventListener('click', hideOverlay);
  toggleButton.addEventListener('click', () => {
    if (state.isTargetVisible && !state.isPostGuessPhase) setGuesserView();
    else if (!state.isPostGuessPhase) revealTarget();
  });
  skipButton.addEventListener('click', () => { state.currentClueIndex = -1; setPsychicView(); });
  nextButton.addEventListener('click', nextRound);
  newButton.addEventListener('click', resetGame);

  board.addEventListener('mousedown', handleStart);
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleEnd);
  board.addEventListener('touchstart', handleStart, { passive: false });
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('touchend', handleEnd);

  const saved = loadGameState();
  if (saved && Array.isArray(saved.teams) && saved.teams.length) {
    Object.assign(state, saved);
    state.mode = saved.mode === 'free' ? 'free' : 'teams';
    state.players = Array.isArray(saved.players) && saved.players.length ? saved.players : [
      { name: 'Jogador 1', score: 0 },
      { name: 'Jogador 2', score: 0 }
    ];
    if (!Number.isInteger(state.currentTeamIndex) || state.currentTeamIndex >= state.teams.length) state.currentTeamIndex = 0;
    if (!Number.isInteger(state.currentPlayerIndex) || state.currentPlayerIndex >= state.players.length) state.currentPlayerIndex = 0;
    canMoveNeedle = !state.isTargetVisible && !state.isPostGuessPhase;
    render();
    if (state.currentClueIndex === -1) showOverlay();
  } else {
    state.teams = [{ name: 'Time 1', score: 0 }, { name: 'Time 2', score: 0 }];
    state.players = [{ name: 'Jogador 1', score: 0 }, { name: 'Jogador 2', score: 0 }];
    setPsychicView();
    showOverlay();
  }

  root.cleanup = () => {
    board.removeEventListener('mousedown', handleStart);
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    board.removeEventListener('touchstart', handleStart);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('touchend', handleEnd);
    saveGameState();
  };

  return root;
}
