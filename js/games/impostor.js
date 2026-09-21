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
    revealedPlayerIndex: 0,
    statementOptions: [[], []],
    statements: [null, null],
    statementPlayerIndex: 0
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

    const allWords = [...new Set(pairs.flat())];
    state.statementOptions = state.words.map((secretWord, playerIndex) => {
      const opponentWord = state.words[playerIndex === 0 ? 1 : 0];
      const falseOptions = allWords
        .filter((word) => word !== secretWord && word !== opponentWord)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      return [secretWord, ...falseOptions]
        .sort(() => Math.random() - 0.5);
    });

    state.statements = [null, null];
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
      return;
    }

    if (state.screen === 'declarations') {
      renderDeclarations();
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

      state.statementPlayerIndex = 0;
      state.screen = 'statement';
      render();
    };
  };

  const renderStatement = () => {
    const playerIndex = state.statementPlayerIndex;
    const player = state.players[playerIndex];
    const options = state.statementOptions[playerIndex];

    root.innerHTML = `
      <div class="impostor__intro impostor__statement">
        <span class="eyebrow">Declaração secreta</span>
        <h2>Vez de ${player}</h2>
        <p>Escolha uma opção e depois diga a palavra em voz alta. O aplicativo não contará ao outro jogador se ela é verdadeira.</p>

        <div class="impostor__statement-options" role="group" aria-label="Opções de declaração"></div>

        <p class="impostor__feedback" aria-live="polite"></p>
      </div>
    `;

    const optionsRoot = root.querySelector('.impostor__statement-options');

    options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'impostor__statement-option';
      button.textContent = option;
      button.onclick = () => {
        state.statements[playerIndex] = option;

        if (playerIndex === 0) {
          state.statementPlayerIndex = 1;
          render();
          return;
        }

        state.screen = 'declarations';
        render();
      };

      optionsRoot.append(button);
    });
  };

  const renderDeclarations = () => {
    root.innerHTML = `
      <div class="impostor__intro impostor__declarations">
        <span class="eyebrow">Declarações</span>
        <h2>Agora é no cara a cara</h2>
        <p>Digam em voz alta a palavra que cada um escolheu. O aplicativo não vai revelar quem falou a verdade.</p>

        <div class="impostor__declaration-list"></div>

        <button type="button" class="btn btn-primary impostor__start-interrogation">
          Começar interrogatório →
        </button>
      </div>
    `;

    const list = root.querySelector('.impostor__declaration-list');

    state.players.forEach((player, index) => {
      const item = document.createElement('div');
      item.className = 'impostor__declaration-item';
      item.innerHTML = `
        <strong>${player}</strong>
        <span>Declare sua palavra em voz alta.</span>
      `;
      list.append(item);
    });

    root.querySelector('.impostor__start-interrogation').onclick = () => {
      root.querySelector('.impostor__feedback')?.remove();
      const message = document.createElement('p');
      message.className = 'impostor__feedback';
      message.textContent = 'Próxima etapa: interrogatório.';
      root.querySelector('.impostor__declarations').append(message);
    };
  };

  render();

  return root;
}
