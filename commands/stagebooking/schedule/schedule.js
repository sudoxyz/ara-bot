const WeebCommand = require('@base/WeebCommand');
const { Booking, ROLES } = require('@models/booking');
const moment = require('moment');
const config = require('@root/bookingsConfig');
const defaultError = require('@utils/defaultError');
const { MessageEmbed } = require('discord.js');

const lockActionsToAuthor = true;
var pageManager = {};
var bookingTableMessage;
var maxPages = Math.ceil(
  (config.bookingWindowSizeInDays * 24) / config.bookingsTableLength
);

module.exports = class book extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'schedule',
      aliases: ['stages', 's'],
      permLevel: 'Vegan',
      description:
        'Display the stage schedule.' +
        '\n\nCommand Examples' +
        `\n**${client.config.prefix}s**` +
        `\n**${client.config.prefix}s @Member (Show the members bookings)**`,
      category: 'Schedule',
      usage: `[Optional: @Member]`,
    });
  }

  /** Returns if the page was changed */
  nextPage = (messageId) => {
    if (messageId && messageId in pageManager) {
      const currentPage = pageManager[messageId];
      pageManager[messageId] = Math.min(++pageManager[messageId], maxPages);
      return currentPage !== pageManager[messageId];
    }
    return false;
  };

  prevPage = (messageId) => {
    if (messageId && messageId in pageManager) {
      const currentPage = pageManager[messageId];
      pageManager[messageId] = Math.max(1, --pageManager[messageId]);
      return currentPage !== pageManager[messageId];
    }
    return false;
  };

  currentPage = (messageId) => {
    if (messageId && messageId in pageManager) {
      return pageManager[messageId];
    }
    return 1;
  };

  /**
   * Returns an array of moment js times of each timeslot inbetween two times
   */
  getTimeSlots = (messageId = null) => {
    let page = this.currentPage(messageId);
    const startTimeSlotDayCount = config.bookingsTableLength * (page - 1);
    const endTimeSlotDayCount = Math.min(
      config.bookingsTableLength * page,
      config.bookingWindowSizeInDays * 24
    );
    const startTime = moment
      .utc()
      .add(startTimeSlotDayCount, 'hour')
      .startOf('hour');
    const endTime = moment
      .utc()
      .add(endTimeSlotDayCount, 'hour')
      .startOf('hour');
    const timeSlots = [];

    let timeSlot = startTime.clone();
    while (timeSlot < endTime) {
      timeSlots.push(timeSlot.clone());
      timeSlot = timeSlot.add(1, 'hour');
    }
    return [timeSlots, startTime, endTime];
  };

  /**
   * Finds the bookings based on the timeslots, and returns the ascii table object
   */
  buildBookingsTableEmbed = async (messageId) => {
    /** Get bookings for the displayed timeslots */
    let speakers = [];
    let fields = [
      {
        name: `Time slots & Speakers`,
        value: '------------------------------',
      },
    ];

    let [timeSlots, startTime, endTime] = this.getTimeSlots(messageId);
    const bookings = await Booking.find({
      timeSlot: { $gte: startTime, $lte: endTime },
      $or: [{ stage: 1 }, { stage: null }],
      role: ROLES.SPEAKER,
    });

    timeSlots.forEach((time, i) => {
      let timeSlotBookings = [];
      if (Array.isArray(bookings)) {
        timeSlotBookings = bookings.filter((booking) => {
          return moment.utc(booking.timeSlot).isSame(time);
        });
      }

      speakers = timeSlotBookings.map((booking) => {
        let user = this.client.users.cache.get(booking.userId);
        return user ? user : booking.userId;
      });

      let [speaker1, speaker2] = speakers.map((speaker) => {
        return speaker?.username ? `@${speaker.username}` : `ID: ${speaker}`;
      });
      
      const daysAhead = time.clone().startOf('day').diff(moment.utc().startOf('day'), 'days');
      fields.push(
        ...[
          {
            name: `${
              config.useCode
                ? `T${(time.hour()+1) + 24 * daysAhead}\n`
                : ``
            }<t:${time.unix()}:f>`,
            value: '------------------------------',
            inline: true,
          },
          {
            name: speaker1 ? `-\n${speaker1}` : '-\n-',
            value: '- - - - - - - - - - - - - - - - - - -',
            inline: true,
          },
          {
            name: speaker2 ? `-\n${speaker2}` : '-\n-',
            value: '- - - - - - - - - - - - - - - - - - -',
            inline: true,
          },
        ]
      );
    });

    let title = `Stage 1 Bookings`;

    return new MessageEmbed()
      .setTitle(title)
      .addFields(fields)
      .setFooter(`Page ${this.currentPage(messageId)}/${maxPages}`)
      .setColor('#6d2aff');
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  buildMemberBookingsTable = async (member, messageId = null) => {
    let [timeSlots, startTime, endTime] = this.getTimeSlots(messageId);

    let bookings = await Booking.find({
      timeSlot: { $gte: startTime },
      userId: member.id,
    });
    bookings = bookings.sort((b1, b2) => {
      return b1.timeSlot > b2.timeSlot ? 1 : -1;
    });
    let fields = bookings.length
      ? [
          {
            name: `Time Slot`,
            value: '------------------------------',
            inline: true,
          },
          {
            name: `Role`,
            value: '------------------------------',
            inline: true,
          },
          {
            name: `|`,
            value: '|',
            inline: true,
          },
        ]
      : [];

    let earliestBooking = null;
    if (!bookings.length == 0) {
      earliestBooking = bookings[0];

      bookings.forEach((booking) => {
        fields.push(
          ...[
            {
              name: `<t:${moment(booking.timeSlot).unix()}:f>`,
              value: `------------------------------`,
              inline: true,
            },
            {
              name: `${this.capitalizeFirstLetter(booking.role)}`,
              value: `------------------------------`,
              inline: true,
            },
            {
              name: `|`,
              value: `|`,
              inline: true,
            },
          ]
        );
      });
    }

    let title;
    if (earliestBooking) {
      if (moment() < earliestBooking.timeSlot) {
        title = `@${member.username} will be live ${moment(
          earliestBooking.timeSlot
        ).fromNow()}`;
      } else {
        title = `@${member.username} is live now 🔴`;
      }
    } else {
      title = `@${member.username} has no bookings.`;
    }

    return new MessageEmbed()
      .setTitle(title)
      .setColor('#E3170A')
      .addFields(fields);
  };

  attachPaginationReaction = async (message, author) => {

    const filter = (reaction, user) => {
      let hasPassed =
        ['⬅️', '➡️'].includes(reaction.emoji.name) &&
        (!lockActionsToAuthor || user.id === author.id);
      if (!hasPassed) {
        reaction.users.remove(user);
      }
      return hasPassed;
    };

    let collector;
    await message.react('⬅️');
    await message.react('➡️').then(() => {
      collector = message.createReactionCollector(filter, {
        time: config.bookingsTableTimeout,
      });
      pageManager[message.id] = 1;
    });

    collector.on('collect', async (reaction, user) => {
      if (user.bot) return;
      let pageChanged = false;
      if (reaction.emoji.name == '➡️') {
        pageChanged = this.nextPage(message.id);
      } else if (reaction.emoji.name == '⬅️') {
        pageChanged = this.prevPage(message.id);
      }
      let table;
      if (pageChanged) {
        let member = message.mentions.users.first();
        if (member) {
          table = await this.buildMemberBookingsTable(member, message.id);
        } else {
          table = await this.buildBookingsTableEmbed(message.id);
        }
        message.edit({ embeds: [table] });
      }
      reaction.users.remove(user);
    });

    collector.on('end', async () => {
      bookingTableMessage.reactions.removeAll();
      if (message.id in pageManager) delete pageManager[message.id];
    });
  };

  async run(message) {
    /**
     * Function Start
     */
    try {
      let member = message.mentions.users.first();

      let table;
      if (member) {
        table = await this.buildMemberBookingsTable(member);
      } else {
        table = await this.buildBookingsTableEmbed();
      }
      /** Get any bookings that match the time slot */
      bookingTableMessage = await message.channel.send({ embeds: [table] });
      if (!member || !Object.prototype.hasOwnProperty.call(member, 'id')) {
        this.attachPaginationReaction(bookingTableMessage, message.author);
      }
    } catch (error) {
      console.log(error);
      defaultError(error, message, this.client);
    }
  }
};