/* ==========================================================
   resultado.js — Tela de resultado ESG com score, pilares e recomendações
   ========================================================== */

const Resultado = (() => {
  let _lastScore = null; // guarda o score do último render para detectar mudança

  function render() {
    const root = document.getElementById('resultado-content');
    if (!root) return;
    // Re-renderiza apenas se o score mudou desde o último render
    const sg = DATA.scoreGeral;
    if (sg === _lastScore && root.children.length > 0) return;

    const cls  = _classificar(sg);
    const recs = _getRecomendacoes(sg);
    const p    = DATA.pilares;

    root.innerHTML = `
      <!-- Hero do score -->
      <div class="resultado-hero" role="region" aria-label="Score ESG geral">
        <div class="resultado-score-big" aria-label="${sg} pontos">${sg}</div>
        <div class="resultado-info">
          <div class="resultado-label">SEU SCORE ESG GERAL</div>
          <div class="resultado-classificacao" style="color:${cls.cor}">${cls.nome}</div>
          <div class="resultado-desc">${cls.desc}</div>

          <!-- Medidor horizontal -->
          <div class="resultado-meter" aria-label="Medidor de posicionamento no score de 0 a 100">
            <div class="resultado-meter-track">
              <div class="resultado-meter-fill" id="meter-fill" style="width:0%"></div>
              <div class="resultado-meter-pointer" id="meter-pointer" style="left:0%"></div>
            </div>
            <div class="resultado-meter-labels">
              <span>INICIANTE</span>
              <span>EM DESENVOLVIMENTO</span>
              <span>AVANÇADO</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Scores por pilar -->
      <div class="pilar-results-grid">
        ${_pilarCard(p.ambiental, 'AMBIENTAL',  '#AAFF00')}
        ${_pilarCard(p.social,    'SOCIAL',     '#0047FF')}
        ${_pilarCard(p.governanca,'GOVERNANÇA', '#7B00FF')}
      </div>

      <!-- Recomendações -->
      <div style="margin-bottom:1rem">
        <div style="font-family:'Syne',sans-serif;font-weight:900;font-size:1.1rem;letter-spacing:.04em;text-transform:uppercase;color:#fff;margin-bottom:1rem;display:flex;align-items:center;gap:.5rem">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AAFF00" stroke-width="2.5" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          RECOMENDAÇÕES PRIORITÁRIAS
        </div>
        <div class="recs-grid">
          ${recs.map((r, i) => _recCard(r, i+1)).join('')}
        </div>
      </div>

      <!-- CTA -->
      <div class="resultado-cta" role="region" aria-label="Próximos passos">
        <div>
          <div class="resultado-cta-text">PRONTO PARA EVOLUIR?</div>
          <div class="resultado-cta-sub">Implemente as recomendações e refaça o diagnóstico em 30 dias.</div>
        </div>
        <div style="display:flex;gap:.8rem;flex-wrap:wrap">
          <a href="#" class="btn btn-dark" onclick="App.toast('Download do relatório PDF iniciado!');return false;" aria-label="Baixar relatório ESG em PDF">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            BAIXAR RELATÓRIO PDF
          </a>
          <a href="#" class="btn btn-ghost-dark" onclick="App.goTo('diagnostico');return false;" aria-label="Refazer o diagnóstico ESG"
             style="background:transparent;color:#000;border:2px solid #000;display:inline-flex;align-items:center;gap:.4rem;font-family:var(--font-body);font-weight:700;font-size:.82rem;letter-spacing:.08em;text-transform:uppercase;padding:.65rem 1.3rem;border-radius:4px;cursor:pointer;transition:all .15s;text-decoration:none">
            REFAZER DIAGNÓSTICO
          </a>
        </div>
      </div>
    `;

    _lastScore = sg;

    // Anima o medidor após render
    requestAnimationFrame(() => {
      setTimeout(() => {
        const fill    = document.getElementById('meter-fill');
        const pointer = document.getElementById('meter-pointer');
        if (fill)    fill.style.width  = sg + '%';
        if (pointer) pointer.style.left = sg + '%';

        // Anima barras de progresso dos pilares
        document.querySelectorAll('.pilar-bar-fill').forEach(el => {
          if (el.dataset.w) el.style.width = el.dataset.w + '%';
        });
      }, 100);
    });
  }

  /* ── Classificação por faixa ── */
  function _classificar(score) {
    if (score >= 75) return {
      nome: 'AVANÇADO',
      cor: '#AAFF00',
      desc: `Parabéns! Sua empresa está acima da média do setor com ${score} pontos. Continue evoluindo para alcançar a certificação ISO 14001 e o status de líder ESG.`
    };
    if (score >= 50) return {
      nome: 'EM DESENVOLVIMENTO',
      cor: '#FFD600',
      desc: `Sua empresa avançou, mas há espaço para crescimento. Com ${score} pontos, foque nas recomendações abaixo para superar o benchmark do setor.`
    };
    return {
      nome: 'INICIANTE',
      cor: '#FF6B35',
      desc: `Sua empresa está no início da jornada ESG com ${score} pontos. Boas notícias: as ações de maior impacto são simples de implementar. Comece pelos itens "FÁCIL" abaixo.`
    };
  }

  /* ── Card de pilar ── */
  function _pilarCard(pilar, nome, cor) {
    const fortes = pilar.pontosFortesTexto.map(t => `
      <li class="result-list-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AAFF00" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
        <span>${t}</span>
      </li>`).join('');

    const melhorias = pilar.pontosDemelhoriaTexto.map(t => `
      <li class="result-list-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" stroke-width="2.5" aria-hidden="true"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
        <span>${t}</span>
      </li>`).join('');

    return `
      <div class="pilar-result-card" role="article" aria-label="Resultado pilar ${nome}">
        <div class="pilar-result-icon" style="border-color:${cor};background:${cor}18">
          ${pilar.icone.replace('stroke="currentColor"', `stroke="${cor}"`)}
        </div>
        <div class="pilar-result-name">${nome}</div>
        <div class="pilar-result-score" style="color:${cor}">${pilar.score}<span style="font-size:.9rem;color:rgba(255,255,255,.4)">/100</span></div>
        <div class="pilar-bar" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);height:8px;overflow:hidden;margin-bottom:1rem">
          <div class="pilar-bar-fill" style="background:${cor};width:0%;height:100%;transition:width .8s ease" data-w="${pilar.score}"></div>
        </div>
        <div style="font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${cor};margin-bottom:.4rem">PONTOS FORTES</div>
        <ul class="result-list" style="list-style:none;margin-bottom:.8rem">${fortes}</ul>
        <div style="font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#FF6B35;margin-bottom:.4rem">MELHORAR</div>
        <ul class="result-list" style="list-style:none">${melhorias}</ul>
      </div>`;
  }

  /* ── Card de recomendação ── */
  function _recCard(r, num) {
    const difCls = {
      'FÁCIL':   'dif-facil',
      'MÉDIO':   'dif-medio',
      'DIFÍCIL': 'dif-dificil'
    }[r.dificuldade] || 'dif-facil';

    return `
      <div class="rec-card" role="article" aria-label="Recomendação ${num}: ${r.titulo}">
        <div class="rec-dif ${difCls}">${r.dificuldade}</div>
        <div style="font-family:'Syne',sans-serif;font-weight:900;font-size:2rem;color:rgba(255,255,255,.08);line-height:1;letter-spacing:-0.04em;margin-bottom:-.5rem">${String(num).padStart(2,'0')}</div>
        <div class="rec-title">${r.titulo}</div>
        <div class="rec-desc">${r.desc}</div>
        <div style="margin-top:auto">
          <div style="font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:.3rem">IMPACTO ESPERADO</div>
          <div style="font-size:.82rem;font-weight:700;color:#AAFF00">${r.impacto}</div>
        </div>
        <a href="#" class="btn btn-ghost btn-sm btn-full" onclick="App.toast('Saiba mais sobre: ${r.titulo.toLowerCase()}');return false;" style="margin-top:.6rem">
          SAIBA MAIS
        </a>
      </div>`;
  }

  /* ── Recomendações conforme score ── */
  function _getRecomendacoes(score) {
    if (score >= 75) return DATA.recomendacoes.alta;
    if (score >= 50) return DATA.recomendacoes.media;
    return DATA.recomendacoes.baixa;
  }

  return { render };
})();
