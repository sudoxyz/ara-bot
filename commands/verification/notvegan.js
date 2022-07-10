const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');

module.exports = class notvegan extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "notvegan",
      description: `Used by new members to verify as non-vegan`,
      usage: `${client.config.prefix}notvegan`,
      aliases: ["nv"],
    });
  } async run(message) {
    try {
      const rulesAndConductTextChannel = message.guild.channels.cache.get(IDs.chat.rulesAndConduct);
      const rolesTextChannel = message.guild.channels.cache.get(IDs.chat.roles);
      if(message.channel.id == IDs.chat.welcomeRules || message.channel.id === IDs.chat.araExplanation || message.channel.id === IDs.chat.verification){
        if(!message.member.roles.cache.has(IDs.role.vegan)){
          await message.member.roles.remove(IDs.role.expectations);
          await message.member.roles.remove(IDs.role.verifyAsVegan);
          await message.member.roles.add(IDs.role.nonvegan);
        let channel = message.guild.channels.cache.find(channel => channel.id === IDs.chat.chat);
        channel.send(`<@${message.member.user.id}>, you have been verified! Please check ${rolesTextChannel.toString()} and remember to follow the ${rulesAndConductTextChannel.toString()} and to respect ongoing discussions and debates.`);
        }
      }
      return;
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};