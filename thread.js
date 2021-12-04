const axios = require('axios')

const getGroup = async (id) => {
  return (await axios.get('https://groups.roblox.com/v1/groups/' + id)).data
}
const { Webhook } = require('discord-webhook-node')
const startThread = async ({ webhook, thread, rate }, isDirectThread) => {
  const hook = new Webhook(webhook);
  await hook.send(`[THREAD ${thread}] Starting...`);
  let id;

  const upID = () => { id = Math.floor(Math.random() * (10000000 - 1000) + 1000) };

  let i = 25;

  let ignore = 0;

  setInterval(async () => {
    try {
      if (ignore > 0) {
        ignore--;
        console.log(`[THREAD ${thread}] IGNORED RUN - ${ignore} IGNORES LEFT`)
        return;
      };
      i++;
      if (i >= 25) {
        i = 0;
        hook.send(`[THREAD ${thread}] Randomizing ID...`)
        upID();
      } else {
        id = id + 1;
      }
      const group = (await getGroup(id))
      if (group.owner) return console.log(`[THREAD ${thread}] Group ${id} has an owner already!`);
      if (group.publicEntryAllowed === false) return console.log(`[THREAD ${thread}] Group ${id} is locked!`);
      console.log('FOUND!!!' + id)
      const y = (`[THREAD ${thread}] GROUP FOUND!\n>>> ID: ${id}\nNAME: ${group.name}\nDESCRIPTION: ${group.description}\nISBCONLY: ${group.isBuildersClubOnly} (if its true ill be suprised)` + (shout ? `\nSHOUT: \`${group.shout.body}\` Posted by ${group.shout.displayName} (${group.shout.username}/${group.shout.userId})` : '') + `\nLINK: https://roblox.com/groups/${group.id}/​`)
      console.log(y);
      hook.send(y);
    } catch (e) {
      console.error(`[THREAD ${thread} - ID ${id} / I ${i}]`,e.toString());
      if (e.toString().includes('429')) {
        ignore = 120
      } else {
        ignore = 3
      }
      hook.send(`[THREAD ${thread}] ERROR!\n${e}\nIGNORING FOR ${ignore} RUNS`)
    }
  }, (1 / Number(rate)) * 1000)
};
module.exports = startThread;