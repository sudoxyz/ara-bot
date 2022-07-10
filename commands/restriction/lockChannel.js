const WeebCommand = require('@base/WeebCommand');
const defaultError = require('@utils/defaultError');
var { IDs } = require('@utils/ids.js');

module.exports = class lockchannel extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "lockchannel",
      description: `Locks a channel\n
                         You can use #channel-name or channelId\n
                         Only works on stage channels`,
      usage: `${client.config.prefix}lockchannel [channelId/#channel]`,
      aliases: ["lc"],
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
        chan.permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: false});
        chan.send(`Channel Locked\nPlease continue questions or debates in <#${IDs.chat.discussion1}> <#${IDs.chat.discussion2}> <#${IDs.chat.discussion3}> <#${IDs.chat.discussion4}> or join a VC`);
        return;
      }
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};