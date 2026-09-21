/* =========================================================
   IMPOSTOR
   Modo Duo — preparação da rodada.
========================================================= */

function renderImpostor() {
  const root = document.createElement('section');
  root.className = 'impostor';

  const state = {
    screen: 'mode',
    players: ['Jogador 1', 'Jogador 2'],
    theme: null,
    words: [null, null],
    revealedPlayerIndex: 0
  };

  const themes = () => window.DATA?.impostor?.themes || [];

  const pickRound = () => {
    const availableThemes = themes();

    if (!availableThemes.length) return false;

    const theme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
    const pairs = theme.pairs || [];

    if (!pairs.length) return false;

    const pair = pairs[Math.floor(Math.random() * pairs.length)];

    state.theme = theme;
    state.words = [...pair];
    return true;
  };

  const render = () => {
    root.innerHTML = '';

    if (state.screen === 'mode') {
      renderMode();
      return;
    }

    if (state.screen === 'duoSetup') {
      renderDuoSetup();
      return;
    }

    if (state.screen === 'theme') {
      renderTheme();
      return;
    }

    if (state.screen === 'secret') {
      renderSecret();
      return;
    }

    if (state.screen === 'statement') {
      renderStatement();
    }
  };

  const renderMode = () => {
    root.innerHTML = \`
      <div class="impostor__intro">
        <span class="eyebrow">Novo jogo</span>
        <h1>Impostor</h1>
        <p>Descubram quem está blefando — ou convençam o outro de que estão dizendo a verdade.</p>

        <div class="impostor__modes" aria-label="Modos de jogo">
          <button type="button" class="impostor__mode" data-impostor-mode="normal">
            <strong>Modo Normal</strong>
            <span>Para 3 ou mais jogadores · em breve</span>
          </button>
          <button type="button" class="impostor__mode" data-impostor-mode="duo">
            <strong>Modo Duo</strong>
            <span>Dois jogadores · começar configuração</span>
          </button>
        </div>

        <p class="impostor__feedback impostor__mode-feedback" aria-live="polite"></p>
      </div>
    \`;

    root.querySelector('[data-impostor-mode="duo"]').onclick = () => {
      state.screen = 'duoSetup';
      render();
    };

    root.querySelector('[data-impostor-mode="normal"]').onclick = () => {
      root.querySelector('.impostor__mode-feedback').textContent =
        'O Modo Normal será disponibilizado em uma próxima etapa.';
    };
  };

  const renderDuoSetup = () => {
    root.innerHTML = \`
      <div class="impostor__intro">
        <span class="eyebrow">Modo Duo</span>
        <h2>Preparem a partida</h2>
        <p>Definam os nomes dos dois jogadores para continuar.</p>

        <div class="impostor__players">
          <label>
            Jogador 1
            <input type="text" data-impostor-player="0" maxlength="30" placeholder="Nome do jogador 1">
          </label>
          <label>
            Jogador 2
            <input type="text" data-impostor-player="1" maxlength="30" placeholder="Nome do jogador 2">
          </label>
        </div>

        <button type="button" class="btn btn-primary impostor__continue">Continuar</button>
        <p class="impostor__feedback" aria-live="polite"></p>
      </div>
    \`;

    const inputs = [...root.querySelectorAll('[data-impostor-player]')];

    inputs.forEach((input, index) => {
      input.value = state.players[index];
    });

    root.querySelector('.impostor__continue').onclick = () => {
      const players = inputs.map((input) => input.value.trim());

      if (players.some((name) => !name)) {
        root.querySelector('.impostor__feedback').textContent =
          'Preencham os nomes dos dois jogadores para continuar.';
        return;
      }

      if (players[0].toLowerCase() === players[1].toLowerCase()) {
        root.querySelector('.impostor__feedback').textContent =
          'Os jogadores precisam ter nomes diferentes.';
        return;
      }

      state.players = players;

      if (!pickRound()) {
        root.querySelector('.impostor__feedback').textContent =
          'Não foi possível preparar a rodada. Verifiquem o banco de palavras.';
        return;
      }

      state.screen = 'theme';
      render();
    };

    requestAnimationFrame(() => inputs[0]?.focus());
  };

  const renderTheme = () => {
    root.innerHTML = \`
      <div class="impostor__intro impostor__theme">
        <span class="eyebrow">Modo Duo · preparação</span>
        <h2>O tema da rodada é</h2>

        <div class="impostor__theme-card">
          <strong></strong>
        </div>

        <p>
          Os dois jogadores conhecem o tema.
          Cada um receberá uma palavra secreta diferente dentro dele.
        </p>

        <button type="button" class="btn btn-primary impostor__theme-continue">
          Continuar →
        </button>
      </div>
    \`;

    root.querySelector('.impostor__theme-card strong').textContent = state.theme.name;

    root.querySelector('.impostor__theme-continue').onclick = () => {
      state.revealedPlayerIndex = 0;
      state.screen = 'secret';
      render();
    };
  };

  const renderSecret = () => {
    const playerIndex = state.revealedPlayerIndex;
    const player = state.players[playerIndex];
    const word = state.words[playerIndex];

    root.innerHTML = \`
      <div class="impostor__intro impostor__secret">
        <span class="eyebrow">Informação secreta</span>
        <h2>Vez de \${player}</h2>
        <p>Entreguem o celular somente para este jogador.</p>

        <div class="impostor__secret-card" aria-live="polite">
          <span>Sua palavra secreta</span>
          <strong class="impostor__secret-word"></strong>
        </div>

        <p class="impostor__secret-warning">
          Não deixe o outro jogador ver esta tela.
        </p>

        <button type="button" class="btn btn-primary impostor__secret-hide">
          Já vi minha palavra →
        </button>
      </div>
    \`;

    root.querySelector('.impostor__secret-word').textContent = word;

    root.querySelector('.impostor__secret-hide').onclick = () => {
      if (playerIndex === 0) {
        state.revealedPlayerIndex = 1;
        render();
        return;
      }

      state.screen = 'statement';
      render();
    };
  };

  const renderStatement = () => {
    root.innerHTML = \`
      <div class="impostor__intro">
        <span class="eyebrow">Próxima etapa</span>
        <h2>Palavras recebidas</h2>
        <p>As duas palavras já foram distribuídas. Agora vamos preparar as declarações de cada jogador.</p>

        <div class="impostor__next-card">
          <strong>Declarações</strong>
          <span>1 palavra verdadeira + 2 blefes plausíveis para cada jogador.</span>
        </div>

        <button type="button" class="btn btn-primary impostor__continue-statements">
          Continuar →
        </button>
      </div>
    \`;

    root.querySelector('.impostor__continue-statements').onclick = () => {
      root.querySelector('.impostor__next-card').classList.add('is-ready');
    };
  };

  render();

  return root;
}
