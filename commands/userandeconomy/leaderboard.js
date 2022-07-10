const WeebCommand = require("@base/WeebCommand.js");
const Discord = require('discord.js');
const defaultError = require('@utils/defaultError');

module.exports = class leaderboard extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "leaderboard",
      description: `Top Ranks\n${client.config.prefix}leaderboard balance\n${client.config.prefix}leaderboard level\n${client.config.prefix}leaderboard xp\n
                         Available for everyone`,
      usage: `${client.config.prefix}leaderboard [level|balance|xp]`,
      aliases: ["lb"]
    });
  } async run(message, args) {
    try {
      try {
        await message.channel.messages.fetch(message.id)
          .then(message => message.delete()).catch(console.error); //it fetched the message - good
      } catch (error) {
        defaultError(error, message, this.client);
        //the message no longer exists and will be ignored
      }
      let avatar = message.author.avatarURL() ? message.author.avatarURL() : "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
      let SearchFor = "balance";
      if (args.length >= 1) {
        if (args[0] == "level") {
          SearchFor = "level";
        } else if (args[0] == "xp") {
          SearchFor = "xp";
        }
      }

      const SearchForName = SearchFor.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }
      );
      const users = this.client.dbusers;
      const leaderboardsDB = await users.getLeaderboard(10, SearchFor);
      let InLeaderboard = false;
      let result = leaderboardsDB.map((item, index) => {
        if (message.author.id == item.user_id) InLeaderboard = true;
        return `${index + 1} | ${item[`${SearchFor}`]} | ${this.client.users.cache.get(item.user_id)?.username ?? 'Hidden User'}`;
      });
      if (!InLeaderboard) result.push(`\n#${await users.getLeaderboardRank(message.author.id, SearchFor)} | ${users.getUser(message.author.id)[`${SearchFor}`]} | ${message.author}`);


      const Eleaderboard = new Discord.MessageEmbed()
        .setColor('#ffd014')
        .setAuthor(`${SearchForName} - LeaderBoard`, avatar)
        .setDescription(`\`Index   |   ${SearchForName}   |   Name\`\n\n\`\`\`js\n${result.join("\n") }\n\`\`\``);
      message.channel.send({ embeds: [Eleaderboard] });
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};
