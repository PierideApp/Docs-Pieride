---
title: Premiers pas
slug: premiers-pas
description: Créer un compte, choisir un service et connecter ton espace scolaire.
featured: true
---

Au premier lancement, Piéride t'accueille et te demande de créer un compte. Un **compte** est une personne. Ses données viennent des **services** liés à ce compte, par exemple PRONOTE.

## 1. Qui es-tu ?

Piéride prend en charge les **élèves** pour l'instant. Les comptes parents et professeurs ne sont pas prévus pour l'instant.

## 2. Choisir le service

| Choix                                       | Disponibilité                 |
| ------------------------------------------- | ----------------------------- |
| PRONOTE                                     | disponible dans la bêta publique |
| ÉcoleDirecte                                | en cours de développement, non incluse dans la bêta |
| Skolengo, APPSCHO, ESUP Multi              | affichés mais indisponibles, marqués « Bientôt » |
| iCal, TurboSelf, ARD, Izly, Alise           | pas encore proposés           |
| Compte hors ligne                           | disponible, sans service      |

Un **compte hors ligne** n'a aucun service. Il affiche l'Accueil et les événements créés. Tu peux lier un service plus tard.

## 3. Connecter PRONOTE

1. **Trouver ton établissement.** Deux façons :
   - par **ville** (recommandé) : tu cherches le nom de la ville, puis ton établissement dans la liste ;
   - par **adresse** : tu colles l'adresse PRONOTE de ton établissement, telle qu'elle apparaît dans ton navigateur.
2. **Choisir la méthode de connexion :**
   - **Identifiants PRONOTE** : ton identifiant et ton mot de passe PRONOTE ;
   - **ENT** : si ton établissement passe par un espace numérique (Toutatice, Mon Bureau Numérique…), la connexion se fait dans une **fenêtre dédiée**.
3. **Valider la connexion.** Si PRONOTE demande une double authentification (code reçu par mail ou SMS, question de sécurité), Piéride te la demande.
4. **Le compte est créé.** Une synchronisation démarre tout de suite pour remplir l'emploi du temps, les devoirs, les notes et les actualités.

### Ce que Piéride garde de la connexion

- Le **mot de passe** reste dans la fenêtre ENT ou dans le formulaire : Piéride ne le reçoit jamais.
- Piéride garde l'**identifiant** et un **jeton de session** dans le **trousseau du système** (Trousseau macOS, Gestionnaire d'identification Windows, Secret Service sous Linux). Ils ne sont jamais écrits dans la base ni dans un fichier de réglages.

## 4. Connecter ÉcoleDirecte

Une intégration ÉcoleDirecte est en cours de développement, mais elle n'est pas incluse dans la bêta publique `v0.1.0-beta.1`. La connexion ÉcoleDirecte n'est donc pas disponible dans cette version.

Comme pour les autres services, les secrets de connexion sont conservés dans le trousseau du système, pas dans la base des données scolaires.

## Ensuite

- La barre latérale liste les pages disponibles pour ton compte (voir [Modules](/welcome/modules)).
- `Ctrl/⌘ + K` ouvre la palette de commandes, pour aller partout au clavier (voir [Raccourcis clavier](/welcome/raccourcis-clavier)).
- `Ctrl/⌘ + ,` ouvre les [Paramètres](/welcome/parametres).
- Pour ajouter un autre compte ou gérer les services liés, voir [Comptes et services](/welcome/comptes-et-services).

