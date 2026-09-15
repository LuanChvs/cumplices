/* =========================================================
   GAME CORE — base comum para os jogos
========================================================= */

function createGameState(initialState = {}) {
    return {
      started: false,
      ended: false,
      ...initialState
    };
  }
  
  function startGame(state) {
    state.started = true;
    state.ended = false;
    return state;
  }
  
  function endGame(state) {
    state.ended = true;
    return state;
  }
  
  function resetGame(state, initialState = {}) {
    Object.keys(state).forEach(key => {
      delete state[key];
    });
  
    Object.assign(
      state,
      createGameState(initialState)
    );
  
    return state;
  }