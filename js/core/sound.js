/* =========================================================
   SOUND CORE — efeitos sonoros compartilhados
========================================================= */

const SOUND_STORAGE_KEY = 'preferences.sound';


const sound = {
  enabled: storageGet(
    SOUND_STORAGE_KEY,
    true
  ),

  audio: {
    click: new Audio('./sounds/click.mp3'),
    correct: new Audio('./sounds/correct.mp3'),
    wrong: new Audio('./sounds/wrong.mp3'),
    timer: new Audio('./sounds/timer.mp3'),
    elimination: new Audio('./sounds/elimination.mp3'),
    victory: new Audio('./sounds/victory.mp3')
  },


  play(name, volume = 0.5) {
    if (!this.enabled) {
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
      // O jogo continua funcionando normalmente.
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
    if (!this.enabled) {
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

    storageSet(
      SOUND_STORAGE_KEY,
      this.enabled
    );

    if (!this.enabled) {
      this.timerStop();
    }
  },


  toggle() {
    this.setEnabled(!this.enabled);

    return this.enabled;
  }
};