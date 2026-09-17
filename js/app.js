/* =========================================================
   APP — INICIALIZAÇÃO
========================================================= */

const settingsToggle =
  document.getElementById('settingsToggle');

const settingsClose =
  document.getElementById('settingsClose');

const settingsDrawer =
  document.getElementById('settingsDrawer');

const settingsOverlay =
  document.getElementById('settingsOverlay');

const soundSetting =
  document.getElementById('soundSetting');

const soundSettingTitle =
  document.getElementById('soundSettingTitle');

const soundSettingDescription =
  document.getElementById('soundSettingDescription');

const soundSwitch =
  document.getElementById('soundSwitch');

const resenhaSetting =
  document.getElementById('resenhaSetting');

const resenhaSettingTitle =
  document.getElementById('resenhaSettingTitle');

const resenhaSettingDescription =
  document.getElementById('resenhaSettingDescription');

const resenhaSwitch =
  document.getElementById('resenhaSwitch');

const brandMode =
  document.getElementById('brandMode');

const themeOptions =
  document.querySelectorAll('[data-theme-choice]');


/* =========================================================
   MODO JOGO — CONFIGURAÇÃO
========================================================= */

const gameModeSetting = document.createElement('section');

gameModeSetting.className = 'settings-section';
gameModeSetting.id = 'gameModeSettingSection';

gameModeSetting.innerHTML = `
  <div class="settings-label">
    <strong>Modo jogo</strong>
    <span>Ajusta os jogos para ocupar melhor a tela durante a partida.</span>
  </div>

  <button
    type="button"
    class="settings-switch-row"
    id="gameModeSetting"
  >
    <span>
      <strong id="gameModeSettingTitle">
        Modo jogo desligado
      </strong>

      <small id="gameModeSettingDescription">
        Ative para usar o layout compacto em telas horizontais maiores
      </small>
    </span>

    <span
      class="settings-switch"
      id="gameModeSwitch"
      aria-hidden="true"
    >
      <span></span>
    </span>
  </button>
`;

const settingsBody =
  document.querySelector('.settings-body');

if (settingsBody && resenhaSetting) {
  const resenhaSection =
    resenhaSetting.closest('.settings-section');

  if (resenhaSection) {
    resenhaSection.after(gameModeSetting);
  } else {
    settingsBody.appendChild(gameModeSetting);
  }
}

const gameModeSettingButton =
  document.getElementById('gameModeSetting');

const gameModeSettingTitle =
  document.getElementById('gameModeSettingTitle');

const gameModeSettingDescription =
  document.getElementById('gameModeSettingDescription');

const gameModeSwitch =
  document.getElementById('gameModeSwitch');

const gameModeMediaQuery =
  window.matchMedia('(orientation: landscape)');

function isGameModeHorizontal() {
  return gameModeMediaQuery.matches;
}

function isSmallHorizontalViewport() {
  return (
    isGameModeHorizontal() &&
    window.innerWidth <= 899
  );
}

function updateGameModeLayout() {
  const body = document.body;
  const horizontal = isGameModeHorizontal();
  const compact =
    body.classList.contains('game-mode') &&
    horizontal &&
    (isSmallHorizontalViewport() || preferences.gameMode);

  body.classList.toggle(
    'game-mode-compact',
    compact
  );

  if (gameModeSetting) {
    gameModeSetting.style.display =
      horizontal ? '' : 'none';
  }
}

function updateGameModeSetting() {
  const enabled =
    preferences.gameMode;

  gameModeSettingTitle.textContent =
    enabled
      ? 'Modo jogo ligado'
      : 'Modo jogo desligado';

  gameModeSettingDescription.textContent =
    enabled
      ? 'Layout compacto ativado em aparelhos horizontais maiores'
      : 'Ative para usar o layout compacto em aparelhos horizontais maiores';

  gameModeSwitch.classList.toggle(
    'active',
    enabled
  );

  gameModeSettingButton.setAttribute(
    'aria-pressed',
    String(enabled)
  );

  updateGameModeLayout();
}

if (gameModeSettingButton) {
  gameModeSettingButton.addEventListener(
    'click',
    () => {
      sound.click();

      setGameModePreference(
        !preferences.gameMode
      );

      updateGameModeSetting();
    }
  );
}

window.addEventListener(
  'resize',
  updateGameModeLayout
);

window.addEventListener(
  'orientationchange',
  updateGameModeLayout
);

const gameModeObserver =
  new MutationObserver(updateGameModeLayout);

gameModeObserver.observe(
  document.body,
  {
    attributes: true,
    attributeFilter: ['class']
  }
);


/* =========================================================
   COMPATIBILIDADE DO QUEM SOU EU
   Compacto automático em landscape pequeno.
   Em landscape grande, depende da preferência.
========================================================= */

const gameModeResponsiveStyle =
  document.createElement('style');

gameModeResponsiveStyle.textContent = `
  @media (max-width: 899px) and (orientation: portrait) {
    body.game-mode:has(.whoami-round-screen),
    body.game-mode:has(.whoami-result-screen) {
      overflow: auto;
    }

    body.game-mode:has(.whoami-round-screen) main,
    body.game-mode:has(.whoami-result-screen) main {
      height: auto;
      min-height: 0;
      max-height: none;
      padding-bottom: 64px;
      overflow: visible;
    }

    body.game-mode:has(.whoami-round-screen) #view,
    body.game-mode:has(.whoami-result-screen) #view {
      height: auto;
      min-height: 0;
      max-height: none;
      overflow: visible;
    }

    body.game-mode .whoami-round-screen {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      width: 100%;
      height: auto;
      min-height: 100svh;
      max-height: none;
      margin: 0;
      padding:
        max(20px, env(safe-area-inset-top))
        max(18px, env(safe-area-inset-right))
        max(20px, env(safe-area-inset-bottom))
        max(18px, env(safe-area-inset-left));
      overflow: visible;
    }

    body.game-mode .whoami-round-top {
      gap: 12px;
    }

    body.game-mode .whoami-round-label {
      font-size: .82rem;
    }

    body.game-mode .whoami-round-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: min(100%, 980px);
      min-width: 0;
      min-height: 0;
      margin: 0 auto;
      padding: 0;
      overflow: visible;
    }

    body.game-mode .whoami-round-kicker {
      margin-bottom: 12px;
      font-size: .78rem;
      line-height: normal;
    }

    body.game-mode .whoami-name {
      width: auto;
      max-width: 100%;
      min-width: 0;
      margin: 0;
      font-size: clamp(4rem, 16vw, 12rem);
      line-height: 1.02;
      overflow-wrap: normal;
      word-break: normal;
    }

    body.game-mode .whoami-timer-wrap {
      width: min(100%, 580px);
      margin-top: clamp(32px, 7vh, 60px);
    }

    body.game-mode .whoami-timer {
      font-size: clamp(2rem, 6vw, 3.4rem);
      letter-spacing: .04em;
    }

    body.game-mode .whoami-timer-track {
      height: 9px;
      margin-top: 12px;
    }

    body.game-mode .whoami-round-actions {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      align-items: stretch !important;
      gap: 12px;
      width: min(100%, 760px);
      min-width: 0;
      margin: 0 auto;
    }

    body.game-mode .whoami-round-actions > * {
      flex: 1 1 0 !important;
      min-width: 0 !important;
      width: auto !important;
      max-width: none !important;
    }

    body.game-mode .whoami-action-btn,
    body.game-mode .whoami-add-time {
      min-height: 76px;
      height: auto;
      padding: 12px 20px;
      border-radius: 100px;
    }

    body.game-mode .whoami-action-btn {
      font-size: 1.05rem;
    }

    body.game-mode .whoami-action-btn span {
      display: inline;
      margin: 0 .35em 0 0;
      font-size: 1em;
      line-height: 1;
    }

    body.game-mode .whoami-add-time {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: .9rem;
    }

    body.game-mode .whoami-result-screen {
      box-sizing: border-box;
      width: 100%;
      height: auto;
      min-height: calc(100svh - 30px);
      max-height: none;
      margin: 0;
      padding: 24px;
      overflow: visible;
    }

    body.game-mode .whoami-result-card {
      width: min(100%, 560px);
      max-height: none;
      padding: clamp(26px, 6vw, 42px);
      overflow: visible;
    }

    body.game-mode .whoami-result-icon {
      margin-bottom: 14px;
      font-size: 3.2rem;
    }

    body.game-mode .whoami-result-card h2 {
      font-size: clamp(1.8rem, 5vw, 2.5rem);
    }

    body.game-mode .whoami-result-card > p:not(.whoami-kicker) {
      margin-top: 8px;
      font-size: 1rem;
    }

    body.game-mode .whoami-result-answer {
      margin: 24px 0;
      padding: 16px;
    }

    body.game-mode .whoami-result-answer strong {
      font-size: 1.3rem;
    }
  }

  @media (min-width: 900px) and (orientation: landscape) {
    body.game-mode.game-mode-compact:has(.whoami-round-screen) main,
    body.game-mode.game-mode-compact:has(.whoami-result-screen) main {
      padding-bottom: 0;
      height: 100svh;
      min-height: 100svh;
      max-height: 100svh;
    }

    body.game-mode.game-mode-compact:has(.whoami-round-screen) #view,
    body.game-mode.game-mode-compact:has(.whoami-result-screen) #view {
      height: 100svh;
      min-height: 100svh;
      max-height: 100svh;
      overflow: visible;
    }

    body.game-mode.game-mode-compact .whoami-round-screen {
      box-sizing: border-box;
      width: 100%;
      height: 100svh;
      min-height: 100svh;
      max-height: 100svh;
      margin: 0;
      padding:
        max(8px, env(safe-area-inset-top))
        max(12px, env(safe-area-inset-right))
        max(8px, env(safe-area-inset-bottom))
        max(12px, env(safe-area-inset-left));
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      grid-template-rows: auto minmax(0, 1fr) auto;
      grid-template-areas:
        'top top'
        'main main'
        'action add';
      gap: 0;
    }

    body.game-mode.game-mode-compact .whoami-round-top {
      grid-area: top;
      min-height: 0;
      gap: 8px;
    }

    body.game-mode.game-mode-compact .whoami-round-label {
      font-size: clamp(.62rem, 1vw, .82rem);
    }

    body.game-mode.game-mode-compact .whoami-round-main {
      grid-area: main;
      width: 100%;
      min-width: 0;
      min-height: 0;
      padding: 0 clamp(8px, 2vw, 28px);
      overflow: visible;
    }

    body.game-mode.game-mode-compact .whoami-round-kicker {
      margin-bottom: clamp(4px, 1.2vh, 10px);
      font-size: clamp(.58rem, 1.1vh, .74rem);
      line-height: 1;
    }

    body.game-mode.game-mode-compact .whoami-name {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      font-size: clamp(3rem, min(10vw, 18vh), 9rem);
      line-height: .92;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    body.game-mode.game-mode-compact .whoami-timer-wrap {
      width: min(88%, 700px);
      margin-top: clamp(12px, 3vh, 30px);
    }

    body.game-mode.game-mode-compact .whoami-timer {
      font-size: clamp(1.4rem, min(4vw, 5vh), 2.8rem);
      line-height: 1;
    }

    body.game-mode.game-mode-compact .whoami-timer-track {
      height: clamp(4px, .8vh, 8px);
      margin-top: clamp(5px, 1vh, 10px);
    }

    body.game-mode.game-mode-compact .whoami-round-actions {
      grid-area: action;
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      align-items: stretch !important;
      gap: clamp(8px, 1.2vw, 14px);
      width: 100%;
      min-width: 0;
      margin: 0;
    }

    body.game-mode.game-mode-compact .whoami-round-actions > * {
      flex: 1 1 0 !important;
      min-width: 0 !important;
      width: auto !important;
      max-width: none !important;
    }

    body.game-mode.game-mode-compact .whoami-action-btn,
    body.game-mode.game-mode-compact .whoami-add-time {
      min-height: 0;
      height: clamp(42px, 7vh, 58px);
      padding: 4px 14px;
      border-radius: 100px;
      line-height: 1;
    }

    body.game-mode.game-mode-compact .whoami-action-btn {
      font-size: clamp(.74rem, 1.4vw, .95rem);
    }

    body.game-mode.game-mode-compact .whoami-action-btn span {
      display: inline;
      margin: 0 .35em 0 0;
      font-size: 1em;
      line-height: 1;
    }

    body.game-mode.game-mode-compact .whoami-add-time {
      grid-area: add;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: clamp(.66rem, 1.2vw, .84rem);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    body.game-mode.game-mode-compact .whoami-result-screen {
      box-sizing: border-box;
      width: 100%;
      height: 100svh;
      min-height: 100svh;
      max-height: 100svh;
      margin: 0;
      padding: 18px;
      overflow: visible;
    }

    body.game-mode.game-mode-compact .whoami-result-card {
      width: min(100%, 560px);
      max-height: calc(100svh - 36px);
      padding: clamp(18px, 3vh, 32px);
      overflow: auto;
    }

    body.game-mode.game-mode-compact .whoami-result-icon {
      margin-bottom: clamp(6px, 1vh, 12px);
      font-size: clamp(1.8rem, 5vh, 3rem);
    }

    body.game-mode.game-mode-compact .whoami-result-card h2 {
      font-size: clamp(1.4rem, 3vw, 2.5rem);
    }

    body.game-mode.game-mode-compact .whoami-result-card > p:not(.whoami-kicker) {
      margin-top: 5px;
      font-size: clamp(.78rem, 1.3vw, .95rem);
    }

    body.game-mode.game-mode-compact .whoami-result-answer {
      margin: clamp(10px, 2vh, 20px) 0;
      padding: clamp(10px, 1.6vh, 16px);
    }

    body.game-mode.game-mode-compact .whoami-result-answer strong {
      font-size: clamp(1rem, 2.4vw, 1.35rem);
    }
  }
`;

document.head.appendChild(
  gameModeResponsiveStyle
);


/* =========================================================
   DRAWER
========================================================= */

function openSettings() {

  /*
    Se estiver em modo jogo com a navegação
    aberta, recolhe antes de mostrar o painel.
  */

  if (
    typeof closeGameNavigation ===
    'function'
  ) {
    closeGameNavigation();
  }

  document.body.classList.add(
    'settings-open'
  );

  settingsDrawer.classList.add('open');
  settingsOverlay.classList.add('open');

  settingsDrawer.setAttribute(
    'aria-hidden',
    'false'
  );

  settingsOverlay.setAttribute(
    'aria-hidden',
    'false'
  );
}

function closeSettings() {

  document.body.classList.remove(
    'settings-open'
  );

  settingsDrawer.classList.remove('open');
  settingsOverlay.classList.remove('open');

  settingsDrawer.setAttribute(
    'aria-hidden',
    'true'
  );

  settingsOverlay.setAttribute(
    'aria-hidden',
    'true'
  );
}

settingsToggle.addEventListener(
  'click',
  () => {
    sound.click();
    openSettings();
  }
);

settingsClose.addEventListener(
  'click',
  () => {
    sound.click();
    closeSettings();
  }
);

settingsOverlay.addEventListener(
  'click',
  closeSettings
);

document.addEventListener(
  'keydown',
  (event) => {
    if (
      event.key === 'Escape' &&
      settingsDrawer.classList.contains('open')
    ) {
      closeSettings();
    }
  }
);


/* =========================================================
   TEMA
========================================================= */

function updateThemeOptions() {
  themeOptions.forEach(
    (option) => {
      const isActive =
        option.dataset.themeChoice ===
        preferences.theme;

      option.classList.toggle(
        'active',
        isActive
      );

      option.setAttribute(
        'aria-pressed',
        String(isActive)
      );
    }
  );
}

themeOptions.forEach(
  (option) => {
    option.addEventListener(
      'click',
      () => {
        sound.click();

        setTheme(
          option.dataset.themeChoice
        );

        updateThemeOptions();
      }
    );
  }
);


/* =========================================================
   SOM
========================================================= */

function updateSoundSetting() {
  const enabled = preferences.sound;

  soundSettingTitle.textContent =
    enabled
      ? 'Sons ligados'
      : 'Sons desligados';

  soundSettingDescription.textContent =
    enabled
      ? 'Efeitos sonoros ativados'
      : 'Efeitos sonoros desativados';

  soundSwitch.classList.toggle(
    'active',
    enabled
  );

  soundSetting.setAttribute(
    'aria-pressed',
    String(enabled)
  );
}

soundSetting.addEventListener(
  'click',
  () => {
    sound.toggle();

    preferences.sound = sound.enabled;
    savePreferences();

    updateSoundSetting();
  }
);


/* =========================================================
   MODO RESENHA
========================================================= */

function updateResenhaSetting() {
  const enabled =
    preferences.resenha;

  resenhaSettingTitle.textContent =
    enabled
      ? '🍺 Modo Resenha ligado'
      : '🍺 Modo Resenha desligado';

  resenhaSettingDescription.textContent =
    enabled
      ? 'Conteúdo adaptado para amigos'
      : 'Conteúdos para casais continuam disponíveis';

  resenhaSwitch.classList.toggle(
    'active',
    enabled
  );

  resenhaSetting.setAttribute(
    'aria-pressed',
    String(enabled)
  );

  brandMode.style.display =
    enabled
      ? 'inline-block'
      : 'none';

  brandMode.style.marginLeft = '6px';
  brandMode.style.color = 'var(--rose)';
  brandMode.style.fontFamily = 'var(--font-b)';
  brandMode.style.fontSize = '.54rem';
  brandMode.style.fontStyle = 'italic';
  brandMode.style.fontWeight = '600';
  brandMode.style.letterSpacing = '.02em';
  brandMode.style.lineHeight = '1';
  brandMode.style.opacity = '.72';
  brandMode.style.verticalAlign = 'baseline';
}

resenhaSetting.addEventListener(
  'click',
  () => {
    sound.click();

    setResenha(
      !preferences.resenha
    );

    updateResenhaSetting();
  }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

preferences.sound =
  sound.enabled;

savePreferences();

updateThemeOptions();
updateSoundSetting();
updateResenhaSetting();
updateGameModeSetting();