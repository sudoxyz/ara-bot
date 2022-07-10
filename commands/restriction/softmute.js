const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class softmute extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "softmute",
      description: `Applies the softmute role which prevents users from reacting to messages\n
                    Available to Mods and Staff`,
      usage: `${client.config.prefix}softmute @mention/id`,
      aliases: ["sm"],
      permLevel: "Mod"
    });
  } async run(message, args) {
    try {
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
      if (user.roles.cache.has(IDs.role.vegan)) {
        message.react("❌");
        return;
      }
    await user.roles.add(IDs.role.softmute);
      message.react("✅");
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};