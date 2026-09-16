window.DATA = window.DATA || {};

function quizPergunta(texto, modos = ['casal', 'resenha']) {
  return { texto, modos };
}

window.DATA.quizPerguntas = [
  quizPergunta("Qual é a comida favorita do seu par?"),
  quizPergunta("Qual é o maior medo dele(a)?"),
  quizPergunta("Qual é a série ou filme favorito dele(a)?"),
  quizPergunta("Qual é o sonho de viagem dele(a)?"),
  quizPergunta("Qual é a cor favorita dele(a)?"),
  quizPergunta("Qual foi o primeiro emprego dele(a)?"),
  quizPergunta("Qual é o time do coração dele(a), se tiver?"),
  quizPergunta("Qual é a música que ele(a) mais escuta ultimamente?"),
  quizPergunta("Qual é o maior sonho profissional dele(a)?"),
  quizPergunta("Qual é o animal favorito dele(a)?"),
  quizPergunta("Qual é a data que ele(a) nunca esquece?"),
  quizPergunta("Qual é o aplicativo que ele(a) mais usa no celular?"),
  quizPergunta("Qual é a comida que ele(a) mais odeia?"),
  quizPergunta("Qual é o nome do melhor amigo ou melhor amiga dele(a)?"),
  quizPergunta("Qual é o maior sonho de consumo dele(a) agora?"),
  quizPergunta("Qual é o programa ou podcast favorito dele(a)?"),
  quizPergunta("Qual é a estação do ano favorita dele(a)?"),
  quizPergunta("Qual foi a última coisa que fez ele(a) rir muito?"),
  quizPergunta("Qual superpoder ele(a) escolheria ter?"),
  quizPergunta("Qual é a bebida favorita dele(a)?"),
  quizPergunta("Qual é o maior orgulho dele(a) até hoje?"),
  quizPergunta("Qual é o lugar onde ele(a) se sente mais em paz?"),
  quizPergunta("Qual é a habilidade que ele(a) mais gostaria de ter?"),
  quizPergunta("Qual é o cheiro que faz ele(a) lembrar de alguém especial?")
];