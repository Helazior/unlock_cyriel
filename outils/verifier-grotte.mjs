// Vérifie que la grotte est jouable : le départ est libre, la sortie et
// tous les moustiques sont atteignables. À lancer après avoir modifié
// js/etapes/grotte.js :   node outils/verifier-grotte.mjs
// Ajouter « carte » pour afficher un plan en caractères.

import { creerGrotte, MONDE, DEPART, SORTIE, CHIFFRE, MOUSTIQUES } from '../js/etapes/grotte.js';

const g = creerGrotte();
const PAS = 4;
const cols = Math.ceil(MONDE.l / PAS);
const rangs = Math.ceil(MONDE.h / PAS);
const vu = new Uint8Array(cols * rangs);
const file = [];
const libre = (i, j) => i >= 0 && j >= 0 && i < cols && j < rangs && !g.bloque(i * PAS, j * PAS);

const d0 = [Math.round(DEPART.x / PAS), Math.round(DEPART.y / PAS)];
let ok = true;
if (!libre(d0[0], d0[1])) { console.log('✗ le départ est dans la roche'); ok = false; }
vu[d0[1] * cols + d0[0]] = 1;
file.push(d0);
while (file.length) {
  const [i, j] = file.pop();
  for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const x = i + a, y = j + b;
    if (libre(x, y) && !vu[y * cols + x]) { vu[y * cols + x] = 1; file.push([x, y]); }
  }
}
const atteint = (x, y) => vu[Math.round(y / PAS) * cols + Math.round(x / PAS)] === 1;

const points = [['sortie', SORTIE], ['chiffre', { x: CHIFFRE.x + CHIFFRE.l / 2, y: CHIFFRE.y + CHIFFRE.h / 2 }],
  ...MOUSTIQUES.map((m, i) => ['moustique ' + (i + 1), m])];
for (const [nom, p] of points) {
  const bon = atteint(p.x, p.y);
  if (!bon) ok = false;
  console.log((bon ? '✓ ' : '✗ ') + nom + ` (${p.x}, ${p.y})` + (bon ? '' : ' — inaccessible, valeur ' + g.valeur(p.x, p.y).toFixed(1)));
}

if (process.argv.includes('carte')) {
  const C = 20;
  for (let y = C / 2; y < MONDE.h; y += C * 2) {
    let ligne = '';
    for (let x = C / 2; x < MONDE.l; x += C) {
      const m = points.find(([, p]) => Math.abs(p.x - x) <= C / 2 && Math.abs(p.y - y) <= C);
      if (Math.abs(DEPART.x - x) <= C / 2 && Math.abs(DEPART.y - y) <= C) ligne += 'D';
      else if (m) ligne += m[0][0] === 's' ? 'S' : m[0][0] === 'c' ? '4' : 'm';
      else ligne += g.solide(x, y) ? '#' : atteint(x, y) ? ' ' : g.bloque(x, y) ? '.' : '?';
    }
    console.log(ligne);
  }
}
console.log(ok ? '\nGrotte jouable.' : '\nGrotte à corriger.');
process.exit(ok ? 0 : 1);
