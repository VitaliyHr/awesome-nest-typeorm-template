# Nest-Typeorm start template
## Getting started

### Setup

- copy `.env.sample` file as `.env` in project root
- fill the `.env` file


```bash
# 1. Clone the repository
git clone https://github.com/VitaliyHr/nest_typeorm_start_template.git

# 2. Enter your newly-cloned folder.
cd api

# 3. Install dependencies. (Make sure npm is installed: https://www.npmjs.com/package/npm)
npm install

# 4. Run development server and open http://localhost:8085
npm run start:dev
```
## Database

The example codebase uses [Typeorm](http://typeorm.io/) with a PostgreSQL database.

Create a new PostgreSQL database with the name `test` (or the name you specified in the .env)

On application start, tables for all entities will be created.


## Environment

Node Js - v14.17.1

PostgreSQL - v13.3
## Folder structure

src - main work directory

dist - work builds

test - directory with tests

src/core - main api components

src/config - api configuration

src/modules - api components

# Conventional Commits

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)

- `refactor`: A code change that neither fixes a bug or adds a feature
- `perf`: A code change that improves perfomance
- `test`: Adding missing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

## Example

Good:

```git
feat(user): integration ui
```

```git
test: add new unit-tests
```

```git
fix(admin): fix roots
```

Bad:

```git
new unit-tests
```

```git
fix bugs
```


## Scripts

```bash
# removes dist directory
$ npm run prebuild

# make nest build
$ npm run build

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# drop database
$ npm run schema:drop

# revert migrations
$ npm run migration:revert

# create migrations
$ npm run migration:create

# generate migrations
$ npm run migration:generate

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
