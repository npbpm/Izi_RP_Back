var nodemailer = require('nodemailer');

// on definit une fonction asynchrone qui s appelle mailer
const mailer = (userMail, message, firstName, lastName) => {
    //on crée un objet transporteur nodemailer qui contient les info de connexions
var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'jabrane252627@gmail.com', // a changer en : adresse de l'entreprise
      pass: 'jcxsgatshjjnqglf'  // a changer selon l'adresse de connexion
    }
  });

  var mailOptions = {
    from: 'jabrane252627@gmail.com', // adresse de l'utilisateur
    to: 'houdasbai67@gmail.com', // adresse de l'entreprise
    subject: `Mail envoyé par: ${lastName} ${firstName}`,
    text: `Mail du client: ${userMail} \n\ Message: ${message}` // doit contenir le message écrit dans le champ 'message'
  };
  var mailOptionsclient = {
    from: 'jabrane252627@gmail.com', // adresse de l'utilisateur
    to: userMail, // adresse de l'entreprise
    subject: 'Confirmation message reçu',
    text: 'Votre mail a bien été envoyé. Vous aurez une réponse dans les meilleurs délais !'  // doit contenir le message écrit dans le champ 'message'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      return(false);
    } else {
      console.log('Email sent: ' + info.response);

    }
  });
  transporter.sendMail(mailOptionsclient, function(error, info){
    if (error) {
      console.log(error);
      return(false);
    } else {
      console.log('Email sent: ' + info.response);
      return(true);

    }
  });
}
module.exports = mailer;