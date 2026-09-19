/* =========================================================
   PREFERÊNCIAS — configurações globais do aplicativo
========================================================= */

const PREFERENCES_STORAGE_KEY = 'preferences';

const THEME_COLORS = {
  dark: '#161022',
  light: '#f4ead8'
};

function applyThemeColor(theme) {
  const meta = document.querySelector('meta[name="theme-color"]');

  if (meta) {
    meta.setAttribute(
      'content',
      THEME_COLORS[theme] || THEME_COLORS.dark
    );
  }
}

const DEFAULT_SOUND_SETTINGS = {
  click: true,
  correct: true,
  wrong: true,
  timer: true,
  elimination: true,
  victory: true
};

const DEFAULT_PREFERENCES = {
  sound: true,
  soundSettings: { ...DEFAULT_SOUND_SETTINGS },
  theme: 'dark',
  resenha: false,
  gameMode: false
};

const storedPreferences = storageGet(
  PREFERENCES_STORAGE_KEY,
  {}
);

const legacySoundEnabled = storageGet(
  'preferences.sound',
  true
);

const preferences = {
  ...DEFAULT_PREFERENCES,
  ...storedPreferences,
  soundSettings: {
    ...DEFAULT_SOUND_SETTINGS,
    ...(storedPreferences?.soundSettings || {})
  }
};

if (
  !Object.prototype.hasOwnProperty.call(
    storedPreferences || {},
    'sound'
  )
) {
  preferences.sound = Boolean(legacySoundEnabled);
}

function savePreferences() {
  storageSet(
    PREFERENCES_STORAGE_KEY,
    preferences
  );

  storageSet(
    'preferences.sound',
    preferences.sound
  );
}

function setPreference(name, value) {
  preferences[name] = value;
  savePreferences();
  return preferences[name];
}

function setSoundPreference(name, value) {
  if (
    !Object.prototype.hasOwnProperty.call(
      DEFAULT_SOUND_SETTINGS,
      name
    )
  ) {
    return preferences.soundSettings;
  }

  preferences.soundSettings[name] = Boolean(value);
  savePreferences();

  return preferences.soundSettings[name];
}

function setTheme(theme) {
  if (theme !== 'dark' && theme !== 'light') {
    return preferences.theme;
  }

  preferences.theme = theme;
  savePreferences();

  document.documentElement.setAttribute(
    'data-theme',
    theme
  );

  applyThemeColor(theme);

  return theme;
}

function setResenha(enabled) {
  preferences.resenha = Boolean(enabled);
  savePreferences();
  return preferences.resenha;
}

function setGameModePreference(enabled) {
  preferences.gameMode = Boolean(enabled);
  savePreferences();
  return preferences.gameMode;
}

function initPreferences() {
  document.documentElement.setAttribute(
    'data-theme',
    preferences.theme
  );

  applyThemeColor(preferences.theme);
}

initPreferences();
