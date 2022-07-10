const WeebCommand = require("@base/WeebCommand.js");
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');
module.exports = class getallapplications extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "getallapplications",
      description: `Used to list all applications`,
      usage: `${client.config.prefix}getallapplications rolename/@user/user_id`,
      aliases: ["applications", "apps"],
      permLevel: "Staff"
    });
  } async run(message, args) {
    try {
      let listOfRoles = ["verifier", "debater", "b12", "voidaccess", "vegsupport",
        "outreachleader", "mediateam", "arateam", "humanrights"];
      args.forEach(async arg => {
        if(arg.toLowerCase() === "mod"){
          arg = "b12";
        }
        let user = await getUserFromMention(message, args[0]);
        if (!listOfRoles.includes(arg.toLowerCase()) && !user && !args[0].toString().size === 18) {
          message.channel.send(arg + " is not a role you can apply for.\n***Retry with one of these:***\n" + listOfRoles.join("\n"));
          return;
        } else if (user) {
          let appliedFor = await this.client.dbusers.getAllRolesAppliedFor(user.id);
          listOfRoles.forEach(role => {
            if (appliedFor && appliedFor[role] === 1) {
              if(role === "b12"){
                role = "mod";
              }
              message.channel.send(role);
            }
          });
          return;
        } else if (args[0].toString().length === 18) {
          let appliedFor = await this.client.dbusers.getAllRolesAppliedFor(args[0]);
          listOfRoles.forEach(role => {
            if (appliedFor && appliedFor[role] === 1) {
              if(role === "b12"){
                role = "mod";
              }
              message.channel.send(role);
            }
          });
          return;
        }
        let ids = await this.client.dbusers.getAllUsersAppliedForRole(arg.toLowerCase());
        ids.forEach(async id => {
          let u = await this.client.users.fetch(id.user_id);
          message.channel.send(`\`${u.username}: ${u.id}\``);
        });
      });
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};