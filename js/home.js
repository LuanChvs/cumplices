/* =========================================================
   HOME
========================================================= */
function renderHome(){
    const wrap = el(`
      <div>
        <section class="hero">
          <h1>Jogos pra jogar em dupla <span style="color:var(--coral); font-size:0.5em; font-style:italic; font-weight:400;">(ou +)</span>.</h1>
          <p>Quatro jogos rápidos pra tirar o celular de um lugar comum e colocar num sofá, numa mesa de bar ou numa noite qualquer da semana. Escolham um e comecem.</p>
        </section>
        <section class="game-list">
          <div class="game-row">
            ${gameCardHTML('sintonia','Sintonia','Girem a roleta, caiam numa categoria e respondam juntos a mesma pergunta ao mesmo tempo.','rose')}
          </div>
          <div class="game-row right">
            ${gameCardHTML('stop','Stop do casal','Uma carta define o tema. Falem uma palavra do tema, apertem a letra inicial e passem a vez. Dois modos de cronômetro: único ou reiniciando.','gold')}
          </div>
          <div class="game-row">
            ${gameCardHTML('verdade-ou-desafio','Verdade ou desafio','Um baralho de perguntas sinceras e desafios bobos pra fazer rir e se conhecer um pouco mais.','teal')}
          </div>
          <div class="game-row right">
            ${gameCardHTML('quiz','Quem conhece melhor','Perguntas sobre o outro pra descobrir quem realmente presta atenção.','lav')}
          </div>
        </section>
        <p class="home-footer">Feito para jogar de qualquer lugar, no celular ou no computador.</p>
      </div>
    `);
    return wrap;
  }
  function gameCardHTML(route,title,sub,iconKey){
    const iconMap = {sintonia:'sintonia', stop:'stop', 'verdade-ou-desafio':'vd', quiz:'quiz'};
    return `
      <a class="game-card" href="#/${route}">
        <div class="badge" style="color:var(--${iconKey})">${ICONS[iconMap[route]]}</div>
        <div>
          <h2>${title}</h2>
          <p class="sub">${sub}</p>
          <p class="go">Jogar</p>
        </div>
      </a>
    `;
  }