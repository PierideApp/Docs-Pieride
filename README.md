# Documentation Piéride

Le code du site est à la racine : `src/`, `public/`, `scripts/` et `package.json`.

- [`docs/`](docs/) contient les catégories, articles Markdown et médias éditoriaux.
- [`design/`](design/) rassemble la fiche composants, la palette et les règles visuelles.
- [`.agents/skills/pieride-docs/SKILL.md`](.agents/skills/pieride-docs/SKILL.md) décrit l’identité et le fonctionnement du site.

## Aperçu et compilation

Lance `npm run dev` depuis la racine, puis ouvre <http://localhost:3000> ou <http://127.0.0.1:3000>.

Pour générer le site statique : `npm run build`. Le dossier `out/` est prêt pour GitHub Pages.

Le déploiement est défini dans `.github/workflows/deploy.yml`. Dans GitHub, règle **Settings → Pages → Build and deployment → Source** sur **GitHub Actions**. Le workflow construit le site puis le publie sous l’adresse `github.io` du dépôt, avec le chemin du dépôt ajouté automatiquement.

## Modifier la documentation

Chaque dossier de `docs/` représente une catégorie. Il contient un `category.json`, un fichier `.md` par article et un dossier `assets/<nom-de-l-article>/` pour ses images. Les pages et les images sont servies directement depuis `docs/`.

Le champ facultatif `slug` dans le frontmatter conserve une URL existante si le nom du fichier diffère. La publication sur un site distant dépend du déploiement configuré pour le projet.
