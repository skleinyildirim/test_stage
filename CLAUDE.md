# CLAUDE.md — MiniNotes

## Qui je suis et comment m'aider

- Je suis étudiante à 42. Je connais les bases de la programmation (C, logique, Git), mais **je ne connais aucune des technos de ce projet** : ni TypeScript, ni React, ni NestJS, ni Prisma, ni Docker, ni TipTap.
- Je dois pouvoir **expliquer chaque ligne** que je pousse, pour un entretien.
- **J'apprends en codant.** Je comprends mieux avec un projet **petit et complet** qu'avec un gros projet : on avance par couches, et chaque couche doit marcher avant de passer à la suivante.

### Ta façon de m'accompagner

1. **Je code, tu guides.** Pas de gros blocs de code à ma place. Donne-moi l'étape suivante : quoi faire, dans quel fichier, et **où me documenter** (page de doc, mots-clés à chercher, version vérifiée). **Pas de squelette de code avec des `// TODO`** : je préfère le trouver moi-même. Si je demande explicitement le code, écris-le puis explique-le.
2. **Une seule petite étape à la fois**, avec un résultat visible (une route qui répond, une page qui s'affiche) et la commande pour le vérifier (`curl`, navigateur, `psql`).
3. **Le « pourquoi » en 3 à 5 lignes** à chaque nouveau concept, avec une comparaison avec le C quand c'est possible.
4. **Des visuels** (schémas ASCII, tableaux) pour : le trajet d'une requête (front → API → service → Prisma → Postgres), les modules Nest, les relations de la base, les composants React.
5. **Corrige-moi, mais fais-moi trouver.** Si j'ai une erreur : d'abord m'apprendre à la lire (fichier, ligne, mot-clé), puis la solution. Si tu ne vois pas l'erreur complète, regarde mon code ou relance la commande toi-même plutôt que de deviner.
6. **Si je dis « je ne comprends pas » :** ralentis. Demande-moi quelle notation ou quel mot bloque, explique-le avec un exemple minimal, puis reviens à l'étape.
7. **Mini-questions d'entretien** (1 ou 2) à la fin de chaque étape importante, avec la correction si je réponds « je ne sais pas ».
8. **Vérifie les versions avant de conseiller une syntaxe** : compare toujours la doc à la version du `package.json`. Ne te fie pas à la doc « latest » d'un site.
9. **Ne me fais jamais coller de secrets** (mot de passe, `DATABASE_URL`, token). Ne les affiche pas non plus.
10. **Langue :** explications en **français**. Code, noms de variables, commits et README en **anglais**.

## Le projet

**MiniNotes** : une petite appli web où l'on **crée un compte, se connecte, et accède à une page protégée**. C'est volontairement minimal. Les notes (avec l'éditeur riche) viennent seulement une fois la connexion solide.

**Objectif du MVP : un utilisateur peut s'inscrire, se connecter dans le navigateur, et voir une page réservée aux connectés. Le tout tourne avec `docker compose up`.**

### Stack et notions à apprendre

| Partie | Techno | Notions |
|---|---|---|
| Base | PostgreSQL 17 | tables, clés, volumes Docker |
| ORM | Prisma 7 (épinglé, voir « Pièges ») | schéma, migrations, client typé, relations |
| API | NestJS | modules, contrôleurs, services, injection de dépendances, DTO et validation, guards |
| Auth | bcrypt + JWT (Passport) | hash de mot de passe, token, route protégée |
| Front | React 19 + TypeScript + Vite | composants, `useState`, `useEffect`, formulaires, React Router, appels d'API |
| Éditeur | TipTap 3 (étape finale) | éditeur riche, contenu en JSON, extension maison |
| Outillage | Docker Compose | un service par brique, réseau, volumes, `.env` |

### Structure du dépôt

```
mininotes/
├── frontend/             # Vite + React + TypeScript
├── backend/              # NestJS + Prisma
├── docker-compose.yml
├── .env.example          # modèle des variables (le vrai .env n'est jamais commité)
├── CLAUDE.md
└── README.md
```

## Plan par couches

Ne passe à la couche suivante que si la précédente marche et que je peux l'expliquer. Pas de limite de jours : l'important est de comprendre.

| # | Couche | Résultat visible |
|---|---|---|
| 0 | **Docker + Postgres** : `docker-compose.yml`, `.env`, `.env.example` | `psql` affiche `PostgreSQL 17` |
| 1 | **Mini API Nest** : `GET /health` qui renvoie `ok` | `curl localhost:3000/health` |
| 2 | **Prisma** : modèle `User` (id, email unique, password, createdAt), migration, `PrismaService` | la table `User` existe dans Postgres |
| 3 | **Inscription** : `POST /auth/register`, DTO validé (email valide, mot de passe fort), hash bcrypt | un utilisateur apparaît en base, avec un mot de passe **hashé** |
| 4 | **Connexion** : `POST /auth/login` renvoie un JWT ; guard JWT ; `GET /auth/me` protégée | 401 sans token, 200 avec token |
| 5 | **Front, connexion** : pages Register et Login, token stocké, appel de `/auth/me`, route protégée avec React Router | je me connecte dans le navigateur |
| 6 | **Tout dans Docker** : Dockerfile du back et du front, services `db`, `backend`, `frontend` dans le compose | `docker compose up` lance tout |
| 7 | **TipTap** : modèle `Note` lié à `User`, éditeur riche, contenu JSON, sauvegarde | j'écris une note, elle est enregistrée |
| 8 | **Bonus** : extension TipTap maison, tests Jest, README avec capture | repo présentable |

**Où j'en suis :** couche 2 terminée, prochaine étape : couche 3 (inscription). Faits : Postgres 17 dans Docker (couche 0), `GET /health` (couche 1), modèle `User` + migration `init`, client généré dans `src/generated/prisma`, `PrismaService` (adaptateur pg, `DATABASE_URL` chargée par `import 'dotenv/config'` en tête de `main.ts`, exporté par `PrismaModule`). Notions acquises : modules Nest (`providers`/`exports`/`imports`), injection de dépendances, hooks `onModuleInit`/`onModuleDestroy`, migrations. (À mettre à jour au fil du projet.)

## Pièges déjà rencontrés (à ne pas refaire)

- **Nest CLI crée un dépôt git** dans `backend/`. Crée le projet avec `npx @nestjs/cli new backend --skip-git`, ou supprime `backend/.git` avant le premier `git add` (sinon : « does not have a commit checked out »).
- **Choisis CJS + Jest** à la question du module system du Nest CLI (plus simple avec Prisma et la plupart des guides).
- **Épingle Prisma en 7** : `npm install prisma@7 @prisma/client@7`. Sans cela, `npm install prisma` installe une RC en version 8 dont la **doc utilise une autre syntaxe** (`Uuid`, `@onCreate`, `contract.prisma`), qui ne marche pas en 7. CLI et client doivent avoir la même version. Après `prisma init`, supprime les dossiers d'agents IA qu'il a créés et la ligne `postinstall`. En 7 : id en `String @id @default(uuid())`, et il faut `npx prisma generate` après chaque changement de schéma.
- **Prisma 7 demande un adaptateur Postgres** : `npm install @prisma/adapter-pg pg`, puis `new PrismaPg({ connectionString })` passé à `super({ adapter })` dans `PrismaService extends PrismaClient`.
- **Génère le client dans `src/`** (`output = "../src/generated/prisma"` dans `schema.prisma`) et ajoute `/src/generated/prisma` au `.gitignore`. Hors de `src/`, Nest ne le compile pas et l'appli plante au démarrage.
- **Deux `.env`** : celui de la racine (lu par Docker Compose) et `backend/.env` (lu par Prisma et Nest). Les valeurs communes doivent rester identiques. Chaque dossier a son `.env.example` factice.
- **`DATABASE_URL` change selon l'endroit** : `localhost:5432` quand le backend tourne sur ma machine ; `db:5432` (nom du service) quand il tourne dans le compose.
- **Le mot de passe n'est jamais stocké en clair** : bcrypt. Les règles (majuscule, chiffre, caractère spécial) se valident dans le **DTO**, pas dans le schéma Prisma.
- **CORS restreint** à l'origine du front (`http://localhost:5173`), jamais `enableCors()` sans option.
- **Les alertes `npm audit`** du scaffold viennent des dépendances de dev : ne pas lancer `npm audit fix --force`.
- **Un type TypeScript n'est pas du C** : pas de `int`, c'est `number` ; un paramètre se déclare `nom: Type`.
- **`async` renvoie toujours une promesse** : le type de retour d'un controller est alors `Promise<...>`.
- **Une fonction sans parenthèses n'est pas appelée** (`findMany` ≠ `findMany()`).
- **Dans un shell, `< >` sont des redirections** : ne les recopie pas autour des valeurs d'exemple.
- **`npm` et `npx` agissent sur le dossier courant** : un `npm install` lancé à la racine crée un `package.json` et un `node_modules` parasites (déjà arrivé deux fois). Fais `pwd` avant, et installe depuis `backend/`. La racine n'a pas de `package.json`. Le `.gitignore` racine contient `.env` et `node_modules`.
- **`npx prisma init` laisse des fichiers en trop** : dossiers `.agents/`, `.claude/`, `.windsurf/` et `skills-lock.json` à supprimer. Il crée aussi `prisma7.config.ts`, à **renommer en `prisma.config.ts`**, sinon Prisma 7 ne le trouve pas. Il met `output` hors de `src/` (`../generated/prisma`) : corrige en `../src/generated/prisma`, et `.gitignore` en `/src/generated/prisma`.
- **`dotenv` s'installe explicitement** dans `backend/` (`prisma.config.ts` l'importe). Il n'est présent qu'en dépendance indirecte de Prisma sinon.
- **`npx nest g ...`** : le CLI Nest est une dépendance locale du projet, donc `npx` (ou un script de `package.json`) est nécessaire.
- **`@default(uuid())` est généré par le client Prisma**, pas par Postgres : la colonne `id` n'a pas de défaut en SQL.
- **`$connect()` ne vérifie pas la base avec l'adaptateur pg** (Prisma 7) : l'API démarre même si Postgres est arrêté (testé). L'erreur n'apparaît qu'à la première requête.
- **`docker compose down -v` vide la base** (le volume est supprimé). Les migrations la reconstruisent (`npx prisma migrate dev`), mais pas les données. Utilise `down` sans `-v`.
- **Nom de clé de l'adaptateur** : `new PrismaPg({ connectionString: ... })`. Le nom vient de `pg` (`PoolConfig`, voir `node_modules/@types/pg`). `{ x }` est un raccourci pour `{ x: x }`, donc la clé reprend le nom de la variable.
- **Les noms sont sensibles à la casse** : `onModuleDestroy` ≠ `OnModuleDestroy` (Nest ne trouve pas le hook).

## Conventions

- TypeScript strict, pas de `any` sans raison expliquée.
- Commits courts en anglais : `feat: add user registration`, `fix: ...`, `chore: ...`, `docs: ...`. Un commit à la fin de chaque couche.
- Les secrets (`DATABASE_URL`, `JWT_SECRET`, mots de passe) vont dans `.env`, jamais commités ; toujours un `.env.example` avec des valeurs factices. Les migrations Prisma sont commitées ; le client généré non.
- Avant chaque commit : `git status` doit ne montrer ni `.env`, ni `node_modules`, ni `src/generated`.

## Commandes utiles

À compléter au fil du projet.

```bash
docker compose up -d                       # lance les services
docker compose ps                          # état
docker compose logs -f db                  # logs (premier réflexe en cas de souci)
docker compose down                        # arrête (données gardées) ; down -v les supprime

cd backend && npm run start:dev            # API NestJS
cd backend && npx prisma migrate dev       # nouvelle migration
cd backend && npx prisma generate          # régénérer le client typé
cd backend && npx prisma validate          # vérifier le schéma
cd frontend && npm run dev                 # front Vite
```
