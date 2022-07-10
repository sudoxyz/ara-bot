const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class untrust extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "untrust",
      description: `Removes a users' trusted role\n
                         Available to Staff, Verifier, Mod and Veg Support`,
      usage: `${client.config.prefix}untrust @mention/id`,
      aliases: ["ut"],
      permLevel: "Verifier"
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

    await user.roles.remove(IDs.role.trusted);
      message.react("✅");
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};