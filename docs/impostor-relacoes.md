# Impostor — Esteira de Relações

> Documento de definição do novo sistema de relações entre palavras do Modo Duo.
>
> O objetivo é controlar a dificuldade dos blefes sem eliminar a aleatoriedade das rodadas.

---

## 1. Conceito

Cada palavra jogável do Impostor deve possuir uma pequena rede de relações semânticas.

Para cada palavra secreta, a base deverá fornecer:

- **2 relações fortes**;
- **2 relações fracas**.

Essas relações serão usadas para gerar as opções de declaração do jogador.

A ideia é que as relações fortes sejam palavras próximas o suficiente para criar confusão durante o interrogatório, enquanto as relações fracas continuam pertencendo ao mesmo universo, mas oferecem uma distinção maior.

---

## 2. Estrutura das quatro opções

Quando um jogador recebe uma palavra secreta, o aplicativo deverá gerar exatamente quatro opções de declaração:

| Tipo | Quantidade | Função |
|---|---:|---|
| Verdadeira | 1 | A própria palavra secreta do jogador |
| Blefe forte | 1 | Uma das relações fortes da palavra secreta |
| Blefe fraco | 1 | Uma das relações fracas da palavra secreta |
| Blefe aleatório | 1 | Outra palavra válida do mesmo tema |

As quatro opções deverão ser embaralhadas antes de serem apresentadas ao jogador.

O jogador não deve saber qual opção foi classificada internamente como forte, fraca ou aleatória.

---

## 3. Relações fortes

As relações fortes são palavras próximas da palavra secreta.

Elas devem compartilhar características suficientes para que perguntas e respostas possam gerar dúvidas reais.

### Exemplo

**Palavra secreta: Leão**

Possíveis relações fortes:

- Tigre;
- Lobo.

Essas palavras podem gerar características em comum com Leão, permitindo que uma declaração falsa permaneça plausível durante parte do interrogatório.

As relações fortes devem ser as opções com maior potencial de confusão.

---

## 4. Relações fracas

As relações fracas continuam pertencendo ao mesmo tema e possuem alguma conexão com a palavra secreta, mas são menos próximas.

### Exemplo

**Palavra secreta: Leão**

Possíveis relações fracas:

- Onça;
- Hiena.

Ainda existe um universo de características compartilhadas, porém perguntas específicas podem diferenciá-las com mais facilidade.

As relações fracas introduzem variedade sem tornar todas as opções igualmente próximas.

---

## 5. Blefe aleatório

Além das relações cadastradas, haverá sempre uma opção aleatória.

Ela deverá ser escolhida entre outras palavras válidas do mesmo tema que:

- não sejam a palavra secreta do próprio jogador;
- não sejam a palavra secreta do adversário;
- não sejam a relação forte selecionada;
- não sejam a relação fraca selecionada.

O objetivo é preservar a imprevisibilidade.

O blefe aleatório não precisa possuir uma relação previamente cadastrada com a palavra secreta.

---

## 6. Regra de bloqueio do adversário

Uma declaração falsa **não pode ser a palavra secreta do adversário**.

Essa regra existe para impedir que o jogador receba como blefe uma palavra que sabemos que o outro jogador possui secretamente.

### Exemplo

**Jogador 1**

> Palavra secreta: Leão

**Jogador 2**

> Palavra secreta: Tigre

Mesmo que **Tigre** seja uma relação forte de Leão, o Jogador 1 não poderá receber Tigre como uma de suas opções de blefe.

Nesse caso, o sistema deverá escolher outra relação forte disponível.

---

## 7. Palavras secretas iguais são permitidas

As palavras secretas dos dois jogadores **podem ser iguais**.

Não existe mais a regra de que as duas palavras secretas precisam ser diferentes.

### Exemplo

> Tema: Animais
>
> Jogador 1: Leão
>
> Jogador 2: Leão

Essa situação é válida.

Ela pode inclusive criar situações engraçadas e inesperadas durante a partida, já que nenhum jogador deve saber automaticamente que o adversário recebeu a mesma palavra.

---

## 8. Regra completa de geração

Para cada jogador:

1. Definir sua palavra secreta.
2. Obter as relações fortes dessa palavra.
3. Obter as relações fracas dessa palavra.
4. Escolher uma relação forte disponível.
5. Escolher uma relação fraca disponível.
6. Escolher uma palavra aleatória válida do tema.
7. Remover qualquer opção que seja a palavra secreta do adversário.
8. Garantir que a própria palavra secreta apareça apenas como a opção verdadeira.
9. Montar as quatro opções:
   - 1 verdadeira;
   - 1 forte;
   - 1 fraca;
   - 1 aleatória.
10. Embaralhar as opções.

A palavra secreta do adversário é uma restrição de blefe, não uma restrição para o sorteio das palavras secretas.

---

## 9. Exemplo completo

### Rodada

**Tema:** Animais

**Jogador 1**

> Palavra secreta: Leão

Base de relações:

- Fortes: Tigre, Lobo
- Fracas: Onça, Hiena

**Jogador 2**

> Palavra secreta: Tigre

Como Tigre é a palavra secreta do adversário, ela não pode aparecer entre os blefes do Jogador 1.

Uma possível geração para o Jogador 1:

| Tipo | Palavra |
|---|---|
| Verdadeira | Leão |
| Blefe forte | Lobo |
| Blefe fraco | Hiena |
| Blefe aleatório | Pinguim |

As opções são então embaralhadas.

---

## 10. Objetivo de dificuldade

A esteira cria três níveis naturais de proximidade:

**🔥 Forte**

Alta semelhança conceitual e maior potencial de confusão.

**🟡 Fraca**

Relação existente, mas com diferenças mais perceptíveis.

**🎲 Aleatória**

Imprevisibilidade dentro do próprio tema.

Isso evita que o jogo dependa apenas de palavras aleatórias e, ao mesmo tempo, evita que todas as opções de blefe sejam previsivelmente próximas.

A dificuldade passa a surgir da combinação entre:

- proximidade semântica;
- perguntas feitas pelos jogadores;
- interpretação das respostas;
- escolha da declaração;
- aleatoriedade da opção distante.

---

## 11. Regra para a base de conteúdo

Toda palavra que puder ser sorteada como palavra secreta deverá possuir, no mínimo:

- **2 relações fortes**;
- **2 relações fracas**.

A base de conteúdo deverá ser considerada incompleta caso uma palavra não possua essas relações.

Isso permitirá futuramente criar uma validação automática do banco de palavras antes de uma rodada.

---

## 12. Diretriz de implementação

A esteira de relações pertence à camada de **dados/conteúdo** do jogo.

A mecânica do jogo deve apenas consumir essas relações.

A estrutura deverá permitir que novas palavras e relações sejam adicionadas sem necessidade de alterar a lógica de interrogatório, julgamento ou resultado.

O objetivo é manter separadas:

- **dados das palavras**;
- **relações entre palavras**;
- **regra de geração das opções**;
- **mecânicas da partida**.

---

## 13. Regra consolidada

> **Toda palavra secreta possui 2 relações fortes e 2 relações fracas.**
>
> **Toda declaração possui 4 opções: 1 verdadeira, 1 blefe forte, 1 blefe fraco e 1 blefe aleatório.**
>
> **As opções são embaralhadas.**
>
> **O blefe nunca pode ser a palavra secreta do adversário.**
>
> **As palavras secretas dos dois jogadores podem ser iguais.**

---

## 14. Próximo passo

1. Estruturar o banco de relações no `data/impostor.js`.
2. Garantir pelo menos 2 relações fortes e 2 fracas para cada palavra.
3. Adaptar a geração das opções de declaração para a nova regra.
4. Preservar o restante da mecânica atual do Impostor.
5. Testar diferentes combinações de palavras e rodadas.
6. Ajustar as relações conforme os testes reais mostrarem quais blefes são mais ou menos interessantes.

---

> **A esteira controla a dificuldade; a aleatoriedade mantém o jogo imprevisível.**
