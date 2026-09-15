/* =========================================================
   ROUTER
========================================================= */
const view = document.getElementById('view');
const topContext = document.getElementById('topContext');
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

function router(){
  const hash = location.hash.replace('#','') || '/';
  const route = routes[hash] || routes['/'];
  view.innerHTML = '';
  topContext.textContent = hash === '/' ? '' : '← início';
  view.appendChild(route.render());
  window.scrollTo(0,0);
}
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);