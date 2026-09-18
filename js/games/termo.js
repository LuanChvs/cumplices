/* =========================================================
   TERMO
   Jogo de palavras de 5 letras, inspirado nas regras do Termo.
========================================================= */

function renderTermo() {
  const root = document.createElement('section');
  root.className = 'termo';

  const STORAGE_NAME = 'termo.game';
  const MAX_ROWS = 6;
  const WORD_LENGTH = 5;

  const state = {
    word: '',
    guesses: [],
    currentGuess: '',
    status: 'playing',
    isRevealing: false,
    editIndex: 0
  };

  const normalize = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/gi, 'c')
    .toLowerCase();

  const getWords = () => (window.DATA?.termo?.words || [])
    .map(normalize)
    .filter(word => word.length === WORD_LENGTH);

  const getOriginalWords = () => (window.DATA?.termo?.words || [])
    .filter(word => normalize(word).length === WORD_LENGTH);

  const getDailyIndex = (length) => {
    const start = Date.UTC(2026, 0, 1);
    const today = new Date();
    const current = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const days = Math.floor((current - start) / 86400000);
    return ((days % length) + length) % length;
  };

  const chooseWord = () => {
    const originals = getOriginalWords();
    if (!originals.length) return '';
    return originals[getDailyIndex(originals.length)];
  };

  const load = () => storageGet(STORAGE_NAME, null);

  const save = () => storageSet(STORAGE_NAME, {
    word: state.word,
    guesses: state.guesses,
    currentGuess: state.currentGuess,
    status: state.status
  });

  const letterStatus = (guess, target) => {
    const result = Array(WORD_LENGTH).fill('absent');
    const remaining = {};

    for (let i = 0; i < WORD_LENGTH; i += 1) {
      const g = guess[i];
      const t = target[i];

      if (g === t) {
        result[i] = 'correct';
      } else {
        remaining[t] = (remaining[t] || 0) + 1;
      }
    }

    for (let i = 0; i < WORD_LENGTH; i += 1) {
      if (result[i] === 'correct') continue;

      const g = guess[i];

      if (remaining[g] > 0) {
        result[i] = 'present';
        remaining[g] -= 1;
      }
    }

    return result;
  };

  const keyboardRank = { absent: 1, present: 2, correct: 3 };
  const keyboardState = {};

  root.innerHTML = `
    <header class="termo__header">
      <span class="termo__eyebrow">Cúmplices · palavra do dia</span>
      <h1 class="termo__title">Termo</h1>
    </header>

    <main class="termo__game" aria-label="Jogo Termo">
      <div class="termo__board" data-role="board" aria-label="Grade de tentativas"></div>
      <div class="termo__keyboard" data-role="keyboard" aria-label="Teclado virtual"></div>
      <p class="termo__message" data-role="message" aria-live="polite"></p>
      <div class="termo__actions" data-role="actions"></div>
    </main>
  `;

  const board = root.querySelector('[data-role="board"]');
  const keyboard = root.querySelector('[data-role="keyboard"]');
  const message = root.querySelector('[data-role="message"]');
  const actions = root.querySelector('[data-role="actions"]');

  const keyRows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M']
  ];

  const updateKeyboard = () => {
    keyboard.querySelectorAll('[data-key]').forEach((button) => {
      const key = button.dataset.key;
      button.classList.remove('is-absent','is-present','is-correct');
      const status = keyboardState[key];
      if (status) button.classList.add(`is-${status}`);
    });
  };

  const renderBoard = (revealingRow = -1) => {
    board.innerHTML = '';

    for (let row = 0; row < MAX_ROWS; row += 1) {
      const guess = state.guesses[row] || (row === state.guesses.length ? state.currentGuess : '');
      const isRevealingRow = row === revealingRow;
      const statuses = row < state.guesses.length && !isRevealingRow
        ? letterStatus(normalize(guess), normalize(state.word))
        : [];

      const rowEl = document.createElement('div');
      rowEl.className = 'termo__row';

      for (let i = 0; i < WORD_LENGTH; i += 1) {
        const cell = document.createElement('div');
        cell.className = 'termo__cell';
        const char = guess[i] || '';
        cell.textContent = char.toUpperCase();
        cell.dataset.index = String(i);

        if (statuses[i]) cell.classList.add(`is-${statuses[i]}`);
        if (char) cell.classList.add('is-filled');

        if (row === state.guesses.length && state.status === 'playing') {
          cell.addEventListener('click', () => {
            state.editIndex = i;
            renderBoard();
          });
          if (i === state.editIndex) cell.classList.add('is-editing');
        }

        rowEl.appendChild(cell);
      }

      board.appendChild(rowEl);
    }
  };

  const renderKeyboard = () => {
    keyboard.innerHTML = '';

    keyRows.forEach((row, rowIndex) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'termo__key-row';

      if (rowIndex === 1) rowEl.classList.add('termo__key-row--offset');
      if (rowIndex === 2) rowEl.classList.add('termo__key-row--last');

      row.forEach((key) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'termo__key';
        button.dataset.key = key.toLowerCase();
        button.textContent = key;
        button.addEventListener('click', () => pressKey(key.toLowerCase()));
        rowEl.appendChild(button);
      });

      const special = rowIndex === 2 ? [
        ['⌫', 'backspace'],
        ['↵', 'enter']
      ] : [];

      special.forEach(([label, action]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'termo__key termo__key--special';
        button.dataset.action = action;
        button.textContent = label;
        button.addEventListener('click', () => pressKey(action));
        rowEl.appendChild(button);
      });

      keyboard.appendChild(rowEl);
    });

    updateKeyboard();
  };

  const updateKeyboardState = (guess) => {
    const statuses = letterStatus(normalize(guess), normalize(state.word));

    for (let i = 0; i < WORD_LENGTH; i += 1) {
      const key = normalize(guess[i]);
      const status = statuses[i];
      if (!key) continue;

      if (!keyboardState[key] || keyboardRank[status] > keyboardRank[keyboardState[key]]) {
        keyboardState[key] = status;
      }
    }
  };

  const setMessage = (text) => {
    message.textContent = text;
  };

  const endGame = (won) => {
    state.status = won ? 'won' : 'lost';
    stopInput();
    save();

    if (won) {
      setMessage(`Acertou em ${state.guesses.length} ${state.guesses.length === 1 ? 'tentativa' : 'tentativas'}!`);
      if (typeof sound !== 'undefined') sound.correct();
    } else {
      setMessage(`A palavra era ${state.word.toUpperCase()}.`);
      if (typeof sound !== 'undefined') sound.wrong();
    }

    actions.innerHTML = '';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'termo__new-button';
    button.textContent = 'Novo jogo';
    button.addEventListener('click', () => {
      state.word = chooseWord();
      state.guesses = [];
      state.currentGuess = '';
      state.status = 'playing';
      state.isRevealing = false;
      state.editIndex = 0;
      Object.keys(keyboardState).forEach(key => delete keyboardState[key]);
      setMessage('');
      actions.innerHTML = '';
      startInput();
      renderBoard();
      renderKeyboard();
      save();
    });
    actions.appendChild(button);
  };

  const revealGuess = (rowIndex, guess, done) => {
    const rowEl = board.children[rowIndex];
    if (!rowEl) {
      done();
      return;
    }

    const cells = Array.from(rowEl.querySelectorAll('.termo__cell'));
    const statuses = letterStatus(normalize(guess), normalize(state.word));

    cells.forEach((cell) => cell.classList.remove('is-filled'));

    const revealNext = (index) => {
      if (index >= cells.length) {
        done();
        return;
      }

      const cell = cells[index];
      const status = statuses[index];

      cell.classList.add('is-revealing');

      window.setTimeout(() => {
        cell.classList.add(`is-${status}`);
      }, 450);

      window.setTimeout(() => {
        cell.classList.remove('is-revealing');
        cell.classList.add('is-filled');
        window.setTimeout(() => revealNext(index + 1), 100);
      }, 900);
    };

    revealNext(0);
  };

  const submitGuess = () => {
    if (state.status !== 'playing' || state.isRevealing) return;

    const guess = normalize(state.currentGuess);

    if (guess.length !== WORD_LENGTH) {
      setMessage('Digite uma palavra de 5 letras.');
      return;
    }

    if (!getWords().includes(guess)) {
      setMessage('Essa palavra não está na lista.');
      return;
    }

    const rowIndex = state.guesses.length;
    state.guesses.push(guess);
    state.currentGuess = '';
    state.editIndex = 0;
    state.isRevealing = true;
    setMessage('');
    renderBoard(rowIndex);

    revealGuess(rowIndex, guess, () => {
      state.isRevealing = false;
      updateKeyboardState(guess);
      updateKeyboard();

      if (guess === normalize(state.word)) {
        endGame(true);
        return;
      }

      if (state.guesses.length >= MAX_ROWS) {
        endGame(false);
        return;
      }

      save();
    });
  };

  const pressKey = (key) => {
    if (state.status !== 'playing' || state.isRevealing) return;

    if (typeof sound !== 'undefined') sound.click();

    if (key === 'backspace') {
      if (state.editIndex > 0 && !state.currentGuess[state.editIndex]) {
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
    } else if (/^[a-zA-Z]$/.test(key)) {
      const index = Math.min(state.editIndex, WORD_LENGTH - 1);
      const chars = state.currentGuess.padEnd(WORD_LENGTH, ' ').split('');
      chars[index] = key.toLowerCase();

      state.currentGuess = chars.join('').replace(/\s+$/, '');
      state.editIndex = Math.min(index + 1, WORD_LENGTH - 1);
    } else {
      return;
    }

    renderBoard();
    save();
  };

  const keydown = (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === 'Backspace') {
      event.preventDefault();
      pressKey('backspace');
    } else if (event.key === 'Enter') {
      event.preventDefault();
      pressKey('enter');
    } else if (/^[a-zA-ZçÇáàãâéêíóôõúüÁÀÃÂÉÊÍÓÔÕÚÜ]$/.test(event.key)) {
      event.preventDefault();
      pressKey(normalize(event.key));
    }
  };

  const startInput = () => {
    window.addEventListener('keydown', keydown);
  };

  const stopInput = () => {
    window.removeEventListener('keydown', keydown);
  };

  const stored = load();
  const dailyWord = chooseWord();

  if (stored && stored.word === dailyWord && Array.isArray(stored.guesses)) {
    state.word = stored.word;
    state.guesses = stored.guesses;
    state.currentGuess = stored.currentGuess || '';
    state.editIndex = Math.min(state.currentGuess.length, WORD_LENGTH - 1);
    state.status = stored.status || 'playing';
    state.isRevealing = false;
  } else {
    state.word = dailyWord;
    state.guesses = [];
    state.currentGuess = '';
    state.status = 'playing';
  }

  state.guesses.forEach(updateKeyboardState);
  renderBoard();
  renderKeyboard();

  if (state.status === 'won') {
    setMessage(`Acertou em ${state.guesses.length} ${state.guesses.length === 1 ? 'tentativa' : 'tentativas'}!`);
    endGame(true);
  } else if (state.status === 'lost') {
    setMessage(`A palavra era ${state.word.toUpperCase()}.`);
    endGame(false);
  } else {
    startInput();
  }

  root.cleanup = stopInput;
  return root;
}
