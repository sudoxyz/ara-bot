const WeebCommand = require('@base/WeebCommand');
const { Booking, ROLES } = require('@models/booking');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const defaultError = require('@utils/defaultError');
const parseTimeSlot = require('@utils/parseTimeSlot');
const optional = require('@utils/optional');
const getUserFromMention = require('@utils/getUser.js');

const ALL = ['all', 'a'];

module.exports = class book extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'remove',
      aliases: ['remove', 'r'],
      permLevel: 'Stage Host',
      description: 'Remove a booking in **GMT / UTC Time**.'
        + `\n\nCommand Examples`
        + `\n**${client.config.prefix}r all** (Remove all bookings)`
        + `\n**${client.config.prefix}r 13 30** (Remove the coming 30th 13:00 booking)`
        + `\n**${client.config.prefix}r 1pm 30 stats** (Remove the Stats Tracking booking for the coming 30th 13:00)`
        + `\n**${client.config.prefix}r all @Member** (Mods Only)`,
      category: 'Booking',
      usage: `**[Day.Hour]** [Role]`,
    });
  }

  async run(message, args) {

    let isMemberFromArgs = false;
    let member;
    for(let arg of args){
      let user = await getUserFromMention(message, arg);
      if(user){
        member = user;
      }
    }
    
    if (!member || message.author.bot) {
      member = message.author;
    } else {
      isMemberFromArgs = true;
    }

    const parseRole = (role) => {
      role = role.toLowerCase();
      if (Object.values(ROLES).includes(role)) {
        return role;
      }
      return false;
    };
    /** 
     * Function Start
     */
    try {
      var [time, day, role] = args;
      let timeSlot;
      let deleteParams = { userId: member.id };
      if (time == undefined) {
        return message.reply(
          `Please provide a the booking **GMT/UTC** time slot to remove.`
          + `\nOr provide **'all'** to remove all your bookings.`
        );
      }
      /** Check if you need to specify the timeslot or role when deleting the bookings */
      if (!ALL.includes(time.toLowerCase())) {
        
        let timeCodeMatch = [];
        if (typeof time === 'string') {
          timeCodeMatch = time.match(/[tT]([0-9]+)/g);
          console.log(timeCodeMatch);
        }

        if (timeCodeMatch.length) {
          let code = Number(timeCodeMatch[0].slice(1));
          let utcHour = code % 24;
          let utcDayAhead = Math.floor(code / 24);
          timeSlot = moment.utc().hour(utcHour-1).add(utcDayAhead, 'days').startOf('hour');
        } else {
          timeSlot = parseTimeSlot(time, day);
        }

        if (!timeSlot) {
          let minTimeSlot = moment.utc().startOf('hour');
          let example = minTimeSlot.add(1, 'hour').startOf('hour');
          let reply = (!time && !day)
            ? `Please provide a **GMT/UTC** time slot to remove or 'all'`
            : `Please provide a valid time. Provided Hour: **${time ? time : ''}** ${day ? `Day: **${day}**` : ''}`;

          return message.reply(
            `\n${reply}`
            + `\nUse **${this.client.config.prefix}convert** if you need to find out what your time is in **UTC Time**`
            + `\nE.g. **${this.client.config.prefix}r ${example.format('H D')}** (Remove booking for **${example.format('Do MMM H:mm')} UTC** - <t:${example.unix()}:F> in your time)`
            + `\n**${this.client.config.prefix}r a** (Remove all bookings)`
          );
        } else {
          deleteParams.timeSlot = timeSlot;
        }

        role = optional(parseRole, ROLES.SPEAKER)(role);
        if (role === false) {
          return message.reply(`Could not recognise role ${role}. Allowed roles: ${Object.values(ROLES).join(', ')}`);
        } else {
          deleteParams.role = role;
        }
      }
      console.log(deleteParams);
      let result = ALL.includes(time.toLowerCase())
        ? await Booking.deleteMany(deleteParams) 
        : await Booking.deleteOne(deleteParams);

      /**
       * Booking remove embed 
       */
      let title;
      if (result.deletedCount) {
        if (ALL.includes(time.toLowerCase())) {
          title = isMemberFromArgs ? `All @${member.username}'s bookings are cleared! 🐙` : `All your bookings are cleared! 🐙`;
        } else {
          title = isMemberFromArgs ? `@${member.username}'s booking is cleared! 🐙` : `Booking cleared! 🐙`;
        }
      } else {
        if (ALL.includes(time.toLowerCase())) {
          return message.reply(`Huh... looks like there were no bookings I could remove.`);
        } else {
          return message.reply(`Huh... I can't find that booking.`);
        }
      }

      let fields = [];
      if (!ALL.includes(time.toLowerCase())) {
        fields.push({ name: 'Time Slot', value: `<t:${timeSlot.unix()}:F>` });
        fields.push({ name: 'Role', value: role.replace(/^\w/g, (c) => c.toUpperCase()) });
      }

      const removeBookingConfirmationEmbed = new MessageEmbed();
      removeBookingConfirmationEmbed
        .setColor('#01c114')
        .setTitle(title)
        .addFields(fields);
      return message.reply({embeds:[removeBookingConfirmationEmbed]});

    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};