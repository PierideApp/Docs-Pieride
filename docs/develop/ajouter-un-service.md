---
title: Ajouter un service
slug: ajouter-un-service
description: Intégrer une nouvelle source de données scolaires à Piéride.
featured: false
---

Un service est un dossier dans `src/services/` qui implémente `SchoolServicePlugin` et déclare ses capacités. Il ne touche jamais aux écrans : tout passe par l'AccountManager.

Avant de commencer, relis [Architecture](/develop/architecture) et l'exemple de PRONOTE (`src/services/pronote/`).

## 1. Déclarer le service

Dans `src/services/shared/models.ts`, ajoute le type dans `ServiceKind`.

Dans `src/services/shared/plugin.ts`, ajoute une entrée à chacun des quatre enregistrements typés (`Record<ServiceKind, …>`). TypeScript refuse la compilation tant qu'une entrée manque :

- `SERVICE_CAPABILITIES` : les capacités que le service fournit ;
- `SERVICE_NAMES` : le nom de marque affiché (le même dans toutes les langues) ;
- `SERVICE_GROUPS` : `school`, `canteen` ou `calendar`, pour le classement dans les Paramètres ;
- `NO_SECRET` : seulement si le service n'a aucun identifiant.

## 2. Écrire le plugin

Crée `src/services/<nom>/index.ts` et exporte une fonction de type `ConnectService` :

```ts
export const connectMonService: ConnectService = async (
  service, // le service lié : id, compte, instanceUrl
  secret, // le secret lu dans le trousseau
  saveSecret // à appeler quand le service renouvelle son jeton
) => ({
  kind: "monservice",
  capabilities: {
    TIMETABLE: { getWeeklyTimetable: weekStart => … },
  },
});
```

Règles :

- Une capacité se déclare **en fournissant toutes ses méthodes**. Ne déclare que ce que le plugin sait faire.
- Les réponses du service sont **inconnues** à l'entrée : valide-les (`unknown` et vérification), ne les convertis pas avec `as`.
- Un **mapper** transforme la réponse en modèle commun (`Course`, `Homework`, `PeriodGrades`…). Les textes HTML venant du service restent du HTML : ils sont nettoyés à l'affichage.
- Les erreurs sont des erreurs typées (`AuthenticationError` si les identifiants sont refusés, `ServiceUnavailable` si le serveur ne répond pas, `SecurityChallenge` pour une vérification supplémentaire). Aucun `catch` vide.
- Les messages d'erreur ne contiennent **jamais** le jeton ni une URL avec authentification (`redactUrl`).

## 3. Enregistrer la connexion

Dans `src/services/index.ts`, ajoute le service à la liste, chargé à la demande :

```ts
monservice: async (...args) =>
  (await import("./monservice")).connectMonService(...args),
```

## 4. Le réseau

Toutes les requêtes passent par `src/lib/http.ts`, jamais par un `fetch` brut.

Les domaines du service se déclarent dans `src-tauri/capabilities/default.json`, dans la permission `http:default`. Ajoute **le domaine exact et le plus étroit possible**, en HTTPS.

> Ne jamais élargir une permission « pour que ça marche ». Si un domaine est refusé, signale-le en précisant pourquoi il est nécessaire : c'est une décision de sécurité.

Si l'adresse change d'un compte à l'autre (comme une instance PRONOTE ou une URL iCal), elle n'est pas dans la liste : elle passe par la commande `allow_instance`, en HTTPS et sur un domaine public.

## 5. Les données

- Si le service fournit une capacité déjà présente (`TIMETABLE`, `HOMEWORK`, `GRADES`, `NEWS`, `ATTENDANCE`), les tables existent déjà.
- Sinon, il faut une **migration** : voir [Base de données](/develop/base-de-donnees). Chaque table porte `service_id`.
- Pour qu'une capacité soit synchronisée, ajoute-la à la liste `SYNCED` de `account-manager.ts`.

## 6. Les secrets

Identifiants, mots de passe, jetons et cookies vont **uniquement** dans le trousseau, via `saveSecret` et la commande `secret_*`. Ils ne sont jamais écrits dans SQLite, un store, un journal, une capture ou une fixture de test.

## 7. Les tests

- Un test du **mapper** avec une réponse **anonymisée** (jamais de vraies données d'élève).
- Un test de l'AccountManager si le service change son comportement de repli.
- `pnpm test` doit passer.

## 8. La documentation

- Ajoute le service à la table de `docs/modules.md` et à la page [Services](/welcome/services) de cette documentation.
- Ajoute-le à la liste des services du modèle d'issue `bug.yml` (`.github/ISSUE_TEMPLATE/`).

