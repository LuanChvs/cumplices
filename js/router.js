/* =========================================================
   ROUTER
========================================================= */

const view =
  document.getElementById('view');

const topContext =
  document.getElementById('topContext');

const gameNavToggle =
  document.getElementById('gameNavToggle');

const topbar =
  document.getElementById('topbar');

let currentViewCleanup = null;

/*
  Tempo (em ms) que a topbar fica aberta
  antes de se fechar sozinha no modo jogo.
*/

const NAV_AUTO_CLOSE_MS = 5000;

let navAutoCloseTimer = null;


/* =========================================================
   ROTAS
========================================================= */

const routes = {

  '/': {
    title: '',
    render: renderHome,
    gameMode: false,
    fullscreen: false
  }

};


Object.values(games).forEach(
  (game) => {

    routes[game.route] = {

      title: game.title,

      render: game.render,

      gameMode: true,

      fullscreen:
        game.fullscreen === true

    };

  }
);


/* =========================================================
   MODO JOGO
========================================================= */

function setGameMode(enabled, fullscreen) {

  const body =
    document.body;

  body.classList.toggle(
    'game-mode',
    enabled === true
  );

  body.classList.toggle(
    'game-mode-fullscreen',
    enabled === true &&
    fullscreen === true
  );

  /*
    Ao sair do modo jogo,
    limpa qualquer resíduo.
  */

  if (!enabled) {

    body.classList.remove(
      'game-nav-open'
    );

    clearNavAutoClose();

  }

  updateGameNavToggleState();

}


/* =========================================================
   NAVEGAÇÃO DO MODO JOGO
========================================================= */

function openGameNavigation() {

  if (
    !document.body.classList.contains(
      'game-mode'
    )
  ) {
    return;
  }

  document.body.classList.add(
    'game-nav-open'
  );

  updateGameNavToggleState();

  scheduleNavAutoClose();

}


function closeGameNavigation() {

  document.body.classList.remove(
    'game-nav-open'
  );

  clearNavAutoClose();

  updateGameNavToggleState();

}


function toggleGameNavigation() {

  if (
    !document.body.classList.contains(
      'game-mode'
    )
  ) {
    return;
  }

  if (
    document.body.classList.contains(
      'game-nav-open'
    )
  ) {
    closeGameNavigation();
  } else {
    openGameNavigation();
  }

}


function updateGameNavToggleState() {

  if (!gameNavToggle) {
    return;
  }

  const isOpen =
    document.body.classList.contains(
      'game-nav-open'
    );

  const isGameMode =
    document.body.classList.contains(
      'game-mode'
    );

  gameNavToggle.setAttribute(
    'aria-expanded',
    String(isOpen)
  );

  const isVisible =
    isGameMode && !isOpen;

  gameNavToggle.setAttribute(
    'aria-hidden',
    String(!isVisible)
  );

  gameNavToggle.tabIndex =
    isVisible ? 0 : -1;

}


/* =========================================================
   AUTO-FECHAR A NAVEGAÇÃO
========================================================= */

function scheduleNavAutoClose() {

  clearNavAutoClose();

  navAutoCloseTimer = setTimeout(
    () => {

      navAutoCloseTimer = null;

      closeGameNavigation();

    },
    NAV_AUTO_CLOSE_MS
  );

}


function clearNavAutoClose() {

  if (navAutoCloseTimer) {

    clearTimeout(
      navAutoCloseTimer
    );

    navAutoCloseTimer = null;

  }

}


/* =========================================================
   EVENTOS DO BOTÃO
========================================================= */

if (gameNavToggle) {

  gameNavToggle.addEventListener(
    'click',
    () => {

      if (
        typeof sound !== 'undefined' &&
        sound &&
        typeof sound.click === 'function'
      ) {
        sound.click();
      }

      toggleGameNavigation();

    }
  );

}


/* =========================================================
   FECHAR NAVEGAÇÃO AO CLICAR EM LINKS DA TOPBAR
========================================================= */

if (topbar) {

  topbar.addEventListener(
    'click',
    (event) => {

      if (event.target.closest('a')) {
        closeGameNavigation();
      }

    }
  );

}


/* =========================================================
   FECHAR NAVEGAÇÃO AO CLICAR FORA
========================================================= */

document.addEventListener(
  'pointerdown',
  (event) => {

    if (
      !document.body.classList.contains(
        'game-nav-open'
      )
    ) {
      return;
    }

    const target =
      event.target;

    if (!target || !target.closest) {
      return;
    }

    /*
      Cliques dentro da topbar
      não fecham aqui (quem trata
      é o listener de links acima).
    */

    if (target.closest('.topbar')) {
      return;
    }

    /*
      Cliques no próprio botão
      também são ignorados.
    */

    if (
      target.closest(
        '.game-nav-toggle'
      )
    ) {
      return;
    }

    closeGameNavigation();

  }
);


/* =========================================================
   FECHAR NAVEGAÇÃO COM ESC
========================================================= */

document.addEventListener(
  'keydown',
  (event) => {

    if (
      event.key === 'Escape' &&
      document.body.classList.contains(
        'game-nav-open'
      )
    ) {

      closeGameNavigation();

    }

  }
);


/* =========================================================
   ROUTER
========================================================= */

function router() {

  closeGameNavigation();


  if (
    typeof currentViewCleanup ===
    'function'
  ) {

    currentViewCleanup();

    currentViewCleanup = null;

  }


  const hash =
    location.hash.replace('#', '') || '/';


  const route =
    routes[hash] || routes['/'];


  setGameMode(
    route.gameMode === true,
    route.fullscreen === true
  );


  view.innerHTML = '';


  topContext.textContent =
    hash === '/'
      ? ''
      : '← início';


  const renderedView =
    route.render();


  view.appendChild(
    renderedView
  );


  if (
    renderedView &&
    typeof renderedView.cleanup ===
      'function'
  ) {

    currentViewCleanup =
      renderedView.cleanup;

  }


  window.scrollTo(
    0,
    0
  );

}


window.addEventListener(
  'hashchange',
  router
);


window.addEventListener(
  'DOMContentLoaded',
  router
);