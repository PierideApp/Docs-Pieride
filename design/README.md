# Design de la documentation Piéride

Ce dossier rassemble les références durables du langage visuel du site. La fiche complète est dans references/composants.pdf ; ses couleurs sont aussi reprises dans tokens.json pour faciliter les adaptations du code.

Les visuels nécessaires au rendu du site restent dans public/brand/, public/visuels/ et public/fonts/. Les guides consacrés aux écrans et à l'identité visuelle de l'application sont dans docs/designer/.

## Intention

- Une documentation accueillante et immédiatement reconnaissable comme Piéride.
- Une barre latérale violette constante en thème clair comme en thème sombre.
- Une zone de lecture neutre : claire en thème clair, gris anthracite en thème sombre.
- Des accents de catégorie utilisés avec parcimonie et ajustés pour rester lisibles.
- SN Pro pour la lecture et l'interface ; Unbounded pour les grands titres.
- Des animations courtes et discrètes, neutralisées par prefers-reduced-motion.

Le code de l'identité visuelle est appliqué dans src/app/globals.css ; les polices, logos et images utilisés par le site se trouvent dans public/.
