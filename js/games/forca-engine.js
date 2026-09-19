/* =========================================================
   FORCA — MOTOR
   Regra central: 6 chances. Apenas erros consomem chances.
========================================================= */

const FORCA_MAX_CHANCES = 6;

const normalizeForca = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ç/gi, 'c')
  .toLowerCase()
  .replace(/[^a-z ]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

function createForcaGame(word) {
  const answer = normalizeForca(word);

  if (!answer) {
    throw new Error('A palavra da Forca não pode ser vazia.');
  }

  return {
    word: answer,
    usedLetters: [],
    chances: FORCA_MAX_CHANCES,
    errors: 0,
    status: 'playing',
    lastAction: null
  };
}

function getForcaProgress(game) {
  return [...game.word].map((letter) =>
    letter === ' ' ? ' ' : (game.usedLetters.includes(letter) ? letter : '')
  );
}

function isForcaWon(game) {
  return getForcaProgress(game).every(Boolean);
}

function isForcaLost(game) {
  return game.chances <= 0;
}

function guessForcaLetter(game, letter) {
  if (!game || game.status !== 'playing') {
    return { accepted: false, reason: 'inactive' };
  }

  const normalized = normalizeForca(letter);

  if (normalized.length !== 1) {
    return { accepted: false, reason: 'invalid' };
  }

  if (game.usedLetters.includes(normalized)) {
    return { accepted: false, reason: 'used' };
  }

  game.usedLetters.push(normalized);

  const correct = game.word.includes(normalized);

  if (!correct) {
    game.chances -= 1;
    game.errors += 1;
  }

  game.lastAction = {
    type: 'letter',
    letter: normalized,
    correct
  };

  if (isForcaWon(game)) {
    game.status = 'won';
  } else if (isForcaLost(game)) {
    game.status = 'lost';
  }

  return {
    accepted: true,
    correct,
    status: game.status,
    chances: game.chances,
    progress: getForcaProgress(game)
  };
}

function guessForcaWord(game, word) {
  if (!game || game.status !== 'playing') {
    return { accepted: false, reason: 'inactive' };
  }

  const normalized = normalizeForca(word);

  if (!normalized || normalized.length !== game.word.length) {
    return { accepted: false, reason: 'invalid' };
  }

  const correct = normalized === game.word;

  if (correct) {
    game.usedLetters = [...new Set([...game.usedLetters, ...game.word])];
    game.status = 'won';
  } else {
    game.chances -= 1;
    game.errors += 1;
    game.lastAction = {
      type: 'word',
      word: normalized,
      correct: false
    };

    if (isForcaLost(game)) {
      game.status = 'lost';
    }
  }

  if (correct) {
    game.lastAction = {
      type: 'word',
      word: normalized,
      correct: true
    };
  }

  return {
    accepted: true,
    correct,
    status: game.status,
    chances: game.chances,
    progress: getForcaProgress(game)
  };
}

function getForcaKeyboardState(game) {
  return game.usedLetters.reduce((state, letter) => {
    state[letter] = game.word.includes(letter) ? 'correct' : 'absent';
    return state;
  }, {});
}
