const WeebCommand = require("@base/WeebCommand.js");
const Discord = require('discord.js');
const defaultError = require('@utils/defaultError');
var { IDs } = require('@utils/ids.js');
const config = require("../../config.js");

module.exports = class help extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "help",
      description: `Provides info about certain commands and their usage`,
      usage: `${client.config.prefix}help [command]`,
      aliases: []
    });
  }
  async getAllRolesRequired(command) {
    const allPermLevels = config.permLevels;
    let allStaffWithAccess = [];
    let minPerm;
    for(let lev of allPermLevels){
      if(command.conf.permLevel === lev.name){
        minPerm = lev.level;
      }
    }
    for(let l of allPermLevels){
      if(l.level >= minPerm){
        allStaffWithAccess.push(l.name);
      }
    }
    console.log(allStaffWithAccess);
    return allStaffWithAccess.slice(0, allStaffWithAccess.length-3);
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      var Ehelp = null;
      var prefix = this.client.config.prefix;
      let BotAvatar = this.client.user.avatarURL() ? this.client.user.avatarURL() : "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
      if (!args[0] && (message.member.roles.cache.has(IDs.role.minimod) || message.member.roles.cache.has(IDs.role.moderator)) || (args[0] &&(this.client.commands.get(args[0]) === undefined && !this.client.aliases.has(args[0].toString().toLowerCase()) && (message.member.roles.cache.has(IDs.role.minimod) || message.member.roles.cache.has(IDs.role.moderator))))){
        Ehelp = new Discord.MessageEmbed()
          .setTitle('Help - Commands')
          .setAuthor(`${this.client.user.username}`, BotAvatar)
          .setDescription(`If you need help with a specific you can use \`${prefix}help [command]\`.\nExample: \`${prefix}help veg\``)
          .addField(':blue_book: General', `\`${prefix}profile\`\n\`${prefix}hug\`\n\`${prefix}rank\``, true)
          .addField(':wrench: Testing', `\`${prefix}ping\``, true)
          .addField(':wrench: Applications', `\`${prefix}apply\`\n\`${prefix}unapply\`\n\`${prefix}getAllApplications\`\n\`${prefix}roleGiven\``, true)
          .addField(':wrench: Info', `\`${prefix}count\`\n\`${prefix}help\`\n\`${prefix}countStageUsers\``, true)
          .addField(':wrench: Outreach', `\`${prefix}addStats\`\n\`${prefix}countStat\`\n\`${prefix}debaterPing\`\n\`${prefix}makeGroup\`\n\`${prefix}endGroup\`\n\`${prefix}deleteStats\`\n\`${prefix}updateStats\``, true)
          .addField(':moneybag: Economy', `\`${prefix}balance\`\n\`${prefix}leaderboard\`\n\`${prefix}daily\`\n\`${prefix}pay\`\n\`${prefix}reward\``, true)
          .addField(':book: Stage Bookings', `\`${prefix}book\`\n\`${prefix}remove\`\n\`${prefix}mybookings\``, true)
          .addField(':calendar: Stage Schedule', `\`${prefix}schedule\`\n\`${prefix}statsschedule\``, true)
          .addField(':watch: Time Zone', `\`${prefix}convert\``, true)
          .addField(':wrench: RestrictCommands', `\`${prefix}ban\`\n\`${prefix}kick\`\n\`${prefix}renameUser\`\n\`${prefix}rest\`\n\`${prefix}rest2\`\n\`${prefix}rest3\`\n\`${prefix}rest4\`\n\`${prefix}rest4\`\n\`${prefix}restrictAVegan\`\n\`${prefix}softmute\`\n\`${prefix}unban\`\n\`${prefix}unrest\`\n\`${prefix}unrestAVegan\`\n\`${prefix}unsoftmute\``, true)
          .addField(':wrench: Channel Management', `\`${prefix}anon\`\n\`${prefix}clear\`\n\`${prefix}mvall\``, true)
          .addField(':wrench: Verify', `\`${prefix}convinced\`\n\`${prefix}unconvinced\`\n\`${prefix}notvegan\`\n\`${prefix}vegan\`\n\`${prefix}sus\`\n\`${prefix}unsus\`\n\`${prefix}toverify\`\n\`${prefix}verify\`\n\`${prefix}trust\`\n\`${prefix}untrust\`\n\`${prefix}veg\`\n\`${prefix}unveg\`\n\`${prefix}verifyme\``, true);

      } else if (args.length <= 0 || (this.client.commands.get(args[0].toLowerCase()) === undefined && !this.client.aliases.has(args[0].toString().toLowerCase()))) {
        Ehelp = new Discord.MessageEmbed()
          .setTitle('Help - Commands')
          .setAuthor(`${this.client.user.username}`, BotAvatar)
          .setDescription(`If you need help with a specific you can use \`${prefix}help [command]\`.\nExample: \`${prefix}help ping\``)
          .addField(':blue_book: General', `\`${prefix}profile\`\n\`${prefix}hug\`\n\`${prefix}rank\``, true)
          .addField(':wrench: Testing', `\`${prefix}ping\``, true)
          .addField(':wrench: Applications', `\`${prefix}apply\`\n\`${prefix}unapply\`\n`, true)
          .addField(':wrench: Info', `\`${prefix}count\`\n\`${prefix}help\``, true)
          .addField(':wrench: Outreach', `\`${prefix}addStats\`\n\`${prefix}countStat\`\n\`${prefix}debaterPing\`\n\`${prefix}makeGroup\`\n\`${prefix}endGroup\`\n`, true)
          .addField(':moneybag: Economy', `\`${prefix}balance\`\n\`${prefix}leaderboard\`\n\`${prefix}daily\`\n\`${prefix}pay\``, true)
          .addField(':book: Stage Bookings', `\`${prefix}book\`\n\`${prefix}remove\`\n\`${prefix}mybookings\`\n\`${prefix}convert\``, true)
          .addField(':calendar: Stage Schedule', `\`${prefix}schedule\`\n\`${prefix}statsschedule\``, true);
      } else {
        if(this.client.aliases.has(args[0].toString().toLowerCase())){
          let command = await this.client.commands.get(this.client.aliases.get(args[0].toString().toLowerCase()));
          let allStaffWithAccess = await this.getAllRolesRequired(command);
          console.log(allStaffWithAccess);
          if(allStaffWithAccess.includes('User')){
            allStaffWithAccess = ['All'];
          }
          if(args[0].toString() === 'mm'){
            allStaffWithAccess = ['Patron'];
          }
          Ehelp = new Discord.MessageEmbed()
          .setTitle(`Help - ${prefix}${args[0]}`)
          .setAuthor(`${this.client.user.username}`, BotAvatar)
          .setDescription(`${this.client.commands.get(this.client.aliases.get(args[0].toString().toLowerCase())).help.description}`)
          .addField("Usage:", `${this.client.commands.get(this.client.aliases.get(args[0].toString().toLowerCase())).help.usage}`)
          .addField("Available to roles:", `${allStaffWithAccess.join("\n")}`)
          .addField("Aliases:", `${this.client.commands.get(this.client.aliases.get(args[0].toString().toLowerCase())).help.name}`);
        }else {
          let command = await this.client.commands.get(args[0].toString().toLowerCase());
          let aliases = command.conf.aliases.join(" ");
          let allStaffWithAccess = await this.getAllRolesRequired(command);
          console.log(allStaffWithAccess);
          if(allStaffWithAccess.includes('User')){
            allStaffWithAccess = ['All'];
          }
          if(args[0].toString() === 'moveme'){
            allStaffWithAccess = ['Patron'];
          }
          Ehelp = new Discord.MessageEmbed()
          .setTitle(`Help - ${prefix}${args[0]}`)
          .setAuthor(`${this.client.user.username}`, BotAvatar)
          .setDescription(`${this.client.commands.get(args[0].toLowerCase()).help.description}`)
          .addField("Usage:", `${this.client.commands.get(args[0].toLowerCase()).help.usage}`)
          .addField("Available to roles:", `${allStaffWithAccess.join("\n")}`);
          if(aliases!== ""){
            Ehelp.addField("Aliases:", `${this.client.commands.get(args[0].toString().toLowerCase()).conf.aliases.join(" ")}`);
          }
        }
      }
      Ehelp.setTimestamp()
        .setColor('#5e0cb0')
        .setFooter('I hope this was helpful!');
      message.channel.send({ embeds: [Ehelp] });
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};