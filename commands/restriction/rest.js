const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class rest1 extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "rest1",
      description: `Sends a user to #the-void-1\n
                        Aliases: r1, rest\n
                        Available only to Staff and Mods`,
      usage: `${client.config.prefix}rest @mention/id`,
      aliases: ["r1", "rest"],
      permLevel: "Void Access"
    });
  } async run(message, args) {
    try {
      const restrictLogsChannel = await message.guild.channels.cache.get(IDs.chat.restrictedlogs);

      if (args.slice(1).join(' ').length <= 0) 
        return message.reply('You need to provide a reason for this restriction.').then(() => message.react("❌"));
      let user = await getUserFromMention(message, args[0]);
      if (!user && !args[0]) {
        await message.react("❌");
        return;
      }
      let id;
      if (args[0] && !user) {
        id = args[0];
        user = message.guild.members.cache.get(id);
        if (!user) {
          await message.react("❌");
          return;
        }
      }
      if (user.roles.cache.has(IDs.role.vegan)) {
        await message.react("❌");
        return;
      }

      await user.roles.remove(IDs.role.convinced).catch(console.error);
      await user.roles.remove(IDs.role.vegCurious).catch(console.error);
      await user.roles.remove(IDs.role.trusted).catch(console.error);
      await user.roles.remove(IDs.role.nonvegan).catch(console.error);
      await user.roles.remove(IDs.role.verifyAsVegan).catch(console.error);
      this.client.dbusers.updateRestricted(user.id, true);

      await user.roles.add(IDs.role.restricted);
      if(user.voice){
        await user.voice.disconnect().catch(console.error);
      }
      await restrictLogsChannel.send(args[0] + " was restricted for " + args.slice(1,args.length).join(" ") + " in channel <#" + message.channel + "> by <@" + message.author + ">");
      message.react("✅");
    } catch (error) {
      defaultError(error, message, this.client);
    }

  }
};