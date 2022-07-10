const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class unveg extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "unveg",
      description: `Removes a users' veg curious role`,
      usage: `${client.config.prefix}unveg @mention/id`,
      aliases: [],
      permLevel: "Stage Host"
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

    await user.roles.remove(IDs.role.vegCurious);
      message.react("✅");
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};