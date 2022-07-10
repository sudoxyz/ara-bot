const WeebCommand = require("@base/WeebCommand.js");
const defaultError = require('@utils/defaultError');
var { IDs } = require('@utils/ids.js');
var { clearAllMessages } = require('@utils/clearAllMessages.js');

module.exports = class welcome extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "welcome",
      description: `Clears the entire verification channel and reposts the welcome message\n
                        Available to Mods and Verifiers only `,
      usage: `${client.config.prefix}welcome`,
      aliases: [],
      permLevel: "Verifier"
    });
  } async run(message) {
    try {
      let channel = await message.guild.channels.cache.find(channel => channel.id === IDs.chat.verification);
      await clearAllMessages(channel);
      channel.send(`Welcome to **Voice Verification** for ***ARA***! :cow: 
      
If you're **NON-VEGAN** type \`?nv\` or \`?notvegan\` this will allow you into the server. 
      
If you're **Vegan** :seedling: , join one of the **Verification Voice Channels** and then type \`?verifyme\` once. 
      
Verifiers are volunteers, please be patient and wait for someone to join your voice channel. **No need to ping more than once.**`);
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};