const WeebCommand = require("@base/WeebCommand.js");
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class ban extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "kick",
      description: `Kicks a user from the server\n
                        Aliases: none\n
                        Available only to Staff`,
      usage: `${client.config.prefix}kick @mention/id`,
      aliases: [],
      permLevel: "Staff"
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
      if (!user.kickable) {
        message.send("This user is not kickable");
      } else {
        user.kick();
        message.react("✅");
      }
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};