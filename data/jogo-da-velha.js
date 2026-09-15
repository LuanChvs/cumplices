const JOGO_DA_VELHA_CONFIG = {
    modes: {
      classic: {
        id: 'classic',
        name: 'Clássico'
      },
  
      mateOuMorra: {
        id: 'mate-ou-morra',
        name: 'Mate ou Morra',
        piecesPerPlayer: 3
      }
    },
  
    boardSize: 3,
  
    players: [
      {
        id: 'p1',
        symbol: 'X',
        name: 'Jogador 1'
      },
      {
        id: 'p2',
        symbol: 'O',
        name: 'Jogador 2'
      }
    ],
  
    winLines: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
  
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
  
      [0, 4, 8],
      [2, 4, 6]
    ]
  };