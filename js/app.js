/* ==========================================================
   app.js — SPA Router, estado global, toast, planos, loader
   ========================================================== */

const App = (() => {
  let _pricing  = 'mensal';
  let _menuOpen = false;

  /* Páginas que exigem login */
  const _protected = ['dashboard', 'diagnostico', 'resultado'];

  /* ── Inicializa ── */
  function init() {
    Auth.init();        // restaura sessão e sincroniza nav
    _animateHeroScore();
    _renderPlanos();
    _syncNavActive('home');

    // Volta para a página do histórico se existir
    const hash = location.hash.replace('#', '');
    if (hash && document.querySelector(`[data-page="${hash}"]`)) {
      goTo(hash);
    }
  }

  /* ── Navegação SPA ── */
  function goTo(pageId) {
    // Guard de autenticação
    if (_protected.includes(pageId) && !Auth.isLoggedIn()) {
      App.toast('Faça login para acessar a plataforma.', 'error');
      _showPage('login');
      return;
    }

    _showLoader();
    setTimeout(() => {
      _showPage(pageId);
      _hideLoader();
    }, 180);
  }

  function _showPage(pageId) {
    document.querySelectorAll('[data-page]').forEach(p => p.classList.remove('active'));
    const target = document.querySelector(`[data-page="${pageId}"]`);
    if (!target) return;
    target.classList.add('active');

    try { history.pushState({ page: pageId }, '', `#${pageId}`); } catch(e) {}
    window.scrollTo(0, 0);
    _syncNavActive(pageId);
    if (_menuOpen) toggleMenu();

    // Renderiza módulos sob demanda
    if (pageId === 'dashboard')   Dashboard.render();
    if (pageId === 'diagnostico') Diagnostico.render();
    if (pageId === 'resultado')   Resultado.render();

    // Animação de entrada da página
    if (typeof Anim !== 'undefined') Anim.pageEnter();
  }

  /* ── Loader de transição ── */
  function _showLoader() {
    const loader = document.getElementById('page-loader');
    const bar    = document.getElementById('loader-bar');
    if (!loader || !bar) return;
    loader.classList.add('active');
    bar.style.width = '0%';
    requestAnimationFrame(() => { bar.style.width = '70%'; });
  }
  function _hideLoader() {
    const loader = document.getElementById('page-loader');
    const bar    = document.getElementById('loader-bar');
    if (!loader || !bar) return;
    bar.style.width = '100%';
    setTimeout(() => {
      loader.classList.remove('active');
      bar.style.width = '0%';
    }, 250);
  }

  /* ── Sincroniza nav ── */
  function _syncNavActive(pageId) {
    document.querySelectorAll('.nav-link').forEach(el => {
      el.classList.toggle('active', el.textContent.trim().toLowerCase().includes(_pageLabel(pageId)));
    });
    document.querySelectorAll('.sidebar-link[id^="slink-"]').forEach(el => {
      el.classList.toggle('active', el.id === `slink-${pageId}`);
    });
  }
  function _pageLabel(id) {
    const map = {
      home: 'início', dashboard: 'dashboard', diagnostico: 'diagnóstico',
      resultado: 'resultado', planos: 'planos', 'como-funciona': 'como funciona',
      login: 'entrar', cadastro: 'cadastro'
    };
    return map[id] || id;
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
    const step  = target / (1400 / 16);

    const tick = () => {
      current = Math.min(current + step, target);
      numEl.textContent = Math.round(current);
      if (barEl) barEl.style.width = (current) + '%';
      if (current < target) requestAnimationFrame(tick);
    };
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
      const preco    = _pricing === 'anual' ? p.precoAnual : p.precoMensal;
      const precoStr = preco === 0 ? 'GRÁTIS' : `R$ ${preco.toLocaleString('pt-BR')}`;
      const periodo  = preco === 0 ? '' : _pricing === 'anual' ? '/mês (anual)' : '/mês';

      const features = p.features.map(f => `
        <li class="plan-feature${f.incluso ? '' : ' no'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${f.incluso ? (p.featured ? '#000' : '#AAFF00') : 'currentColor'}" stroke-width="2.5" aria-hidden="true">
            ${f.incluso ? '<path d="M20 6L9 17l-5-5"/>' : '<path d="M18 6L6 18M6 6l12 12"/>'}
          </svg>
          ${f.texto}
        </li>`).join('');

      // CTA: se não logado, vai para cadastro; se logado, vai para diagnóstico
      const ctaOnclick = Auth.isLoggedIn()
        ? "App.goTo('diagnostico');return false;"
        : "App.goTo('cadastro');return false;";

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
             onclick="${ctaOnclick}"
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
    el.className = 'toast show' + (tipo === 'error' ? ' error' : '');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
  }

  /* ── Utilitários ── */
  function fmt(n)  { return Number(n).toLocaleString('pt-BR'); }
  function hoje()  {
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

/* ==========================================================
   AuthUI — handlers dos formulários de login e cadastro
   ========================================================== */
const AuthUI = (() => {

  function submitLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value.trim();
    const senha = document.getElementById('login-senha')?.value;
    const errEl = document.getElementById('login-error');
    const btn   = document.getElementById('login-submit');

    _clearError(errEl);
    _setLoading(btn, true);

    // Simula latência de rede (200ms)
    setTimeout(() => {
      const result = Auth.login(email, senha);
      _setLoading(btn, false);
      if (result.ok) {
        const user = Auth.getUser();
        App.toast(`Bem-vinda de volta, ${user.nome.split(' ')[0]}!`);
        App.goTo('dashboard');
      } else {
        _showError(errEl, result.msg);
      }
    }, 200);
  }

  function submitCadastro(e) {
    e.preventDefault();
    const nome    = document.getElementById('cad-nome')?.value.trim();
    const empresa = document.getElementById('cad-empresa')?.value.trim();
    const email   = document.getElementById('cad-email')?.value.trim();
    const senha   = document.getElementById('cad-senha')?.value;
    const errEl   = document.getElementById('cad-error');
    const btn     = document.getElementById('cad-submit');

    _clearError(errEl);
    _setLoading(btn, true);

    setTimeout(() => {
      const result = Auth.cadastrar(nome, empresa, email, senha);
      _setLoading(btn, false);
      if (result.ok) {
        App.toast(`Conta criada! Bem-vinda, ${nome.split(' ')[0]}! 🌱`);
        App.goTo('diagnostico');
      } else {
        _showError(errEl, result.msg);
      }
    }, 250);
  }

  function toggleSenha(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    // troca o ícone
    btn.innerHTML = isText
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  }

  function _showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
  }
  function _clearError(el) {
    if (!el) return;
    el.textContent = '';
    el.classList.remove('visible');
  }
  function _setLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.style.opacity = loading ? '.6' : '1';
  }

  function entrarComoVisitante() {
    Auth.visitante();
    App.toast('Bem-vindo, Visitante! Explore a plataforma à vontade.');
    App.goTo('dashboard');
  }

  return { submitLogin, submitCadastro, toggleSenha, entrarComoVisitante };
})();
