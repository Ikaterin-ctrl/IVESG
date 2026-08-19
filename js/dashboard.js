/* ==========================================================
   dashboard.js — Dashboard ESG com KPIs, gráficos e tarefas
   ========================================================== */

const Dashboard = (() => {
  let _rendered = false;
  const _taskDone = [false, false, true, false, false]; // espelha DATA.acoes

  function render() {
    const root = document.getElementById('dashboard-content');
    if (!root) return;

    const p    = DATA.pilares;
    const sg   = DATA.scoreGeral;
    const user = Auth.getUser();
    const nome = user ? user.nome.split(' ')[0] : 'visitante';
    const isGuest = user?.isGuest;

    root.innerHTML = `

      <!-- ── Banner de boas-vindas ── -->
      <div class="welcome-banner" id="welcome-banner">
        <div class="welcome-banner-left">
          <div class="welcome-emoji" aria-hidden="true">👋</div>
          <div>
            <div class="welcome-title">Olá, ${nome}! Bem-vindo ao seu painel ESG.</div>
            <div class="welcome-sub">
              ${isGuest
                ? 'Você está explorando como <strong>visitante</strong>. Os dados abaixo são uma demonstração real da plataforma.'
                : 'Acompanhe o desempenho ESG da sua empresa em tempo real.'}
            </div>
          </div>
        </div>
        <div class="welcome-banner-right">
          <a href="#" class="btn btn-primary btn-sm" onclick="App.goTo('diagnostico');return false;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
            ${isGuest ? 'TESTAR O DIAGNÓSTICO' : 'NOVO DIAGNÓSTICO'}
          </a>
          <button class="welcome-close" onclick="document.getElementById('welcome-banner').remove()" aria-label="Fechar aviso">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- ── Guia rápido para visitante ── -->
      ${isGuest ? `
      <div class="quickstart-strip">
        <div class="quickstart-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAFF00" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          COMO USAR ESTA PLATAFORMA
        </div>
        <div class="quickstart-steps">
          <div class="qs-step active-step">
            <div class="qs-num">1</div>
            <div class="qs-text"><strong>Explore o Dashboard</strong><br>Veja os KPIs e o score ESG demonstração</div>
          </div>
          <div class="qs-arrow" aria-hidden="true">→</div>
          <div class="qs-step">
            <div class="qs-num">2</div>
            <div class="qs-text"><strong>Faça o Diagnóstico</strong><br>Responda 12 perguntas e gere seu score real</div>
          </div>
          <div class="qs-arrow" aria-hidden="true">→</div>
          <div class="qs-step">
            <div class="qs-num">3</div>
            <div class="qs-text"><strong>Veja o Resultado</strong><br>Score por pilar + recomendações personalizadas</div>
          </div>
          <div class="qs-arrow" aria-hidden="true">→</div>
          <div class="qs-step">
            <div class="qs-num">4</div>
            <div class="qs-text"><strong>Crie sua conta</strong><br>Salve o resultado e acompanhe a evolução</div>
          </div>
        </div>
      </div>` : ''}

      <div class="dash-header">
        <div>
          <div class="dash-title">DASHBOARD ESG</div>
          <div class="dash-subtitle">${DATA.empresa.nome} · ${DATA.empresa.segmento} · PLANO ${DATA.empresa.plano}</div>
        </div>
        <div class="dash-date">${App.hoje()}</div>
      </div>

      <!-- KPI por pilar -->
      <div class="kpi-grid">
        ${_kpiCard('AMBIENTAL', p.ambiental.score, '+5 pts vs mês ant.', 'up', 'kpi-card-accent', p.ambiental.cor,
          `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${p.ambiental.cor}" stroke-width="2"><path d="M2 22l10-10M12 2c0 6-4 10-10 10M22 12c-6 0-10 4-10 10"/></svg>`)}
        ${_kpiCard('SOCIAL', p.social.score, '-2 pts vs mês ant.', 'down', 'kpi-card-blue', p.social.cor,
          `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${p.social.cor}" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>`)}
        ${_kpiCard('GOVERNANÇA', p.governanca.score, '+3 pts vs mês ant.', 'up', 'kpi-card-purple', p.governanca.cor,
          `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${p.governanca.cor}" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`)}
      </div>

      <!-- Score geral com barras de progresso por pilar -->
      <div class="dash-grid-2">
        <div class="dash-card">
          <div class="dash-card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAFF00" stroke-width="2.5" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            SCORE ESG GERAL
          </div>
          <div style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap">
            <div>
              <div style="font-family:'Syne',sans-serif;font-weight:900;font-size:4rem;line-height:1;color:#AAFF00;letter-spacing:-0.04em">${sg}</div>
              <div style="font-size:.72rem;font-weight:700;letter-spacing:.1em;color:rgba(255,255,255,.5);text-transform:uppercase">DE 100 PONTOS · RATING A+</div>
            </div>
            <div style="flex:1;min-width:180px">
              ${_progBar('AMBIENTAL', p.ambiental.score, p.ambiental.cor)}
              ${_progBar('SOCIAL', p.social.score, p.social.cor)}
              ${_progBar('GOVERNANÇA', p.governanca.score, p.governanca.cor)}
            </div>
          </div>
          <div style="margin-top:1.2rem">
            <a href="#" class="btn btn-primary btn-sm" onclick="App.goTo('resultado');return false;" aria-label="Ver resultado ESG completo">
              VER ANÁLISE COMPLETA
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        <!-- Gráfico de barras: evolução mensal -->
        <div class="dash-card">
          <div class="dash-card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAFF00" stroke-width="2.5" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            RESÍDUOS RECICLADOS — KG
          </div>
          <div class="bar-chart" id="dash-bar-chart" aria-label="Gráfico de barras de resíduos reciclados por mês">
            ${_buildBarChart()}
          </div>
          <div class="bar-chart-legend">
            <div style="display:flex;justify-content:space-between;font-size:.65rem;color:rgba(255,255,255,.4);letter-spacing:.06em;text-transform:uppercase;margin-top:.3rem">
              ${DATA.seriesMensal.map(s => `<span>${s.mes}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Ações recomendadas -->
      <div class="dash-card" style="margin-top:0">
        <div class="dash-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAFF00" stroke-width="2.5" aria-hidden="true"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          AÇÕES RECOMENDADAS
        </div>
        <div class="task-list" id="dash-tasks">
          ${DATA.acoes.map((a, i) => _taskItem(a, i)).join('')}
        </div>
      </div>
    `;

    _rendered = true;

    // Anima as barras de progresso após render
    requestAnimationFrame(() => {
      document.querySelectorAll('.prog-bar-fill[data-w]').forEach(el => {
        el.style.width = el.dataset.w + '%';
      });
    });
  }

  /* ── KPI Card ── */
  function _kpiCard(label, score, delta, dir, cls, cor, iconSvg) {
    return `
      <div class="kpi-card ${cls}" role="article" aria-label="KPI ${label}: ${score} pontos">
        <div class="kpi-icon" style="border-color:${cor}20">
          ${iconSvg}
        </div>
        <div class="kpi-label">${label}</div>
        <div class="kpi-value">${score}</div>
        <div class="kpi-delta ${dir}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
            ${dir === 'up' ? '<path d="M12 19V5M5 12l7-7 7 7"/>' : '<path d="M12 5v14M5 12l7 7 7-7"/>'}
          </svg>
          ${delta}
        </div>
        <div class="prog-bar-track" style="margin-top:.6rem" aria-label="${score} de 100">
          <div class="prog-bar-fill" style="background:${cor};width:0%" data-w="${score}"></div>
        </div>
      </div>`;
  }

  /* ── Barra de progresso ── */
  function _progBar(label, val, cor) {
    return `
      <div class="prog-label">
        <span>${label}</span>
        <strong style="color:${cor}">${val}/100</strong>
      </div>
      <div class="prog-bar-track" style="margin-bottom:.6rem;height:10px" aria-label="${label}: ${val} de 100">
        <div class="prog-bar-fill" style="background:${cor};width:0%" data-w="${val}"></div>
      </div>`;
  }

  /* ── Gráfico de barras ── */
  function _buildBarChart() {
    const max = Math.max(...DATA.seriesMensal.map(s => s.kg));
    const H   = 100; // max height px

    return DATA.seriesMensal.map((s, i) => {
      const h = Math.round((s.kg / max) * H);
      const isLast = i === DATA.seriesMensal.length - 1;
      return `
        <div class="bar-col">
          <div class="bar-val">${s.kg}</div>
          <div class="bar-fill${isLast ? '' : ' alt'}"
               style="height:${h}px"
               title="${s.mes}: ${App.fmt(s.kg)} kg"
               role="presentation"></div>
        </div>`;
    }).join('');
  }

  /* ── Item de tarefa ── */
  function _taskItem(a, i) {
    const done   = _taskDone[i] ?? a.done;
    const tagMap = {
      ambiental:  ['task-tag-ambiental', 'AMBIENTAL'],
      governanca: ['task-tag-governanca', 'GOVERNANÇA'],
      social:     ['task-tag-social',    'SOCIAL']
    };
    const [cls, label] = tagMap[a.tag] || ['', a.tag];

    return `
      <div class="task-item${done ? ' done' : ''}" id="task-${i}"
           onclick="Dashboard.toggleTask(${i})"
           onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();Dashboard.toggleTask(${i});}"
           role="button" tabindex="0" aria-label="${a.texto}" aria-pressed="${done}">
        <div class="task-check${done ? ' checked' : ''}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <div class="task-text">${a.texto}</div>
        <span class="task-tag ${cls}">${label}</span>
      </div>`;
  }

  /* ── Toggle de tarefa ── */
  function toggleTask(i) {
    _taskDone[i] = !_taskDone[i];
    const item  = document.getElementById(`task-${i}`);
    const check = item?.querySelector('.task-check');
    if (!item || !check) return;
    item.classList.toggle('done',   _taskDone[i]);
    check.classList.toggle('checked', _taskDone[i]);
    App.toast(_taskDone[i] ? 'Tarefa marcada como concluída!' : 'Tarefa reaberta.');
  }

  return { render, toggleTask };
})();
