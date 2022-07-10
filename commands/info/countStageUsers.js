const WeebCommand = require("@base/WeebCommand.js");
const defaultError = require('@utils/defaultError');

module.exports = class countstageusers extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "countstageusers",
      description: `Counts current number of users on stage\n
                         Available for everyone`,
      usage: `${client.config.prefix}countstageusers`,
      aliases: ["csu"]
    });
  } async run(message) {
    try {
      await message.guild.channels.cache.forEach(channel => {
        if (channel.type === "GUILD_STAGE_VOICE") {
          message.channel.send(`${channel.name}: ${channel.members.size} `);
        }
      });

    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};