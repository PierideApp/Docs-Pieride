---
title: Architecture de Piéride
slug: architecture
description: Comprendre les couches de l'application et la circulation des données.
featured: false
---

Piéride est une application **Tauri 2** : l'interface est une page React dans une WebView, et le code Rust fournit les capacités système nécessaires à l'application.

Le schéma complet se trouve dans le fichier docs/architecture.excalidraw à la racine du dépôt applicatif. Il peut être ouvert avec Excalidraw.

## Les couches

~~~text
Interface (React, dans la WebView)
  modules → hooks de données
  composants, stores et traductions

Cœur métier (TypeScript)
  AccountManager → plugins de services → réseau → serveurs
        │              (mappers → modèles communs)
        └── base locale SQLite (lecture et repli hors ligne)

Tauri (Rust)
  fenêtre de connexion ENT · trousseau · commandes système · SQLite · notifications
~~~

### Interface

- Un **module** est une page de la barre latérale ([Modules](/welcome/modules)).
- Les hooks lisent les données locales et passent par l'AccountManager pour les actualiser.
- Les réglages de l'interface sont séparés des identifiants et jetons d'accès.
- Les composants partagés présentent les données ; ils ne se connectent pas directement aux services.

### Services et données

L'AccountManager sélectionne les services associés au compte, demande les données et enregistre les réponses dans SQLite. Les plugins convertissent les réponses des services en modèles Piéride communs. Si le service ne répond pas, les pages peuvent lire les dernières données déjà enregistrées.

Les données disponibles dépendent du service, de l'établissement et de la version utilisée. Voir [Services scolaires](/welcome/services).

### Capacités natives

Tauri et ses plugins permettent d'utiliser le trousseau du système, la base SQLite, le réseau autorisé par la configuration, la fenêtre de connexion ENT, les notifications et l'icône de zone de notification. Les permissions se trouvent dans src-tauri/capabilities/.

## Règles de conception

1. Une page ne se connecte jamais directement à un service.
2. Les identifiants et jetons restent dans le trousseau, jamais dans SQLite, les réglages ou le journal.
3. Toute modification du schéma de données s'accompagne d'une migration.
4. Le code Rust sert aux capacités système nécessaires à l'application.
5. Un service ou un module est ajouté dans son dossier puis enregistré dans le registre correspondant. Voir [Ajouter un service](/develop/ajouter-un-service) et [Ajouter un module](/develop/ajouter-un-module).

## Synchronisation

Les données sont actualisées à l'ouverture de l'application, après la connexion d'un service et lors d'une demande manuelle. Une synchronisation périodique peut aussi avoir lieu pendant que Piéride est ouvert. Le détail des intervalles dépend du code de la version ; consulte [Synchronisation et hors ligne](/welcome/synchronisation-hors-ligne).

Quand l'application est hors ligne, elle peut afficher les données déjà enregistrées. Une nouvelle synchronisation nécessite une connexion au service scolaire.
