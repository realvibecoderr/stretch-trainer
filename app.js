(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (s) => Math.floor(s / 60) + ':' + pad(Math.round(s % 60));

  const totalSeconds = (r) =>
    r.prep + r.exercises.length * r.hold + (r.exercises.length - 1) * r.transition;

  /* ---------- Ton ---------- */
  const Sound = {
    ctx: null,
    unlock() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!this.ctx) this.ctx = new AC();
      if (this.ctx.state !== 'running') this.ctx.resume();
      // stiller Puffer, damit iOS den Kontext freigibt
      const b = this.ctx.createBuffer(1, 1, 22050);
      const s = this.ctx.createBufferSource();
      s.buffer = b;
      s.connect(this.ctx.destination);
      s.start(0);
    },
    tone(freq, start, decay, gain) {
      const c = this.ctx;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(gain, start + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, start + decay);
      o.connect(g).connect(c.destination);
      o.start(start);
      o.stop(start + decay + 0.05);
    },
    bell(delay = 0) {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + 0.01 + delay;
      const f = 1046.5;
      this.tone(f, t, 2.4, 0.42);
      this.tone(f * 2.32, t, 1.2, 0.16);
      this.tone(f * 4.25, t, 0.6, 0.07);
      this.tone(f * 0.5, t, 1.6, 0.08);
    },
    tick() {
      if (!this.ctx) return;
      this.tone(1318.5, this.ctx.currentTime + 0.01, 0.09, 0.18);
    },
    go() {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + 0.01;
      this.tone(1760, t, 0.22, 0.26);
    }
  };

  /* ---------- Bildschirm wach halten ---------- */
  const Wake = {
    lock: null,
    async on() {
      try {
        if ('wakeLock' in navigator && !this.lock) {
          this.lock = await navigator.wakeLock.request('screen');
          this.lock.addEventListener('release', () => { this.lock = null; });
        }
      } catch (e) { /* nicht verfügbar */ }
    },
    off() {
      if (this.lock) this.lock.release();
      this.lock = null;
    }
  };

  /* ---------- Zustand ---------- */
  const S = {
    r: null,
    i: 0,
    phase: 'idle',   // idle | prep | hold | transition | done
    duration: 0,
    endsAt: 0,
    remaining: 0,
    paused: false,
    lastSec: null,
    loop: null
  };

  const now = () => performance.now();

  /* ---------- Startseite ---------- */
  function renderHome() {
    const list = $('routine-list');
    list.innerHTML = '';
    window.ROUTINES.forEach((r, k) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.innerHTML =
        `<span class="idx num">${pad(k + 1)}</span>` +
        `<span><span class="title">${r.name}</span>` +
        `<span class="meta num">${r.exercises.length} Übungen · ${r.hold} s · ${fmt(totalSeconds(r))} min</span></span>` +
        `<span class="go">→</span>`;
      b.addEventListener('click', () => openRoutine(r));
      li.appendChild(b);
      list.appendChild(li);
    });
  }

  function show(id) {
    $('home').hidden = id !== 'home';
    $('player').hidden = id !== 'player';
  }

  /* ---------- Player ---------- */
  function openRoutine(r) {
    S.r = r;
    S.i = 0;
    S.phase = 'idle';
    S.paused = false;
    $('p-routine').textContent = r.name;
    const seg = $('segments');
    seg.innerHTML = '';
    r.exercises.forEach(() => {
      const s = document.createElement('span');
      s.appendChild(document.createElement('i'));
      seg.appendChild(s);
    });
    show('player');
    render();
  }

  function closeRoutine() {
    stopLoop();
    Wake.off();
    S.phase = 'idle';
    document.body.className = '';
    show('home');
  }

  function enter(phase, i) {
    S.phase = phase;
    S.i = i;
    S.paused = false;
    S.lastSec = null;
    S.duration = phase === 'prep' ? S.r.prep : phase === 'hold' ? S.r.hold : phase === 'transition' ? S.r.transition : 0;
    S.endsAt = now() + S.duration * 1000;
    render();
    update();
  }

  function start() {
    Sound.unlock();
    Wake.on();
    if (S.r.prep > 0) enter('prep', 0);
    else { Sound.go(); enter('hold', 0); }
    startLoop();
  }

  function finishHold() {
    flash();
    if (S.i >= S.r.exercises.length - 1) {
      Sound.bell(); Sound.bell(0.45); Sound.bell(0.9);
      stopLoop();
      Wake.off();
      enter('done', S.i);
    } else {
      Sound.bell();
      if (S.r.transition > 0) enter('transition', S.i + 1);
      else enter('hold', S.i + 1);
    }
  }

  function advance() {
    if (S.phase === 'prep' || S.phase === 'transition') {
      Sound.go();
      enter('hold', S.i);
    } else if (S.phase === 'hold') {
      finishHold();
    }
  }

  function jump(delta) {
    if (S.phase === 'idle' || S.phase === 'done') {
      if (S.phase === 'done') return;
      S.i = Math.min(Math.max(S.i + delta, 0), S.r.exercises.length - 1);
      render();
      return;
    }
    let target = S.i + delta;
    if (S.phase === 'transition' && delta > 0) target = S.i;
    // zurück: läuft die Übung schon länger als 3 s, erst auf Anfang setzen
    if (delta < 0 && S.phase === 'hold' && elapsed() > 3) target = S.i;
    if (target < 0) target = 0;
    if (target > S.r.exercises.length - 1) {
      stopLoop(); Wake.off(); enter('done', S.r.exercises.length - 1);
      return;
    }
    const wasPaused = S.paused;
    enter('hold', target);
    if (wasPaused) pause();
  }

  function elapsed() {
    const rem = S.paused ? S.remaining : S.endsAt - now();
    return S.duration - rem / 1000;
  }

  function pause() {
    if (S.paused) return;
    S.remaining = Math.max(0, S.endsAt - now());
    S.paused = true;
    render();
    update();
  }

  function resume() {
    if (!S.paused) return;
    Sound.unlock();
    Wake.on();
    S.endsAt = now() + S.remaining;
    S.paused = false;
    render();
  }

  function startLoop() {
    stopLoop();
    S.loop = setInterval(update, 100);
  }
  function stopLoop() {
    if (S.loop) clearInterval(S.loop);
    S.loop = null;
  }

  function flash() {
    document.body.classList.remove('flash');
    void document.body.offsetWidth;
    document.body.classList.add('flash');
    setTimeout(() => document.body.classList.remove('flash'), 500);
  }

  /* ---------- Darstellung ---------- */
  function render() {
    const r = S.r;
    const n = r.exercises.length;
    const ex = r.exercises[S.i];
    const phase = S.phase;

    const cls = ['is-' + phase];
    if (S.paused) cls.push('is-paused');
    document.body.className = cls.join(' ');

    const labels = {
      idle: 'Bereit',
      prep: 'Gleich geht’s los',
      hold: 'Halten',
      transition: 'Nächste Übung',
      done: 'Fertig'
    };
    $('p-phase').textContent = S.paused ? 'Pausiert' : labels[phase];
    $('p-count').textContent = pad(S.i + 1) + ' / ' + pad(n);

    if (phase === 'done') {
      $('p-name').textContent = r.name;
      $('p-cue').textContent = n + ' Übungen abgeschlossen.';
      $('p-picto').innerHTML = '';
      $('p-time').textContent = fmt(totalSeconds(r));
    } else {
      $('p-name').textContent = ex.name;
      $('p-cue').textContent = ex.cue || '';
      $('p-picto').innerHTML = window.Pictograms.render(ex.picto);
    }

    const main = $('btn-main');
    if (phase === 'idle') main.textContent = 'Start';
    else if (phase === 'done') main.textContent = 'Nochmal';
    else main.textContent = S.paused ? 'Weiter' : 'Pause';

    $('btn-prev').disabled = phase === 'done';
    $('btn-next').disabled = phase === 'done';

    // Segmente
    const segs = $('segments').children;
    for (let k = 0; k < segs.length; k++) {
      const done = phase === 'done' || k < S.i;
      segs[k].className = done ? 'done' : '';
      segs[k].firstChild.style.width = '0';
    }

    if (phase === 'idle') {
      $('p-time').textContent = String(r.hold);
      $('p-phasebar').style.width = '0';
    }
  }

  function update() {
    const phase = S.phase;
    if (phase === 'idle' || phase === 'done') return;

    const rem = S.paused ? S.remaining : S.endsAt - now();
    if (!S.paused && rem <= 0) { advance(); return; }

    const sec = Math.max(1, Math.ceil(rem / 1000));
    $('p-time').textContent = String(sec);

    const frac = Math.min(1, Math.max(0, 1 - rem / (S.duration * 1000)));
    $('p-phasebar').style.width = (frac * 100).toFixed(2) + '%';
    if (phase === 'hold') {
      const seg = $('segments').children[S.i];
      if (seg) seg.firstChild.style.width = (frac * 100).toFixed(2) + '%';
    }

    if (!S.paused && sec !== S.lastSec) {
      if ((phase === 'prep' || phase === 'transition') && sec <= 3 && sec < S.duration && S.lastSec !== null) {
        Sound.tick();
      }
      S.lastSec = sec;
    }
  }

  /* ---------- Bedienung ---------- */
  $('btn-main').addEventListener('click', () => {
    if (S.phase === 'idle') start();
    else if (S.phase === 'done') { S.i = 0; S.phase = 'idle'; render(); start(); }
    else if (S.paused) resume();
    else pause();
  });
  $('btn-prev').addEventListener('click', () => jump(-1));
  $('btn-next').addEventListener('click', () => jump(1));
  $('btn-exit').addEventListener('click', closeRoutine);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (S.phase !== 'idle' && S.phase !== 'done') pause();
    } else if (S.phase !== 'idle' && S.phase !== 'done') {
      Wake.on();
    }
  });

  renderHome();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
