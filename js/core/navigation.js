/* =========================================================
   NAVIGATION CORE — navegação comum dos jogos
========================================================= */

function goHome() {
    location.hash = '#/';
  }
  
  function restartCurrentGame() {
    router();
  }
  
  function createGameActions({
    onRestart = restartCurrentGame,
    onHome = goHome,
    restartText = 'Recomeçar',
    homeText = 'Voltar ao início'
  } = {}) {
  
    const wrapper = document.createElement('div');
  
    wrapper.className = 'btn-row';
  
    const restartButton = uiButton({
      text: restartText,
      className: 'btn btn-primary'
    });
  
    const homeButton = uiButton({
      text: homeText,
      className: 'btn btn-ghost'
    });
  
    restartButton.addEventListener('click', onRestart);
    homeButton.addEventListener('click', onHome);
  
    wrapper.appendChild(restartButton);
    wrapper.appendChild(homeButton);
  
    return wrapper;
  }