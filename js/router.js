/* =========================================================
   ROUTER
========================================================= */
const view = document.getElementById('view');
const topContext = document.getElementById('topContext');
const routes = {
  '/': { title:'', render: renderHome },
  '/sintonia': { title:'Sintonia', render: renderSintonia },
  '/stop': { title:'Stop do casal', render: renderStop },
  '/verdade-ou-desafio': { title:'Verdade ou desafio', render: renderVD },
  '/quiz': { title:'Quem conhece melhor', render: renderQuiz }
};

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