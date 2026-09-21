/* =========================================================
   QUEM SOU EU
========================================================= */

function renderQuemSouEu() {
  const wrap = el('<div></div>');

  const state = {
    mode: null,
    theme: null,
    customName: '',
    time: null,
    currentName: '',
    remainingTime: null,
    roundNumber: 0,
    usedNames: [],
    status: 'setup'
  };

  let timer = null;
  let countdownTimer = null;
  let lastTimerWarning = null;

  renderModeChoice();

  wrap.cleanup = () => {
    stopTimer();
    stopCountdown();
    sound.timerStop();
  };

  return wrap;

  function renderModeChoice() {
    stopTimer();
    stopCountdown();
    sound.timerStop();
    state.status = 'setup';

    wrap.innerHTML = `
      <div id="gameHeader"></div>

      <div class="panel whoami-panel">
        <div class="whoami-intro">
          <p class="whoami-kicker">QUEM SOU EU?</p>
          <h2>Como vocês querem começar?</h2>
          <p>Escolham um tema pronto ou escrevam qualquer nome para entrar na rodada.</p>
        </div>

        <div class="whoami-choice-grid" id="modeChoices"></div>
      </div>
    `;

    appendHeader(
      wrap.querySelector('#gameHeader'),
      'Quem Sou Eu',
      'Uma pessoa, personagem ou qualquer coisa aparece pra um jogador — e ele tenta descobrir quem ou o que é.'
    );

    const choices = wrap.querySelector('#modeChoices');

    const themeBtn = uiButton({
      text: 'Escolher tema',
      className: 'btn btn-primary'
    });

    const freeBtn = uiButton({
      text: 'Nome livre',
      className: 'btn btn-ghost'
    });

    themeBtn.addEventListener('click', () => {
      state.mode = 'theme';
      renderThemeChoice();
    });

    freeBtn.addEventListener('click', () => {
      state.mode = 'free';
      renderFreeName();
    });

    choices.append(
      createChoiceCard(
        '🎲',
        'Escolher tema',
        'O jogo sorteia um nome dentro do tema escolhido.',
        themeBtn
      ),
      createChoiceCard(
        '✍️',
        'Nome livre',
        'Vocês escrevem exatamente quem ou o que será descoberto.',
        freeBtn
      )
    );
  }

  function renderThemeChoice() {
    wrap.innerHTML = `
      <div id="gameHeader"></div>

      <div class="panel whoami-panel">
        <div class="whoami-intro">
          <p class="whoami-kicker">ETAPA 1</p>
          <h2>Escolham o tema</h2>
          <p>Depois disso vocês definem o tempo da rodada.</p>
        </div>

        <div class="whoami-theme-grid" id="themeChoices"></div>
        <div class="btn-row whoami-nav" id="themeNav"></div>
      </div>
    `;

    appendHeader(
      wrap.querySelector('#gameHeader'),
      'Escolher tema',
      'Toquem em um tema para continuar.'
    );

    const themeChoices = wrap.querySelector('#themeChoices');
    const themeNav = wrap.querySelector('#themeNav');

    QUEM_SOU_EU.temas.forEach((theme) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'whoami-theme-option';
      button.textContent = theme.nome;
      button.dataset.themeId = theme.id;

      if (state.theme?.id === theme.id) {
        button.classList.add('selected');
      }

      button.addEventListener('click', () => {
        sound.click();
        state.theme = theme;

        themeChoices
          .querySelectorAll('.whoami-theme-option')
          .forEach((option) => {
            option.classList.toggle(
              'selected',
              option.dataset.themeId === theme.id
            );
          });

        continueBtn.disabled = false;
      });

      themeChoices.appendChild(button);
    });

    const backBtn = uiButton({
      text: 'Voltar',
      className: 'btn btn-ghost'
    });

    const continueBtn = uiButton({
      text: 'Continuar',
      className: 'btn btn-primary'
    });

    continueBtn.disabled = !state.theme;

    backBtn.addEventListener('click', renderModeChoice);

    continueBtn.addEventListener('click', () => {
      if (!state.theme) return;
      renderTimeChoice();
    });

    themeNav.append(backBtn, continueBtn);
  }

  function renderFreeName() {
    wrap.innerHTML = `
      <div id="gameHeader"></div>

      <div class="panel whoami-panel">
        <div class="whoami-intro">
          <p class="whoami-kicker">ETAPA 1</p>
          <h2>Qual é o nome?</h2>
          <p>Escrevam quem ou o que a outra pessoa deverá descobrir.</p>
        </div>

        <label class="field-label" for="whoamiName">Quem sou eu?</label>
        <input
          class="text-input"
          id="whoamiName"
          type="text"
          maxlength="80"
          autocomplete="off"
          placeholder="Ex.: Darth Vader"
        >

        <div class="btn-row whoami-nav" id="freeNav"></div>
      </div>
    `;

    appendHeader(
      wrap.querySelector('#gameHeader'),
      'Nome livre',
      'Pode ser uma pessoa, personagem, objeto, lugar ou qualquer outra coisa.'
    );

    const input = wrap.querySelector('#whoamiName');
    const freeNav = wrap.querySelector('#freeNav');

    const backBtn = uiButton({
      text: 'Voltar',
      className: 'btn btn-ghost'
    });

    const continueBtn = uiButton({
      text: 'Continuar',
      className: 'btn btn-primary'
    });

    continueBtn.disabled = !state.customName;
    input.value = state.customName;

    input.addEventListener('input', () => {
      state.customName = input.value.trim();
      continueBtn.disabled = state.customName.length === 0;
    });

    backBtn.addEventListener('click', renderModeChoice);

    continueBtn.addEventListener('click', () => {
      state.customName = input.value.trim();

      if (!state.customName) return;
      renderTimeChoice();
    });

    freeNav.append(backBtn, continueBtn);
    input.focus();
  }

  function renderTimeChoice() {
    wrap.innerHTML = `
      <div id="gameHeader"></div>

      <div class="panel whoami-panel">
        <div class="whoami-intro">
          <p class="whoami-kicker">ETAPA 2</p>
          <h2>Quanto tempo vocês querem?</h2>
          <p>O tempo começa quando a cortina abrir e a rodada valer.</p>
        </div>

        <div class="whoami-time-grid" id="timeChoices"></div>
        <div class="btn-row whoami-nav" id="timeNav"></div>
      </div>
    `;

    appendHeader(
      wrap.querySelector('#gameHeader'),
      'Configuração do tempo',
      state.mode === 'theme'
        ? `Tema: ${state.theme.nome}`
        : `Nome: ${state.customName}`
    );

    const timeChoices = wrap.querySelector('#timeChoices');
    const timeNav = wrap.querySelector('#timeNav');

    const options = [
      { value: 30, label: '30 segundos' },
      { value: 60, label: '1 minuto' },
      { value: 90, label: '1 minuto e 30' },
      { value: 120, label: '2 minutos' },
      { value: Infinity, label: 'Sem tempo' }
    ];

    options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'whoami-time-option';
      button.textContent = option.label;
      button.dataset.time = String(option.value);

      if (state.time === option.value) {
        button.classList.add('selected');
      }

      button.addEventListener('click', () => {
        sound.click();
        state.time = option.value;

        timeChoices
          .querySelectorAll('.whoami-time-option')
          .forEach((item) => {
            item.classList.toggle(
              'selected',
              item.dataset.time === String(option.value)
            );
          });

        prepareBtn.disabled = false;
      });

      timeChoices.appendChild(button);
    });

    const backBtn = uiButton({
      text: 'Voltar',
      className: 'btn btn-ghost'
    });

    const prepareBtn = uiButton({
      text: 'Preparar jogo',
      className: 'btn btn-primary'
    });

    prepareBtn.disabled = state.time === null;

    backBtn.addEventListener('click', () => {
      if (state.mode === 'theme') {
        renderThemeChoice();
      } else {
        renderFreeName();
      }
    });

    prepareBtn.addEventListener('click', () => {
      if (state.time === null) return;
      prepareRound();
    });

    timeNav.append(backBtn, prepareBtn);
  }

  function prepareRound() {
    // Valida tudo antes de trocar a tela. Assim, um estado antigo ou
    // um catálogo inválido nunca deixa o jogo com a view vazia.
    if (state.time === null) return;

    if (state.mode === 'theme') {
      const names = Array.isArray(state.theme?.nomes)
        ? state.theme.nomes.filter((name) => typeof name === 'string' && name.trim())
        : [];

      if (!state.theme || !names.length) {
        renderThemeChoice();
        return;
      }

      // Mantém o objeto do tema sincronizado com o catálogo atual.
      state.theme = {
        ...state.theme,
        nomes: names
      };
    }

    const name = drawName();

    if (!name) return;

    state.currentName = name;
    state.remainingTime = state.time;
    state.roundNumber += 1;
    state.status = 'curtain';

    renderCurtain();
  }

  function renderCurtain() {
    stopTimer();
    stopCountdown();
    sound.timerStop();

    wrap.innerHTML = `
      <div class="whoami-curtain-screen">
        <div class="whoami-curtain-panel whoami-curtain-left"></div>
        <div class="whoami-curtain-panel whoami-curtain-right"></div>

        <div class="whoami-curtain-content">
          <div class="whoami-curtain-icon">🎭</div>
          <p class="whoami-kicker">RODADA ${state.roundNumber}</p>
          <h2>A pessoa está pronta?</h2>
          <p>Entreguem o celular para quem vai descobrir.</p>
          <button type="button" class="btn btn-primary whoami-start-btn" id="whoamiStart">
            Começar
          </button>
        </div>
      </div>
    `;

    wrap.querySelector('#whoamiStart').addEventListener('click', () => {
      sound.click();
      beginCountdown();
    });
  }

  function beginCountdown() {
    stopCountdown();
    state.status = 'countdown';

    const content = wrap.querySelector('.whoami-curtain-content');
    if (!content) return;

    let number = 3;
    content.innerHTML = `
      <div class="whoami-countdown" id="whoamiCountdown">${number}</div>
      <p class="whoami-countdown-label">Preparem-se...</p>
    `;

    countdownTimer = setInterval(() => {
      number -= 1;

      const countdown = wrap.querySelector('#whoamiCountdown');
      if (countdown && number > 0) {
        countdown.textContent = number;
        countdown.classList.remove('whoami-countdown-pop');
        void countdown.offsetWidth;
        countdown.classList.add('whoami-countdown-pop');
        sound.click();
        return;
      }

      stopCountdown();
      openCurtain();
    }, 1000);

    wrap.querySelector('#whoamiCountdown')?.classList.add('whoami-countdown-pop');
  }

  function openCurtain() {
    state.status = 'round';

    const curtain = wrap.querySelector('.whoami-curtain-screen');
    if (!curtain) return;

    curtain.classList.add('is-opening');

    setTimeout(() => {
      renderRound();
    }, 650);
  }

  function renderRound() {
    stopTimer();
    state.status = 'round';
    lastTimerWarning = null;
    sound.timerStop();

    const showAddTime = state.time !== Infinity;

    wrap.innerHTML = `
      <div class="whoami-round-screen">
        <div class="whoami-round-top">
          <span class="mode-badge">QUEM SOU EU?</span>
          <span class="whoami-round-label">Rodada ${state.roundNumber}</span>
        </div>

        <div class="whoami-round-main">
          <p class="whoami-round-kicker">VOCÊ É...</p>
          <h1 class="whoami-name" id="whoamiNameDisplay"></h1>

          <div class="whoami-timer-wrap">
            <div
              class="whoami-timer"
              id="whoamiTimer"
              aria-live="polite"
            ></div>
            <div class="whoami-timer-track" aria-hidden="true">
              <div class="whoami-timer-fill" id="whoamiTimerFill"></div>
            </div>
          </div>
        </div>

        <div class="whoami-round-actions">
          <button
            type="button"
            class="whoami-action-btn whoami-action-right"
            id="whoamiRight"
          >
            <span>✓</span>
            Acertou
          </button>

          ${showAddTime ? `
            <button
              type="button"
              class="whoami-add-time"
              id="whoamiAddTime"
            >
              +15 segundos
            </button>
          ` : ''}
        </div>
      </div>
    `;

    /*
      Auto-fit do nome — reserva uma altura fixa
      equivalente ao nome em uma única linha.
    */

    renderWhoamiName(state.currentName);

    wrap.querySelector('#whoamiRight').addEventListener('click', () => {
      sound.correct();
      endRound('acertou');
    });

    wrap.querySelector('#whoamiAddTime')?.addEventListener('click', () => {
      sound.click();

      if (state.remainingTime === Infinity) return;

      state.remainingTime += 15;
      lastTimerWarning = null;
      sound.timerStop();
      renderTimerValues();
    });

    renderTimerValues();

    if (state.time !== Infinity) {
      startTimer();
    }
  }

  function startTimer() {
    stopTimer();

    timer = setInterval(() => {
      state.remainingTime -= 1;
      renderTimerValues();

      if (state.remainingTime <= 0) {
        state.remainingTime = 0;
        stopTimer();
        timeUp();
      }
    }, 1000);
  }

  function renderTimerValues() {
    const timerEl = wrap.querySelector('#whoamiTimer');
    const fill = wrap.querySelector('#whoamiTimerFill');

    if (!timerEl) return;

    if (state.remainingTime === Infinity) {
      timerEl.textContent = '∞';
      if (fill) fill.style.width = '100%';
      return;
    }

    timerEl.textContent = formatClock(state.remainingTime);

    const total = Math.max(state.time, 1);
    const percentage = Math.max(
      0,
      Math.min(100, (state.remainingTime / total) * 100)
    );

    if (fill) {
      fill.style.width = `${percentage}%`;
    }

    const secondsLeft = Math.ceil(state.remainingTime);

    if (secondsLeft <= 10 && secondsLeft > 0) {
      if (lastTimerWarning === null) {
        lastTimerWarning = secondsLeft;
        sound.timer();
      }
    } else if (secondsLeft > 10) {
      lastTimerWarning = null;
      sound.timerStop();
    }
  }

  function timeUp() {
    state.status = 'timeup';
    sound.timerStop();
    sound.elimination();
    renderResult('tempo');
  }

  function endRound(result) {
    stopTimer();
    sound.timerStop();
    state.status = result;
    renderResult(result);
  }

  function renderResult(result) {
    const title = result === 'acertou' ? 'Acertou!' : 'Tempo esgotado!';
    const icon = result === 'acertou' ? '🎉' : '⏰';
    const description =
      result === 'acertou'
        ? 'Mandou bem. A rodada terminou.'
        : 'O tempo acabou antes da resposta.';

    wrap.innerHTML = `
      <div class="whoami-result-screen">
        <div class="whoami-result-card">
          <div class="whoami-result-icon">${icon}</div>
          <p class="whoami-kicker">RODADA ${state.roundNumber}</p>
          <h2>${title}</h2>
          <p>${description}</p>

          <div class="whoami-result-answer">
            <span>A resposta era</span>
            <strong id="whoamiResultName"></strong>
          </div>

          <div class="whoami-result-actions" id="whoamiResultActions"></div>
        </div>
      </div>
    `;

    wrap.querySelector('#whoamiResultName').textContent = state.currentName;

    const actions = wrap.querySelector('#whoamiResultActions');

    const againBtn = uiButton({
      text: state.mode === 'theme' ? 'Nova rodada' : 'Novo nome',
      className: 'btn btn-primary'
    });

    const setupBtn = uiButton({
      text: 'Trocar configuração',
      className: 'btn btn-ghost'
    });

    againBtn.addEventListener('click', () => {
      if (state.mode === 'theme') {
        renderNextThemeRound();
      } else {
        state.customName = '';
        renderFreeName();
      }
    });

    setupBtn.addEventListener('click', renderModeChoice);

    actions.append(againBtn, setupBtn);
  }

  function renderNextThemeRound() {
    if (!state.theme) {
      renderThemeChoice();
      return;
    }

    state.currentName = drawName();
    state.remainingTime = state.time;
    state.roundNumber += 1;
    state.status = 'curtain';

    renderCurtain();
  }

  function drawName() {
    if (state.mode === 'free') {
      return state.customName;
    }

    const names = Array.isArray(state.theme?.nomes)
      ? state.theme.nomes.filter((name) => typeof name === 'string' && name.trim())
      : [];

    if (!names.length) {
      return '';
    }

    const available = names.filter(
      (name) => !state.usedNames.includes(name)
    );

    if (available.length === 0) {
      state.usedNames = [];
      available.push(...names);
    }

    const name = available[Math.floor(Math.random() * available.length)];

    if (!name) return '';

    state.usedNames.push(name);
    return name;
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function stopCountdown() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }

  function appendHeader(target, title, description) {
    target.appendChild(
      createGameHeader({
        title,
        description
      })
    );
  }

  function createChoiceCard(icon, title, description, button) {
    const card = document.createElement('div');
    card.className = 'whoami-choice-card';

    card.innerHTML = `
      <div class="whoami-choice-icon">${icon}</div>
      <div>
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
    `;

    card.appendChild(button);
    return card;
  }

  function formatClock(seconds) {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
  }
}

/* =========================================================
   LAYOUT RESPONSIVO DA RODADA
   Uma única fonte de verdade para o nome.
========================================================= */

function fitWhoamiName(el) {
  if (!el) return;

  const text = el.querySelector('.whoami-name-text');
  if (!text) return;

  const width = el.clientWidth;
  const height = el.clientHeight;

  if (!width || !height) {
    requestAnimationFrame(() => fitWhoamiName(el));
    return;
  }

  el.style.fontSize = '';
  text.style.fontSize = '';

  const computedSize = parseFloat(getComputedStyle(el).fontSize);
  const maxSize = Number.isFinite(computedSize) ? computedSize : 192;
  const minSize = Math.max(18, Math.floor(maxSize * 0.16));

  let low = minSize;
  let high = maxSize;
  let best = minSize;

  while (low <= high) {
    const size = Math.floor((low + high) / 2);

    text.style.fontSize = `${size}px`;

    const fitsWidth = text.scrollWidth <= width + 1;
    const fitsHeight = text.scrollHeight <= height + 1;

    if (fitsWidth && fitsHeight) {
      best = size;
      low = size + 1;
    } else {
      high = size - 1;
    }
  }

  text.style.fontSize = `${best}px`;
}

function renderWhoamiName(name) {
  const el = document.querySelector('.whoami-name');
  if (!el) return;

  el.innerHTML = '';

  const text = document.createElement('span');
  text.className = 'whoami-name-text';
  text.textContent = name;
  el.appendChild(text);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fitWhoamiName(el);
    });
  });
}

let whoamiResizeTimer = null;

window.addEventListener('resize', () => {
  clearTimeout(whoamiResizeTimer);

  whoamiResizeTimer = setTimeout(() => {
    const el = document.querySelector('.whoami-name');
    if (el) fitWhoamiName(el);
  }, 80);
});
