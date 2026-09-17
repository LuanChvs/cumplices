# Cúmplices — jogos para dois (ou +)

Cúmplices é uma coleção de jogos rápidos para jogar juntos, no mesmo celular ou computador.

Sem cadastro, sem backend e sem instalação obrigatória. O projeto é uma aplicação web estática, com suporte a PWA e preferências salvas localmente no navegador.

🔗 **[Jogar agora](https://luanchvs.github.io/cumplices/)**

## Jogos

- **Conexão** — gire a roleta, caia em uma categoria e respondam a mesma pergunta ao mesmo tempo.
- **Stop do casal** — uma carta define o tema. Falem uma palavra do tema, apertem a letra inicial e passem a vez. Tem os modos *Até a morte* e *Passa ou repassa*.
- **Verdade ou desafio** — baralho de verdades e desafios, com conteúdo adaptado ao modo Casal ou Resenha.
- **Quem conhece melhor** — perguntas sobre o outro, com placar por rodada.
- **Jogo da Velha** — modo Clássico e variação *Mate ou Morra*.
- **Xadrez** — partida para dois com roque, en passant, promoção, desfazer e interface adaptada para telas horizontais.
- **Quem Sou Eu** — escolha um tema ou escreva um nome livre, defina o tempo e descubra quem ou o que está na cabeça do outro.

## Modos e recursos do app

**Modo Resenha** adapta conteúdos de jogos que têm versões para casal e amigos.

**Modo Jogo** pode recolher a barra superior em telas horizontais para liberar mais espaço durante a partida. Em telas menores deitadas, ele é ativado automaticamente; em telas horizontais maiores, pode ser ativado pelas configurações.

**Preferências** incluem tema claro/escuro e sons, além do Modo Resenha e do Modo Jogo. As preferências e alguns nomes de jogadores ficam salvos no `localStorage`.

**PWA**: o projeto possui `manifest.json`, ícones próprios e Service Worker para cache dos arquivos e funcionamento offline.

## Estrutura

```text
index.html                 entrada da aplicação e montagem da interface base
js/games.js                catálogo central dos jogos e rotas
js/games/                  lógica específica de cada jogo
js/core/                   recursos compartilhados entre os jogos
js/home.js                 tela inicial e catálogo visual
js/router.js               rotas, troca de telas e navegação do Modo Jogo
js/app.js                  configurações globais e inicialização do app
data/                     conteúdos dos jogos separados da lógica
css/style.css              sistema visual global e regras compartilhadas
css/games/                 estilos específicos de cada jogo
sounds/                    efeitos sonoros usados pelo app
manifest.json              configuração da PWA
sw.js                      cache e suporte offline
og/                        imagem de compartilhamento
icon*.svg/png              ícones da aplicação
```

### Conteúdo dos jogos

Os conteúdos ficam separados da lógica em `/data`:

- `sintonia.js` — categorias e perguntas da roleta de **Conexão**.
- `verdades-desafios.js` — verdades e desafios.
- `quiz-perguntas.js` — perguntas do Quem conhece melhor.
- `stop-temas.js` — temas e letras do Stop.
- `jogo-da-velha.js` — configuração dos modos e regras-base do Jogo da Velha.
- `quem-sou-eu.js` — temas e nomes do Quem Sou Eu.

Para adicionar ou editar conteúdo, prefira mexer nos arquivos de `/data` sem alterar a lógica dos jogos.

## Rodar localmente

O projeto não usa build nem dependências de `npm`.

Para abrir rapidamente, `index.html` pode ser aberto diretamente no navegador. Para testar recursos de PWA, Service Worker e comportamento offline, use o site publicado no GitHub Pages ou um servidor local HTTP/HTTPS.

## Stack

HTML, CSS e JavaScript puro, hospedados no GitHub Pages.

A aplicação não depende de banco de dados ou backend para funcionar.

## Licença

Uso pessoal livre. Se for publicar uma versão derivada, mantém o link do original.
