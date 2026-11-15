# Musiques d'ambiance

Une musique par étape, jouée en boucle, avec un fondu enchaîné au changement
d'étape. Il suffit de déposer ici un fichier portant le bon nom :

| Étape | Fichier attendu |
| --- | --- |
| 1 — les deux boutons | `etape-1.mp3` |
| 2 — la grotte | `etape-2.mp3` |

Tant qu'un fichier manque, l'étape se joue simplement sans musique de fond
(les bruitages, eux, sont fabriqués par le navigateur et marchent déjà).

Conseils :

- format MP3, c'est celui qui passe partout ;
- une boucle de 1 à 3 minutes suffit, à 128 kbit/s environ pour rester léger
  sur téléphone ;
- choisir une fin qui se raccorde bien au début, la boucle est sans pause ;
- noter ici la source et la licence de chaque enregistrement.

Le volume général de l'ambiance se règle dans `js/son.js`
(`busAmbiance.gain.value`).
