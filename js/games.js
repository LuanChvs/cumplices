/* =========================================================
   CATÁLOGO CENTRAL DE JOGOS
========================================================= */

const games = {
    sintonia: {
      id: 'sintonia',
      title: 'Sintonia',
      route: '/sintonia',
      description: 'Girem a roleta, caiam numa categoria e respondam juntos a mesma pergunta ao mesmo tempo.',
      color: 'rose',
      icon: ICONS.sintonia,
      render: renderSintonia
    },
  
    stop: {
      id: 'stop',
      title: 'Stop do casal',
      route: '/stop',
      description: 'Uma carta define o tema. Falem uma palavra do tema, apertem a letra inicial e passem a vez. Dois modos de cronômetro: único ou reiniciando.',
      color: 'gold',
      icon: ICONS.stop,
      render: renderStop
    },
  
    verdade: {
      id: 'verdade',
      title: 'Verdade ou desafio',
      route: '/verdade-ou-desafio',
      description: 'Um baralho de perguntas sinceras e desafios bobos pra fazer rir e se conhecer um pouco mais.',
      color: 'teal',
      icon: ICONS.vd,
      render: renderVD
    },
  
    quiz: {
      id: 'quiz',
      title: 'Quem conhece melhor',
      route: '/quiz',
      description: 'Perguntas sobre o outro pra descobrir quem realmente presta atenção.',
      color: 'lav',
      icon: ICONS.quiz,
      render: renderQuiz
    }
  };