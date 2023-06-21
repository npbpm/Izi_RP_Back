# IziRp

Web application developped for IziRP as an exercice for the 2023 Telecom St. Étienne PING series.

## Tech / Framework Used

This is a MEAN Fullstack app.

For this project we used:

- [Angular](https://angular.io/) v: 13.3.5
- Bootstrap v: 5.1.3
- Express v: 4.18.2
- [Node](https://nodejs.org/en) v: 17.4.0
- [MongoDB](https://www.mongodb.com/)

## ENV Variables

```bash

encryptionSecretKey: *-iziRPEncryptionSecretKey-*

jwtSecret: XRayConsultingSecret

mongoURI: mongodb+srv://dev:Ping2023Telecom@xray-consulting-db.sifkosj.mongodb.net/test?retryWrites=true&w=majority

mailPassword: jcxsgatshjjnqglf

```

## MongoDB

- Database User Info:

  - User: dev

  - Password: Ping2023Telecom

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install the dependencies.

### Backend packages installation:

```bash

npm install --force

```

### Frontend packages installation:

PRELIMINARY: You need to be located in the izi-rp folder

```bash

cd .\izi-rp\
npm install

```

Once everything is installed, you can go back to the project directory and start the server.

## Usage

### Admin Users

- Admin 1:

  - Email:
  - Password:

- Admin 2:
  - Email:
  - Password:

### Dev environment

To run the application locally, the front and back at the same time, use:

```bash

npm run dev

```

This may take a few minutes to start if its the first time you are running the app.

Once you have seen these two messages:

![alt text](https://github.com/npbpm/Izi_RP_Back/blob/main/README/mongoConnectedImg.PNG?raw=true)

![alt text](https://github.com/npbpm/Izi_RP_Back/blob/main/README/angularConnectedImg.PNG?raw=true)

It means everything is up and running!

Once you are inside the app, you will need an user and a password to connect to the site, these must be provided by [IziRP](https://izirpback.onrender.com/#/).

![alt text](https://github.com/npbpm/Izi_RP_Back/blob/main/README/loginImg.PNG?raw=true)

### Front Environment Only

To run the FrontEnd only, you can use:

```bash

npm run client

```

If everything went fine, this should open up the web tab with the front end.

### Back Environment Only

To run the BackEnd only, you can use:

```bash

npm run server

```

This will run the backend and connect you to the database directly (You must be whitelisted in MongoDB to have access).

## Credits

This project was developped as a final term project by a team of 4 members:

- Tobias Orth

  - [LinkedIn](https://www.linkedin.com/in/tobias-orth-7240511bb/)

- Nicolás Pérez

  - [LinkedIn](https://www.linkedin.com/in/nicolas-perez-burbano/)
  - [Github](https://github.com/npbpm)

- Houda Sbai

  - [LinkedIn](https://www.linkedin.com/in/hsbai)
  - [Email](Houdasbai67@gmail.com)

- Pierre Ya
  - [LinkedIn](https://www.linkedin.com/in/pierre-pov-ya/)
