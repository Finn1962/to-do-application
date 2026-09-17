const { Users } = require("../db/queries.js");
const cron = require("node-cron");

function accountsCleanup() {
  cron.schedule("*/10 * * * *", async () => {
    Users.deleteUnveriviedAccounts();
  });
}

function verificationTokenCleanup() {
  cron.schedule("*/10 * * * *", async () => {
    console.log("cleanup ausgeführt");
    Users.clearExpiredVerificationTokens();
  });
}

module.exports = { accountsCleanup, verificationTokenCleanup };
