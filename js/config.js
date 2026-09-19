/* =========================================================
   DADOS — puxados dos arquivos em /data
   Pra adicionar/editar conteúdo, mexa só nos arquivos acima.
========================================================= */
const CONEXAO = window.DATA.conexao;
const EM_SINTONIA = window.DATA.emSintonia;
const VERDADES = window.DATA.verdades;
const DESAFIOS = window.DATA.desafios;
const QUIZ_PERGUNTAS = window.DATA.quizPerguntas;
const QUEM_SOU_EU = window.DATA.quemSouEu;
const STOP_TEMAS = window.DATA.stopTemas;
const STOP_LETRAS = window.DATA.stopLetras;

const SOUND_SETTINGS = {
  click: true,
  correct: true,
  wrong: true,
  timer: true,
  elimination: true,
  victory: true
};

const PLAYER_COLORS = ["rose","gold","teal","lav","coral","sage"];

const STOP_MODOS = [
  {
    id:'ate-morte',
    nome:'Até a morte',
    desc:'Um cronômetro único pra rodada inteira. Ele não reinicia quando alguém aperta uma letra — só diminui. Cada letra apertada deixa menos tempo pra quem vier depois. Se acabar na sua vez, você perde.',
    tempos:[60.2,90.2,120.2,180.2],
    tempoLabels:["1 min","1min30","2 min","3 min"],
    tempoPadrao:90,
    tempoLabelCampo:'Tempo total da rodada',
    tempoNota:'Cronômetro único — não reinicia.'
  },
  {
    id:'repassa',
    nome:'Passa ou repassa',
    desc:'O cronômetro reinicia toda vez que uma letra é apertada. Você recebe o tempo cheio pra pensar na sua palavra — mas se ele acabar antes de você apertar uma letra, você perde a rodada.',
    tempos:[10.2,30.2,45.2,60.2,90.2],
    tempoLabels:["10s", "30s","45s","1 min","1min30"],
    tempoPadrao:45,
    tempoLabelCampo:'Tempo por vez',
    tempoNota:'Reinicia a cada letra apertada.'
  }
];
function modoPorId(id){ return STOP_MODOS.find(m=>m.id===id) || STOP_MODOS[0]; }
/* =========================================================
   ÍCONES
========================================================= */
const ICONS = {
    sintonia:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="24" cy="24" r="17"/><line x1="24" y1="7" x2="24" y2="14"/><line x1="24" y1="34" x2="24" y2="41"/><line x1="7" y1="24" x2="14" y2="24"/><line x1="34" y1="24" x2="41" y2="24"/><circle cx="24" cy="24" r="4" fill="currentColor" stroke="none"/></svg>`,
    conexao:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="24" cy="24" r="17"/><line x1="24" y1="7" x2="24" y2="14"/><line x1="24" y1="34" x2="24" y2="41"/><line x1="7" y1="24" x2="14" y2="24"/><line x1="34" y1="24" x2="41" y2="24"/><circle cx="24" cy="24" r="4" fill="currentColor" stroke="none"/></svg>`,
    emSintonia:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 34h36"/><path d="M9 34a15 15 0 0 1 30 0"/><path d="M24 34V15"/><circle cx="24" cy="13" r="2.5" fill="currentColor" stroke="none"/></svg>`,
    stop:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="24" cy="24" r="17"/><path d="M24 14v10l7 5"/></svg>`,
    vd:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M8 14h20a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5H20l-6 5v-5H8a5 5 0 0 1-5-5v-6a5 5 0 0 1 5-5Z" transform="translate(0,-2)"/></svg>`,
    quiz:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="24" cy="24" r="17"/><path d="M19 19a5 5 0 0 1 9-3c1.5 2-0.5 3.5-2 4.5S24 23 24 26"/><circle cx="24" cy="32" r="0.6" fill="currentColor"/></svg>`,
    jogoDaVelha: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M16 8v32"/><path d="M32 8v32"/><path d="M8 16h32"/><path d="M8 32h32"/></svg>`,
    xadrez: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8l-1 4 3 4v3H6v-3l3-4-1-4Z"/><path d="M7 15h10"/><path d="M6 19h12"/></svg>`,
    quemSouEu: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 19c0-5 4-9 10-9s10 4 10 9v3c0 5-4 9-10 9s-10-4-10-9v-3Z"/><path d="M14 19h20"/><path d="M18 31v6"/><path d="M30 31v6"/><path d="M16 37h16"/></svg>`
};