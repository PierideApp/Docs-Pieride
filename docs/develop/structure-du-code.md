---
title: Structure du code
slug: structure-du-code
description: Repérer les fichiers et dossiers principaux du dépôt de l'application.
featured: false
---

Le dépôt applicatif rassemble le code TypeScript de l'interface et les commandes Rust utilisées par Tauri.

~~~text
.github/       intégration continue, modèles d'issues et de propositions
docs/          documentation technique du code source
src/           interface et cœur métier TypeScript
  app/         fenêtre, navigation, premier lancement et paramètres
  modules/     pages de l'application et registre
  components/  composants d'interface partagés
  hooks/       accès aux données et fonctions d'interface
  services/    connexion aux services, AccountManager et modèles communs
  database/    schéma, migrations et accès à SQLite
  stores/      réglages de l'application et état de synchronisation
  lib/         réseau, trousseau, journal et fonctions partagées
  locales/     traductions françaises et anglaises
  styles/      thème et styles SCSS
src-tauri/     fenêtre native, commandes, permissions et configuration
~~~

Chaque dossier principal de src/ possède un fichier README.md qui décrit son rôle.

## Où trouver quoi ?

| Pour… | Regarder… |
| --- | --- |
| Ajouter une page | src/modules/ et src/modules/registry.ts |
| Ajouter un service | src/services/ et src/services/README.md |
| Modifier une donnée stockée | src/database/schema.ts et src/database/README.md |
| Ajouter un bouton, un menu ou un champ | src/components/ |
| Ajouter une commande native | src-tauri/src/ et src-tauri/capabilities/ |
| Modifier un texte | src/locales/fr.json et src/locales/en.json |
| Changer le thème | src/styles/theme.scss |
| Lire le journal de l'application | src/lib/log.ts |
| Générer des données fictives pendant le développement | src/services/mock/ |
| Comprendre les couches | docs/architecture.excalidraw à la racine du dépôt |

Les pages [Architecture](/develop/architecture) et [Conventions et qualité](/develop/conventions-qualite) expliquent les règles à suivre avant une modification.
