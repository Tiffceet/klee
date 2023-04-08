// Run every 15min
import { CronJob } from "cron";
import {
  flushUserMessagesCounterCache,
  userMessagesCounterCache,
} from "./globals";
import { initServerEvent } from "./controllers/serverEvent";
const eventJob = new CronJob(
  // "*/15 47 * * * *",
  "0 */15 * * * *",
  function () {
    console.log("Initiating server event...")
    initServerEvent();
  },
  null,
  true,
  "America/Los_Angeles"
);

const messageCounterJob = new CronJob(
  "0 * * * * *",
  function () {
    // Flush messageCount
    console.log("Flushing user message count");
    flushUserMessagesCounterCache();
  },
  null,
  true,
  "America/Los_Angeles"
);

// const debugCronJob = new CronJob(
//   "* * * * * *",
//   function () {
//     console.log(JSON.stringify(userMessagesCounterCache));
//   },
//   null,
//   true,
//   "America/Los_Angeles"
// );

export function startAllCronJobs() {
  eventJob.start();
  messageCounterJob.start();
  // debugCronJob.start();
}
