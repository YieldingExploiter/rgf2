console.log(`Node ${process.version}`)
if (!process.version.startsWith("v16") && !process.version.startsWith("v17")) throw new Error("Try running on node16/17!")

const { webhook, threadCount, rate } = process.env;

if (!webhook) throw new Error("Please set the webhook secret!")
if (!threadCount) throw new Error("Please set the threadCount secret!")

const { spawn, Thread, Worker } = require("threads")

console.log('Starting %s threads', threadCount);
const ntc = Number(threadCount);
let thread = 0;
let interval = setInterval(async () => {
  thread++;
  if (thread >= threadCount) {
    console.log('Running with %s threads', threadCount)
    clearInterval(interval);
  }

  const _thread = await spawn(new Worker("./exposeThread"))
  _thread.startThread({
    webhook, thread, rate
  });
}, 1000)