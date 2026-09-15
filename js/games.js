/* =========================================================
   CATÁLOGO CENTRAL DE JOGOS
========================================================= */

const games = {
    sintonia: {
      id: 'sintonia',
      title: 'Sintonia',
      route: '/sintonia',
      description: 'Descubram o quanto vocês combinam.',
      icon: ICONS.sintonia,
      render: renderSintonia
    },
  
    stop: {
      id: 'stop',
      title: 'Stop do casal',
      route: '/stop',
      description: 'Pense rápido, fale uma palavra e passe a vez.',
      icon: ICONS.stop,
      render: renderStop
    },
  
    verdade: {
      id: 'verdade',
      title: 'Verdade ou desafio',
      route: '/verdade-ou-desafio',
      description: 'Escolham verdade, desafio ou deixem o acaso decidir.',
      icon: ICONS.vd,
      render: renderVD
    },
  
    quiz: {
      id: 'quiz',
      title: 'Quem conhece melhor',
      route: '/quiz',
      description: 'Descubram quem conhece melhor o outro.',
      icon: ICONS.quiz,
      render: renderQuiz
    }
  };