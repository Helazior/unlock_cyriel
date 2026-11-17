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
| `?etape=4&debug=vite` | le marais, avec tout 4 fois plus rapide (pour les essais) |
| `?etape=5` | la course jusqu'au café |
| `?etape=6&debug=vite` | le café, avec tout 4 fois plus rapide |

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
js/etapes/etape4.js   étape 4 — le marais : cinq papillons en même temps, chaque ponte suivie dans une loupe
js/etapes/etape-course.js  étape 5 — la course (lance course.js)
js/etapes/course.js   la petite course jusqu'au café : un toucher d'un pied = un pas
js/etapes/marais-dessins.js  dessins du marais, des plantes, chenilles, papillons, fourmis et de la loupe
js/etapes/cafe.js     étape 6 — le café de Cyriel (textes, recettes, commandes, étals et prix en tête de fichier)
js/etapes/cafe-dessins.js  dessins de la salle du café et de la place du marché (en isométrique) et des personnages
js/etapes/clins-doeil.js  Cyriel et Clément dessinés d'après photos, en clins d'œil dans la grotte, le marais, le café et le marché
js/code.js            le code à 4 chiffres, utilisé par les étapes 2, 3 et 5
js/chiffres.js        chiffres tracés au néon (celui de la grotte)
js/etapes/grotte.js   plan de la grotte : salles, galeries, obstacles, objets
js/etapes/peintures.js  peintures des parois, dessinées en code
js/etapes/a-venir.js  écran provisoire, pour une étape pas encore codée (inutilisé)
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

Dans le passage qui mène aux spéléos, des stalactites et des pierres se
décrochent du plafond, chacune à son rythme, après avoir tremblé (avec un petit
craquement). La chauve-souris a 1 cœur au départ, gagne 1 cœur par moustique
gobé (3 au plus) et en perd 1 par pierre reçue ; à zéro, elle repart du début
du passage. Colonnes, rythmes et cœurs : `CHUTES`, `COEURS` et `REPRISE` en
tête de `js/etapes/etape2.js`.

Le casse-tête de la fin : trois boules d'argile bouchent la galerie de la
sortie. En touchant une boule, la chauve-souris s'en retrouve enrobée (elle ne
peut pas la lâcher) et devient trop large pour passer par le trou qu'elle vient
d'ouvrir. La solution : se faire toucher par une pierre du passage précédent,
ce qui fait éclater l'argile sans coûter de cœur. Aucune indication n'est
donnée. Taille et place du bouchon : `ARGILE`, en tête de `js/etapes/etape2.js`.

## Mise en ligne

Tous les chemins sont relatifs : le dossier peut être servi tel quel depuis
n'importe quel sous-dossier d'un site statique. La page demande aux moteurs de
recherche de ne pas l'indexer.

### Le marais (étape 4)

En deux temps. D'abord, cinq femelles arrivent coup sur coup (une toutes les
3,5 secondes) et il faut toutes les placer. On touche une femelle et on dit qui elle est
(« Quel est ce papillon ? », trois noms au choix ; son nom reste ensuite
écrit sous elle), puis on touche sa plante hôte (elle la goûte en
tambourinant avec ses pattes). Quand toutes ont pondu, les plantes sont remplacées
une à une par des loupes où se jouent les petits jeux des espèces, tous en
même temps, chacun avec ses bulles de dialogue.
Une loupe qui a besoin de Cyriel brille ; la toucher l'agrandit sur place.
Une femelle qu'on fait trop attendre, ou un danger laissé trop longtemps
(mésange, crue, fourmis : la loupe clignote en rouge), coûte une vie (5 vies) ;
à zéro, l'étape recommence. Les durées sont dans `REGLES`, en tête de
`js/etapes/etape4.js`.

| Papillon | Plante | Le petit jeu |
| --- | --- | --- |
| Paon du jour | grande ortie | nourrir la colonie dans sa toile ; ouvrir les ailes (ocelles) face à une mésange |
| Aurore | alliaire (la cardamine porte déjà un œuf orange) | retrouver la chenille allongée contre une silique ; la chrysalide passe l'hiver |
| Cuivré des marais | patience d'eau | « fenêtres » dans la feuille ; grimper au-dessus de la crue d'hiver |
| Azuré des mouillères | gentiane pneumonanthe | choisir la fourmi qui l'adopte (Myrmica) ; réclamer à manger dans le nid |
| Machaon | carotte sauvage | la chenille déguisée en fiente ; sortir les cornes orange face aux fourmis |

Chaque papillon ajoute une page au carnet de terrain (bouton en haut à
gauche). Les textes et les faits sont en tête de `js/etapes/etape4.js`
(`TEXTES` et `ESPECES`). Le machaon doit rester le dernier : il porte le
4e chiffre.

Sources des faits naturalistes :

- Paon du jour : [Wikipédia (en)](https://en.wikipedia.org/wiki/Aglais_io) ;
  [SHNA, Atlas des papillons de Bourgogne](https://shna-ofab.fr/fichiers/bnhs13-cahiers-ld-p322-323-paon-du-jour_1449566332.pdf)
  (chenilles grégaires dans une toile de soie, hivernage en grotte).
- Aurore : [SHNA](https://ressources.shna-ofab.fr/fichiers/bnhs13-cahiers-ld-p192-193-aurore_1455631211.pdf)
  (alliaire et cardamine, œuf qui vire à l'orange, chenilles cannibales,
  chrysalide qui hiverne) ; [Wikipédia (en)](https://en.wikipedia.org/wiki/Anthocharis_cardamines)
  (la femelle évite les fleurs déjà pondues) ;
  [British insects, DELTA](https://www.delta-intkey.com/britin/pap/www/anthocha.htm)
  (la chenille ressemble aux siliques).
- Cuivré des marais : [SHNA](https://ressources.shna-ofab.fr/fichiers/bnhs13-cahiers-ld-p202-203-cuivre-des-marais_1455722517.pdf)
  (patiences, protection nationale) ; [Naturalis, Butterflies of Europe](https://butterflies-europe.linnaeus.naturalis.nl/linnaeus_ng/app/views/species/taxon.php?id=114623)
  (fenêtres dans les feuilles, hivernage au pied de la plante) ;
  [Université de Birmingham](https://research.birmingham.ac.uk/en/publications/the-effects-of-flooding-on-survivorship-in-overwintering-larvae-o)
  (survie aux crues, chenilles qui grimpent au sec).
- Azuré des mouillères : [Département des Côtes-d'Armor](https://cotesdarmor.fr/sites/default/files/2020-12/AzureDesMouilleresCapErquy.pdf)
  (comptage des œufs, Myrmica scabrinodis) et [synthèse Trame verte et bleue](https://trameverteetbleue.fr/sites/default/files/syntheses-bibliographiques-especes/131219_azure_des_mouilleres_sept2012.pdf)
  (gentiane pneumonanthe, environ 10 mois dans le nid, protection) ;
  [Wikipédia (en)](https://en.wikipedia.org/wiki/Phengaris_alcon)
  (œufs blancs, femelle brune poudrée de bleu, mimétisme chimique, trophallaxie).
- Machaon : [Wikipédia (en)](https://en.wikipedia.org/wiki/Papilio_machaon)
  (ombellifères, jeune chenille en fiente, osmeterium) ;
  [Scientific Reports 2023](https://www.nature.com/articles/s41598-023-33390-x)
  (l'osmeterium repousse les fourmis, moins efficace contre les vertébrés).
- Les femelles goûtent avec leurs pattes : [Nature Communications 2011](https://www.nature.com/articles/ncomms1548).

### Modifier le café

En tête de `js/etapes/cafe.js` :

- `TEXTES` : tout ce qui s'affiche, dont les commandes des clients
  (`TEXTES.commandes`) et les pseudos des joueurs du marché (`TEXTES.joueurs`) ;
- `RECETTES` : ingrédients, gestes au fourneau et temps de cuisson, en vraies
  minutes comme dans le jeu d'origine (le bouton 60x les fait passer en autant
  de secondes) ;
- `CLIENTS` : la table, la recette et l'exigence de chaque client
  (`plus` : en plus de la recette, `sans` : à ne pas mettre) ;
- `ETALS` et `PRIX` : ce que vend chaque étal du marché, et à quel prix ;
  `PIECES_DEPART` (30) : les pièces au départ. Les courses des trois premières
  commandes coûtent 24 pièces, et chaque client content en laisse 10. À zéro,
  on ne peut plus rien acheter ; si elle ne peut vraiment plus finir les
  commandes, Pipistrelle propose de recommencer la partie (sans repasser par la
  connexion).
- `TEXTES.fete` : la fin, où le gâteau du machaon est pour elle ; `age` donne
  les bougies en chiffres.
- `TEXTES.joueuse` : le nom dans le bandeau du haut ; `TEXTES.niveau` : le
  niveau dans la tasse (23, puis 24 quand elle souffle ses bougies) et la barre
  d'expérience, qui monte à chaque client servi ; `TEXTES.chat` : le Café chat ;
  `TEXTES.hud` : les menus, dont ce que répond Pipistrelle quand on touche un
  bouton du décor (carte, réglages, porte, cadeau, toques…).
- `SONS` : les sons de fond (le piano de la salle, les oiseaux et la fontaine du
  marché) et leur volume.

L'écran de connexion est l'image `images/connexion-cafe.webp`, affichée en
entier (floutée autour si l'écran n'a pas la même forme). Les vrais champs et
boutons sont posés par-dessus, transparents, exactement sur ceux du dessin :
leurs positions sont en % de l'image dans `style.css` (section « Écran de
connexion »). Pour changer d'image, garder la même mise en page ou reprendre
ces pourcentages. L'écran apparaît comme sur une vieille connexion :
« Connexion au serveur… », puis l'image qui se dessine ligne par ligne, avec
deux arrêts juste avant « GoodCyriel » et « Café » ; le pseudo se remplit tout
seul. Les fois suivantes, c'est trois fois plus rapide. « Mot de passe
oublié ? » donne l'indice ; « Jouer maintenant ! » ramène au mot de passe.

L'écran du restaurant reprend la maquette de Clément (912 × 1724) : les menus
sont découpés dedans (`images/hud/`) et posés aux mêmes places, à l'échelle de
l'écran ; la salle se cadre dans l'espace libre entre eux. Les positions des
boutons et des textes sont en pixels de la maquette (`HUD` et `ZONES`, dans
`js/etapes/cafe.js`). En haut : le niveau, l'expérience, les pièces, le nom,
et les icônes (la note coupe le son, « ? » fait répéter Pipistrelle, le cadre
passe en plein écran). En bas à gauche, le Café chat : Pipistrelle y parle, ses
questions s'y affichent en boutons, et Cyriel peut y écrire. En bas à droite :
le livre de recettes, le fouet (touche le bon fourneau à sa place) et le panier
(le frigo). Sur un écran plus large que la maquette, les plateaux d'actions se
prolongent jusqu'au bord.

Il y a trois fourneaux : pendant qu'un plat cuit, on en lance un autre.
Toucher un fourneau libre ouvre le livre. Au-dessus du fourneau, une bulle
parchemin demande les ingrédients, puis chaque étape (une icône) : on touche,
et une barre à segments se remplit avec le nom de l'étape. Puis la barre sert
de minuteur, avec le bouton 60x. Le plat prêt s'affiche dans la bulle : on
touche pour le poser sur le comptoir. Quand plusieurs fourneaux travaillent,
les bulles se rangent en escalier, reliées à leur fourneau par un trait.

Le nom du bandeau est écrit en Patua One (`polices/`, licence OFL).

## À compléter avant le 23

- **Le mot et le cadeau** : `TEXTES.lettre` et `TEXTES.cadeau`, en tête de
  `js/etapes/cafe.js`.
- **Le code** : `js/code.js` (un chiffre par étape, de la grotte au machaon).
- **Les musiques** : voir `sons/LISEZMOI.md`.
