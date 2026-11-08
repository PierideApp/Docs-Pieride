---
title: Ajouter un module
slug: ajouter-un-module
description: Créer une nouvelle page dans la barre latérale.
featured: false
---

Un module est une page de la barre latérale. Il vit dans son dossier et s'enregistre dans une seule liste.

## 1. Créer le dossier

Crée `src/modules/<id>/` avec la page (par exemple `<Nom>Page.tsx`), puis ses composants et ses hooks. Tant que l'écran n'existe pas, la page peut afficher « Bientôt ici ».

Un module ne parle **jamais** à un service : il lit la base par un hook de données (`useQuery`), et déclenche la synchronisation par l'AccountManager.

## 2. L'enregistrer

Ajoute une ligne à `MODULES` dans `src/modules/registry.ts` :

```ts
{
  id: "monmodule", // clé i18n `modules.monmodule`, chemin de la page
  icon: Home, // un composant d'icône importé au début du fichier
  page: MonModulePage,
  requires: ["GRADES"], // une capacité suffit ; [] = toujours visible
  status: "stable", // stable, beta ou off
  group: "school", // main ou school : le groupe de la barre latérale
},
```

- `requires` : les capacités qui rendent le module visible. Un module sans capacité (`[]`) est toujours là.
- `status: "off"` : le module est livré mais caché. Pratique pour une page en préparation.
- `status: "beta"` : une pastille « Bêta » s'affiche.
- `badge` (facultatif) : une fonction qui compte dans la base, affichée comme pastille.

## 3. Les textes

Ajoute la clé `modules.monmodule` dans `src/locales/fr.json` et `src/locales/en.json`. Tout texte affiché passe par i18next.

## 4. Les tests

`src/modules/registry.test.ts` vérifie la visibilité. Ajoute un cas si ton module a une règle particulière (capacité, statut, masquage).

## 5. Le reste

- Mets à jour la liste des modules dans la documentation : [Les modules](/welcome/modules).
- Ajoute le module aux listes de choix des modèles d'issues (`bug.yml` et `feature.yml`, dans `.github/ISSUE_TEMPLATE/`).
- Pour l'ordre et le masquage dans la barre latérale, rien à faire : les Paramètres le gèrent pour tous les modules.
