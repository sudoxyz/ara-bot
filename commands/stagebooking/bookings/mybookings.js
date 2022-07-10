const WeebCommand = require('@base/WeebCommand');
const { Booking } = require('@models/booking');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const defaultError = require('@utils/defaultError');

module.exports = class book extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'mybookings',
      permLevel: 'Stage Host',
      aliases: ['mybookings', 'mb'],
      description: `Display all of your bookings.`,
      category: 'Booking',
    });
  }

  buildMemberBookingsTable = async (member) => {
    const startTime = moment.utc().startOf('hour');
    let bookings = await Booking.find({ timeSlot: { $gte: startTime }, userId: member.id });
    bookings = bookings.sort((b1, b2) => {
      return b1.timeSlot > b2.timeSlot ? 1 : -1;
    });
    let fields = bookings.length
      ? [{
        name: `Time Slot`,
        value: '------------------------------',
        inline: true
      },
      {
        name: `Role`,
        value: '------------------------------',
        inline: true
      },
      {
        name: `|`,
        value: '|',
        inline: true
      }]
      : [];
    let earliestBooking = null;
    if (!bookings.length == 0) {
      earliestBooking = bookings.reduce((b1, b2) => {
        return b1.timeSlot < b2.timeSlot ? b1 : b2;
      });

      bookings.forEach(booking => {
        fields.push(...[{
          'name': `<t:${moment(booking.timeSlot).unix()}:f>`,
          'value': `------------------------------`,
          inline: true
        },
        {
          'name': `${booking.role.replace(/^\w/g, (c) => c.toUpperCase())}`,
          'value': `------------------------------`,
          inline: true,
        },
        {
          'name': `|`,
          'value': `|`,
          inline: true,
        }]);
      });
    }

    let title;
    if (earliestBooking) {
      if (moment() < earliestBooking.timeSlot) {
        title = `Live ${moment(earliestBooking.timeSlot).fromNow()}`;
      } else {
        title = `Live now 🔴`;
      }
    } else {
      title = `You have no bookigs.`;
    }

    let embed = new MessageEmbed();

    if (bookings.length) {
      embed
        .setTitle(title)
        .setDescription(`------------------------------`)
        .addFields(fields)
        .setColor('#7c40ff');
    } else {
      embed
        .setTitle(title)
        .setColor('#7c40ff');
    }
    return embed;
  }

  async run(message) {
    try {
      let reply = await this.buildMemberBookingsTable(message.author);
      return message.reply({embeds:[reply]});
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};