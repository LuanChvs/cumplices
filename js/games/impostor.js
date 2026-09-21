/* =========================================================
   IMPOSTOR
   Estrutura inicial — modos serão implementados por etapas.
========================================================= */

function renderImpostor() {
  const root = document.createElement('section');
  root.className = 'impostor';

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

      <div class="impostor__setup" hidden>
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

      <p class="impostor__feedback impostor__mode-feedback" aria-live="polite"></p>
    </div>
  `;

  const setup = root.querySelector('.impostor__setup');
  const modeFeedback = root.querySelector('.impostor__mode-feedback');
  const continueButton = root.querySelector('.impostor__continue');
  const setupFeedback = setup.querySelector('.impostor__feedback');
  const inputs = [...setup.querySelectorAll('[data-impostor-player]')];

  root.querySelectorAll('[data-impostor-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.impostorMode;

      if (mode === 'duo') {
        setup.hidden = false;
        modeFeedback.textContent = '';
        inputs[0].focus();
        return;
      }

      setup.hidden = true;
      modeFeedback.textContent = 'O Modo Normal será disponibilizado em uma próxima etapa.';
    });
  });

  continueButton.addEventListener('click', () => {
    const players = inputs.map((input) => input.value.trim());

    if (players.some((name) => !name)) {
      setupFeedback.textContent = 'Preencham os nomes dos dois jogadores para continuar.';
      return;
    }

    if (players[0].toLowerCase() === players[1].toLowerCase()) {
      setupFeedback.textContent = 'Os jogadores precisam ter nomes diferentes.';
      return;
    }

    setupFeedback.textContent = `Tudo certo, ${players[0]} e ${players[1]}! A próxima etapa será preparar as palavras.`;
  });

  return root;
}
