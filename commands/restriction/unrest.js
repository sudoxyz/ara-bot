const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class unrest extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "unrest",
      description: `Unrestricts a user, returning the non-vegan role\n
                    Available for Staff, Mods and void-access`,
      usage: `${client.config.prefix}unrest @mention/id`,
      aliases: ["ur"],
      permLevel: "Void Access"
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
          return;
        }
      }
      if (user.roles.cache.has(IDs.role.vegan)) {
        message.react("❌");
        return;
      }

    await user.roles.remove(IDs.role.restricted);
    await user.roles.remove(IDs.role.restricted2);
    await user.roles.remove(IDs.role.restricted3);
    await user.roles.remove(IDs.role.restricted4);

      this.client.dbusers.updateRestricted(user.id, false);
      this.client.dbusers.updateRestricted2(user.id, false);
      this.client.dbusers.updateRestricted3(user.id, false);
      this.client.dbusers.updateRestricted4(user.id, false);

    await user.roles.add(IDs.role.nonvegan);
      message.react("✅");
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};