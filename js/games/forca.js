/* =========================================================
   FORCA — FASE 1
   Apenas estrutura de navegação. A lógica das partidas entra
   nas próximas fases.
========================================================= */

function renderForca() {
  const root = document.createElement('div');
  root.className = 'forca';

  let screen = 'root';

  const screens = {
    root: [
      {
        id: 'classic',
        icon: '🔤',
        title: 'Clássico',
        description: 'O jogo de Forca tradicional, para jogar em grupo.',
      },
      {
        id: 'termo',
        icon: '🔠',
        title: 'Termo',
        description: 'A versão Termo, com Palavra do Dia, Aleatório e Versus.',
      },
    ],
    classic: [
      {
        id: 'coop',
        icon: '🤝',
        title: 'Coop',
        description: 'Todos juntos contra uma palavra escolhida pelo aplicativo.',
      },
      {
        id: 'versus',
        icon: '⚔️',
        title: 'Versus',
        description: 'Escolham entre Times ou Todos contra todos.',
      },
    ],
    classicVersus: [
      {
        id: 'teams',
        icon: '👥',
        title: 'Times',
        description: 'Um time escolhe a palavra e o outro tenta descobrir.',
      },
      {
        id: 'freeForAll',
        icon: '🧑‍🤝‍🧑',
        title: 'Todos contra todos',
        description: 'Um jogador é o Mestre e os demais se revezam tentando descobrir.',
      },
    ],
  };

  const goBack = () => {
    if (screen === 'root') {
      if (typeof navigate === 'function') navigate('/');
      return;
    }

    if (screen === 'classicVersus') {
      screen = 'classic';
    } else if (screen === 'classic') {
      screen = 'root';
    } else {
      screen = 'root';
    }

    render();
  };

  const choose = (id) => {
    if (screen === 'root' && id === 'classic') {
      screen = 'classic';
      render();
      return;
    }

    if (screen === 'root' && id === 'termo') {
      if (typeof navigate === 'function') navigate('/termo');
      return;
    }

    if (screen === 'classic' && id === 'coop') {
      // Próxima fase: tela de temas do Coop.
      setMessage('Forca Coop — próxima fase.');
      return;
    }

    if (screen === 'classic' && id === 'versus') {
      screen = 'classicVersus';
      render();
      return;
    }

    if (screen === 'classicVersus') {
      // Próximas fases: configuração de Times e Todos contra todos.
      setMessage('Configuração do modo selecionado — próxima fase.');
    }
  };

  const render = () => {
    root.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'forca__header';
    header.innerHTML = `
      <span class="forca__eyebrow">Cúmplices</span>
      <h1 class="forca__title">Forca</h1>
    `;

    const screenEl = document.createElement('div');
    screenEl.className = 'forca__screen';

    const options = document.createElement('div');
    options.className = 'forca__options';

    (screens[screen] || []).forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'forca__option';
      button.innerHTML = `
        <span class="forca__option-icon" aria-hidden="true">${option.icon}</span>
        <span class="forca__option-copy">
          <strong>${option.title}</strong>
          <small>${option.description}</small>
        </span>
      `;
      button.addEventListener('click', () => choose(option.id));
      options.appendChild(button);
    });

    screenEl.appendChild(options);

    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'forca__back';
    back.textContent = screen === 'root' ? '← Voltar' : '← Voltar';
    back.addEventListener('click', goBack);
    screenEl.appendChild(back);

    root.append(header, screenEl);
  };

  root.cleanup = () => {};
  render();
  return root;
}
