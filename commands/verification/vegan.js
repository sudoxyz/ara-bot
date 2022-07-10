const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');

module.exports = class vegan extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "vegan",
      description: `Used by new members to proceed to vegan verification`,
      usage: `${client.config.prefix}vegan`,
      aliases: ["v"],
    });
  } async run(message) {
    try {
      if(message.channel.id == IDs.chat.welcomeRules){
        await message.member.roles.add(IDs.role.expectations);
        let channel = message.guild.channels.cache.find(channel => channel.id === IDs.chat.araExplanation);
        channel.send("<@" + message.member.user.id + ">");
        return;
      }
      if(message.channel.id === IDs.chat.araExplanation){
        await message.member.roles.remove(IDs.role.expectations);
        await message.member.roles.add(IDs.role.verifyAsVegan);
        let channel =message.guild.channels.cache.find(channel => channel.id === IDs.chat.verification);
        let msg = await channel.send("<@" + message.member.user.id + ">");
        try {
          await msg.channel.messages.fetch(msg.id)
            .then(msg => msg.delete()).catch(console.error); //it fetched the message - good
        } catch (error) {
          defaultError(error, msg, this.client);
          //the message no longer exists and will be ignored
        }
        return;
      }

    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};