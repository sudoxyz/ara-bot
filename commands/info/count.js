const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');

module.exports = class count extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "count",
      description: `Counts vegans or non-vegans\n
                         Available for everyone`,
      usage: `${client.config.prefix}count`,
      aliases: []
    });
  } async run(message) {
    try {
      let altRole = message.guild.roles.cache.find(role => role.id === IDs.role.alt);
      let vegansRole = message.guild.roles.cache.find(role => role.id === IDs.role.vegan);
      let nonVegansRole = message.guild.roles.cache.find(role => role.id === IDs.role.nonvegan);
      let count = vegansRole.members.size - altRole.members.size;
      let countNonVegans = nonVegansRole.members.size - altRole.members.size;
      message.channel.send("There are `" + count + "` Vegans in the server!");
      message.channel.send("There are `" + countNonVegans + "` Non-Vegans in the server!");

    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};