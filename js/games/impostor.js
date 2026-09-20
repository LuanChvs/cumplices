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
        <button type="button" class="impostor__mode" disabled>
          <strong>Modo Normal</strong>
          <span>Para 3 ou mais jogadores · em breve</span>
        </button>
        <button type="button" class="impostor__mode" disabled>
          <strong>Modo Duo</strong>
          <span>Dois jogadores · em construção</span>
        </button>
      </div>
    </div>
  `;

  return root;
}
