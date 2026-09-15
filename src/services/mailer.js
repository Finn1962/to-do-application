const nodemailer = require("nodemailer");
require("dotenv").config();

const mailTransporter = nodemailer.createTransport({
  pool: true,
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "the.focus.todo@gmail.com",
    pass: process.env.EMAIL_ACC_PASSWORD,
  },
});

class Mails {
  static sendVerification({ username, email, verificationToken }) {
    const mailOptions = {
      from: "the.focus.todo@gmail.com",
      to: email,
      subject: "Your verification code for FOCUS TO-DO",
      html: `<p>Hello ${username},<br> 
        Welcome to Focus To-Do! <br> <br>
        Your verification code is: <br>
        <strong>${verificationToken}</strong><br><br>
        Best regards,<br>
        FOCUS TO-DO</p>`,
    };
    mailTransporter.sendMail(mailOptions, (error) => {
      if (error) return console.error(error);
    });
  }

  static sendPasswordChanged({ username, email }) {
    const mailOptions = {
      from: "the.focus.todo@gmail.com",
      to: email,
      subject: "Your FOCUS TO-Do password has Changed",
      html: `<p>Hello ${username},<br> 
         <br>Your password for Focus To-Do has been changed.<br><br>
        Best regards,<br>
        FOCUS TO-DO</p>`,
    };
    mailTransporter.sendMail(mailOptions, (error) => {
      if (error) return console.error(error);
    });
  }
}

module.exports = { Mails };
