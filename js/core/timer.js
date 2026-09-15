/* =========================================================
   TIMER CORE — cronômetro reutilizável dos jogos
========================================================= */

function createGameTimer({
    duration,
    onTick,
    onEnd
  }) {
    let durationMs = duration * 1000;
    let startedAt = null;
    let animationFrame = null;
    let paused = false;
  
    const timer = {
      timeLeft: duration,
      running: false
    };
  
    function update(now) {
      if (!timer.running || paused) {
        return;
      }
  
      const elapsed = now - startedAt;
      const remainingMs = Math.max(0, durationMs - elapsed);
  
      timer.timeLeft = remainingMs / 1000;
  
      if (typeof onTick === 'function') {
        onTick(timer.timeLeft);
      }
  
      if (remainingMs <= 0) {
        timer.timeLeft = 0;
        timer.running = false;
        animationFrame = null;
  
        if (typeof onEnd === 'function') {
          onEnd();
        }
  
        return;
      }
  
      animationFrame = requestAnimationFrame(update);
    }
  
    function start() {
      if (timer.running) return;
  
      timer.running = true;
      paused = false;
  
      startedAt =
        performance.now() -
        (duration - timer.timeLeft) * 1000;
  
      animationFrame = requestAnimationFrame(update);
    }
  
    function reset(newDuration = duration) {
      cancel();
  
      durationMs = newDuration * 1000;
      timer.timeLeft = newDuration;
      timer.running = false;
      paused = false;
      startedAt = null;
    }
  
    function cancel() {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
  
      timer.running = false;
    }
  
    function restart(newDuration = duration) {
      reset(newDuration);
      start();
    }
  
    return {
      timer,
      start,
      reset,
      restart,
      cancel
    };
  }