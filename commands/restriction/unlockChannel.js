const WeebCommand = require('@base/WeebCommand');
const defaultError = require('@utils/defaultError');
var { IDs } = require('@utils/ids.js');

module.exports = class unlockchannel extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "unlockchannel",
      description: `Unlocks a channel\n
                         You can use #channel-name or channelId`,
      usage: `${client.config.prefix}unlockchannel [channelId/#channel]`,
      aliases: ["ulc"],
      permLevel: 'Stage Host'
    });
  } async run(message, args) {
    try {
      let listOfChannels = [IDs.chat.stage1, IDs.chat.stage2];
      let id = null;
      let channel;
      if (args.length >= 1) {
        channel = message.mentions.channels.first();
        if (!channel) {
          id = args[0];
        } else {
          id = channel.id;
        }
      }
      console.log(listOfChannels.includes(id));
      if(listOfChannels.includes(id)){
        let chan = await message.client.channels.cache.get(id);
        await chan.permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: null});
        await chan.send("Channel Unlocked");
        return;
      }
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};