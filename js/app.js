/* =========================================================
   APP — INICIALIZAÇÃO
========================================================= */

const soundToggle =
  document.getElementById('soundToggle');

const soundIcon =
  document.getElementById('soundIcon');


function updateSoundToggle() {
  if (sound.enabled) {
    soundIcon.textContent = '🔊';

    soundToggle.setAttribute(
      'aria-label',
      'Desligar sons'
    );

    soundToggle.setAttribute(
      'title',
      'Desligar sons'
    );
  } else {
    soundIcon.textContent = '🔇';

    soundToggle.setAttribute(
      'aria-label',
      'Ligar sons'
    );

    soundToggle.setAttribute(
      'title',
      'Ligar sons'
    );
  }
}


soundToggle.addEventListener(
  'click',
  () => {
    sound.toggle();

    updateSoundToggle();
  }
);


updateSoundToggle();