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
      row-gap: clamp(12px, 2.2vh, 22px);
    }

    .whoami-round-main {
      min-height: 0;
      min-width: 0;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      row-gap: clamp(10px, 2.4vh, 24px);
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
      width: min(100%, 580px);
      margin-top: 0;
      margin-left: auto;
      margin-right: auto;
    }

    .whoami-round-actions {
      margin-bottom: clamp(4px, 1.2vh, 12px);
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
