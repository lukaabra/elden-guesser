# NestJS API

## Features
- REST Express API
- JWT auth with blacklist
- Prisma ORM and PostgreSQL database
- Testing pipeline with Jest and Docker


## Running the app


Install the packages:

```bash
$ npm install
```
Create a `.env` file with the same structure as `.env.test` and start the server:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

Starts up a fresh test database container and runs the migrations every time before initializing tests.

```bash
$ npm run test
```
