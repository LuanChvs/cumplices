/* =========================================================
   TERMO — BANCO DE PALAVRAS
   answers = palavras que podem ser a resposta do dia/aleatória.
   guesses = palavras que podem ser usadas como tentativa.
   A comparação ignora acentos.
========================================================= */

window.DATA = window.DATA || {};

window.DATA.termo = {
  answers: [
    "abafa","abate","abriu","acaso","acima","acres","adeus","adota","afeto","agora",
    "ajuda","alado","alega","alema","aluno","amado","amigo","amora","andar","antes",
    "apaga","apela","apito","apoio","arado","arena","argila","armar","arroz","assar",
    "ataca","atras","aviso","aviva","azedo","banco","banho","barco","barra","beber",
    "bebeu","beijo","bicho","bingo","blusa","bocas","bolsa","bolso","bravo","brisa",
    "busca","cabra","cacao","caixa","calma","campo","canto","carne","carro","casal",
    "casca","casos","cerca","certo","chega","cheio","choro","chuva","cinco","claro",
    "classe","cobre","cocar","coisa","colar","colhe","conta","corpo","corre","costa",
    "couro","cravo","crise","culta","curva","dados","danca","deixa","dente","desde",
    "dever","digna","disco","doido","dolar","dormi","drama","dupla","durar","educa",
    "efeito","eleva","email","enfim","entra","envia","errar","escola","escre","escuta",
    "espiã","estar","exato","falar","falta","fases","favor","fazer","fecha","feira",
    "feliz","ferro","festa","ficar","filho","final","firme","fogo","folha","forca",
    "frase","fruta","fundo","ganha","gente","gosto","graca","grande","grupo","guarda",
    "havia","hotel","humor","ideia","igual","ilhas","imita","jogar","jovem","junto",
    "leite","letra","livro","lugar","luzes","magia","maior","marca","massa","medir",
    "meios","menor","mente","meses","minha","morar","mundo","nadar","nasce","natal",
    "naves","negar","noite","nomea","nossa","novos","nunca","olhar","outra","pagar",
    "papel","parte","passa","passe","pedra","peixe","perde","perto","piano","pinta",
    "poder","porta","praia","prato","preto","prova","pular","quase","quente","radio",
    "razão","recebe","reino","resto","risco","rosto","ruim","saber","sabia","sabor",
    "saiu","salto","santo","saude","segui","segue","sexta","simples","sobre","sorte",
    "suave","tempo","tenho","terra","texto","tinta","tirar","todos","torna","trata",
    "trevo","troca","turma","ultimo","vazio","velho","vento","verbo","verde","vezes",
    "video","vinho","visao","viver","volta","votar","vozes","zebra","zelar"
  ],

  guesses: [
    ...window.DATA.termo.answers,
    "acude","adaga","agudo","aluga","amplo","anexo","apelo","aroma","atomo","audio",
    "autor","aviao","bambu","bloco","brabo","bruxa","burro","cacto","cedro","cenas",
    "chave","chute","cinto","cobra","cofre","comer","creme","dedos","deusa","dizia",
    "doses","ducha","elite","entes","etapa","exige","extra","fatia","ficha","finge",
    "fluir","fobia","fonte","forma","forte","fraco","freio","gaita","ganso","girar",
    "guria","heroi","idoso","impar","indio","janta","largo","lenda","limpo","linha",
    "lombo","lunar","macio","macho","malha","manga","manto","marco","mudar","nervo",
    "ninho","nobre","nuvem","obras","olhos","opcao","ordem","ouvir","palco","panda",
    "pardo","pasta","pavio","penca","pente","perna","peste","pilha","pingo","plano",
    "pleno","pombo","ponto","posto","praga","primo","pulso","queda","raiva","rampa",
    "raspa","regra","remar","roupa","salsa","selva","senha","sinal","sonho","sushi",
    "tarde","teias","temer","tigre","tocar","tomar","torta","trama","treno","tripa",
    "truque","turno","vapor","vidro","vigor","vinte","viuva","vulto","xampu","zanga"
  ]
};
