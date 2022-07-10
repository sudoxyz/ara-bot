const WeebCommand = require("@base/WeebCommand.js");
const Discord = require('discord.js');
const defaultError = require('@utils/defaultError');

module.exports = class balance extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "balance",
      description: `Check how much ARA someone has via the \`${client.config.prefix}balance\` command.`,
      usage: `${client.config.prefix}balance [@mention]`,
      aliases: ["bal"],
      category: "Economy",
    });
  } async run(message, args) {
    try {
      const isMention = (mention) => {
        const matches = mention.match(/^<@!?(\d+)>$/);
        if (!matches) return false;
        const id = matches[1];
        return id;
      };
      let user = message.author;
      if (args.length >= 1) {
        let id = isMention(args[0]);
        if (id) {
          user = this.client.users.cache.get(id);
        }
      }
      let BotAvatar = this.client.user.avatarURL() ? this.client.user.avatarURL() : "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
      const Ebalance = new Discord.MessageEmbed()
        .setColor('#ffd014')
        .setAuthor(`ARA Bank`, `${BotAvatar}`)
        .setDescription(`${user.username} has ${this.client.dbusers.getBalance(user.id)} ARA`);
      message.channel.send({ embeds: [Ebalance] });
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }

};
