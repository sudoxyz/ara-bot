const WeebCommand = require("@base/WeebCommand.js");
const discord = require('discord.js');
const config = require('@root/config.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class profile extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'profile',
      description: `View players profile\n
                          Available for everyone`,
      usage: `${client.config.prefix}profile [@mention]`,
      aliases: ["p", "level", "xp"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      let userStats = null;
      let user = null;
      if (args.length >= 1) {
        let mention = await getUserFromMention(message, args[0]);

        if (mention) {
          userStats = this.client.dbusers.getUser(mention);
          user = this.client.users.cache.get(mention);
        }
      }
      if (userStats == null) {
        userStats = this.client.dbusers.getUser(message.author.id);
        user = message.author;
      }
      var dev = {};
      if (config.head_coder.includes(user.id)) {
        dev = 'Hey, look! It\'s the head coder! OwO';
      } else if (config.coder.includes(user.id)) {
        dev = 'Hey, look! That is a developer! UwU';
      } else if (config.bug_tester.includes(user.id)) {
        dev = 'Hey, BUG! There is a bug tester.... Somewhere';
      } else if (config.artist.includes(user.id)) {
        dev = 'Picture this. A artist';
      } else {
        dev = 'Looking good! :3';
      }
      var div = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.IsTMXEJ08LRvfGFpK7a0vgHaHa%26pid%3DApi&f=1";
      if (userStats.level >= 1 && userStats.level <= 5) {
        div = 'https://i.imgur.com/w8Ia22G.png';
      }
      else if (userStats.level >= 6 && userStats.level <= 10) {
        div = 'https://i.imgur.com/m7KczU4.png';
      }
      let avatar = message.author.avatarURL() ? message.author.avatarURL() : "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";

      //console.log(user.avatarURL());
      const Eprofile = new discord.MessageEmbed()
        .setColor('#5e0cb0')
        .setTitle('Profile')
        .setAuthor(`${user.username}`, `${avatar}`)
        .setThumbnail(`${div}`)
        .setImage(`${user.displayAvatarURL()}`)
        .addField(':sparkles:User Level:sparkles:', `Level ${userStats.level}`, true)
        .addField('User XP', `${userStats.xp} xp`)
        .setTimestamp()
        .setFooter(`${dev}`);
      message.channel.send({ embeds: [Eprofile] });
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};