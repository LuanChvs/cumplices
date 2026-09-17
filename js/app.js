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