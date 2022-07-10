const WeebCommand = require("@base/WeebCommand.js");
const defaultError = require('@utils/defaultError');
var { IDs } = require('@utils/ids.js');
var { clearAllMessages } = require('@utils/clearAllMessages.js');

module.exports = class cleartextverify extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "cleartextverify",
      description: `Clears the entire text verification channel and reposts the welcome message\n
                        Available to Mods and Verifiers only `,
      usage: `${client.config.prefix}cleartextverify`,
      aliases: ["ctv"],
      permLevel: "Verifier"
    });
  } async run(message) {
    try {
      let channel = await message.guild.channels.cache.find(channel => channel.id === IDs.chat.textverify);
      await clearAllMessages(channel);
      channel.send(`***Welcome to ARA!*** <:cow:886917135715151872> \n\nPrepare to be text verified`);
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};