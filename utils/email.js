const nodemailer = require('nodemailer');
      
const sendEmail = async (options) => {
    // const transport = nodemaile.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     auth: {
    //         user: process.env.EMAIL_USERNAME,
    //         pass: process.env.EMAIL_PASSWORD
    //     }
    // });

    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "f1f1613a3a65a4",
          pass: "308981257599de"
        }
      });

    const mailOptions = {
        from: 'Haim Ishta <hello@haim.io>',
        to: options.email,
        subject: options.subject,
        text: options.text
        //html
    }

    await transport.sendMail(mailOptions)
}

module.exports = sendEmail