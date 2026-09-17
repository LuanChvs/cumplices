window.DATA = window.DATA || {};

function conexaoPergunta(texto, modos = ['casal', 'resenha']) {
  return { texto, modos };
}

window.DATA.conexao = [
  { nome:"Memórias", cor:"var(--rose)", perguntas:[
    conexaoPergunta("Qual foi o momento em que você percebeu que estava apaixonado(a)?"),
    conexaoPergunta("Qual é a lembrança mais engraçada que vocês têm juntos?"),
    conexaoPergunta("Qual foi o encontro mais nervoso que vocês tiveram?"),
    conexaoPergunta("Que música lembra o começo de vocês dois?"),
    conexaoPergunta("Qual foi a primeira impressão que você teve do outro?"),
    conexaoPergunta("Qual viagem vocês fizeram que você nunca vai esquecer?"),
    conexaoPergunta("Teve alguma briga boba que hoje faz vocês rirem?"),
    conexaoPergunta("Qual foi o presente mais marcante que você já recebeu do outro?")
  ]},
  { nome:"Desejos", cor:"var(--gold)", perguntas:[
    conexaoPergunta("Que lugar do mundo vocês ainda não conheceram, mas sonham em ir juntos?"),
    conexaoPergunta("Qual é um sonho seu que o outro talvez não conheça?"),
    conexaoPergunta("Se pudessem morar em qualquer lugar, onde seria?"),
    conexaoPergunta("Qual experiência vocês querem viver juntos até o fim do ano?"),
    conexaoPergunta("Existe algum hobby que você quer aprender ao lado do outro?"),
    conexaoPergunta("Qual seria o presente perfeito pra vocês dois nesse momento da vida?"),
    conexaoPergunta("Que tipo de casa vocês imaginam ter um dia?"),
    conexaoPergunta("Se pudessem realizar um desejo juntos amanhã, qual seria?")
  ]},
  { nome:"Confissões", cor:"var(--teal)", perguntas:[
    conexaoPergunta("Existe algo que você nunca contou pro outro por vergonha?"),
    conexaoPergunta("Qual é o hábito do outro que te irrita, mas você nunca falou?"),
    conexaoPergunta("Já sentiu ciúmes de alguém sem motivo?"),
    conexaoPergunta("Qual mentirinha branca você já contou pro seu par?"),
    conexaoPergunta("Tem algo que você faz escondido que talvez o outro não saiba?"),
    conexaoPergunta("Qual foi o pensamento mais bobo que você já teve sobre a relação?"),
    conexaoPergunta("Existe alguma insegurança sua que a relação ajudou a curar?"),
    conexaoPergunta("Qual foi a vez que você quase estragou tudo sem querer?")
  ]},
  { nome:"Só rindo", cor:"var(--lav)", perguntas:[
    conexaoPergunta("Se o outro fosse um desenho animado, qual seria?"),
    conexaoPergunta("Qual seria o apelido perfeito, e ridículo, pro outro?"),
    conexaoPergunta("Se vocês virassem uma dupla de comediantes, qual seria o nome da dupla?"),
    conexaoPergunta("Qual é a mania mais engraçada que o outro tem?"),
    conexaoPergunta("Se seu par fosse um prato de comida, qual seria?"),
    conexaoPergunta("Qual seria o hit que tocaria toda vez que vocês entrassem numa festa juntos?"),
    conexaoPergunta("Se a relação de vocês fosse um filme, que gênero seria?"),
    conexaoPergunta("Qual seria a profissão mais improvável pro outro?")
  ]},
  { nome:"Se pudesse", cor:"var(--coral)", perguntas:[
    conexaoPergunta("Se pudesse trocar de corpo com o outro por um dia, o que você faria?"),
    conexaoPergunta("Se pudessem ganhar uma viagem grátis amanhã, pra onde iriam?"),
    conexaoPergunta("Se tivessem que abandonar tudo e recomeçar em outra cidade, qual escolheriam?"),
    conexaoPergunta("Se pudesse mudar uma coisa na rotina de vocês, o que seria?"),
    conexaoPergunta("Se ganhassem um dinheiro alto hoje, no que gastariam primeiro?"),
    conexaoPergunta("Se pudessem reviver um dia da relação, qual escolheriam?"),
    conexaoPergunta("Se tivessem que criar uma regra nova pro relacionamento, qual seria?"),
    conexaoPergunta("Se pudessem ter um superpoder como casal, qual seria?")
  ]},
  { nome:"Daqui a 10 anos", cor:"var(--sage)", perguntas:[
    conexaoPergunta("Como vocês imaginam a vida de vocês daqui a 10 anos?"),
    conexaoPergunta("Que tradição vocês gostariam de criar como casal?"),
    conexaoPergunta("Qual conquista vocês querem comemorar juntos no futuro?"),
    conexaoPergunta("Como acham que vão estar comemorando o aniversário de namoro daqui a uma década?"),
    conexaoPergunta("Que conselho vocês dariam pro casal que eram no início do relacionamento?"),
    conexaoPergunta("Qual hábito de hoje vocês quer manter para sempre?"),
    conexaoPergunta("Onde vocês imaginam passar as férias quando forem mais velhos?"),
    conexaoPergunta("O que vocês esperam que nunca mude entre vocês dois?")
  ]}
];