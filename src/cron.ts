// Run every 15min
import { CronJob } from "cron";
import {
  flushUserMessagesCounterCache,
  userMessagesCounterCache,
} from "./globals";
const eventJob = new CronJob(
  "* */15 * * * *",
  function () {
    // console.log("You will see this message every second");
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
