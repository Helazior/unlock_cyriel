# unlock_cyriel

Un petit jeu à étapes, dans une seule page web, sans dépendance ni compilation.

## Essayer en local

Le jeu utilise des modules JavaScript : il faut le servir en HTTP (ouvrir
`index.html` directement depuis le disque ne marche pas).

```sh
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Paramètres d'adresse

| Adresse | Effet |
| --- | --- |
| `?etape=2` | démarre directement à l'étape 2 (et s'en souvient) |
| `?etape=1` | repart du début |
| `?etape=2&debug=carte` | étape 2 avec toute la grotte révélée, pour vérifier le plan |

La progression est gardée dans le navigateur ; l'adresse suit aussi l'étape en
cours, donc `?etape=N` suffit pour reprendre sur un autre appareil.

## Organisation

```
index.html            la page unique
style.css             styles communs et styles de chaque étape
js/jeu.js             chef d'orchestre : enchaîne les étapes, sauvegarde, son
js/son.js             ambiance par étape (fondu enchaîné) et bruitages
js/fx.js              particules plein écran : cœurs, chauves-souris, étincelles
js/dessin.js          dessins partagés (cœur, chauve-souris)
js/etapes/etape1.js   étape 1 — les deux boutons
js/etapes/etape2.js   étape 2 — la grotte en écholocation
js/etapes/etape3.js   étape 3 — peindre le mammouth et la femme sur la paroi
js/etapes/grotte.js   plan de la grotte : salles, galeries, obstacles, objets
js/etapes/peintures.js  peintures des parois, dessinées en code
js/etapes/a-venir.js  écran provisoire après la dernière étape codée
outils/               scripts de vérification
polices/              police DynaPuff (licence libre OFL, voir le fichier joint)
sons/                 musiques d'ambiance, à déposer (voir sons/LISEZMOI.md)
```

### Ajouter une étape

1. Créer `js/etapes/etapeN.js` sur le modèle des autres : un objet avec `fond`
   (`'clair'` ou `'sombre'`), `ambiance` (fichier son ou `null`) et
   `demarrer(contexte)`, qui renvoie une fonction de nettoyage.
2. L'ajouter à la liste `ETAPES` de `js/jeu.js`, avant `aVenir`.

### Modifier la grotte

Tout le plan est dans `js/etapes/grotte.js` (salles, galeries, stalactites,
moustiques, position du chiffre). Après une modification :

```sh
node outils/verifier-grotte.mjs carte
```

Le script vérifie que la sortie, le chiffre et tous les moustiques restent
atteignables, et affiche un plan en caractères.

## Mise en ligne

Tous les chemins sont relatifs : le dossier peut être servi tel quel depuis
n'importe quel sous-dossier d'un site statique. La page demande aux moteurs de
recherche de ne pas l'indexer.
