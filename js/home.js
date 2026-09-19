/* =========================================================
   HOME
========================================================= */
function renderHome(){
    const wrap = el(`
      <div>
        <section class="hero">
          <h1>Jogos pra jogar em dupla <span style="color:var(--coral); font-size:0.5em; font-style:italic; font-weight:400;">(ou +)</span>.</h1>
          <p>Jogos rápidos pra tirar o celular de um lugar comum e colocar num sofá, numa mesa de bar ou numa noite qualquer da semana. Escolham um e comecem.</p>
        </section>
        <section class="game-list">
          ${renderGameList()}
        </section>
        <p class="home-footer">Feito para jogar de qualquer lugar, no celular ou no computador.</p>
      </div>
    `);
    return wrap;
  }
  function renderGameList(){
    return Object.values(games)
      .filter((game) => !['termo', 'termo-aleatorio', 'termo-versus'].includes(game.id))
      .map((game, index) => `
        <div class="game-row${index % 2 === 1 ? ' right' : ''}">
          ${gameCardHTML(game)}
        </div>
      `)
      .join('');
  }
  function gameCardHTML(game){
    return `
      <a class="game-card" href="#${game.route}">
        <div class="badge" style="color:var(--${game.color})">
          ${game.icon}
        </div>
  
        <div>
          <h2>${game.title}</h2>
          <p class="sub">${game.description}</p>
          <p class="go">Jogar</p>
        </div>
      </a>
    `;
  }