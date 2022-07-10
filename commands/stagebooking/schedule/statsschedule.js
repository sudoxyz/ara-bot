const WeebCommand = require('@base/WeebCommand');
const { Booking, ROLES } = require('@models/booking');
const moment = require('moment');
const config = require('@root/bookingsConfig');
const defaultError = require('@utils/defaultError');
const { MessageEmbed } = require('discord.js');

const lockActionsToAuthor = true;
var mobileView = true;
var bookingTableMessage;
var page;
var maxPages = Math.ceil(config.bookingWindowSizeInDays * 24 / config.bookingsTableLength);

module.exports = class book extends WeebCommand {
  constructor(client) {
    super(client, {
      permLevel: 'Vegan',
      name: 'statsschedule',
      aliases: ['ss'],
      description: 'Display the stage schedule for stats trackers.'
      + '\n\nCommand Example'
      + `\n**${client.config.prefix}ss**`,
      category: 'Schedule',
    });
  }

  nextPage = () => {
    page = Math.min(++page, maxPages);
    return page;
  }

  prevPage = () => {
    page = Math.max(1, --page);
    return page;
  }

  /**
   * Returns an array of moment js times of each timeslot inbetween two times
   */
  getTimeSlots = () => {
    const startTimeslotDayCount = config.bookingsTableLength * (page - 1);
    const endTimeslotDayCount = Math.min(config.bookingsTableLength * page, config.bookingWindowSizeInDays * 24);
    const startTime = moment.utc().add(startTimeslotDayCount, 'hour').startOf('hour');
    const endTime = moment.utc().add(endTimeslotDayCount, 'hour').startOf('hour');
    const timeSlots = [];

    let timeSlot = startTime.clone();
    while (timeSlot < endTime) {
      timeSlots.push(timeSlot.clone());
      timeSlot = timeSlot.add(1, 'hour');
    }
    return [timeSlots, startTime, endTime];
  }

  /**
   * Finds the bookings based on the timeslots, and returns the ascii table object
   */
  buildBookingsTableEmbed = async () => {
    /** Get bookings for the displayed timeslots */
    let fields = [
      {
        name: `Times & Stats Trackers`,
        value: '------------------------------',
      }
    ];

    let [timeSlots, startTime, endTime] = this.getTimeSlots();
    const bookings = await Booking.find({ timeSlot: { $gte: startTime, $lte: endTime }, role: ROLES.STATS });
    timeSlots.forEach((time, i) => {
      let timeslotBookings = [];
      if (Array.isArray(bookings)) {
        timeslotBookings = bookings.filter(booking => {
          return moment.utc(booking.timeSlot).isSame(time);
        });
      }

      let statsTrackers = timeslotBookings.map(booking => {
        let user = this.client.users.cache.get(booking.userId);
        return user ? user : booking.userId;
      });

      let [statsTracker1, statsTracker2] = statsTrackers.map((statsTracker) => {
        return statsTracker.username ? `@${statsTracker.username}` : `ID: ${statsTracker}`;
      });

      fields.push(...[
        {
          name: `${config.useCode ? `T${i + 1 + ((page - 1) * config.bookingsTableLength)} - ` : ``} <t:${time.unix()}:f>`,
          value: '------------------------------',
          inline: true
        },
        {
          name: statsTracker1 ? statsTracker1 : '-\n-',
          value: '- - - - - - - - - - - - - - - - - - -',
          inline: true
        },
        {
          name: statsTracker2 ? statsTracker2 : '-\n-',
          value: '- - - - - - - - - - - - - - - - - - -',
          inline: true
        }
      ]);
    });

    let title = `Stats Trackers Stage Bookings`;

    return new MessageEmbed()
      .setTitle(title)
      .addFields(fields)
      .setFooter(`Page ${page}/${maxPages}`)
      .setColor('#F26419');
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  attachPaginationReaction = async (message, author) => {
    await message.react('⬅️').then(async () => { await message.react('➡️'); });

    const filter = (reaction, user) => {
      let hasPassed = (['⬅️', '➡️'].includes(reaction.emoji.name) && (!lockActionsToAuthor || user.id === author.id));
      if (!hasPassed) {
        reaction.users.remove(user);
      }
      return hasPassed;
    };

    const collector = message.createReactionCollector(filter, { time: config.bookingsTableTimeout });

    collector.on('collect', async (reaction, user) => {
      let pageChanged = false;
      if (reaction.emoji.name == '➡️') {
        pageChanged = this.nextPage();
      } else if (reaction.emoji.name == '⬅️') {
        pageChanged = this.prevPage();
      }
      let table;
      if (pageChanged) {
        let member = message.mentions.users.first();
        if (member) {
          table = await this.buildMemberBookingsTable(mobileView);
        } else {
          table = await this.buildBookingsTableEmbed(mobileView);
        }
        reaction.users.remove(user);
        message.edit(table);
      }
    });

    collector.on('end', async () => {
      bookingTableMessage.reactions.removeAll();
    });
  }

  async run(message) {
    /** 
     * Function Start
     */
    try {
      page = 1;
      let table = await this.buildBookingsTableEmbed(mobileView);
      /** Get any bookings that match the time slot */
      let bookingTableMessage = await message.channel.send({embeds:[table]});
      this.attachPaginationReaction(bookingTableMessage, message.author);
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};