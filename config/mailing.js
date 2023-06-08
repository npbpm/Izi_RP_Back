var nodemailer = require('nodemailer');

// on definit une fonction asynchrone qui s appelle mailer
const mailer = async () => {
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
    subject: 'Sending Email using Node.js',
    text: 'That was easy!' // doit contenir le message écrit dans le champ 'message'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.send('Une erreur s\'est produite lors de l\'envoi de l\'e-mail');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('L\'e-mail a été envoyé avec succès');

    }
  });
}
module.exports = mailer;