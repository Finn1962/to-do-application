const { mailTransporter } = require("../services/mailer.js");

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

module.exports = { sendVerificationMail };
