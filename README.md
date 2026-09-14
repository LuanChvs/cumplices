# Cúmplices — jogos para dois (ou +)

Quatro jogos rápidos pra casais jogarem juntos no mesmo celular ou computador.
Sem cadastro, sem servidor, sem instalar nada.

🔗 **[Jogar agora](https://SEU-USUARIO.github.io/NOME-DO-REPO/)**

## Os jogos

- **Sintonia** — gire a roleta, caia numa categoria, respondam a mesma pergunta ao mesmo tempo.
- **Stop do casal** — uma carta define o tema. Falem uma palavra, apertem a letra inicial e passem a vez. Dois modos: *Até a morte* (cronômetro único) ou *Passa ou repassa* (cronômetro reinicia a cada letra).
- **Verdade ou desafio** — baralho de perguntas sinceras e desafios bobos.
- **Quem conhece melhor** — perguntas sobre o outro pra descobrir quem presta mais atenção.

## Rodar localmente

Baixe o projeto e abra o `index.html` direto no navegador.
Não tem build, não tem dependência, não tem `npm install`.

## Estrutura
index.html → página única, com CSS e lógica do app
/data/*.js → conteúdo (perguntas, temas, cartas) separado por jogo
/og/preview.png → imagem de compartilhamento (Open Graph)
icon.svg → favicon
apple-touch-icon.png → ícone pra iOS

Pra adicionar ou editar perguntas/temas, mexa **só** nos arquivos em `/data`.
O `index.html` não precisa saber que eles existem.

## Adicionar conteúdo

Cada jogo tem seu próprio arquivo em `/data`:

- **`sintonia.js`** — categorias e perguntas da roleta. Cada categoria tem um nome, uma cor e uma lista de perguntas.
- **`verdades-desafios.js`** — listas de verdades e desafios.
- **`quiz-perguntas.js`** — perguntas do "quem conhece melhor".
- **`stop-temas.js`** — temas do Stop e o alfabeto disponível.

Basta abrir o arquivo, adicionar uma linha na lista e salvar.

## Stack

HTML, CSS e JavaScript puro. Hospedado no GitHub Pages.

## Licença

Uso pessoal livre. Se for publicar uma versão derivada, mantém o link do original.