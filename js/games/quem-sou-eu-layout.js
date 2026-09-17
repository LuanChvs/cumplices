/* =========================================================
   QUEM SOU EU — LAYOUT ADAPTATIVO DA RODADA

   O layout reserva primeiro as áreas fixas da rodada
   (topo, espaçamentos, timer e ações). O nome recebe
   somente o espaço que realmente sobra e usa o maior
   tamanho possível dentro dessa área.
========================================================= */

(() => {
  const style = document.createElement('style');

  style.textContent = `
    .whoami-round-screen {
      box-sizing: border-box;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;

      /* Distância estrutural entre as três áreas da rodada. */
      row-gap: clamp(14px, 2.6vh, 24px);
    }

    .whoami-round-main {
      box-sizing: border-box;
      min-height: 0;
      min-width: 0;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      row-gap: clamp(10px, 2.4vh, 24px);

      /*
        Reserva espaço DENTRO da área do conteúdo depois do timer.
        Assim a distância timer → botão não depende apenas do gap
        externo e nunca pode ser consumida pelo nome.
      */
      padding-bottom: clamp(12px, 2vh, 18px);

      align-items: stretch;
      justify-items: stretch;
      overflow: hidden;
    }

    .whoami-name {
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      min-height: 0;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 0;
      margin: 0;
      text-align: center;
    }

    .whoami-name-text {
      display: block;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      margin: 0;
      padding: 0;
      white-space: normal;
      overflow-wrap: anywhere;
      word-break: normal;
      text-align: center;
    }

    .whoami-timer-wrap {
      justify-self: center;
      align-self: center;

      /*
        Um pouco mais largo para aproveitar melhor a tela,
        sem deixar a barra encostar nas laterais.
      */
      width: min(calc(100% + 20px), 660px);
      margin-top: 0;
      margin-left: auto;
      margin-right: auto;
    }

    /* O espaço inferior da tela fica preservado separadamente. */
    .whoami-round-actions {
      margin-bottom: clamp(8px, 1.6vh, 14px);
    }
  `;

  document.head.appendChild(style);

  window.fitWhoamiName = function fitWhoamiName(el) {
    if (!el) return;

    const text = el.querySelector('.whoami-name-text');
    if (!text) return;

    const width = el.clientWidth;
    const height = el.clientHeight;

    if (!width || !height) {
      requestAnimationFrame(() => window.fitWhoamiName(el));
      return;
    }

    /* Volta ao tamanho definido pelo CSS antes de medir. */
    el.style.fontSize = '';
    text.style.fontSize = '';

    const computedSize = parseFloat(getComputedStyle(el).fontSize);
    const maxSize = Number.isFinite(computedSize)
      ? computedSize
      : 192;
    const minSize = Math.max(18, Math.floor(maxSize * 0.16));

    /*
      Procura o MAIOR tamanho que cabe na largura e
      na altura que o grid realmente reservou para o nome.
    */
    let low = minSize;
    let high = maxSize;
    let best = minSize;

    while (low <= high) {
      const size = Math.floor((low + high) / 2);

      el.style.fontSize = `${size}px`;
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

    el.style.fontSize = `${best}px`;
    text.style.fontSize = `${best}px`;
  };

  window.renderWhoamiName = function renderWhoamiName(name) {
    const el = document.querySelector('.whoami-name');
    if (!el) return;

    el.innerHTML = '';

    const text = document.createElement('span');
    text.className = 'whoami-name-text';
    text.textContent = name;
    el.appendChild(text);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.fitWhoamiName(el);
      });
    });
  };

  let resizeTimer = null;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      const el = document.querySelector('.whoami-name');
      if (el) window.fitWhoamiName(el);
    }, 80);
  });
})();
