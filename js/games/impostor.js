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
    selectedTheme: 'random',
    questionCount: 3,
    words: [null, null],
    revealedPlayerIndex: 0,
    statementOptions: [[], []],
    statements: [null, null],
    statementPlayerIndex: 0,
    questionIndex: 0,
    questionText: '',
    questions: [],
    judgmentPlayerIndex: 0,
    judgments: [null, null],
    classicPlayers: ['Jogador 1', 'Jogador 2', 'Jogador 3'],
    classicSelectedTheme: 'random',
    classicDifficulty: 'none',
    classicTheme: null,
    classicSecretWord: null,
    classicImpostorIndex: null,
    classicImpostorInfo: null,
    classicRevealIndex: 0,
    classicRevealedImpostor: false,
    classicRevealedWord: false
  };

  const themes = () => window.DATA?.impostor?.themes || [];

  const pickRound = () => {
    const availableThemes = themes();

    if (!availableThemes.length) return false;

    const theme = state.selectedTheme === 'random'
      ? availableThemes[Math.floor(Math.random() * availableThemes.length)]
      : availableThemes.find((item) => item.id === state.selectedTheme);

    if (!theme) return false;

    const words = theme.words || [];

    if (words.length < 2) return false;

    const wordPool = words.map((entry) => entry.word);
    const selectedWords = [
      wordPool[Math.floor(Math.random() * wordPool.length)],
      wordPool[Math.floor(Math.random() * wordPool.length)]
    ];

    state.theme = theme;
    state.words = selectedWords;

    state.statementOptions = state.words.map((secretWord, playerIndex) => {
      const opponentWord = state.words[playerIndex === 0 ? 1 : 0];
      const entry = words.find((item) => item.word === secretWord);

      if (!entry) return [];

      const strongCandidates = (entry.strong || [])
        .filter((word) => word !== secretWord);
      const weakCandidates = (entry.weak || [])
        .filter((word) => word !== secretWord);

      if (!strongCandidates.length || !weakCandidates.length) return [];

      const strong = strongCandidates[Math.floor(Math.random() * strongCandidates.length)];
      const weak = weakCandidates[Math.floor(Math.random() * weakCandidates.length)];

      const blocked = new Set([secretWord, strong, weak]);
      const randomCandidates = wordPool.filter((word) => !blocked.has(word));

      if (!randomCandidates.length) return [];

      const randomWord = randomCandidates[Math.floor(Math.random() * randomCandidates.length)];

      return [
        { word: secretWord, type: 'truth' },
        { word: strong, type: 'strong' },
        { word: weak, type: 'weak' },
        { word: randomWord, type: 'random' }
      ].sort(() => Math.random() - 0.5);
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

    if (state.screen === 'classicSetup') {
      renderClassicSetup();
      return;
    }

    if (state.screen === 'classicTheme') {
      renderClassicTheme();
      return;
    }

    if (state.screen === 'classicSecretPrep') {
      renderClassicSecretPrep();
      return;
    }

    if (state.screen === 'classicSecret') {
      renderClassicSecret();
      return;
    }

    if (state.screen === 'classicDiscussion') {
      renderClassicDiscussion();
      return;
    }

    if (state.screen === 'classicResult') {
      renderClassicResult();
      return;
    }

    if (state.screen === 'theme') {
      renderTheme();
      return;
    }

    if (state.screen === 'secretPrep') {
      renderSecretPrep();
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
      return;
    }

    if (state.screen === 'question') {
      renderQuestion();
      return;
    }

    if (state.screen === 'answer') {
      renderAnswer();
      return;
    }

    if (state.screen === 'judgment') {
      renderJudgment();
      return;
    }

    if (state.screen === 'result') {
      renderResult();
    }
  };

  const renderMode = () => {
    root.innerHTML = `
      <div class="impostor__intro">
        <span class="eyebrow">Novo jogo</span>
        <h1>Impostor</h1>
        <p>Descubram quem está blefando — ou convençam o outro de que estão dizendo a verdade.</p>

        <div class="impostor__modes" aria-label="Modos de jogo">
          <button type="button" class="impostor__mode" data-impostor-mode="normal">
            <strong>Modo Normal</strong>
            <span>3 a 6 jogadores · descubram quem é o Impostor</span>
          </button>
          <button type="button" class="impostor__mode" data-impostor-mode="duo">
            <strong>Modo Duo</strong>
            <span>Dois jogadores · começar configuração</span>
          </button>
        </div>

        <p class="impostor__feedback impostor__mode-feedback" aria-live="polite"></p>
      </div>
    `;

    root.querySelector('[data-impostor-mode="duo"]').onclick = () => {
      state.screen = 'duoSetup';
      render();
    };

    root.querySelector('[data-impostor-mode="normal"]').onclick = () => {
      state.screen = 'classicSetup';
      render();
    };
  };

  const renderDuoSetup = () => {
    let configTab = 'players';

    root.innerHTML = `
      <div class="impostor__intro">
        <span class="eyebrow">Modo Duo</span>
        <h2>Preparem a partida</h2>
        <p>Definam os jogadores e as regras da rodada.</p>

        <div class="impostor__config-tabs" role="tablist">
          <button type="button" class="impostor__config-tab" data-tab="players">👥 Jogadores</button>
          <button type="button" class="impostor__config-tab" data-tab="settings">⚙️ Configuração</button>
        </div>

        <div class="impostor__config-content"></div>

        <button type="button" class="btn btn-primary impostor__continue">Começar partida →</button>

        <button type="button" class="btn btn-secondary impostor__back-to-mode">
          ← Selecionar modo de jogo
        </button>
        <p class="impostor__feedback" aria-live="polite"></p>
      </div>
    `;

    const content = root.querySelector('.impostor__config-content');
    const tabs = [...root.querySelectorAll('.impostor__config-tab')];

    const renderTab = () => {
      tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.tab === configTab));
      content.innerHTML = '';

      if (configTab === 'players') {
        const players = document.createElement('div');
        players.className = 'impostor__players';

        state.players.forEach((player, index) => {
          const label = document.createElement('label');
          label.textContent = `Jogador ${index + 1}`;

          const input = document.createElement('input');
          input.type = 'text';
          input.maxLength = 30;
          input.placeholder = `Nome do jogador ${index + 1}`;
          input.value = player;
          input.oninput = () => {
            state.players[index] = input.value || `Jogador ${index + 1}`;
          };

          label.append(input);
          players.append(label);
        });

        content.append(players);
        return;
      }

      const settings = document.createElement('div');
      settings.className = 'impostor__settings';

      const themeField = document.createElement('label');
      themeField.className = 'impostor__settings-field';
      themeField.innerHTML = '<span>Tema das palavras</span>';

      const themeSelect = document.createElement('select');
      themeSelect.className = 'impostor__settings-select';

      const randomOption = document.createElement('option');
      randomOption.value = 'random';
      randomOption.textContent = '🎲 Aleatório';
      themeSelect.append(randomOption);

      themes().forEach((theme) => {
        const option = document.createElement('option');
        option.value = theme.id;
        option.textContent = theme.name;
        themeSelect.append(option);
      });

      themeSelect.value = state.selectedTheme;
      themeSelect.onchange = () => {
        state.selectedTheme = themeSelect.value;
      };
      themeField.append(themeSelect);

      const questionField = document.createElement('div');
      questionField.className = 'impostor__settings-field';
      questionField.innerHTML = '<span>Perguntas por jogador</span><small>As perguntas serão alternadas entre os dois jogadores.</small>';

      const questionOptions = document.createElement('div');
      questionOptions.className = 'impostor__question-count-options';

      [1, 2, 3, 4, 5].forEach((count) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'impostor__question-count';
        button.classList.toggle('is-active', state.questionCount === count);
        button.textContent = count;
        button.onclick = () => {
          state.questionCount = count;
          renderTab();
        };
        questionOptions.append(button);
      });

      questionField.append(questionOptions);
      settings.append(themeField, questionField);
      content.append(settings);
    };

    tabs.forEach((tab) => {
      tab.onclick = () => {
        configTab = tab.dataset.tab;
        renderTab();
      };
    });

    root.querySelector('.impostor__continue').onclick = () => {
      if (configTab === 'players') {
        const inputs = [...root.querySelectorAll('.impostor__players input')];
        const names = inputs.map((input) => input.value.trim());

        if (names.some((name) => !name)) {
          root.querySelector('.impostor__feedback').textContent =
            'Preencham os nomes dos dois jogadores para continuar.';
          return;
        }

        if (names[0].toLowerCase() === names[1].toLowerCase()) {
          root.querySelector('.impostor__feedback').textContent =
            'Os jogadores precisam ter nomes diferentes.';
          return;
        }

        state.players = names;
      }

      if (!pickRound()) {
        root.querySelector('.impostor__feedback').textContent =
          'Não foi possível preparar a rodada. Verifiquem o banco de palavras.';
        return;
      }

      state.screen = 'theme';
      render();
    };

    root.querySelector('.impostor__back-to-mode').onclick = () => {
      state.screen = 'mode';
      render();
    };

    renderTab();
  };

  const renderTheme = () => {
    root.innerHTML = `
      <div class="impostor__intro impostor__theme">
        <span class="eyebrow">Modo Duo · preparação</span>
        <h2>O tema da rodada é</h2>

        <div class="impostor__theme-card">
          <strong></strong>
        </div>

        <p>
          Os dois jogadores conhecem o tema.
          Cada um receberá uma palavra secreta dentro dele — elas podem ser iguais.
          Serão feitas ${state.questionCount} perguntas por jogador.
        </p>

        <button type="button" class="btn btn-primary impostor__theme-continue">
          Continuar →
        </button>
      </div>
    `;

    root.querySelector('.impostor__theme-card strong').textContent = state.theme.name;

    root.querySelector('.impostor__theme-continue').onclick = () => {
      state.revealedPlayerIndex = 0;
      state.screen = 'secretPrep';
      render();
    };
  };

  const renderSecretPrep = () => {
    const player = state.players[state.revealedPlayerIndex];

    root.innerHTML = `
      <div class="impostor__intro impostor__secret-prep">
        <span class="eyebrow">Informação secreta</span>
        <h2>Vez de ${player}</h2>
        <p>Entreguem o celular somente para este jogador.</p>

        <div class="impostor__next-card">
          <strong>Pronto para revelar sua palavra?</strong>
          <span>Toque abaixo quando somente você estiver olhando para a tela.</span>
        </div>

        <button type="button" class="btn btn-primary impostor__secret-reveal">
          Revelar minha palavra →
        </button>
      </div>
    `;

    root.querySelector('.impostor__secret-reveal').onclick = () => {
      state.screen = 'secret';
      render();
    };
  };

  const renderSecret = () => {
    const playerIndex = state.revealedPlayerIndex;
    const player = state.players[playerIndex];
    const word = state.words[playerIndex];

    root.innerHTML = `
      <div class="impostor__intro impostor__secret">
        <span class="eyebrow">Sua palavra secreta</span>
        <h2>${player}</h2>
        <p>Memorize a palavra. O outro jogador não deve vê-la.</p>

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
    `;

    root.querySelector('.impostor__secret-word').textContent = word;

    root.querySelector('.impostor__secret-hide').onclick = () => {
      state.statementPlayerIndex = playerIndex;
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

    const truthOption = options.find((option) => option.type === 'truth');
    const bluffOptions = [
      { type: 'strong', label: 'Blefe forte' },
      { type: 'weak', label: 'Blefe fraco' },
      { type: 'random', label: 'Blefe aleatório' }
    ];

    const createOptionButton = (option, label) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'impostor__statement-option';

      const labelElement = document.createElement('span');
      labelElement.textContent = label;

      const wordElement = document.createElement('strong');
      wordElement.textContent = option.word;

      button.append(labelElement, wordElement);

      button.onclick = () => {
        state.statements[playerIndex] = option.word;

        if (playerIndex === 0) {
          state.revealedPlayerIndex = 1;
          state.screen = 'secretPrep';
          render();
          return;
        }

        state.screen = 'declarations';
        render();
      };

      return button;
    };

    const truthSection = document.createElement('div');
    truthSection.className = 'impostor__statement-group impostor__statement-group--truth';

    const truthLabel = document.createElement('span');
    truthLabel.className = 'impostor__statement-group-label';
    truthLabel.textContent = 'Falar a verdade';

    truthSection.append(truthLabel, createOptionButton(truthOption, 'Verdade'));
    optionsRoot.append(truthSection);

    const bluffSection = document.createElement('div');
    bluffSection.className = 'impostor__statement-group impostor__statement-group--bluffs';

    const bluffLabel = document.createElement('span');
    bluffLabel.className = 'impostor__statement-group-label';
    bluffLabel.textContent = 'Escolha um blefe';

    const bluffGrid = document.createElement('div');
    bluffGrid.className = 'impostor__statement-bluffs';

    bluffOptions.forEach(({ type, label }) => {
      const option = options.find((item) => item.type === type);
      if (option) bluffGrid.append(createOptionButton(option, label));
    });

    bluffSection.append(bluffLabel, bluffGrid);
    optionsRoot.append(bluffSection);
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
      state.questionIndex = 0;
      state.questionText = '';
      state.questions = [];
      state.screen = 'question';
      render();
    };
  };

  const isProhibitedQuestion = (question) => {
    const normalized = question
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return (
      /primeira? letra|letra inicial|comeca com|comeca pela/.test(normalized) ||
      /quantas letras|numero de letras|quantidade de letras|tem quantas letras/.test(normalized) ||
      /^((e|eh|é)\s*)?(a|o)?\s*palavra\s+/.test(normalized) ||
      /exatamente\s+/.test(normalized) ||
      /(?:a palavra|palavra)\s+(e|eh|é)\s+/.test(normalized)
    );
  };

  const renderQuestionHistory = () => {
    if (!state.questions.length) return '';

    return `
      <div class="impostor__question-history">
        ${state.questions.map((item, index) => `
          <div class="impostor__question-item">
            <strong>${state.players[item.askerIndex]}</strong>
            <span>Pergunta ${index + 1}: ${item.question}</span>
            <em>${item.answer}</em>
          </div>
        `).join('')}
      </div>
    `;
  };

  const renderQuestion = () => {
    const askerIndex = state.questionIndex % 2;
    const respondentIndex = askerIndex === 0 ? 1 : 0;

    root.innerHTML = `
      <div class="impostor__intro impostor__question">
        <span class="eyebrow">Interrogatório · pergunta ${state.questionIndex + 1} de ${state.questionCount * 2}</span>
        <h2>Vez de ${state.players[askerIndex]}</h2>
        <p>Faça uma pergunta para ${state.players[respondentIndex]}. Não peça uma informação que revele diretamente a palavra.</p>

        ${renderQuestionHistory()}

        <label class="impostor__question-field">
          Sua pergunta
          <textarea class="impostor__question-input" rows="3" maxlength="180" placeholder="Ex.: Essa coisa costuma ser encontrada em casa?"></textarea>
        </label>

        <button type="button" class="btn btn-primary impostor__question-submit">
          Enviar pergunta →
        </button>
        <p class="impostor__feedback" aria-live="polite"></p>
      </div>
    `;

    const input = root.querySelector('.impostor__question-input');
    const feedback = root.querySelector('.impostor__feedback');

    root.querySelector('.impostor__question-submit').onclick = () => {
      const question = input.value.trim();

      if (!question) {
        feedback.textContent = 'Escreva uma pergunta para continuar.';
        input.focus();
        return;
      }

      if (isProhibitedQuestion(question)) {
        feedback.textContent = 'Essa pergunta revela informação diretamente. Pergunte sobre características, usos ou contexto da palavra.';
        input.focus();
        return;
      }

      state.questionText = question;
      state.screen = 'answer';
      render();
    };

    requestAnimationFrame(() => input.focus());
  };

  const renderAnswer = () => {
    const askerIndex = state.questionIndex % 2;
    const respondentIndex = askerIndex === 0 ? 1 : 0;

    root.innerHTML = `
      <div class="impostor__intro impostor__answer">
        <span class="eyebrow">Interrogatório · resposta</span>
        <h2>Vez de ${state.players[respondentIndex]}</h2>
        <p>${state.players[askerIndex]} perguntou:</p>

        <div class="impostor__question-card">
          <strong></strong>
        </div>

        <p>Responda pensando apenas na sua palavra secreta.</p>

        <div class="impostor__answer-options" role="group" aria-label="Resposta">
          <button type="button" class="impostor__answer-option" data-answer="Sim">Sim</button>
          <button type="button" class="impostor__answer-option" data-answer="Não">Não</button>
          <button type="button" class="impostor__answer-option" data-answer="Talvez">Talvez</button>
        </div>
      </div>
    `;

    root.querySelector('.impostor__question-card strong').textContent = state.questionText;

    root.querySelectorAll('[data-answer]').forEach((button) => {
      button.onclick = () => {
        state.questions.push({
          askerIndex,
          respondentIndex,
          question: state.questionText,
          answer: button.dataset.answer
        });

        state.questionText = '';

        if (state.questionIndex === (state.questionCount * 2) - 1) {
          state.judgmentPlayerIndex = 0;
          state.judgments = [null, null];
          state.screen = 'judgment';
          render();
          return;
        }

        state.questionIndex += 1;
        state.screen = 'question';
        render();
      };
    });
  };

  const renderJudgment = () => {
    const playerIndex = state.judgmentPlayerIndex;
    const opponentIndex = playerIndex === 0 ? 1 : 0;
    const player = state.players[playerIndex];
    const opponent = state.players[opponentIndex];
    const opponentOptions = [...new Set(
      (state.theme?.words || []).map((entry) => entry.word)
    )];

    let selectedBluff = null;
    let selectedWord = null;

    root.innerHTML = `
      <div class="impostor__intro impostor__judgment">
        <span class="eyebrow">Julgamento final · ${player}</span>
        <h2>O que você acha de ${opponent}?</h2>
        <p>
          Faça suas duas escolhas em segredo. O outro jogador não verá suas respostas
          até os dois terminarem.
        </p>

        <div class="impostor__judgment-section">
          <span class="impostor__judgment-label">A declaração de ${opponent} era:</span>

          <div class="impostor__judgment-options" role="group" aria-label="Verdade ou blefe">
            <button type="button" class="impostor__judgment-option" data-judgment-bluff="true">
              Verdadeira
            </button>
            <button type="button" class="impostor__judgment-option" data-judgment-bluff="false">
              Blefe
            </button>
          </div>
        </div>

        <div class="impostor__judgment-section impostor__judgment-word-section" hidden>
          <span class="impostor__judgment-label">Qual era a palavra secreta verdadeira de ${opponent}?</span>

          <label class="impostor__judgment-search">
            <span>Pesquisar palavra</span>
            <input
              type="search"
              class="impostor__judgment-search-input"
              placeholder="Digite para pesquisar..."
              autocomplete="off"
              maxlength="40"
            >
          </label>

          <div
            class="impostor__judgment-word-list"
            role="listbox"
            aria-label="Palavras possíveis"
          ></div>
        </div>

        <p class="impostor__judgment-auto-word" hidden></p>

        <button type="button" class="btn btn-primary impostor__judgment-submit" disabled>
          Confirmar julgamento →
        </button>

        <p class="impostor__feedback" aria-live="polite"></p>
      </div>
    `;

    const bluffButtons = [...root.querySelectorAll('[data-judgment-bluff]')];
    const wordSection = root.querySelector('.impostor__judgment-word-section');
    const searchInput = root.querySelector('.impostor__judgment-search-input');
    const wordList = root.querySelector('.impostor__judgment-word-list');
    const autoWord = root.querySelector('.impostor__judgment-auto-word');
    const submit = root.querySelector('.impostor__judgment-submit');

    const updateSubmit = () => {
      submit.disabled = selectedBluff === null || selectedWord === null;
    };

    const renderWordOptions = () => {
      const query = searchInput.value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      const matches = opponentOptions.filter((word) => {
        const normalizedWord = word
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        return normalizedWord.includes(query);
      });

      wordList.innerHTML = '';

      if (!matches.length) {
        const empty = document.createElement('span');
        empty.className = 'impostor__judgment-word-empty';
        empty.textContent = 'Nenhuma palavra encontrada.';
        wordList.append(empty);
        return;
      }

      matches.forEach((word) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'impostor__statement-option';
        button.textContent = word;
        button.setAttribute('role', 'option');

        if (word === selectedWord) {
          button.classList.add('is-selected');
          button.setAttribute('aria-selected', 'true');
        }

        button.onclick = () => {
          selectedWord = word;

          wordList.querySelectorAll('button').forEach((item) => {
            item.classList.remove('is-selected');
            item.setAttribute('aria-selected', 'false');
          });

          button.classList.add('is-selected');
          button.setAttribute('aria-selected', 'true');
          updateSubmit();
        };

        wordList.append(button);
      });
    };

    bluffButtons.forEach((button) => {
      button.onclick = () => {
        selectedBluff = button.dataset.judgmentBluff === 'true';

        bluffButtons.forEach((item) => item.classList.remove('is-selected'));
        button.classList.add('is-selected');

        if (selectedBluff) {
          selectedWord = state.statements[opponentIndex];
          wordSection.hidden = true;
          autoWord.hidden = false;
          autoWord.textContent = `Como você marcou “Verdadeira”, a palavra verdadeira é automaticamente “${selectedWord}”.`;
        } else {
          selectedWord = null;
          wordSection.hidden = false;
          autoWord.hidden = true;
          searchInput.value = '';
          renderWordOptions();
          searchInput.focus();
        }

        updateSubmit();
      };
    });

    searchInput.addEventListener('input', renderWordOptions);

    submit.onclick = () => {
      if (selectedBluff === null || selectedWord === null) return;

      state.judgments[playerIndex] = {
        bluff: selectedBluff,
        word: selectedWord
      };

      if (playerIndex === 0) {
        state.judgmentPlayerIndex = 1;
        state.screen = 'judgment';
        render();
        return;
      }

      state.screen = 'result';
      render();
    };

    updateSubmit();
  };

  const renderResult = () => {
    const actualTruth = state.statements.map((statement, index) => statement === state.words[index]);
    const scores = [0, 0];

    state.players.forEach((player, index) => {
      const opponentIndex = index === 0 ? 1 : 0;
      const judgment = state.judgments[index];

      if (judgment.bluff === actualTruth[opponentIndex]) scores[index] += 1;
      if (judgment.word === state.words[opponentIndex]) scores[index] += 2;

      const opponentJudgment = state.judgments[opponentIndex];
      if (opponentJudgment.bluff !== actualTruth[index]) scores[index] += 1;
    });

    root.innerHTML = `
      <div class="impostor__intro impostor__result">
        <span class="eyebrow">Resultado</span>
        <h2>Hora da verdade</h2>
        <p>Agora todas as informações da rodada podem ser reveladas.</p>

        <div class="impostor__result-words">
          ${state.players.map((player, index) => `
            <div class="impostor__result-card">
              <span>${player}</span>
              <b>Palavra verdadeira: ${state.words[index]}</b>
              <em>Declaração: ${state.statements[index]} · ${actualTruth[index] ? 'Verdadeira' : 'Blefe'}</em>
            </div>
          `).join('')}
        </div>

        <div class="impostor__result-judgments">
          ${state.players.map((player, index) => {
            const opponentIndex = index === 0 ? 1 : 0;
            const judgment = state.judgments[index];
            const bluffHit = judgment.bluff === actualTruth[opponentIndex];
            const wordHit = judgment.word === state.words[opponentIndex];

            return `
              <div class="impostor__result-card">
                <span>${player} julgou ${state.players[opponentIndex]}</span>
                <b>${judgment.bluff ? 'Verdadeira' : 'Blefe'} · ${judgment.word}</b>
                <em>Declaração: ${bluffHit ? 'acertou' : 'errou'} · Palavra: ${wordHit ? 'acertou' : 'errou'}</em>
              </div>
            `;
          }).join('')}
        </div>

        <div class="impostor__scores">
          ${state.players.map((player, index) => `
            <div class="impostor__score">
              <span>${player}</span>
              <strong>${scores[index]} ponto${scores[index] === 1 ? '' : 's'}</strong>
            </div>
          `).join('')}
        </div>

        <button type="button" class="btn btn-primary impostor__new-round">
          Nova rodada →
        </button>
      </div>
    `;

    root.querySelector('.impostor__new-round').onclick = () => {
      if (!pickRound()) return;

      state.revealedPlayerIndex = 0;
      state.statementPlayerIndex = 0;
      state.questionIndex = 0;
      state.questionText = '';
      state.questions = [];
      state.judgmentPlayerIndex = 0;
      state.judgments = [null, null];
      state.screen = 'theme';
      render();
    };
  };


  const pickClassicRound = () => {
    const availableThemes = themes();

    if (!availableThemes.length) return false;

    const theme = state.classicSelectedTheme === 'random'
      ? availableThemes[Math.floor(Math.random() * availableThemes.length)]
      : availableThemes.find((item) => item.id === state.classicSelectedTheme);

    if (!theme || (theme.words || []).length < 3) return false;

    const words = theme.words;
    const secretEntry = words[Math.floor(Math.random() * words.length)];
    const impostorIndex = Math.floor(Math.random() * state.classicPlayers.length);

    let impostorInfo = null;

    if (state.classicDifficulty === 'strong') {
      const options = secretEntry.strong || [];
      impostorInfo = options[Math.floor(Math.random() * options.length)] || null;
    }

    if (state.classicDifficulty === 'weak') {
      const options = secretEntry.weak || [];
      impostorInfo = options[Math.floor(Math.random() * options.length)] || null;
    }

    state.classicTheme = theme;
    state.classicSecretWord = secretEntry.word;
    state.classicImpostorIndex = impostorIndex;
    state.classicImpostorInfo = impostorInfo;
    state.classicRevealIndex = 0;
    state.classicRevealedImpostor = false;
    state.classicRevealedWord = false;

    return true;
  };

  const renderClassicSetup = () => {
    let configTab = 'players';

    root.innerHTML = `
      <div class="impostor__intro">
        <span class="eyebrow">Modo Clássico</span>
        <h2>Preparem a partida</h2>
        <p>Cadastrem os jogadores e escolham o nível de informação do Impostor.</p>

        <div class="impostor__config-tabs" role="tablist">
          <button type="button" class="impostor__config-tab" data-tab="players">👥 Jogadores</button>
          <button type="button" class="impostor__config-tab" data-tab="settings">⚙️ Configuração</button>
        </div>

        <div class="impostor__config-content"></div>

        <button type="button" class="btn btn-primary impostor__classic-continue">Começar partida →</button>

        <button type="button" class="btn btn-secondary impostor__back-to-mode">
          ← Selecionar modo de jogo
        </button>
        <p class="impostor__feedback" aria-live="polite"></p>
      </div>
    `;

    const content = root.querySelector('.impostor__config-content');
    const tabs = [...root.querySelectorAll('.impostor__config-tab')];

    const renderTab = () => {
      tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.tab === configTab));
      content.innerHTML = '';

      if (configTab === 'players') {
        const players = document.createElement('div');
        players.className = 'impostor__players';

        state.classicPlayers.forEach((player, index) => {
          const row = document.createElement('div');
          row.className = 'impostor__classic-player-input';

          const label = document.createElement('label');
          label.textContent = `Jogador ${index + 1}`;

          const input = document.createElement('input');
          input.type = 'text';
          input.maxLength = 30;
          input.placeholder = `Nome do jogador ${index + 1}`;
          input.value = player;
          input.oninput = () => {
            state.classicPlayers[index] = input.value;
          };

          row.append(label);

          if (state.classicPlayers.length > 3) {
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'impostor__classic-player-remove';
            remove.textContent = '×';
            remove.setAttribute('aria-label', `Remover ${player || `jogador ${index + 1}`}`);
            remove.onclick = () => {
              state.classicPlayers.splice(index, 1);
              renderTab();
            };
            row.append(remove);
          }

          label.append(input);
          players.append(row);
        });

        const playerActions = document.createElement('div');
        playerActions.className = 'impostor__classic-player-actions';

        const add = document.createElement('button');
        add.type = 'button';
        add.className = 'impostor__classic-player-add';
        add.textContent = '+ Adicionar jogador';
        add.disabled = state.classicPlayers.length >= 6;
        add.onclick = () => {
          if (state.classicPlayers.length >= 6) return;
          state.classicPlayers.push(`Jogador ${state.classicPlayers.length + 1}`);
          renderTab();
        };

        playerActions.append(add);

        const counter = document.createElement('small');
        counter.textContent = `${state.classicPlayers.length}/6 jogadores`;
        playerActions.append(counter);

        content.append(players, playerActions);
        return;
      }

      const settings = document.createElement('div');
      settings.className = 'impostor__settings';

      const themeField = document.createElement('label');
      themeField.className = 'impostor__settings-field';
      themeField.innerHTML = '<span>Tema das palavras</span>';

      const themeSelect = document.createElement('select');
      themeSelect.className = 'impostor__settings-select';

      const randomOption = document.createElement('option');
      randomOption.value = 'random';
      randomOption.textContent = '🎲 Aleatório';
      themeSelect.append(randomOption);

      themes().forEach((theme) => {
        const option = document.createElement('option');
        option.value = theme.id;
        option.textContent = theme.name;
        themeSelect.append(option);
      });

      themeSelect.value = state.classicSelectedTheme;
      themeSelect.onchange = () => {
        state.classicSelectedTheme = themeSelect.value;
      };
      themeField.append(themeSelect);

      const difficultyField = document.createElement('div');
      difficultyField.className = 'impostor__settings-field';
      difficultyField.innerHTML = '<span>Nível de dificuldade do Impostor</span><small>O Impostor recebe a palavra secreta, uma ligação ou nenhuma informação.</small>';

      const difficultyOptions = document.createElement('div');
      difficultyOptions.className = 'impostor__difficulty-options';

      [
        ['none', '0 infos', 'Não recebe nenhuma informação.'],
        ['strong', 'Info forte', 'Recebe uma ligação forte da palavra.'],
        ['weak', 'Info fraca', 'Recebe uma ligação fraca da palavra.']
      ].forEach(([value, label, description]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'impostor__difficulty-option';
        button.classList.toggle('is-active', state.classicDifficulty === value);
        button.innerHTML = `<strong>${label}</strong><span>${description}</span>`;
        button.onclick = () => {
          state.classicDifficulty = value;
          renderTab();
        };
        difficultyOptions.append(button);
      });

      difficultyField.append(difficultyOptions);
      settings.append(themeField, difficultyField);
      content.append(settings);
    };

    tabs.forEach((tab) => {
      tab.onclick = () => {
        configTab = tab.dataset.tab;
        renderTab();
      };
    });

    root.querySelector('.impostor__classic-continue').onclick = () => {
      const inputs = [...root.querySelectorAll('.impostor__players input')];
      const names = inputs.map((input) => input.value.trim());

      if (names.some((name) => !name)) {
        root.querySelector('.impostor__feedback').textContent =
          'Preencham os nomes dos três jogadores para continuar.';
        return;
      }

      if (new Set(names.map((name) => name.toLowerCase())).size !== names.length) {
        root.querySelector('.impostor__feedback').textContent =
          'Os jogadores precisam ter nomes diferentes.';
        return;
      }

      state.classicPlayers = names;

      if (!pickClassicRound()) {
        root.querySelector('.impostor__feedback').textContent =
          'Não foi possível preparar a rodada. Verifiquem o banco de palavras.';
        return;
      }

      state.screen = 'classicTheme';
      render();
    };

    root.querySelector('.impostor__back-to-mode').onclick = () => {
      state.screen = 'mode';
      render();
    };

    renderTab();
  };

  const renderClassicTheme = () => {
    root.innerHTML = `
      <div class="impostor__intro impostor__theme">
        <span class="eyebrow">Modo Clássico · preparação</span>
        <h2>O tema da rodada é</h2>

        <div class="impostor__theme-card">
          <strong>${state.classicTheme.name}</strong>
        </div>

        <p>
          Todos receberão a palavra secreta individualmente.
          O Impostor receberá apenas o nível de informação escolhido.
        </p>

        <button type="button" class="btn btn-primary impostor__classic-theme-continue">
          Começar distribuição →
        </button>
      </div>
    `;

    root.querySelector('.impostor__classic-theme-continue').onclick = () => {
      state.classicRevealIndex = 0;
      state.screen = 'classicSecretPrep';
      render();
    };
  };

  const renderClassicSecretPrep = () => {
    const player = state.classicPlayers[state.classicRevealIndex] || `Jogador ${state.classicRevealIndex + 1}`;

    root.innerHTML = `
      <div class="impostor__intro impostor__secret-prep">
        <span class="eyebrow">Informação secreta</span>
        <h2>Vez de ${player}</h2>
        <p>Entreguem o celular somente para este jogador.</p>

        <div class="impostor__next-card">
          <strong>Pronto para ver sua informação?</strong>
          <span>Ninguém além de ${player} deve olhar para a tela.</span>
        </div>

        <button type="button" class="btn btn-primary impostor__classic-secret-reveal">
          Revelar minha informação →
        </button>
      </div>
    `;

    root.querySelector('.impostor__classic-secret-reveal').onclick = () => {
      state.screen = 'classicSecret';
      render();
    };
  };

  const renderClassicSecret = () => {
    const index = state.classicRevealIndex;
    const player = state.classicPlayers[index] || `Jogador ${index + 1}`;
    const isImpostor = index === state.classicImpostorIndex;
    const value = isImpostor
      ? (state.classicDifficulty !== 'none' && state.classicImpostorInfo
        ? state.classicImpostorInfo
        : 'Nenhuma informação')
      : state.classicSecretWord;

    const roleLabel = isImpostor ? '👻 VOCÊ É O IMPOSTOR' : '😇 VOCÊ NÃO É O IMPOSTOR';
    const roleTitle = isImpostor
      ? (state.classicDifficulty === 'none' ? 'Você não recebeu a palavra' : 'Sua informação secreta')
      : 'Sua palavra secreta';
    const description = isImpostor
      ? (state.classicDifficulty === 'none'
        ? 'Descubra a palavra pelas pistas sem deixar ninguém perceber.'
        : 'Use esta informação para tentar descobrir a palavra durante a rodada.')
      : 'Memorize a palavra e passe o celular quando terminar.';

    root.innerHTML = `
      <div class="impostor__intro impostor__secret">
        <span class="eyebrow">${isImpostor ? 'Papel secreto' : 'Carta secreta'}</span>
        <h2>${player}</h2>
        <p>${description}</p>

        <button type="button" class="impostor__classic-secret-card ${isImpostor ? 'is-impostor' : 'is-player'}" aria-expanded="false">
          <span class="impostor__classic-card-cover">
            <strong>${isImpostor ? '👻' : '🎭'}</strong>
            <b>Toque para revelar</b>
            <small>Somente ${player}</small>
          </span>
          <span class="impostor__classic-card-content">
            <span class="impostor__classic-role">${roleLabel}</span>
            <strong>${roleTitle}</strong>
            <b class="impostor__secret-word"></b>
            ${isImpostor && state.classicDifficulty !== 'none'
              ? '<small class="impostor__classic-info-label">Sua pista inicial</small>'
              : ''}
          </span>
        </button>

        <p class="impostor__secret-warning">
          Não deixe outro jogador ver a carta revelada.
        </p>

        <button type="button" class="btn btn-primary impostor__classic-secret-hide" disabled>
          Já vi minha carta →
        </button>
      </div>
    `;

    const card = root.querySelector('.impostor__classic-secret-card');
    const hide = root.querySelector('.impostor__classic-secret-hide');
    root.querySelector('.impostor__secret-word').textContent = value;

    card.onclick = () => {
      card.classList.add('is-revealed');
      card.setAttribute('aria-expanded', 'true');
      hide.disabled = false;
      card.onclick = null;
    };

    hide.onclick = () => {
      if (index < state.classicPlayers.length - 1) {
        state.classicRevealIndex += 1;
        state.screen = 'classicSecretPrep';
      } else {
        state.screen = 'classicDiscussion';
      }
      render();
    };
  };

  const renderClassicDiscussion = () => {
    root.innerHTML = `
      <div class="impostor__intro impostor__classic-discussion">
        <span class="eyebrow">Agora é com vocês</span>
        <h2>Conversem e votem</h2>
        <p>
          Deem suas pistas, discutam entre vocês e decidam quem é o Impostor.
          O aplicativo não vai registrar nem conduzir a votação.
        </p>

        <div class="impostor__classic-players">
          ${state.classicPlayers.map((player) => `
            <div class="impostor__classic-player-card">${player}</div>
          `).join('')}
        </div>

        <button type="button" class="btn btn-primary impostor__classic-finish-discussion">
          Já decidiram → revelar resultado
        </button>
      </div>
    `;

    root.querySelector('.impostor__classic-finish-discussion').onclick = () => {
      state.classicRevealedImpostor = false;
      state.classicRevealedWord = false;
      state.screen = 'classicResult';
      render();
    };
  };

  const renderClassicResult = () => {
    root.innerHTML = `
      <div class="impostor__intro impostor__classic-result">
        <span class="eyebrow">Fim da rodada</span>
        <h2>Hora da verdade</h2>
        <p>Revelem primeiro quem era o Impostor. Depois descubram a palavra.</p>

        <div class="impostor__classic-reveal-actions">
          <button type="button" class="btn btn-primary impostor__classic-reveal-impostor">
            Revelar o Impostor
          </button>
          <button type="button" class="btn btn-primary impostor__classic-reveal-word">
            Revelar palavra
          </button>
        </div>

        <div class="impostor__classic-reveal-result" aria-live="polite"></div>

        <button type="button" class="btn btn-primary impostor__classic-new-round">
          Nova rodada →
        </button>
      </div>
    `;

    const result = root.querySelector('.impostor__classic-reveal-result');
    const revealImpostor = root.querySelector('.impostor__classic-reveal-impostor');
    const revealWord = root.querySelector('.impostor__classic-reveal-word');

    const renderReveals = () => {
      result.innerHTML = '';

      if (state.classicRevealedImpostor) {
        const card = document.createElement('div');
        card.className = 'impostor__result-card impostor__result-card--impostor';
        const impostorName = state.classicPlayers[state.classicImpostorIndex] || `Jogador ${state.classicImpostorIndex + 1}`;
        card.innerHTML = `<span>👻 O Impostor era</span><b>${impostorName}</b>`;
        result.append(card);
      }

      if (state.classicRevealedWord) {
        const card = document.createElement('div');
        card.className = 'impostor__result-card';
        card.innerHTML = `<span>A palavra era</span><b>${state.classicSecretWord}</b>`;
        result.append(card);
      }
    };

    revealImpostor.onclick = () => {
      state.classicRevealedImpostor = true;
      revealImpostor.disabled = true;
      renderReveals();
    };

    revealWord.onclick = () => {
      state.classicRevealedWord = true;
      revealWord.disabled = true;
      renderReveals();
    };

    root.querySelector('.impostor__classic-new-round').onclick = () => {
      if (!pickClassicRound()) return;
      state.screen = 'classicTheme';
      render();
    };
  };

  render();

  return root;
}
