/* =========================================================
   ROUTER
========================================================= */

const view = document.getElementById('view');
const topContext = document.getElementById('topContext');

let currentViewCleanup = null;


const routes = {
  '/': {
    title: '',
    render: renderHome
  }
};


Object.values(games).forEach(game => {
  routes[game.route] = {
    title: game.title,
    render: game.render
  };
});


function router() {
  /*
    Limpa recursos da tela anterior
    antes de trocar a view.
  */
  if (typeof currentViewCleanup === 'function') {
    currentViewCleanup();
    currentViewCleanup = null;
  }


  const hash =
    location.hash.replace('#', '') || '/';


  const route =
    routes[hash] || routes['/'];


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
    typeof renderedView.cleanup === 'function'
  ) {
    currentViewCleanup =
      renderedView.cleanup;
  }


  window.scrollTo(0, 0);
}


window.addEventListener(
  'hashchange',
  router
);


window.addEventListener(
  'DOMContentLoaded',
  router
);