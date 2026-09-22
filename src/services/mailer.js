const path = require("path");
const fs = require("fs");
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
  static #templatesDir = path.join(__dirname, "../mail-templates");

  static #_loadTemplate(templateName, variables = {}) {
    console.log("eins: ", __dirname);
    console.log("zwei: ", this.#templatesDir);
    const filePath = path.join(this.#templatesDir, `${templateName}.html`);

    let html = fs.readFileSync(filePath, "utf8");

    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      html = html.replace(regex, variables[key] ?? "");
    });

    return html;
  }

  static sendVerification({ username, email, verificationToken }) {
    const mailOptions = {
      from: "the.focus.todo@gmail.com",
      to: email,
      subject: "Your verification code",
      html: this.#_loadTemplate("verification-mail", {
        username,
        verificationToken,
      }),
    };
    mailTransporter.sendMail(mailOptions, (error) => {
      if (error) return console.error(error);
    });
  }

  static sendPasswordReset({ username, userId, email, verificationToken }) {
    const mailOptions = {
      from: "the.focus.todo@gmail.com",
      to: email,
      subject: "Your password reset link",
      html: `<p>Hello ${username},<br><br> 
         <a href="${process.env.URL}/register/resetPassword/${userId}/${verificationToken}">click here to reset your password.</a><br><br>
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
      subject: "Your password has Changed",
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
