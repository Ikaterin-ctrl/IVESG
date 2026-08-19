/* ==========================================================
   diagnostico.js — Questionário multi-etapas com radio e slider
   ========================================================== */

const Diagnostico = (() => {
  let _etapa    = 0; // etapa atual (0-based)
  let _pergunta = 0; // pergunta dentro da etapa atual (0-based)
  let _respostas = {}; // { id_pergunta: valor }
  let _rendered = false;

  let _showingIntro = true; // mostra intro antes de começar

  function render() {
    const root = document.getElementById('diagnostico-content');
    if (!root) return;
    _etapa       = 0;
    _pergunta    = 0;
    _respostas   = {};
    _rendered    = true;
    _showingIntro = true;
    _renderIntro(root);
  }

  /* ── Tela de introdução ── */
  function _renderIntro(root) {
    const totalP = DATA.etapas.reduce((acc, e) => acc + e.perguntas.length, 0);
    root.innerHTML = `
      <div class="diag-intro">
        <div class="diag-intro-badge">DIAGNÓSTICO ESG</div>
        <h2 class="diag-intro-title">Vamos medir o impacto<br>da sua empresa?</h2>
        <p class="diag-intro-desc">
          Responda <strong>${totalP} perguntas objetivas</strong> sobre sua operação e receba um
          <strong>Score ESG personalizado</strong> com análise por pilar e recomendações de melhoria.
        </p>

        <div class="diag-intro-cards">
          <div class="diag-intro-card">
            <div class="diag-intro-card-icon" style="color:#AAFF00">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div class="diag-intro-card-title">~10 minutos</div>
            <div class="diag-intro-card-sub">Duração estimada</div>
          </div>
          <div class="diag-intro-card">
            <div class="diag-intro-card-icon" style="color:#0047FF">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
            </div>
            <div class="diag-intro-card-title">${totalP} perguntas</div>
            <div class="diag-intro-card-sub">Em 4 categorias</div>
          </div>
          <div class="diag-intro-card">
            <div class="diag-intro-card-icon" style="color:#7B00FF">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div class="diag-intro-card-title">Score 0-100</div>
            <div class="diag-intro-card-sub">Por pilar A/S/G</div>
          </div>
        </div>

        <div class="diag-intro-etapas">
          ${DATA.etapas.map((e, i) => `
            <div class="diag-intro-etapa">
              <div class="diag-intro-etapa-num" style="background:${e.cor};color:${e.corTexto === 'black' ? '#000' : '#fff'}">${i + 1}</div>
              <div>
                <div class="diag-intro-etapa-titulo">${e.titulo}</div>
                <div class="diag-intro-etapa-sub">${e.perguntas.length} perguntas</div>
              </div>
            </div>`).join('')}
        </div>

        <div class="diag-intro-tip">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AAFF00" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          <span>Responda com honestidade — o resultado será mais útil para a sua empresa.</span>
        </div>

        <div class="diag-intro-actions">
          <button class="btn btn-primary btn-lg" onclick="Diagnostico.comecar()">
            COMEÇAR AGORA
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <a href="#" class="btn btn-ghost" onclick="App.goTo('dashboard');return false;">Voltar ao Dashboard</a>
        </div>
      </div>
    `;
  }

  function comecar() {
    _showingIntro = false;
    const root = document.getElementById('diagnostico-content');
    if (root) _renderPergunta(root);
  }

  /* ── Renderiza a pergunta atual ── */
  function _renderPergunta(root) {
    const etapas  = DATA.etapas;
    const totalP  = etapas.reduce((acc, e) => acc + e.perguntas.length, 0);
    let pAtual    = 0;
    for (let e = 0; e < _etapa; e++) pAtual += etapas[e].perguntas.length;
    pAtual += _pergunta;

    const et  = etapas[_etapa];
    const prg = et.perguntas[_pergunta];
    const pct = Math.round((pAtual / totalP) * 100);
    const isFirst = _etapa === 0 && _pergunta === 0;
    const isLast  = _etapa === etapas.length - 1 && _pergunta === et.perguntas.length - 1;

    const stepIndicators = etapas.map((e, ei) => {
      const status = ei < _etapa ? 'done' : ei === _etapa ? 'active' : '';
      return `
        ${ei > 0 ? `<div class="step-dot-line${ei <= _etapa ? ' done' : ''}"></div>` : ''}
        <div class="step-dot ${status}" title="${e.titulo}" aria-label="Etapa ${ei+1}: ${e.titulo}">${ei + 1}</div>`;
    }).join('');

    const corpo = prg.tipo === 'radio' ? _renderRadio(prg) : _renderSlider(prg);

    root.innerHTML = `
      <!-- Header -->
      <div class="diag-header">
        <div class="diag-title">DIAGNÓSTICO ESG</div>
        <div class="diag-sub">Responda com honestidade — o resultado será mais preciso e útil para sua empresa.</div>

        <!-- Barra de progresso geral -->
        <div class="diag-progress-wrap" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="diag-progress-track">
            <div class="diag-progress-fill" style="width:${pct}%"></div>
          </div>
          <span class="diag-progress-pct">${pct}%</span>
        </div>

        <!-- Indicadores de etapas -->
        <div class="step-indicators" role="list" aria-label="Etapas do diagnóstico">
          ${stepIndicators}
        </div>
      </div>

      <!-- Card da pergunta com animação -->
      <div class="question-card fade-in" id="question-card">
        <div class="question-pilar" style="color:${et.corTexto === 'black' ? '#000' : et.cor};border-color:${et.cor};background:${et.cor}20">
          ${et.titulo}
        </div>
        <div class="question-text" id="q-text">${prg.texto}</div>
        ${corpo}
      </div>

      <!-- Navegação -->
      <div class="diag-nav">
        <span class="diag-counter">Pergunta ${pAtual + 1} de ${totalP}</span>
        <div style="display:flex;gap:.8rem">
          <button class="btn btn-ghost${isFirst ? ' btn-disabled' : ''}" onclick="Diagnostico.anterior()" ${isFirst ? 'disabled aria-disabled="true"' : ''}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            ANTERIOR
          </button>
          <button class="btn btn-primary" id="btn-proximo" onclick="Diagnostico.proximo()" aria-label="${isLast ? 'Finalizar diagnóstico' : 'Próxima pergunta'}">
            ${isLast ? 'VER RESULTADO' : 'PRÓXIMO'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    `;

    // Pré-preenche resposta já dada (se voltar)
    const resposta = _respostas[prg.id];
    if (resposta !== undefined && prg.tipo === 'slider') {
      const slider = document.getElementById('slider-input');
      const valEl  = document.getElementById('slider-val');
      if (slider) slider.value = resposta;
      if (valEl)  valEl.textContent = `${resposta} ${prg.unidade}`;
    }
    if (resposta !== undefined && prg.tipo === 'radio') {
      const matchEl = document.querySelector(`.radio-option[data-val="${resposta}"]`);
      if (matchEl) matchEl.classList.add('selected');
    }
  }

  /* ── Radio ── */
  function _renderRadio(prg) {
    const opcoes = prg.opcoes.map(o => `
      <div class="radio-option" data-val="${o.valor}"
           onclick="Diagnostico.selectRadio(this, '${prg.id}', ${o.valor})"
           onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();Diagnostico.selectRadio(this,'${prg.id}',${o.valor});}"
           role="radio" aria-checked="false" tabindex="0">
        <div class="radio-box"></div>
        <div class="radio-label">${o.label}</div>
      </div>`).join('');
    return `<div class="radio-group" role="radiogroup" aria-labelledby="q-text">${opcoes}</div>`;
  }

  /* ── Slider ── */
  function _renderSlider(prg) {
    const def = _respostas[prg.id] ?? prg.default;
    return `
      <div class="slider-wrap">
        <div class="slider-value" id="slider-val">${def} ${prg.unidade}</div>
        <input type="range" id="slider-input" class="form-range"
          min="${prg.min}" max="${prg.max}" value="${def}"
          aria-label="${prg.texto}"
          oninput="Diagnostico.updateSlider(this.value, '${prg.id}', '${prg.unidade}')" />
        <div class="slider-labels">
          <span>${prg.min} ${prg.unidade}</span>
          <span>${prg.max} ${prg.unidade}</span>
        </div>
      </div>`;
  }

  /* ── Handlers de interação ── */
  function selectRadio(el, id, valor) {
    document.querySelectorAll('.radio-option').forEach(o => {
      o.classList.remove('selected');
      o.setAttribute('aria-checked', 'false');
    });
    el.classList.add('selected');
    el.setAttribute('aria-checked', 'true');
    _respostas[id] = valor;
  }

  function updateSlider(val, id, unidade) {
    _respostas[id] = parseInt(val);
    const el = document.getElementById('slider-val');
    if (el) el.textContent = `${val} ${unidade}`;
  }

  /* ── Navegação entre perguntas ── */
  function proximo() {
    const et  = DATA.etapas[_etapa];
    const prg = et.perguntas[_pergunta];

    // Valida resposta
    if (prg.tipo === 'radio' && _respostas[prg.id] === undefined) {
      App.toast('Selecione uma opção antes de continuar.', 'error');
      return;
    }
    if (prg.tipo === 'slider') {
      const slider = document.getElementById('slider-input');
      if (slider) _respostas[prg.id] = parseInt(slider.value);
    }

    // Avança para próxima pergunta ou etapa
    const isLastPergunta = _pergunta >= et.perguntas.length - 1;
    const isLastEtapa    = _etapa >= DATA.etapas.length - 1;

    if (!isLastPergunta) {
      _pergunta++;
    } else if (!isLastEtapa) {
      _etapa++;
      _pergunta = 0;
    } else {
      // Finaliza o diagnóstico
      _calcularScore();
      App.goTo('resultado');
      return;
    }

    const root = document.getElementById('diagnostico-content');
    if (root) _renderPergunta(root);
    window.scrollTo(0, 0);
  }

  function anterior() {
    const isFirstPergunta = _pergunta === 0;
    const isFirstEtapa    = _etapa === 0;

    if (!isFirstPergunta) {
      _pergunta--;
    } else if (!isFirstEtapa) {
      _etapa--;
      _pergunta = DATA.etapas[_etapa].perguntas.length - 1;
    }

    const root = document.getElementById('diagnostico-content');
    if (root) _renderPergunta(root);
    window.scrollTo(0, 0);
  }

  /* ── Calcula score com base nas respostas ── */
  function _calcularScore() {
    const etapasIds = {
      ambiental:  ['amb_1', 'amb_2', 'amb_3'],
      social:     ['soc_1', 'soc_2', 'soc_3'],
      governanca: ['gov_1', 'gov_2', 'gov_3']
    };

    Object.entries(etapasIds).forEach(([pilar, ids]) => {
      // ?? 50 já garante fallback, filter é desnecessário mas mantido para clareza
      const vals = ids.map(id => _respostas[id] ?? 50);
      const avg  = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
      DATA.pilares[pilar].score = avg;
    });

    // Força re-render do resultado zerando o cache de score
    // (Resultado._lastScore é interno; mudar DATA.pilares já dispara o guard corretamente)
  }

  function getRespostas() { return { ..._respostas }; }

  return { render, comecar, selectRadio, updateSlider, proximo, anterior, getRespostas };
})();
