// Calcule l'empreinte d'un nouveau code secret, à recopier dans js/jeu.js
// (EMPREINTE_CLE).   node outils/cle.mjs moncode
const code = (process.argv[2] || '').trim().toLowerCase();
if (!code) { console.error('usage : node outils/cle.mjs moncode'); process.exit(1); }
let x = 2166136261;
for (const o of new TextEncoder().encode(code)) x = Math.imul(x ^ o, 16777619) >>> 0;
console.log(x);
