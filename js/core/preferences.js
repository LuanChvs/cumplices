/* =========================================================
   PREFERÊNCIAS — configurações globais do aplicativo
========================================================= */

const PREFERENCES_STORAGE_KEY = 'preferences';

const DEFAULT_PREFERENCES = {
  sound: true,
  theme: 'dark',
  resenha: false
};

const preferences = {
  ...DEFAULT_PREFERENCES,
  ...storageGet(
    PREFERENCES_STORAGE_KEY,
    DEFAULT_PREFERENCES
  )
};

function savePreferences() {
  storageSet(
    PREFERENCES_STORAGE_KEY,
    preferences
  );
}

function setPreference(name, value) {
  preferences[name] = value;
  savePreferences();
  return preferences[name];
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

  return theme;
}

function setResenha(enabled) {
  preferences.resenha = Boolean(enabled);
  savePreferences();
  return preferences.resenha;
}

function initPreferences() {
  document.documentElement.setAttribute(
    'data-theme',
    preferences.theme
  );
}

initPreferences();