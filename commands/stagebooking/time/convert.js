const WeebCommand = require('@base/WeebCommand');
const moment = require('moment');
const getTimezone = require('@utils/getTimeZone');
const defaultError = require('@utils/defaultError');
const { MessageEmbed } = require('discord.js');

module.exports = class book extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'convert',
      aliases: ['timezone', 'tz'],
      description: 'Convert time from one time zone into another.'
        + '\nYou can find your time zone abbreviation in the link below.'
        + '\n**Your Time Zone**: https://my-timezone.herokuapp.com/'
        + `\n\nCommand Examples`
        + `\n**${client.config.prefix}tz 13:00 est** (Converts 13:00 EST to UTC)`
        + `\n**${client.config.prefix}tz 2pm 14 est bst** (Converts the 14th 2pm EST to BST)`,
      category: 'Time',
      // expectedArgs: `<Time eg 13:30 or 27.13:30> <Time zone to convert from e.g. EST> [Time zone to convert to, default: UTC]`,
      usage: `${client.config.prefix}tz **[Time] [Time Zone From]** [Time Zone To (default UTC)]`
    });
  }

  getTime = (time, timezoneFrom) => {
    let timeslot;
    let timeFormat = 'HH:mmA';
    try {
      let matches = time.match(/\./);
      if (matches) {
        timeFormat = 'D.h:mmA';
      }
      timeslot = moment.utc(time, timeFormat);
      let timeslotNextMonth = moment.utc(time, timeFormat).add(1, 'month');
      let now = moment();
      /** Choose the date that is closest to the current date */
      if (Math.abs(now.diff(timeslotNextMonth)) < Math.abs(now.diff(timeslot))) {
        timeslot = timeslotNextMonth;
      }
      if (!timeslot.isValid()) {
        return null;
      }
      if (timezoneFrom) {
        timeslot.utcOffset(timezoneFrom, true);
      }
      return timeslot;
    } catch {
      return false;
    }

  }

  async run(message, args) {
    let [time, timezoneFrom, timezoneTo] = args;

    try {
      if (!time) {
        return message.reply(`Please prove a time and timezone e.g. **${this.client.config.prefix}${this.help.name} 1pm EST**`);
      }
      if (!timezoneFrom) {
        return message.reply(`Please provide a timezone to convert from e.g. **${this.client.config.prefix}${this.help.name} 13 EST**`);
      }

      let timezoneFromParsed;
      if (!(timezoneFromParsed = getTimezone(timezoneFrom))) {
        if (timezoneFrom) {
          return message.reply(
            `**${timezoneFrom}** is not a valid or recognised time zone.`
            + `\nPlease provide a valid timezone e.g. EST`
            + `\ne.g. **${this.client.config.prefix}${this.help.name} 13:00 bst**`);
        }
        return message.reply(`Please provide a valid timezone e.g. EST`);
      }

      let timezoneToParsed;
      if (timezoneTo && !(timezoneToParsed = getTimezone(timezoneTo))) {
        return message.reply(`Please provide a valid timezone e.g. EST`);
      } else if (!timezoneTo) {
        timezoneToParsed = getTimezone('UTC');
      }

      let timeParsed;
      if (!(timeParsed = this.getTime(time, timezoneFromParsed.utcOffset))) {
        if (time) {
          return message.reply(
            `**${time}** is not a valid time.`
            + `\nCommand Examples`
            + `\n**${this.client.config.prefix}tz 13:00 est** (Converts 13:00 EST to UTC)`
            + `\n**${this.client.config.prefix}tz 2pm 14 est bst** (Converts the 14th 2pm EST to BST)`);
        }
        return message.reply(`Please provide a valid time`
          + `\nCommand Examples`
          + `\n**${this.client.config.prefix}tz 13:00 est** (Converts 13:00 EST to UTC)`
          + `\n**${this.client.config.prefix}tz 2pm 14 est bst** (Converts the 14th 2pm EST to BST)`);
      }
      let convertedTime = timeParsed.clone().utcOffset(timezoneToParsed.utcOffset);

      let embed = new MessageEmbed()
        .setColor('#058ED9')
        .addFields([
          {
            name: `Converted time (${timezoneToParsed.timezoneName})`,
            value: `${convertedTime.format('dddd, D MMMM YYYY **HH:mm**')}`
          },
          {
            name: `Original time (${timezoneFromParsed.timezoneName})`,
            value: `${timeParsed.format('dddd, D MMMM YYYY **HH:mm**')}`
          }
        ]);

      return message.reply({embeds:[embed]});
    } catch (error) {
      defaultError(error, message, this.client);
    }

  }
};