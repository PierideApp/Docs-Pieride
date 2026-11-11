---
title: Installer Piéride
slug: installation
description: Télécharger la bêta publique de Piéride ou compiler l'application depuis ses sources.
featured: true
---

## Télécharger la bêta publique

La bêta `v0.1.0-beta.1` est ouverte. Elle inclut la connexion PRONOTE. ÉcoleDirecte et les autres services scolaires ne sont pas inclus dans cette version.

[Télécharger Piéride depuis GitHub Releases](https://github.com/PierideApp/Pieride/releases/latest)

Choisis le fichier correspondant à ton système :

| Système | Fichier |
| --- | --- |
| Windows 64 bits | `Pieride_0.1.0-beta.1_x64-setup.exe` |
| Windows ARM64 | `Pieride_0.1.0-beta.1_arm64-setup.exe` |
| macOS Intel et Apple Silicon | `Pieride_0.1.0-beta.1_universal.dmg` |
| Linux Debian ou Ubuntu, x86-64 | `Pieride_0.1.0-beta.1_amd64.deb` |
| Linux Debian ou Ubuntu, ARM64 | `Pieride_0.1.0-beta.1_arm64.deb` |
| Linux AppImage, x86-64 ou ARM64 | Fichier `.AppImage` correspondant à l'architecture |

La bêta est une version de test : des problèmes peuvent subsister et l'application évoluera. Tu peux d'abord la découvrir avec le compte de démo, sans renseigner tes identifiants scolaires. Les notes de version et les fichiers de téléchargement sont sur la [page de la bêta](https://github.com/PierideApp/Pieride/releases/latest).

## Compiler depuis les sources

Cette méthode s'adresse aux personnes qui souhaitent compiler Piéride elles-mêmes.

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
