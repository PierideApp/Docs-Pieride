---
title: Synchronisation et hors ligne
slug: synchronisation-hors-ligne
description: Comprendre le cache local, les mises à jour et le mode hors ligne.
featured: false
---

## Le principe

Piéride ne lit pas directement le service à chaque écran. Il copie les données dans une **base locale** (SQLite, sur ton ordinateur), et les écrans lisent cette base. 

**Conséquences :**
- l'app marche **sans réseau** : tu vois les dernières données synchronisées
- revenir sur une page l'affiche tout de suite
- une panne du service n'empêche pas de consulter ce qui est déjà récupéré

## Quand Piéride se synchronise

| Moment                               | Ce qui se passe                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Au lancement                         | Les données du compte affiché sont redemandées si elles ont plus de 30 minutes.                                    |
| Au changement de compte              | Même règle, pour le nouveau compte.                                                                                |
| Juste après la connexion d'un compte | Première synchronisation complète.                                                                                 |
| Pendant que l'app est ouverte        | 30 minutes après la fin de chaque synchronisation.                                                                 |
| Sur demande : `Ctrl/⌘ + R`             | Une synchronisation, au plus une fois toutes les 5 minutes. Une donnée de moins de 5 minutes n'est pas redemandée. |

Le délai de 30 minutes est fixé dans le code et ne se règle pas. La raison : PRONOTE bloque une adresse qui envoie trop de requêtes.

Le délai de 5 minutes pour `Ctrl/⌘ + R` est commun à tous les comptes et repart de zéro au redémarrage.

## Ce qui est synchronisé

- l'emploi du temps et le cahier de textes de chaque cours
- les devoirs
- les notes, les périodes et les moyennes par matière
- les actualités
- les absences et les retards

Les données de cantine ne sont pas encore synchronisées.

## Une semaine qui n'est pas la semaine en cours

Quand tu regardes une autre semaine dans Cours, Piéride la demande au service une seule fois par session. Elle n'est pas rafraîchie pendant que tu la regardes. Pour la mettre à jour, relance l'app.

## Hors ligne

Quand le service ne répond pas, ou que tu n'as pas de connexion, Piéride affiche les données de la base locale. La barre latérale indique l'état de la synchronisation. Un compte hors ligne n'a rien à synchroniser.

## Pas de synchronisation quand l'app est fermée

Pour l'instant, Piéride ne se synchronise qu'app ouverte. La synchronisation en arrière-plan et les notifications arrivent dans une étape ultérieure.