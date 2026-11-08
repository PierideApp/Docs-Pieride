---
title: Services scolaires
slug: services
description: Voir les services intégrés au code actuel et comprendre leur disponibilité.
featured: false
---

Un service relie un compte Piéride à une source de données scolaire ou à un calendrier. Il fournit une ou plusieurs capacités, comme les cours, les devoirs ou les notes.

## État des intégrations

| Service | Capacités attendues | État actuel |
| --- | --- | --- |
| **PRONOTE** | Cours, devoirs, notes, actualités et assiduité selon l'établissement | Intégré au projet de développement ; aucune version publique n'est encore distribuée |
| **ÉcoleDirecte** | Données scolaires | Une intégration est en cours dans l'arbre de développement local ; elle n'est pas publiée et reste à valider |
| Skolengo | Données scolaires | Pas encore disponible |
| APPSCHO et ESUP Multi | Données universitaires | Pas encore disponibles |
| iCal | Événements de calendrier | Pas encore disponible |
| TurboSelf, ARD, Izly et Alise | Informations de cantine | Pas encore disponibles |

Le projet n'a pas encore de version publique à télécharger. L'état du code peut changer avant une première publication. La page [Installation](/welcome/installation) décrit comment lancer le projet depuis ses sources.

## Capacités et modules

Un service annonce les types de données qu'il peut fournir. Piéride s'en sert pour afficher les pages correspondantes :

| Capacité | Données | Module |
| --- | --- | --- |
| TIMETABLE | Cours et emploi du temps | Cours |
| HOMEWORK | Devoirs et état de réalisation | Tâches |
| GRADES | Évaluations et moyennes | Notes |
| NEWS | Actualités de l'établissement | Actualités |
| ATTENDANCE | Absences et retards | Assiduité |

La disponibilité dépend des données transmises par l'établissement et de la version de Piéride. Les services de cantine ne sont pas disponibles dans le build de développement actuel.

## Plusieurs services pour un compte

Un compte peut associer plusieurs services. Les pages visibles dépendent des capacités fournies par l'ensemble des services liés. Les identifiants et les données sont conservés localement ; consulte [Confidentialité et sécurité](/welcome/confidentialite-securite).
