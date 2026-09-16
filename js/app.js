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

const themeOptions =
  document.querySelectorAll('[data-theme-choice]');


/* =========================================================
   DRAWER
========================================================= */

function openSettings() {
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
      ? 'Modo Resenha ligado'
      : 'Modo Resenha desligado';

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