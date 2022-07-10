const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');

module.exports = class debaterping extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "debaterping",
      description: `Sends out a ping to all debaters`,
      usage: `${client.config.prefix}debaterPing reason`,
      permLevel: "Stage Host",
      aliases: ["dp"]
    });
  } async run(message, args) {
    try {
      const debaterRole = message.guild.roles.cache.find(r => r.id === IDs.role.debater);
      message.channel.send("<@&" + debaterRole + "> " + args.join(" "));
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};