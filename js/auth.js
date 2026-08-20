/* ==========================================================
   auth.js — Autenticação simulada com sessionStorage
   ========================================================== */

const Auth = (() => {
  const SESSION_KEY = 'ivesg_user';

  /* ── Estado interno ── */
  let _user = null; // { nome, empresa, email, plano }

  /* ── Inicializa — restaura sessão se existir ── */
  function init() {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) _user = JSON.parse(saved);
    } catch (e) { _user = null; }
    _syncUI();
  }

  /* ── Getters ── */
  function isLoggedIn() { return _user !== null; }
  function getUser()    { return _user ? { ..._user } : null; }

  /* ── Acesso como visitante ── */
  function visitante() {
    _user = {
      nome:    'Visitante',
      empresa: 'Minha Empresa',
      email:   'visitante@demo.com',
      plano:   'BÁSICO',
      isGuest: true
    };
    DATA.empresa.nome  = 'Minha Empresa';
    DATA.empresa.plano = 'BÁSICO';
    _persist();
    _syncUI();
    return { ok: true };
  }

  /* ── Login simulado ── */
  function login(email, senha) {
    if (!email || !senha) return { ok: false, msg: 'Preencha e-mail e senha.' };
    if (senha.length < 6)  return { ok: false, msg: 'Senha deve ter pelo menos 6 caracteres.' };

    // Simula autenticação — em produção seria uma chamada de API
    _user = {
      nome:    _nomeDeEmail(email),
      empresa: DATA.empresa.nome,
      email:   email,
      plano:   DATA.empresa.plano
    };
    _persist();
    _syncUI();
    return { ok: true };
  }

  /* ── Cadastro simulado ── */
  function cadastrar(nome, empresa, email, senha) {
    if (!nome || !empresa || !email || !senha)
      return { ok: false, msg: 'Preencha todos os campos.' };
    if (senha.length < 6)
      return { ok: false, msg: 'Senha deve ter pelo menos 6 caracteres.' };
    if (!email.includes('@'))
      return { ok: false, msg: 'E-mail inválido.' };

    _user = { nome, empresa, email, plano: 'BÁSICO' };
    // Atualiza o nome da empresa nos dados globais
    DATA.empresa.nome    = empresa;
    DATA.empresa.plano   = 'BÁSICO';
    _persist();
    _syncUI();
    return { ok: true };
  }

  /* ── Logout ── */
  function logout() {
    _user = null;
    sessionStorage.removeItem(SESSION_KEY);
    _syncUI();
    App.goTo('home');
    App.toast('Você saiu da sua conta.');
  }

  /* ── Persiste sessão ── */
  function _persist() {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(_user)); } catch(e) {}
  }

  /* ── Sincroniza a UI com o estado de auth ── */
  function _syncUI() {
    const navActions      = document.getElementById('nav-actions');
    const navActionsHtml  = navActions;
    if (!navActionsHtml) return;

    if (_user) {
      // Logado: avatar + nome + dropdown
      const initials = _user.nome.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();
      navActionsHtml.innerHTML = `
        <div class="nav-user" id="nav-user-btn" onclick="Auth._toggleUserMenu()" role="button" tabindex="0"
             onkeydown="if(event.key==='Enter')Auth._toggleUserMenu()"
             aria-label="Menu do usuário ${_user.nome}" aria-haspopup="true" aria-expanded="false">
          <div class="nav-avatar">${initials}</div>
          <span class="nav-user-name">${_user.nome.split(' ')[0]}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <div class="nav-dropdown" id="nav-dropdown" aria-hidden="true">
          <div class="nav-dropdown-header">
            <div class="nav-dropdown-name">${_user.nome}</div>
            <div class="nav-dropdown-email">${_user.email}</div>
            <div class="nav-dropdown-plano">PLANO ${_user.plano}</div>
          </div>
          <div class="nav-dropdown-divider"></div>
          <a href="#" class="nav-dropdown-item" onclick="App.goTo('dashboard');Auth._closeUserMenu();return false;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
          <a href="#" class="nav-dropdown-item" onclick="App.goTo('diagnostico');Auth._closeUserMenu();return false;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
            Novo Diagnóstico
          </a>
          <a href="#" class="nav-dropdown-item" onclick="App.goTo('planos');Auth._closeUserMenu();return false;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Planos
          </a>
          <div class="nav-dropdown-divider"></div>
          <a href="#" class="nav-dropdown-item nav-dropdown-logout" onclick="Auth.logout();return false;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Sair
          </a>
        </div>`;

      // Links do mobile overlay — substitui último item da lista pelo logout
      const mobileList = document.querySelector('#nav-mobile-overlay ul');
      if (mobileList) {
        const lastLi = mobileList.querySelector('li:last-child');
        if (lastLi) lastLi.innerHTML = `<a href="#" onclick="Auth.logout();App.toggleMenu();return false;">SAIR DA CONTA</a>`;
      }
      // Esconde botão de descartar no mobile quando logado (usuário B2B)
      const mobileDescartar = document.querySelector('.nav-mobile-descartar');
      if (mobileDescartar) mobileDescartar.style.display = '';
    } else {
      // Não logado: botão entrar
      navActionsHtml.innerHTML = `
        <a href="#" class="btn btn-nav" onclick="App.goTo('login');return false;" aria-label="Entrar na plataforma">
          ENTRAR
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
        </a>`;

      const mobileList = document.querySelector('#nav-mobile-overlay ul');
      if (mobileList) {
        const lastLi = mobileList.querySelector('li:last-child');
        if (lastLi) lastLi.innerHTML = `<a href="#" onclick="App.goTo('login');App.toggleMenu();return false;">ACESSAR PLATAFORMA</a>`;
      }
      const mobileDescartar = document.querySelector('.nav-mobile-descartar');
      if (mobileDescartar) mobileDescartar.style.display = '';
    }
  }

  /* ── Toggle do menu do usuário ── */
  function _toggleUserMenu() {
    const dropdown = document.getElementById('nav-dropdown');
    const btn      = document.getElementById('nav-user-btn');
    if (!dropdown) return;
    const isOpen = dropdown.classList.toggle('open');
    btn?.setAttribute('aria-expanded', String(isOpen));
    dropdown.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen) {
      // Fecha ao clicar fora
      setTimeout(() => {
        document.addEventListener('click', _outsideClick, { once: true });
      }, 50);
    }
  }

  function _outsideClick(e) {
    if (!e.target.closest('#nav-user-btn') && !e.target.closest('#nav-dropdown')) {
      _closeUserMenu();
    }
  }

  function _closeUserMenu() {
    const dropdown = document.getElementById('nav-dropdown');
    const btn      = document.getElementById('nav-user-btn');
    dropdown?.classList.remove('open');
    btn?.setAttribute('aria-expanded', 'false');
    dropdown?.setAttribute('aria-hidden', 'true');
  }

  /* ── Extrai nome do e-mail ── */
  function _nomeDeEmail(email) {
    const parte = email.split('@')[0].replace(/[._]/g, ' ');
    return parte.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }

  return { init, isLoggedIn, getUser, login, cadastrar, visitante, logout, _syncUI, _toggleUserMenu, _closeUserMenu };
})();
