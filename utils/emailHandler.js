const nodemailer = require("nodemailer") //it is node library use to send email 

const handleEmail = async (to, subject, text) => {  //this function hendle to send email
  try {
    const mailTransporter =  nodemailer.createTransport({  //it is use to send email mechanism
      service: "gmail",
      auth: {
        user: process.env.SENDER_MAIL_ADDRESS,
        pass: process.env.SENDER_MAIL_PASSWORD
      },
    });

    const mailOptions = {
      from: process.env.SENDER_MAIL_ADDRESS,
      to,
      subject,
      text,
    };

    const result = await mailTransporter.sendMail(mailOptions);
    return result.messageId;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

module.exports = handleEmail