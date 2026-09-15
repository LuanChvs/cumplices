/* =========================================================
   SINTONIA
========================================================= */

function renderSintonia() {
  const wrap = el(`
    <div>
      <div id="gameHeader"></div>

      <div class="panel">
        <div class="wheel-stage">
          <div class="wheel-pointer"></div>
          <div class="wheel-ring" id="wheelRing"></div>
          <div class="category-ring" id="catRing"></div>
        </div>

        <div class="sintonia-actions" id="spinButtonSlot"></div>

        <div id="questionSlot"></div>
      </div>
    </div>
  `);

  const catRing = wrap.querySelector('#catRing');
  const wheelRing = wrap.querySelector('#wheelRing');
  const spinButtonSlot = wrap.querySelector('#spinButtonSlot');
  const questionSlot = wrap.querySelector('#questionSlot');
  const gameHeader = wrap.querySelector('#gameHeader');

  gameHeader.appendChild(
    createGameHeader({
      title: 'Sintonia',
      description: 'Girem a roleta. Quando ela parar, leiam a pergunta em voz alta e respondam ao mesmo tempo, na contagem de três. Ver se combinam é a graça.'
    })
  );

  const spinBtn = uiButton({
    text: 'Girar a roleta',
    className: 'btn btn-primary'
  });

  spinButtonSlot.appendChild(spinBtn);

  const game = createGameState({
    rotation: 0,
    spinning: false,
    currentCategory: null
  });


  SINTONIA.forEach((cat, i) => {
    const chip = document.createElement('div');

    chip.className = 'cat-chip';
    chip.textContent = cat.nome;
    chip.dataset.i = i;

    catRing.appendChild(chip);
  });


  function lightUp(i) {
    catRing.querySelectorAll('.cat-chip').forEach((c, ci) => {
      c.classList.toggle('lit', ci === i);
    });
  }


  function askQuestion(catIndex) {
    const cat = SINTONIA[catIndex];
    const q = pick(cat.perguntas);

    questionSlot.innerHTML = `
      <div class="question-card">
        <p class="cat-name">${cat.nome}</p>

        <p>${q}</p>

        <div class="btn-row">
          <button class="btn btn-ghost" id="newQBtn">
            Nova pergunta
          </button>

          <button class="btn btn-primary" id="spinAgainBtn">
            Girar de novo
          </button>
        </div>
      </div>
    `;

    questionSlot
      .querySelector('#newQBtn')
      .addEventListener('click', () => {
        askQuestion(catIndex);
      });

    questionSlot
      .querySelector('#spinAgainBtn')
      .addEventListener('click', () => {
        questionSlot.innerHTML = '';
        game.ended = false;
        spin();
      });
  }


  function spin() {
    if (game.spinning) {
      return;
    }

    game.spinning = true;

    startGame(game);

    spinBtn.disabled = true;
    questionSlot.innerHTML = '';

    const target = Math.floor(
      Math.random() * SINTONIA.length
    );

    game.currentCategory = target;

    /*
      Cada categoria ocupa 60° da roleta.

      0° começa no topo, exatamente onde está
      o ponteiro.

      Levamos o centro da categoria sorteada
      até o ponteiro:
        categoria 0 → 30°
        categoria 1 → 90°
        categoria 2 → 150°
        ...
    */

    const segmentAngle =
      360 / SINTONIA.length;

    const targetAngle =
      target * segmentAngle +
      segmentAngle / 2;

    /*
      Garante que a roleta avance pelo menos
      uma volta completa antes de parar.
    */

    const currentRotation = game.rotation;

    const nextFullRotation =
      Math.ceil(
        (currentRotation + 360) / 360
      ) * 360;

    game.rotation =
      nextFullRotation + targetAngle;

    wheelRing.style.transform =
      `rotate(${game.rotation}deg)`;


    /*
      A animação das categorias acompanha
      exatamente a trajetória da roleta.
    */

    const animationDuration = 4200;
    const startTime = performance.now();


    function tick(now) {
      const elapsed =
        now - startTime;

      const progress =
        Math.min(
          elapsed / animationDuration,
          1
        );

      const easedProgress =
        1 - Math.pow(
          1 - progress,
          3
        );

      const simulatedRotation =
        currentRotation +
        (
          game.rotation -
          currentRotation
        ) * easedProgress;

      const normalized =
        (
          (
            simulatedRotation % 360
          ) + 360
        ) % 360;

      const currentIndex =
        Math.floor(
          normalized / segmentAngle
        ) % SINTONIA.length;

      lightUp(currentIndex);


      if (progress >= 1) {
        game.spinning = false;

        endGame(game);

        askQuestion(target);

        spinBtn.disabled = false;

        return;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }


  spinBtn.addEventListener('click', spin);

  return wrap;
}