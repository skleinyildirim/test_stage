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
├── .github/workflows/    # CI GitHub Actions (à créer)
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
| 6b | **CI** : workflow GitHub Actions `.github/workflows/ci.yml` (install, `prisma generate`, lint, build, tests) | un ✔ vert sur GitHub |
| 7 | **TipTap** : modèle `Note` lié à `User`, éditeur riche, contenu JSON, sauvegarde | j'écris une note, elle est enregistrée |
| 8 | **Bonus** : extension TipTap maison, tests Jest, README avec capture | repo présentable |

**Où j'en suis :** couche 4 presque terminée. **Contexte : entretien dans environ un jour et demi (à partir du 2026-11-06) ; priorité actuelle : préparer les questions CI/CD (cours en artifact + workflow `.github/workflows/ci.yml` sur ce dépôt), puis revenir aux couches.** Fait : `JwtStrategy`, `JwtAuthGuard` et route `GET /auth/me` écrits (ils compilent, à tester) ; paquets `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt` installés ; `JWT_SECRET` dans `backend/.env` et `backend/.env.example` ; `JwtModule.register` dans `AuthModule` (secret vérifié au démarrage, `expiresIn: 3600`) ; `LoginDto` ; `POST /auth/login` renvoie un `access_token` (testé avec `curl`). **Reste** : tester les deux 401 de `login` (mauvais mot de passe, email inconnu) et `GET /auth/me` (401 sans token ou avec un faux token, 200 avec un vrai token), puis commit de fin de couche. Avant : couche 3 terminée. Faits : Postgres 17 dans Docker (couche 0), `GET /health` (couche 1), modèle `User` + migration `init`, client généré dans `src/generated/prisma`, `PrismaService` (couche 2), `POST /auth/register` (couche 3) : `RegisterDto` validé (`@IsEmail()`, `@IsString()`, `@MinLength(8)`, `@Matches` mot de passe fort), `ValidationPipe` global dans `main.ts`, hash bcrypt (10 tours) dans `AuthService`, doublon d'email → `409 Conflict`. Notions acquises : modules Nest (`providers`/`exports`/`imports`), injection de dépendances, hooks `onModuleInit`/`onModuleDestroy`, migrations, DTO et validation, hash et sel, `try`/`catch` et exceptions HTTP. (À mettre à jour au fil du projet.)

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
- **`imports` d'un module n'accepte que des modules** : mets `PrismaModule` dans `imports`, pas `PrismaService` (`InvalidClassModuleException`). Ne suis pas le conseil « move to providers » du message : ça créerait une 2ᵉ instance.
- **Chaque fichier importe ce qu'il utilise** : `Cannot find name 'X'` (TS2304) = import manquant. Méfie-toi de l'auto-import de l'éditeur (il a ajouté `import { hash } from 'crypto'` à tort) : vérifie le paquet.
- **Les décorateurs `class-validator` s'écrivent avec parenthèses** : `@IsEmail()`, pas `@IsEmail`. Sans `ValidationPipe` global, ils ne vérifient rien (on a obtenu 201 avec un faux email).
- **`@Matches` : regex littérale, sans guillemets** : `/^...$/`. Avec `'/^...$/'` (texte), les `/` deviennent des caractères à trouver et tout mot de passe est refusé. Le message va dans un objet d'options en 2ᵉ argument.
- **`@Body()` sans argument = tout le corps** : un seul paramètre typé par un DTO (classe). Un type écrit en ligne est effacé à l'exécution et ne valide rien.
- **Prisma est paresseux** : `user.create(...)` sans `await` n'envoie rien à la base (0 ligne, aucune erreur).
- **Stocke la variable hashée, pas l'originale** : on a écrit `password: password` à la place de `password: hashPass`, donc le mot de passe était en clair en base. Le hash va dans le service, pas dans le contrôleur.
- **`catch (X)` ne filtre pas par type** : `X` n'est que le nom de la variable. Pour traiter un doublon : `error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'`, puis `throw new ConflictException(...)` ; relance les autres erreurs avec `throw error`. `Prisma` s'importe depuis `../generated/prisma/client.js`, pas depuis `@prisma/client`.
- **`DELETE FROM "User";` sans `WHERE` supprime toutes les lignes** : à n'utiliser qu'avec des données de test.
- **`\d "User"` montre la structure** de la table ; `SELECT ... FROM "User";` montre les lignes. N'affiche pas la colonne `password` sans raison.
- **Commande `curl` sur plusieurs lignes** : le `\` doit être le dernier caractère de la ligne (pas d'espace après), sinon mets tout sur une ligne.
- **`bcrypt.compare` est asynchrone : sans `await`, il renvoie une promesse toujours « vraie »**, donc n'importe quel mot de passe est accepté (bug de sécurité que TypeScript ne signale pas). Utilise `await`. Compare un mot de passe avec un hash par `compare`, jamais par `===` (le sel rend deux hash différents).
- **`private readonly` devant le paramètre du constructeur** pour qu'il devienne un champ (`this.jwt`). Sans, c'est une variable locale perdue après le constructeur.
- **`JwtModule` dans `imports` d'un module, `JwtService` dans le constructeur d'un service** : ne confonds pas les deux. `JwtService` vient de `@nestjs/jwt` : rien à générer avec `nest generate`.
- **`{ x }` est un raccourci réservé à un simple nom de variable** : `{ process.env.X }` est invalide, il faut `{ clé: process.env.X }`. La clé de `JwtModule.register` est `secret`, celle de `signOptions` est `expiresIn` (un nombre = secondes).
- **Vérifier une variable d'environnement dans un module** : fais-le au niveau du fichier, avant `@Module` (`const` + `if` + `throw`), pas dans les arguments du décorateur. `dotenv` est chargé en 1ʳᵉ ligne de `main.ts`, donc `process.env` est déjà rempli.
- **Un DTO par usage** : `RegisterDto` (mot de passe fort) pour l'inscription, `LoginDto` (`@IsEmail()`, `@IsString()` seulement) pour la connexion. Même message d'erreur (401) pour un email inconnu et un mauvais mot de passe.
- **Un JWT est signé, pas chiffré** : le payload (`sub`, `iat`, `exp`) est lisible par tous. N'y mets que l'id de l'utilisateur, jamais le mot de passe ni son hash.
- **`npm ls` n'installe rien** : il liste ce qui est déjà installé. `(empty)` = paquets pas encore installés.
- **Ne rappelle jamais `validate` toi-même** : Passport l'appelle après avoir vérifié le token (signature, expiration). Dans la route protégée, lis `req.user` (et non `req.userId`). Le guard décide si la requête passe, la stratégie dit comment vérifier, `validate` dit quoi garder.
- **CI : le client Prisma n'est pas commité** (`src/generated/prisma` est dans le `.gitignore`), donc le pipeline doit lancer `npx prisma generate` avant le build. Utilise `npm ci` (pas `npm install`) et `working-directory: backend`. Les secrets vont dans les GitHub Secrets, jamais dans le YAML.

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
