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
    teams: [], currentTeamIndex: 0, currentClueIndex: -1,
    targetAngle: 0, currentNeedleAngle: 0,
    isTargetVisible: true, isPostGuessPhase: false
  };

  root.innerHTML = `
    <header class="em-sintonia__header">
      <span class="em-sintonia__eyebrow">Cúmplices · jogo de espectro</span>
      <h1 class="em-sintonia__title">Em Sintonia</h1>
      <p class="em-sintonia__subtitle" data-role="instruction"></p>
    </header>
    <div class="em-sintonia__turn"><div class="em-sintonia__phase" data-role="phase"></div></div>
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

  function saveGameState() {
    storageSet(STORAGE_NAME, {
      teams: state.teams,
      currentTeamIndex: state.currentTeamIndex,
      currentClueIndex: state.currentClueIndex,
      targetAngle: state.targetAngle,
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

  function updateScoreDisplay() {
    score.innerHTML = `
      <div class="em-sintonia__score-management">Toque no nome para editar.</div>
      ${state.teams.map((team, index) => `
        <div class="em-sintonia__score-team ${index === state.currentTeamIndex ? 'is-active' : ''}" data-team-index="${index}">
          <button type="button" class="em-sintonia__team-name" data-edit-team="${index}">${escapeHtml(team.name)} <span>✏️</span></button>
          <strong>${team.score}</strong>
          <button type="button" class="em-sintonia__team-delete" data-delete-team="${index}" ${state.teams.length === 1 ? 'disabled' : ''}>🗑️</button>
        </div>`).join('')}
      <button type="button" class="em-sintonia__add-team" data-add-team>+ Adicionar time</button>`;

    score.querySelectorAll('[data-edit-team]').forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.editTeam);
        const input = document.createElement('input');
        input.className = 'em-sintonia__team-input';
        input.value = state.teams[index].name;
        button.replaceWith(input);
        input.focus(); input.select();
        const finish = () => {
          const name = input.value.trim();
          if (name) state.teams[index].name = name;
          updateScoreDisplay(); saveGameState();
        };
        input.addEventListener('blur', finish, { once: true });
        input.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === 'Escape') input.blur(); });
      });
    });

    score.querySelectorAll('[data-delete-team]').forEach(button => {
      button.addEventListener('click', () => {
        if (state.teams.length <= 1) return;
        state.teams.splice(Number(button.dataset.deleteTeam), 1);
        if (state.currentTeamIndex >= state.teams.length) state.currentTeamIndex = 0;
        updateScoreDisplay(); saveGameState();
      });
    });

    score.querySelector('[data-add-team]')?.addEventListener('click', () => {
      state.teams.push({ name: `Time ${state.teams.length + 1}`, score: 0 });
      updateScoreDisplay(); saveGameState();
    });
  }

  function updateCurrentPhase() {
    const postGuess = state.isPostGuessPhase;
    const psychic = state.isTargetVisible && !postGuess;
    phase.textContent = postGuess ? '🏆 Alvo revelado' : psychic ? '🔮 Psychic' : '🎯 Palpite';
    instruction.textContent = postGuess
      ? `${state.teams[state.currentTeamIndex]?.name || 'Time'} fez ${calculateScore(state.currentNeedleAngle)} ponto(s).`
      : psychic
        ? 'Veja o alvo, dê uma pista e esconda-o para os palpites.'
        : 'Discutam a pista e arrastem a agulha até onde acharem que está o alvo.';
    toggleButton.style.display = postGuess ? 'none' : '';
    toggleButton.textContent = psychic ? 'Esconder para os palpites' : 'Revelar alvo';
    skipButton.style.display = psychic ? '' : 'none';
    nextButton.style.display = postGuess ? '' : 'none';
    board.classList.toggle('is-psychic', psychic);
    board.classList.toggle('is-guessing', !psychic && !postGuess);
    board.classList.toggle('is-revealed', postGuess);
  }

  function render() {
    displayClue();
    setTargetArea();
    updateNeedle();
    target.style.display = state.isTargetVisible || state.isPostGuessPhase ? 'block' : 'none';
    needle.style.display = state.isPostGuessPhase || state.isTargetVisible ? 'none' : 'block';
    clue.textContent = state.isPostGuessPhase
      ? `${state.teams[state.currentTeamIndex]?.name || 'Time'} marcou ${calculateScore(state.currentNeedleAngle)} ponto(s).`
      : state.isTargetVisible ? 'Dê uma pista em voz alta.' : 'A pista foi dada. Posicionem a agulha.';
    roundInfo.textContent = state.currentClueIndex >= 0 ? `Pista ${state.currentClueIndex + 1}` : '';
    updateScoreDisplay();
    updateCurrentPhase();
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
    state.teams[state.currentTeamIndex].score += calculateScore(state.currentNeedleAngle);
    render();
    saveGameState();
  }

  function nextRound() {
    state.currentTeamIndex = (state.currentTeamIndex + 1) % state.teams.length;
    state.currentClueIndex = -1;
    state.currentNeedleAngle = 0;
    setPsychicView();
  }

  function resetGame() {
    state.teams.forEach(team => team.score = 0);
    state.currentTeamIndex = 0;
    state.currentClueIndex = -1;
    state.targetAngle = 0;
    state.currentNeedleAngle = 0;
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
  }

  function handleMove(event) {
    if (!isDragging || !canMoveNeedle) return;
    event.preventDefault();
    const point = event.touches?.[0] || event;
    const rect = needle.getBoundingClientRect();
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
    if (!Number.isInteger(state.currentTeamIndex) || state.currentTeamIndex >= state.teams.length) state.currentTeamIndex = 0;
    render();
    if (state.currentClueIndex === -1) showOverlay();
  } else {
    state.teams = [{ name: 'Time 1', score: 0 }, { name: 'Time 2', score: 0 }];
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
