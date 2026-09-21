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
    statementPlayerIndex: 0,
    questionIndex: 0,
    questionText: '',
    questions: [],
    judgmentPlayerIndex: 0,
    judgments: [null, null]
  };

  const themes = () => window.DATA?.impostor?.themes || [];

  const pickRound = () => {
    const availableThemes = themes();

    if (!availableThemes.length) return false;

    const theme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
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

      if (!entry) return [secretWord];

      const strongCandidates = (entry.strong || [])
        .filter((word) => word !== secretWord && word !== opponentWord);
      const weakCandidates = (entry.weak || [])
        .filter((word) => word !== secretWord && word !== opponentWord);

      const strong = strongCandidates[Math.floor(Math.random() * strongCandidates.length)];
      const weak = weakCandidates[Math.floor(Math.random() * weakCandidates.length)];

      if (!strong || !weak) return [secretWord];

      const blocked = new Set([secretWord, opponentWord, strong, weak]);
      const randomCandidates = wordPool.filter((word) => !blocked.has(word));
      const randomWord = randomCandidates[Math.floor(Math.random() * randomCandidates.length)];

      if (!randomWord) return [secretWord, strong, weak];

      return [secretWord, strong, weak, randomWord]
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
            <span>Para 3 ou mais jogadores · em breve</span>
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
      root.querySelector('.impostor__mode-feedback').textContent =
        'O Modo Normal será disponibilizado em uma próxima etapa.';
    };
  };

  const renderDuoSetup = () => {
    root.innerHTML = `
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
    `;

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
    root.innerHTML = `
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

    options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'impostor__statement-option';
      button.textContent = option;
      button.onclick = () => {
        state.statements[playerIndex] = option;

        if (playerIndex === 0) {
          state.revealedPlayerIndex = 1;
          state.screen = 'secretPrep';
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
        <span class="eyebrow">Interrogatório · ${state.questionIndex + 1} de 6</span>
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

        if (state.questionIndex === 5) {
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
      (state.theme?.pairs || []).flat()
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

  render();

  return root;
}
