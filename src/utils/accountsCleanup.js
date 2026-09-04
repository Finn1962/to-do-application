const { Users } = require("../db/queries.js");
const cron = require("node-cron");

function accountsCleanup() {
  cron.schedule("*/10 * * * *", async () => {
    Users.deleteUnveriviedAccounts();
    console.log("Nodecron wurde ausgeführt");
  });
}

module.exports = { accountsCleanup };
