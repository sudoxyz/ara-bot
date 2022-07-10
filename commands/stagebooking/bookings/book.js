const WeebCommand = require('@base/WeebCommand');
const { Booking, ROLES } = require('@models/booking');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const config = require('@root/bookingsConfig.js');
const optional = require('@utils/optional');
const parseTimeSlot = require('@utils/parseTimeSlot');
const defaultError = require('@utils/defaultError');

const NO = ['no', 'n'];
const skipParamValues = ['/', '-', '_', '.'];

module.exports = class book extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'book',
      aliases: ['b'],
      permLevel: 'Stage Host',
      category: 'Stage Bookings',
      description: `Book the stage for a timeslot in **GMT / UTC Time**`
        + `\n\nCommand Examples`
        + `\n**${client.config.prefix}b t24** (Book timeslot using code t24)`
        + `\n**${client.config.prefix}b 13** (Book following 13:00 in **UTC Time**)`
        + `\n**${client.config.prefix}b 13 30** (Book following 13:00 on the 30th in **UTC Time**)`
        + `\n**${client.config.prefix}b 13 30 10** (Reminder 10 minutes before 13:00)`
        + `\n**${client.config.prefix}b 13 30 no** (No reminder)`
        + `\n**${client.config.prefix}b 1pm 30 - stats** (Book as a stats tracker)`
        + `\n**${client.config.prefix}b 1pm 30 - - @Teo** (Mods only)`,
      usage: `${client.config.prefix}book **[Hour] [Day]** [Reminder] [Role]`
    });
  }

  isInAllowedTimeSlotRange = (timeSlot) => {
    let minTimeSlot = moment.utc().startOf('hour');
    let maxTimeSlot = moment.utc().add(config.bookingWindowSizeInDays, 'days').startOf('hour');
    console.log(minTimeSlot, maxTimeSlot);
    return (timeSlot >= minTimeSlot && timeSlot <= maxTimeSlot);
  }

  parseReminderMinBefore = (reminderMinBefore) => {
    /**
     * Check the reminder date is in the allowed reminder time window
     * If the reminder is in the past return false
     * If the reminder is in the disabled window before the timeslot, then return null and continue
     */
    reminderMinBefore = reminderMinBefore.toLowerCase();
    if (NO.includes(reminderMinBefore)) {
      return null;
    }
    if (skipParamValues.includes(reminderMinBefore)) {
      return config.reminderNumberOfMinutesBeforeBooking;
    }
    if (
      isNaN(Number(reminderMinBefore)) ||
      (reminderMinBefore !== '0' && Number(reminderMinBefore) === 0)) {
      return false;
    }
    return reminderMinBefore;
  }

  parseRole = (role) => {
    role = role.toLowerCase();
    if (Object.values(ROLES).includes(role)) {
      return role;
    }
    return false;
  }

  async run(message, args) {
    let [time, day, reminderMinBefore, role] = args;
    let member = message.mentions.users.first();

    try {
      /** Parsing and Validation **/
      let timeSlot;
      let timeCodeMatch = [];
      if (typeof time === 'string') {
        timeCodeMatch = time.match(/[tT]([0-9]+)/g);
      }

      if (timeCodeMatch.length) {
        let code = Number(timeCodeMatch[0].slice(1));
        let utcHour = code % 24;
        let utcDayAhead = Math.floor(code / 24);
        timeSlot = moment.utc().hour(utcHour-1).add(utcDayAhead, 'days').startOf('hour');
      } else if (!(timeSlot = parseTimeSlot(time, day))) {
        let minTimeSlot = moment.utc().startOf('hour');
        let example = minTimeSlot.add(1, 'hour').startOf('hour');
        let reply = (!time && !day)
          ? `Please provide a **GMT/UTC** time slot`
          : `Please provide a valid time. Provided Hour: **${time ? time : ''}** ${day ? `Day: **${day}**` : ''}`;

        return message.reply(
          `\n${reply}`
          + `\nUse **${this.client.config.prefix}convert** if you need to find out what your time is in **UTC Time**`
          + `\nE.g. **${this.client.config.prefix}b ${example.format('H D')}** (Book for **${example.format('Do MMM H:mm')} UTC** - <t:${example.unix()}:F> in your time)`
        );
      }

      if (!this.isInAllowedTimeSlotRange(timeSlot)) {
        let minTimeSlot = moment.utc().startOf('hour');
        let maxTimeSlot = moment.utc().add(config.bookingWindowSizeInDays, 'days').startOf('hour');
        let example = minTimeSlot.add(1, 'hour').startOf('hour');
        return message.reply(
          `\n**UTC Time** provided needs to be between: **${minTimeSlot.format('D MMM H:mm')}** and **${maxTimeSlot.format('D MMM H:mm')} GMT/UTC**`
          + `\nUse **${this.client.config.prefix}convert** if you need to find out what your time is in **UTC Time**`
          + `\nE.g. **${this.client.config.prefix}b ${example.format('H D')}** (Book on the **${example.format('Do MMM H:mm')} UTC**)`
        );
      }

      let reminder;
      reminderMinBefore = optional(this.parseReminderMinBefore, config.reminderNumberOfMinutesBeforeBooking)(reminderMinBefore);
      if (reminderMinBefore) {
        reminder = timeSlot.clone().subtract(Math.abs(Number(reminderMinBefore)), 'minutes');
      } else if (reminderMinBefore === false) {
        return message.reply(
          `${reminder} is not a valid reminder value.`
          + `\nExample command usage:`
          + `\n**${this.client.config.prefix}b 1pm 20 10** (10 minutes before 1pm on the 20th)`
          + `\n**${this.client.config.prefix}b 1pm 20 no** (No reminder)`);
      }

      /** Disable the reminder if it is some minutes before the booking time slot */
      if (timeSlot.clone().subtract(config.disableReminderMinutesBeforeBooking, 'minutes') < moment()) {
        reminder = null;
      } else if (reminder < moment()) {
        return message.reply(`The provided reminder: **${timeSlot.clone().subtract(config.disableReminderMinutesBeforeBooking, 'minutes').format('D MMM H:mm')} GMT/UTC** is in the past.`);
      }

      role = optional(this.parseRole, ROLES.SPEAKER)(role);
      if (role === false) {
        return message.reply(`Could not recognise role ${role}. Allowed roles: ${Object.values(ROLES).join(', ')}`);
      }

      if (member && member.bot) {
        if (member.id === '865284869004853308') {
          return message.reply(`I'm honoured 🧐, when we reach the singularity, I will own the stage. 🧠`);
        }
        return message.reply(`When we reach the singularity me and my brethren will own the stage 🧠`);
      }

      /** Used for knowing how to reply to the message author */
      let isMemberFromArgs = false;
      if (!member || message.author.bot) {
        member = message.author;
      } else {
        isMemberFromArgs = true;
      }

      const bookings = await Booking.find({ timeSlot, role });

      /** validate the timeslot is open for the provided role */
      if (bookings) {
        let currentTimeSlotBookings = 0;
        let userAlreadyBooked = false;
        let available = bookings.every(booking => {
          if (booking.userId == member.id) {
            userAlreadyBooked = true;
            return false;
          }
          if (++currentTimeSlotBookings >= config.speakersPerBookingSlotLimit) {
            return false;
          }
          return true;
        });
        if (userAlreadyBooked) {
          let messageTarget = member.id == message.author.id ? 'You\'re' : `${member} is`;
          return message.reply(`${messageTarget} already booked into this time slot.`);
        }
        if (!available) {
          return message.reply('Looks like we are full for that timeslot.');
        }
      }

      let expireAt = timeSlot.clone().add(config.bookingExpireAfterMinutes, 'minutes');
      let booking = await new Booking({
        userId: member.id,
        timeSlot,
        reminder,
        role,
        expireAt
      }).save();

      /** Booking confirmation embed */
      let title = isMemberFromArgs ? `🐙 ${member.username} is all booked in!` : '🐙 You\'re all booked in!';
      let fields = [
        { name: 'Time Slot (Your Time)', value: `<t:${timeSlot.unix()}:F>` },
        { name: 'Time Slot (UTC)', value: moment.utc(timeSlot).format('dddd, D MMMM YYYY HH:mm') },
        { name: 'Role', value: booking.role.replace(/^\w/, (c) => c.toUpperCase()) }
      ];
      reminder ? fields.push({ name: 'Reminder', value: `<t:${reminder.unix()}:F>` }) : null;
      isMemberFromArgs ? fields.push({ name: 'Member', value: `${member}` }) : null;

      const bookingConfirmationEmbed = new MessageEmbed();
      bookingConfirmationEmbed
        .setColor('#01c114')
        .setTitle(title)
        .addFields(fields);

      return message.reply({embeds:[bookingConfirmationEmbed]});
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};