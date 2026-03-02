# Bon Cœur Backend

API backend en TypeScript (Bun + Express + Drizzle) organisée en **architecture hexagonale**.

## Architecture cible

Le backend suit strictement le modèle suivant par module métier :

- `core/` : logique métier, modèles, ports, règles de domaine.
- `inbound/` : points d'entrée (HTTP REST, API serveur, handlers).
- `outbound/` : adaptateurs techniques (PostgreSQL, Drizzle, services externes).

Chaque module (`auth`, `users`, `products`) possède cette structure et son `index.ts` joue le rôle de **composition root** (assemblage des dépendances entre core/inbound/outbound).

## Lancer le projet

```bash
bun install
bun run src/index.ts
```

## Scripts utiles

```bash
bun test
bun run db:up
bun run db:push
```
