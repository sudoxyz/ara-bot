const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class textverify extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "textverify",
      description: `Gives a user the text-verifying role`,
      usage: `${client.config.prefix}textverify @mention/id`,
      aliases: ["txtv"],
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

    await user.roles.add(IDs.role.textVerifying);
      message.react("✅");
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};