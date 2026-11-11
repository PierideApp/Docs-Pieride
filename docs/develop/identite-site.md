---
title: Fonctionnement et identité du site
slug: identite-site
description: Comprendre le fonctionnement technique, l'organisation et les règles de rédaction du site.
featured: false
---

# Fonctionnement et identité du site

Le site de documentation Piéride transforme des articles Markdown locaux en pages web. Le contenu éditorial se trouve dans docs/ ; le code du site, ses dépendances et sa configuration restent à la racine.

La fiche de composants du dossier design/references et le fichier design/tokens.json décrivent l'identité visuelle. Les ressources utilisées par le site se trouvent dans public/.

## Organisation du contenu

- Chaque dossier de premier niveau dans docs/ représente une catégorie.
- Chaque catégorie contient un category.json et des articles Markdown.
- Chaque article possède un slug lisible et, si nécessaire, des médias rangés dans son propre dossier assets/<article>/.
- Les articles sont écrits en français et décrivent Piéride et son état réel.
- Une maquette doit être identifiée comme illustration de présentation ; elle ne doit pas faire croire qu'une fonction est déjà livrée.

## Fonctions du site

La navigation est construite à partir des catégories et articles. La barre latérale permet d'ouvrir les catégories, la recherche indexe les textes, et le bouton de thème conserve le choix de l'utilisateur dans son navigateur. La zone de lecture peut passer du thème clair au thème sombre ; la barre latérale conserve son identité violette.

Le rendu accepte le Markdown courant, notamment les titres, listes, tableaux, liens et blocs de code. Les images sont servies depuis le dossier de leur article. La première image Markdown d'un article devient aussi sa vignette dans les cartes ; `cover:` dans le frontmatter permet de choisir une autre image, avec un chemin relatif à l'article, par exemple `cover: assets/mon-article/apercu.png`.

## Identité visuelle

La lecture utilise SN Pro et les grands titres Unbounded. Le violet Piéride marque la navigation ; les pages utilisent un fond clair ou un gris sombre selon le thème. Les couleurs de catégorie servent à distinguer les rubriques avec mesure.

Les animations restent brèves et ne retardent pas la navigation. Le réglage système de réduction des animations doit être respecté. Pour les couleurs détaillées, consulte design/tokens.json et design/references/composants.pdf.

## Modifier une page

1. Ouvre le fichier Markdown de la catégorie dans docs/.
2. Modifie le texte ou ajoute un article avec son frontmatter.
3. Place chaque image dans le dossier assets de son article.
4. Vérifie les liens internes, les images et les deux thèmes dans l'aperçu local.

Aucune commande de génération manuelle n'est requise pendant l'édition : le site lit directement les fichiers du dépôt.
