/* ==========================================================
   feedback.js — Formulário multi-step de validação MVP
   Envia para Google Forms via fetch no-cors (sem redirecionar)
   Form ID: 1FAIpQLSfktET4O4YJSv5Yoc-RXBWcfBDuOHN93N5YyOqZa4eauifPfw
   ========================================================== */

const FbkForm = (() => {

  const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfktET4O4YJSv5Yoc-RXBWcfBDuOHN93N5YyOqZa4eauifPfw/formResponse';

  const QUESTIONS = [
    {
      id: 1,
      entry: 'entry.1741907920',
      type: 'radio',
      question: 'Qual é o seu perfil de atuação ou formação?',
      options: [
        'Estudante (Tecnologia / Negócios / Engenharia)',
        'Profissional de TI / Desenvolvimento',
        'Gestor / Empreendedor / Consultor ESG',
        'Outro / Curioso',
      ],
    },
    {
      id: 2,
      entry: 'entry.165407199',
      type: 'scale',
      question: 'Ao navegar pelo site, o propósito da solução IVESG ficou claro para você?',
      min: 'Muito confuso / Não entendi',
      max: 'Extremamente claro e objetivo',
      options: ['1', '2', '3', '4', '5'],
    },
    {
      id: 3,
      entry: 'entry.451609324',
      type: 'radio',
      question: 'O que você achou da identidade visual, estilo gráfico e navegabilidade da página?',
      options: [
        'Excelente: visual jovem, impactante, moderno e direto ao ponto',
        'Bom: cumpre o papel, mas alguns elementos podem ser refinados',
        'Regular: achei confuso ou com excesso de informação',
        'Ruim: não me agradou a paleta ou disposição',
      ],
    },
    {
      id: 4,
      entry: 'entry.1548338244',
      type: 'radio',
      question: 'Você utilizaria essa plataforma ou a recomendaria para acompanhar indicadores de ESG?',
      options: [
        'Sim, com certeza',
        'Provavelmente sim',
        'Talvez / Preciso de mais funcionalidades',
        'Não vejo utilidade no momento',
      ],
    },
    {
      id: 5,
      entry: 'entry.1230790984',
      type: 'textarea',
      question: 'Qual recurso ou funcionalidade você sentiu falta que tornaria a solução indispensável?',
      placeholder: 'Ex: integração com sistemas contábeis, emissão de certificados, comparativo por setor...',
    },
    {
      id: 6,
      entry: 'entry.1321090722',
      type: 'textarea',
      question: 'Deixe um feedback livre, crítica construtiva ou sugestão de melhoria:',
      placeholder: 'O que te surpreendeu? O que ficou confuso? O que está faltando?',
    },
  ];

  let _current = 0; // índice 0-based
  const _answers = {};

  /* ── Inicializa ao entrar na página ── */
  function init() {
    _current = 0;
    Object.keys(_answers).forEach(k => delete _answers[k]);
    _render();
    _updateSidebar();
    _updateProgress();
  }

  /* ── Renderiza a pergunta atual ── */
  function _render() {
    const q = QUESTIONS[_current];
    const container = document.getElementById('fbk-questions');
    if (!container) return;

    let html = `<div class="fbk-question" id="fbk-q-${q.id}">
      <div class="fbk-q-num">PERGUNTA ${q.id} / ${QUESTIONS.length}</div>
      <h2 class="fbk-q-title">${q.question}</h2>`;

    if (q.type === 'radio') {
      html += `<div class="fbk-options" role="radiogroup" aria-label="${q.question}">`;
      q.options.forEach((opt, i) => {
        const checked = _answers[q.entry] === opt;
        html += `<label class="fbk-option${checked ? ' selected' : ''}" role="radio" aria-checked="${checked}" tabindex="0"
          onkeydown="if(event.key==='Enter'||event.key===' ')this.click()"
          onclick="FbkForm.select(this,'${q.entry}',${JSON.stringify(opt)})">
          <div class="fbk-option-dot"></div>
          <span>${opt}</span>
        </label>`;
      });
      html += `</div>`;

    } else if (q.type === 'scale') {
      html += `<div class="fbk-scale-labels"><span>${q.min}</span><span>${q.max}</span></div>
        <div class="fbk-scale" role="radiogroup" aria-label="${q.question}">`;
      q.options.forEach(val => {
        const sel = _answers[q.entry] === val;
        html += `<button class="fbk-scale-btn${sel ? ' selected' : ''}" aria-pressed="${sel}"
          onclick="FbkForm.select(this,'${q.entry}','${val}')">${val}</button>`;
      });
      html += `</div>`;

    } else if (q.type === 'textarea') {
      const val = _answers[q.entry] || '';
      html += `<textarea class="fbk-textarea" id="fbk-ta-${q.entry}"
        placeholder="${q.placeholder}" rows="4"
        oninput="FbkForm.saveText('${q.entry}',this.value)">${val}</textarea>`;
    }

    html += `</div>`;
    container.innerHTML = html;
    container.querySelector('input,textarea,button,label')?.focus?.();

    // Atualiza botão final
    const btnNext = document.getElementById('fbk-btn-next');
    if (btnNext) {
      if (_current === QUESTIONS.length - 1) {
        btnNext.innerHTML = `Enviar <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>`;
      } else {
        btnNext.innerHTML = `Próxima <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      }
    }
  }

  /* ── Seleciona opção (radio / scale) ── */
  function select(el, entry, value) {
    _answers[entry] = value;
    // Remove .selected de todos os irmãos
    el.closest('.fbk-options, .fbk-scale')?.querySelectorAll('.fbk-option, .fbk-scale-btn').forEach(s => {
      s.classList.remove('selected');
      s.setAttribute('aria-pressed', 'false');
      s.setAttribute('aria-checked', 'false');
    });
    el.classList.add('selected');
    el.setAttribute('aria-pressed', 'true');
    el.setAttribute('aria-checked', 'true');
  }

  /* ── Salva textarea ── */
  function saveText(entry, value) {
    _answers[entry] = value;
  }

  /* ── Avança ── */
  function next() {
    // Valida se respondeu (textareas são opcionais)
    const q = QUESTIONS[_current];
    if ((q.type === 'radio' || q.type === 'scale') && !_answers[q.entry]) {
      App.toast('Por favor, selecione uma opção.', 'error');
      return;
    }

    if (_current < QUESTIONS.length - 1) {
      _current++;
      _render();
      _updateSidebar();
      _updateProgress();
      document.getElementById('fbk-btn-prev').style.display = 'flex';
    } else {
      _submit();
    }
  }

  /* ── Volta ── */
  function prev() {
    if (_current > 0) {
      _current--;
      _render();
      _updateSidebar();
      _updateProgress();
      if (_current === 0) document.getElementById('fbk-btn-prev').style.display = 'none';
    }
  }

  /* ── Atualiza barra de progresso ── */
  function _updateProgress() {
    const pct = ((_current + 1) / QUESTIONS.length) * 100;
    const fill = document.getElementById('fbk-progress-fill');
    const label = document.getElementById('fbk-progress-label');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = `PERGUNTA ${_current + 1} DE ${QUESTIONS.length}`;
  }

  /* ── Atualiza sidebar de steps ── */
  function _updateSidebar() {
    QUESTIONS.forEach((q, i) => {
      const el = document.getElementById(`fbk-step-${q.id}`);
      if (!el) return;
      el.classList.toggle('active', i === _current);
      el.classList.toggle('done', i < _current);
    });
  }

  /* ── Envia para o Google Forms via fetch no-cors ── */
  function _submit() {
    const body = new URLSearchParams();
    QUESTIONS.forEach(q => {
      if (_answers[q.entry]) body.append(q.entry, _answers[q.entry]);
    });

    fetch(FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    }).catch(() => {}); // no-cors sempre "falha" no fetch — a resposta é opaca, mas o envio funciona

    // Mostra tela de sucesso
    document.getElementById('fbk-questions').style.display = 'none';
    document.getElementById('fbk-nav').style.display = 'none';
    document.getElementById('fbk-progress-bar').style.display = 'none';
    document.querySelector('.fbk-progress-label').style.display = 'none';
    document.querySelector('.auth-back').style.display = 'none';
    document.getElementById('fbk-success').style.display = 'flex';
  }

  return { init, next, prev, select, saveText };
})();
