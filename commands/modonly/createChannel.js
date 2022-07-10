const WeebCommand = require("@base/WeebCommand.js");
const defaultError = require('@utils/defaultError');
var { IDs } = require('@utils/ids.js');
var { clearAllMessages } = require('@utils/clearAllMessages.js');

module.exports = class createchannel extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "createchannel",
      description: `Does something`,
      usage: `${client.config.prefix}createchannel`,
      aliases: ["createchannel"],
      permLevel: "Staff"
    });
  } async run(message, args) {
    try {
      let channelName = args[0]; //Arguments to set the channel name
      let channel = await message.guild.channels.create(channelName, {
        type: "GUILD_TEXT", permissionOverwrites:[
          { id: IDs.user.bot, allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'] },
          { id: IDs.role.moderator, allow: ['VIEW_CHANNEL'] },
          { id: IDs.role.minimod, allow: ['VIEW_CHANNEL'] },
          { id: message.guild.id, deny: ['VIEW_CHANNEL'] },
          { id: IDs.role.communityMod, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] }]
      });
      await channel.setParent(IDs.chat.logsCategory, { lockPermissions: false });
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};