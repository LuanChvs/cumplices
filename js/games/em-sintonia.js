/* =========================================================
   EM SINTONIA
   Mecânica do espectro + modos e configurações do Cúmplices.
========================================================= */

function renderEmSintonia() {
  const root = document.createElement('section');
  root.className = 'em-sintonia';

  const STORAGE_NAME = 'em-sintonia.game';
  const SETTINGS_NAME = 'em-sintonia.settings';

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
    isPostGuessPhase: false,
    lastRoundPoints: 0,
    guessTime: 0,
    guessStartedAt: null,
    themeMode: 'random',
    themeFamily: '',
    customLeft: 'Quente',
    customRight: 'Frio',
    settingsOpen: true
  };

  root.innerHTML = `
    <div id="gameHeader"></div>

    <section class="em-sintonia__setup" data-role="setup">
      <div class="em-sintonia__setup-card">
        <div class="em-sintonia__setup-heading">
          <span>CONFIGURAÇÃO</span>
          <h2>Como vocês vão jogar?</h2>
          <p>Escolha o modo e ajuste as regras antes de começar.</p>
        </div>

        <div class="em-sintonia__setup-section">
          <label class="em-sintonia__setup-label">Modo de jogo</label>
          <div class="em-sintonia__choice-grid" data-role="setup-mode">
            <button type="button" class="em-sintonia__choice" data-setup-mode="teams"><strong>👥 Times</strong><span>O grupo joga em times e a pontuação é coletiva.</span></button>
            <button type="button" class="em-sintonia__choice" data-setup-mode="free"><strong>🧑 Livre</strong><span>Cada jogador dá suas próprias dicas e pontua sozinho.</span></button>
          </div>
        </div>

        <div class="em-sintonia__setup-section">
          <label class="em-sintonia__setup-label" data-role="roster-label">Times</label>
          <div class="em-sintonia__setup-roster" data-role="setup-roster"></div>
          <button type="button" class="em-sintonia__setup-add" data-action="setup-add">+ Adicionar</button>
        </div>

        <div class="em-sintonia__setup-section">
          <label class="em-sintonia__setup-label">Tempo para adivinhar</label>
          <select class="em-sintonia__select" data-role="time-select">
            <option value="0">∞ Infinito</option>
            <option value="15">15 segundos</option>
            <option value="30">30 segundos</option>
            <option value="45">45 segundos</option>
            <option value="60">1 minuto</option>
            <option value="90">1 minuto e 30 segundos</option>
          </select>
        </div>

        <div class="em-sintonia__setup-section">
          <label class="em-sintonia__setup-label">Extremos do espectro</label>
          <div class="em-sintonia__choice-grid em-sintonia__choice-grid--compact">
            <button type="button" class="em-sintonia__choice" data-theme-mode="random"><strong>🎲 Aleatório</strong><span>Qualquer espectro do jogo.</span></button>
            <button type="button" class="em-sintonia__choice" data-theme-mode="family"><strong>🗂️ Por família</strong><span>Escolha uma família de espectros.</span></button>
            <button type="button" class="em-sintonia__choice" data-theme-mode="custom"><strong>✏️ Livre</strong><span>Vocês escrevem os dois extremos.</span></button>
          </div>
          <div class="em-sintonia__family-field" data-role="family-field">
            <select class="em-sintonia__select" data-role="family-select"></select>
          </div>
          <div class="em-sintonia__custom-fields" data-role="custom-fields">
            <input type="text" maxlength="32" data-role="custom-left" placeholder="Ex.: Quente">
            <span>↔</span>
            <input type="text" maxlength="32" data-role="custom-right" placeholder="Ex.: Frio">
          </div>
        </div>

        <button type="button" class="em-sintonia__button em-sintonia__button--primary em-sintonia__start" data-action="start-game">Começar jogo</button>
      </div>
    </section>

    <section class="em-sintonia__game" data-role="game">
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
        <button type="button" class="em-sintonia__edit-extremes" data-action="edit-extremes">✏️ Alterar extremos</button>
        <div class="em-sintonia__custom-editor" data-role="custom-editor">
          <input type="text" maxlength="32" data-role="game-custom-left">
          <span>↔</span>
          <input type="text" maxlength="32" data-role="game-custom-right">
          <button type="button" class="em-sintonia__button" data-action="save-extremes">Salvar</button>
        </div>
      </div>

      <div class="em-sintonia__clue em-sintonia__clue--timer">
        <div class="em-sintonia__timer-bar-track">
          <div class="em-sintonia__timer-bar-fill" data-role="timer-fill"></div>
        </div>
        <strong class="em-sintonia__timer" data-role="timer"></strong>
      </div>
      <div class="em-sintonia__actions">
        <button type="button" class="em-sintonia__button" data-action="toggle">Esconder para os palpites</button>
        <button type="button" class="em-sintonia__button" data-action="skip">Pular pista</button>
        <button type="button" class="em-sintonia__button em-sintonia__button--primary" data-action="next">Próxima rodada</button>
        <button type="button" class="em-sintonia__button" data-action="settings">⚙️ Configurações</button>
        <button type="button" class="em-sintonia__button" data-action="new">Novo jogo</button>
      </div>
      <div class="em-sintonia__round-info" data-role="round-info"></div>
    </section>
  `;

  const gameHeader = root.querySelector('#gameHeader');

  gameHeader.appendChild(
    createGameHeader({
      title: 'Em Sintonia',
      description: 'Uma pista, um espectro e um alvo escondido. Uma pessoa dá a dica, os outros posicionam o marcador e descobrem o quanto estão em sintonia.'
    })
  );

  const $ = role => root.querySelector(`[data-role="${role}"]`);
  const setup = $('setup'), game = $('game'), board = $('board'), target = $('target'), needle = $('needle'), overlay = $('overlay');
  const phase = $('phase'), score = $('score'), timer = $('timer'), timerFill = $('timer-fill');
  const roundTurn = $('round-turn'), mode = $('mode'), leftLabel = $('left-label'), rightLabel = $('right-label'), roundInfo = $('round-info');
  const setupRoster = $('setup-roster'), rosterLabel = $('roster-label'), timeSelect = $('time-select');
  const customFields = $('custom-fields'), customLeft = $('custom-left'), customRight = $('custom-right');
  const familyField = $('family-field'), familySelect = $('family-select');
  const customEditor = $('custom-editor'), gameCustomLeft = $('game-custom-left'), gameCustomRight = $('game-custom-right');
  const toggleButton = root.querySelector('[data-action="toggle"]'), skipButton = root.querySelector('[data-action="skip"]');
  const nextButton = root.querySelector('[data-action="next"]'), newButton = root.querySelector('[data-action="new"]');

  let isDragging = false;
  let canMoveNeedle = false;
  let timerId = null;

  const clampAngle = angle => Math.max(-90, Math.min(90, angle));
  const getCurrentCollection = () => state.mode === 'free' ? state.players : state.teams;
  const getCurrentIndex = () => state.mode === 'free' ? state.currentPlayerIndex : state.currentTeamIndex;
  const getCurrentName = () => getCurrentCollection()[getCurrentIndex()]?.name || (state.mode === 'free' ? 'Jogador' : 'Time');

  function calculateScore(angle) {
    const diff = Math.abs(angle - state.targetAngle);
    if (diff <= 4.5) return 5;
    if (diff <= 13.5) return 3;
    if (diff <= 22.5) return 1;
    return 0;
  }

  function getFamilies() { return window.DATA?.emSintonia?.familias || {}; }
  function getAllCards() { return Object.values(getFamilies()).flatMap(familia => familia.espectros || []); }
  function getAvailableCards() {
    if (state.themeMode === 'family' && getFamilies()[state.themeFamily]) return getFamilies()[state.themeFamily].espectros || [];
    if (state.themeMode === 'custom') return [];
    return getAllCards();
  }

  function saveGameState() {
    storageSet(STORAGE_NAME, {
      mode: state.mode, teams: state.teams, players: state.players,
      currentTeamIndex: state.currentTeamIndex, currentPlayerIndex: state.currentPlayerIndex,
      currentClueIndex: state.currentClueIndex, targetAngle: state.targetAngle,
      currentNeedleAngle: state.currentNeedleAngle, isTargetVisible: state.isTargetVisible,
      isPostGuessPhase: state.isPostGuessPhase, lastRoundPoints: state.lastRoundPoints, guessTime: state.guessTime,
      guessStartedAt: state.guessStartedAt, themeMode: state.themeMode, themeFamily: state.themeFamily,
      customLeft: state.customLeft, customRight: state.customRight
    });
  }

  function saveSettings() {
    storageSet(SETTINGS_NAME, {
      mode: state.mode, guessTime: state.guessTime, themeMode: state.themeMode, themeFamily: state.themeFamily,
      customLeft: state.customLeft, customRight: state.customRight,
      teams: state.teams, players: state.players
    });
  }

  function loadGameState() { return storageGet(STORAGE_NAME, null); }
  function loadSettings() { return storageGet(SETTINGS_NAME, null); }

  function setTargetArea() {
    const a = [
      Math.max(0, Math.min(180, state.targetAngle - 22.5 + 90)),
      Math.max(0, Math.min(180, state.targetAngle - 13.5 + 90)),
      Math.max(0, Math.min(180, state.targetAngle - 4.5 + 90)),
      Math.max(0, Math.min(180, state.targetAngle + 4.5 + 90)),
      Math.max(0, Math.min(180, state.targetAngle + 13.5 + 90)),
      Math.max(0, Math.min(180, state.targetAngle + 22.5 + 90))
    ];
    target.style.background = `conic-gradient(from -90deg at 50% 100%,
      #a4b0be 0deg ${a[0]}deg, #ff6b6b ${a[0]}deg ${a[1]}deg,
      #feca57 ${a[1]}deg ${a[2]}deg, #48dbfb ${a[2]}deg ${a[3]}deg,
      #feca57 ${a[3]}deg ${a[4]}deg, #ff6b6b ${a[4]}deg ${a[5]}deg,
      #a4b0be ${a[5]}deg 180deg)`;
  }

  function updateNeedle() { needle.style.transform = `rotate(${state.currentNeedleAngle}deg)`; }

  function displayClue() {
    if (state.themeMode === 'custom') {
      leftLabel.textContent = state.customLeft;
      rightLabel.textContent = state.customRight;
      return;
    }
    const cards = getAvailableCards();
    if (state.currentClueIndex < 0 || !cards.length) return;
    const [left, right] = cards[state.currentClueIndex];
    leftLabel.textContent = left;
    rightLabel.textContent = right;
  }

  function setRandomClue() {
    if (state.themeMode === 'custom') {
      state.currentClueIndex = 0;
      return;
    }
    const cards = getAvailableCards();
    if (!cards.length) return;
    state.currentClueIndex = Math.floor(Math.random() * cards.length);
  }

  function initializeRound() {
    state.targetAngle = Math.random() * 180 - 90;
    setRandomClue();
    state.currentNeedleAngle = 0;
    state.lastRoundPoints = 0;
    state.isTargetVisible = true;
    state.isPostGuessPhase = false;
    state.guessStartedAt = null;
    stopTimer();
  }

  function formatTime(seconds) {
    if (seconds >= 60) return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    return String(seconds);
  }

  function updateTimer() {
    if (state.guessTime <= 0) {
      timer.textContent = '⏱ ∞';
      timerFill.style.width = '100%';
      timerFill.classList.remove('is-warning');
      return;
    }

    if (state.isTargetVisible || state.isPostGuessPhase || !state.guessStartedAt) {
      timer.textContent = state.isTargetVisible ? `⏱ ${formatTime(state.guessTime)}` : '';
      timerFill.style.width = '100%';
      timerFill.classList.remove('is-warning');
      return;
    }
    const elapsedMs = Date.now() - state.guessStartedAt;
    const elapsed = elapsedMs / 1000;
    const remaining = Math.max(0, state.guessTime - elapsed);
    const displayRemaining = Math.max(0, Math.ceil(remaining));
    timer.textContent = `⏱ ${formatTime(displayRemaining)}`;
    const percent = Math.max(0, Math.min(100, (remaining / state.guessTime) * 100));
    timerFill.style.width = `${percent}%`;
    timerFill.classList.toggle('is-warning', remaining <= 10);
    if (remaining <= 0) {
      stopTimer();
      revealTarget(true);
    }
  }

  function startTimer() {
    stopTimer();
    if (state.guessTime <= 0) { timer.textContent = '⏱ ∞'; return; }
    state.guessStartedAt = Date.now();
    updateTimer();
    timerId = setInterval(updateTimer, 250);
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
    timer.classList.remove('is-warning');
    timerFill.classList.remove('is-warning');
  }

  function escapeHtml(value) {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }

  function updateModeDisplay() {
    mode.innerHTML = `<div class="em-sintonia__mode-switch"><span class="em-sintonia__mode-current">${state.mode === 'free' ? '🧑 Livre' : '👥 Times'}</span></div>`;
  }

  function renderRosterEditor() {
    const collection = state.mode === 'free' ? state.players : state.teams;
    rosterLabel.textContent = state.mode === 'free' ? 'Jogadores' : 'Times';
    setupRoster.innerHTML = collection.map((item, index) => `
      <div class="em-sintonia__setup-player">
        <input type="text" maxlength="24" value="${escapeHtml(item.name)}" data-roster-name="${index}">
        <button type="button" data-roster-delete="${index}" ${collection.length === 1 ? 'disabled' : ''}>🗑️</button>
      </div>`).join('');
    setupRoster.querySelectorAll('[data-roster-name]').forEach(input => {
      input.addEventListener('change', () => {
        collection[Number(input.dataset.rosterName)].name = input.value.trim() || (state.mode === 'free' ? 'Jogador' : 'Time');
        saveSettings();
      });
    });
    setupRoster.querySelectorAll('[data-roster-delete]').forEach(button => {
      button.addEventListener('click', () => {
        if (collection.length <= 1) return;
        collection.splice(Number(button.dataset.rosterDelete), 1);
        if (state.currentPlayerIndex >= state.players.length) state.currentPlayerIndex = 0;
        if (state.currentTeamIndex >= state.teams.length) state.currentTeamIndex = 0;
        renderRosterEditor();
        saveSettings();
      });
    });
  }

  function updateSetup() {
    setup.querySelectorAll('[data-setup-mode]').forEach(button => button.classList.toggle('is-selected', button.dataset.setupMode === state.mode));
    setup.querySelectorAll('[data-theme-mode]').forEach(button => button.classList.toggle('is-selected', button.dataset.themeMode === state.themeMode));
    timeSelect.value = String(state.guessTime);
    customLeft.value = state.customLeft;
    customRight.value = state.customRight;
    const families = getFamilies();
    familySelect.innerHTML = Object.entries(families).map(([key, family]) => `<option value="${key}">${family.nome}</option>`).join('');
    if (!state.themeFamily || !families[state.themeFamily]) state.themeFamily = Object.keys(families)[0] || '';
    familySelect.value = state.themeFamily;
    familyField.classList.toggle('is-visible', state.themeMode === 'family');
    customFields.classList.toggle('is-visible', state.themeMode === 'custom');
    renderRosterEditor();
  }

  function updateScoreDisplay() {
    const collection = getCurrentCollection();
    score.innerHTML = `
      <div class="em-sintonia__score-management">Toque no nome para editar.</div>
      ${collection.map((item, index) => `
        <div class="em-sintonia__score-team ${index === getCurrentIndex() ? 'is-active' : ''}">
          <button type="button" class="em-sintonia__team-name" data-edit-roster="${index}">${escapeHtml(item.name)} <span>✏️</span></button>
          <strong>${item.score}</strong>
          <button type="button" class="em-sintonia__team-delete" data-delete-roster="${index}" ${collection.length === 1 ? 'disabled' : ''}>🗑️</button>
        </div>`).join('')}
      <button type="button" class="em-sintonia__add-team" data-add-roster>+ Adicionar ${state.mode === 'free' ? 'jogador' : 'time'}</button>`;

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
          updateScoreDisplay(); updateCurrentPhase(); updateRoundTurn(); saveSettings(); saveGameState();
        };
        input.addEventListener('blur', finish, { once: true });
        input.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === 'Escape') input.blur(); });
      });
    });

    score.querySelectorAll('[data-delete-roster]').forEach(button => {
      button.addEventListener('click', () => {
        if (collection.length <= 1) return;
        collection.splice(Number(button.dataset.deleteRoster), 1);
        if (state.mode === 'free' && state.currentPlayerIndex >= collection.length) state.currentPlayerIndex = 0;
        if (state.mode === 'teams' && state.currentTeamIndex >= collection.length) state.currentTeamIndex = 0;
        updateScoreDisplay(); updateCurrentPhase(); updateRoundTurn(); saveSettings(); saveGameState();
      });
    });

    score.querySelector('[data-add-roster]')?.addEventListener('click', () => {
      collection.push({ name: `${state.mode === 'free' ? 'Jogador' : 'Time'} ${collection.length + 1}`, score: 0 });
      updateScoreDisplay(); updateSetup(); saveSettings(); saveGameState();
    });
  }

  function updateCurrentPhase() {
    const postGuess = state.isPostGuessPhase;
    const psychic = state.isTargetVisible && !postGuess;
    const currentName = getCurrentName();
    phase.textContent = postGuess ? '🏆 Alvo revelado' : psychic ? '🔮 Dica' : '🎯 Palpite';
    toggleButton.style.display = postGuess ? 'none' : '';
    toggleButton.textContent = psychic ? 'Esconder para os palpites' : 'Revelar alvo';
    skipButton.style.display = psychic ? '' : 'none';
    nextButton.style.display = postGuess ? '' : 'none';
    board.classList.toggle('is-psychic', psychic);
    board.classList.toggle('is-guessing', !psychic && !postGuess);
    board.classList.toggle('is-revealed', postGuess);
    updateTimer();
  }

  function updateRoundTurn() {
    const role = state.isPostGuessPhase ? 'Resultado da rodada' : state.isTargetVisible ? 'Quem dá a dica' : 'Quem adivinha';
    roundTurn.innerHTML = `<strong>Rodada de ${escapeHtml(getCurrentName())}</strong><span>${role}</span>`;
  }

  function render() {
    displayClue(); setTargetArea(); updateNeedle();
    target.style.display = state.isTargetVisible || state.isPostGuessPhase ? 'block' : 'none';
    needle.style.display = state.isPostGuessPhase || state.isTargetVisible ? 'none' : 'block';
    roundInfo.textContent = state.currentClueIndex >= 0 ? `Pista ${state.currentClueIndex + 1}` : '';
    updateModeDisplay(); updateScoreDisplay(); updateCurrentPhase(); updateRoundTurn();
    root.classList.toggle('is-settings', state.settingsOpen);
    setup.style.display = state.settingsOpen ? 'block' : 'none';
    game.style.display = state.settingsOpen ? 'none' : 'block';
    customEditor.classList.toggle('is-visible', false);
    root.querySelector('[data-action="edit-extremes"]').style.display = state.themeMode === 'custom' ? '' : 'none';
  }

  function setPsychicView() {
    canMoveNeedle = false;
    state.isPostGuessPhase = false;
    state.isTargetVisible = true;
    state.currentNeedleAngle = 0;
    state.guessStartedAt = null;
    stopTimer();
    render(); saveGameState();
  }

  function setGuesserView() {
    canMoveNeedle = true;
    state.isPostGuessPhase = false;
    state.isTargetVisible = false;
    state.currentNeedleAngle = 0;
    startTimer();
    render(); saveGameState();
  }

  function revealTarget(timedOut = false) {
    if (state.isPostGuessPhase) return;
    stopTimer();
    canMoveNeedle = false;
    state.isTargetVisible = true;
    state.isPostGuessPhase = true;
    const points = calculateScore(state.currentNeedleAngle);
    state.lastRoundPoints = points;
    const collection = getCurrentCollection();
    if (collection[getCurrentIndex()]) collection[getCurrentIndex()].score += points;
    render(); saveGameState();
  }

  function nextRound() {
    if (state.mode === 'free') state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    else state.currentTeamIndex = (state.currentTeamIndex + 1) % state.teams.length;
    initializeRound();
    setPsychicView();
  }

  function resetGame() {
    state.teams.forEach(team => team.score = 0);
    state.players.forEach(player => player.score = 0);
    state.currentTeamIndex = 0; state.currentPlayerIndex = 0;
    initializeRound();
    state.settingsOpen = false;
    overlay.classList.add('is-active');
    render(); saveGameState(); saveSettings();
  }

  function applySettings(startNew = true) {
    state.guessTime = Math.max(0, Number(timeSelect.value) || 0);
    state.themeMode = root.querySelector('[data-theme-mode].is-selected')?.dataset.themeMode || state.themeMode;
    state.themeFamily = familySelect.value || state.themeFamily;
    state.customLeft = customLeft.value.trim() || 'Quente';
    state.customRight = customRight.value.trim() || 'Frio';
    if (state.themeMode === 'custom' && (!state.customLeft || !state.customRight)) return;
    state.settingsOpen = false;
    saveSettings();
    if (startNew) {
      state.currentTeamIndex = 0; state.currentPlayerIndex = 0;
      initializeRound();
      render();
      showOverlay();
      saveGameState();
    } else {
      render();
    }
  }

  function switchSetupMode(nextMode) {
    if (nextMode !== 'teams' && nextMode !== 'free') return;
    if (state.mode === nextMode) return;
    state.mode = nextMode;
    state.currentTeamIndex = 0; state.currentPlayerIndex = 0;
    updateSetup(); saveSettings();
  }

  function showSetup() {
    stopTimer();
    state.settingsOpen = true;
    updateSetup();
    render();
  }

  function showOverlay() {
    overlay.classList.add('is-active');
    canMoveNeedle = false;
  }

  function hideOverlay() {
    overlay.classList.remove('is-active');
    if (state.currentClueIndex === -1) {
      initializeRound();
      setPsychicView();
    }
  }

  function openCustomEditor() {
    gameCustomLeft.value = state.customLeft;
    gameCustomRight.value = state.customRight;
    customEditor.classList.add('is-visible');
    gameCustomLeft.focus();
  }

  function saveCustomEditor() {
    state.customLeft = gameCustomLeft.value.trim() || 'Quente';
    state.customRight = gameCustomRight.value.trim() || 'Frio';
    customEditor.classList.remove('is-visible');
    displayClue(); saveSettings(); saveGameState();
  }

  function handleStart(event) {
    if (!canMoveNeedle) return;
    isDragging = true; event.preventDefault(); handleMove(event);
  }

  function handleMove(event) {
    if (!isDragging || !canMoveNeedle) return;
    event.preventDefault();
    const point = event.touches?.[0] || event;
    const rect = board.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2, centerY = rect.bottom;
    state.currentNeedleAngle = clampAngle(Math.atan2(point.clientX - centerX, centerY - point.clientY) * 180 / Math.PI);
    updateNeedle();
  }

  function handleEnd() { isDragging = false; saveGameState(); }

  root.querySelectorAll('[data-setup-mode]').forEach(button => button.addEventListener('click', () => switchSetupMode(button.dataset.setupMode)));
  root.querySelectorAll('[data-theme-mode]').forEach(button => button.addEventListener('click', () => {
    state.themeMode = button.dataset.themeMode;
    updateSetup();
    saveSettings();
  }));
  familySelect.addEventListener('change', () => {
    state.themeFamily = familySelect.value;
    saveSettings();
  });
  root.querySelector('[data-action="setup-add"]').addEventListener('click', () => {
    const collection = state.mode === 'free' ? state.players : state.teams;
    collection.push({ name: `${state.mode === 'free' ? 'Jogador' : 'Time'} ${collection.length + 1}`, score: 0 });
    renderRosterEditor(); saveSettings();
  });
  timeSelect.addEventListener('change', () => { state.guessTime = Number(timeSelect.value) || 0; saveSettings(); });
  customLeft.addEventListener('input', () => { state.customLeft = customLeft.value; saveSettings(); });
  customRight.addEventListener('input', () => { state.customRight = customRight.value; saveSettings(); });

  root.querySelector('[data-action="start-game"]').addEventListener('click', () => applySettings(true));
  root.querySelector('[data-action="settings"]').addEventListener('click', showSetup);
  root.querySelector('[data-action="edit-extremes"]').addEventListener('click', openCustomEditor);
  root.querySelector('[data-action="save-extremes"]').addEventListener('click', saveCustomEditor);
  toggleButton.addEventListener('click', () => {
    if (state.isTargetVisible && !state.isPostGuessPhase) setGuesserView();
    else if (!state.isPostGuessPhase) revealTarget(false);
  });
  skipButton.addEventListener('click', () => { initializeRound(); render(); saveGameState(); });
  nextButton.addEventListener('click', nextRound);
  newButton.addEventListener('click', resetGame);
  overlay.addEventListener('click', hideOverlay);

  board.addEventListener('mousedown', handleStart);
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleEnd);
  board.addEventListener('touchstart', handleStart, { passive: false });
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('touchend', handleEnd);

  const savedSettings = loadSettings();
  if (savedSettings) {
    Object.assign(state, savedSettings);
    state.themeFamily = savedSettings.themeFamily || '';
    state.teams = Array.isArray(savedSettings.teams) && savedSettings.teams.length ? savedSettings.teams : [{ name: 'Time 1', score: 0 }, { name: 'Time 2', score: 0 }];
    state.players = Array.isArray(savedSettings.players) && savedSettings.players.length ? savedSettings.players : [{ name: 'Jogador 1', score: 0 }, { name: 'Jogador 2', score: 0 }];
  } else {
    state.teams = [{ name: 'Time 1', score: 0 }, { name: 'Time 2', score: 0 }];
    state.players = [{ name: 'Jogador 1', score: 0 }, { name: 'Jogador 2', score: 0 }];
  }

  const saved = loadGameState();
  if (saved) {
    Object.assign(state, saved);
    state.themeFamily = saved.themeFamily || state.themeFamily || '';
    state.teams = Array.isArray(state.teams) && state.teams.length ? state.teams : [{ name: 'Time 1', score: 0 }, { name: 'Time 2', score: 0 }];
    state.players = Array.isArray(state.players) && state.players.length ? state.players : [{ name: 'Jogador 1', score: 0 }, { name: 'Jogador 2', score: 0 }];
  }

  state.settingsOpen = true;
  updateSetup();
  render();

  if (saved && !saved.isTargetVisible && !saved.isPostGuessPhase) {
    state.settingsOpen = false;
    render();
    canMoveNeedle = true;
    startTimer();
  }

  root.cleanup = () => {
    stopTimer();
    board.removeEventListener('mousedown', handleStart);
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    board.removeEventListener('touchstart', handleStart);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('touchend', handleEnd);
    saveGameState();
    saveSettings();
  };

  return root;
}
