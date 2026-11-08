---
title: Base de données
slug: base-de-donnees
description: Comprendre la base SQLite et créer une migration.
featured: false
---

La base locale est une **SQLite** (`pieride.db`, dans le dossier de données de l'app). Elle est ouverte côté Rust avec sqlx, et le front y accède par les commandes `db_*`, avec [Drizzle](https://orm.drizzle.team) en mode `sqlite-proxy`.

## Le schéma

Le schéma est dans `src/database/schema.ts`, en TypeScript. Les tables :

| Table              | Contenu                                                                             |
| ------------------ | ----------------------------------------------------------------------------------- |
| `accounts`         | les comptes (une personne)                                                          |
| `services`         | les services liés à un compte (`kind`, adresse propre au compte, état de connexion) |
| `sync_state`       | la date et l'erreur de la dernière synchronisation, par service et capacité         |
| `subjects`         | les matières, avec les choix de l'élève (nom affiché, couleur, emoji)               |
| `periods`          | les périodes de notes et d'assiduité                                                |
| `courses`          | les séances : matière, horaires, salle, enseignant, statut, cahier de textes        |
| `homework`         | les devoirs : matière, consigne, date de rendu, fait ou non, pièces jointes         |
| `grades`           | les notes et leur contexte (coefficient, moyenne et extrêmes de la classe)          |
| `subject_averages` | les moyennes par matière, telles que le service les calcule                         |
| `attendance`       | absences et retards                                                                 |
| `news`             | actualités, lues ou non lues                                                        |

Chaque table de données porte `service_id`, avec une **clé étrangère en cascade** vers `services`, elle-même en cascade vers `accounts`. Retirer un service ou un compte supprime donc toutes ses données. Un test vérifie cette règle pour chaque table (`database.test.ts`).

## Changer le schéma

1. Modifie `src/database/schema.ts`.
2. Lance `pnpm db:generate` (drizzle-kit). Il crée un nouveau fichier SQL dans `src/database/migrations/`.
3. **Ne modifie jamais un fichier de migration à la main.** Une migration déjà publiée ne doit plus changer.
4. Relance `pnpm test`.

Au démarrage, `src/database/migrate.ts` applique les migrations pas encore passées. Chacune tourne **clés étrangères coupées** (drizzle-kit reconstruit des tables en les supprimant), dans une transaction vérifiée avant validation.

> **Le cache de Vitest** garde l'ancienne liste des migrations. Après l'ajout d'un fichier, supprime `node_modules/.vitest-cache`, sinon les tests ne voient pas la migration.

## Écrire dans la base

- Pour plusieurs écritures d'un coup, utilise **`db.batch`** (commande `db_batch`, une vraie transaction).
- N'utilise **jamais `db.transaction`** : il envoie `BEGIN` à part, sur une connexion quelconque du pool.
- Un écran ne lit la base que par un hook (`useQuery`). Une écriture hors synchronisation appelle `reload` avec les sujets qu'elle modifie, sinon l'écran reste périmé.

## Les règles de sécurité

- **Aucun secret dans la base** : identifiants et jetons vont dans le trousseau.
- Chaque connexion refuse `ATTACH` (donc `VACUUM INTO`) : le front ne peut ni lire ni créer un autre fichier que `pieride.db`.
- La base n'est **pas chiffrée** dans la première version (décision prise, voir [Confidentialité et sécurité](/welcome/confidentialite-securite)).

## Tests

- `src/database/database.test.ts` : migrations, cascade, règles du schéma.
- `src/database/node-driver.ts` : les mêmes règles sur `node:sqlite`, pour les tests (pas besoin de l'app).