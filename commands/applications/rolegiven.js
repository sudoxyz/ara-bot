const WeebCommand = require("@base/WeebCommand.js");
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class rolegiven extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "rolegiven",
      description: `Used to remove from applications list for a position\n
                    Available to Staff only`,
      usage: `${client.config.prefix}rolegiven @user/id role`,
      aliases: ["rolegiven"],
      permLevel: "Staff"
    });
  } async run(message, args) {
    let listOfRoles = ["verifier", "debater", "b12", "voidaccess", "vegsupport",
    "outreachleader", "mediateam", "arateam", "humanrights", "staff"];
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
      if(args[1].toLowerCase() === "mod"){
        args[1] = "b12";
      }
      if (!args[1] || !listOfRoles.includes(args[1].toLowerCase())) {
        message.channel.send(args[1] + " is not a role you can apply for.\n***Retry with one of these:***\n" + listOfRoles.join("\n"));
        return;
      }
      this.client.dbusers.removeApplication(user.id, args[1].toLowerCase());
      const modServerId = process.env.MOD_SERVER_GUILD_ID;

      let guild = this.client.guilds.cache.get(modServerId);
      const mirrorMsg = `${user} unapplied for the role ${args[1]}`;
      let channel = guild.channels.cache.find(channel => channel.name === args[1].toLowerCase());
      channel.send(mirrorMsg);
      message.react("✅");
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};