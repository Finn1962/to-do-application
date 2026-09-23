const ejs = require("ejs");
const path = require("path");
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
  static async sendVerification({ username, email, verificationToken }) {
    const mailOptions = {
      from: "the.focus.todo@gmail.com",
      to: email,
      subject: "Your verification code",
      html: await ejs.renderFile(
        path.join(
          __dirname,
          "..",
          "views",
          "mailTemplates",
          "verificationMail.ejs",
        ),
        {
          username,
          verificationToken,
        },
      ),
    };
    mailTransporter.sendMail(mailOptions, (error) => {
      if (error) return console.error(error);
    });
  }

  static async sendPasswordReset({
    username,
    userId,
    email,
    verificationToken,
  }) {
    const resetLink = `${process.env.URL}/register/resetPassword/${userId}/${verificationToken}`;

    const mailOptions = {
      from: "the.focus.todo@gmail.com",
      to: email,
      subject: "Your password reset link",
      html: await ejs.renderFile(
        path.join(
          __dirname,
          "..",
          "views",
          "mailTemplates",
          "resetPasswordMail.ejs",
        ),
        {
          username,
          resetLink,
        },
      ),
    };
    mailTransporter.sendMail(mailOptions, (error) => {
      if (error) return console.error(error);
    });
  }

  static async sendPasswordChanged({ username, email }) {
    const mailOptions = {
      from: "the.focus.todo@gmail.com",
      to: email,
      subject: "Your password has Changed",
      html: await ejs.renderFile(
        path.join(
          __dirname,
          "..",
          "views",
          "mailTemplates",
          "passwordChangedMail.ejs",
        ),
        {
          username,
        },
      ),
    };
    mailTransporter.sendMail(mailOptions, (error) => {
      if (error) return console.error(error);
    });
  }
}

module.exports = { Mails };
