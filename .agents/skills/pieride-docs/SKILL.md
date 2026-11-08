---
name: pieride-docs
description: Comprendre, modifier et faire évoluer le site de documentation Piéride : identité visuelle, thèmes, navigation, recherche, catégories, articles Markdown, images et structure du dépôt.
---

# Skill du site de documentation Piéride

## Objectif et périmètre

Ce guide décrit l'identité visuelle, le fonctionnement technique et l'édition du site de documentation Piéride.

Le dépôt a trois parties :

- Le code du site et ses dépendances sont à la racine.
- Le dossier design contient la fiche de référence et les tokens.
- Le dossier docs contient les catégories, les pages Markdown et leurs images.

Les fichiers de contenu faisant autorité se trouvent uniquement dans docs/. Ne pas créer un second dossier de contenu ni ajouter des exports de documentation à la racine.

## Identité visuelle

### Marque et voix

- Nom visible : **Piéride Documentation**.
- Public : personnes qui utilisent Piéride et personnes qui contribuent à son développement.
- Langue des nouvelles pages : français.
- Ton : accueillant, direct et concret.
- Utiliser des visuels de Piéride. Si une image est une maquette, l'indiquer dans son texte alternatif ou sa légende.
- Ne pas présenter une maquette comme une capture d'une version publiée.
- Ne pas annoncer une fonction qui n'est pas intégrée ou clairement décrite comme une idée.

### Palette de référence

La fiche complète est dans design/references/composants.pdf. Les valeurs sont aussi dans design/tokens.json et dans les variables de src/app/globals.css.

| Rôle | Valeur | Usage |
| --- | --- | --- |
| Encre | #0E0B4D | Fond de marque et profondeur du dégradé |
| Indigo profond | #16127A | Dégradé de navigation |
| Accent principal | #2B2BC2 | Liens et rubrique Interface |
| Indigo lumineux | #5556F2 | Actions et rubrique Contribuer |
| Lavande | #A9B4FF | Contraste doux et accent en thème sombre |
| Jaune soufre | #F1E25B | Repères ponctuels |
| Fond clair | #F4F5FB | Lecture en thème clair |
| Surface claire | #FFFFFF | Cartes et panneaux |
| Fond sombre | #16171B | Lecture en thème sombre |
| Surface sombre | #202126 | Cartes en thème sombre |
| Texte principal | #13123A | Texte courant clair |
| Texte secondaire | #6B6E8C | Descriptions et paragraphes |
| Succès | #12A26B | États positifs et rubrique Découvrir |
| Erreur | #D93A44 | Messages d'erreur |
| Attention | #E8901C | Avertissements et rubrique Aide |

Accents par catégorie : welcome #12A26B, develop #5556F2, designer #2B2BC2, support #E8901C. Leur source éditoriale est le champ accent de chaque category.json.

### Thèmes

Le bouton de thème mémorise le choix dans le navigateur sous pieride-docs-theme.

- La barre latérale garde son dégradé violet en thème clair comme en thème sombre.
- La surface de lecture claire reste pâle et neutre.
- La surface de lecture sombre utilise des gris anthracite.
- Ne pas étendre le fond violet à toute la page sombre.
- Les images avec variantes claires et sombres suivent le thème choisi dans le site.

### Typographie et mouvement

- SN Pro est utilisée pour la lecture, les contrôles et la navigation.
- Unbounded est réservée aux titres.
- Les animations sont courtes : apparition de page, entrée légère des cartes, accent discret au survol et ouverture de la recherche.
- Le mouvement ne retarde jamais la navigation ni la lecture.
- Respecter prefers-reduced-motion et supprimer les transitions non nécessaires.

## Fonctionnement du site

Le site utilise Next.js avec export statique. Il lit les pages Markdown au moment de la construction et génère les routes depuis les fichiers de docs/.

| Fichier | Responsabilité |
| --- | --- |
| src/app/[[...slug]]/page.tsx | Résolution de la page, des catégories et des routes statiques |
| src/lib/docs.ts | Lecture de docs/, frontmatter, catégories, slugs, liens, médias et cache |
| src/lib/site-path.ts | Ajout du chemin de base aux liens statiques |
| src/components/DocsSite.tsx | Navigation, barre latérale, recherche et pied de page |
| src/components/ThemeToggle.tsx | Changement et mémorisation du thème |
| src/components/DocsPages.tsx | Accueil, catégories, pages et articles associés |
| src/components/MarkdownDocument.tsx | Rendu Markdown, liens, médias et assainissement du HTML |
| src/components/Icons.tsx | Icônes SVG utilisées dans l'interface |
| src/app/globals.css | Couleurs, dispositions, polices, états et animations |
| public/docs-interactions.js | Recherche clavier, thème, menus et interactions de contenu |
| src/app/assets/[...asset]/route.ts | Service des images d'articles avec vérification des chemins |
| design/tokens.json | Valeurs lisibles des couleurs et familles de polices |
| public/brand/, public/fonts/, public/visuels/ | Identité graphique, polices et visuels du site |

Le chemin de base peut être fourni avec NEXT_PUBLIC_BASE_PATH pour l'export sur un sous-chemin. La configuration de production ne doit pas dépendre d'un nom de domaine qui n'est pas effectivement utilisé.

## Découverte des catégories et des articles

1. Chaque dossier de premier niveau sous docs/ est une catégorie.
2. Un category.json valide définit son nom, son icône, son accent, sa description et sa position.
3. Le lecteur indexe les fichiers Markdown de la catégorie et ignore les dossiers assets.
4. Le nom de fichier définit le slug par défaut. Un champ slug peut choisir une autre URL.
5. Le frontmatter reconnu contient title, slug, description, cover et featured.
6. Les slugs de page doivent être uniques dans une catégorie.
7. L'article index.md sert de page de catégorie.

Les champs de frontmatter sont lus simplement ; garder les valeurs sur une ligne et éviter les syntaxes YAML complexes.

## Organisation éditoriale

Structure attendue :

~~~text
docs/
  welcome/
    category.json
    index.md
    installation.md
    assets/
      index/
      installation/
  develop/
    category.json
    index.md
    architecture.md
    assets/
  designer/
    category.json
    index.md
    accueil.md
    assets/
  support/
    category.json
    index.md
    depannage.md
    assets/
~~~

Les fichiers Markdown restent à plat dans leur catégorie. Utiliser des noms courts, lisibles, minuscules et séparés par des tirets. Pour chaque article qui contient une image, ranger celle-ci dans docs/categorie/assets/nom-article/. L'article index.md utilise assets/index/.

Chemins de média relatifs à la catégorie :

~~~markdown
![Maquette de l'accueil Piéride](assets/accueil/tableau-de-bord.jpg)

*Maquette de présentation ; les données affichées sont fictives.*
~~~

Pour ajouter une catégorie, créer son dossier, son category.json et son index.md. Les icônes disponibles sont celles déclarées dans src/components/Icons.tsx.

## Rédiger un article

Exemple de frontmatter :

~~~yaml
---
title: Premiers pas
slug: premiers-pas
description: Créer un compte et connecter un service scolaire.
featured: true
---
~~~

Écrire pour un lecteur qui ne connaît pas le code du projet. Préférer les étapes concrètes, expliquer les prérequis et signaler les limites actuelles. Quand une information peut évoluer (sortie, intégration, compatibilité), vérifier la source du dépôt et dater ou nuancer la formulation.

Ne pas confondre :

- une fonction présente dans le code ;
- une fonction validée sur toutes les plateformes ;
- une fonction publiée dans une version téléchargeable ;
- une maquette qui montre une piste de conception.

Les liens internes doivent viser les routes générées depuis docs/. Les liens externes doivent rester des URL complètes. Ne laisser ni destination vide ni lien vers une page supprimée.

## Rendu Markdown, médias et sécurité

Le rendu accepte le Markdown courant : titres, listes, tableaux, tâches, liens et blocs de code. Quelques éléments HTML accessibles permettent de légender des images ou de replier du contenu.

L'assainissement HTML dans MarkdownDocument.tsx est obligatoire. Ne pas le retirer pour contourner un problème d'affichage. Préférer le Markdown courant aux directives ou aux dispositions complexes.

Le routeur de médias doit rester limité au dossier docs/, bloquer toute remontée vers les dossiers parents, refuser les fichiers Markdown et servir uniquement les types d'images attendus.

## Recherche, navigation et accessibilité

- Ctrl K ou Cmd K ouvre la recherche ; Échap la ferme.
- Les flèches haut et bas changent le résultat actif ; Entrée ouvre la page.
- La recherche normalise les accents et indexe titres, descriptions, contenu et catégories.
- Le choix du thème est conservé dans localStorage.
- Les catégories de la barre latérale s'ouvrent avec leurs boutons dédiés.
- Le menu mobile se ferme après navigation ou activation du voile.
- Garder de vrais liens pour le partage, l'historique et les commandes précédent/suivant.
- Les contrôles et les états doivent rester accessibles au clavier.

Si un attribut data-* change dans un composant, mettre à jour public/docs-interactions.js dans la même modification.

## Aperçu et vérifications

Depuis la racine du dépôt :

~~~text
npm run dev
npm run build
npm run start
~~~

Après un changement de contenu, vérifier les pages touchées, leurs liens internes et leurs images. Après un changement visuel, vérifier les thèmes clair et sombre, la navigation clavier et une largeur mobile. Utiliser le build pour vérifier la génération statique.

L'aperçu local ne publie rien. Ne lancer aucun push ni déploiement dans le cadre d'une simple modification éditoriale.

## Nettoyage

- Garder les pages uniquement sous docs/.
- Conserver les ressources partagées du site dans public/.
- Garder chaque image d'article près de l'article qui l'utilise.
- Maintenir un seul gestionnaire de dépendances npm à la racine.
- Avant de supprimer un article ou une image, vérifier qu'il ne contient pas d'information utile non reprise ailleurs.
