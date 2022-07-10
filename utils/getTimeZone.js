const timezoneCodes = require('@utils/timezoneCodes');

module.exports = (timezone) => {

  const UTCMatch = /^(?:utc|gmt) ?(\+|-)? ?(\d*)/gi.exec(timezone);
  if (UTCMatch) {
    const offset = UTCMatch[2]
      ? parseInt(UTCMatch[2]) * (UTCMatch[1] === '-' ? -1 : 1)
      : 0;
    if (offset > 14 || offset < -12) return;
    let timezoneName = offset ? `UTC${offset < 0 ? offset : '+' + offset}` : `UTC`;
    const locationData = {
      timezoneName,
      utcOffset: offset
    };
    return locationData;
  }

  const timezoneCodeName = timezone.replace(/\s*/g, '').toUpperCase();
  const utcOffset = timezoneCodes[timezoneCodeName];
  if (utcOffset !== undefined) {
    const locationData = {
      timezoneName: timezoneCodeName,
      utcOffset: utcOffset,
    };
    return locationData;
  }
  return;
};