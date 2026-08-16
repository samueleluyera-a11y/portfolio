/* Auto123 design-system case study — interactive widgets.
   Token values are the real Figma values (Foundations 661:8690); the swatch
   grids and component playgrounds are generated from them, so the page shows
   a working system rather than pictures of one. */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  };

  /* ── Real token data from Figma ───────────────────────────────── */
  var RAMPS = {
    Primary: {
      group: 'Primary',
      steps: [['50','#e6f2ef'],['100','#daf2ec'],['200','#b5e6da'],['300','#90d9c7'],['400','#46c0a2'],
              ['500','#46c0a2'],['600','#3aaa8f'],['700','#31917a'],['800','#297864'],['900','#18453a']],
      alphaGroup: 'Primary/Alpha', alphaBase: '70,192,162'
    },
    Secondary: {
      group: 'Secondary',
      steps: [['50','#dcecf4'],['100','#b7e0f4'],['200','#70c2e8'],['300','#4cb3e3'],['400','#28a3dd'],
              ['500','#1e8bbd'],['600','#18709a'],['700','#135676'],['800','#0d3c52'],['900','#082634']],
      alphaGroup: 'Secondary/Alpha', alphaBase: '13,60,82'
    },
    Neutrals: {
      group: 'Neutrals',
      // labels reproduced exactly as authored in Figma
      steps: [['0','#ffffff'],['200','#f0f0f7'],['400','#afb2c7'],['0','#53536a'],['100','#000000']],
      alphaGroup: 'Neutrals/Alpha', alphaBase: '0,0,0'
    },
    Accents: {
      group: 'Accents',
      steps: [['Red/500','#fb3758'],['Orange/500','#f46c28'],['Green/500','#1eba67'],
              ['Purple/500','#852eff'],['Pink/500','#e852ac'],['Cyan/500','#0067fe']],
      alphaGroup: 'Accents/Alpha',
      alphaList: [['Red/Alpha/50','251,55,88'],['Orange/Alpha/50','244,108,40'],['Green/Alpha/50','30,186,103'],
                  ['Purple/Alpha/50','133,46,255'],['Pink/Alpha/50','232,82,172'],['Cyan/Alpha/50','0,103,254']]
    }
  };
  var ALPHA_STEPS = [['10',0.1],['20',0.2],['30',0.3],['40',0.4],['50',0.5]];
  /* Figma variables Radius/1–5 */
  var RADII   = [['Radius/1','4px'],['Radius/2','6px'],['Radius/3','8px'],['Radius/4','12px'],['Radius/5','999px']];
  var SHADOWS = [['E0','0 0 0 0 rgba(27,28,29,0)'],['E1','0 2px 4px 0 rgba(27,28,29,.04)'],
                 ['E2','0 16px 32px -12px rgba(88,92,95,.1)'],['E3','0 16px 40px -8px rgba(88,92,95,.16)']];
  var TYPE_ROWS = [[72,'-0.72px','Semi-Bold','72px','110%','-1%'],
                   [56,'-0.56px','Semi-Bold','56px','120%','-1%'],
                   [48,'-0.48px','Semi-Bold','48px','130%','-1%']];

  function swatch(label, styleFn) {
    var s = el('div', 'ds-swatch');
    var c = el('div', 'ds-chip');
    styleFn(c);
    s.appendChild(c);
    s.appendChild(el('div', 'ds-swatch-label', label));
    return s;
  }

  /* ── Style Guide ───────────────────────────────────────────────── */
  function buildStyleGuide(root) {
    var nav = $('.ds-widget-nav', root), panel = $('.ds-widget-panel', root);

    // Colours pane (with its own sub-tabs)
    var colourPane = el('div', 'ds-pane is-active');
    colourPane.dataset.pane = 'Colours';
    var subBar = el('div', 'ds-subtabs');
    var colourBody = el('div', 'ds-colour-pane ds-dots');

    function renderRamp(key) {
      var r = RAMPS[key];
      colourBody.innerHTML = '';
      var groups = el('div', 'ds-swatch-groups');

      var g1 = el('div', 'ds-swatch-group');
      g1.appendChild(el('p', 'ds-group-label', r.group));
      var rows = [], per = key === 'Accents' ? 6 : 5;
      for (var i = 0; i < r.steps.length; i += per) rows.push(r.steps.slice(i, i + per));
      rows.forEach(function (row) {
        var rw = el('div', 'ds-swatch-row');
        row.forEach(function (st) {
          rw.appendChild(swatch(st[0], function (c) { c.style.background = st[1]; }));
        });
        g1.appendChild(rw);
      });
      groups.appendChild(g1);

      var g2 = el('div', 'ds-swatch-group');
      g2.appendChild(el('p', 'ds-group-label', r.alphaGroup));
      var arw = el('div', 'ds-swatch-row');
      if (r.alphaList) {
        r.alphaList.forEach(function (a) {
          arw.appendChild(swatch(a[0], function (c) {
            c.className = 'ds-chip ds-chip--alpha';
            c.style.setProperty('--fill', 'rgba(' + a[1] + ',0.5)');
          }));
        });
      } else {
        ALPHA_STEPS.forEach(function (a) {
          arw.appendChild(swatch(a[0], function (c) {
            c.className = 'ds-chip ds-chip--alpha';
            c.style.setProperty('--fill', 'rgba(' + r.alphaBase + ',' + a[1] + ')');
          }));
        });
      }
      g2.appendChild(arw);
      groups.appendChild(g2);
      colourBody.appendChild(groups);
    }

    var activeRamp = 'Primary';
    var colourTimer;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setRamp(name) {
      activeRamp = name;
      $$('.ds-subtab', subBar).forEach(function (x) {
        x.setAttribute('aria-selected', String(x.textContent === name));
      });
      renderRamp(name);
    }

    function queueRampChange() {
      window.clearTimeout(colourTimer);
      if (reduceMotion) return;
      colourTimer = window.setTimeout(function () {
        var ramps = ['Primary', 'Secondary', 'Neutrals', 'Accents'];
        setRamp(ramps[(ramps.indexOf(activeRamp) + 1) % ramps.length]);
        queueRampChange();
      }, 1000);
    }

    ['Primary', 'Secondary', 'Neutrals', 'Accents'].forEach(function (name, i) {
      var b = el('button', 'ds-subtab', name);
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () {
        setRamp(name);
        queueRampChange();
      });
      subBar.appendChild(b);
    });
    colourPane.appendChild(subBar);
    colourPane.appendChild(colourBody);
    renderRamp('Primary');
    colourBody.addEventListener('mouseenter', function () { window.clearTimeout(colourTimer); });
    colourBody.addEventListener('mouseleave', queueRampChange);
    queueRampChange();

    // Typography pane
    var typePane = el('div', 'ds-pane');
    typePane.dataset.pane = 'Typography';
    var tp = el('div', 'ds-type-pane ds-dots');
    var card = el('div', 'ds-font-card');
    var cl = el('div', 'fc-l');
    cl.appendChild(el('p', 'fc-label', 'Font family'));
    cl.appendChild(el('p', 'fc-name', 'Oversued Grotesque'));
    var w = el('div', 'fc-weights');
    ['Regular', 'Medium', 'Semi-Bold'].forEach(function (x) { w.appendChild(el('span', null, x)); });
    cl.appendChild(w);
    var cr = el('div', 'fc-r');
    cr.appendChild(el('p', 'fc-spec', 'Juxtaposing sleek typography with vibrant hues, the quirky zebra dances amidst carefully crafted patterns.'));
    cr.appendChild(el('p', 'fc-num', '0123456789'));
    card.appendChild(cl); card.appendChild(cr); tp.appendChild(card);

    var head = el('div', 'ds-type-head');
    ['Style', 'Weight', 'Size', 'Line height', 'Letter spacing'].forEach(function (h) { head.appendChild(el('span', null, h)); });
    tp.appendChild(head);
    TYPE_ROWS.forEach(function (r) {
      tp.appendChild(el('div', 'ds-type-rule'));
      var row = el('div', 'ds-type-row');
      var s = el('span', 'tr-sample', 'Heading');
      s.style.fontSize = r[0] + 'px';
      s.style.letterSpacing = r[1];
      s.style.lineHeight = r[4];
      row.appendChild(s);
      [r[2], r[3], r[4], r[5]].forEach(function (v) { row.appendChild(el('span', null, v)); });
      tp.appendChild(row);
    });
    typePane.appendChild(tp);

    // Icons pane (Iconoir grid is a raster in Figma — original export used)
    var iconPane = el('div', 'ds-pane');
    iconPane.dataset.pane = 'Icons';
    var ip = el('div', 'ds-simple-pane ds-dots');
    // Header row is coded; only the icon artwork itself is the supplied raster.
    var ihead = el('div', 'ds-icon-head');
    ihead.appendChild(el('span', 'ds-icon-lib', 'Iconoir'));
    var istyles = el('div', 'ds-icon-styles');
    ['Dynamic', 'Regular', 'Solid'].forEach(function (s, i) {
      if (i) istyles.appendChild(el('span', 'ds-icon-dot', '•'));
      istyles.appendChild(el('span', null, s));
    });
    ihead.appendChild(istyles);
    ip.appendChild(ihead);
    var img = el('img', 'ds-icons-img');
    img.src = 'images/cases/auto123-iconsheet-1264.webp';
    img.srcset = 'images/cases/auto123-iconsheet-1264.webp 1264w, images/cases/auto123-iconsheet-2528.webp 2528w';
    img.sizes = '(max-width: 1024px) 92vw, 700px';
    img.width = 2528; img.height = 1120;
    img.alt = 'Iconoir icon set in Dynamic, Regular and Solid styles';
    img.loading = 'lazy'; img.decoding = 'async';
    ip.appendChild(img); iconPane.appendChild(ip);

    // Corners pane
    var cornerPane = el('div', 'ds-pane');
    cornerPane.dataset.pane = 'Corners';
    var cp = el('div', 'ds-simple-pane ds-dots ds-corner-pane');
    var crow = el('div', 'ds-corner-row');
    RADII.forEach(function (r) {
      var cd = el('div', 'ds-corner-card');
      var preview = el('div', 'ds-corner-preview');
      var demo = el('div', 'ds-corner-demo');
      demo.style.borderTopLeftRadius = r[1];
      preview.appendChild(demo);
      cd.appendChild(preview);
      cd.appendChild(el('div', 'ds-corner-label', r[1]));
      crow.appendChild(cd);
    });
    cp.appendChild(crow); cornerPane.appendChild(cp);

    // Shadows pane
    var shadowPane = el('div', 'ds-pane');
    shadowPane.dataset.pane = 'Shadows';
    var sp = el('div', 'ds-simple-pane ds-dots ds-shadow-pane');
    var srow = el('div', 'ds-shadow-row');
    SHADOWS.forEach(function (s) {
      var cd = el('div', 'ds-shadow-card');
      var preview = el('div', 'ds-shadow-preview');
      var demo = el('div', 'ds-shadow-demo');
      demo.style.boxShadow = s[1];
      preview.appendChild(demo);
      cd.appendChild(preview);
      cd.appendChild(el('div', 'ds-shadow-label', s[0]));
      srow.appendChild(cd);
    });
    sp.appendChild(srow); shadowPane.appendChild(sp);

    [colourPane, typePane, iconPane, cornerPane, shadowPane].forEach(function (p) { panel.appendChild(p); });

    $$('.ds-nav-item', nav).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.ds-nav-item', nav).forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        b.setAttribute('aria-selected', 'true');
        $$('.ds-pane', panel).forEach(function (p) {
          p.classList.toggle('is-active', p.dataset.pane === b.dataset.tab);
        });
      });
    });
  }

  /* ── Tokens widget (semantic tokens, light/dark) ────────────────── */
  function buildTokens(root) {
    var nav = $('.ds-widget-nav', root), panel = $('.ds-widget-panel', root);
    var theme = 'light', tab = 'text';
    var toggle = el('div', 'ds-theme-toggle');
    [['light', 'images/cases/auto123-ios/sun-01.svg'], ['dark', 'images/cases/auto123-ios/moon-02.svg']].forEach(function (t) {
      var b = el('button', 'ds-theme-btn');
      b.type = 'button'; b.innerHTML = '<img src="' + t[1] + '" alt="">';
      b.setAttribute('aria-label', t[0] + ' theme');
      b.setAttribute('aria-selected', t[0] === theme ? 'true' : 'false');
      b.addEventListener('click', function () {
        theme = t[0];
        $$('.ds-theme-btn', toggle).forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        b.setAttribute('aria-selected', 'true');
        render();
      });
      toggle.appendChild(b);
    });

    var pane = el('div', 'ds-token-pane');
    var lightText = [
      [['Text/Primary','#3aaa8f'],['Text/Secondary','#1e8bbd']],
      [['Text/White','#fff'],['Text/Low','#8591a6'],['Text/Normal','#3d4c66'],['Text/High','#000']],
      [['Text/Error','#fb3758'],['Text/Warning','#f46c28'],['Text/Success','#1eba67']]
    ];
    var darkText = [
      [['Text/Primary','#46c0a2'],['Text/Secondary','#28a3dd']],
      [['Text/White','#fff'],['Text/Low','#4c5666'],['Text/Normal','#a7b5cc'],['Text/High','#fff']],
      [['Text/Error','#fb3758'],['Text/Warning','#f46c28'],['Text/Success','#1eba67']]
    ];
    function token(name, colour) {
      var card = el('div', 'ds-token');
      var sw = el('div', 'sw'); sw.style.background = colour;
      if (colour === '#fff') sw.style.border = '.5px solid ' + (theme === 'dark' ? '#15232b' : '#f0f0f7');
      var nm = el('div', 'nm', name); card.appendChild(sw); card.appendChild(nm); return card;
    }
    function textTokens() {
      (theme === 'light' ? lightText : darkText).forEach(function (row) {
        var r = el('div', 'ds-token-row'); row.forEach(function (x) { r.appendChild(token(x[0], x[1])); }); pane.appendChild(r);
      });
    }
    function backgrounds() {
      var wrap = el('div', 'ds-bg-stack');
      var colours = theme === 'light' ? ['#e1e8f5','#edf3fc','#fff','#082634'] : ['#000','#041017','#111c23','#fff'];
      ['BG/Depth • BG/Muted','BG/Base','BG/Elevated','BG/Accented'].forEach(function (name, i) {
        var layer = el('div', 'ds-bg-layer'); layer.style.background = colours[i];
        layer.style.color = theme === 'dark' ? (i === 3 ? '#4c5666' : '#a7b5cc') : (i === 3 ? '#fff' : '#374259');
        layer.appendChild(el('span', '', name)); wrap.appendChild(layer);
      }); pane.appendChild(wrap);
    }
    function borders() {
      var wrap = el('div', 'ds-border-stack');
      var colours = theme === 'light' ? ['#e1e8f5','#d5dce8','#c7ced9'] : ['#15232b','#1b2e38','#213745'];
      ['Border/Normal','Border/mid','Border/High'].forEach(function (name, i) {
        var layer = el('div', 'ds-border-layer'); layer.style.borderColor = colours[i]; layer.appendChild(el('span','',name)); wrap.appendChild(layer);
      }); pane.appendChild(wrap);
    }
    function layers() {
      var alpha = ['rgba(251,55,88,.15)','rgba(244,108,40,.15)','rgba(30,186,103,.15)','rgba(133,46,255,.15)','rgba(0,103,254,.15)','rgba(201,235,89,.3)','rgba(255,187,41,.3)','rgba(232,82,172,.3)'];
      var tone = ['#febcc7','#fbceb7','#b4e8cc','#e6d4ff','#cce1ff','#edf8c8','#ffe8b8','#f7c5e3'];
      var main = ['#fb3758','#f46c28','#1eba67','#852eff','#0067fe','#a7c44a','#d49c22','#e852ac'];
      var shade = ['#54121d','#7a3614','#0a3e22','#3c0090','#002255','#434e1e','#553e0e','#742956'];
      var rows = theme === 'dark' ? [['Alpha',alpha],['Tone',shade],['Main',main],['Shade',tone]] : [['Alpha',alpha],['Tone',tone],['Main',main],['Shade',shade]];
      var grid = el('div', 'ds-layer-grid');
      rows.forEach(function (row, rowIndex) { row[1].forEach(function (colour, i) { var pill=el('div','ds-layer-pill',row[0]); pill.style.background=colour; pill.style.color = rowIndex === 2 ? '#fff' : (rowIndex === 0 ? main[i] : (theme === 'dark' ? (rowIndex === 1 ? tone[i] : shade[i]) : (rowIndex === 1 ? shade[i] : tone[i]))); grid.appendChild(pill); }); });
      pane.appendChild(grid);
    }

    function render() {
      pane.innerHTML = '';
      pane.classList.toggle('is-dark', theme === 'dark');
      panel.classList.toggle('is-dark', theme === 'dark');
      root.classList.toggle('is-dark', theme === 'dark');
      window.dispatchEvent(new CustomEvent('auto123-theme-change', { detail: { theme: theme } }));
      if (tab === 'text') textTokens();
      else if (tab === 'bg') backgrounds();
      else if (tab === 'border') borders();
      else layers();
    }
    panel.appendChild(toggle);
    panel.appendChild(pane);
    render();

    $$('.ds-nav-item', nav).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.ds-nav-item', nav).forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        b.setAttribute('aria-selected', 'true');
        tab = b.dataset.tab; render();
      });
    });
  }

  /* ── Components browser ─────────────────────────────────────────── */
  function componentIcon(name) {
    var iconBase = 'images/cases/auto123-components/coded-assets/icons/';
    var layers = {
      car: ['car-1.svg','car-2.svg','car-2.svg','car-3.svg'],
      sell: ['sell-1.svg','sell-2.svg','sell-3.svg'],
      trade: ['trade-1.svg','trade-2.svg','trade-3.svg','trade-4.svg'],
      bank: ['bank-1.svg','bank-2.svg','bank-3.svg','bank-4.svg'],
      bell: ['bell-1.svg','bell-2.svg'],
      bookmark: ['bookmark.svg'],
      message: ['message-1.svg','message-2.svg','message-3.svg'],
      menu: ['menu-line.svg','menu-line.svg','menu-line.svg']
    };
    return '<span class="cmp-icon cmp-icon--' + name + '" aria-hidden="true">' +
      (layers[name] || []).map(function (file, index) {
        return '<img class="cmp-icon-layer cmp-icon-layer--' + (index + 1) + '" src="' + iconBase + file + '" alt="">';
      }).join('') + '</span>';
  }

  function productIcon(name) {
    var iconBase = 'images/cases/auto123-components/coded-assets/icons/';
    var layers = {
      promoted: ['product-megaphone-1.svg', 'product-megaphone-2.svg'],
      sale: ['product-percent-dot.svg', 'product-percent-dot.svg', 'product-percent-line.svg'],
      mileage: ['product-mileage-1.svg', 'product-mileage-2.svg', 'product-mileage-3.svg'],
      calendar: ['product-calendar-1.svg', 'product-calendar-2.svg', 'product-calendar-3.svg', 'product-calendar-4.svg'],
      electric: ['product-ev-1.svg', 'product-ev-2.svg', 'product-ev-3.svg', 'product-ev-4.svg', 'product-ev-5.svg', 'product-ev-6.svg'],
      transmission: ['product-transmission.svg'],
      location: ['product-map-1.svg', 'product-map-2.svg'],
      fuel: ['product-gas-1.svg', 'product-gas-2.svg']
    };
    return '<span class="cmp-product-icon cmp-product-icon--' + name + '" aria-hidden="true">' +
      (layers[name] || []).map(function (file, index) {
        return '<img class="cmp-product-icon-layer cmp-product-icon-layer--' + (index + 1) + '" src="' + iconBase + file + '" alt="">';
      }).join('') + '</span>';
  }

  function formIcon(name) {
    var iconBase = 'images/cases/auto123-components/coded-assets/icons/';
    if (name === 'brand') return '<img class="cmp-form-icon" src="' + iconBase + 'form-brand.svg" alt="">';
    if (name === 'calendar') return productIcon('calendar');
    if (name === 'fuel') return productIcon('fuel');
    if (name === 'car') return componentIcon('car');
    if (name === 'price') return '<span class="cmp-form-currency" aria-hidden="true">€</span>';
    return '';
  }

  function navMarkup(index) {
    var assetBase = 'images/cases/auto123-components/coded-assets/';
    var logo = '<span class="cmp-logo" aria-label="Auto123"><b>auto</b><strong>123</strong></span>';
    if (index === 1) {
      return '<div class="cmp-nav cmp-nav--mobile-tabs">' +
        '<div class="cmp-mobile-tab is-active">' + componentIcon('car') + '<span>Buy</span></div>' +
        '<div class="cmp-mobile-tab">' + componentIcon('sell') + '<span>Sell</span></div>' +
        '<div class="cmp-mobile-tab">' + componentIcon('trade') + '<span>Trade</span></div>' +
        '<div class="cmp-mobile-tab">' + componentIcon('bank') + '<span>Financing</span></div>' +
      '</div>';
    }
    if (index === 2) {
      return '<div class="cmp-nav cmp-nav--mobile-top">' + logo +
        '<span class="cmp-action">' + componentIcon('menu') + '</span></div>';
    }
    return '<div class="cmp-nav cmp-nav--desktop">' + logo +
      '<div class="cmp-nav-tabs"><span class="cmp-nav-tab is-active">' + componentIcon('car') + '<b>Buy</b></span>' +
      '<span class="cmp-nav-tab">' + componentIcon('sell') + '<span>Sell</span></span></div>' +
      '<div class="cmp-nav-actions"><span class="cmp-action">' + componentIcon('bell') + '</span>' +
      '<span class="cmp-action">' + componentIcon('bookmark') + '</span>' +
      '<span class="cmp-action cmp-action--badge">' + componentIcon('message') + '<i>3</i></span>' +
      '<span class="cmp-profile"><img src="' + assetBase + 'nav-3.png" alt=""><b>⌄</b></span></div></div>';
  }

  function productMeta() {
    return '<div class="cmp-product-meta"><span>' + productIcon('mileage') + '84,236 km</span>' +
      '<span>' + productIcon('calendar') + '2014</span><span>' + productIcon('electric') + 'Electric</span>' +
      '<span>' + productIcon('transmission') + 'Automatic</span><span>' + productIcon('location') + 'Vilnius</span></div>';
  }

  function productMarkup(index) {
    var assetBase = 'images/cases/auto123-components/coded-assets/';
    var tags = '<div class="cmp-product-tags"><span class="is-promoted">' + productIcon('promoted') + 'Promoted</span>' +
      '<span class="is-sale">' + productIcon('sale') + '10% off</span></div>';
    if (index === 1) {
      return '<div class="cmp-product cmp-product--horizontal"><div class="cmp-product-media">' +
        '<img src="' + assetBase + 'product-2.png" alt="Mercedes-Benz E 500"></div>' +
        '<div class="cmp-product-copy">' + tags + '<h3>Mercedes-Benz E 500</h3>' +
        '<p class="cmp-price"><s>€19,365</s><b>€18,365</b></p>' + productMeta() + '</div></div>';
    }
    if (index === 2) {
      return '<div class="cmp-product cmp-product--compact"><div class="cmp-compact-media">' +
        '<span class="cmp-save">' + productIcon('sale') + 'Save 10%</span><img src="' + assetBase + 'product-3.png" alt="2024 MG 4 EV"></div>' +
        '<div class="cmp-compact-copy"><h3>2024 MG 4 EV</h3><span>New</span><p>From <b>€365/month</b></p></div></div>';
    }
    return '<div class="cmp-product cmp-product--vertical"><div class="cmp-product-media">' + tags +
      '<img src="' + assetBase + 'product-1.png" alt="Mercedes-Benz E 500"></div>' +
      '<div class="cmp-product-copy"><h3>Mercedes-Benz E 500</h3><p class="cmp-price"><s>€19,365</s><b>€18,365</b></p>' + productMeta() + '</div></div>';
  }

  function filterCell(label, selected, extra) {
    return '<div class="cmp-filter-cell' + (selected ? ' is-selected' : '') + '">' + (extra || '') + '<span>' + label + '</span></div>';
  }

  function filterMarkup(index) {
    if (index === 0) {
      return '<div class="cmp-filter cmp-filter--transmission">' +
        filterCell('Automatic (25)', true, '<img class="cmp-filter-icon" src="images/cases/auto123-components/coded-assets/icons/filter-automatic.svg" alt="">') +
        filterCell('Manual (0)', false, '<img class="cmp-filter-icon" src="images/cases/auto123-components/coded-assets/icons/filter-manual.svg" alt="">') + '</div>';
    }
    if (index === 1) {
      var colours = [['Black (2)','#000',1],['Grey (2)','#888',0],['White (2)','#fff',1],['Off White (21)','#fff9ed',0],['Gold (2)','linear-gradient(135deg,#8c7200,#ffe95b,#9d7800)',0],['Silver (2)','linear-gradient(135deg,#aaa,#fff,#777)',0],['Cream (0)','#fffbd8',0],['Brown (21)','#946315',0],['Blue (2)','#1097ea',0],['Navy (2)','#0f2aaa',0],['Purple (2)','#9149ef',0],['Green (21)','#00ad14',0],['Yellow (2)','#ffc600',0],['Red (2)','#fa0808',0],['Orange (2)','#ff7b0a',0],['Maroon (21)','#a60000',0]];
      return '<div class="cmp-filter cmp-filter--colours">' + colours.map(function (colour) {
        return filterCell(colour[0], colour[2], '<i style="background:' + colour[1] + '"></i>');
      }).join('') + '</div>';
    }
    if (index === 2) {
      var bodies = [['Sedan (0)',0],['SUV (83)',1],['Pickup (2)',0],['Hatchback (0)',1],['Coupe (0)',0],['Minivan (15)',0],['Convertible (10)',0],['Sports Car (0)',0],['Bus (0)',0]];
      return '<div class="cmp-filter cmp-filter--bodies">' + bodies.map(function (body) {
        return filterCell(body[0], body[1], '<i class="cmp-car-shape"></i>');
      }).join('') + '</div>';
    }
    if (index === 4) {
      var fuels = [['Petrol (23)',1],['Diesel (14)',0],['Electric (10)',0],['Hybrid (5)',0],['Plug-in Hybrid (1)',0]];
      return '<div class="cmp-filter cmp-filter--fuels">' + fuels.map(function (fuel) {
        return filterCell(fuel[0], fuel[1], productIcon(fuel[0].indexOf('Electric') > -1 ? 'electric' : 'fuel'));
      }).join('') + '</div>';
    }
    return '<div class="cmp-filter cmp-filter--checks">' +
      '<div><i>✓</i><span>4 Cylinders (56)</span></div><div><i></i><span>6 Cylinders (18)</span></div><div><i>✓</i><span>8 Cylinders (4)</span></div></div>';
  }

  function selectField(label, placeholder, icon) {
    return '<label class="cmp-form-field"><span>' + label + '</span><b>' + formIcon(icon) + '<em>' + placeholder + '</em></b>' +
      '<img class="cmp-form-chevron" src="images/cases/auto123-components/coded-assets/icons/form-arrow-down.svg" alt=""></label>';
  }

  function formShell(active, body) {
    return '<div class="cmp-form cmp-form--listing cmp-form--' + active + '"><div class="cmp-form-head"><h3>How do you want to list?</h3>' +
      '<div class="cmp-form-tabs"><span class="' + (active === 'vin' ? 'is-active' : '') + '">VIN</span>' +
      '<span class="' + (active === 'make' ? 'is-active' : '') + '">Make &amp; Model</span>' +
      '<span class="' + (active === 'plate' ? 'is-active' : '') + '">License Plate</span></div></div>' + body +
      '<div class="cmp-form-footer"><button type="button">List My Vehicle</button><p class="cmp-form-info">ⓘ We use official data sources to auto fill your car details</p></div></div>';
  }

  function formMarkup(index) {
    if (index === 0) {
      return '<div class="cmp-form cmp-form--search"><div class="cmp-form-head"><h3>Find Your Next Car</h3>' +
        '<div class="cmp-ai-search"><img src="images/cases/auto123-components/coded-assets/icons/form-sparks.svg" alt=""><b>Try</b><em>Red 2022 Honda Civic...</em><i><img src="images/cases/auto123-components/coded-assets/icons/form-search.svg" alt=""></i></div></div>' +
        '<div class="cmp-form-grid"><label class="cmp-form-field"><span>Condition</span><div class="cmp-condition"><b>All</b><b>New</b><b>Used</b></div></label>' +
        selectField('Brand','Select Car Brand...','brand') + selectField('Model','Select Model...','car') +
        selectField('Year','Select Year...','calendar') + selectField('Maximum Price','Select Price...','price') +
        selectField('Fuel Type','Select Fuel Type...','fuel') + '</div><button type="button">Show 798 Results <img src="images/cases/auto123-components/coded-assets/icons/form-arrow-right.svg" alt=""></button></div>';
    }
    if (index === 1) {
      return formShell('vin','<label class="cmp-form-field cmp-form-field--wide"><span>Vehicle Identification number</span><b>Input</b></label>');
    }
    if (index === 2) {
      return formShell('make','<div class="cmp-listing-fields">' + selectField('Make','Select Make...') + selectField('Model','Select model...') +
        '<div class="cmp-form-grid">' + selectField('Year','Select year...') + selectField('Trim','Select trim...') + '</div></div>');
    }
    return formShell('plate','<label class="cmp-form-field cmp-form-field--wide"><span>License Plate Number</span><b>Enter License plate number</b></label>');
  }

  function priceBars(active, detail) {
    var compact = [9.208,15.798,24.393,11.902,15.798,10.463,28.633,11.902,7.225,13.162,10.463,8.304,14.961,11.902,14.961,29.533,20.668,28.633,20.668,11.902,8.304,13.162,20.668,13.162,4.167,9.384,4.167,2.367];
    var expanded = [30.777,52.802,81.529,39.782,52.802,34.972,95.703,39.782,24.149,43.991,34.972,27.757,50.004,39.782,50.004,98.709,69.081,95.703,69.081,39.782,27.757,43.991,69.081,43.991,13.927,31.364,13.927,7.913];
    var heights = detail ? expanded : compact;
    return '<div class="cmp-price-bars">' + heights.map(function (height, i) {
      return '<i class="' + (i === active ? 'is-active' : '') + '" style="height:' + height + 'px"></i>';
    }).join('') + '</div><div class="cmp-price-axis"><span>€0k</span><span>€10k</span><span>€20k</span><span>€30k</span><span>€40k</span><span>€50k</span></div>';
  }

  function priceMarkup(index) {
    if (index === 0) {
      return '<div class="cmp-meter cmp-meter--detail"><div class="cmp-meter-summary"><div><span>Price</span><b>€18,365</b>' +
        '<p><s>€19,365</s><em>Save €10,000</em></p></div><div><strong>Good Price</strong><span>€2,589 Below Average</span></div></div>' + priceBars(9, true) + '</div>';
    }
    var states = [['great','Great Price',3],['good','Good Price',9],['high','High Price',25]][index - 1];
    return '<div class="cmp-meter cmp-meter--' + states[0] + '"><div class="cmp-meter-head"><b>' + states[1] + '</b><span>Average: &nbsp;€2,589</span></div>' +
      '<div class="cmp-meter-chart">' + priceBars(states[2]) + '</div></div>';
  }

  function messageMarkup(index) {
    var assetBase = 'images/cases/auto123-components/coded-assets/';
    var own = index % 2 === 0;
    var cls = 'cmp-message ' + (own ? 'is-own' : 'is-other');
    var body = '';
    if (index < 2) {
      body = '<div class="cmp-message-bubble">Mercedes-Benz E 500</div>';
    } else if (index < 4) {
      if (own) body = '<div class="cmp-message-bubble cmp-message-photo"><img src="' + assetBase + 'message-4.jpg" alt="Blue car"><span>Mercedes-Benz E 500</span></div>';
      else body = '<div class="cmp-message-bubble cmp-message-gallery"><div><img src="' + assetBase + 'message-4.jpg" alt=""><img src="' + assetBase + 'message-5.png" alt=""><img src="' + assetBase + 'message-2.png" alt=""><span><img src="' + assetBase + 'message-1.jpg" alt=""><b>+4</b></span></div><p>Mercedes-Benz E 500</p></div>';
    } else {
      body = '<div class="cmp-message-bubble cmp-message-file"><div><img src="images/cases/auto123-components/coded-assets/icons/document.svg" alt=""><span><b>Mercedes-Benz E 5...</b><small>3.1 mb</small></span><img src="images/cases/auto123-components/coded-assets/icons/download.svg" alt=""></div><p>Mercedes-Benz E 500</p></div>';
    }
    return '<div class="' + cls + '">' + body + '<small>10:09am' + (!own ? ' ✓' : '') + '</small></div>';
  }

  function componentMarkup(key, index) {
    if (key === 'navigation') return navMarkup(index);
    if (key === 'products') return productMarkup(index);
    if (key === 'filters') return filterMarkup(index);
    if (key === 'forms') return formMarkup(index);
    if (key === 'price') return priceMarkup(index);
    return messageMarkup(index);
  }

  function buildComponents(root) {
    var nav = $('.ds-widget-nav', root), panel = $('.ds-widget-panel', root);
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var components = {
      navigation: {
        label: 'Navigation', tone: 'soft', radius: 8,
        variants: [
          [656, 64], [390, 68], [390, 56]
        ]
      },
      products: {
        label: 'Product', tone: 'white', radius: 32,
        variants: [
          [350, 406.5], [656, 217], [280, 292]
        ]
      },
      filters: {
        label: 'Filters', tone: 'soft', radius: 16,
        variants: [
          [401, 100], [400, 340], [400, 372], [400, 152], [401, 184]
        ]
      },
      forms: {
        label: 'Forms', tone: 'soft', radius: 16,
        variants: [
          [400, 424.2], [400, 460.8], [400, 441.8], [400, 460.8]
        ]
      },
      price: {
        label: 'Price', tone: 'soft', radius: 16,
        variants: [
          [334, 242.709], [335, 115], [335, 115], [335, 115]
        ]
      },
      messages: {
        label: 'Messages', tone: 'white', radius: 16,
        variants: [
          [169, 60], [169, 60], [240, 271], [240, 296], [240, 118], [240, 118]
        ]
      }
    };

    var canvas = el('div', 'ds-component-canvas');
    var frame = el('div', 'ds-component-frame');
    var stage = el('div', 'ds-component-stage');
    var outline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var outlineRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    outline.classList.add('ds-component-outline');
    outline.setAttribute('aria-hidden', 'true');
    outline.setAttribute('preserveAspectRatio', 'none');
    outlineRect.setAttribute('pathLength', '100');
    outline.appendChild(outlineRect);
    frame.appendChild(stage);
    frame.appendChild(outline);
    canvas.appendChild(frame);
    panel.replaceChildren(canvas);

    var activeKey = 'navigation';
    var variantIndex = 0;
    var cycleTimer = 0;
    var swapTimer = 0;

    function renderVariant(animate) {
      var component = components[activeKey];
      var variant = component.variants[variantIndex];
      var swap = function () {
        stage.innerHTML = componentMarkup(activeKey, variantIndex);
        frame.setAttribute('aria-label', 'Auto123 ' + component.label + ' component, variant ' + (variantIndex + 1) + ' of ' + component.variants.length);
        frame.style.setProperty('--component-width', variant[0] + 'px');
        frame.style.setProperty('--component-height', variant[1] + 'px');
        frame.style.setProperty('--component-radius', component.radius + 'px');
        frame.dataset.tone = component.tone;
        requestAnimationFrame(function () { stage.classList.remove('is-switching'); });
      };

      window.clearTimeout(swapTimer);
      if (animate && !reducedMotion.matches) {
        stage.classList.add('is-switching');
        swapTimer = window.setTimeout(swap, 120);
      } else {
        swap();
      }
    }

    function startCycle() {
      window.clearInterval(cycleTimer);
      if (reducedMotion.matches) return;
      cycleTimer = window.setInterval(function () {
        variantIndex = (variantIndex + 1) % components[activeKey].variants.length;
        renderVariant(true);
      }, 1500);
    }

    function show(key) {
      if (!components[key]) return;
      activeKey = key;
      variantIndex = 0;
      $$('.ds-nav-item', nav).forEach(function (item) {
        item.setAttribute('aria-selected', String(item.dataset.tab === key));
      });
      renderVariant(false);
      startCycle();
    }

    $$('.ds-nav-item', nav).forEach(function (b) {
      b.addEventListener('click', function () { show(b.dataset.tab); });
    });
    frame.addEventListener('mouseenter', function () { window.clearInterval(cycleTimer); });
    frame.addEventListener('mouseleave', startCycle);
    reducedMotion.addEventListener('change', startCycle);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) window.clearInterval(cycleTimer);
      else startCycle();
    });
    show('navigation');
  }

  /* ── iOS component specimens ───────────────────────────────────── */
  function buildIosButtons(card) {
    if (!card) return;
    var button = $('.ios-demo-button', card), controls = $('.ds-ios-button-controls', card);
    var state = { size: 'Large', type: 'Primary', mode: 'Default', left: true, right: true, label: true };
    function optionGroup(label, key, values) {
      var group = el('div', 'ds-ios-control'); group.appendChild(el('span', '', label));
      var opts = el('div', 'ds-ios-options');
      values.forEach(function (value) {
        var b = el('button', '', value); b.type = 'button'; b.setAttribute('aria-selected', String(state[key] === value));
        b.addEventListener('click', function () { state[key] = value; draw(); }); opts.appendChild(b);
      }); group.appendChild(opts); controls.appendChild(group);
    }
    function toggleRow(label, key, value) {
      var row = el('div', 'ds-ios-toggle-row'); row.appendChild(el('span', '', label));
      if (value) row.appendChild(el('span', 'ds-ios-value', value));
      var sw = el('button', 'ds-switch'); sw.type = 'button'; sw.setAttribute('aria-label', 'Toggle ' + label); sw.setAttribute('aria-checked', String(state[key]));
      sw.addEventListener('click', function () { state[key] = !state[key]; draw(); }); row.appendChild(sw); controls.appendChild(row);
    }
    function draw() {
      button.className = 'ios-demo-button is-' + state.size.toLowerCase() + ' is-' + state.type.toLowerCase() + ' is-' + state.mode.toLowerCase();
      $('.is-left', button).closest('.ios-button-icon').hidden = !state.left;
      $('.is-right', button).closest('.ios-button-icon').hidden = !state.right;
      $('b', button).hidden = !state.label;
      var widths = state.type === 'Tertiary' ? { Large: '102px', Medium: '94px', Small: '88px' } : { Large: '142px', Medium: '126px', Small: '104px' };
      button.style.width = state.left && state.right && state.label ? widths[state.size] : 'auto';
      $$('.ds-ios-control', controls).forEach(function (group, i) {
        var value = [state.size, state.type, state.mode][i];
        $$('button', group).forEach(function (b) { b.setAttribute('aria-selected', String(b.textContent === value)); });
      });
      var switches = $$('.ds-switch', controls); [state.left,state.right,state.label].forEach(function (v,i) { switches[i].setAttribute('aria-checked', String(v)); });
      button.disabled = state.mode === 'Disabled';
    }
    optionGroup('Size', 'size', ['Large','Medium','Small']);
    optionGroup('Type', 'type', ['Primary','Secondary','Tertiary']);
    optionGroup('State', 'mode', ['Default','Pressed','Disabled']);
    toggleRow('Left Icon', 'left', 'Arrow_Left');
    toggleRow('Right Icon', 'right', 'Arrow_Right');
    toggleRow('Label', 'label', '“Button”');
    draw();
  }

  function buildIosAssetCycles() {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    $$('.ds-ios-asset-card[data-ios-light]').forEach(function (card) {
      var stage = $('.ds-ios-asset-stage', card), frame = $('.ds-ios-asset-frame', card), img = $('img', stage);
      var theme = 'light', paths = card.dataset.iosLight.split('|'), index = 0, timer = 0;
      function step() {
        index = (index + 1) % paths.length; img.style.opacity = '0';
        window.setTimeout(function () { img.src = paths[index]; img.style.opacity = '1'; }, 350);
      }
      function start() { window.clearInterval(timer); if (!reduced.matches && paths.length > 1) timer = window.setInterval(step, 1500); }
      frame.addEventListener('mouseenter', function () { window.clearInterval(timer); });
      frame.addEventListener('mouseleave', start);
      window.addEventListener('auto123-theme-change', function (event) {
        theme = event.detail.theme;
        paths = card.dataset[theme === 'dark' ? 'iosDark' : 'iosLight'].split('|');
        index = 0; window.clearInterval(timer); img.style.opacity = '0';
        window.setTimeout(function () { img.src = paths[0]; img.style.opacity = '1'; start(); }, 200);
      });
      document.addEventListener('visibilitychange', function () { if (document.hidden) window.clearInterval(timer); else start(); });
      start();
    });
    window.addEventListener('auto123-theme-change', function (event) {
      var root = document.getElementById('ios-components');
      if (root) root.classList.toggle('is-dark', event.detail.theme === 'dark');
    });
  }

  /* ── Carousel (Atoms, iOS components) ───────────────────────────── */
  function buildCarousel(root) {
    var track = $('.ds-track', root);
    var prev = $('.ds-arrow[data-dir="prev"]', root);
    var next = $('.ds-arrow[data-dir="next"]', root);
    var view = $('.ds-carousel', root);
    var idx = parseInt(root.dataset.initialCard || '0', 10);
    if (!Number.isFinite(idx)) idx = 0;

    function cards() { return $$('.ds-card', track); }
    function cardW() {
      var cs = cards();
      return cs.length ? cs[0].getBoundingClientRect().width : 0;
    }
    function gap() { return parseFloat(getComputedStyle(track).gap) || 0; }
    function step() { var w = cardW(); return w ? w + gap() : 0; }
    function maxT() { return Math.max(0, track.scrollWidth - view.clientWidth); }
    function maxIdx() {
      var s = step();
      return s ? Math.ceil(maxT() / s - 0.02) : 0;
    }
    function apply() {
      var s = step();
      // Width can read 0 before first layout — never latch the arrows off then,
      // because a disabled button swallows the click that would recover it.
      if (!s) return;
      var m = maxIdx();
      idx = Math.max(0, Math.min(idx, m));
      // Clamp the offset so the last step lands the track end on the viewport
      // edge — never scrolling into empty space past the final card.
      var t = Math.min(idx * s, maxT());
      track.style.transform = 'translateX(' + (-t) + 'px)';
      if (prev) {
        prev.disabled = false;
        prev.setAttribute('aria-disabled', String(idx <= 0));
      }
      if (next) {
        next.disabled = false;
        next.setAttribute('aria-disabled', String(idx >= m));
      }
    }
    if (prev) prev.addEventListener('click', function () { idx--; apply(); });
    if (next) next.addEventListener('click', function () { idx++; apply(); });

    // drag / swipe
    var down = false, sx = 0, moved = 0;
    function start(x) { down = true; sx = x; moved = 0; track.style.transition = 'none'; }
    function move(x) {
      if (!down) return;
      moved = x - sx;
      var cs = cards(); if (!cs.length) return;
      var st = cs[0].offsetWidth + gap();
      track.style.transform = 'translateX(' + (-idx * st + moved) + 'px)';
    }
    function end() {
      if (!down) return;
      down = false; track.style.transition = '';
      if (Math.abs(moved) > 60) idx += moved < 0 ? 1 : -1;
      apply();
    }
    view.addEventListener('mousedown', function (e) { start(e.clientX); e.preventDefault(); });
    window.addEventListener('mousemove', function (e) { move(e.clientX); });
    window.addEventListener('mouseup', end);
    view.addEventListener('touchstart', function (e) { start(e.touches[0].clientX); }, { passive: true });
    view.addEventListener('touchmove', function (e) { move(e.touches[0].clientX); }, { passive: true });
    view.addEventListener('touchend', end);

    view.setAttribute('tabindex', '0');
    view.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { idx++; apply(); e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { idx--; apply(); e.preventDefault(); }
    });

    // chips jump to a card
    var chipRow = root.querySelector('.ds-chips');
    if (chipRow) {
      $$('.ds-chip-btn', chipRow).forEach(function (c) {
        c.addEventListener('click', function () {
          var t = c.dataset.card;
          if (t == null) return;
          $$('.ds-chip-btn', chipRow).forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
          c.setAttribute('aria-selected', 'true');
          idx = parseInt(t, 10); apply();
        });
      });
    }
    window.addEventListener('resize', apply);
    window.addEventListener('load', apply);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(apply);
    if (window.ResizeObserver) new ResizeObserver(apply).observe(view);
    requestAnimationFrame(apply);
    apply();
  }

  /* ── Live component playgrounds (PLAY WITH ME) ──────────────────── */
  /* Iconoir glyphs exported from the Figma components (nodes 661:8824 arrow-left,
     664:9321 mail, 664:9323 eye). Path data is Figma's, recoloured to
     currentColor; arrow-right is the arrow mirrored, exactly as the design does it. */
  var SVG = function (inner, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
           'stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '>' + inner + '</svg>';
  };
  var ARROW_PATH = '<path d="M18.5 12H6M12 18L6 12L12 6"/>';
  var ICON_LEFT  = SVG(ARROW_PATH);
  var ICON_RIGHT = SVG('<g transform="translate(24,0) scale(-1,1)">' + ARROW_PATH + '</g>');
  var ICON_MAIL  = SVG('<path d="M7 9L12 12.5L17 9"/>' +
                       '<path d="M2 17V7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17Z" stroke-linecap="butt" stroke-linejoin="miter"/>');
  var ICON_EYE   = SVG('<path d="M3 13C6.6 5 17.4 5 21 13"/>' +
                       '<path d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"/>');

  function seg(label, opts, initial, onPick) {
    var box = el('div');
    box.appendChild(el('div', 'ds-ctrl-label', label));
    var row = el('div', 'ds-seg');
    opts.forEach(function (o) {
      var b = el('button', null, o);
      b.type = 'button';
      b.setAttribute('aria-selected', String(o === initial));
      b.addEventListener('click', function () {
        $$('button', row).forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        b.setAttribute('aria-selected', 'true');
        onPick(o);
      });
      row.appendChild(b);
    });
    box.appendChild(row);
    return box;
  }
  function switchRow(name, value, initial, onToggle) {
    var r = el('div', 'ds-ctrl-row');
    r.appendChild(el('span', 'n', name));
    var right = el('div');
    right.style.cssText = 'display:flex;align-items:center;gap:8px';
    if (value) right.appendChild(el('span', 'v', value));
    var sw = el('div', 'ds-switch');
    sw.setAttribute('role', 'switch');
    sw.setAttribute('tabindex', '0');
    sw.setAttribute('aria-checked', String(!!initial));
    sw.setAttribute('aria-label', name);
    function flip() {
      var on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', String(on));
      onToggle(on);
    }
    sw.addEventListener('click', flip);
    sw.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { flip(); e.preventDefault(); } });
    right.appendChild(sw);
    r.appendChild(right);
    return r;
  }

  var PLAYGROUNDS = {
    /* Button — 3 sizes x 3 types x 5 states = the full 45-variant matrix */
    buttons: function (preview, controls) {
      var st = { size: 'Large', type: 'Primary', state: 'Default', left: true, right: true, label: true };
      var btn = el('button', 'a-btn');
      btn.type = 'button';
      preview.appendChild(btn);
      function draw() {
        btn.className = 'a-comp a-btn a-btn--' + ({ Large: 'lg', Medium: 'md', Small: 'sm' })[st.size] +
                        ' a-btn--' + st.type.toLowerCase() + ' is-' + st.state.toLowerCase();
        btn.disabled = st.state === 'Disabled';
        btn.innerHTML = (st.left ? ICON_LEFT : '') +
                        (st.label ? '<span>Button</span>' : '') +
                        (st.right ? ICON_RIGHT : '');
      }
      controls.appendChild(seg('Size',  ['Large','Medium','Small'],                       st.size,  function (v) { st.size = v; draw(); }));
      controls.appendChild(seg('Type',  ['Primary','Secondary','Tertiary'],               st.type,  function (v) { st.type = v; draw(); }));
      controls.appendChild(seg('State', ['Default','Hover','Pressed','Focused','Disabled'], st.state, function (v) { st.state = v; draw(); }));
      controls.appendChild(switchRow('Left Icon',  'Arrow_left',  st.left,  function (v) { st.left = v; draw(); }));
      controls.appendChild(switchRow('Right Icon', 'Arrow_Right', st.right, function (v) { st.right = v; draw(); }));
      controls.appendChild(switchRow('Label',      '"Button"',    st.label, function (v) { st.label = v; draw(); }));
      draw();
    },

    /* Text Box — 6 states, values from component set 664:9317 */
    textbox: function (preview, controls) {
      var st = { state: 'Default', label: true, left: true, right: true, helper: true };
      var f = el('div', 'a-comp a-field');
      preview.appendChild(f);
      function draw() {
        f.className = 'a-comp a-field is-' + st.state.toLowerCase();
        f.innerHTML = '';
        if (st.label) f.appendChild(el('label', 'a-field-label', 'Label'));
        var w = el('div', 'a-input-wrap');
        if (st.left) w.insertAdjacentHTML('beforeend', ICON_MAIL);
        var i = el('input');
        i.type = 'text'; i.placeholder = 'Input';
        if (st.state === 'Filled') i.value = 'Input';
        i.disabled = st.state === 'Disabled';
        w.appendChild(i);
        if (st.right) w.insertAdjacentHTML('beforeend', ICON_EYE);
        f.appendChild(w);
        if (st.helper) f.appendChild(el('p', 'a-help', 'Helper text'));
      }
      controls.appendChild(seg('State', ['Default','Hover','Active','Filled','Error','Disabled'], st.state, function (v) { st.state = v; draw(); }));
      controls.appendChild(switchRow('Label',      '"Label"',      st.label,  function (v) { st.label = v; draw(); }));
      controls.appendChild(switchRow('Left Icon',  'Email',        st.left,   function (v) { st.left = v; draw(); }));
      controls.appendChild(switchRow('Right Icon', 'Eye_Visible',  st.right,  function (v) { st.right = v; draw(); }));
      controls.appendChild(switchRow('Helper',     '"Helper"',     st.helper, function (v) { st.helper = v; draw(); }));
      draw();
    },

    /* Text Area — same 6 states, with the word counter */
    textarea: function (preview, controls) {
      var st = { state: 'Default', label: true, count: true };
      var f = el('div', 'a-comp a-field');
      preview.appendChild(f);
      function draw() {
        f.className = 'a-comp a-field is-' + st.state.toLowerCase();
        f.innerHTML = '';
        if (st.label) f.appendChild(el('label', 'a-field-label', 'Label'));
        var w = el('div', 'a-input-wrap a-textarea-wrap');
        var t = el('textarea');
        t.placeholder = 'Input';
        if (st.state === 'Filled') t.value = 'Input';
        t.disabled = st.state === 'Disabled';
        w.appendChild(t);
        f.appendChild(w);
        if (st.count) {
          var c = el('p', 'a-count', '20 words');
          t.addEventListener('input', function () {
            c.textContent = (t.value.trim() ? t.value.trim().split(/\s+/).length : 0) + ' words';
          });
          f.appendChild(c);
        }
      }
      controls.appendChild(seg('State', ['Default','Hover','Active','Filled','Error','Disabled'], st.state, function (v) { st.state = v; draw(); }));
      controls.appendChild(switchRow('Label',      '"Label"',  st.label, function (v) { st.label = v; draw(); }));
      controls.appendChild(switchRow('Word Count', '20 words', st.count, function (v) { st.count = v; draw(); }));
      draw();
    },

    /* Range — TWO handles (Figma 666:9906: Left / Middle / Full range) */
    range: function (preview, controls) {
      var MIN = 0, MAX = 900;
      var st = { lo: 225, hi: 675 };
      var wrap = el('div', 'a-comp a-range-comp');
      var track = el('div', 'a-track');
      var fill  = el('div', 'a-track-fill');
      var tLo = el('div', 'a-thumb'), tHi = el('div', 'a-thumb');
      var bLo = el('div', 'a-bubble'), bHi = el('div', 'a-bubble');
      track.appendChild(fill); track.appendChild(tLo); track.appendChild(tHi);
      track.appendChild(bLo); track.appendChild(bHi);
      var scale = el('div', 'a-scale');
      scale.appendChild(el('span', null, '€0k')); scale.appendChild(el('span', null, '€900k'));
      var pair = el('div', 'a-range-pair');
      function field(val) {
        var f = el('div', 'a-field'), w = el('div', 'a-input-wrap'), i = el('input');
        i.value = val; w.appendChild(i); f.appendChild(w); f._input = i; return f;
      }
      var fLo = field('€225k'), fHi = field('€675k');
      pair.appendChild(fLo); pair.appendChild(el('div', 'a-range-minus')); pair.appendChild(fHi);
      wrap.appendChild(track); wrap.appendChild(scale); wrap.appendChild(pair);
      preview.appendChild(wrap);

      function pct(v) { return (v - MIN) / (MAX - MIN) * 100; }
      function draw() {
        fill.style.left = pct(st.lo) + '%';
        fill.style.width = (pct(st.hi) - pct(st.lo)) + '%';
        tLo.style.left = pct(st.lo) + '%';
        tHi.style.left = pct(st.hi) + '%';
        bLo.style.left = pct(st.lo) + '%'; bLo.textContent = '€' + st.lo + 'k';
        bHi.style.left = pct(st.hi) + '%'; bHi.textContent = '€' + st.hi + 'k';
        fLo._input.value = '€' + st.lo + 'k';
        fHi._input.value = '€' + st.hi + 'k';
      }
      function drag(thumb, key) {
        function move(clientX) {
          var r = track.getBoundingClientRect();
          if (!r.width) return;
          var v = Math.round(MIN + (clientX - r.left) / r.width * (MAX - MIN));
          v = Math.max(MIN, Math.min(MAX, v));
          if (key === 'lo') st.lo = Math.min(v, st.hi); else st.hi = Math.max(v, st.lo);
          draw();
        }
        thumb.addEventListener('pointerdown', function (e) {
          thumb.setPointerCapture(e.pointerId); e.preventDefault();
          var on = function (ev) { move(ev.clientX); };
          var off = function () { thumb.removeEventListener('pointermove', on); thumb.removeEventListener('pointerup', off); };
          thumb.addEventListener('pointermove', on); thumb.addEventListener('pointerup', off);
        });
      }
      drag(tLo, 'lo'); drag(tHi, 'hi');
      draw();
      controls.appendChild(seg('Position', ['Left','Middle','Full range'], 'Middle', function (v) {
        if (v === 'Left')  { st.lo = 0;   st.hi = 15;  }
        if (v === 'Middle'){ st.lo = 225; st.hi = 675; }
        if (v === 'Full range') { st.lo = 0; st.hi = 900; }
        draw();
      }));
    },

    /* Slider — single handle (Figma 666:10200: Left / Middle / Right) */
    slider: function (preview, controls) {
      var MIN = 0, MAX = 200, st = { v: 0 };
      var wrap = el('div', 'a-comp a-range-comp');
      var track = el('div', 'a-track');
      var fill = el('div', 'a-track-fill');
      var thumb = el('div', 'a-thumb'), bub = el('div', 'a-bubble');
      track.appendChild(fill); track.appendChild(thumb); track.appendChild(bub);
      var scale = el('div', 'a-scale');
      scale.appendChild(el('span', null, '0km')); scale.appendChild(el('span', null, '200km'));
      wrap.appendChild(track); wrap.appendChild(scale);
      preview.appendChild(wrap);
      function draw() {
        var p = (st.v - MIN) / (MAX - MIN) * 100;
        fill.style.left = '0%'; fill.style.width = p + '%';
        thumb.style.left = p + '%';
        bub.style.left = p + '%'; bub.textContent = st.v + 'km';
      }
      thumb.addEventListener('pointerdown', function (e) {
        thumb.setPointerCapture(e.pointerId); e.preventDefault();
        var on = function (ev) {
          var r = track.getBoundingClientRect(); if (!r.width) return;
          st.v = Math.max(MIN, Math.min(MAX, Math.round(MIN + (ev.clientX - r.left) / r.width * (MAX - MIN))));
          draw();
        };
        var off = function () { thumb.removeEventListener('pointermove', on); thumb.removeEventListener('pointerup', off); };
        thumb.addEventListener('pointermove', on); thumb.addEventListener('pointerup', off);
      });
      draw();
      controls.appendChild(seg('Position', ['Left','Middle','Right'], 'Left', function (v) {
        st.v = v === 'Left' ? 0 : v === 'Middle' ? 100 : 200; draw();
      }));
    }
  };

  function buildPlaygrounds() {
    $$('.ds-card[data-play]').forEach(function (card) {
      var fn = PLAYGROUNDS[card.dataset.play];
      if (!fn) return;
      fn($('.ds-preview', card), $('.ds-controls', card));
    });
  }

  /* ── Boot ───────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var sg = document.getElementById('styleguide');   if (sg) buildStyleGuide(sg);
    var tk = document.getElementById('tokens-widget'); if (tk) buildTokens(tk);
    var cp = document.getElementById('components-widget'); if (cp) buildComponents(cp);
    buildPlaygrounds();
    buildIosButtons(document.getElementById('ios-buttons-card'));
    buildIosAssetCycles();
    $$('.ds-carousel-root').forEach(buildCarousel);

    // Hero marquee: clone the card set once so translating by 50% loops seamlessly.
    $$('[data-marquee]').forEach(function (track) {
      var set = track.firstElementChild;
      if (!set) return;
      var clone = set.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('img').forEach(function (i) { i.alt = ''; });
      track.appendChild(clone);
    });

    // App Examples: play each clip only while it is on screen.
    var vids = $$('.ds-app-row video');
    if (vids.length && 'IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var v = e.target;
          if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          else v.pause();
        });
      }, { threshold: 0.35 });
      vids.forEach(function (v) { vio.observe(v); });
    }
  });
})();
