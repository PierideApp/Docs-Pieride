---
title: Installer Piéride
slug: installation
description: Prérequis et lancement de Piéride depuis les sources.
featured: true
---

## Pour utiliser Piéride

Il n'existe pas encore de version à télécharger. Quand la première version sortira, les installeurs prévus sont :

| Système | Format                                     |
| ------- | ------------------------------------------ |
| Windows | installeur NSIS (x64 et arm64)             |
| macOS   | `.dmg` (universel, Intel et Apple Silicon) |
| Linux   | `.deb`, `.rpm`, AppImage (x64 et arm64)    |

Ces versions ne seront pas signées au départ : la signature Windows et la notarisation macOS sont prévues pour une future version. Le système peut donc afficher un **avertissement** à la première ouverture.

Pour l'instant, la seule façon de tester Piéride est de le compiler depuis les sources, comme décrit ci-dessous.

## Compiler depuis les sources

### Prérequis

- **Node.js 22 ou plus**
- **pnpm**, fourni par Corepack
- **Rust stable** (installé avec [rustup](https://rustup.rs))
- les **dépendances système de Tauri** : voir la [page des prérequis Tauri](https://v2.tauri.app/start/prerequisites/)

Sous Ubuntu, les paquets utilisés par la CI sont :

```bash
sudo apt-get install -y libwebkit2gtk-4.1-dev build-essential libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

Sous Fedora, les noms de paquets sont proches (`webkit2gtk4.1-devel`, `libappindicator-gtk3-devel`, `librsvg2-devel`, `openssl-devel`). Vérifie-les sur la page Tauri, qui reste la référence.

### Installer et lancer

```bash
corepack enable pnpm
pnpm install
pnpm tauri dev
```

Si `corepack enable pnpm` échoue sous Node 25 ou plus, installe Corepack d'abord : `npm install -g corepack`.

`pnpm tauri dev` lance l'interface avec Vite et ouvre la fenêtre. La première compilation Rust est longue.

### Données de test sans compte scolaire

Crée un compte hors ligne au premier lancement, puis ouvre **Paramètres > Piéride > Développeur** et clique sur **Attacher et remplir**. Des données fictives apparaissent (emploi du temps, devoirs, notes). Cette option n'existe qu'en développement : elle n'est pas dans l'app publiée.

### Compiler sans installeur

```bash
pnpm tauri build --no-bundle
```

Cette commande produit l'application complète sans installeur, en environ deux minutes. Elle sert à vérifier que la version de release compile, avec sa Content Security Policy active.

## Vérifier que tout marche

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
```

Et, si tu as touché au Rust :

```bash
cd src-tauri
cargo fmt --check
cargo clippy -- -D warnings
cargo test
```

## Problèmes à l'installation

Voir [Dépannage](/support/depannage).