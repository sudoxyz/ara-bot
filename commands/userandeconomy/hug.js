const WeebCommand = require("@base/WeebCommand.js");
const Discord = require('discord.js');
const defaultError = require('@utils/defaultError');
const getUserFromMention = require('@utils/getUser.js');

module.exports = class hug extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "hug",
      description: `Sends a hug to a user\n
                         Available for everyone`,
      usage: `${client.config.prefix}hug @mention`,
      aliases: []
    });
  } async run(message, args) {
    try {
      let filePath = '/app/media/';
      if (process.env.CONFIG === 'local') {
        filePath = './media/';
      }
      const list = ['doghug.gif', 'hug.gif', 'catHug.gif', 'pandaHug.gif', 'cowHug.gif',
                    'collieHug.gif', 'otter-sleep.gif', 'pigHug.gif', 
                    'sheephug.gif', 'tigerHug.gif'];
      let i = Math.floor(Math.random() * list.length);
      let user;
      if(args[0]){
        user = await getUserFromMention(message, args[0]);
      }
      if (!user) {
        let u = await message.guild.members.fetch(message.author.id);
        if(u.nickname !== null){
          message.channel.send({ embeds: [new Discord.MessageEmbed().setTitle(`${u.nickname} is sending everyone a hug!`)], files: [filePath + list[i]] });
        }else {
          message.channel.send({ embeds: [new Discord.MessageEmbed().setTitle(`${message.author.username} is sending everyone a hug!`)], files: [filePath + list[i]] });
        }
      } else {
        if(user.nickname !== null){
          message.channel.send({ embeds: [new Discord.MessageEmbed().setTitle(`${message.author.username} is sending ${user.nickname} a hug!`)], files: [filePath + list[i]] });
        }else {
          message.channel.send({ embeds: [new Discord.MessageEmbed().setTitle(`${message.author.username} is sending ${user.user.username} a hug!`)], files: [filePath + list[i]] });
        }
      }
      try {
        await message.channel.messages.fetch(message.id)
          .then(message => message.delete()).catch(console.error); //it fetched the message - good
      } catch (error) {
        defaultError(error, message, this.client);
        //the message no longer exists and will be ignored
      }
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};