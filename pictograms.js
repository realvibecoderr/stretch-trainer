/*
 * Piktogramme als Strichfiguren. viewBox 0 0 200 200, Boden bei y = 180.
 * Elemente werden in Reihenfolge gezeichnet (hinten zuerst):
 *   ['f', x,y, x,y, ...]  Gliedmaße vorne (weiß)
 *   ['b', x,y, x,y, ...]  Gliedmaße hinten (grau)
 *   ['h', x, y]           Kopf
 *   ['g']                 Boden
 *   ['wall', x]           Wand
 *   ['box', x, y, w, h]   Box
 *   ['towel', x,y, ...]   Handtuch
 *   ['mat', x, y, w, h]   Matte (Draufsicht)
 *   ['arrow', x1,y1,x2,y2] Richtungspfeil
 */
(function () {
  const FG = '#ffffff';
  const BACK = '#8c8c8c';
  const PROP = '#3a3a3a';
  const BG = '#000000';
  const W = 7;        // Strichstärke
  const GAP = 14;     // Trennkante
  const HEAD_R = 11;

  const FIGURES = {
    toeTouch: [
      ['g'],
      ['b', 122, 124, 116, 152, 110, 178],
      ['f', 102, 180, 80, 180, 80, 100],
      ['f', 80, 100, 122, 124],
      ['h', 136, 133],
      ['f', 122, 124, 112, 152, 102, 178]
    ],
    quad: [
      ['g'],
      ['b', 100, 100, 94, 140, 72, 106],
      ['b', 100, 58, 84, 82, 72, 104],
      ['f', 116, 180, 100, 180, 100, 100],
      ['f', 100, 100, 100, 54],
      ['h', 100, 38],
      ['f', 100, 58, 124, 70, 148, 64]
    ],
    calf: [
      ['g'],
      ['wall', 154],
      ['b', 108, 104, 95, 141, 82, 178, 98, 180],
      ['b', 122, 60, 136, 82, 148, 60],
      ['f', 108, 104, 122, 58],
      ['f', 108, 104, 126, 138, 130, 178, 148, 160],
      ['h', 127, 42],
      ['f', 122, 60, 138, 84, 148, 64]
    ],
    adductor: [
      ['g'],
      ['b', 90, 140, 80, 180, 46, 178],
      ['f', 90, 140, 130, 159, 170, 178, 172, 164],
      ['f', 90, 140, 90, 96],
      ['f', 76, 96, 104, 96],
      ['h', 90, 78],
      ['f', 76, 96, 66, 118, 84, 138],
      ['f', 104, 96, 114, 118, 96, 138]
    ],
    hipFlexor: [
      ['g'],
      ['b', 106, 142, 90, 180, 52, 180],
      ['f', 106, 142, 104, 94],
      ['h', 103, 78],
      ['f', 106, 142, 144, 140, 144, 180, 160, 180],
      ['f', 104, 98, 122, 118, 142, 132]
    ],
    cobra: [
      ['g'],
      ['b', 128, 134, 124, 158, 128, 180],
      ['f', 24, 176, 30, 180, 68, 180, 106, 178],
      ['f', 106, 178, 128, 132],
      ['h', 136, 117],
      ['f', 128, 134, 134, 158, 138, 180]
    ],
    rotation: [
      ['mat', 18, 34, 172, 132],
      ['f', 60, 48, 60, 152],
      ['f', 60, 100, 184, 100],
      ['f', 108, 100, 132, 134, 152, 104],
      ['h', 42, 100]
    ],
    lat: [
      ['g'],
      ['box', 150, 140, 36, 46],
      ['f', 34, 180, 72, 180, 78, 140],
      ['b', 126, 146, 152, 136, 144, 112],
      ['f', 78, 140, 126, 148],
      ['h', 138, 156],
      ['f', 126, 146, 154, 136, 146, 112]
    ],
    chest: [
      ['g'],
      ['towel', 60, 110, 140, 110],
      ['f', 100, 104, 90, 180],
      ['f', 100, 104, 110, 180],
      ['f', 100, 104, 100, 60],
      ['f', 86, 60, 114, 60],
      ['h', 100, 42],
      ['f', 86, 60, 72, 84, 62, 108],
      ['f', 114, 60, 128, 84, 138, 108]
    ],
    shoulder: [
      ['g'],
      ['f', 100, 104, 90, 180],
      ['f', 100, 104, 110, 180],
      ['f', 100, 104, 100, 60],
      ['f', 86, 60, 114, 60],
      ['h', 100, 42],
      ['f', 114, 60, 60, 70],
      ['f', 86, 60, 80, 86, 100, 62]
    ],
    neckSide: [
      ['g'],
      ['b', 86, 60, 74, 86, 98, 98],
      ['f', 100, 104, 90, 180],
      ['f', 100, 104, 110, 180],
      ['f', 100, 104, 100, 60],
      ['f', 86, 60, 114, 60],
      ['h', 115, 46],
      ['f', 114, 60, 136, 40, 106, 32]
    ],
    neckBack: [
      ['g'],
      ['arrow', 100, 4, 100, 22],
      ['f', 100, 104, 90, 180],
      ['f', 100, 104, 110, 180],
      ['f', 100, 104, 100, 60],
      ['f', 86, 60, 114, 60],
      ['f', 86, 60, 66, 42, 96, 32],
      ['f', 114, 60, 134, 42, 104, 32],
      ['h', 100, 54]
    ]
  };

  const pts = (a) => {
    const out = [];
    for (let i = 0; i < a.length; i += 2) out.push(a[i] + ',' + a[i + 1]);
    return out.join(' ');
  };

  function limb(points, color) {
    const p = pts(points);
    return (
      `<polyline points="${p}" fill="none" stroke="${BG}" stroke-width="${GAP}" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="2"/>` +
      `<polyline points="${p}" fill="none" stroke="${color}" stroke-width="${W}" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="2"/>`
    );
  }

  function render(key) {
    const items = FIGURES[key] || [];
    let body = '';
    for (const it of items) {
      const [t, ...a] = it;
      if (t === 'f') body += limb(a, FG);
      else if (t === 'b') body += limb(a, BACK);
      else if (t === 'h') {
        body += `<circle cx="${a[0]}" cy="${a[1]}" r="${HEAD_R + 3}" fill="${BG}"/>`;
        body += `<circle cx="${a[0]}" cy="${a[1]}" r="${HEAD_R}" fill="${FG}"/>`;
      } else if (t === 'g') {
        body += `<line x1="12" y1="190" x2="188" y2="190" stroke="${PROP}" stroke-width="2"/>`;
      } else if (t === 'wall') {
        body += `<line x1="${a[0]}" y1="40" x2="${a[0]}" y2="190" stroke="${PROP}" stroke-width="6"/>`;
      } else if (t === 'box') {
        body += `<rect x="${a[0]}" y="${a[1]}" width="${a[2]}" height="${a[3]}" fill="${PROP}"/>`;
      } else if (t === 'towel') {
        body += `<polyline points="${pts(a)}" fill="none" stroke="${BACK}" stroke-width="5"/>`;
      } else if (t === 'arrow') {
        const [x1, y1, x2, y2] = a;
        const ang = Math.atan2(y2 - y1, x2 - x1);
        const h = 7;
        const p1 = [x2 - h * Math.cos(ang - Math.PI / 4), y2 - h * Math.sin(ang - Math.PI / 4)];
        const p2 = [x2 - h * Math.cos(ang + Math.PI / 4), y2 - h * Math.sin(ang + Math.PI / 4)];
        body += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${BACK}" stroke-width="3"/>`;
        body += `<polyline points="${p1.join(',')} ${x2},${y2} ${p2.join(',')}" fill="none" stroke="${BACK}" stroke-width="3"/>`;
      } else if (t === 'mat') {
        body += `<rect x="${a[0]}" y="${a[1]}" width="${a[2]}" height="${a[3]}" fill="none" stroke="#262626" stroke-width="2"/>`;
      }
    }
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${body}</svg>`;
  }

  window.Pictograms = { render, keys: Object.keys(FIGURES) };
})();
