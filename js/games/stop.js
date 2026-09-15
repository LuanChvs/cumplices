
/* =========================================================
   STOP DO CASAL
========================================================= */
function renderStop(){
    const wrap = el(`<div></div>`);
    const scoreState = { losses:{}, roundNumber:0 };
    let deck = [];
    let deckPos = 0;
  
    function freshDeck(){ deck = shuffle(STOP_TEMAS); deckPos = 0; }
    function drawCard(){
      if(deckPos >= deck.length) freshDeck();
      return deck[deckPos++];
    }
    freshDeck();
    showSetup();
    return wrap;
  
    function showSetup(){
      scoreState.losses = {};
      scoreState.roundNumber = 0;
  
      let playerNames = ['Jogador 1','Jogador 2'];
      let temaEscolhido = null;
      let modoEscolhido = 'ate-morte';
      let tempoEscolhido = modoPorId(modoEscolhido).tempoPadrao;
  
      wrap.innerHTML = `
        <section class="stage-head">
          <h1>Stop do casal</h1>
          <p>Uma carta define o tema. O jogador da vez fala uma palavra que caiba no tema, aperta a letra inicial dela e passa a vez. Letras já apertadas saem do jogo. Se o cronômetro acabar na sua vez, você perde a rodada.</p>
        </section>
  
        <div class="panel">
          <label class="field-label">Modo de jogo</label>
          <div class="chip-row" id="modoChips"></div>
          <p class="field-hint" id="modoDesc"></p>
        </div>
  
        <div class="panel">
          <label class="field-label">Tema da rodada</label>
          <div class="deck-wrap">
            <div class="theme-card face-down" id="themeCard">?</div>
            <button class="btn btn-ghost" id="drawBtn">Comprar carta</button>
          </div>
        </div>
  
        <div class="panel">
          <label class="field-label" id="tempoFieldLabel"></label>
          <div class="chip-row" id="tempoChips"></div>
        </div>
  
        <div class="panel">
          <label class="field-label">Quem vai jogar</label>
          <div id="playersWrap"></div>
          <button type="button" class="btn btn-ghost add-player-btn" id="addPlayerBtn">+ Adicionar jogador</button>
          <div class="btn-row">
            <button class="btn btn-primary btn-block" id="startBtn" disabled>Comprem uma carta pra começar</button>
          </div>
        </div>
      `;
  
      const themeCard = wrap.querySelector('#themeCard');
      const drawBtn = wrap.querySelector('#drawBtn');
      const modoChips = wrap.querySelector('#modoChips');
      const modoDesc = wrap.querySelector('#modoDesc');
      const tempoFieldLabel = wrap.querySelector('#tempoFieldLabel');
      const tempoChips = wrap.querySelector('#tempoChips');
      const playersWrap = wrap.querySelector('#playersWrap');
      const addPlayerBtn = wrap.querySelector('#addPlayerBtn');
      const startBtn = wrap.querySelector('#startBtn');
  
      drawBtn.addEventListener('click', ()=>{
        temaEscolhido = drawCard();
        themeCard.className = 'theme-card revealed';
        themeCard.textContent = temaEscolhido;
        drawBtn.textContent = 'Comprar outra carta';
        updateStartBtn();
      });
  
      STOP_MODOS.forEach(m=>{
        const c = document.createElement('button');
        c.type = 'button';
        c.className = 'chip' + (m.id === modoEscolhido ? ' selected' : '');
        c.textContent = m.nome;
        c.dataset.modo = m.id;
        c.addEventListener('click', ()=>{
          modoEscolhido = m.id;
          modoChips.querySelectorAll('.chip').forEach(x=>x.classList.toggle('selected', x.dataset.modo === m.id));
          const cfg = modoPorId(modoEscolhido);
          modoDesc.textContent = cfg.desc;
          tempoEscolhido = cfg.tempoPadrao;
          renderTempoChips();
        });
        modoChips.appendChild(c);
      });
      modoDesc.textContent = modoPorId(modoEscolhido).desc;
  
      function renderTempoChips(){
        const cfg = modoPorId(modoEscolhido);
        tempoFieldLabel.textContent = cfg.tempoLabelCampo;
        tempoChips.innerHTML = '';
        cfg.tempos.forEach((s,si)=>{
          const c = document.createElement('button');
          c.type = 'button';
          c.className = 'chip' + (s === tempoEscolhido ? ' selected' : '');
          c.textContent = cfg.tempoLabels[si];
          c.addEventListener('click', ()=>{
            tempoEscolhido = s;
            tempoChips.querySelectorAll('.chip').forEach(x=>x.classList.remove('selected'));
            c.classList.add('selected');
          });
          tempoChips.appendChild(c);
        });
      }
      renderTempoChips();
  
      function renderPlayers(){
        playersWrap.innerHTML = '';
        playerNames.forEach((name,i)=>{
          const row = document.createElement('div');
          row.className = 'player-row';
          row.innerHTML = `
            <input class="text-input" data-i="${i}" value="${name}" placeholder="Jogador ${i+1}">
            ${playerNames.length > 2 ? '<button type="button" class="player-remove" data-remove="'+i+'">×</button>' : ''}
          `;
          playersWrap.appendChild(row);
        });
        playersWrap.querySelectorAll('input').forEach(inp=>{
          inp.addEventListener('input', ()=>{ playerNames[+inp.dataset.i] = inp.value; });
        });
        playersWrap.querySelectorAll('[data-remove]').forEach(btn=>{
          btn.addEventListener('click', ()=>{
            playerNames.splice(+btn.dataset.remove, 1);
            renderPlayers();
          });
        });
        addPlayerBtn.style.display = playerNames.length >= 6 ? 'none' : '';
      }
      addPlayerBtn.addEventListener('click', ()=>{
        playerNames.push('Jogador ' + (playerNames.length + 1));
        renderPlayers();
      });
      renderPlayers();
  
      function updateStartBtn(){
        startBtn.disabled = !temaEscolhido;
        startBtn.textContent = temaEscolhido ? 'Começar rodada' : 'Comprem uma carta pra começar';
      }
  
      startBtn.addEventListener('click', ()=>{
        const names = playerNames.map(n=>n.trim()).filter(Boolean);
        if(names.length < 2) return;
        names.forEach((n,i)=>{ if(!(i in scoreState.losses)) scoreState.losses[i] = 0; });
        startRound(temaEscolhido, tempoEscolhido, names, modoEscolhido);
      });
    }
  
    function startRound(tema, totalTime, players, modo){
      scoreState.roundNumber++;
      const startIndex = (scoreState.roundNumber - 1) % players.length;
      const state = {
        tema, totalTime, players, modo,
        timeLeft: totalTime,
        startedAt: Date.now(),
        used: {},
        history: [],
        turnIndex: startIndex,
        timer: null,
        ended: false
      };
      renderRound(state);
    }
  
    function colorFor(i){ return PLAYER_COLORS[i % PLAYER_COLORS.length]; }
  
    function renderRound(state){
      const cfg = modoPorId(state.modo);
      wrap.innerHTML = `
        <section class="stage-head">
          <h1>Tema: ${state.tema}</h1>
        </section>
        <div class="panel">
          <div style="display:flex; justify-content:center; margin-bottom:14px;">
            <span class="mode-badge">Modo: ${cfg.nome}</span>
          </div>
          <div class="score-row" id="scoreRow"></div>
          <p class="turn-banner">Na vez de <b id="turnName"></b> — fale uma palavra do tema e aperte a letra inicial</p>
          <div class="timer-wrap">
            <div class="timer-bar-track"><div class="timer-bar-fill" id="timerFill" style="width:100%"></div></div>
          </div>
          <div class="timer-big" id="timerBig"></div>
          <p class="timer-note">${cfg.tempoNota}</p>
          <div class="letter-grid" id="letterGrid"></div>
        </div>
      `;
      const scoreRow = wrap.querySelector('#scoreRow');
      const turnName = wrap.querySelector('#turnName');
      const timerFill = wrap.querySelector('#timerFill');
      const timerBig = wrap.querySelector('#timerBig');
      const letterGrid = wrap.querySelector('#letterGrid');
  
      STOP_LETRAS.forEach(l=>{
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'letter-btn';
        b.textContent = l;
        b.addEventListener('click', ()=>pressLetter(l, b));
        letterGrid.appendChild(b);
      });
  
      function drawScoreRow(){
        scoreRow.innerHTML = state.players.map((name,i)=>{
          const active = i === state.turnIndex;
          return `<span class="score-chip${active?' active':''}" style="color:var(--${colorFor(i)})">
            <span class="dot" style="background:var(--${colorFor(i)})"></span>${name} · ${scoreState.losses[i]||0}
          </span>`;
        }).join('');
        turnName.textContent = state.players[state.turnIndex];
        turnName.style.color = 'var(--' + colorFor(state.turnIndex) + ')';
      }
  
      function formatTime(s){
        const m = Math.floor(s/60);
        const ss = Math.floor(s%60).toString().padStart(2,'0');
        return m + ':' + ss;
      }
  
      function drawTimer(){
        timerBig.textContent = formatTime(state.timeLeft);
        const pct = Math.max(0, (state.timeLeft/state.totalTime)*100);
        timerFill.style.width = pct + '%';
        timerFill.style.background = pct <= 20 ? 'var(--danger)' : 'var(--gold)';
      }
  
      function tick(){
        state.timeLeft -= 0.2;
        if(state.timeLeft <= 0){
          state.timeLeft = 0;
          drawTimer();
          clearInterval(state.timer);
          return endRound(state, state.turnIndex);
        }
        drawTimer();
      }
  
      function pressLetter(letter, btn){
        if(state.ended || (letter in state.used)) return;
        state.used[letter] = state.turnIndex;
        state.history.push({letter, player: state.turnIndex});
        btn.classList.add('used');
        btn.style.background = 'var(--' + colorFor(state.turnIndex) + ')';
        btn.style.opacity = '0.5';
  
        state.turnIndex = (state.turnIndex + 1) % state.players.length;
  
        if(state.modo === 'repassa'){
          state.timeLeft = state.totalTime;
          drawTimer();
        }
  
        drawScoreRow();
  
        if(Object.keys(state.used).length >= STOP_LETRAS.length){
          clearInterval(state.timer);
          return endRound(state, null);
        }
      }
  
      drawScoreRow();
      drawTimer();
      state.timer = setInterval(tick, 200);
    }
  
    function endRound(state, loserIndex){
      state.ended = true;
      if(loserIndex !== null) scoreState.losses[loserIndex] = (scoreState.losses[loserIndex]||0) + 1;
      const usedCount = Object.keys(state.used).length;
      const elapsed = Math.round((Date.now() - state.startedAt) / 1000);
      const cfg = modoPorId(state.modo);
  
      wrap.innerHTML = `
        <section class="stage-head">
          <h1>${loserIndex !== null ? state.players[loserIndex] + ' perdeu a rodada' : 'Alfabeto inteiro eliminado!'}</h1>
          <p>${loserIndex !== null
            ? (state.modo === 'ate-morte'
                ? 'O tempo total da rodada acabou enquanto era a vez dele(a).'
                : 'O tempo da vez dele(a) acabou antes de apertar uma letra disponível.')
            : 'A dupla sobreviveu ao tema "'+state.tema+'" até a última letra disponível.'}</p>
        </section>
        <div class="panel">
          <div style="display:flex; justify-content:center; margin-bottom:12px;">
            <span class="mode-badge">Modo: ${cfg.nome}</span>
          </div>
          <div class="score-row" id="scoreRowEnd"></div>
          <div class="end-stats">
            <div class="end-stat"><b>${usedCount}</b><span>letras eliminadas</span></div>
            <div class="end-stat"><b>${elapsed}s</b><span>duração da rodada</span></div>
          </div>
          <div class="recap-row">
            ${state.history.map(h=>`<span class="recap-chip"><span class="dot" style="background:var(--${colorFor(h.player)})"></span>${h.letter} · ${state.players[h.player]}</span>`).join('') || '<span class="recap-chip">Nenhuma letra foi eliminada</span>'}
          </div>
          <div class="btn-row" style="justify-content:center;">
            <button class="btn btn-primary" id="nextRoundBtn">Próxima rodada</button>
            <button class="btn btn-ghost" id="backSetupBtn">Trocar modo, jogadores ou tempo</button>
          </div>
        </div>
      `;
      wrap.querySelector('#scoreRowEnd').innerHTML = state.players.map((name,i)=>
        `<span class="score-chip" style="color:var(--${colorFor(i)})"><span class="dot" style="background:var(--${colorFor(i)})"></span>${name} · ${scoreState.losses[i]||0}</span>`
      ).join('');
      wrap.querySelector('#nextRoundBtn').addEventListener('click', ()=>{
        startRound(drawCard(), state.totalTime, state.players, state.modo);
      });
      wrap.querySelector('#backSetupBtn').addEventListener('click', showSetup);
    }
  }