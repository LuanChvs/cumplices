# Impostor — Documento de Aplicação

> Documento inicial de concepção e aplicação do jogo Impostor no Cúmplices.
>
> Este documento registra a primeira versão das regras e deve ser lapidado durante a construção e os testes práticos.

---

## 1. Visão geral

O **Impostor** é um jogo de dedução social, blefe e interpretação.

Os jogadores recebem informações secretas e precisam conversar, fazer perguntas, interpretar respostas e identificar possíveis mentiras.

O celular funciona como mediador da experiência presencial, sendo responsável por:

- distribuir informações secretas;
- controlar turnos;
- apresentar palavras e temas;
- registrar escolhas;
- controlar perguntas e tentativas;
- revelar resultados;
- calcular pontuação, quando aplicável.

A interação principal continua acontecendo entre os jogadores, e não na tela.

---

## 2. Identidade do jogo

O Impostor deve combinar:

- dedução;
- blefe;
- leitura do comportamento;
- comunicação;
- desconfiança;
- descoberta de informações incompletas.

O jogo deve funcionar em diferentes tamanhos de grupo, mas cada modo precisa ter uma dinâmica própria e coerente.

### Princípio importante

O **Modo Normal** depende de pelo menos três jogadores e deve preservar a experiência social clássica.

O **Modo Duo** não será uma adaptação simplificada do Modo Normal. Ele terá regras próprias, pensadas especificamente para dois jogadores.

---

# 3. Modos previstos

## 3.1. Modo Normal

Modo social para **3 ou mais jogadores**.

Todos recebem uma informação relacionada ao mesmo tema, exceto o impostor, que recebe uma informação diferente ou apenas a indicação de que é o impostor, conforme a variante escolhida.

Os jogadores conversam e fornecem pistas para demonstrar que conhecem o tema, enquanto o impostor tenta se passar por alguém informado.

O grupo precisa identificar o impostor antes que ele consiga sobreviver à votação ou descobrir o tema secreto, conforme as regras finais do modo.

> As regras completas do Modo Normal serão detalhadas em uma etapa posterior, mantendo sua essência social tradicional.

---

## 3.2. Modo Duo — conceito inicial

O Modo Duo foi pensado para dois jogadores e possui uma estrutura própria baseada em:

- palavras secretas diferentes;
- tema compartilhado;
- declarações que podem ser verdadeiras ou falsas;
- perguntas limitadas;
- julgamento final;
- tentativa de descobrir a verdade por trás do blefe.

### Conceito resumido

Cada jogador recebe secretamente uma palavra pertencente ao mesmo tema que a palavra do adversário.

Antes do interrogatório, cada jogador escolhe uma declaração entre opções fornecidas pelo aplicativo. A declaração pode ser:

- a palavra verdadeira que recebeu; ou
- uma palavra falsa, mas plausível e pertencente ao mesmo tema.

Depois, os jogadores fazem perguntas uns aos outros para tentar descobrir a palavra verdadeira do adversário e avaliar se sua declaração inicial foi sincera ou um blefe.

Ao final, cada jogador faz seus julgamentos em segredo e o aplicativo revela os resultados.

---

# 4. Modo Duo — regras iniciais

## 4.1. Participantes

- Exatamente 2 jogadores.
- Os jogadores são identificados como Jogador 1 e Jogador 2.
- Os papéis são equivalentes: ambos investigam e podem blefar.

---

## 4.2. Tema compartilhado

O aplicativo seleciona um tema para a rodada.

Exemplos:

- Animais;
- Comidas;
- Objetos de casa;
- Profissões;
- Lugares;
- Filmes;
- Meios de transporte;
- Esportes.

Ambos os jogadores conhecem o tema, mas não conhecem a palavra secreta recebida pelo adversário.

---

## 4.3. Palavras secretas

Cada jogador recebe uma palavra diferente dentro do mesmo tema.

Exemplo:

> **Tema:** Animais
>
> Jogador 1: Pinguim
>
> Jogador 2: Golfinho

Cada palavra deve ser exibida individualmente, evitando que o outro jogador veja a informação.

As palavras precisam ser:

- conhecidas ou compreensíveis;
- pertencentes claramente ao tema;
- diferentes entre si;
- suficientemente descritíveis;
- não tão semelhantes a ponto de tornar a rodada impossível;
- não tão distantes a ponto de tornar o blefe óbvio.

---

## 4.4. Escolha da declaração

Antes de falar com o adversário, cada jogador recebe opções de declaração geradas pelo aplicativo.

A estrutura inicial proposta é:

- 1 palavra verdadeira;
- 2 palavras falsas plausíveis;
- todas pertencentes ao mesmo tema.

Exemplo:

> Palavra secreta: Pinguim
>
> Opções de declaração:
>
> - Pinguim;
> - Urso-polar;
> - Foca.

O jogador escolhe uma opção e a declara em voz alta.

A escolha não é revelada ao adversário pelo aplicativo. O adversário apenas escuta a palavra falada.

### Regra inicial

A declaração falsa deve ser uma palavra válida do tema e não pode ser a palavra secreta recebida pelo outro jogador.

---

## 4.5. Declaração pública

Os dois jogadores anunciam suas declarações.

Exemplo:

> Jogador 1: “Minha palavra é Urso-polar.”
>
> Jogador 2: “Minha palavra é Luminária.”

A partir desse momento, cada jogador sabe:

- a declaração do adversário;
- o tema da rodada;
- sua própria palavra secreta;

Mas não sabe se a declaração do adversário é verdadeira.

---

## 4.6. Interrogatório

Cada jogador terá inicialmente **3 perguntas** para fazer ao adversário.

As perguntas serão alternadas para manter o equilíbrio:

1. Jogador 1 pergunta;
2. Jogador 2 responde;
3. Jogador 2 pergunta;
4. Jogador 1 responde;
5. Jogador 1 pergunta;
6. Jogador 2 responde;
7. Jogador 2 pergunta;
8. Jogador 1 responde;
9. Jogador 1 pergunta;
10. Jogador 2 responde;
11. Jogador 2 pergunta;
12. Jogador 1 responde.

A ordem exata ainda pode ser ajustada durante os testes.

### Respostas

A proposta inicial é limitar as respostas a:

- Sim;
- Não;
- Talvez.

Isso mantém o foco na interpretação e evita que respostas muito longas entreguem diretamente a palavra.

### Perguntas proibidas inicialmente

Não serão permitidas perguntas que revelem diretamente a resposta, como:

- “Qual é a primeira letra?”;
- “Quantas letras tem?”;
- “É exatamente [palavra]?”;
- “A palavra é [palavra]?”;

A lista definitiva de restrições será definida após os primeiros testes.

---

## 4.7. Julgamento final

Depois do interrogatório, cada jogador responde secretamente a duas perguntas.

### Julgamento 1 — Declaração

> A declaração inicial do adversário era:

- Verdadeira;
- Blefe.

### Julgamento 2 — Palavra verdadeira

> Qual era a palavra secreta verdadeira do adversário?

Os julgamentos devem ser feitos antes da revelação das palavras originais.

---

## 4.8. Revelação

O aplicativo revela simultaneamente:

- a palavra verdadeira de cada jogador;
- a declaração escolhida por cada jogador;
- se a declaração era verdadeira ou falsa;
- o julgamento feito pelo adversário;
- os acertos e erros de cada participante.

A revelação deve deixar clara a diferença entre:

1. descobrir se houve blefe;
2. descobrir qual era a palavra verdadeira.

Um jogador pode acertar uma dessas decisões e errar a outra.

---

# 5. Pontuação inicial proposta

A pontuação ainda é provisória.

| Ação | Pontos |
|---|---:|
| Identificar corretamente se a declaração era verdadeira ou blefe | +1 |
| Adivinhar a palavra secreta verdadeira do adversário | +2 |
| Fazer o adversário errar a avaliação da própria declaração | +1 bônus |

A pontuação pode ser simplificada ou substituída por um sistema de vitórias por rodada após os testes.

### Prioridade

A primeira versão funcional deve validar a diversão da dinâmica antes de investir em um sistema de pontuação complexo.

---

# 6. Fluxo previsto da aplicação

## 6.1. Entrada do jogo

- Apresentar o Impostor.
- Permitir escolher o modo:
  - Normal;
  - Duo.
- Exibir uma explicação curta das regras do modo selecionado.

## 6.2. Preparação do Duo

1. Definir ou sortear o tema.
2. Preparar as duas palavras secretas.
3. Exibir a palavra do Jogador 1.
4. Ocultar a informação.
5. Exibir a palavra do Jogador 2.
6. Ocultar a informação.
7. Apresentar as opções de declaração individualmente.
8. Registrar a escolha de cada jogador.

## 6.3. Declarações

1. Jogador 1 anuncia sua declaração.
2. Jogador 2 anuncia sua declaração.
3. O aplicativo inicia o interrogatório.

## 6.4. Interrogatório

- Controlar o jogador da vez;
- mostrar perguntas restantes;
- registrar a alternância;
- permitir avançar após a resposta;
- impedir que um jogador veja informações secretas indevidas.

## 6.5. Julgamentos

- Cada jogador avalia a declaração do outro.
- Cada jogador tenta adivinhar a palavra verdadeira do outro.
- As respostas ficam ocultas até ambos concluírem.

## 6.6. Resultado

- Revelar todas as informações.
- Mostrar acertos e erros.
- Exibir pontuação, se mantida.
- Permitir iniciar outra rodada ou voltar à seleção de modo.

---

# 7. Diretrizes de conteúdo

## 7.1. Temas

Os temas devem ser amplos o suficiente para permitir blefes, mas específicos o suficiente para orientar as perguntas.

## 7.2. Pares de palavras

As palavras não precisam ser sinônimas, mas devem compartilhar características que permitam perguntas interessantes.

Exemplos iniciais:

| Tema | Palavra A | Palavra B |
|---|---|---|
| Animais | Pinguim | Golfinho |
| Objetos de casa | Espelho | Abajur |
| Comidas | Pizza | Lasanha |
| Profissões | Médico | Professor |
| Lugares | Praia | Montanha |

## 7.3. Opções de blefe

As alternativas falsas devem ser selecionadas com cuidado.

Devem evitar:

- palavras absurdamente distantes;
- palavras muito parecidas que tornem tudo indistinguível;
- opções desconhecidas;
- palavras que entreguem automaticamente a resposta verdadeira;
- repetição excessiva entre rodadas.

---

# 8. Segurança das informações

Como o jogo utiliza um único celular, a experiência precisa controlar cuidadosamente a exibição das informações.

Requisitos iniciais:

- mostrar a palavra secreta apenas no turno correto;
- oferecer uma ação clara para ocultar a informação;
- não deixar palavras secretas visíveis no histórico público;
- separar telas privadas das telas compartilhadas;
- evitar que a navegação acidental revele informações;
- deixar claro quando o celular deve ser entregue ao outro jogador.

A solução deve funcionar offline e sem backend.

---

# 9. Pontos ainda em aberto

## Regras

- As perguntas serão totalmente livres ou selecionadas pelo aplicativo?
- As respostas serão apenas Sim/Não/Talvez ou poderão incluir respostas curtas?
- O jogador poderá passar uma pergunta?
- Haverá limite de tempo para responder?
- A declaração precisa ser sempre uma palavra única?
- Poderemos permitir declarações digitadas livremente em um modo avançado?

## Conteúdo

- Como gerar pares equilibrados?
- Como selecionar boas opções falsas?
- Teremos níveis de dificuldade?
- Como lidar com sinônimos e palavras muito abrangentes?
- Como evitar que os mesmos pares apareçam repetidamente?

## Pontuação

- Pontuação por rodada ou partida completa?
- Melhor de três?
- Vitória por pontos acumulados?
- O bônus por enganar o adversário será mantido?

## Experiência

- O interrogatório terá cronômetro?
- O aplicativo exibirá exemplos de perguntas?
- Haverá modo de perguntas livres e modo guiado?
- Como tornar a revelação mais dramática e clara?

---

# 10. MVP definido para a primeira implementação

A primeira versão jogável deverá conter somente:

- [ ] Entrada do Impostor.
- [ ] Seleção do Modo Duo.
- [ ] Tema compartilhado.
- [ ] Uma palavra secreta para cada jogador.
- [ ] Três opções de declaração por jogador.
- [ ] Declaração verdadeira ou blefe.
- [ ] Três perguntas por jogador.
- [ ] Respostas Sim/Não/Talvez.
- [ ] Julgamento sobre verdade ou blefe.
- [ ] Palpite da palavra verdadeira.
- [ ] Revelação completa.
- [ ] Resultado básico.
- [ ] Nova rodada.

Não fazem parte do primeiro MVP:

- múltiplos modos de Duo;
- banco gigantesco de palavras;
- pontuação avançada;
- partidas online;
- inteligência artificial para avaliar respostas;
- perguntas automáticas complexas;
- sistema de ranking.

---

# 11. Próximos passos

1. Revisar este documento e validar o conceito do Duo.
2. Definir o fluxo visual e as telas necessárias.
3. Inspecionar a arquitetura atual do Cúmplices para escolher onde integrar o jogo.
4. Criar um protótipo funcional com um banco pequeno de conteúdo.
5. Testar partidas reais com duas pessoas.
6. Registrar problemas encontrados.
7. Lapidar regras, conteúdo e pontuação.
8. Só depois expandir para outros modos.

---

# Princípio de desenvolvimento

> **Primeiro fazemos a dinâmica funcionar. Depois fazemos ela ficar excelente.**

O documento é vivo: regras, pontuação e detalhes de interface podem mudar conforme os testes revelarem o que torna o Modo Duo mais divertido, claro e equilibrado.
