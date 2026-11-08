---
title: Dépannage
slug: depannage
description: Résoudre les problèmes de connexion, de synchronisation et de développement.
featured: false
---

Cette page regroupe les problèmes qu'on rencontre le plus souvent. Pour un bug qui n'est pas ici, ouvre une issue avec le modèle « Bug » en joignant le journal (voir [Contribuer](/develop/contribuer)).

## La connexion PRONOTE échoue

- Vérifie que l'adresse ou la ville est celle de ton établissement.
- Si PRONOTE a bloqué ton adresse après trop de tentatives, attends quelques minutes avant de réessayer.
- Si la double authentification est demandée, réponds dans le délai indiqué.
- Si la fenêtre ENT ne se ferme pas ou ne revient pas, relance Piéride.

La connexion PRONOTE n'a pas encore été validée sur les trois systèmes. Un échec n'est pas forcément ta faute : copie le journal (**Paramètres > Piéride > Développeur**) dans ton signalement.

## « Le trousseau n'est pas disponible » (`keyring_unavailable`)

Piéride ne peut pas enregistrer les identifiants sans trousseau :

- **Linux** : installe et active un service de trousseau compatible Secret Service (GNOME Keyring, ou KWallet). Sous WSL, il n'y en a pas par défaut.
- **Windows** : le Gestionnaire d'identification doit être accessible.
- **macOS** : le Trousseau doit être déverrouillé.

## Une donnée n'est pas à jour

- Appuie sur `Ctrl/⌘ + R`. Si rien ne change, tu as peut-être synchronisé il y a moins de 5 minutes.
- Si la donnée a plus de 30 minutes, elle est redemandée au prochain lancement ou toutes les 30 minutes.
- Si le service demande une reconnexion, la barre latérale et **Paramètres > Compte > Comptes liés** l'indiquent.

## Un module a disparu

Soit tu l'as masqué, soit le compte n'a pas de service qui le fournit. Vérifie **Paramètres > Barre latérale**. Une page masquée affiche « Page introuvable » : reviens à l'Accueil.

## L'icône n'apparaît pas dans la barre des tâches

- **GNOME** : l'icône demande l'extension AppIndicator. Sans elle, l'icône n'apparaît pas.
- **WSLg** : la zone de notification n'est pas affichée.

## Fermer la fenêtre ne quitte pas l'app

C'est le réglage **Démarrage > Fermer la fenêtre réduit dans la barre des tâches**, désactivé par défaut. Une fenêtre cachée ne revient qu'en relançant Piéride. Sous GNOME sans AppIndicator, l'icône manque : désactive ce réglage pour ne pas perdre la fenêtre.

## Les notifications n'apparaissent pas sous macOS en développement

En `pnpm tauri dev`, macOS attribue les notifications au Terminal. Autorise les notifications pour le Terminal, ou teste avec l'app compilée (`.app`).

## Le coup d'oeil du cours sous Linux

Sous Linux, le cours actuel et le suivant n'apparaissent que dans le menu de l'icône : la barre ne transmet pas toujours le clic ni l'info-bulle. C'est une limite connue.

## Un raccourci clavier ne répond pas

Les raccourcis n'ont pas encore été testés sur les trois systèmes. Précise ton système, ta disposition de clavier et la touche tapée dans ton signalement.

## Problèmes de développement

### `corepack enable pnpm` échoue

Sous Node 25 ou plus, installe Corepack d'abord : `npm install -g corepack`.

### Les tests ne voient pas une nouvelle migration

Vitest garde en cache l'ancienne liste des migrations. Après l'ajout d'un fichier dans `src/database/migrations/`, supprime le cache : `rm -rf node_modules/.vitest-cache`, puis relance `pnpm test`.