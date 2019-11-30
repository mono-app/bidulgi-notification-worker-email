const nodemailer = require('nodemailer');

class EmailAPI {
  async static sendEmail(smtpHost, smtpPort, smtpUsername, smtpPassword, recipientEmail, title, content){
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

    try{
      const info = await transporter.sendMail(mailOptions)
      console.log(info)
    }catch(err){
      throw new CustomError(err.code, err.message)
    }
   
  }
}

module.exports = EmailAPI