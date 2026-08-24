/* =========================================================
   Contabilize Assessoria Contábil — JavaScript principal
   Vanilla JS, sem dependências.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Configuração central do site ----------
     TODO: altere apenas estas constantes ao entregar o site.
     O número do WhatsApp deve estar no formato 55 + DDD + número. */
  var CONFIG = {
    whatsapp: '5579998782595',
    empresa: 'Contabilize Assessoria Contábil'
  };

  var reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* =========================================================
     1. Cabeçalho fixo: fundo sólido + troca do logo ao rolar
     ========================================================= */
  var header = $('#header');
  var logoHeader = $('#logo-header');
  var LOGO_BRANCO = 'assets/img/logo-contabilize-branco.svg';
  var LOGO_AZUL = 'assets/img/logo-contabilize-azul.svg';

  function atualizarHeader() {
    var fixo = window.scrollY > 40;
    header.classList.toggle('is-stuck', fixo);
    if (logoHeader) {
      var alvo = fixo ? LOGO_AZUL : LOGO_BRANCO;
      if (logoHeader.getAttribute('src') !== alvo) logoHeader.setAttribute('src', alvo);
    }
  }
  window.addEventListener('scroll', atualizarHeader, { passive: true });
  atualizarHeader();

  /* =========================================================
     2. Menu mobile
     ========================================================= */
  var toggle = $('#nav-toggle');
  var menu = $('#nav-menu');

  function fecharMenu() {
    header.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu de navegação');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var aberto = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(aberto));
      toggle.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    });
    $$('a', menu).forEach(function (link) { link.addEventListener('click', fecharMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharMenu(); });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('is-open') && !header.contains(e.target)) fecharMenu();
    });
  }

  /* =========================================================
     3. Animações de entrada (IntersectionObserver)
     ========================================================= */
  var elementosReveal = $$('[data-reveal]');

  if (reduzirMovimento || !('IntersectionObserver' in window)) {
    elementosReveal.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observadorReveal = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('is-visible');
          obs.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    elementosReveal.forEach(function (el) { observadorReveal.observe(el); });
  }

  /* =========================================================
     4. Contadores animados da faixa de números
     ========================================================= */
  function animarContador(el) {
    var alvo = parseFloat(el.dataset.target || '0');
    var duracao = 1400;
    var inicio = null;

    if (reduzirMovimento) { el.textContent = String(alvo); return; }

    function passo(agora) {
      if (inicio === null) inicio = agora;
      var progresso = Math.min((agora - inicio) / duracao, 1);
      var eased = 1 - Math.pow(1 - progresso, 3); // easeOutCubic
      el.textContent = String(Math.round(alvo * eased));
      if (progresso < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  var contadores = $$('.counter');
  if (contadores.length) {
    if (!('IntersectionObserver' in window)) {
      contadores.forEach(animarContador);
    } else {
      var observadorContador = new IntersectionObserver(function (entradas, obs) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) { animarContador(entrada.target); obs.unobserve(entrada.target); }
        });
      }, { threshold: 0.6 });
      contadores.forEach(function (c) { observadorContador.observe(c); });
    }
  }

  /* =========================================================
     5. Barras do mini-painel
     ========================================================= */
  var miniDash = $('#mini-dash');
  if (miniDash) {
    var preencherBarras = function () {
      $$('.mini-bar i', miniDash).forEach(function (barra, i) {
        setTimeout(function () { barra.style.width = barra.dataset.width || '0%'; }, reduzirMovimento ? 0 : i * 160);
      });
    };
    if ('IntersectionObserver' in window) {
      var obsDash = new IntersectionObserver(function (entradas, obs) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) { preencherBarras(); obs.disconnect(); }
        });
      }, { threshold: 0.35 });
      obsDash.observe(miniDash);
    } else {
      preencherBarras();
    }
  }

  /* =========================================================
     6. FAQ acessível (accordion)
     ========================================================= */
  $$('.faq-q').forEach(function (botao) {
    botao.addEventListener('click', function () {
      var item = botao.closest('.faq-item');
      var resposta = $('.faq-a', item);
      var aberto = item.classList.contains('is-open');

      // Fecha os demais (comportamento de acordeão)
      $$('.faq-item.is-open').forEach(function (outro) {
        if (outro !== item) {
          outro.classList.remove('is-open');
          $('.faq-a', outro).style.maxHeight = null;
          $('.faq-q', outro).setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('is-open', !aberto);
      botao.setAttribute('aria-expanded', String(!aberto));
      resposta.style.maxHeight = aberto ? null : resposta.scrollHeight + 'px';
    });
  });

  // Recalcula a altura da resposta aberta ao redimensionar
  window.addEventListener('resize', function () {
    var aberto = $('.faq-item.is-open .faq-a');
    if (aberto) aberto.style.maxHeight = aberto.scrollHeight + 'px';
  });

  /* =========================================================
     7. Scroll spy — destaca o item de menu da seção visível
     ========================================================= */
  var secoes = $$('main section[id]');
  var linksMenu = $$('#nav-menu a');

  if (secoes.length && linksMenu.length && 'IntersectionObserver' in window) {
    var observadorSecao = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var id = entrada.target.getAttribute('id');
        linksMenu.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secoes.forEach(function (s) { observadorSecao.observe(s); });
  }

  /* =========================================================
     8. Máscara de telefone
     ========================================================= */
  var campoTelefone = $('#whatsapp');
  if (campoTelefone) {
    campoTelefone.addEventListener('input', function () {
      var v = campoTelefone.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) {
        v = v.length === 11
          ? v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
          : v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else if (v.length > 0) {
        v = v.replace(/(\d{0,2})/, '($1');
      }
      campoTelefone.value = v;
    });
  }

  /* =========================================================
     9. Formulário -> abre o WhatsApp com a mensagem pronta
        (Para receber por e-mail, troque por Formspree, EmailJS
         ou um endpoint próprio — ver README.)
     ========================================================= */
  var form = $('#form-contato');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nome = $('#nome').value.trim();
      var telefone = $('#whatsapp').value.trim();
      var assunto = $('#assunto').value;
      var status = $('#form-status');

      if (!nome || telefone.replace(/\D/g, '').length < 10 || !assunto) {
        status.textContent = 'Preencha nome, WhatsApp válido e o assunto para continuar.';
        status.style.color = '#C0392B';
        status.classList.add('is-visible');
        return;
      }

      var mensagem =
        'Olá, ' + CONFIG.empresa + '!\n\n' +
        'Nome: ' + nome + '\n' +
        'WhatsApp: ' + telefone + '\n' +
        'Assunto: ' + assunto + '\n\n' +
        'Vim pelo site e gostaria do diagnóstico contábil gratuito.';

      status.textContent = 'Tudo certo! Abrindo o WhatsApp para finalizar o envio…';
      status.style.color = '';
      status.classList.add('is-visible');

      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(mensagem), '_blank', 'noopener');
      form.reset();

      setTimeout(function () { status.classList.remove('is-visible'); }, 6000);
    });
  }

  /* =========================================================
     10. Ano atual no rodapé
     ========================================================= */
  var ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();


/* =========================================================
   CAMADA DE MOVIMENTO
   Efeitos de scroll, parallax, carrossel e microinterações.
   Tudo é desativado quando o usuário pede menos movimento.
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pontoFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Marca que o JS está ativo (usado pelo CSS do botão flutuante)
  document.documentElement.classList.add('js');

  /* ---------------------------------------------------------
     1. Stagger automático — cada filho entra um pouco depois
     --------------------------------------------------------- */
  ['.grid', '.steps', '.stats-grid', '.feature-list', '.footer-grid'].forEach(function (sel) {
    $$(sel).forEach(function (container) {
      $$(':scope > *', container).forEach(function (filho, i) {
        filho.style.setProperty('--i', i);
      });
    });
  });

  /* ---------------------------------------------------------
     2. Rodapé também entra com animação
     --------------------------------------------------------- */
  var colunasRodape = $$('.footer-grid > *');
  colunasRodape.forEach(function (col) { col.setAttribute('data-reveal', ''); });

  if (reduzir || !('IntersectionObserver' in window)) {
    colunasRodape.forEach(function (c) { c.classList.add('is-visible'); });
  } else {
    var obsRodape = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    colunasRodape.forEach(function (c) { obsRodape.observe(c); });
  }

  /* ---------------------------------------------------------
     3. Barra de progresso de leitura + parallax do hero
        Tudo em um único listener com requestAnimationFrame.
     --------------------------------------------------------- */
  var barra = document.createElement('div');
  barra.className = 'scroll-progress';
  barra.setAttribute('role', 'presentation');
  document.body.appendChild(barra);

  var hero = $('.hero');
  var barrasHero = $('.hero-bars');
  var conteudoHero = $('.hero-grid > *:first-child');
  var waFloat = $('.wa-float');
  var aguardando = false;

  if (barrasHero) barrasHero.style.willChange = 'transform';

  function aoRolar() {
    var y = window.scrollY || window.pageYOffset;
    var alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
    var progresso = alturaTotal > 0 ? (y / alturaTotal) * 100 : 0;
    barra.style.width = progresso + '%';

    // Botão do WhatsApp entra após o primeiro rolar
    if (waFloat) waFloat.classList.toggle('is-in', y > 220);

    // Parallax só enquanto o hero está na tela
    if (!reduzir && hero && y < hero.offsetHeight) {
      if (barrasHero) barrasHero.style.transform = 'translate3d(0,' + (y * 0.22) + 'px,0)';
      if (conteudoHero) {
        conteudoHero.style.transform = 'translate3d(0,' + (y * 0.1) + 'px,0)';
        conteudoHero.style.opacity = String(Math.max(1 - y / 620, 0));
      }
    }
    aguardando = false;
  }

  window.addEventListener('scroll', function () {
    if (!aguardando) { aguardando = true; requestAnimationFrame(aoRolar); }
  }, { passive: true });
  aoRolar();

  /* ---------------------------------------------------------
     4. Holofote que segue o mouse nos cards
     --------------------------------------------------------- */
  if (pontoFino && !reduzir) {
    $$('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------------------------------------------------------
     5. Segmentos atendidos em carrossel infinito
     --------------------------------------------------------- */
  var chips = $('.chips');
  if (chips && !reduzir && window.innerWidth > 640) {
    var itens = $$('.chip', chips);
    if (itens.length > 5) {
      var metade = Math.ceil(itens.length / 2);
      var grupos = [itens.slice(0, metade), itens.slice(metade)];
      var fragmento = document.createDocumentFragment();

      grupos.forEach(function (grupo, indice) {
        var marquee = document.createElement('div');
        marquee.className = 'marquee' + (indice === 1 ? ' marquee--reverse' : '');
        var trilha = document.createElement('div');
        trilha.className = 'marquee-track';

        // Duas cópias do grupo garantem o loop sem emenda
        for (var copia = 0; copia < 2; copia++) {
          grupo.forEach(function (chip) {
            var clone = chip.cloneNode(true);
            if (copia === 1) clone.setAttribute('aria-hidden', 'true');
            trilha.appendChild(clone);
          });
        }
        marquee.appendChild(trilha);
        fragmento.appendChild(marquee);
      });

      chips.innerHTML = '';
      chips.classList.add('is-marquee');
      chips.appendChild(fragmento);
    }
  }

  /* ---------------------------------------------------------
     6. Palavras que se alternam no título principal
     --------------------------------------------------------- */
  var destaque = $('.hero h1 em');
  if (destaque && !reduzir && window.innerWidth >= 900) {
    var frases = [
      destaque.textContent.trim(),
      'impostos no valor certo',
      'prazos sempre em dia',
      'decisões com base em dados'
    ];

    // Reserva a largura da maior frase: sem isso o título "pula"
    // a cada troca e o site perde pontos de CLS no Core Web Vitals.
    var regua = document.createElement('span');
    regua.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:-9999px';
    destaque.appendChild(regua);
    var maior = 0;
    frases.forEach(function (frase) {
      regua.textContent = frase;
      maior = Math.max(maior, regua.offsetWidth);
    });
    destaque.removeChild(regua);
    destaque.style.minWidth = maior + 'px';

    var giro = document.createElement('span');
    giro.className = 'word-rotate';
    giro.textContent = frases[0];
    destaque.textContent = '';
    destaque.classList.add('is-rotating'); // move o sublinhado para o span
    destaque.appendChild(giro);

    var atual = 0;
    setInterval(function () {
      if (document.hidden) return;
      giro.classList.add('is-out');
      setTimeout(function () {
        atual = (atual + 1) % frases.length;
        giro.textContent = frases[atual];
        giro.classList.remove('is-out');
      }, 380);
    }, 4200);
  }
})();

