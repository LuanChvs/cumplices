/* =========================================================
   SOUND CORE — efeitos sonoros compartilhados
========================================================= */

const sound = {
    audio: {
      click: new Audio('./sounds/click.mp3'),
      correct: new Audio('./sounds/correct.mp3'),
      wrong: new Audio('./sounds/wrong.mp3'),
      timer: new Audio('./sounds/timer.mp3'),
      elimination: new Audio('./sounds/elimination.mp3'),
      victory: new Audio('./sounds/victory.mp3')
    },
  
  
    play(name, volume = 0.5) {
      const audio = this.audio[name];
  
      if (!audio) {
        return;
      }
  
      audio.currentTime = 0;
      audio.volume = volume;
  
      audio.play().catch(() => {
        // O navegador pode bloquear a reprodução
        // em algumas situações. O jogo continua normal.
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
      this.play('timer', 0.45);
    },
  
  
    elimination() {
      this.play('elimination', 0.55);
    },
  
  
    victory() {
      this.play('victory', 0.6);
    }
  };