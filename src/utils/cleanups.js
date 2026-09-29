import { Users } from "../db/queries.js";

import cron from "node-cron";

function accountsCleanup() {
  cron.schedule("*/10 * * * *", async () => {
    Users.deleteUnveriviedAccounts();
  });
}

function verificationTokenCleanup() {
  cron.schedule("*/10 * * * *", async () => {
    Users.clearExpiredVerificationTokens();
  });
}

export { accountsCleanup, verificationTokenCleanup };
