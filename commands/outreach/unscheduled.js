const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');

module.exports = class unscheduled extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "unscheduled",
      description: `Pings the unscheduled outreach role\n
                    Aliases: none\n
                    Available only to Outreach Leaders`,
      usage: `${client.config.prefix}unscheduled`,
      aliases: [],
      permLevel: "Outreach Leader"
    });
  } async run(message) {
    try {
      message.channel.send("<@&" + IDs.role.unscheduled + ">");
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};