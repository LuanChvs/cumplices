/* =========================================================
   QUEM SOU EU
========================================================= */

function renderQuemSouEu() {
  const wrap = el('<div></div>');

  const state = {
    mode: null,
    theme: null,
    customName: '',
    time: null
  };

  renderModeChoice();

  return wrap;

  function renderModeChoice() {
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
      sound.click();
      renderThemeChoice();
    });

    freeBtn.addEventListener('click', () => {
      state.mode = 'free';
      sound.click();
      renderFreeName();
    });

    choices.append(
      createChoiceCard('🎲', 'Escolher tema', 'O jogo sorteia um nome dentro do tema escolhido.', themeBtn),
      createChoiceCard('✍️', 'Nome livre', 'Vocês escrevem exatamente quem ou o que será descoberto.', freeBtn)
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

    QUIZ_NOPREFERENCE;

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

        updateThemeContinue();
      });

      themeChoices.appendChild(button);
    });

    const backBtn = uiButton({
      text: 'Voltar',
      className: 'btn btn-ghost'
    });

    const continueBtn = uiButton({
      text: 'Continuar',
      className: 'btn btn-primary',
      attributes: { disabled: 'true' }
    });

    backBtn.addEventListener('click', () => {
      sound.click();
      renderModeChoice();
    });

    continueBtn.addEventListener('click', () => {
      if (!state.theme) return;
      sound.click();
      renderTimeChoice();
    });

    themeNav.append(backBtn, continueBtn);

    function updateThemeContinue() {
      continueBtn.disabled = !state.theme;
    }
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

    continueBtn.disabled = true;

    input.addEventListener('input', () => {
      state.customName = input.value.trim();
      continueBtn.disabled = state.customName.length === 0;
    });

    backBtn.addEventListener('click', () => {
      sound.click();
      renderModeChoice();
    });

    continueBtn.addEventListener('click', () => {
      state.customName = input.value.trim();

      if (!state.customName) return;

      sound.click();
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

    prepareBtn.disabled = !Number.isFinite(state.time) && state.time !== Infinity;
    if (state.time !== null) {
      prepareBtn.disabled = false;
    }

    backBtn.addEventListener('click', () => {
      sound.click();

      if (state.mode === 'theme') {
        renderThemeChoice();
      } else {
        renderFreeName();
      }
    });

    prepareBtn.addEventListener('click', () => {
      if (state.time === null) return;

      sound.click();
      renderReady();
    });

    timeNav.append(backBtn, prepareBtn);
  }

  function renderReady() {
    const displayName =
      state.mode === 'theme'
        ? state.theme.nome
        : state.customName;

    const timeLabel =
      state.time === Infinity
        ? 'Sem tempo'
        : `${formatTime(state.time)} de rodada`;

    wrap.innerHTML = `
      <div id="gameHeader"></div>

      <div class="panel whoami-ready-panel">
        <div class="whoami-ready-icon">🎭</div>
        <p class="whoami-kicker">JOGO PREPARADO</p>
        <h2>${displayName}</h2>
        <p>${timeLabel}</p>
        <div class="btn-row whoami-nav" id="readyNav"></div>
      </div>
    `;

    appendHeader(
      wrap.querySelector('#gameHeader'),
      'Preparar jogo',
      'A próxima etapa será a cortina fechada antes de começar a rodada.'
    );

    const readyNav = wrap.querySelector('#readyNav');

    const backBtn = uiButton({
      text: 'Voltar',
      className: 'btn btn-ghost'
    });

    const startBtn = uiButton({
      text: 'Continuar',
      className: 'btn btn-primary'
    });

    backBtn.addEventListener('click', () => {
      sound.click();
      renderTimeChoice();
    });

    startBtn.addEventListener('click', () => {
      sound.click();
      renderPlaceholderReady();
    });

    readyNav.append(backBtn, startBtn);
  }

  function renderPlaceholderReady() {
    wrap.innerHTML = `
      <div class="whoami-curtain-placeholder">
        <div class="whoami-curtain-symbol">🎭</div>
        <h2>Pronto.</h2>
        <p>A cortina entra na próxima etapa.</p>
      </div>
    `;
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

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;

    if (minutes === 0) {
      return `${rest}s`;
    }

    if (rest === 0) {
      return `${minutes} min`;
    }

    return `${minutes}min ${rest}s`;
  }
}
