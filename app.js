
// Password gate (demo only, client-side)
(function(){
  const gate = document.getElementById('password-gate');
  if (!gate) return;
  const input = document.getElementById('pw-input');
  const btn = document.getElementById('pw-btn');
  const correct = 'gin mare'; // case-insensitive compare
  function openSite(){ gate.style.display = 'none'; sessionStorage.setItem('peppear_access', '1'); }
  if (sessionStorage.getItem('peppear_access') === '1') gate.style.display = 'none';
  btn.addEventListener('click', () => {
    const val = (input.value || '').trim().toLowerCase();
    if (val === correct) openSite();
    else { btn.textContent = 'Password errata'; setTimeout(()=> btn.textContent = 'Entra', 1500); }
  });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') btn.click(); });
})();

// Checklist state with localStorage
(function(){
  const boxes = document.querySelectorAll('[data-check]');
  boxes.forEach((box) => {
    const key = 'peppear_check_' + box.id;
    const saved = localStorage.getItem(key);
    if (saved === '1') box.checked = true;
    box.addEventListener('change', () => {
      localStorage.setItem(key, box.checked ? '1' : '0');
    })
  })
})();

// Sondaggio ironico (client-side)
(function(){
  const form = document.getElementById('poll-form');
  if (!form) return;
  const resultEl = document.getElementById('poll-results');
  const key = 'peppear_poll';
  const data = JSON.parse(localStorage.getItem(key) || '{"A":0,"B":0,"C":0,"D":0,"voted":false}');
  if (data.voted) showResults();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (data.voted) return;
    const choice = form.querySelector('input[name=opt]:checked');
    if (!choice) return;
    data[choice.value]++;
    data.voted = true;
    localStorage.setItem(key, JSON.stringify(data));
    showResults();
  });
  function showResults(){
    form.querySelectorAll('input').forEach(i => i.disabled = true);
    const total = (data.A + data.B + data.C + data.D) || 1;
    resultEl.textContent = 'Risultati locali: ' +
      `A: ${Math.round(100*data.A/total)}% · ` +
      `B: ${Math.round(100*data.B/total)}% · ` +
      `C: ${Math.round(100*data.C/total)}% · ` +
      `D: ${Math.round(100*data.D/total)}%`;
  }
})();

// Countdown to event
(function(){
  const el = document.getElementById('countdown');
  if (!el) return;
  const eventDate = new Date('2025-08-14T09:00:00'); // local time
  function pad(n){ return String(n).padStart(2,'0'); }
  function tick(){
    const now = new Date();
    let diff = Math.max(0, eventDate - now);
    const sec = Math.floor(diff/1000)%60;
    const min = Math.floor(diff/60000)%60;
    const hr  = Math.floor(diff/3600000)%24;
    const day = Math.floor(diff/86400000);
    el.querySelector('[data-d]').textContent = day;
    el.querySelector('[data-h]').textContent = pad(hr);
    el.querySelector('[data-m]').textContent = pad(min);
    el.querySelector('[data-s]').textContent = pad(sec);
  }
  tick();
  setInterval(tick, 1000);
})();

// Copy IBAN
(function(){
  const btn = document.getElementById('copy-iban');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const code = document.getElementById('iban-code').textContent.trim();
    try {
      await navigator.clipboard.writeText(code);
      btn.textContent = 'Copiato ✔';
      btn.setAttribute('aria-pressed', 'true');
      setTimeout(()=>{ btn.textContent = 'Copia IBAN'; btn.removeAttribute('aria-pressed'); }, 1500);
    } catch(e){
      // Fallback
      const el = document.createElement('textarea'); el.value = code; document.body.appendChild(el);
      el.select(); document.execCommand('copy'); document.body.removeChild(el);
      btn.textContent = 'Copiato ✔';
      setTimeout(()=> btn.textContent = 'Copia IBAN', 1500);
    }
  });
})();
