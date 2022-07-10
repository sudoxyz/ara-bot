var {IDs} = require('@utils/ids.js');
const { MessageActionRow } = require('discord.js');

/**
 * Handle command errors
 * 
 * @param { Error } error 
 * @param { Array<string> } message
 * @returns null
 */
module.exports = (error, message) => {

  message.guild.channels.cache.get(IDs.chat.araboterrors).send({
    embeds: [{
      author: {
        name: message.author.username,
        url: message.url,
        iconURL: message.author.displayAvatarURL()
      },
      color: 'GREEN',
      description: `Something went wrong`,
      fields: [
        [{
          name: 'Channel ID',
          value: message.channel.id,
          inline: true
        },],
        {
          name: 'Message ID',
          value: message.id,
        },
        [{
          name: 'StackTrace',
          value: `${error.stack}`,
          inline: true,
        },
        {
          name: 'Link',
          value: `${message.url}`,
          inline: true,
        },
        {
          name: 'Command',
          value: `${message.content}`,
          inline: true,
        },],
      ],
      title: 'ARA Error',
      url: message.url
    }]
  });
  message.reply(`Oops something went wrong, if it happens again please drop a dev a message.`);
};