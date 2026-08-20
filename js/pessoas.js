/* ==========================================================
   pessoas.js — Formulário de Coleta Domiciliar (B2C)
   ========================================================== */

const PessoasForm = (() => {

  /* ── Seleciona tipo de resíduo ── */
  function selectResiduo(btn) {
    const grid = btn.closest('.residuo-select-grid');
    grid.querySelectorAll('.residuo-btn').forEach(b => {
      b.classList.remove('residuo-btn--active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('residuo-btn--active');
    btn.setAttribute('aria-pressed', 'true');
    document.getElementById('coleta-residuo').value = btn.dataset.value;
    document.getElementById('err-residuo').textContent = '';
    _checkReady();
  }

  /* ── Máscara CEP ── */
  function maskCep(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
    input.value = v;
    _checkReady();
  }

  /* ── Valida CEP via ViaCEP ── */
  function checkCep(input) {
    const raw = input.value.replace(/\D/g, '');
    const hint = document.getElementById('hint-cep');
    const err  = document.getElementById('err-cep');
    hint.textContent = '';
    err.textContent  = '';
    if (raw.length !== 8) return;

    fetch('https://viacep.com.br/ws/' + raw + '/json/')
      .then(r => r.json())
      .then(data => {
        if (data.erro) {
          err.textContent = 'CEP não encontrado. Verifique e tente novamente.';
        } else {
          hint.textContent = data.logradouro
            ? data.logradouro + ', ' + data.bairro + ' — ' + data.localidade + '/' + data.uf
            : data.bairro + ' — ' + data.localidade + '/' + data.uf;
          _checkReady();
        }
      })
      .catch(() => {
        hint.textContent = 'Não foi possível validar o CEP agora. Continue normalmente.';
      });
  }

  /* ── Habilita botão quando tudo está pronto ── */
  function _checkReady() {
    const residuo = document.getElementById('coleta-residuo');
    const nome    = document.getElementById('coleta-nome');
    const tel     = document.getElementById('coleta-tel');
    const cep     = document.getElementById('coleta-cep');
    const lgpd    = document.getElementById('coleta-lgpd');
    const btn     = document.getElementById('btn-coleta-submit');
    if (!btn) return;

    const ok =
      residuo && residuo.value &&
      nome    && nome.value.trim().length >= 3 &&
      tel     && tel.value.replace(/\D/g, '').length >= 10 &&
      cep     && cep.value.replace(/\D/g, '').length === 8 &&
      lgpd    && lgpd.checked;

    btn.disabled = !ok;
  }

  /* ── Submete o formulário ── */
  function submit(e) {
    e.preventDefault();

    const residuo = document.getElementById('coleta-residuo').value;
    const nome    = document.getElementById('coleta-nome').value.trim();
    const tel     = document.getElementById('coleta-tel').value.trim();
    const cep     = document.getElementById('coleta-cep').value.trim();
    const email   = document.getElementById('coleta-email').value.trim();
    const lgpd    = document.getElementById('coleta-lgpd').checked;

    /* Validação final antes do envio */
    let valid = true;
    if (!residuo) { document.getElementById('err-residuo').textContent = 'Selecione o tipo de resíduo.'; valid = false; }
    if (nome.length < 3) { document.getElementById('err-nome').textContent = 'Informe seu nome completo.'; valid = false; }
    if (tel.replace(/\D/g, '').length < 10) { document.getElementById('err-tel').textContent = 'Informe um WhatsApp válido.'; valid = false; }
    if (cep.replace(/\D/g, '').length !== 8) { document.getElementById('err-cep').textContent = 'Informe um CEP válido com 8 dígitos.'; valid = false; }
    if (!lgpd) { document.getElementById('err-lgpd').textContent = 'Aceite a política de privacidade para continuar.'; valid = false; }
    if (!valid) return;

    /* Estado de carregamento */
    const btn = document.getElementById('btn-coleta-submit');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin .8s linear infinite"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Enviando…';

    /* Simula envio (substitua pelo fetch real ao seu backend) */
    setTimeout(() => {
      btn.innerHTML = originalHTML;

      /* Exibe tela de sucesso */
      const form    = document.getElementById('form-coleta');
      const success = document.getElementById('pessoas-success');
      const title   = document.getElementById('pessoas-success-title');
      if (form)    form.style.display    = 'none';
      if (success) success.style.display = 'block';
      if (title)   title.textContent     = 'DESCARTE REGISTRADO, ' + nome.split(' ')[0].toUpperCase() + '!';

      /* Scroll para a tela de sucesso */
      if (success) success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1400);
  }

  /* ── Inicializa listeners ao entrar na página ── */
  function init() {
    /* Re-habilita/desabilita botão em qualquer input */
    ['coleta-nome', 'coleta-tel', 'coleta-cep', 'coleta-lgpd'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', _checkReady);
    });
    const lgpd = document.getElementById('coleta-lgpd');
    if (lgpd) lgpd.addEventListener('change', _checkReady);

    /* Reseta o formulário ao entrar na página */
    const form    = document.getElementById('form-coleta');
    const success = document.getElementById('pessoas-success');
    if (form)    form.style.display    = '';
    if (success) success.style.display = 'none';
  }

  return { selectResiduo, maskCep, checkCep, submit, init };
})();
