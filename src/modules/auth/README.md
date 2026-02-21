# Module Auth

## TODO – Auth complet

Coche au fur et à mesure pour avoir un auth complet :

- [ ] **DB** : Tables créées en base (`bun run db:up` puis `bun run db:push`)
- [ ] **Tests manuels** : Sign-up, sign-in, get-session, sign-out testés (JSON valide + cookies)
- [ ] **CORS** (si front sur autre origine) : `trustedOrigins` dans la config + CORS Express avec `credentials: true`
- [ ] **Routes protégées** : Middleware ou helper qui utilise `auth.api.getSession` + `fromNodeHeaders` et renvoie 401 si non connecté
- [ ] **Vérification email** (optionnel) : Activer et configurer le flux email verification dans Better Auth si besoin
- [ ] **Mot de passe oublié** (optionnel) : Activer le flux "forgot password" dans la config Better Auth
- [ ] **Rate limiting** (optionnel) : Limiter les tentatives de connexion / inscription par IP ou par compte
- [ ] **Logs / monitoring** (optionnel) : Logger les échecs de connexion ou les inscriptions pour la sécurité

---

## Déjà en place

- **Architecture hexagonale** : `core/` (config, models, ports), `inbound/` (REST, server API), `outbound/` (Drizzle).
- **Config** `core/auth.config.ts` : Better Auth avec adapter injecté, email/password, baseURL.
- **Routes REST** : handler monté sur `/api/auth` (sign-in, sign-up, sign-out, session, etc.).
- **Schéma DB** : tables `user`, `session`, `account`, `verification` dans `src/db/schema.ts`.
- **Chemins serveur** : `/`, `/api/auth` (AUTH_BASE_PATH), etc.

---

## À faire pour un auth pleinement fonctionnel

### 1. Créer les tables en base

Le schéma existe en code mais les tables doivent exister en PostgreSQL.

**Option A – Drizzle (recommandé)**  
À la racine du serveur :

```bash
bun run db:push
```

Création directe des tables à partir de `src/db/schema.ts`.

**Option B – Migrations**  
Si tu utilises des migrations :

```bash
bun run db:generate   # génère les migrations
# puis appliquer (ex. drizzle-kit migrate ou ton script)
```

Vérifier que la base tourne avant (`bun run db:up` si Docker).

---

### 2. Tester les endpoints auth

- **Inscription** : `POST /api/auth/sign-up/email`  
  Body : `{ "email": "...", "password": "...", "name": "..." }`
- **Connexion** : `POST /api/auth/sign-in/email`    
  Body : `{ "email": "...", "password": "..." }`
- **Session** : `GET /api/auth/get-session` (avec les cookies renvoyés après sign-in)
- **Déconnexion** : `POST /api/auth/sign-out`

Tester avec un client HTTP (Postman, curl, fetch) en gardant les cookies.

**Important :** Les requêtes avec body (sign-up, sign-in) doivent envoyer du **JSON valide** avec l’en-tête `Content-Type: application/json`. Sinon tu peux avoir une erreur du type « JSON Parse error: Expected '}' ». Vérifier : pas de virgule en trop, clés et chaînes entre double quotes, body complet. Ex. avec `fetch` : `body: JSON.stringify({ email, password, name })`.

---

### 3. (Optionnel) CORS et origine front

Si le front est sur un autre domaine (ex. `http://localhost:5173`) :

- Dans **`core/auth.config.ts`** : ajouter `trustedOrigins: ["http://localhost:5173"]` dans l’objet passé à `betterAuth()`.
- Sur **Express** : activer CORS avec `credentials: true` et la même origine pour les requêtes auth.

---

### 4. (Optionnel) Routes protégées

Pour protéger des routes côté serveur (ex. “utilisateur connecté uniquement”) :

- Importer **`fromNodeHeaders`** depuis **`better-auth/node`** et **`auth`** depuis **`modules/auth`**.
- Dans le handler de la route :  
  `const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });`  
- Si `session` est null → 401 Unauthorized, sinon continuer avec `session.user`.

---

### 5. (Optionnel) API serveur

**`authServerApi`** (exporté par le module auth) expose `signInEmail` etc. pour des appels côté serveur (cron, scripts, autre API). Pas obligatoire pour le flux navigateur, qui passe par `/api/auth/*`.

---
