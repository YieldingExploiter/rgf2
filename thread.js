const axios = require('axios')

const getGroup = async (id) => {
  return (await axios.get('https://groups.roblox.com/v1/groups/' + id)).data
}

const rate = 1 // groups / second

const { Webhook } = require('discord-webhook-node')
const startThread = async ({ webhook, thread }, isDirectThread) => {
  const hook = new Webhook(webhook);
  const tid = thread + 1;
  await hook.send(`[THREAD ${thread}] Starting...`);
  let id;

  const upID = () => { id = Math.floor(Math.random() * (10000000 - 1000) + 1000) };
  upID();

  let i = 0;

  let ignore = 0;

  setInterval(async () => {
    try {
      if (ignore > 0) {
        ignore--;
        console.log(`[THREAD ${tid}] IGNORED RUN - ${ignore} IGNORES LEFT`)
        return;
      };
      i++;
      if (i > 5) {
        i = 0;
        upID();
      } else {
        id = id + 1;
      }
      const group = (await getGroup(id))
      if (group.owner) return console.log(`[THREAD ${tid}] Group ${id} has an owner already!`);
      if (group.publicEntryAllowed === false) return console.log(`[THREAD ${tid}] Group ${id} is locked!`);
      console.log('FOUND!!!' + id)
      const y = (`[THREAD ${tid}] GROUP FOUND!\n>>> ID: ${id}\nNAME: ${group.name}\nDESCRIPTION: ${group.description}\nISBCONLY: ${group.isBuildersClubOnly} (if its true ill be suprised)` + (shout ? `\nSHOUT: \`${group.shout.body}\` Posted by ${group.shout.displayName} (${group.shout.username}/${group.shout.userId})` : '') + `\nLINK: https://roblox.com/groups/${group.id}/​`)
      console.log(y);
      hook.send(y);
    } catch (e) {
      console.error(e);
      hook.send(`[THREAD ${tid}] ERROR!\n${e}\nIGNORING FOR 20 RUNS`)
      ignore=30
    }
  }, (1 / rate) * 1000)
};
module.exports = startThread;