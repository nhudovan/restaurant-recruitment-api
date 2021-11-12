import nodemailer from "nodemailer";
import systemConf from "../configs/system"

const SendEmail = async (options) => {

  let transport = nodemailer.createTransport({
    host: systemConf.SMTP_HOST,
    port: systemConf.SMTP_PORT,
    auth: {
      user: systemConf.SMTP_EMAIL,
      pass: systemConf.SMTP_PASS,
    },
  });
  let mailContent = {
    from: `${systemConf.FORM_NAME} <${systemConf.FORM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  await transport.sendMail(mailContent, err => {
        if (err) {
          console.error(err);
          console.log("Error!");
        } else {
          console.log("Sucess!");
        }
        transport.close();
  });
}

module.exports = SendEmail;

