const WeebCommand = require("@base/WeebCommand.js");
const { VoiceChannel } = require('discord.js');
const defaultError = require('@utils/defaultError');
var { IDs } = require('@utils/ids.js');

module.exports = class mvall extends WeebCommand {

  constructor(client) {
    super(client, {
      name: "moveme",
      description: `Sends message to another channel`,
      usage: `${client.config.prefix}moveme [channelId/#channel]`,
      aliases: ["mm"],
    });
  } async run(message, args) {
    let idList = [IDs.chat.vc1, IDs.chat.vc2, IDs.chat.vc3, IDs.chat.vc4, IDs.chat.vc5, IDs.chat.vc6, IDs.chat.vc7, IDs.chat.vc8, IDs.chat.vc9, IDs.chat.vc10];
    try {
      if(!message.member.roles.cache.has(IDs.role.patron)){
        message.react("❌");
        return;
      }else{
        let vcName;
        let vcCategoryName;
        if (args[0]) {
          vcName = args[0].replace(/_/g, " ");
        }
  
        if (args[1]) {
          vcCategoryName = args[1].replace(/_/g, " ");
        }
  
        // Move everyone to first occurence of VC named args[0]
        if (vcName) {
          const vc = message.guild.channels.cache.find((channel) => {
            if (vcCategoryName) {
              return (
                channel.name.toString().toLowerCase() == vcName.toString().toLowerCase() &&
                channel instanceof VoiceChannel &&
                channel.parent.name.toString().toLowerCase() == vcCategoryName.toString().toLowerCase()
              );
            }
            return (
              channel.name.toString().toLowerCase() == vcName.toString().toLowerCase() && channel instanceof VoiceChannel
            );
          });
          if (vc) {
            if(!idList.includes(vc.id)){
              message.react("❌");
              return;
            }
            if (!message.member.voice.channel) {
              return message.reply("you need to be in a voice channel to use that command.");
            }
            let author = await message.guild.members.cache.get(message.author.id);
            author.voice.setChannel(vc).catch(console.error);
          } else {
            const categoryString = vcCategoryName ? `${vcCategoryName.toUpperCase()}: ` : "";
            message.reply(`Voice channel \`${categoryString + vcName}\` not found.`);
          }
        }
      }
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};