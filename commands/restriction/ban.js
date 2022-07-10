const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class ban extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "ban",
      description: `Bans a user from the server\n
                        Aliases: none\n
                        Available only to Staff and Mods in the void`,
      usage: `${client.config.prefix}ban @mention/id`,
      aliases: [],
      permLevel: "Mod"
    });
  } async run(message, args) {
    try {
      const restrictLogsChannel = await message.guild.channels.cache.get(IDs.chat.restrictedlogs);
      if (args.slice(1).join(' ').length <= 0) 
        return message.reply('You need to provide a reason for this ban.').then(() => message.react("❌"));
      let user = await getUserFromMention(message, args[0]);
      if (!user && !args[0]) {
        message.react("❌");
        return;
      }
      let id;
      if (args[0] && !user) {
        id = args[0];
        user = message.guild.members.cache.get(id);
        if (!user) {
          message.react("❌");
          return;
        }
      }
      if (
        message.member.roles.cache.has(IDs.role.communityMod) && 
        !(user.roles.cache.some(role => [ 
            IDs.role.communityMod, 
            IDs.role.moderator,
            IDs.role.organizer
          ].includes(role.id)))) {
            await this.banUserFromServer(args, user, message, restrictLogsChannel);
            return;
      }
      let isMod = user.roles.cache.has(IDs.role.moderator);
      let isVegan = user.roles.cache.has(IDs.role.vegan);
      let modBanChannels = [IDs.chat.void1, IDs.chat.void2, IDs.chat.humanrights, IDs.chat.humanrights2];
      if (!isMod && !isVegan) {
        if (message.member.roles.cache.has(IDs.role.minimod) && modBanChannels.includes(message.channel.id)) {
          await this.banUserFromServer(args, user, message, restrictLogsChannel);
        } else if (message.member.roles.cache.has(IDs.role.moderator)) {
          await this.banUserFromServer(args, user, message, restrictLogsChannel);
        } else {
          message.react("❌");
        }
      } else {
        message.react("❌");
      }
    } catch (error) {
      defaultError(error, message, this.client);
    }

  }

  async banUserFromServer(args, user, message, restrictLogsChannel) {
    args.shift();
    await user.send("You have been banned from ARA: " + args.join(" ") + "\nhttps://challenge22.com/\nhttps://vegan.com/info/").catch(console.error);
    message.guild.members.ban(user.id);
    message.react("✅");
    await restrictLogsChannel.send("<@"+ user.id + ">" + " was banned for " + args.slice(0, args.length).join(" ") + " in channel <#" + message.channel + "> by <@" + message.author + ">");
  }
};
