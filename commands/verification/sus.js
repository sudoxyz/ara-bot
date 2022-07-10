const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class sus extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "sus",
      description: `Used to signify someone is suspicious and shouldn't be allowed on stage`,
      usage: `${client.config.prefix}sus @mention/id`,
      aliases: [],
      permLevel: "Verifier"
    });
  } async run(message, args) {
    try {
      const susTextChannel = message.guild.channels.cache.get(IDs.chat.susPeopleNotes);
      let user = await getUserFromMention(message, args[0]);
      if (!user && !args[0]) {
        console.log("couldn't find user");
        message.react("❌");
        return;
      }
      let id;
      if (args[0] && !user) {
        id = args[0];
        user = message.guild.members.cache.get(id);
        if (!user) {
          console.log("couldn't find user");
          return;
        }
      }
      if (user.roles.cache.has(IDs.role.verifier)) {
        console.log("target is a verifier");
        message.react("❌");
        return;
      }
      if (args.slice(1).join(' ').length <= 0) 
        return message.reply('You need to provide a reason for this suspicion.').then(() => message.react("❌"));
      await user.roles.add(IDs.role.sus);
      susTextChannel.send(
        `\`${message.author.username}:${message.author.id}\` thinks ${user.toString()} is very sus. ${args.slice(1).join(" ")}`
      );
      message.react("✅");
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};