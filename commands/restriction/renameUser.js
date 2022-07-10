const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class renameuser extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "renameuser",
      description: `Changes the name of the user to whatever you type after their name\n
                        Aliases: ru\n
                        Available only to Staff and Mods`,
      usage: `${client.config.prefix}renameuser @mention/id new name`,
      aliases: ["ru"],
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
      args.shift(0);

      await user.setNickname(args.join(" ")).catch(error => console.log(error));
      message.react("✅");
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};