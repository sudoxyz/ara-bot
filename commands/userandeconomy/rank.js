const WeebCommand = require("@base/WeebCommand.js");
const Discord = require('discord.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class rank extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "rank",
      description: `${client.config.prefix}rank [@mention]`,
      usage: `${client.config.prefix}rank`,
      aliases: []
    });
  } async run(message, args) {
    try {
      let userStats = null;
      let user = null;
      if (args.length >= 1) {
        let mention = await getUserFromMention(message, args[0]);

        if (mention) {
          userStats = this.client.dbusers.getUser(mention.id);
          user = this.client.users.cache.get(mention.id);
        }
      }
      if (userStats == null) {
        userStats = this.client.dbusers.getUser(message.author.id);
        user = message.author;
      }
      if(user){
        let avatar = user.avatarURL() ? user.avatarURL() : "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
        let percentage = userStats.xp / this.client.dbusers.xpnextstage(userStats.level);
        let AmountOfBlocks = Math.round(percentage * 10);
        //console.log(AmountOfBlocks);
        //console.log(percentage);
  
        const ERank = new Discord.MessageEmbed()
          .setColor("#8f5f2f")
          .setAuthor(`Rank - ${user.username}`, avatar)
          .setDescription(`Level: **${userStats.level}**\n[${'▮'.repeat(AmountOfBlocks)}${'▯'.repeat(10 - AmountOfBlocks)}] ${Math.round(percentage * 100)}%\nxp ${userStats.xp}/${this.client.dbusers.xpnextstage(userStats.level)}`);
        message.channel.send({ embeds: [ERank] });
      }
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};