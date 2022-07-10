const WeebCommand = require("@base/WeebCommand.js");
const defaultError = require('@utils/defaultError');

module.exports = class updatestats extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "updatestats",
      description: `Updates a previous Stats Entry\n
                         Available for Staff only (NEEDS WORK)`,
      usage: `${client.config.prefix}updatestats`,
      aliases: ["us"],
      permLevel: "Staff"
    });
  } async run(message, args) {
    try {
      let map = new Map([["seriouslyConsidered", args[1]], ["saidTheyWentVegan", args[2]],
      ["saidTheyWentVegan", args[3]], ["concededAntiVeganPosition", args[4]],
      ["thankedYou", args[5]], ["wouldWatchDocumentary",args[6]], ["changedPerspective", args[7]]]);
      this.client.dbstats.updateStats(args[0],map);

    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};