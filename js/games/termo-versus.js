/* =========================================================
   TERMO VERSUS
   Dois jogadores: um define a palavra, o outro tenta descobrir.
   O Termo original permanece isolado em termo.js.
========================================================= */

function renderTermoVersus() {
  const root = document.createElement('section');
  root.className = 'termo-versus';

  const syncTopbarHeight = () => {
    const topbar = document.getElementById('topbar');

    if (!topbar) {
      root.style.setProperty('--termoversus-topbar-height', '0px');
      return;
    }

    const mobileLandscape = window.matchMedia(
      '(max-width: 899px) and (orientation: landscape)'
    ).matches;
    const navOpen = document.body.classList.contains('game-nav-open');
    const height = mobileLandscape && !navOpen
      ? 0
      : topbar.getBoundingClientRect().height;

    root.style.setProperty(
      '--termoversus-topbar-height',
      height + 'px'
    );
  };


  const syncLongMobileLayout = () => {
    const longMobileLandscape =
      window.innerWidth <= 899 &&
      window.matchMedia('(orientation: landscape)').matches &&
      state.wordLength > 8;

    root.classList.toggle(
      'termo-versus--long-mobile',
      longMobileLandscape
    );
  };

  const MAX_ATTEMPTS = 6;

  const state = {
    screen: 'config',
    wordLength: 5,
    target: '',
    currentGuess: '',
    editIndex: 0,
    guesses: [],
    statuses: [],
    status: 'playing',
    message: '',
    revealing: false
  };

  const normalize = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/gi, 'c')
    .toLowerCase()
    .replace(/[^a-z]/g, '');

  const playSound = (method) => {
    if (
      typeof sound !== 'undefined' &&
      sound &&
      typeof sound[method] === 'function'
    ) {
      sound[method]();
    }
  };

  const evaluateGuess = (guess, target) => {
    const result = Array(state.wordLength).fill('absent');
    const remaining = {};

    for (let i = 0; i < state.wordLength; i += 1) {
      const g = guess[i];
      const t = target[i];

      if (g === t) {
        result[i] = 'correct';
      } else {
        remaining[t] = (remaining[t] || 0) + 1;
      }
    }

    for (let i = 0; i < state.wordLength; i += 1) {
      if (result[i] === 'correct') continue;

      const g = guess[i];

      if (remaining[g] > 0) {
        result[i] = 'present';
        remaining[g] -= 1;
      }
    }

    return result;
  };

  const renderConfig = () => {
    root.innerHTML = `
      <header class="termo-versus__header">
        <span class="termo-versus__eyebrow">Cúmplices · versus</span>
        <h1 class="termo-versus__title">Termo</h1>
      </header>

      <main class="termo-versus__config" aria-label="Configuração do Termo Versus">
        <div class="termo-versus__intro">
          <span class="termo-versus__kicker">Versus</span>
          <h2>Definam o desafio</h2>
          <p>O Jogador 1 escolhe o tamanho da palavra e depois define o desafio.</p>
        </div>

        <section class="termo-versus__panel">
          <div class="termo-versus__field-title">
            <strong>Quantidade de letras</strong>
            <span>Escolha o tamanho da palavra.</span>
          </div>

          <div class="termo-versus__length-picker" role="group" aria-label="Quantidade de letras"></div>

          <button type="button" class="termo-versus__primary">
            Continuar →
          </button>
        </section>
      </main>
    `;

    const picker = root.querySelector('.termo-versus__length-picker');

    for (let length = 5; length <= 12; length += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'termo-versus__length-button';
      button.textContent = String(length);
      button.setAttribute('aria-label', `${length} letras`);
      button.classList.toggle(
        'is-active',
        length === state.wordLength
      );
      button.onclick = () => {
        state.wordLength = length;
        picker.querySelectorAll('button').forEach((item) => {
          item.classList.toggle(
            'is-active',
            Number(item.textContent) === state.wordLength
          );
        });
      };
      picker.append(button);
    }

    root.querySelector('.termo-versus__primary').onclick = () => {
      state.target = '';
      state.currentGuess = '';
      state.editIndex = 0;
      state.guesses = [];
      state.statuses = [];
      state.status = 'playing';
      state.message = '';
      state.revealing = false;
      state.screen = 'define';
      render();
    };
  };

  const renderDefine = () => {
    root.innerHTML = `
      <header class="termo-versus__header">
        <span class="termo-versus__eyebrow">Cúmplices · versus</span>
        <h1 class="termo-versus__title">Termo</h1>
      </header>

      <main class="termo-versus__config" aria-label="Definição da palavra">
        <div class="termo-versus__intro">
          <span class="termo-versus__kicker">Jogador 1</span>
          <h2>Defina a palavra</h2>
          <p>Escolha uma palavra com exatamente <strong>${state.wordLength} letras</strong>. Os acentos serão ignorados.</p>
        </div>

        <section class="termo-versus__panel">
          <label class="termo-versus__word-label" for="termoversus-word">
            <span>Palavra secreta</span>
            <input
              id="termoversus-word"
              class="termo-versus__word-input"
              type="text"
              maxlength="${state.wordLength}"
              autocomplete="off"
              autocapitalize="none"
              spellcheck="false"
              placeholder="${'•'.repeat(state.wordLength)}"
            >
          </label>

          <p class="termo-versus__message" aria-live="polite">${state.message}</p>

          <button type="button" class="termo-versus__primary">
            Confirmar palavra →
          </button>
        </section>
      </main>
    `;

    const input = root.querySelector('.termo-versus__word-input');
    input.value = state.target;

    input.oninput = () => {
      state.target = input.value;
      state.message = '';
    };

    input.onkeydown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        confirmTarget();
      }
    };

    root.querySelector('.termo-versus__primary').onclick = confirmTarget;

    requestAnimationFrame(() => input.focus());
  };

  const confirmTarget = () => {
    const target = normalize(state.target);

    if (target.length !== state.wordLength) {
      state.message = `A palavra precisa ter exatamente ${state.wordLength} letras.`;
      render();
      return;
    }

    state.target = target;
    state.currentGuess = '';
    state.editIndex = 0;
    state.guesses = [];
    state.statuses = [];
    state.status = 'playing';
    state.message = '';
    state.revealing = false;
    state.screen = 'pass';
    render();
  };

  const renderPass = () => {
    root.innerHTML = `
      <header class="termo-versus__header">
        <span class="termo-versus__eyebrow">Cúmplices · versus</span>
        <h1 class="termo-versus__title">Termo</h1>
      </header>

      <main class="termo-versus__pass" aria-label="Passar o celular">
        <div class="termo-versus__pass-icon">🔄</div>
        <span class="termo-versus__kicker">Agora é com o Jogador 2</span>
        <h2>Passe o celular</h2>
        <p>A palavra já foi definida. O Jogador 2 terá até seis tentativas para descobrir.</p>
        <button type="button" class="termo-versus__primary">
          Estou pronto →
        </button>
      </main>
    `;

    root.querySelector('.termo-versus__primary').onclick = () => {
      state.screen = 'play';
      state.currentGuess = '';
      state.editIndex = 0;
      state.message = '';
      render();
    };
  };

  const renderBoard = () => {
    const board = root.querySelector('[data-role="board"]');
    if (!board) return;

    board.innerHTML = '';

    for (let row = 0; row < MAX_ATTEMPTS; row += 1) {
      const rowEl = document.createElement('div');
      rowEl.className = 'termo-versus__row';

      const guess = state.guesses[row] || (
        row === state.guesses.length
          ? state.currentGuess
          : ''
      );

      const statuses = state.statuses[row] || [];

      for (let i = 0; i < state.wordLength; i += 1) {
        const cell = document.createElement('div');
        cell.className = 'termo-versus__cell';

        const char = guess[i] || '';
        cell.textContent = char.toUpperCase();

        if (char) cell.classList.add('is-filled');

        if (statuses[i]) {
          cell.classList.add(`is-${statuses[i]}`);
        }

        if (
          row === state.guesses.length &&
          state.status === 'playing' &&
          !state.revealing
        ) {
          if (i === state.editIndex) {
            cell.classList.add('is-editing');
          }

          cell.addEventListener('click', () => {
            state.editIndex = i;
            renderBoard();
          });
        }

        rowEl.append(cell);
      }

      board.append(rowEl);
    }
  };

  const renderKeyboard = () => {
    const keyboard = root.querySelector('[data-role="keyboard"]');
    if (!keyboard) return;

    keyboard.innerHTML = '';

    const rows = [
      ['Q','W','E','R','T','Y','U','I','O','P'],
      ['A','S','D','F','G','H','J','K','L'],
      ['Z','X','C','V','B','N','M']
    ];

    rows.forEach((row, rowIndex) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'termo-versus__key-row';

      if (rowIndex === 1) {
        rowEl.classList.add('termo-versus__key-row--offset');
      }

      if (rowIndex === 2) {
        rowEl.classList.add('termo-versus__key-row--last');
      }

      row.forEach((key) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'termo-versus__key';
        button.textContent = key;

        const normalized = key.toLowerCase();
        const usedStatus = {};

        state.statuses.forEach((rowStatuses, rowIndexValue) => {
          const guess = state.guesses[rowIndexValue] || '';

          for (let i = 0; i < guess.length; i += 1) {
            if (normalize(guess[i]) !== normalized) continue;

            const current = rowStatuses[i];

            if (
              current === 'correct' ||
              (current === 'present' && !usedStatus[normalized])
            ) {
              usedStatus[normalized] = current;
            } else if (!usedStatus[normalized]) {
              usedStatus[normalized] = 'absent';
            }
          }
        });

        if (usedStatus[normalized]) {
          button.classList.add(`is-${usedStatus[normalized]}`);
        }

        button.disabled =
          state.status !== 'playing' ||
          state.revealing;

        button.onclick = () => pressKey(normalized);
        rowEl.append(button);
      });

      if (rowIndex === 2) {
        const backspace = document.createElement('button');
        backspace.type = 'button';
        backspace.className = 'termo-versus__key termo-versus__key--special';
        backspace.textContent = '⌫';
        backspace.disabled =
          state.status !== 'playing' ||
          state.revealing;
        backspace.onclick = () => pressKey('backspace');
        rowEl.append(backspace);

        const enter = document.createElement('button');
        enter.type = 'button';
        enter.className = 'termo-versus__key termo-versus__key--special';
        enter.textContent = '↵';
        enter.disabled =
          state.status !== 'playing' ||
          state.revealing;
        enter.onclick = () => pressKey('enter');
        rowEl.append(enter);
      }

      keyboard.append(rowEl);
    });
  };

  const revealRow = (rowIndex, done) => {
    const row = root.querySelector(
      `.termo-versus__row:nth-child(${rowIndex + 1})`
    );

    if (!row) {
      done();
      return;
    }

    const cells = [...row.querySelectorAll('.termo-versus__cell')];

    cells.forEach((cell, index) => {
      window.setTimeout(() => {
        cell.classList.add('is-revealing');

        window.setTimeout(() => {
          const status = state.statuses[rowIndex][index];
          if (status) cell.classList.add(`is-${status}`);
        }, 250);

        window.setTimeout(() => {
          cell.classList.remove('is-revealing');
          cell.classList.add('is-filled');
        }, 500);
      }, index * 90);
    });

    window.setTimeout(
      done,
      cells.length * 90 + 560
    );
  };


  const animateResultRow = (className) => {
    const row = root.querySelector(
      `.termo-versus__row:nth-child(${state.guesses.length})`
    );

    if (!row) return;

    const cells = [...row.querySelectorAll('.termo-versus__cell')];

    cells.forEach((cell, index) => {
      window.setTimeout(() => {
        cell.classList.add(className);

        window.setTimeout(() => {
          cell.classList.remove(className);
        }, className === 'is-win' ? 600 : 500);
      }, index * 80);
    });
  };

  const submitGuess = () => {
    if (
      state.status !== 'playing' ||
      state.revealing
    ) {
      return;
    }

    const guess = normalize(state.currentGuess);

    if (guess.length !== state.wordLength) {
      state.message = `Digite uma palavra de ${state.wordLength} letras.`;
      render();
      return;
    }

    const rowIndex = state.guesses.length;
    const statuses = evaluateGuess(
      guess,
      state.target
    );

    state.guesses.push(guess);
    state.statuses.push(statuses);
    state.currentGuess = '';
    state.editIndex = 0;
    state.revealing = true;
    state.message = '';
    render();

    revealRow(rowIndex, () => {
      state.revealing = false;

      if (guess === state.target) {
        state.status = 'won';
        state.message =
          `Acertou em ${state.guesses.length} ${state.guesses.length === 1 ? 'tentativa' : 'tentativas'}!`;
        playSound('correct');
        render();
        animateResultRow('is-win');
        return;
      }

      if (state.guesses.length >= MAX_ATTEMPTS) {
        state.status = 'lost';
        state.message =
          `A palavra era ${state.target.toUpperCase()}.`;
        playSound('wrong');
        render();
        animateResultRow('is-loss');
        return;
      }

      state.message = '';
      render();
    });
  };

  const pressKey = (key) => {
    if (
      state.status !== 'playing' ||
      state.revealing
    ) {
      return;
    }

    playSound('click');

    if (key === 'backspace') {
      if (
        state.editIndex > 0 &&
        !state.currentGuess[state.editIndex]
      ) {
        state.editIndex -= 1;
      }

      if (state.currentGuess[state.editIndex]) {
        state.currentGuess =
          state.currentGuess.slice(0, state.editIndex) +
          state.currentGuess.slice(state.editIndex + 1);
      }
    } else if (key === 'enter') {
      submitGuess();
      return;
    } else if (/^[a-z]$/.test(key)) {
      const index = Math.min(
        state.editIndex,
        state.wordLength - 1
      );

      const chars = state.currentGuess
        .padEnd(state.wordLength, ' ')
        .split('');

      chars[index] = key;

      state.currentGuess = chars
        .join('')
        .replace(/\s+$/, '');

      state.editIndex = Math.min(
        index + 1,
        state.wordLength - 1
      );
    } else {
      return;
    }

    renderBoard();
  };

  const keydown = (event) => {
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      pressKey('backspace');
    } else if (event.key === 'Enter') {
      event.preventDefault();
      pressKey('enter');
    } else if (/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
      pressKey(normalize(event.key));
    }
  };

  const renderPlay = () => {
    window.removeEventListener('keydown', keydown);
    root.style.setProperty('--termoversus-word-length', String(state.wordLength));
    root.innerHTML = `
      <header class="termo-versus__header">
        <span class="termo-versus__eyebrow">Cúmplices · versus</span>
        <h1 class="termo-versus__title">Termo</h1>
      </header>

      <main class="termo-versus__game" aria-label="Termo Versus">
        <div class="termo-versus__turn">
          <span class="termo-versus__kicker">Jogador 2</span>
          <strong>Descubra a palavra</strong>
          <span>6 tentativas · ${state.wordLength} letras</span>
        </div>

        <div class="termo-versus__board" data-role="board" aria-label="Grade de tentativas"></div>

        <p class="termo-versus__message" data-role="message">${state.message}</p>

        <div class="termo-versus__keyboard" data-role="keyboard" aria-label="Teclado virtual"></div>

        <div class="termo-versus__actions" data-role="actions"></div>
      </main>
    `;

    renderBoard();
    renderKeyboard();

    const message = root.querySelector('[data-role="message"]');
    const actions = root.querySelector('[data-role="actions"]');

    if (state.status === 'playing') {
      const hint = document.createElement('span');
      hint.className = 'termo-versus__helper';
      hint.textContent = state.message || 'Verde: posição certa · Amarelo: existe em outra posição.';
      message.textContent = state.message;
      actions.append(hint);
    } else {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'termo-versus__primary';
      button.textContent = '↻ Nova palavra';
      button.onclick = () => {
        state.target = '';
        state.currentGuess = '';
        state.editIndex = 0;
        state.guesses = [];
        state.statuses = [];
        state.status = 'playing';
        state.message = '';
        state.revealing = false;
        state.screen = 'define';
        render();
      };

      const secondary = document.createElement('button');
      secondary.type = 'button';
      secondary.className = 'termo-versus__secondary';
      secondary.textContent = '⚙️ Mudar tamanho';
      secondary.onclick = () => {
        state.screen = 'config';
        state.target = '';
        state.currentGuess = '';
        state.guesses = [];
        state.statuses = [];
        state.message = '';
        state.revealing = false;
        render();
      };

      actions.append(button, secondary);
    }

    window.addEventListener('keydown', keydown);
  };

  const render = () => {
    window.removeEventListener('keydown', keydown);
    root.innerHTML = '';
    syncTopbarHeight();
    syncLongMobileLayout();

    if (state.screen === 'config') renderConfig();
    else if (state.screen === 'define') renderDefine();
    else if (state.screen === 'pass') renderPass();
    else renderPlay();
  };

  const handleViewportChange = () => {
    syncTopbarHeight();
    syncLongMobileLayout();
  };

  root.cleanup = () => {
    window.removeEventListener('keydown', keydown);
    window.removeEventListener('resize', handleViewportChange);
    window.removeEventListener('orientationchange', handleViewportChange);
  };

  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('orientationchange', handleViewportChange);
  render();

  return root;
}
