const WeebCommand = require("@base/WeebCommand.js");
const defaultError = require('@utils/defaultError');

module.exports = class deletestats extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "deletestats",
      description: `deletes a stats entry by id\n
                    Available to Staff only`,
      usage: `${client.config.prefix}deletestats`,
      aliases: ["ds"],
      permLevel: "Staff"
    });
  } async run(message, args) {
    try{
      if(args[0]){
        this.client.dbstats.deleteStats(args[0]);
      }
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};