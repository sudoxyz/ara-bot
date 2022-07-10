const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class plus extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "plus",
      description: `Gives a user the + role`,
      usage: `${client.config.prefix}plus @mention/id`,
      aliases: ["+"],
      permLevel: "Community Mod"
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

    await user.roles.add(IDs.role.plus);
      message.react("✅");
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};