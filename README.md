# IziRp

### Dev Commands

Run `npm run dev` pour initialiser au même temps le serveur et le coté client (FrontEnd)

Run `npm run server` pour initialiser que le server

Run `npm run client` pour initialiser que le coté client (FrontEnd)

## Server

Le server run sur le port 8000, l'URL est donc: http://localhost:8000/

Pour toute requête serveur on doit aller chercher en premier `/api`, exemple: `http://localhost:8000/api/user`

### DB

On utilise MongoDB comme service de database dans le cloud

Credentials pour accéder à la database:

username: dev

password: Ping2023Telecom

### Login sur le site

Pour l'instant on a deux utilisateurs, 1 utilisateur client et un 1 utilisateur admin

Utilisateur client:

username: anais.battut@orange.com

password: 1234

Utiisateur Admin:

username: nicoperez@gmail.com

password: Hello

### Nos Variables d'environnement

"mongoURI": "mongodb+srv://dev:Ping2023Telecom@xray-consulting-db.sifkosj.mongodb.net/test?retryWrites=true&w=majority"

"jwtSecret": "XRayConsultingSecret"

"encryptionSecretKey": "_-iziRPEncryptionSecretKey-_"

### .env file

```
mv .env.example .env

Contenu du fichier .env :
DB_CONNECTION=mysql

DB_HOST=127.0.0.1

DB_PORT=3306

DB_DATABASE=database

DB_USERNAME=root

DB_PASSWORD=

DB_FOREIGN_KEYS=true
```

# Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.

## Dev tools

`npm install -g @angular/cli`

`npm install bootstrap bootstrap-icons jquery --save @ng-select/ng-select@8.1.1`

`ng add @ng-bootstrap/ng-bootstrap`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
