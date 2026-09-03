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

function sendVerificationMail({ username, email, verificationToken }) {
  const mailOptions = {
    from: "the.focus.todo@gmail.com",
    to: email,
    subject: "Your verification code for FOCUS TO-DO",
    html: `<p>Hello ${username}<br> 
        Your verification code is: <br>
        <strong>${verificationToken}</strong>`,
  };
  mailTransporter.sendMail(mailOptions, (error) => {
    if (error) {
      return console.error("Fehler beim Senden:", error);
    }
  });
}

mailTransporter.verify((error) => {
  if (error) {
    console.error("❌ Verbindungsfehler:", error);
  } else {
    console.log(
      "✅ Nodemailer ist bereit! Verbindung erfolgreich hergestellt.",
    );
  }
});

module.exports = { sendVerificationMail };
