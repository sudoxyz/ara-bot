const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class toverify extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "toverify",
      description: `Gives a user the Verify-as-vegan role\n
                         Aliases: tv\n
                         Available to Mods and Verifiers`,
      usage: `${client.config.prefix}toverify @mention/id`,
      aliases: ["tv"],
      permLevel: "Veg Support"
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

      await user.roles.add(IDs.role.verifyAsVegan);
      message.react("✅");
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};
