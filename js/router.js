/* =========================================================
   ROUTER
========================================================= */

const view =
  document.getElementById('view');

const topContext =
  document.getElementById('topContext');

const gameNavToggle =
  document.getElementById('gameNavToggle');

let currentViewCleanup = null;


/* =========================================================
   ROTAS
========================================================= */

const routes = {

  '/': {
    title: '',
    render: renderHome,
    gameMode: false
  }

};


Object.values(games).forEach(
  (game) => {

    routes[game.route] = {

      title: game.title,

      render: game.render,

      gameMode: true

    };

  }
);


/* =========================================================
   MODO JOGO
========================================================= */

function setGameMode(enabled) {

  document.body.classList.toggle(
    'game-mode',
    enabled
  );

  /*
    Sempre começa com a navegação
    recolhida ao entrar em um jogo.
  */

  if (!enabled) {

    document.body.classList.remove(
      'game-nav-open'
    );

  }

  if (gameNavToggle) {

    gameNavToggle.setAttribute(
      'aria-expanded',
      String(
        enabled &&
        document.body.classList.contains(
          'game-nav-open'
        )
      )
    );

  }

}


/* =========================================================
   NAVEGAÇÃO DO MODO JOGO
========================================================= */

function toggleGameNavigation() {

  if (
    !document.body.classList.contains(
      'game-mode'
    )
  ) {
    return;
  }

  const isOpen =
    document.body.classList.toggle(
      'game-nav-open'
    );

  gameNavToggle.setAttribute(
    'aria-expanded',
    String(isOpen)
  );

}


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
   ROUTER
========================================================= */

function router() {

  /*
    Fecha a navegação do modo jogo
    antes de trocar de tela.
  */

  document.body.classList.remove(
    'game-nav-open'
  );


  /*
    Limpa recursos da tela anterior
    antes de trocar a view.
  */

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


  /*
    Ativa ou desativa o Modo Jogo
    conforme a rota atual.
  */

  setGameMode(
    route.gameMode === true
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


  /*
    Alguns jogos podem expor uma
    função de limpeza própria.
  */

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