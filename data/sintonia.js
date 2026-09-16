window.DATA = window.DATA || {};

function sintoniaPergunta(texto, modos = ['casal', 'resenha']) {
  return { texto, modos };
}

window.DATA.sintonia = [
  { nome:"Memórias", cor:"var(--rose)", perguntas:[
    sintoniaPergunta("Qual foi o momento em que você percebeu que estava apaixonado(a)?"),
    sintoniaPergunta("Qual é a lembrança mais engraçada que vocês têm juntos?"),
    sintoniaPergunta("Qual foi o encontro mais nervoso que vocês tiveram?"),
    sintoniaPergunta("Que música lembra o começo de vocês dois?"),
    sintoniaPergunta("Qual foi a primeira impressão que você teve do outro?"),
    sintoniaPergunta("Qual viagem vocês fizeram que você nunca vai esquecer?"),
    sintoniaPergunta("Teve alguma briga boba que hoje faz vocês rirem?"),
    sintoniaPergunta("Qual foi o presente mais marcante que você já recebeu do outro?")
  ]},
  { nome:"Desejos", cor:"var(--gold)", perguntas:[
    sintoniaPergunta("Que lugar do mundo vocês ainda não conheceram, mas sonham em ir juntos?"),
    sintoniaPergunta("Qual é um sonho seu que o outro talvez não conheça?"),
    sintoniaPergunta("Se pudessem morar em qualquer lugar, onde seria?"),
    sintoniaPergunta("Qual experiência vocês querem viver juntos até o fim do ano?"),
    sintoniaPergunta("Existe algum hobby que você quer aprender ao lado do outro?"),
    sintoniaPergunta("Qual seria o presente perfeito pra vocês dois nesse momento da vida?"),
    sintoniaPergunta("Que tipo de casa vocês imaginam ter um dia?"),
    sintoniaPergunta("Se pudessem realizar um desejo juntos amanhã, qual seria?")
  ]},
  { nome:"Confissões", cor:"var(--teal)", perguntas:[
    sintoniaPergunta("Existe algo que você nunca contou pro outro por vergonha?"),
    sintoniaPergunta("Qual é o hábito do outro que te irrita, mas você nunca falou?"),
    sintoniaPergunta("Já sentiu ciúmes de alguém sem motivo?"),
    sintoniaPergunta("Qual mentirinha branca você já contou pro seu par?"),
    sintoniaPergunta("Tem algo que você faz escondido que talvez o outro não saiba?"),
    sintoniaPergunta("Qual foi o pensamento mais bobo que você já teve sobre a relação?"),
    sintoniaPergunta("Existe alguma insegurança sua que a relação ajudou a curar?"),
    sintoniaPergunta("Qual foi a vez que você quase estragou tudo sem querer?")
  ]},
  { nome:"Só rindo", cor:"var(--lav)", perguntas:[
    sintoniaPergunta("Se o outro fosse um desenho animado, qual seria?"),
    sintoniaPergunta("Qual seria o apelido perfeito, e ridículo, pro outro?"),
    sintoniaPergunta("Se vocês virassem uma dupla de comediantes, qual seria o nome da dupla?"),
    sintoniaPergunta("Qual é a mania mais engraçada que o outro tem?"),
    sintoniaPergunta("Se seu par fosse um prato de comida, qual seria?"),
    sintoniaPergunta("Qual seria o hit que tocaria toda vez que vocês entrassem numa festa juntos?"),
    sintoniaPergunta("Se a relação de vocês fosse um filme, que gênero seria?"),
    sintoniaPergunta("Qual seria a profissão mais improvável pro outro?")
  ]},
  { nome:"Se pudesse", cor:"var(--coral)", perguntas:[
    sintoniaPergunta("Se pudesse trocar de corpo com o outro por um dia, o que você faria?"),
    sintoniaPergunta("Se pudessem ganhar uma viagem grátis amanhã, pra onde iriam?"),
    sintoniaPergunta("Se tivessem que abandonar tudo e recomeçar em outra cidade, qual escolheriam?"),
    sintoniaPergunta("Se pudesse mudar uma coisa na rotina de vocês, o que seria?"),
    sintoniaPergunta("Se ganhassem um dinheiro alto hoje, no que gastariam primeiro?"),
    sintoniaPergunta("Se pudessem reviver um dia da relação, qual escolheriam?"),
    sintoniaPergunta("Se tivessem que criar uma regra nova pro relacionamento, qual seria?"),
    sintoniaPergunta("Se pudessem ter um superpoder como casal, qual seria?")
  ]},
  { nome:"Daqui a 10 anos", cor:"var(--sage)", perguntas:[
    sintoniaPergunta("Como vocês imaginam a vida de vocês daqui a 10 anos?"),
    sintoniaPergunta("Que tradição vocês gostariam de criar como casal?"),
    sintoniaPergunta("Qual conquista vocês querem comemorar juntos no futuro?"),
    sintoniaPergunta("Como acham que vão estar comemorando o aniversário de namoro daqui a uma década?"),
    sintoniaPergunta("Que conselho vocês dariam pro casal que eram no início do relacionamento?"),
    sintoniaPergunta("Qual hábito de hoje vocês quer manter para sempre?"),
    sintoniaPergunta("Onde vocês imaginam passar as férias quando forem mais velhos?"),
    sintoniaPergunta("O que vocês esperam que nunca mude entre vocês dois?")
  ]}
];