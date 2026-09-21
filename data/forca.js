/* =========================================================
   FORCA — BANCO DE PALAVRAS
   Catálogo amplo para o modo clássico.
   As palavras ficam sem acentos para manter a entrada do teclado
   simples e compatível com a normalização do jogo.
========================================================= */

window.DATA = window.DATA || {};

window.DATA.forca = {
  themes: {
    Animais: [
      'gato','cachorro','elefante','girafa','coelho','macaco','tigre','leao','panda','cavalo',
      'zebra','urso','lobo','raposa','camelo','jacare','tartaruga','golfinho','baleia','pinguim'
    ],
    Aves: [
      'aguia','arara','papagaio','pavao','tucano','coruja','canario','pardal','flamingo','avestruz',
      'galinha','galo','cisne','pelicano','garca','gaivota','beija-flor','condor','falcao','periquito'
    ],
    Insetos: [
      'abelha','formiga','borboleta','besouro','barata','mosquito','mosca','grilo','gafanhoto','joaninha',
      'libelula','cupim','vespa','mariposa','cigarra','louva-a-deus','pulga','piolho','vaga-lume','barbeiro'
    ],
    AnimaisMarinhos: [
      'tubarao','baleia','golfinho','polvo','lula','caranguejo','lagosta','camarao','tartaruga','arraia',
      'medusa','cavalo-marinho','estrela-do-mar','ouriço','foca','morsa','sardinha','atum','bacalhau','enguia'
    ],
    Comidas: [
      'pizza','lasanha','hamburguer','coxinha','pipoca','sushi','salada','pastel','brigadeiro','sanduiche',
      'esfiha','risoto','panqueca','tapioca','feijoada','moqueca','acaraje','nhoque','raviole','omelete'
    ],
    Frutas: [
      'banana','maca','laranja','uva','morango','abacaxi','manga','melancia','mamao','goiaba',
      'kiwi','pera','pessego','ameixa','cereja','coco','maracuja','limao','tangerina','abacate'
    ],
    Doces: [
      'brigadeiro','beijinho','quindim','pudim','sorvete','chocolate','paçoca','cocada','goiabada','rapadura',
      'brownie','cupcake','biscoito','bala','pirulito','gelatina','mousse','torta','donut','suspiro'
    ],
    Bebidas: [
      'agua','cafe','cha','suco','refrigerante','limonada','vitamina','chocolate','mate','cappuccino',
      'espresso','milkshake','smoothie','caldo','isotonico','energetico','guarana','cajuina','leite','agua-de-coco'
    ],
    Cozinha: [
      'frigideira','panela','liquidificador','batedeira','forno','fogao','microondas','torradeira','ralador','escorredor',
      'espremedor','faca','colher','garfo','prato','tigela','travessa','panela-de-pressao','abridor','peneira'
    ],
    Objetos: [
      'cadeira','espelho','garrafa','celular','tesoura','mochila','relogio','travesseiro','oculos','guarda-chuva',
      'caneta','lapis','caderno','chave','carteira','almofada','vaso','abajur','controle','fones'
    ],
    Casa: [
      'sofa','mesa','cama','armario','estante','tapete','cortina','janela','porta','chuveiro',
      'torneira','vaso-sanitario','geladeira','televisao','ventilador','aspirador','varanda','escada','quarto','cozinha'
    ],
    Escola: [
      'professor','aluno','caderno','lapis','borracha','caneta','mochila','quadro','giz','prova',
      'trabalho','recreio','biblioteca','diretoria','colegio','universidade','matematica','historia','geografia','biologia'
    ],
    Profissoes: [
      'medico','professor','engenheiro','advogado','dentista','fotografo','jornalista','cozinheiro','piloto','arquiteto',
      'programador','designer','enfermeiro','bombeiro','policial','veterinario','farmaceutico','contador','eletricista','mecanico'
    ],
    Esportes: [
      'futebol','basquete','volei','tenis','natacao','corrida','ciclismo','boxe','karate','judo',
      'surfe','skate','ginastica','esgrima','golfe','beisebol','handebol','atletismo','remo','escalada'
    ],
    Futebol: [
      'goleiro','zagueiro','atacante','volante','drible','escanteio','penalti','gol','torcida','campeonato',
      'estadio','arbitro','cartao','chuteira','trave','gramado','impedimento','defesa','passe','cobranca'
    ],
    Musica: [
      'violao','guitarra','piano','bateria','teclado','saxofone','trompete','violino','flauta','microfone',
      'cantor','banda','album','show','melodia','ritmo','refrão','musica','palco','playlist'
    ],
    Instrumentos: [
      'violao','guitarra','baixo','piano','teclado','bateria','violino','viola','cello','flauta',
      'clarinete','saxofone','trompete','trombone','acordeao','harpa','pandeiro','cavaquinho','ukulele','tambor'
    ],
    Filmes: [
      'avatar','matrix','titanic','interestelar','batman','gladiador','parasita','carros','shrek','frozen',
      'inception','rocky','alien','coringa','amadeus','moana','up','wall-e','jumanji','coco'
    ],
    Series: [
      'friends','lost','dark','dexter','breaking-bad','the-office','round-6','vikings','loki','wednesday',
      'stranger-things','arcane','cobra-kai','the-boys','house','suits','black-mirror','prison-break','narcos','fleabag'
    ],
    Desenhos: [
      'simpsons','pokemon','naruto','dragon-ball','tom-e-jerry','bob-esponja','ben-10','futurama','avatar','coragem',
      'pica-pau','chaves','digimon','yu-gi-oh','peppa','rugrats','hora-de-aventura','gravity-falls','mickey','garfield'
    ],
    Jogos: [
      'minecraft','tetris','fortnite','valorant','pokemon','zelda','mario','sonic','terraria','roblox',
      'among-us','overwatch','fifa','tekken','street-fighter','celeste','hollow-knight','portal','god-of-war','undertale'
    ],
    Tecnologia: [
      'computador','celular','internet','teclado','mouse','monitor','processador','memoria','servidor','algoritmo',
      'programacao','software','hardware','aplicativo','navegador','arquivo','banco-de-dados','codigo','robotica','inteligencia'
    ],
    Internet: [
      'site','blog','email','senha','perfil','postagem','video','streaming','podcast','download',
      'upload','nuvem','login','comentario','curtida','seguidor','canal','forum','memes','notificacao'
    ],
    RedesSociais: [
      'instagram','facebook','youtube','tiktok','whatsapp','telegram','discord','reddit','twitter','linkedin',
      'stories','reels','post','live','perfil','hashtag','seguidor','comentario','curtida','mensagem'
    ],
    Lugares: [
      'brasil','paris','roma','londres','bahia','amazonas','canada','japao','egito','argentina',
      'lisboa','madrid','berlim','sidney','dubai','nova-york','mexico','chile','peru','grecia'
    ],
    Paises: [
      'brasil','argentina','chile','uruguai','paraguai','bolivia','peru','colombia','mexico','canada',
      'estados-unidos','portugal','espanha','franca','italia','alemanha','japao','china','india','australia'
    ],
    Cidades: [
      'sao-paulo','rio-de-janeiro','salvador','brasilia','recife','fortaleza','curitiba','manaus','belem','goiania',
      'campinas','santos','florianopolis','porto-alegre','lisboa','paris','roma','londres','toquio','nova-york'
    ],
    Natureza: [
      'floresta','montanha','cachoeira','rio','lago','oceano','praia','deserto','vulcao','geleira',
      'caverna','ilha','vale','pantano','selva','trilha','penhasco','arvore','jardim','campo'
    ],
    Clima: [
      'chuva','sol','vento','neve','granizo','tempestade','trovao','relampago','furacao','tornado',
      'neblina','geada','seca','calor','frio','umidade','nublado','ensolarado','garoa','temporal'
    ],
    Espaco: [
      'planeta','estrela','cometa','asteroide','galaxia','lua','sol','marte','venus','jupiter',
      'saturno','mercurio','netuno','urano','plutao','foguete','astronauta','orbita','eclipse','universo'
    ],
    Ciencia: [
      'atomo','celula','energia','gravidade','materia','molecula','eletron','proton','neutron','genetica',
      'evolucao','quimica','fisica','biologia','astronomia','geologia','bacteria','virus','experimento','microscopio'
    ],
    CorpoHumano: [
      'cabeca','cerebro','coracao','pulmao','estomago','figado','rim','braco','mao','dedo',
      'perna','joelho','pe','ombro','cotovelo','nariz','boca','olho','orelha','dente'
    ],
    Roupas: [
      'camisa','calca','vestido','saia','shorts','casaco','blusa','jaqueta','terno','gravata',
      'meia','sapato','tenis','sandalia','chinelo','chapeu','bone','luva','cachecol','pijama'
    ],
    Acessorios: [
      'oculos','relogio','pulseira','colar','brinco','anel','cinto','bolsa','mochila','carteira',
      'chaveiro','chapeu','bone','gravata','cachecol','luva','guarda-chuva','fone','headset','presilha'
    ],
    Transporte: [
      'carro','onibus','trem','metro','aviao','navio','barco','bicicleta','motocicleta','patinete',
      'caminhao','ambulancia','trator','helicoptero','submarino','foguete','van','taxi','bonde','caiaque'
    ],
    Veiculos: [
      'sedan','hatch','pickup','suv','caminhao','onibus','motocicleta','scooter','bicicleta','patinete',
      'aviao','helicoptero','jato','navio','iate','veleiro','submarino','trator','ambulancia','caminhonete'
    ],
    JogosMesa: [
      'xadrez','dama','dominó','baralho','poker','uno','banco-imobiliario','war','detetive','imagem-e-acao',
      'jenga','ludo','gamão','sinuca','bilhar','bingo','quebra-cabeca','carta','dados','mahjong'
    ],
    Festa: [
      'aniversario','bolo','presente','balao','confete','serpentina','musica','danca','convite','brinde',
      'vela','parabens','fantasia','festa','karaoke','jantar','amigos','convidado','decoracao','surpresa'
    ],
    Ferias: [
      'praia','hotel','viagem','passaporte','mala','aviao','turismo','piscina','resort','cruzeiro',
      'camping','trilha','mochila','mapa','camera','souvenir','excursao','roteiro','descanso','aventura'
    ],
    EscolaMaterias: [
      'matematica','portugues','historia','geografia','biologia','quimica','fisica','filosofia','sociologia','ingles',
      'espanhol','literatura','artes','musica','informatica','redacao','gramatica','algebra','geometria','estatistica'
    ],
    Mitologia: [
      'zeus','hera','poseidon','hades','ares','atena','apolo','artemis','afrodite','hermes',
      'thor','loki','odin','freya','anubis','ra','osiris','isis','medusa','minotauro'
    ],
    Fantasia: [
      'dragao','unicornio','feiticeiro','bruxa','mago','castelo','princesa','principe','cavaleiro','gigante',
      'elfo','fada','goblin','duende','sereia','vampiro','zumbi','monstro','espada','poção'
    ],
    ObjetosEscola: [
      'lapis','caneta','borracha','apontador','caderno','agenda','mochila','estojo','regua','compasso',
      'tesoura','cola','grampeador','calculadora','livro','dicionario','atlas','mapa','marcador','giz'
    ],
    ProfissoesCriativas: [
      'designer','ilustrador','escritor','roteirista','fotografo','cineasta','ator','cantor','compositor','musico',
      'pintor','escultor','arquiteto','animador','editor','diretor','jornalista','publicitario','artista','coreografo'
    ],
    Brasil: [
      'amazonia','pantanal','cerrado','caatinga','bahia','minas-gerais','parana','amazonas','pernambuco','ceara',
      'sao-paulo','brasilia','salvador','recife','manaus','curitiba','gramado','iguacu','carnaval','futebol'
    ]
  }
};
