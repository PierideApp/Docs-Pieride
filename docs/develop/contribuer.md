---
title: Contribuer au projet
slug: contribuer
description: Signaler un problème, proposer une idée et préparer une contribution.
featured: false
---

Piéride se construit à plusieurs. Signaler un bug, proposer une idée, relire une PR ou écrire du code : tout aide.

## Par où commencer

- Les issues **`good first issue`** sont faites pour une première contribution.
- Avant de te lancer sur une issue, **dis-le en commentaire**, pour que deux personnes ne travaillent pas dessus.
- Pour une grosse idée, ouvre d'abord une issue **« Idée »** : on en discute avant que tu y passes des heures.
- Pour un bug, ouvre une issue **« Bug »**. Le modèle demande les étapes, le module, les services du compte, ton système et le journal (**Paramètres > Piéride > Développeur**). Le journal ne contient ni identifiant ni jeton.
- **Une faille de sécurité ?** N'ouvre pas d'issue publique : signale-la en privé depuis l'onglet Security du dépôt (voir [Confidentialité et sécurité](/welcome/confidentialite-securite)).

Les issues vierges sont désactivées : utilise un des modèles proposés.

## Installer le projet

Voir [Installation](/welcome/installation).

## De la branche à la fusion

1. **Fork le projet, puis sur votre repository, créer une branche depuis `main`**, par exemple `feat/vue-semaine` ou `fix/synchro-notes`.
2. **Écris tes commits en [Conventional Commits](https://www.conventionalcommits.org/fr/v1.0.0/)**, sur une ligne :
   ```
   feat(cours): ajoute la vue semaine
   fix(notes): corrige la moyenne des matières sans note
   ```
3. **Vérifie que tout passe** : `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test`. Si tu as touché au Rust : `cargo fmt --check`, `cargo clippy -- -D warnings`, dans `src-tauri/`.
4. **Ouvre la PR** et remplis le modèle : ce que ça change, comment tester, sur quel système, captures si l'interface change.
5. **Une CI** peut-être lancer par les owners du projet et vérifie le code et compile l'app. Une relecture suit, puis la fusion.

### Ce que vérifie la CI

| Job   | Ce qu'il fait                                                                                      |
| ----- | -------------------------------------------------------------------------------------------------- |
| Front | lint, format, types, tests                                                                         |
| Rust  | `cargo fmt --check`, `cargo clippy -- -D warnings`, `cargo test`                                   |
| Build | sur `main` seulement : compile l'app sur Ubuntu, macOS et Windows (`pnpm tauri build --no-bundle`) |

Les PR déclenchent les deux premiers jobs.

## Le modèle de PR

Avant la relecture, vérifie la liste :

- la PR ne traite qu'un seul sujet ;
- `pnpm lint`, `pnpm typecheck` et `pnpm test` passent ;
- les nouveaux textes sont dans `src/locales/` ;
- la documentation est à jour si l'architecture change.

## Les règles d'architecture

- **Une donnée scolaire passe toujours par l'AccountManager.** Un écran n'appelle jamais un service directement.
- **Un nouveau service** = un dossier dans `src/services/`.
- **Un nouveau module** = un dossier dans `src/modules/` et une ligne dans `registry.ts`.
- **Base locale** : toute modification du schéma = une migration.
- **Rust** : seulement ce que la WebView ne sait pas faire.
- **Secrets** : identifiants et jetons uniquement dans le trousseau.
- **Textes** : tout texte affiché passe par i18next, au moins en français.

Le détail des conventions de code est dans [Conventions et qualité](/develop/conventions-qualite).

## Le style

Prettier et ESLint décident : 2 espaces, guillemets doubles, imports triés. `pnpm lint --fix` puis `pnpm format` règlent presque tout.

Dans l'interface, on tutoie et on reste simple.