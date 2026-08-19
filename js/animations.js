/* ==========================================================
   animations.js — Cursor, Canvas Particles, Scroll Reveal,
                   Parallax, Stagger Text, Counters
   ========================================================== */

const Anim = (() => {

  /* ══════════════════════════════
     1. CURSOR PERSONALIZADO
  ══════════════════════════════ */
  let _cursorDot, _cursorRing;
  let _cx = -100, _cy = -100; // posição do cursor
  let _rx = -100, _ry = -100; // posição do anel (lag)
  let _hovering = false;

  function _initCursor() {
    // Só em desktop (pointer device)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    _cursorDot  = document.createElement('div');
    _cursorRing = document.createElement('div');
    _cursorDot.className  = 'cursor-dot';
    _cursorRing.className = 'cursor-ring';
    document.body.appendChild(_cursorDot);
    document.body.appendChild(_cursorRing);

    document.addEventListener('mousemove', e => {
      _cx = e.clientX;
      _cy = e.clientY;
    });

    // Hover em elementos interativos → ring maior
    document.addEventListener('mouseover', e => {
      const el = e.target.closest('a, button, [role="button"], .radio-option, .task-item, .plan-card, .step-card, .depo-card');
      _hovering = !!el;
      _cursorRing.classList.toggle('cursor-hover', _hovering);
    });

    document.addEventListener('mouseleave', () => {
      _cursorDot.style.opacity  = '0';
      _cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      _cursorDot.style.opacity  = '1';
      _cursorRing.style.opacity = '1';
    });

    _tickCursor();
  }

  function _tickCursor() {
    // Dot segue imediatamente
    if (_cursorDot) {
      _cursorDot.style.transform = `translate(${_cx - 4}px, ${_cy - 4}px)`;
    }
    // Ring tem lag suave
    _rx += (_cx - _rx) * 0.12;
    _ry += (_cy - _ry) * 0.12;
    if (_cursorRing) {
      _cursorRing.style.transform = `translate(${_rx - 20}px, ${_ry - 20}px)`;
    }
    requestAnimationFrame(_tickCursor);
  }

  /* ══════════════════════════════
     2. CANVAS PARTICLES (FUNDO DO HERO)
  ══════════════════════════════ */
  let _canvas, _ctx, _particles = [];
  const PARTICLE_COUNT = 55;

  function _initParticles() {
    _canvas = document.getElementById('hero-canvas');
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
      x:    Math.random() * W,
      y:    fromBottom ? H + 10 : Math.random() * H,
      r:    Math.random() * 2 + 0.5,
      vx:   (Math.random() - 0.5) * 0.4,
      vy:   -(Math.random() * 0.5 + 0.15),
      alpha: Math.random() * 0.5 + 0.1,
      // Paleta: verde ácido, azul cobalto, ultravioleta
      color: ['170,255,0', '0,71,255', '123,0,255'][Math.floor(Math.random() * 3)]
    };
  }

  function _tickParticles() {
    if (!_ctx || !_canvas) return;
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);

    _particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      // Respawn quando sai pelo topo
      if (p.y < -10) {
        _particles[i] = _newParticle(true);
        return;
      }

      _ctx.beginPath();
      _ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      _ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      _ctx.fill();
    });

    // Linhas de conexão entre partículas próximas
    for (let i = 0; i < _particles.length; i++) {
      for (let j = i + 1; j < _particles.length; j++) {
        const dx   = _particles[i].x - _particles[j].x;
        const dy   = _particles[i].y - _particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          _ctx.beginPath();
          _ctx.moveTo(_particles[i].x, _particles[i].y);
          _ctx.lineTo(_particles[j].x, _particles[j].y);
          _ctx.strokeStyle = `rgba(170,255,0,${(1 - dist / 90) * 0.12})`;
          _ctx.lineWidth = 0.5;
          _ctx.stroke();
        }
      }
    }

    requestAnimationFrame(_tickParticles);
  }

  /* ══════════════════════════════
     3. SCROLL REVEAL (Intersection Observer)
  ══════════════════════════════ */
  function _initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stagger filhos se tiver classe .stagger
          if (entry.target.classList.contains('stagger')) {
            entry.target.querySelectorAll(':scope > *').forEach((child, i) => {
              child.style.transitionDelay = `${i * 90}ms`;
              child.classList.add('visible');
            });
          }
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Marca todos os elementos reveal para serem observados
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      observer.observe(el);
    });

    // Re-observa quando novas páginas são renderizadas (SPA)
    window._revealObserver = observer;
  }

  /* Chama de fora após renderizar nova tela */
  function observeNewElements() {
    if (!window._revealObserver) return;
    document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible)').forEach(el => {
      window._revealObserver.observe(el);
    });
  }

  /* ══════════════════════════════
     4. PARALLAX SUAVE NO MOUSE (hero)
  ══════════════════════════════ */
  let _parallaxTarget = null;

  function _initParallax() {
    _parallaxTarget = document.querySelector('.hero-inner');
    if (!_parallaxTarget) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip em touch

    document.addEventListener('mousemove', e => {
      if (!_parallaxTarget) return;
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1 a 1
      const dy = (e.clientY - cy) / cy;

      const heroLeft  = _parallaxTarget.querySelector('.hero-left');
      const heroRight = _parallaxTarget.querySelector('.hero-right');

      if (heroLeft)  heroLeft.style.transform  = `translate(${dx * -6}px, ${dy * -4}px)`;
      if (heroRight) heroRight.style.transform = `translate(${dx *  8}px, ${dy *  5}px)`;
    });

    // Reset ao sair do hero
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      heroEl.addEventListener('mouseleave', () => {
        const heroLeft  = _parallaxTarget?.querySelector('.hero-left');
        const heroRight = _parallaxTarget?.querySelector('.hero-right');
        if (heroLeft)  heroLeft.style.transform  = '';
        if (heroRight) heroRight.style.transform = '';
      });
    }
  }

  /* ══════════════════════════════
     5. COUNTERS ANIMADOS
  ══════════════════════════════ */
  function _initCounters() {
    const counters = document.querySelectorAll('[data-count]');
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
     6. TEXTO COM CLIP STAGGER (hero title)
  ══════════════════════════════ */
  function _initHeroText() {
    const lines = document.querySelectorAll('.hero-title-white, .hero-title-accent');
    lines.forEach((line, i) => {
      line.style.opacity   = '0';
      line.style.transform = 'translateY(40px)';
      line.style.transition= `opacity .7s ${400 + i * 150}ms cubic-bezier(.16,1,.3,1), transform .7s ${400 + i * 150}ms cubic-bezier(.16,1,.3,1)`;
      setTimeout(() => {
        line.style.opacity   = '1';
        line.style.transform = 'translateY(0)';
      }, 100);
    });

    // Badge, subtitle, CTAs
    const seq = ['.hero-badge', '.hero-subtitle', '.hero-cta-group', '.hero-stats'];
    seq.forEach((sel, i) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.style.opacity   = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition= `opacity .6s ${700 + i * 120}ms cubic-bezier(.16,1,.3,1), transform .6s ${700 + i * 120}ms cubic-bezier(.16,1,.3,1)`;
      setTimeout(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      }, 100);
    });

    // Hero right
    const hr = document.querySelector('.hero-right');
    if (hr) {
      hr.style.opacity   = '0';
      hr.style.transform = 'translateX(48px)';
      hr.style.transition= 'opacity .9s 600ms cubic-bezier(.16,1,.3,1), transform .9s 600ms cubic-bezier(.16,1,.3,1)';
      setTimeout(() => {
        hr.style.opacity   = '1';
        hr.style.transform = 'translateX(0)';
      }, 100);
    }
  }

  /* ══════════════════════════════
     7. FLOATING DO SCORE CARD
  ══════════════════════════════ */
  function _initFloat() {
    const card = document.querySelector('.score-float-card');
    if (card) card.style.animation = 'float 4s ease-in-out infinite';

    const sec = document.querySelector('.score-secondary-card');
    if (sec) sec.style.animation = 'float 4s 1s ease-in-out infinite';
  }

  /* ══════════════════════════════
     8. MARQUEE / TICKER DA FAIXA DE PARCEIROS
  ══════════════════════════════ */
  function _initMarquee() {
    const list = document.querySelector('.partners-list');
    if (!list) return;
    // Duplica o conteúdo para loop contínuo
    list.innerHTML += list.innerHTML;
    list.style.animation = 'ticker 18s linear infinite';
    list.style.display   = 'flex';
    list.style.width     = 'max-content';
    list.style.flexWrap  = 'nowrap';
    list.style.willChange = 'transform';
  }

  /* ══════════════════════════════
     9. SMOOTH SCROLL PARA ÂNCORAS
  ══════════════════════════════ */
  function _initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ══════════════════════════════
     10. PAGE TRANSITION FADE
  ══════════════════════════════ */
  function pageEnter() {
    const page = document.querySelector('[data-page].active');
    if (!page) return;
    page.style.opacity   = '0';
    page.style.transform = 'translateY(12px)';
    page.style.transition = 'none';
    requestAnimationFrame(() => {
      page.style.transition = 'opacity .35s cubic-bezier(.16,1,.3,1), transform .35s cubic-bezier(.16,1,.3,1)';
      requestAnimationFrame(() => {
        page.style.opacity   = '1';
        page.style.transform = 'translateY(0)';
      });
    });
    // Re-observa novos elementos reveal na página
    setTimeout(observeNewElements, 50);
  }

  /* ══════════════════════════════
     INIT GERAL
  ══════════════════════════════ */
  function init() {
    _initCursor();
    _initParticles();
    _initScrollReveal();
    _initParallax();
    _initCounters();
    _initHeroText();
    _initFloat();
    _initMarquee();
    _initSmoothScroll();
  }

  // Aguarda DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, pageEnter, observeNewElements };
})();
