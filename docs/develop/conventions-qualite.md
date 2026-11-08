---
title: Conventions et qualité
slug: conventions-qualite
description: Appliquer les règles de code, d'accessibilité, de sécurité et de tests.
featured: false
---

# Conventions et qualité

Ces règles viennent du fichier `CONTRIBUTING.md` du dépôt. Elles s'appliquent à tout le code, y compris celui que tu écris avec un assistant. Une PR qui les enfreint est refusée.

## Vérifier avant d'annoncer « fini »

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
```

Et pour le Rust : `cargo fmt --check`, `cargo clippy -- -D warnings`, `cargo test`, dans `src-tauri/`.

Si ton changement touche l'interface, lance l'app (`pnpm tauri dev`) et regarde le résultat : les tests ne voient pas un rendu.

## TypeScript

- **Mode strict.** Pas de `any`. Pas de `as` pour faire taire le compilateur : type la vraie forme, ou utilise `unknown` et vérifie aux frontières (réponses des services, JSON, stockage).
- Les modèles communs vivent dans `src/services/shared` : importe-les, ne les redéfinis jamais.
- Import via l'alias `@/` dès qu'on sort du dossier courant.
- Pas de `catch` vide.

## React

- Composants fonctions. Hooks avant tout `return`.
- Effets nettoyés : écouteurs, minuteurs, abonnements.
- Chaque écran gère les états **vide, chargement, erreur et hors ligne**. L'app doit marcher sans réseau.
- Aucun appel réseau dans un composant : écran → hook de données → AccountManager.
- Éléments natifs (`button`, `input`, `dialog`), focus visible, tout faisable au clavier.

## Styles

- SCSS uniquement : un module `Nom.module.scss` à côté de son composant, et les variables du thème dans `src/styles/theme.scss`.
- Pas de fichier `.css`, pas de bibliothèque de style, pas de balise `<style>`.
- Couleurs, espacements et rayons par les variables CSS du thème, jamais en dur. Les thèmes clair et sombre doivent rester lisibles.
- **Pas de `color-mix()` qui contient une variable** : le WebKit de certains Mac ne le résout pas, et la couleur disparaît. Calcule la teinte en TypeScript (`src/lib/color.ts`), ou pose un calque peu opaque.
- Une zone qui défile le fait sur un seul axe : `overflow: hidden auto`, jamais `overflow-y: auto` seul.
- En ligne (`style={{ }}`) : seulement une valeur connue à l'exécution (couleur choisie, image), de préférence par une variable CSS. Jamais une règle de mise en page dans le TSX.

## Composants réutilisables

- Avant d'écrire un élément, cherche dans `src/components` : s'il existe presque, étends-le par une prop.
- Un élément utilisé à plusieurs endroits va dans `src/components/Nom/`, reçoit tout par ses props, ne lit aucune donnée scolaire.
- Pas d'élément natif quand le projet a son composant : `Select` plutôt que `<select>`, `ConfirmDialog` pour une confirmation.
- Un nouveau composant est ajouté à la liste de `src/components/README.md`.

## Textes et traductions

- Tout texte affiché passe par **i18next**, en français **et** en anglais (`src/locales/fr.json` et `en.json`). `locales.test.ts` vérifie que les deux fichiers ont les mêmes clés.
- Français, au **tutoiement**, dans l'interface.
- Pas de tiret cadratin dans le code, la documentation, les messages et les commits : le dépôt le bloque.

## Rust

- Seulement ce que la WebView ne sait pas faire. Voir [Tauri et Rust](/develop/tauri-et-rust).
- Erreurs en `Result`, jamais de `unwrap()` ou `expect()` sur une entrée externe.

## Tests

- **Vitest** pour toute logique non triviale : mappers, moyennes, dates, registre des modules. Au moins un test qui casse si la logique casse. Rien pour le trivial.
- **Les fixtures sont des réponses réelles anonymisées**, jamais de vraies données d'élève.
- `htmlToText` et les autres fonctions qui dépendent du DOM ne sont pas testées par Vitest, qui tourne sans DOM.

## Sécurité : règles bloquantes

Un changement qui enfreint ces règles est **arrêté**, pas livré.

- Identifiants, mots de passe, jetons, cookies : **uniquement** dans le trousseau, via la commande Rust. Jamais dans SQLite, les stores, `localStorage`, les journaux, les messages d'erreur, les captures ou les fixtures.
- Journaux : masquer les jetons, les URL avec authentification et les corps des requêtes de connexion.
- Réseau : tout passe par `tauri-plugin-http`, en HTTPS, domaines au plus juste. Ne jamais élargir une permission sans le signaler.
- HTML venant des services (actualités, devoirs) : nettoyé avant affichage. Jamais de `dangerouslySetInnerHTML` brut.
- Aucune télémétrie sans consentement explicite.
- Jamais de vraies données d'élève dans le dépôt, les issues ou les captures.

Quand un changement touche à la sécurité, la PR le dit : fichier et ligne, le risque, la mitigation.

## Signaler un problème

Format attendu en revue : `fichier:ligne`, pourquoi ça casse, le correctif. Distingue un vrai bug d'un détail. Avant de signaler, vérifie qu'il n'a pas été déjà corrigé.