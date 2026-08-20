/* ==========================================================
   animations.js — Cursor, Canvas Particles, Scroll Reveal
   Filosofia: menos é mais. Movimento a serviço do conteúdo,
   nunca competindo com ele.
   ========================================================== */

const Anim = (() => {

  /* ══════════════════════════════
     1. CURSOR PERSONALIZADO
     Dot imediato + ring com lag lento.
     Ring só aparece, nunca amplia demais.
     Sem mix-blend-mode para não inverter texto.
  ══════════════════════════════ */
  let _cursorDot, _cursorRing;
  // posições inicializam com null para detectar "ainda não moveu"
  let _cx = null, _cy = null;
  let _rx = null, _ry = null;

  // tamanhos em sync com o CSS
  const DOT_SIZE  = 6;
  const RING_SIZE = 32;

  function _initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    _cursorDot  = document.createElement('div');
    _cursorRing = document.createElement('div');
    _cursorDot.className  = 'cursor-dot';
    _cursorRing.className = 'cursor-ring';
    document.body.appendChild(_cursorDot);
    document.body.appendChild(_cursorRing);

    // Esconde até ter uma posição real (evita "voo" da borda)
    _cursorDot.style.visibility  = 'hidden';
    _cursorRing.style.visibility = 'hidden';

    document.addEventListener('mousemove', e => {
      _cx = e.clientX;
      _cy = e.clientY;
      // Primeira vez: teletransporta o ring para o cursor antes de mostrar
      if (_rx === null) {
        _rx = _cx;
        _ry = _cy;
      }
      _cursorDot.style.visibility  = 'visible';
      _cursorRing.style.visibility = 'visible';
    });

    // Hover — muda cor da borda
    document.addEventListener('mouseover', e => {
      const el = e.target.closest('a, button, [role="button"], .radio-option, .plan-card, .step-card');
      _cursorRing.classList.toggle('cursor-hover', !!el);
    });

    // Sai da janela: esconde
    document.addEventListener('mouseleave', () => {
      _cursorDot.style.visibility  = 'hidden';
      _cursorRing.style.visibility = 'hidden';
    });
    document.addEventListener('mouseenter', e => {
      // Já temos posição — mostrar
      if (_cx !== null) {
        _cursorDot.style.visibility  = 'visible';
        _cursorRing.style.visibility = 'visible';
      }
    });

    _tickCursor();
  }

  function _tickCursor() {
    // Sem posição ainda → aguarda
    if (_cx === null || _cursorDot === undefined) {
      requestAnimationFrame(_tickCursor);
      return;
    }

    // Dot — segue exatamente (centralizado pelo raio DOT_SIZE/2)
    _cursorDot.style.transform = `translate(${_cx - DOT_SIZE / 2}px, ${_cy - DOT_SIZE / 2}px)`;

    // Ring — lag suave; centralizado pelo raio RING_SIZE/2
    _rx += (_cx - _rx) * 0.09;
    _ry += (_cy - _ry) * 0.09;
    _cursorRing.style.transform = `translate(${_rx - RING_SIZE / 2}px, ${_ry - RING_SIZE / 2}px)`;

    requestAnimationFrame(_tickCursor);
  }

  /* ══════════════════════════════
     2. CANVAS PARTICLES (HERO)
     Menos partículas, sem linhas de conexão,
     movem-se mais devagar — pontilhado sutil.
  ══════════════════════════════ */
  let _canvas, _ctx, _particles = [];
  const PARTICLE_COUNT = 28; // era 55

  function _initParticles() {
    // Inicia partículas em qualquer canvas hero visível (home ou pessoas)
    const canvasId = document.getElementById('pessoas-canvas')?.closest('.page.active')
      ? 'pessoas-canvas' : 'hero-canvas';
    _canvas = document.getElementById(canvasId) || document.getElementById('hero-canvas');
    if (!_canvas) return;
    _ctx = _canvas.getContext('2d');
    _resizeCanvas();
    window.addEventListener('resize', _resizeCanvas);
    _spawnParticles();
    _tickParticles();
  }

  function _resizeCanvas() {
    if (!_canvas) return;
    _canvas.width  = _canvas.offsetWidth;
    _canvas.height = _canvas.offsetHeight;
  }

  function _spawnParticles() {
    _particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      _particles.push(_newParticle());
    }
  }

  function _newParticle(fromBottom = false) {
    const W = _canvas?.width  || window.innerWidth;
    const H = _canvas?.height || window.innerHeight;
    return {
      x:     Math.random() * W,
      y:     fromBottom ? H + 10 : Math.random() * H,
      r:     Math.random() * 1.5 + 0.4,        // menor
      vx:    (Math.random() - 0.5) * 0.25,     // mais lento
      vy:    -(Math.random() * 0.3 + 0.08),    // mais lento
      alpha: Math.random() * 0.3 + 0.05,       // mais transparente
      color: ['170,255,0', '0,71,255'][Math.floor(Math.random() * 2)] // sem roxo
    };
  }

  function _tickParticles() {
    if (!_ctx || !_canvas) return;
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);

    _particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) {
        _particles[i] = _newParticle(true);
        return;
      }

      _ctx.beginPath();
      _ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      _ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      _ctx.fill();
    });

    // Sem linhas de conexão — eram muito barulhentas visualmente

    requestAnimationFrame(_tickParticles);
  }

  /* ══════════════════════════════
     3. SCROLL REVEAL
     Threshold mais alto: elemento tem que estar mais
     visível antes de animar — menos "pop" inesperado.
  ══════════════════════════════ */
  function _initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('stagger')) {
            entry.target.querySelectorAll(':scope > *').forEach((child, i) => {
              child.style.transitionDelay = `${i * 80}ms`; // era 90ms
              child.classList.add('visible');
            });
          }
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      observer.observe(el);
    });

    window._revealObserver = observer;
  }

  function observeNewElements() {
    if (!window._revealObserver) return;
    document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible)').forEach(el => {
      window._revealObserver.observe(el);
    });
  }

  /* ══════════════════════════════
     4. PARALLAX NO MOUSE (hero)
     Reduzido para metade da intensidade anterior.
     Não briga com o scroll reveal.
  ══════════════════════════════ */
  function _initParallax() {
    const target = document.querySelector('.hero-inner');
    if (!target) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.addEventListener('mousemove', e => {
      const heroEl = document.querySelector('.hero');
      // Só aplica quando o mouse está dentro do hero
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;

      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2); // -1 a 1
      const dy = (e.clientY - cy) / (rect.height / 2);

      const heroLeft  = target.querySelector('.hero-left');
      const heroRight = target.querySelector('.hero-right');

      // Intensidade reduzida: 3px/2px era 6px/4px
      if (heroLeft)  heroLeft.style.transform  = `translate(${dx * -3}px, ${dy * -2}px)`;
      if (heroRight) heroRight.style.transform = `translate(${dx *  4}px, ${dy *  2.5}px)`;
    });

    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      heroEl.addEventListener('mouseleave', () => {
        const heroLeft  = target.querySelector('.hero-left');
        const heroRight = target.querySelector('.hero-right');
        // Reset suave via CSS transition
        if (heroLeft)  { heroLeft.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';  heroLeft.style.transform  = ''; }
        if (heroRight) { heroRight.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)'; heroRight.style.transform = ''; }
        setTimeout(() => {
          if (heroLeft)  heroLeft.style.transition  = '';
          if (heroRight) heroRight.style.transition = '';
        }, 650);
      });
    }
  }

  /* ══════════════════════════════
     5. COUNTERS ANIMADOS
  ══════════════════════════════ */
  function _initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        let   current = 0;
        const step    = target / 60;
        const tick = () => {
          current = Math.min(current + step, target);
          el.textContent = prefix + Math.round(current).toLocaleString('pt-BR') + suffix;
          if (current < target) requestAnimationFrame(tick);
        };
        tick();
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));
  }

  /* ══════════════════════════════
     6. HERO TEXT — entrada única, sem camadas em cima
     Animação limpa: cada linha entra uma vez, sem
     loops ou delays muito longos que causam "o que
     está acontecendo?".
  ══════════════════════════════ */
  function _initHeroText() {
    // Funciona tanto no hero-split (home) quanto no hero B2C (pessoas)
    const lines = document.querySelectorAll('.hero-title-white, .hero-title-accent, .hero-split-top .hero-title span');
    lines.forEach((line, i) => {
      line.style.opacity   = '0';
      line.style.transform = 'translateY(32px)';
      line.style.transition = `opacity .65s ${300 + i * 120}ms cubic-bezier(.16,1,.3,1), transform .65s ${300 + i * 120}ms cubic-bezier(.16,1,.3,1)`;
      requestAnimationFrame(() => {
        line.style.opacity   = '1';
        line.style.transform = 'translateY(0)';
      });
    });

    // Sequência de fade-in para elementos de suporte
    const seq = ['.hero-badge', '.hero-subtitle', '.hero-cta-group', '.hero-stats',
                 '.hero-split-top .hero-badge', '.hero-split-cards', '.hero-split-stats'];
    const seen = new Set();
    seq.forEach((sel, i) => {
      const el = document.querySelector(sel);
      if (!el || seen.has(el)) return;
      seen.add(el);
      el.style.opacity   = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity .55s ${580 + i * 100}ms cubic-bezier(.16,1,.3,1), transform .55s ${580 + i * 100}ms cubic-bezier(.16,1,.3,1)`;
      requestAnimationFrame(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      });
    });

    // Hero right: entra da direita (só no hero B2C com .hero-right)
    const hr = document.querySelector('.hero-right');
    if (hr) {
      hr.style.opacity   = '0';
      hr.style.transform = 'translateX(36px)';
      hr.style.transition = 'opacity .8s 500ms cubic-bezier(.16,1,.3,1), transform .8s 500ms cubic-bezier(.16,1,.3,1)';
      requestAnimationFrame(() => {
        hr.style.opacity   = '1';
        hr.style.transform = 'translateX(0)';
      });
    }
  }

  /* ══════════════════════════════
     7. FLOAT DO SCORE CARD — REMOVIDO
     Causava sobreposição com o parallax e
     dava sensação de instabilidade. O card
     já chama atenção pela cor e sombra.
  ══════════════════════════════ */

  /* ══════════════════════════════
     8. TILT 3D NOS CARDS
     Inclinação leve ao hover do mouse dentro
     do card — perspective + rotateX/rotateY.
     Reseta suavemente ao sair.
  ══════════════════════════════ */
  function _initCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // sem toque

    const SELECTORS = '.step-card, .plan-card, .depo-card, .app-mockup';
    const MAX_DEG   = 8; // graus máximos de inclinação

    function _attachTilt(card) {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = '1';

      // Wrapper de perspectiva
      card.style.perspective = '600px';

      card.addEventListener('mousemove', e => {
        const r    = card.getBoundingClientRect();
        const cx   = r.left + r.width  / 2;
        const cy   = r.top  + r.height / 2;
        const dx   = (e.clientX - cx) / (r.width  / 2); // -1..1
        const dy   = (e.clientY - cy) / (r.height / 2);
        const rotX = -dy * MAX_DEG;
        const rotY =  dx * MAX_DEG;
        card.style.transition = 'transform .08s linear, box-shadow .18s cubic-bezier(.16,1,.3,1)';
        card.style.transform  = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.025)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .45s cubic-bezier(.16,1,.3,1), box-shadow .18s cubic-bezier(.16,1,.3,1)';
        // Reseta, preservando scale(1.04) no .featured
        const isFeatured = card.classList.contains('featured');
        card.style.transform = isFeatured ? 'scale(1.04)' : '';
      });
    }

    // Observa DOM atual e futuro (re-renders do dashboard, etc.)
    function _scanCards() {
      document.querySelectorAll(SELECTORS).forEach(_attachTilt);
    }

    _scanCards();
    // Reprocessa quando novas páginas são renderizadas
    window._tiltScan = _scanCards;
  }

  /* ══════════════════════════════
     9. MARQUEE / TICKER
     A animação é 100% CSS (.partners-list).
     O JS só duplica os itens para o loop ficar
     seamless — clona o conjunto uma vez.
  ══════════════════════════════ */
  function _initMarquee() {
    const list = document.querySelector('.partners-list');
    if (!list || list.dataset.marqueeInit) return;
    list.dataset.marqueeInit = '1';
    // Clona os filhos originais e adiciona ao final para loop contínuo
    const original = Array.from(list.children);
    original.forEach(el => list.appendChild(el.cloneNode(true)));
  }

  /* ══════════════════════════════
     10. PAGE ENTER HOOK
     A animação de entrada é feita via CSS (.page-enter).
     Aqui apenas re-scaneamos reveals e tilt para
     elementos inseridos dinamicamente.
  ══════════════════════════════ */
  function pageEnter() {
    setTimeout(observeNewElements, 50);
    setTimeout(() => window._tiltScan?.(), 80);
  }

  /* ══════════════════════════════
     INIT
  ══════════════════════════════ */
  function init() {
    _initCursor();
    _initParticles();
    _initScrollReveal();
    _initParallax();
    _initCounters();
    _initHeroText();
    // _initFloat() — removido intencionalmente
    _initMarquee();
    _initCardTilt();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, pageEnter, observeNewElements, scanCardTilt: () => window._tiltScan?.() };
})();
