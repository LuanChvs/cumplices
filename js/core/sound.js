/* =========================================================
   SOUND CORE — efeitos sonoros compartilhados
========================================================= */

const SOUND_STORAGE_KEY = 'preferences.sound';

const SOUND_TYPES = [
  'click',
  'correct',
  'wrong',
  'timer',
  'elimination',
  'victory'
];

const sound = {
  enabled: preferences.sound,

  settings: {
    ...SOUND_TYPES.reduce((settings, name) => {
      settings[name] = Boolean(
        preferences.soundSettings?.[name] ?? true
      );
      return settings;
    }, {})
  },

  audio: {
    click: new Audio('./sounds/click.mp3'),
    correct: new Audio('./sounds/correct.mp3'),
    wrong: new Audio('./sounds/wrong.mp3'),
    timer: new Audio('./sounds/timer.mp3'),
    elimination: new Audio('./sounds/elimination.mp3'),
    victory: new Audio('./sounds/victory.mp3')
  },

  isEnabled(name) {
    return Boolean(
      this.enabled &&
      this.settings[name]
    );
  },

  play(name, volume = 0.5) {
    if (!this.isEnabled(name)) {
      return;
    }

    const audio = this.audio[name];

    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    audio.volume = volume;

    audio.play().catch(() => {
      // O navegador pode bloquear a reprodução.
    });
  },

  click() {
    this.play('click', 0.5);
  },

  correct() {
    this.play('correct', 0.55);
  },

  wrong() {
    this.play('wrong', 0.5);
  },

  timer() {
    if (!this.isEnabled('timer')) {
      return;
    }

    const audio = this.audio.timer;

    if (!audio) {
      return;
    }

    audio.loop = true;
    audio.volume = 0.45;

    if (audio.paused) {
      audio.currentTime = 0;

      audio.play().catch(() => {
        // O navegador pode bloquear a reprodução.
      });
    }
  },

  timerStop() {
    const audio = this.audio.timer;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
  },

  elimination() {
    this.play('elimination', 0.55);
  },

  victory() {
    this.play('victory', 0.6);
  },

  setEnabled(value) {
    this.enabled = Boolean(value);

    preferences.sound = this.enabled;

    storageSet(
      SOUND_STORAGE_KEY,
      this.enabled
    );

    savePreferences();

    if (!this.enabled) {
      this.timerStop();
    }
  },

  setSound(name, value) {
    if (!SOUND_TYPES.includes(name)) {
      return false;
    }

    this.settings[name] = Boolean(value);
    preferences.soundSettings[name] = this.settings[name];

    savePreferences();

    if (
      name === 'timer' &&
      !this.settings.timer
    ) {
      this.timerStop();
    }

    return this.settings[name];
  },

  getSettings() {
    return {
      enabled: this.enabled,
      ...this.settings
    };
  },

  toggle() {
    this.setEnabled(!this.enabled);

    return this.enabled;
  }
};
