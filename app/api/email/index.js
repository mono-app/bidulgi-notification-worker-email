const nodemailer = require('nodemailer');

class EmailAPI {
  static sendEmail(smtpHost, smtpPort, smtpUsername, smtpPassword, recipientEmail, title, content, resultFunc){
    var transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: true, // use TLS
      auth: {
             user: smtpUsername,
             pass: smtpPassword
         }
     });
     const mailOptions = {
      from: smtpUsername, // sender address
      to: recipientEmail, // list of receivers
      subject: title, // Subject line
      html: content// plain text body
    };

    transporter.sendMail(mailOptions, function(err, info){
      resultFunc(err, info)
    })
  }
}

module.exports = EmailAPI