# CÚMPLICES — ESPECIFICAÇÃO OFICIAL

## Jogo: FORCA

Documento de referência para implementação, manutenção e futuras alterações.

---

# 1. VISÃO GERAL

O jogo **Forca** será um dos jogos principais do Cúmplices.

Ele terá dois grandes modos:

```text
FORCA
│
├── CLÁSSICO
│   ├── COOP
│   └── VERSUS
│       ├── TIMES
│       └── TODOS CONTRA TODOS
│
└── TERMO
    ├── PALAVRA DO DIA
    ├── ALEATÓRIO
    └── VERSUS
```

O objetivo é transformar o atual jogo Termo em uma parte do sistema Forca, mantendo o Termo existente preservado.

---

# 2. REGRA FUNDAMENTAL — CLÁSSICO

O Forca clássico possui **6 chances**.

IMPORTANTE:

**Chance não é a mesma coisa que tentativa.**

A regra é:

* Acertar uma letra → NÃO consome chance.
* Errar uma letra → consome 1 chance.
* Tentar descobrir a palavra e errar → consome 1 chance.
* Tentar descobrir a palavra e acertar → vitória imediata.
* Chegar a 0 chances → derrota.

Portanto:

```text
6 chances
↓
somente erros consomem chances
```

Exemplo:

Palavra:

```text
CACHORRO
```

Jogador:

```text
A → acerta → 6 chances
E → erra   → 5 chances
C → acerta → 5 chances
I → erra   → 4 chances
O → acerta → 4 chances
```

Letras acertadas não diminuem as chances.

---

# 3. LETRAS

Quando uma letra é escolhida:

* Ela fica indisponível no teclado.
* Não pode ser escolhida novamente.
* Se existir na palavra, todas as ocorrências são reveladas.
* Se não existir, o jogador perde 1 chance.

Exemplo:

```text
Palavra: BANANA

Antes:
_ _ _ _ _ _

Escolhe A:

_ A _ A _ A
```

O teclado deve indicar que `A` já foi utilizada.

---

# 4. TENTATIVA DE PALAVRA

Em determinados modos, o jogador poderá escolher entre:

```text
🔤 Liberar letra
🎯 Tentar palavra
```

Ao tentar a palavra:

### Se acertar:

A rodada termina imediatamente com vitória.

### Se errar:

O jogador perde 1 chance.

Exemplo:

```text
Chances: 4

Tentativa:
"CACHORRA"

Resultado:
ERRO

Chances: 3
```

A tentativa errada também encerra a vez do jogador.

---

# 5. FORCA CLÁSSICO — COOP

## Objetivo

Todos os jogadores jogam juntos contra uma palavra escolhida pelo aplicativo.

## Fluxo

```text
Forca
↓
Clássico
↓
Coop
↓
Escolher tema
↓
Aplicativo sorteia palavra
↓
Jogo
```

Os temas devem seguir a mesma lógica estrutural utilizada pelo **Stop** e pelo **Quem Sou Eu**.

Exemplos de temas:

* Animais
* Comidas
* Filmes
* Profissões
* Lugares
* Objetos
* etc.

## Mecânica

Todos jogam juntos.

Não existe turno individual.

Qualquer jogador pode escolher uma letra.

```text
Acertou letra
→ revela a letra
→ não perde chance

Errou letra
→ perde 1 chance
```

Também pode existir a tentativa de descobrir a palavra.

```text
Acertou palavra
→ vitória

Errou palavra
→ perde 1 chance
```

Ao chegar a 0 chances:

```text
DERROTA
```

---

# 6. FORCA CLÁSSICO — VERSUS

O modo Versus possui duas modalidades:

```text
VERSUS
│
├── TIMES
└── TODOS CONTRA TODOS
```

A diferença fundamental é a estrutura da disputa.

---

# 7. VERSUS — TIMES

## Configuração

O usuário configura:

* Times
* Jogadores de cada time

Exemplo:

```text
TIME 1
Luan
Ana

TIME 2
João
Maria
```

Depois começa a partida.

---

# 8. VERSUS TIMES — MESTRE

Em cada rodada existe um **Mestre**.

O Mestre é o jogador/time responsável por escolher a palavra.

Exemplo:

```text
Time 1 será o mestre.
```

O Time 1 escolhe a palavra.

O Time 2 tenta descobrir.

Depois da rodada, os papéis podem ser invertidos.

---

# 9. VERSUS TIMES — MECÂNICA

A equipe que está tentando descobrir recebe a palavra escondida:

```text
_ _ _ _ _ _ _
```

Os jogadores se revezam.

Cada jogador pode escolher:

```text
🔤 Liberar letra
🎯 Tentar palavra
```

### Liberar letra

Se acertar:

```text
→ revela todas as ocorrências
→ não consome chance
→ passa a vez
```

Se errar:

```text
→ consome 1 chance
→ passa a vez
```

### Tentar palavra

Se acertar:

```text
→ vitória imediata
```

Se errar:

```text
→ consome 1 chance
→ passa a vez
```

Máximo:

```text
6 chances
```

---

# 10. VERSUS TIMES — PONTUAÇÃO

A pontuação é baseada na eficiência de quem está tentando descobrir.

## Se o time descobrir a palavra

Quanto menos erros tiver cometido, mais pontos recebe.

|   Erros cometidos | Pontos do time que descobriu |
| ----------------: | ---------------------------: |
|                 0 |                            6 |
|                 1 |                            5 |
|                 2 |                            4 |
|                 3 |                            3 |
|                 4 |                            2 |
|                 5 |                            1 |
| 6 / não descobriu |                            0 |

## Se o time não descobrir

O Mestre recebe:

```text
+6 pontos
```

O time que tentou recebe:

```text
+0
```

## Exemplo

Palavra:

```text
CACHORRO
```

O time faz:

```text
A ✓
E ✗
C ✓
I ✗
O ✓
U ✗
CACHORRO ✓
```

Total de erros:

```text
3
```

Pontuação:

```text
Time que descobriu: +3
Mestre: +0
```

Se chegar a 6 erros sem descobrir:

```text
Mestre: +6
Adversário: +0
```

---

# 11. VERSUS — TODOS CONTRA TODOS

Este modo possui uma dinâmica própria.

Primeiro são selecionados os jogadores.

Exemplo:

```text
Jogadores:

Luan
Ana
João
Maria
```

Depois o jogo define:

```text
"Luan será o Mestre."
```

O Mestre escolhe uma palavra.

A palavra fica escondida para os demais jogadores.

---

# 12. TODOS CONTRA TODOS — ROTAÇÃO

O Mestre não joga tentando descobrir.

Os outros jogadores se revezam.

Exemplo:

```text
Mestre: Luan

↓
Ana
↓
João
↓
Maria
↓
Ana
↓
João
↓
...
```

Cada jogador recebe uma vez por ciclo.

---

# 13. TODOS CONTRA TODOS — AÇÃO DO JOGADOR

Quando chega sua vez, o jogador escolhe entre:

```text
🔤 Liberar letra
🎯 Tentar palavra
```

## Liberar letra

### Se acertar:

```text
→ letra é revelada
→ não consome chance
→ jogador recebe +1 ponto
→ Mestre recebe +1 ponto
→ passa a vez
```

### Se errar:

```text
→ consome 1 chance
→ Mestre recebe +1 ponto
→ jogador não recebe ponto pela letra
→ passa a vez
```

## Tentar palavra

### Se acertar:

```text
→ jogador recebe +3 pontos
→ rodada termina
```

### Se errar:

```text
→ consome 1 chance
→ Mestre recebe +1 ponto
→ passa a vez
```

---

# 14. TODOS CONTRA TODOS — PONTUAÇÃO

Existem três formas de pontuação:

### Mestre

O Mestre recebe:

```text
+1 ponto
```

por cada vez que um jogador realiza uma ação/recebe uma passagem de turno.

Ou seja, toda vez que um jogador joga, o Mestre ganha 1 ponto.

Isso inclui:

* letra acertada;
* letra errada;
* tentativa de palavra certa;
* tentativa de palavra errada.

A rodada termina imediatamente quando a palavra é descoberta ou quando as 6 chances acabam.

### Jogador que acerta uma letra

Recebe:

```text
+1 ponto
```

por cada letra correta liberada.

Se uma letra aparece várias vezes na palavra, a ação de revelar aquela letra vale **1 ponto**, e não 1 ponto por ocorrência.

Exemplo:

```text
BANANA

Jogador escolhe A.

A aparece 3 vezes.

Jogador recebe:
+1 ponto
```

### Jogador que acerta a palavra

Recebe:

```text
+3 pontos
```

A rodada termina imediatamente.

---

# 15. TODOS CONTRA TODOS — EXEMPLO

Jogadores:

```text
Luan
Ana
João
Maria
```

Mestre:

```text
Luan
```

Palavra:

```text
CACHORRO
```

### Ana

Escolhe:

```text
A
```

Acertou.

```text
Ana +1
Luan +1
```

### João

Escolhe:

```text
E
```

Errou.

```text
João +0
Luan +1
Chances: 5
```

### Maria

Escolhe:

```text
O
```

Acertou.

```text
Maria +1
Luan +1
```

### Ana

Tenta:

```text
CACHORRO
```

Acerta.

```text
Ana +3
Luan +1
```

Rodada termina.

---

# 16. TODOS CONTRA TODOS — ROTAÇÃO DO MESTRE

Após uma rodada, o Mestre deve ser substituído pelo próximo jogador.

Exemplo:

```text
Rodada 1
Mestre: Luan

Rodada 2
Mestre: Ana

Rodada 3
Mestre: João

Rodada 4
Mestre: Maria
```

A rotação deve continuar de maneira circular.

---

# 17. TERMO

O Termo já existente no Cúmplices deve ser **preservado**.

Não modificar o funcionamento do modo:

```text
TERMO → PALAVRA DO DIA
```

O jogo atual já possui:

* Grid
* Teclado
* 6 tentativas
* Verde
* Amarelo
* Cor de letra ausente
* Tratamento de letras repetidas
* Normalização de acentos
* Edição de letras
* Flip das células
* Animação de vitória
* Animação de derrota
* Persistência local
* Palavra do dia

Esses elementos devem permanecer funcionando.

---

# 18. TERMO — NOVOS MODOS

O Termo passará a ter três opções:

```text
TERMO

📅 Palavra do dia
🎲 Aleatório
⚔️ Versus
```

---

# 19. TERMO — PALAVRA DO DIA

É o Termo atual.

O objetivo é manter a experiência já construída.

Não alterar sem necessidade.

---

# 20. TERMO — ALEATÓRIO

Permite jogar Termo novamente depois de utilizar a Palavra do Dia.

Diferença:

```text
Palavra do dia
→ palavra determinada pelo dia

Aleatório
→ nova palavra sorteada para a partida
```

O modo Aleatório deve permitir iniciar novas partidas sem depender da Palavra do Dia.

---

# 21. TERMO — VERSUS

No Versus, uma pessoa escolhe uma palavra para outra pessoa descobrir.

Fluxo:

```text
Termo
↓
Versus
↓
Definir quantidade de letras
↓
Jogador 1 digita a palavra
↓
Confirma
↓
Passar o celular
↓
Jogador 2 tenta descobrir
```

---

# 22. TERMO VERSUS — TAMANHO DA PALAVRA

Diferentemente do Termo tradicional, o tamanho da palavra é configurável.

Exemplo:

```text
Quantidade de letras:

5
6
7
8
...
```

O jogador escolhe o tamanho.

Depois informa a palavra correspondente.

Exemplo:

```text
Quantidade: 7

Palavra:
CACHORRO
```

O tamanho escolhido deve determinar o tamanho do grid e das palavras válidas daquela partida.

---

# 23. TERMO VERSUS — REGRAS

A pessoa que recebe o desafio deve descobrir a palavra usando a mecânica do Termo.

Mantém-se:

* Verde = letra correta na posição correta.
* Amarelo = letra existente em posição diferente.
* Ausente = letra não existente.
* Letras repetidas devem ser tratadas corretamente.
* Acentos devem ser ignorados na comparação.
* O usuário trabalha com letras-base.

Exemplo:

```text
A = A, Á, À, Ã, Â...
C = C, Ç
```

A normalização deve continuar seguindo essa lógica.

---

# 24. DIFERENÇA ENTRE FORCA E TERMO

Embora os dois trabalhem com palavras, são jogos diferentes.

## FORCA

Base:

```text
LETRAS
↓
ERROS
↓
6 CHANCES
↓
PALAVRA
```

A palavra pode ser descoberta letra por letra.

## TERMO

Base:

```text
TENTATIVAS DE PALAVRAS
↓
POSIÇÕES
↓
VERDE / AMARELO / AUSENTE
```

O jogador tenta palavras completas.

Não transformar os dois em um único sistema visual/mecânico.

---

# 25. ARQUITETURA RECOMENDADA

O Termo existente deve continuar isolado.

O Forca deve possuir seu próprio núcleo de lógica.

Estrutura conceitual:

```text
js/games/
│
├── forca.js
├── forca-coop.js
├── forca-versus.js
│
├── termo.js
├── termo-random.js
└── termo-versus.js
```

Núcleo compartilhado do Forca:

```text
forca-engine.js
```

Responsável por:

* palavra;
* letras utilizadas;
* letras reveladas;
* chances;
* erros;
* tentativa de palavra;
* vitória;
* derrota.

Os modos utilizam o mesmo motor, mas possuem regras próprias de turno e pontuação.

---

# 26. DADOS

Os temas do Forca devem seguir a arquitetura de dados existente no Cúmplices.

Conceitualmente:

```text
data/
├── forca.js
└── termo.js
```

O Forca deve possuir palavras organizadas por tema.

Exemplo:

```js
{
  animais: [
    "cachorro",
    "gato",
    "elefante"
  ],

  comidas: [
    "pizza",
    "lasanha",
    "hamburguer"
  ]
}
```

A estrutura real deve respeitar a arquitetura já existente no projeto.

---

# 27. REGRAS DE UI/NAVEGAÇÃO

Tela principal:

```text
FORCA
```

Primeira escolha:

```text
🔤 Clássico
🔠 Termo
```

Clássico:

```text
🤝 Coop
⚔️ Versus
```

Versus:

```text
👥 Times
🧑 Todos contra todos
```

Termo:

```text
📅 Palavra do dia
🎲 Aleatório
⚔️ Versus
```

---

# 28. FIM DE CADA RODADA

Nos modos competitivos, ao final de cada rodada deve existir a possibilidade de:

```text
🔄 Jogar novamente / próxima rodada
⚙️ Mudar configurações
← Voltar para seleção de jogo
```

A estrutura exata dos botões pode ser refinada visualmente depois.

---

# 29. PRINCÍPIO DE IMPLEMENTAÇÃO

O jogo deve ser implementado por etapas.

## Fase 1 — Estrutura

* Criar Forca.
* Criar seleção Clássico/Termo.
* Criar navegação dos modos.
* Preservar Termo atual.

## Fase 2 — Motor Forca

* Palavra.
* Tema.
* Letras.
* Teclado.
* 6 chances.
* Revelação.
* Tentativa de palavra.
* Vitória/derrota.

## Fase 3 — Coop

* Temas.
* Sorteio.
* Partida cooperativa.
* Resultado.

## Fase 4 — Versus Times

* Jogadores/times.
* Mestre.
* Alternância.
* Pontuação.
* Placar.

## Fase 5 — Todos contra Todos

* Jogadores.
* Mestre.
* Rotação.
* Pontuação individual.
* Pontuação do Mestre.

## Fase 6 — Termo

* Aleatório.
* Versus.
* Quantidade de letras configurável.

## Fase 7 — Refinamento visual

Somente depois de toda a lógica estar funcionando:

* Responsividade.
* Animações.
* Microinterações.
* Polimento visual.
* Consistência com o restante do Cúmplices.

---

# 30. REGRA DE OURO DO PROJETO

O **Termo atual está aprovado e não deve ser quebrado**.

Qualquer nova funcionalidade deve ser adicionada de maneira isolada.

Não alterar sem necessidade:

* animações existentes;
* cores existentes;
* teclado;
* sistema de avaliação;
* edição de letras;
* persistência;
* Palavra do Dia.

O objetivo é adicionar funcionalidades ao redor do Termo, não reescrever o Termo que já está funcionando.

---

# 31. RESUMO DAS REGRAS DEFINITIVAS

```text
FORCA CLÁSSICO
6 CHANCES

Acertou letra
→ não perde chance

Errou letra
→ -1 chance

Errou palavra
→ -1 chance

Acertou palavra
→ vitória
```

```text
COOP
Todos jogam juntos.
Sem turnos.
App escolhe a palavra pelo tema.
```

```text
VERSUS TIMES
Um time é o Mestre.
Outro tenta descobrir.

Mestre perde:
→ +6 para Mestre.

Adversário acerta:
0 erros → +6
1 erro  → +5
2 erros → +4
3 erros → +3
4 erros → +2
5 erros → +1
6 erros → +0
```

```text
TODOS CONTRA TODOS

Um jogador é Mestre.

Cada jogador joga individualmente.

Mestre:
→ +1 por cada ação/turno realizado.

Acertou letra:
→ jogador +1
→ Mestre +1

Errou letra:
→ Mestre +1
→ -1 chance

Acertou palavra:
→ jogador +3
→ Mestre +1

Errou palavra:
→ Mestre +1
→ -1 chance

Novo Mestre:
→ próximo jogador da ordem.
```

```text
TERMO

Palavra do dia
→ manter atual.

Aleatório
→ nova palavra.

Versus
→ jogador define palavra.
→ tamanho configurável.
→ outro jogador tenta descobrir.
```

---

# STATUS

Este documento representa a especificação acordada para o desenvolvimento do **Forca + Termo do Cúmplices**.

Qualquer alteração futura deve ser tratada como uma mudança deliberada de especificação, e não como interpretação de uma regra já definida.
