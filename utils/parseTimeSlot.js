const moment = require('moment');

module.exports = (time, day) => {
  if (typeof day == 'string' && (day.match(/am|pm|:/g) || Number(day) > 24)) {
    let temp = time;
    time = day;
    day = temp;
  }
  try {
    // const format = time.match(/am|pm/g) ? 'h:mmA'
    const format = 'h:mmA';
    let timeSlot = moment.utc(time, format);
    timeSlot.set('date', day);
    timeSlot.startOf('hour');
    let now = moment().subtract(1, 'hour').startOf('hour');
    /** If the date provided is in the past add 1 month */
    if (timeSlot < now) {
      timeSlot.add(1, 'month');
    }
    return timeSlot.isValid() ? timeSlot : false;
  } catch {
    return false;
  }
};