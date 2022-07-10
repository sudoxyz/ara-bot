const WeebCommand = require("@base/WeebCommand.js");
const defaultError = require('@utils/defaultError');

module.exports = class countstat extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "countstat",
      description: `Counts stats of different types\n
                    Types of stats include individual stats like ?cs saidTheyWentVegan or outreach types like ?cs STAGE\n
                    Available for everyone in the stats team`,
      usage: `${client.config.prefix}countstat statType/stat`,
      aliases: ["cs"],
      permLevel: "Stats Team"
    });
  } async run(message, args) {
    try {
      let listOfStats = ["saidTheyWentVegan", "seriouslyConsidered", "concededAntiVeganPosition", "thankedYou", "wouldWatchDocumentary", "changedPerspective"];
      let listOfTypes = ["STAGE", "UNSCHEDULED", "VC", "SCHEDULED", "all"];


      if (!args[0]) {
        message.channel.send(`Please specify a stat to count.\n***Retry with one of these:***\n ${listOfStats.join("\n")}`);
        return;
      }
      args.forEach(async arg => {
        if ((!listOfStats.includes(arg))) {
          if (!listOfTypes.includes(arg)) {
            message.channel.send(arg + " is not a role you can apply for.\n***Retry with one of these:***\n" + listOfStats.join("\n"));
            return;
          } else {
            let stat = await this.client.dbstats.countStatsByType(args[0]);
            console.log(stat);
            let test = `***Total Stats for stages:***\n`;
            let i = 0;
            listOfStats.forEach(s => {
              if (i === 0) {
                test += `${s}: \`${stat[s]}\``;
              } else {
                test += `\n${s}: \`${stat[s]}\``;
              }
              i++;
            });
            if (stat) {
              message.reply(test);
            } else {
              message.reply("No stats available");
            }
          }
        } else {
          let stat = await this.client.dbstats.countStats(args[0]);
          if (stat) {
            message.reply(stat.toString());
          } else {
            message.reply("No stats available");
          }
        }
      });
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};