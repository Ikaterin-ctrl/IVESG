/* ==========================================================
   app.js — SPA Router, estado global, toast, planos
   ========================================================== */

const App = (() => {
  let _pricing = 'mensal';
  let _menuOpen = false;

  /* ── Inicializa ── */
  function init() {
    _bindNavClicks();
    _animateHeroScore();
    _renderPlanos();
    _syncNavActive('home');
  }

  /* ── Navegação SPA ── */
  function goTo(pageId) {
    // esconde todas as páginas
    document.querySelectorAll('[data-page]').forEach(p => p.classList.remove('active'));

    // mostra a página pedida
    const target = document.querySelector(`[data-page="${pageId}"]`);
    if (!target) return;
    target.classList.add('active');

    // push state
    try { history.pushState({ page: pageId }, '', `#${pageId}`); } catch(e) {}

    // scroll top
    window.scrollTo(0, 0);

    // sincroniza nav
    _syncNavActive(pageId);

    // fecha menu mobile se aberto
    if (_menuOpen) toggleMenu();

    // renderiza módulos sob demanda
    if (pageId === 'dashboard')   Dashboard.render();
    if (pageId === 'diagnostico') Diagnostico.render();
    if (pageId === 'resultado')   Resultado.render();
  }

  function _syncNavActive(pageId) {
    document.querySelectorAll('.nav-link').forEach(el => {
      el.classList.toggle('active', el.textContent.trim().toLowerCase().includes(_pageLabel(pageId)));
    });
    // sidebar links
    document.querySelectorAll('.sidebar-link[id^="slink-"]').forEach(el => {
      el.classList.toggle('active', el.id === `slink-${pageId}`);
    });
  }
  function _pageLabel(id) {
    const map = { home: 'início', dashboard: 'dashboard', diagnostico: 'diagnóstico', resultado: 'resultado', planos: 'planos', 'como-funciona': 'como funciona' };
    return map[id] || id;
  }

  /* ── Bind de todos os cliques de navegação inline ── */
  function _bindNavClicks() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('[onclick]');
      // já tratado via onclick inline no HTML — nada a fazer aqui
    });
  }

  /* ── Menu mobile ── */
  function toggleMenu() {
    _menuOpen = !_menuOpen;
    const overlay = document.getElementById('nav-mobile-overlay');
    const btn     = document.getElementById('nav-hamburger');
    overlay.classList.toggle('open', _menuOpen);
    if (btn) btn.setAttribute('aria-expanded', String(_menuOpen));
  }

  /* ── Animação do score no hero ── */
  function _animateHeroScore() {
    const target = 78;
    const numEl  = document.getElementById('hero-score-counter');
    const barEl  = document.getElementById('hero-score-bar');
    if (!numEl) return;

    let current = 0;
    const duration = 1400;
    const step = target / (duration / 16);

    const circ = 2 * Math.PI * 62; // mesmo r do SVG anterior (mantemos se existir)

    const tick = () => {
      current = Math.min(current + step, target);
      numEl.textContent = Math.round(current);
      if (barEl) barEl.style.width = (current / 100 * 100) + '%';
      if (current < target) requestAnimationFrame(tick);
    };

    // Delay para carregar antes de animar
    setTimeout(() => requestAnimationFrame(tick), 400);
  }

  /* ── Planos ── */
  function setPricing(tipo) {
    _pricing = tipo;
    document.getElementById('toggle-mensal')?.classList.toggle('active', tipo === 'mensal');
    document.getElementById('toggle-anual')?.classList.toggle('active',  tipo === 'anual');
    document.getElementById('toggle-mensal')?.setAttribute('aria-pressed', String(tipo === 'mensal'));
    document.getElementById('toggle-anual')?.setAttribute('aria-pressed',  String(tipo === 'anual'));
    _renderPlanos();
  }

  function _renderPlanos() {
    const grid = document.getElementById('plans-grid');
    if (!grid) return;

    grid.innerHTML = DATA.planos.map(p => {
      const preco = _pricing === 'anual' ? p.precoAnual : p.precoMensal;
      const precoStr = preco === 0 ? 'GRÁTIS' : `R$ ${preco.toLocaleString('pt-BR')}`;
      const periodo  = preco === 0 ? '' : _pricing === 'anual' ? '/mês (anual)' : '/mês';

      const features = p.features.map(f => `
        <li class="plan-feature${f.incluso ? '' : ' no'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${f.incluso ? (p.featured ? '#000' : '#AAFF00') : 'currentColor'}" stroke-width="2.5" aria-hidden="true">
            ${f.incluso
              ? '<path d="M20 6L9 17l-5-5"/>'
              : '<path d="M18 6L6 18M6 6l12 12"/>'}
          </svg>
          ${f.texto}
        </li>`).join('');

      return `
        <div class="plan-card${p.featured ? ' featured' : ''}">
          ${p.featured ? '<div class="plan-badge">MAIS POPULAR</div>' : ''}
          <div>
            <div class="plan-name">${p.nome}</div>
            <div style="font-size:.82rem;opacity:.65;margin-top:.2rem">${p.descricao}</div>
          </div>
          <div>
            <div class="plan-price">${precoStr}</div>
            ${periodo ? `<div class="plan-price-unit">${periodo}</div>` : ''}
          </div>
          <ul class="plan-features">${features}</ul>
          <a href="#" class="btn ${p.featured ? 'btn-dark' : 'btn-primary'} btn-full"
             onclick="App.goTo('diagnostico');return false;"
             aria-label="Começar plano ${p.nome}">
            ${p.featured ? 'COMEÇAR AGORA' : 'ESCOLHER PLANO'}
          </a>
        </div>`;
    }).join('');
  }

  /* ── Toast ── */
  let _toastTimer;
  function toast(msg, tipo = 'success') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle('error', tipo === 'error');
    el.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
  }

  /* ── Utilitários ── */
  function fmt(n) { return Number(n).toLocaleString('pt-BR'); }
  function hoje() {
    return new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  }

  // Inicia quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { goTo, toggleMenu, setPricing, toast, fmt, hoje };
})();
