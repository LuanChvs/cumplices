/* =========================================================
   SINTONIA
========================================================= */
function renderSintonia(){
    const wrap = el(`
      <div>
        <section class="stage-head">
          <h1>Sintonia</h1>
          <p>Girem a roleta. Quando ela parar, leiam a pergunta em voz alta e respondam ao mesmo tempo, na contagem de três. Ver se combinam é a graça.</p>
        </section>
        <div class="panel">
          <div class="wheel-stage">
            <div class="wheel-pointer"></div>
            <div class="wheel-ring" id="wheelRing"></div>
            <div class="category-ring" id="catRing"></div>
          </div>
          <div class="sintonia-actions">
            <button class="btn btn-primary" id="spinBtn">Girar a roleta</button>
          </div>
          <div id="questionSlot"></div>
        </div>
      </div>
    `);
  
    const catRing = wrap.querySelector('#catRing');
    const wheelRing = wrap.querySelector('#wheelRing');
    const spinBtn = wrap.querySelector('#spinBtn');
    const questionSlot = wrap.querySelector('#questionSlot');
    let rotation = 0;
    let spinning = false;
  
    SINTONIA.forEach((cat,i)=>{
      const chip = document.createElement('div');
      chip.className = 'cat-chip';
      chip.textContent = cat.nome;
      chip.dataset.i = i;
      catRing.appendChild(chip);
    });
  
    function lightUp(i){
      catRing.querySelectorAll('.cat-chip').forEach((c,ci)=>{
        c.classList.toggle('lit', ci===i);
      });
    }
  
    function askQuestion(catIndex){
      const cat = SINTONIA[catIndex];
      const q = pick(cat.perguntas);
      questionSlot.innerHTML = `
        <div class="question-card">
          <p class="cat-name">${cat.nome}</p>
          <p>${q}</p>
          <div class="btn-row">
            <button class="btn btn-ghost" id="newQBtn">Nova pergunta</button>
            <button class="btn btn-primary" id="spinAgainBtn">Girar de novo</button>
          </div>
        </div>
      `;
      questionSlot.querySelector('#newQBtn').addEventListener('click', ()=>askQuestion(catIndex));
      questionSlot.querySelector('#spinAgainBtn').addEventListener('click', ()=>{
        questionSlot.innerHTML = '';
        spinBtn.disabled = false;
      });
    }
  
    function spin(){
      if(spinning) return;
      spinning = true;
      spinBtn.disabled = true;
      questionSlot.innerHTML = '';
      const target = Math.floor(Math.random()*SINTONIA.length);
  
      rotation += 720 + Math.random()*180;
      wheelRing.style.transform = `rotate(${rotation}deg)`;
  
      const totalSteps = 18 + target;
      let step = 0;
      let idx = 0;
      function tick(){
        lightUp(idx % SINTONIA.length);
        idx++;
        step++;
        if(step >= totalSteps){
          spinning = false;
          askQuestion(target);
          return;
        }
        const progress = step / totalSteps;
        const delay = 55 + Math.pow(progress,2.2) * 260;
        setTimeout(tick, delay);
      }
      tick();
    }
    spinBtn.addEventListener('click', spin);
  
    return wrap;
  }