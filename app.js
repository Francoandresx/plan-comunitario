(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- fecha de hoy en Lima ---------- */
  function limaToday() {
    var q = new URLSearchParams(location.search).get('hoy');
    if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q;
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date());
    } catch (e) {
      var d = new Date(); d.setHours(d.getHours() - 5);
      return d.toISOString().slice(0, 10);
    }
  }
  function num(s) { var p = s.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5; }
  var TODAY = limaToday(), T = num(TODAY);
  var MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var MES3 = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  var DIAS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  function parts(s) { var p = s.split('-'); return { y: +p[0], m: +p[1] - 1, d: +p[2] }; }
  function dow(s) { return new Date(Date.UTC.apply(null, [parts(s).y, parts(s).m, parts(s).d])).getUTCDay(); }
  function long(s) { var p = parts(s); return DIAS[dow(s)] + ' ' + p.d + ' de ' + MESES[p.m]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function iso(n) { return new Date(n * 864e5).toISOString().slice(0, 10); }

  var TYPES = {
    ed:   { name: 'Escuela Dominical', c: 'var(--ed)' },
    sf:   { name: 'SportFriends',      c: 'var(--sf)' },
    cine: { name: 'Noche de cine',     c: 'var(--cine)' },
    nav:  { name: 'Chocolatada',       c: 'var(--nav)' },
    paso: { name: 'Seguimiento',       c: 'var(--paso)' }
  };

  /* ---------- datos del calendario ---------- */
  var EV = {};
  function add(date, type, title, detail, tentative) {
    (EV[date] = EV[date] || []).push({ t: type, title: title, d: detail || '', ring: !!tentative });
  }
  add('2026-11-09', 'paso', 'Esta semana: Anny llama a Fermilda', 'Armar juntas los temas de las clases de Escuela Dominical.');
  add('2026-11-09', 'cine', 'Empieza el anuncio de boca en boca', 'Fermilda, Clever, Isaac y la familia pastoral, junto con los niños. Todos los días hasta el 20 de noviembre.');
  add('2026-11-11', 'cine', 'Elegir y aprobar la película 1', 'Anny propone, Franco aprueba.');
  add('2026-11-12', 'cine', 'Verificar permiso de proyección pública', 'Franco, para la noche 1.');
  add('2026-11-13', 'cine', 'Confirmar fecha, hora y uso del local', 'Franco, con la iglesia. A más tardar este día.');
  add('2026-11-14', 'sf', 'SportFriends: Pases 1', 'Servir a los demás (Marcos 10:43-44). Lección lista. Isaac invita a la noche de cine 1.');
  add('2026-11-14', 'cine', 'Anuncio y invitación personal', 'Isaac, para la noche 1.');
  add('2026-11-15', 'ed', 'Escuela Dominical', 'Anotar quiénes vienen (hoy 3 o 4) como punto de partida. Anunciar la noche de cine 1 e invitar a cada familia a traer a otros niños.');
  add('2026-11-15', 'cine', 'Fermilda anuncia la noche 1', 'En el culto y con invitación personal.');
  add('2026-11-15', 'paso', 'Presupuesto de canchita y refresco', 'Anny lo prepara y Franco lo aprueba antes de esta fecha.');
  add('2026-11-16', 'cine', 'Enviar el dinero a Tahuanía', 'Propuesta: este lunes, antes de la noche 1. Franco aprueba. Falta definir quién lo envía.');
  add('2026-11-16', 'ed', 'Llamada de 15 minutos', 'Fermilda y Anny revisan el registro y deciden a quién visitar.');
  add('2026-11-17', 'cine', 'Elegir y aprobar la película 2', 'Anny propone, Franco aprueba.');
  add('2026-11-18', 'cine', 'Revisar el equipo de la noche 1', 'Isaac: proyector, pantalla, parlante, extensiones y prueba de sonido.');
  add('2026-11-18', 'cine', 'Verificar permiso de proyección', 'Franco, para la noche 2.');
  add('2026-11-20', 'cine', 'Noche de cine 1', 'Para los niños y las familias de Nueva Italia. Se prepara la canchita y el refresco antes de la película. Fermilda e Isaac anotan nombre, edad y si es nuevo.');
  add('2026-11-21', 'sf', 'SportFriends: Pases 2', 'Trabajo en equipo, los cuatro amigos del paralítico (Marcos 2:1-12). Lección lista. Isaac invita a la noche 2.');
  add('2026-11-22', 'ed', 'Escuela Dominical', 'Visitar o escribir a los que faltaron. Recordar la noche de cine 2.');
  add('2026-11-23', 'paso', 'Evaluación de la noche 1', 'Evaluación corta de Anny a Franco.');
  add('2026-11-25', 'cine', 'Revisar el equipo de la noche 2', 'Isaac: proyector, pantalla, parlante, extensiones y prueba de sonido.');
  add('2026-11-27', 'cine', 'Noche de cine 2', 'Para los chicos de SportFriends y sus familias. Canchita y refresco antes de la película. Registro de asistentes.');
  add('2026-11-28', 'sf', 'SportFriends: Pases 3', 'Un corazón humilde. La lección está en desarrollo.');
  add('2026-11-29', 'ed', 'Escuela Dominical', 'Seguimiento de los que faltaron.');
  add('2026-11-30', 'paso', 'Evaluación de la noche 2', 'Evaluación corta de Anny a Franco.');
  add('2026-11-30', 'paso', 'Reunión de voluntarios de EBDV', 'Anny, en la oficina de RiverWind.');
  add('2026-11-30', 'paso', 'Revisión de indicadores de noviembre', 'Franco y Anny.');
  add('2026-12-05', 'sf', 'SportFriends: Pases 4', 'Superando las dificultades. La lección está en desarrollo.');
  add('2026-12-06', 'ed', 'Escuela Dominical', 'Invitar a todos los niños y familias de Nueva Italia a la chocolatada y al programa navideño. Confirmar los materiales con el equipo que llega.');
  ['07','08','09','10','11'].forEach(function (d) {
    add('2026-12-' + d, 'nav', 'Semana de la chocolatada', 'Chocolatada y programa navideño con el equipo comunitario. El día exacto está por confirmar.', true);
  });
  add('2026-12-12', 'nav', 'Chocolatada y programa navideño', 'Una de las fechas posibles. El día exacto está por confirmar.', true);
  add('2026-12-12', 'sf', 'SportFriends: Pases 5, pospuesta', 'Jesús, el mayor ejemplo. Se pospone porque el equipo comunitario está para la chocolatada.', true);
  add('2026-12-13', 'ed', 'Escuela Dominical', 'Balance de la chocolatada.');
  add('2026-12-14', 'paso', 'Esta semana: definir el cierre del año', 'Franco y Anny.');
  add('2026-12-19', 'sf', 'SportFriends: sin programar', 'Sábado por definir.', true);
  add('2026-12-20', 'ed', 'Escuela Dominical', 'Clase normal y seguimiento de ausentes.');
  add('2026-12-21', 'paso', 'Del 21 al 31: informe de cierre', 'Franco consolida el informe de cierre 2026 y las metas para 2027.');
  add('2026-12-26', 'sf', 'SportFriends: sin programar', 'Sábado por definir.', true);
  add('2026-12-27', 'ed', 'Escuela Dominical', 'Evaluación del año. Fermilda entrega el registro anual y la lista de niños con asistencia regular.');
  add('2026-12-28', 'paso', 'Revisión de indicadores de diciembre', 'Franco y Anny. Informe de cierre y lista de necesidades para el Plan 2027.');

  var START = '2026-11-09', END = '2026-12-31';

  /* ---------- mapa del periodo ---------- */
  var map = document.getElementById('map'), detail = document.getElementById('detail');
  var selected = null;

  function buildMap() {
    var head = '<span></span>' + ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(function (d) { return '<span class="hd">' + d + '</span>'; }).join('');
    var html = head, s = num(START), e = num(END);
    for (var w = 0; w < 8; w++) {
      var base = s + w * 7, lab = '';
      if (w === 0) lab = 'nov'; if (w === 4) lab = 'dic';
      html += '<span class="wk">' + lab + '</span>';
      for (var k = 0; k < 7; k++) {
        var n = base + k, ds = iso(n);
        if (n > e) { html += '<span class="day out"></span>'; continue; }
        var p = parts(ds), list = EV[ds] || [], seen = [], dots = '';
        list.forEach(function (ev) { if (seen.indexOf(ev.t + ev.ring) < 0) seen.push(ev.t + ev.ring); });
        var order = 0;
        ['ed','sf','cine','nav','paso'].forEach(function (t) {
          [false, true].forEach(function (r) {
            if (seen.indexOf(t + r) >= 0) {
              dots += '<span class="dot' + (r ? ' ring' : '') + '" style="--c:' + TYPES[t].c + ';--i:' + order + ';--w:' + w + '"></span>'; order++;
            }
          });
        });
        var label = cap(long(ds)) + (list.length ? ', ' + list.length + (list.length === 1 ? ' actividad' : ' actividades') : ', sin actividades');
        var lbl = p.d === 1 ? p.d + ' ' + MES3[p.m] : p.d;
        html += '<button type="button" class="day' + (ds === TODAY ? ' today' : '') + '" data-d="' + ds + '" aria-pressed="false" aria-label="' + label + '"><span class="n tnum">' + lbl + '</span><span class="dots">' + dots + '</span></button>';
      }
    }
    map.innerHTML = html;
    map.addEventListener('click', function (e) {
      var b = e.target.closest('.day[data-d]'); if (b) select(b.getAttribute('data-d'), true);
    });
  }
  function select(ds, animate) {
    selected = ds;
    Array.prototype.forEach.call(map.querySelectorAll('.day[data-d]'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-d') === ds ? 'true' : 'false');
    });
    var list = EV[ds] || [];
    var h = '<h3>' + cap(long(ds)) + '</h3>';
    if (!list.length) h += '<p class="empty">Sin actividades programadas este día.</p>';
    else {
      h += '<ul>' + list.map(function (ev) {
        return '<li style="--c:' + TYPES[ev.t].c + '"><i></i><div><b>' + ev.title + '</b><span>' + ev.d + '</span></div></li>';
      }).join('') + '</ul>';
    }
    detail.innerHTML = h;
    if (animate && !reduce) { detail.classList.remove('swap'); void detail.offsetWidth; detail.classList.add('swap'); }
  }
  buildMap();
  var first = T >= num(START) && T <= num(END) ? TODAY : START;
  select(first, false);

  /* ---------- lista de coordinación ---------- */
  var STEPS = [
    { id: 'peli',   t: 'Elegir la película y aprobarla', w: 'Anny propone, Franco aprueba', d: ['Película 1: mié 11 nov', 'Película 2: mar 17 nov'], due: '2026-11-11' },
    { id: 'licen',  t: 'Verificar la licencia o el permiso de proyección pública', w: 'Franco', d: ['Noche 1: jue 12 nov', 'Noche 2: mié 18 nov'], due: '2026-11-12' },
    { id: 'local',  t: 'Confirmar fecha, hora y uso del local con la iglesia', w: 'Franco', d: ['A más tardar vie 13 nov'], due: '2026-11-13' },
    { id: 'culto',  t: 'Anunciar en el culto e invitar de manera personal', w: 'Fermilda e Isaac', d: ['Noche 1: sáb 14 y dom 15 nov', 'Noche 2: sáb 21 y dom 22 nov'], due: '2026-11-14' },
    { id: 'presu',  t: 'Pedir el presupuesto de canchita y refresco para las dos noches', w: 'Anny prepara, Franco aprueba', d: ['Antes del 15 de noviembre'], due: '2026-11-15' },
    { id: 'envio',  t: 'Enviar el dinero a Tahuanía para que allá preparen la canchita y los refrescos', w: 'Franco aprueba el envío. Quién lo envía está por confirmar', d: ['Lun 16 nov (propuesta), antes de la noche 1'], due: '2026-11-16' },
    { id: 'equipo', t: 'Revisar proyector, pantalla, parlante y extensiones, y probar el sonido', w: 'Isaac', d: ['Noche 1: mié 18 nov', 'Noche 2: mié 25 nov'], due: '2026-11-18' },
    { id: 'boca',   t: 'Anuncio de boca en boca en el pueblo, día a día', w: 'Fermilda, Clever, Isaac y la familia pastoral, junto con los niños', d: ['Del 9 al 20 nov (noche 1)', 'Hasta el 27 nov (noche 2)'], due: '2026-11-20' },
    { id: 'prep',   t: 'Preparar la canchita y los refrescos en Nueva Italia', w: 'Quienes estén en Nueva Italia (por confirmar)', d: ['Vie 20 y vie 27 nov, antes de la película'], due: '2026-11-20' },
    { id: 'regis',  t: 'Registro de asistentes: nombre, edad y si es nuevo', w: 'Fermilda e Isaac', d: ['Vie 20 y vie 27 nov, durante la noche'], due: '2026-11-20' },
    { id: 'eval',   t: 'Evaluación corta de cada noche', w: 'Anny a Franco', d: ['Noche 1: lun 23 nov', 'Noche 2: lun 30 nov'], due: '2026-11-23' }
  ];
  var KEY = 'plan-nueva-italia-2026';
  var done = {};
  try { done = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { done = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {} }

  var stepsEl = document.getElementById('steps');
  function renderSteps() {
    stepsEl.innerHTML = STEPS.map(function (s) {
      return '<li class="step' + (done[s.id] ? ' done' : '') + '" data-id="' + s.id + '">' +
        '<button type="button" class="chk" aria-pressed="' + (done[s.id] ? 'true' : 'false') + '" aria-label="Marcar como hecho: ' + s.t + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button>' +
        '<div><div class="t">' + s.t + '</div><div class="who">' + s.w + '</div><div class="dates">' + s.d.map(function (x) { return '<span class="chip">' + x + '</span>'; }).join('') + '</div></div></li>';
    }).join('');
  }
  function updateProgress() {
    var n = STEPS.filter(function (s) { return done[s.id]; }).length;
    document.getElementById('bar-cine').style.setProperty('--p', Math.round(n / STEPS.length * 100) + '%');
    document.getElementById('bar-cine').parentNode.style.setProperty('--p', '0');
    document.getElementById('bar-cine-t').textContent = n + ' de ' + STEPS.length;
    document.getElementById('bar-cine').style.width = (n / STEPS.length * 100) + '%';
  }
  function toggle(id) {
    done[id] = !done[id]; if (!done[id]) delete done[id];
    save(); renderSteps(); updateProgress(); updateNext();
  }
  stepsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.chk'); if (b) toggle(b.parentNode.getAttribute('data-id'));
  });

  /* ---------- tarjeta "lo que sigue" ---------- */
  var nextId = null;
  function updateNext() {
    var pend = STEPS.filter(function (s) { return !done[s.id]; });
    var title = document.getElementById('next-title'), meta = document.getElementById('next-meta'),
        n = document.getElementById('next-n'), unit = document.getElementById('next-unit'),
        btn = document.getElementById('next-done'), label = document.getElementById('next-label');
    if (!pend.length) {
      nextId = null; label.textContent = 'Lista de coordinación';
      title.textContent = 'Todos los pasos de las noches de cine están hechos';
      meta.textContent = 'Queda la revisión de indicadores a fin de noviembre.';
      n.textContent = '11'; unit.textContent = 'de 11'; btn.hidden = true; return;
    }
    btn.hidden = false;
    var s = pend[0];
    nextId = s.id;
    var diff = num(s.due) - T;
    label.textContent = diff < 0 ? 'Lo que está atrasado' : 'Lo que sigue';
    title.textContent = s.t;
    meta.innerHTML = '<span class="when">' + s.d[0] + '.</span> ' + s.w + '.';
    if (diff < 0) { n.textContent = Math.abs(diff); unit.textContent = Math.abs(diff) === 1 ? 'día de atraso' : 'días de atraso'; }
    else if (diff === 0) { n.textContent = 'Hoy'; unit.textContent = 'es el día'; }
    else { n.textContent = diff; unit.textContent = diff === 1 ? 'día para esta fecha' : 'días para esta fecha'; }
  }
  document.getElementById('next-done').addEventListener('click', function () { if (nextId) toggle(nextId); });

  renderSteps(); updateProgress(); updateNext();

  /* ---------- cuentas regresivas de las noches ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-night]'), function (el) {
    var d = num(el.getAttribute('data-night')) - T, out = el.querySelector('[data-left]');
    out.textContent = d > 1 ? 'Faltan ' + d + ' días' : d === 1 ? 'Es mañana' : d === 0 ? 'Es hoy' : 'Ya se realizó';
  });

  /* ---------- indicadores "hoy" ---------- */
  function countPast(dates) { return dates.filter(function (x) { return num(x) <= T; }).length; }
  document.getElementById('i-ed').textContent = countPast(['2026-11-15','2026-11-22','2026-11-29','2026-12-06','2026-12-13','2026-12-20','2026-12-27']) + ' de 7';
  document.getElementById('i-sf').textContent = countPast(['2026-11-14','2026-11-21','2026-11-28','2026-12-05']) + ' de 4 programadas';
  document.getElementById('i-cine').textContent = countPast(['2026-11-20','2026-11-27']) + ' de 2';

  /* ---------- animaciones al entrar ---------- */
  function countUp(el) {
    var target = +el.getAttribute('data-count');
    if (reduce) { el.textContent = target; return; }
    var t0 = null, dur = 900;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; io.unobserve(el);
        if (el.hasAttribute('data-count')) countUp(el); else el.classList.add('in');
      });
    }, { threshold: 0.25 });
    Array.prototype.forEach.call(document.querySelectorAll('[data-count], #map, #therm, #seg'), function (el) { io.observe(el); });

    var secs = Array.prototype.slice.call(document.querySelectorAll('main section.sec'));
    var links = {};
    Array.prototype.forEach.call(document.querySelectorAll('.nav a'), function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
        var a = links[en.target.id];
        if (a) {
          a.setAttribute('aria-current', 'true');
          var nav = a.parentNode; nav.scrollTo && nav.scrollTo({ left: a.offsetLeft - 20, behavior: reduce ? 'auto' : 'smooth' });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { so.observe(s); });
  } else {
    Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (el) { el.textContent = el.getAttribute('data-count'); });
    ['map', 'therm', 'seg'].forEach(function (id) { var el = document.getElementById(id); el && el.classList.add('in'); });
  }

  if (reduce) {
    Array.prototype.forEach.call(document.querySelectorAll('svg'), function (s) { try { s.pauseAnimations(); } catch (e) {} });
  }
})();
