# Cúmplices — Plano de Lapidação Premium

> Documento vivo para registrar tudo o que ainda pode ser refinado no produto.  
> Não representa uma lista de alterações obrigatórias: cada item deve ser avaliado antes da implementação, preservando simplicidade, desempenho, acessibilidade e a identidade do Cúmplices.

**Status geral:** em planejamento  
**Regra principal:** uma melhoria por vez, com validação visual e funcional antes de avançar.

---

## 1. Princípios da lapidação

- Priorizar conforto e clareza do usuário, não quantidade de efeitos.
- Animações devem ser rápidas, discretas e respeitar `prefers-reduced-motion`.
- Não alterar regras de jogos já consideradas concluídas sem bug explícito.
- Evitar dependências externas desnecessárias.
- Preservar funcionamento offline/PWA.
- Garantir uso confortável em celular, desktop, portrait e landscape.
- Não esconder informações importantes atrás de animações ou efeitos.
- Toda mudança visual deve manter contraste, foco por teclado e áreas de toque adequadas.
- Preferir padrões reutilizáveis a soluções específicas duplicadas.

---

## 2. O que já foi lapidado

- Entrada suave das telas ao trocar de rota.
- Entrada discreta em cascata dos cards da Home.
- Microinterações de toque em botões, chips, opções e cards.
- Abertura refinada do drawer de configurações.
- Entrada sequencial do conteúdo do drawer.
- Estados ativos mais claros nas configurações.
- Expansão animada de “Personalizar sons”.
- Chevron de sons desenhado em CSS.
- Sombras e hover refinados nos cards.
- Resposta visual de foco em campos.
- Atualização do cache do Service Worker após mudanças visuais.

---

# 3. Próximas frentes de lapidação

## 3.1. Linguagem visual de feedback de partida

**Prioridade: muito alta**

Criar uma linguagem consistente para os momentos importantes dos jogos:

- acerto;
- erro;
- vitória;
- derrota;
- empate;
- rodada concluída;
- tempo esgotado;
- palavra descoberta;
- jogador eliminado;
- reinício de partida;
- retorno ao menu.

Avaliar:

- animação curta de destaque;
- hierarquia entre título, mensagem, pontuação e ação seguinte;
- uso controlado das cores sem depender apenas de cor para comunicar estado;
- sons associados, quando habilitados;
- prevenção de excesso de confetes, tremores ou flashes;
- consistência entre jogos sem deixar todos idênticos.

**Cuidado:** não aplicar uma animação genérica indiscriminadamente. Cada jogo deve receber apenas o feedback que fizer sentido.

---

## 3.2. Estados de vitória e derrota

**Prioridade: muito alta**

Revisar individualmente:

- Forca;
- Termo;
- Termo Versus;
- Stop;
- Em Sintonia;
- Quem Sou Eu;
- jogos de tabuleiro e quiz.

Para cada um, verificar:

- se o resultado é percebido imediatamente;
- se o jogador sabe o que aconteceu;
- se a pontuação fica clara;
- se a próxima ação é óbvia;
- se existe uma pausa adequada antes de permitir reiniciar;
- se o resultado funciona bem em telas pequenas.

---

## 3.3. Feedback imediato de ações

**Prioridade: alta**

Auditar todas as ações interativas:

- pressionar uma letra;
- selecionar alternativa;
- girar roleta;
- confirmar palavra;
- passar o celular;
- iniciar cronômetro;
- pausar ou retomar;
- marcar jogador;
- remover jogador;
- avançar rodada;
- revelar resposta.

Verificar se cada ação possui:

- resposta visual imediata;
- estado desabilitado durante processamento, quando necessário;
- prevenção contra toque duplo acidental;
- feedback sonoro opcional coerente;
- foco preservado após atualização do conteúdo.

---

## 3.4. Transições de rodada e reinício

**Prioridade: alta**

Refinar os fluxos de:

- nova rodada;
- jogar novamente;
- trocar jogador;
- trocar mestre;
- reiniciar partida;
- voltar para seleção de modo;
- retornar à Home.

Objetivos:

- deixar claro se a partida foi reiniciada ou apenas avançou;
- evitar perda acidental de progresso;
- manter a posição de rolagem quando fizer sentido;
- impedir transições confusas entre telas;
- garantir que cronômetros sejam encerrados corretamente.

---

# 4. Lapidação específica por jogo

## 4.1. Em Sintonia

- Refinar a entrada da roleta e o estado de roleta girando.
- Garantir que o botão não pareça disponível durante o giro.
- Melhorar a leitura visual da categoria selecionada.
- Destacar o alvo/palpite sem poluir a tela.
- Criar feedback elegante para acerto, erro e revelação.
- Revisar a transição entre as quatro fases.
- Avaliar microanimação na confirmação do posicionamento.
- Garantir que a roleta continue confortável em landscape mobile.
- Verificar acessibilidade de elementos circulares e controles pequenos.

## 4.2. Stop

- Refinar troca de turno entre jogadores.
- Destacar claramente quem está jogando agora.
- Dar feedback ao pressionar uma letra.
- Melhorar visualmente letras já utilizadas.
- Tornar o cronômetro urgente sem causar ansiedade excessiva.
- Criar feedback de palavra válida/inválida, se houver essa validação.
- Melhorar transição entre rodadas.
- Dar clareza à derrota por tempo esgotado.
- Revisar apresentação do placar e das perdas.
- Garantir que o botão de ação principal permaneça acessível em telas baixas.

## 4.3. Forca

- Refinar revelação de letras corretas.
- Criar feedback discreto para erro de letra.
- Melhorar apresentação da palavra completa ao final.
- Dar destaque à contagem de chances restantes.
- Revisar feedback de vitória imediata por palavra.
- Refinar transição para próxima rodada nos modos competitivos.
- Tornar a pontuação fácil de compreender sem exigir leitura longa.
- Avaliar feedback específico para espaços e hífens sem alterar a regra atual.

## 4.4. Termo tradicional

- Revisar feedback de envio de tentativa.
- Melhorar transição de avaliação das letras.
- Garantir leitura clara de verde, amarelo e ausente também sem cor.
- Refinar estados de vitória e derrota.
- Melhorar apresentação da palavra correta ao perder.
- Revisar teclado virtual em telas pequenas.
- Verificar foco e teclado físico após cada tentativa.
- Preservar integralmente as regras atuais do Termo.

## 4.5. Termo Versus

- Refinar tela de configuração da palavra pelo Jogador 1.
- Melhorar transição “passar o celular”.
- Dar feedback mais claro ao confirmar a palavra secreta.
- Refinar avaliação das linhas e animações de resultado.
- Melhorar estados de vitória e derrota.
- Revisar o layout especial de 8–12 letras em landscape mobile.
- Garantir que o teclado não provoque deslocamentos inesperados.
- Preservar a organização vertical definida para palavras longas em celulares girados.

## 4.6. Quem Sou Eu

- Revisar apresentação da carta/personagem.
- Melhorar troca entre jogadores.
- Refinar estados de dica, pergunta e revelação.
- Criar feedback para acerto e encerramento.
- Melhorar legibilidade do texto em celulares.
- Revisar controles de revelar, passar e reiniciar.

## 4.7. Quiz e Verdade/Desafio

- Refinar seleção de alternativas e confirmação de resposta.
- Melhorar feedback correto/incorreto.
- Evitar que a resposta correta fique visível antes do momento adequado.
- Melhorar transição entre perguntas.
- Revisar apresentação de pontuação e progresso.
- Criar estados claros para fim de sessão.
- Garantir que textos longos não quebrem o layout.

## 4.8. Jogos de tabuleiro e demais jogos

- Revisar feedback de movimento válido/inválido.
- Melhorar indicação de turno.
- Refinar estados de vitória, derrota e empate.
- Verificar áreas de toque e leitura em mobile.
- Evitar animações que prejudiquem precisão ou velocidade da jogada.

---

# 5. Home e navegação

## 5.1. Home

- Revisar equilíbrio visual entre hero, descrição e lista de jogos.
- Verificar se os jogos mais importantes são encontrados rapidamente.
- Refinar estados de card indisponível, novo ou recomendado, caso existam.
- Avaliar busca/filtro apenas se o catálogo crescer o suficiente.
- Revisar espaçamentos em telas muito pequenas.
- Garantir que a Home não fique excessivamente animada em cada retorno.
- Avaliar uma transição de retorno à Home sem atrasar o usuário.

## 5.2. Topbar e navegação

- Revisar comportamento da topbar em portrait e landscape.
- Verificar safe areas em aparelhos com notch.
- Refinar botão de navegação no modo jogo.
- Garantir que a topbar não cubra controles importantes.
- Revisar foco por teclado e ordem de navegação.
- Confirmar que a barra não entre nos cálculos de altura quando estiver oculta.
- Validar o comportamento em diferentes alturas de viewport.

## 5.3. Drawer de configurações

Já refinado, mas ainda pode receber auditoria futura:

- foco e navegação completa por teclado;
- possível focus trap enquanto aberto;
- fechamento por tecla Escape;
- fechamento ao tocar fora;
- prevenção de scroll do conteúdo de fundo;
- leitura correta por leitor de tela;
- comportamento em telas muito baixas;
- transição de fechamento tão refinada quanto a abertura.

**Não implementar tudo automaticamente:** avaliar primeiro se o comportamento atual já atende bem ao uso real.

---

# 6. Acessibilidade e conforto

**Prioridade: alta**

- Auditar contraste em tema claro e escuro.
- Verificar foco visível em todos os controles.
- Garantir que estados não dependam somente de cor.
- Conferir tamanho mínimo das áreas de toque.
- Revisar textos de `aria-label`, `aria-expanded`, `aria-pressed` e `aria-live`.
- Garantir que mudanças de tela sejam anunciadas quando necessário.
- Conferir ordem de foco após abrir/fechar modais e drawers.
- Testar navegação apenas por teclado.
- Testar com fonte do sistema ampliada.
- Respeitar `prefers-reduced-motion` em todas as novas animações.
- Evitar flashes rápidos e tremores intensos.
- Garantir que cronômetros tenham indicação textual além de cor.

---

# 7. Responsividade e dispositivos

- Testar celulares pequenos, médios e grandes.
- Testar Android e navegadores Chromium/WebView.
- Testar desktop com janela estreita.
- Testar portrait e landscape em cada jogo.
- Testar alturas reduzidas, especialmente landscape.
- Testar safe areas e barras de navegação do sistema.
- Verificar ausência de scroll horizontal.
- Verificar quando o scroll vertical é necessário e quando não é.
- Confirmar que a viewport inteira seja respeitada sem cortar controles.
- Verificar teclado virtual e redimensionamento de viewport.
- Testar rotação durante uma partida, quando aplicável.

---

# 8. PWA, desempenho e robustez

- Revisar estratégia de cache do Service Worker.
- Confirmar atualização correta após novas versões.
- Evitar cache de arquivos obsoletos.
- Verificar funcionamento offline das telas principais.
- Avaliar preload apenas para recursos realmente necessários.
- Verificar tamanho dos arquivos e imagens.
- Evitar animações que causem travamentos em aparelhos modestos.
- Garantir que timers e listeners sejam limpos ao trocar de rota.
- Procurar listeners duplicados após várias entradas e saídas de jogos.
- Verificar se estados persistidos são compatíveis com versões futuras.
- Tratar falhas de áudio sem impedir o jogo.
- Evitar erros silenciosos no console.

---

# 9. Áudio e feedback sensorial

- Revisar volume relativo entre efeitos.
- Conferir se sons de acerto, erro, vitória e timer têm identidade própria.
- Garantir que sons não sejam disparados em duplicidade.
- Verificar comportamento após o navegador bloquear autoplay.
- Melhorar feedback ao ativar/desativar sons.
- Avaliar som de abertura de partida apenas se não for intrusivo.
- Não tornar o áudio necessário para compreender qualquer estado.

---

# 10. Conteúdo e microcopy

- Revisar textos para manter tom divertido, íntimo e natural.
- Padronizar verbos de ação: “Jogar”, “Continuar”, “Reiniciar”, “Voltar”, “Confirmar”.
- Reduzir textos redundantes.
- Garantir mensagens claras em erros e estados vazios.
- Revisar acentuação, capitalização e pontuação.
- Evitar linguagem técnica para o jogador.
- Conferir textos em telas pequenas e quebras de linha.
- Padronizar mensagens de passagem do celular entre jogadores.

---

# 11. Estados de erro e casos extremos

- Nenhum jogo deve ficar sem ação possível após uma sequência inesperada.
- Impedir envio de formulários vazios quando não fizer sentido.
- Tratar nomes duplicados ou muito longos.
- Tratar quantidade mínima e máxima de jogadores.
- Tratar rotação durante cronômetros.
- Tratar recarregamento acidental da página.
- Tratar retorno do navegador.
- Tratar clique duplo em ações críticas.
- Tratar áudio indisponível.
- Tratar armazenamento local corrompido ou incompatível.
- Garantir mensagens úteis quando uma configuração não puder ser aplicada.

---

# 12. Qualidade técnica e manutenção

- Padronizar tokens de duração, easing, sombras e espaçamentos.
- Evitar valores visuais duplicados espalhados pelo CSS.
- Criar classes reutilizáveis para estados comuns quando houver repetição real.
- Revisar nomes de classes e comentários antigos.
- Remover código morto somente após confirmar que não há dependências.
- Validar sintaxe dos arquivos JavaScript após cada alteração.
- Revisar o Service Worker sempre que novos arquivos forem adicionados.
- Manter README e documentação alinhados com os recursos existentes.
- Registrar alterações relevantes em commits pequenos e descritivos.
- Não misturar refatoração ampla com uma lapidação visual pontual.

---

# 13. Ordem sugerida de execução

1. Feedback de vitória/derrota e encerramento.
2. Feedback imediato de ações dentro dos jogos.
3. Transições de rodada, reinício e troca de jogador.
4. Lapidação individual de Em Sintonia.
5. Lapidação individual de Stop.
6. Lapidação individual de Forca.
7. Lapidação individual de Termo e Termo Versus.
8. Revisão de Quem Sou Eu, Quiz e Verdade/Desafio.
9. Auditoria de acessibilidade.
10. Auditoria completa de responsividade.
11. Auditoria de PWA, desempenho e listeners.
12. Revisão final de microcopy e consistência visual.

---

# 14. Processo para cada item

Antes de implementar:

1. Identificar o arquivo e o fluxo afetado.
2. Verificar se o comportamento atual já está correto.
3. Definir o objetivo de experiência em uma frase.
4. Escolher a menor alteração capaz de atingir o objetivo.
5. Considerar mobile, desktop, acessibilidade e redução de movimento.
6. Implementar isoladamente.
7. Validar sintaxe e referências.
8. Revisar o diff para garantir que nada não solicitado foi alterado.
9. Atualizar o Service Worker se necessário.
10. Registrar aqui o que foi concluído.

---

# 15. Registro de decisões futuras

Use esta seção para anotar decisões antes de mudanças controversas:

- **Item:**
- **Problema observado:**
- **Proposta:**
- **Impacto esperado:**
- **Riscos:**
- **Precisa de teste manual?**
- **Decisão:**
- **Commit:**

---

## Nota final

O objetivo do Cúmplices não é parecer um aplicativo cheio de efeitos. É parecer um produto cuidadosamente pensado: rápido, acolhedor, claro, divertido e confiável. Se uma animação ou detalhe visual chama mais atenção para si do que para a brincadeira, provavelmente precisa ser reduzido ou removido.
