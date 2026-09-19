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

const soundOptions =
  document.querySelectorAll('[data-sound-choice]');

const soundDetailsToggle =
  document.getElementById('soundDetailsToggle');

const soundDetailsOptions =
  document.getElementById('soundOptions');

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
    <span>Recolhe a barra superior para liberar mais espaço durante a partida.</span>
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
        Disponível para ativar em telas horizontais maiores
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

function updateGameModeSettingVisibility() {
  if (!gameModeSetting) return;

  gameModeSetting.style.display =
    gameModeMediaQuery.matches ? '' : 'none';
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
      ? 'O modo jogo está ativo em telas horizontais'
      : 'Ative para usar o modo jogo em telas horizontais maiores';

  gameModeSwitch.classList.toggle(
    'active',
    enabled
  );

  gameModeSettingButton.setAttribute(
    'aria-pressed',
    String(enabled)
  );

  updateGameModeSettingVisibility();
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
      syncGameMode();
    }
  );
}

window.addEventListener(
  'resize',
  updateGameModeSettingVisibility
);

window.addEventListener(
  'orientationchange',
  updateGameModeSettingVisibility
);


/* =========================================================
   MODO JOGO — COMPORTAMENTO DESKTOP HORIZONTAL
========================================================= */

const desktopGameModeStyle =
  document.createElement('style');

desktopGameModeStyle.textContent = `
  @media (min-width: 900px) and (orientation: landscape) {
    body.game-mode main {
      padding-bottom: 0;
    }

    body.game-mode .topbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 900;
      transform: translateY(-100%);
      opacity: 0;
      pointer-events: none;
      transition:
        transform .22s ease,
        opacity .22s ease;
    }

    body.game-mode.game-nav-open .topbar {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
      background:
        color-mix(
          in srgb,
          var(--bg) 82%,
          transparent
        );
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    body.game-mode .game-nav-toggle {
      position: fixed;
      top: 8px;
      right: 10px;
      z-index: 950;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: 1px solid var(--line);
      border-radius: 10px;
      background:
        color-mix(
          in srgb,
          var(--panel) 72%,
          transparent
        );
      color: var(--text-dim);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      cursor: pointer;
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
      transition:
        background .2s ease,
        border-color .2s ease,
        color .2s ease,
        opacity .2s ease,
        transform .2s ease;
    }

    body.game-mode.game-nav-open .game-nav-toggle {
      opacity: 0;
      pointer-events: none;
      transform: translateY(-6px);
    }

    body.game-mode .game-nav-toggle span {
      position: relative;
      display: block;
      width: 9px;
      height: 9px;
      margin-top: -4px;
      font-size: 0;
      line-height: 0;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: rotate(45deg);
    }

    @media (hover: hover) and (pointer: fine) {
      body.game-mode .game-nav-toggle:hover {
        border-color: var(--line-strong);
        background: var(--panel-2);
        color: var(--text);
      }
    }
  }
`;

document.head.appendChild(
  desktopGameModeStyle
);


/* =========================================================
   DRAWER
========================================================= */

let settingsReturnFocus = null;
let settingsScrollY = 0;
let soundDetailsOpen = false;
let soundDetailsAnimationTimer = null;

function setSoundDetailsOpen(open) {
  soundDetailsOpen = Boolean(open);

  if (soundDetailsAnimationTimer) {
    clearTimeout(soundDetailsAnimationTimer);
    soundDetailsAnimationTimer = null;
  }

  if (soundDetailsToggle) {
    soundDetailsToggle.setAttribute(
      'aria-expanded',
      String(soundDetailsOpen)
    );
  }

  if (!soundDetailsOptions) {
    return;
  }

  const reducedMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

  if (soundDetailsOpen) {
    soundDetailsOptions.hidden = false;

    if (reducedMotion) {
      soundDetailsOptions.classList.add('is-open');
      return;
    }

    window.requestAnimationFrame(() => {
      if (soundDetailsOpen) {
        soundDetailsOptions.classList.add('is-open');
      }
    });

    return;
  }

  soundDetailsOptions.classList.remove('is-open');

  if (reducedMotion) {
    soundDetailsOptions.hidden = true;
    return;
  }

  soundDetailsAnimationTimer = setTimeout(() => {
    soundDetailsAnimationTimer = null;

    if (!soundDetailsOpen) {
      soundDetailsOptions.hidden = true;
    }
  }, 220);
}

function openSettings() {
  settingsReturnFocus =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  if (
    typeof closeGameNavigation ===
    'function'
  ) {
    closeGameNavigation();
  }

  settingsScrollY = window.scrollY;

  document.body.style.top = `-${settingsScrollY}px`;
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

  window.requestAnimationFrame(() => {
    settingsClose.focus({
      preventScroll: true
    });
  });
}

function closeSettings() {

  document.body.classList.remove(
    'settings-open'
  );

  document.body.style.top = '';

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

  const focusTarget =
    settingsReturnFocus &&
    document.contains(settingsReturnFocus)
      ? settingsReturnFocus
      : settingsToggle;

  focusTarget.focus({
    preventScroll: true
  });

  window.scrollTo(0, settingsScrollY);
  settingsReturnFocus = null;
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

if (soundDetailsToggle) {
  soundDetailsToggle.addEventListener(
    'click',
    () => {
      sound.click();
      setSoundDetailsOpen(!soundDetailsOpen);
    }
  );
}

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
      : 'Todos os efeitos sonoros estão desligados';

  soundSwitch.classList.toggle(
    'active',
    enabled
  );

  soundSetting.setAttribute(
    'aria-pressed',
    String(enabled)
  );

  soundOptions.forEach((option) => {
    const name = option.dataset.soundChoice;
    const optionEnabled =
      Boolean(preferences.soundSettings?.[name] ?? true);

    const optionSwitch =
      option.querySelector('.settings-switch');

    option.classList.toggle(
      'is-disabled',
      !enabled
    );

    option.setAttribute(
      'aria-pressed',
      String(optionEnabled)
    );

    if (optionSwitch) {
      optionSwitch.classList.toggle(
        'active',
        optionEnabled
      );
    }
  });
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

soundOptions.forEach((option) => {
  option.addEventListener(
    'click',
    () => {
      const name = option.dataset.soundChoice;
      const current =
        Boolean(preferences.soundSettings?.[name] ?? true);

      sound.setSound(name, !current);
      updateSoundSetting();
    }
  );
});


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

  brandMode.classList.toggle(
    'is-visible',
    enabled
  );
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
syncGameMode();