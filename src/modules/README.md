# Architecture hexagonale des modules

Chaque module métier doit respecter la convention suivante :

```
modules/<module>/
  core/
  inbound/
  outbound/
  index.ts
```

## Règles

1. `core/` ne dépend jamais de `inbound/` ni de `outbound/`.
2. `inbound/` dépend du `core/` (ports/services), jamais directement de la DB.
3. `outbound/` implémente les ports définis dans `core/`.
4. `index.ts` assemble les dépendances (composition root) et exporte les entrées publiques du module.

Cette règle s'applique à tous les modules (`auth`, `users`, `products`) et sert de base d'évolution pour les nouveaux modules.
