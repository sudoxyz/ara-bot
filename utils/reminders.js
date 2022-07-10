const cron = require('node-cron');
const { Booking } = require('@models/booking');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');

module.exports = (client) => {

  const sendReminder = (booking) => {
    let minutesLeft = moment.utc(booking.timeSlot).diff(moment.utc(booking.reminder), 'minutes');
    let title = `${minutesLeft} min until the stage opens! 🐙`;
    const bookingConfirmationEmbed = new MessageEmbed();
    bookingConfirmationEmbed
      .setColor('#01c114')
      .setTitle(title)
      .setDescription(`<t:${moment(booking.timeSlot).unix()}:F>`);

    let user = client.users.cache.get(booking.userId);
    if (user) {
      user.send({ embeds: [bookingConfirmationEmbed] });
      console.log(`Reminder sent to ${user.username}`);
    }
  };

  const findReminders = async () => {
    try {
      let reminder = moment.utc().startOf('minute');
      const bookings = await Booking.find({ reminder });

      if (bookings) {
        bookings.forEach(async (booking) => {
          let prevConsequtiveTimeslot = moment(booking.timeSlot).subtract(1, 'hour').startOf('hour');
          let prevConsequtiveBooking = await Booking.find({ timeslot: prevConsequtiveTimeslot, role: booking.role });
          if (prevConsequtiveBooking.length == 0) {
            sendReminder(booking);
          }
        });
      }

      // nextConsequtiveTimeslot = moment(booking.timeslot).add(1, 'hour').startOf('hour')
      // nextConsequtiveBooking = await Booking.find({ timeslot: nextConsequtiveTimeslot, role: ROLES.SPEAKER })
      // if (nextConsequtiveBooking.length !== 0) {
      //   sendReminder(booking)
      // }
    } catch (e) {
      console.log('reminder', e);
    }
  };

  cron.schedule('* * * * *', findReminders);
};