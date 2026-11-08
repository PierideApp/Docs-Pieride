---
title: Tauri et Rust
slug: tauri-et-rust
description: Découvrir les commandes, les permissions et les responsabilités de la couche native.
featured: false
---

Le Rust de Piéride est petit, et doit le rester. Il ne sert qu'à ce que la WebView ne sait pas faire : réseau sans CORS, trousseau, base SQLite, fenêtre de connexion ENT, icône de la barre des tâches, notifications.

## Les commandes

Déclarées dans `src-tauri/src/main.rs` (`generate_handler!`) :

| Commande                                                    | Rôle                                                                                                      | Fichier            |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------ |
| `allow_instance`                                            | Ouvre au réseau l'adresse propre à un compte (instance PRONOTE, URL iCal), en HTTPS sur un domaine public | `main.rs`          |
| `pronote_login`                                             | Ouvre la fenêtre de connexion ENT et renvoie l'identifiant et le jeton                                    | `pronote_login.rs` |
| `show_app`                                                  | Montre la fenêtre (après le démarrage)                                                                    | `main.rs`          |
| `is_minimized`                                              | Indique si la fenêtre démarre réduite                                                                     | `main.rs`          |
| `secret_get`, `secret_set`, `secret_delete`                 | Lit, écrit, supprime un secret dans le trousseau                                                          | `secrets.rs`       |
| `db_select`, `db_execute`, `db_batch`, `db_apply_migration` | Exécutent le SQL sur `pieride.db`                                                                         | `database.rs`      |

## Les règles d'une commande

- **Petite et typée** : les entrées et sorties sont des types `serde`.
- **Validée** : un identifiant de secret ne contient que des caractères alphanumériques et des tirets (`valid_id`), et une adresse d'instance doit être du HTTPS sur un domaine public (`instance_origin`).
- **Erreurs en `Result`** : jamais de `unwrap()` ni d'`expect()` sur une entrée externe. Les erreurs sont des **codes** (`not_found`, `keyring_unavailable`, `too_long`…), jamais le secret.
- **Hors du fil de l'interface** : une opération du trousseau peut bloquer (déverrouillage, D-Bus), elle passe par `spawn_blocking`.

## Les permissions

Chaque commande et chaque plugin a une permission explicite dans `src-tauri/capabilities/` :

- `default.json` : la fenêtre principale (`main`). Elle liste les commandes de l'app, les permissions de fenêtre et les domaines autorisés par les plugins `http` et `opener`.
- `desktop.json` : `window-state` et `autostart` (macOS, Windows, Linux).

Une fenêtre n'a que les permissions qu'on lui donne. La **fenêtre de connexion ENT** (`pronote-login`) n'est nommée dans aucune capability : elle n'a accès à aucune commande de l'app.

Pour ajouter une commande, il faut l'ajouter à `generate_handler!` **et** à la capability de la fenêtre qui l'appelle. Sans cela, la commande est refusée.

## Le réseau

- `tauri-plugin-http` est le seul chemin vers Internet. Il refuse le HTTP et tout domaine non déclaré, redirections comprises.
- Les domaines sont listés dans `default.json`. La liste est **fermée** : chaque service déclare les siens.
- `dragDropEnabled: false` dans `tauri.conf.json` : sous Windows, Tauri intercepte sinon le glisser-déposer HTML5 (réordonner les modules, déposer un fond d'écran). Ne retire pas cette ligne.

## La fenêtre ENT

`src-tauri/src/pronote_login.rs` ouvre une fenêtre séparée :

- navigation **privée** : rien de l'ENT ne reste sur le disque ;
- le script injecté (`pronote_login.js`) renvoie l'identifiant et le jeton en naviguant vers un domaine réservé (`pieride.invalid`, jamais résolu), que Rust intercepte ;
- le mot de passe ne quitte jamais la page de l'ENT ;
- une seule connexion à la fois (`login_open`).

## La CSP et la configuration

La Content Security Policy est dans `src-tauri/tauri.conf.json` : `default-src 'self'`, les images en `data:`, aucune ressource distante. Elle ne s'applique qu'en **build de release** : en `pnpm tauri dev`, la page vient de Vite. Teste donc les changements sensibles avec `pnpm tauri build --no-bundle`.

Le dossier de données est `$CONFIG/Pieride` (`appDirectoriesOverride`). La fonctionnalité `devtools` est coupée.

## Les plugins

| Plugin            | Usage                                                                        |
| ----------------- | ---------------------------------------------------------------------------- |
| `http`            | toutes les requêtes des services                                             |
| `opener`          | ouvrir un lien dans le navigateur (dépôts GitHub listés dans `default.json`) |
| `notification`    | notifications système                                                        |
| `autostart`       | lancement au démarrage                                                       |
| `window-state`    | taille et position de la fenêtre                                             |
| `single-instance` | une seule instance à la fois                                                 |

## Tester

```bash
cd src-tauri
cargo fmt --check
cargo clippy -- -D warnings
cargo test
```

Les tests Rust couvrent notamment `instance_origin` (adresses HTTPS, domaines publics).