const WeebCommand = require("@base/WeebCommand.js");
const { VoiceChannel } = require('discord.js');
const defaultError = require('@utils/defaultError');

module.exports = class mvall extends WeebCommand {

  constructor(client) {
    super(client, {
      name: "mvall",
      description: `Moves all users to the one specified\ni.e. Meeting_Room. Available to Staff only`,
      usage: `${client.config.prefix}mvall [channelId/#channel]`,
      aliases: ["mvall"],
      permLevel: 'Community Mod'
    });
  } async run(message, args) {
    try {
      let vcName;
      let vcCategoryName;
      if (args[0]) {
        vcName = args[0].replace(/_/g, " ");
      }

      if (args[1]) {
        vcCategoryName = args[1].replace(/_/g, " ");
      }

      console.log(vcName, vcCategoryName);

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
          console.log(vc);
          if (!message.member.voice.channel)
            return message.reply("you need to be in a voice channel to use that command.");

          message.member.voice.channel.members.forEach((member) => member.voice.setChannel(vc));

          // Moves everyone in the server (independently from the channel they're in)
          // ev.message.guild!.members.cache.each((member: GuildMember) => {
          //   if (member.voice.channel) member.voice.setChannel(vc);
          // });
        } else {
          const categoryString = vcCategoryName ? `${vcCategoryName.toUpperCase()}: ` : "";
          message.reply(`Voice channel \`${categoryString + vcName}\` not found.`);
        }
      }
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};
